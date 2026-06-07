// ─────────────────────────────────────────────────────────────────────────────
// Onboarding.tsx — Schermata di benvenuto con login cloud e suggerimenti
// CodeLearn BETA V1.1.1a-1 - The Synch Update
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code2, Trophy, Zap, ChevronRight, Sparkles,
  Cloud, CloudOff, Loader2, UserCheck, UserPlus, Ghost,
  ChevronDown, AlertTriangle, HardDrive,
} from 'lucide-react';
import {
  useApp, isGuestUsername, isLocalUsername, isOfflineUsername,
  resolveUserMode, isGodModeUser, APP_VERSION,
} from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import {
  searchUsersByName, getUserByUsername, generateUniqueUsername,
  type UserSuggestion, isSupabaseConfigured,
} from '../lib/supabase';

// ── Slide intro ───────────────────────────────────────────────────────────────

const slides = [
  {
    icon: Code2, title: 'Impara a Programmare',
    desc: 'Inizia il tuo viaggio nel mondo del coding con lezioni interattive e pratiche.',
    color: 'text-indigo-500', bg: 'bg-indigo-50',
  },
  {
    icon: Zap, title: 'Esercizi Pratici',
    desc: 'Scrivi codice reale nel nostro editor integrato e vedi i risultati istantaneamente.',
    color: 'text-amber-500', bg: 'bg-amber-50',
  },
  {
    icon: Trophy, title: 'Livelli e Badge',
    desc: 'Guadagna XP, sblocca badge e scala la classifica mentre impari.',
    color: 'text-emerald-500', bg: 'bg-emerald-50',
  },
];

// ── Componente ────────────────────────────────────────────────────────────────

export default function Onboarding() {
  const [step, setStep]             = useState(0);
  const { setOnboardingDone, unlockBadge, loginAs } = useApp();
  const { showToast } = useToast();

  const [nameInput, setNameInput]     = useState('');
  const [suggestions, setSuggestions] = useState<UserSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading]     = useState(false);
  const [forceNew, setForceNew]       = useState(false);
  const [newNameSuggestion, setNewNameSuggestion] = useState('');
  const [nameWarning, setNameWarning] = useState('');

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const supabaseOk = isSupabaseConfigured();

  // Modalità rilevata in tempo reale
  const trimmed    = nameInput.trim();
  const mode       = resolveUserMode(trimmed);
  const isGuest    = isGuestUsername(trimmed);
  const isLocal    = isLocalUsername(trimmed);
  const isOffline  = isOfflineUsername(trimmed);

  // ── Suggerimenti in tempo reale ──────────────────────────────────────────

  const fetchSuggestions = useCallback(async (query: string) => {
    if (!supabaseOk || query.length < 2 || isOfflineUsername(query)) {
      setSuggestions([]); setShowDropdown(false); return;
    }
    setIsSearching(true);
    try {
      const results = await searchUsersByName(query);
      setSuggestions(results);
      setShowDropdown(results.length > 0 && !forceNew);
    } catch {
      setSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  }, [supabaseOk, forceNew]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(trimmed), 350);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [trimmed, fetchSuggestions]);

  // ── Nome alternativo per "Non sei tu?" ───────────────────────────────────

  useEffect(() => {
    if (!forceNew || !trimmed || !supabaseOk) return;
    setNewNameSuggestion(''); setNameWarning('');
    generateUniqueUsername(trimmed).then(unique => {
      if (unique !== trimmed) setNewNameSuggestion(unique);
    }).catch(() => {});
  }, [forceNew, trimmed, supabaseOk]);

  // Chiudi dropdown cliccando fuori
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setShowDropdown(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  // ── Handlers ─────────────────────────────────────────────────────────────

  const selectSuggestion = (s: UserSuggestion) => {
    setNameInput(s.username); setShowDropdown(false);
    setForceNew(false); setNameWarning('');
  };

  const handleForceNewNameChange = async (value: string) => {
    setNameInput(value); setNameWarning('');
    if (!value.trim() || !supabaseOk) return;
    try {
      const existing = await getUserByUsername(value.trim());
      if (existing)
        setNameWarning(`"${value.trim()}" è già registrato. Scegli un altro nome.`);
    } catch { /* noop */ }
  };

  // ── Finish ───────────────────────────────────────────────────────────────

  const finish = async () => {
    const finalName = (forceNew && newNameSuggestion ? newNameSuggestion : nameInput).trim();
    if (!finalName) { showToast('Inserisci il tuo nome per continuare!', 'warning'); return; }

    const hour = new Date().getHours();
    if (hour >= 0 && hour < 5) {
      showToast("Badge 'Gufo Notturno' sbloccato! 🦉", 'info');
      unlockBadge('gufo-notturno');
    }
    if (isGodModeUser(finalName)) {
      showToast('Godmode unlocked 🔓', 'success');
    } else if (finalName.toLowerCase().startsWith('piboh')) {
      // Tentativo con grafia sbagliata (es. "piboh" minuscolo puro senza suffisso valido)
      showToast('Hai provato i poteri del creatore... ma non sei tu! 👁️', 'warning');
      unlockBadge('furbetto');
    }

    setIsLoading(true);
    try {
      await loginAs(finalName, forceNew);
      setOnboardingDone(true);

      const m = resolveUserMode(finalName);
      if (m === 'guest') {
        showToast('Modalità Ospite attivata. I progressi verranno cancellati alla chiusura. 👻', 'info');
      } else if (m === 'local') {
        showToast('Modalità Locale attivata. Progressi salvati sul dispositivo. 💾', 'info');
      } else if (supabaseOk) {
        showToast(`Bentornato/a, ${finalName}! ☁️ Progressi sincronizzati.`, 'success');
      }
    } catch {
      showToast('Errore di connessione. Continuo in modalità offline.', 'warning');
      setOnboardingDone(true);
    } finally {
      setIsLoading(false);
    }
  };

  const SlideIcon = slides[step].icon;

  const getPlatformBadge = (platform: string) => {
    if (platform.includes('APK'))     return '📱 APK';
    if (platform.includes('Android')) return '📱 Android';
    if (platform.includes('iOS'))     return '🍎 iOS';
    if (platform.includes('Windows')) return '🖥️ Windows';
    if (platform.includes('Mac'))     return '🖥️ Mac';
    return '🌐 Web';
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-violet-50 to-fuchsia-50 flex flex-col items-center justify-center p-6">

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-sm"
        >
          <div className={`w-24 h-24 mx-auto rounded-3xl ${slides[step].bg} flex items-center justify-center mb-8 shadow-lg`}>
            <SlideIcon className={`w-12 h-12 ${slides[step].color}`} />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 text-center mb-4">
            {slides[step].title}
          </h1>
          <p className="text-slate-600 text-center text-lg leading-relaxed mb-10">
            {slides[step].desc}
          </p>

          {/* ── Ultimo step: inserimento nome ─────────────────────────────── */}
          {step === slides.length - 1 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Come ti chiami?
              </label>

              <div className="relative" ref={dropdownRef}>
                <div className="relative">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={e => {
                      setNameInput(e.target.value);
                      setForceNew(false); setNameWarning('');
                    }}
                    onKeyDown={e => e.key === 'Enter' && !isLoading && finish()}
                    onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
                    placeholder="Il tuo nome"
                    className="w-full px-4 py-3 rounded-xl border-2 border-indigo-100 focus:border-indigo-500 focus:outline-none text-slate-800 bg-white shadow-sm pr-10"
                    autoComplete="off"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {isSearching ? (
                      <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
                    ) : isGuest ? (
                      <Ghost className="w-4 h-4 text-violet-400" />
                    ) : isLocal ? (
                      <HardDrive className="w-4 h-4 text-emerald-400" />
                    ) : suggestions.length > 0 && !forceNew ? (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    ) : supabaseOk ? (
                      <Cloud className="w-4 h-4 text-indigo-300" />
                    ) : (
                      <CloudOff className="w-4 h-4 text-slate-300" />
                    )}
                  </div>
                </div>

                {/* Dropdown suggerimenti */}
                <AnimatePresence>
                  {showDropdown && suggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden"
                    >
                      <p className="text-[10px] text-slate-400 px-3 pt-2 pb-1 font-semibold uppercase tracking-wide">
                        Utenti trovati
                      </p>
                      {suggestions.map(s => (
                        <button
                          key={s.id}
                          onClick={() => selectSuggestion(s)}
                          className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-indigo-50 transition-colors text-left"
                        >
                          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center shrink-0">
                            <UserCheck className="w-4 h-4 text-indigo-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-800 text-sm truncate">{s.username}</p>
                            <p className="text-[11px] text-slate-400 truncate">
                              v{s.last_version} · {getPlatformBadge(s.platform)}
                            </p>
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ── Banner modalità GUEST (-GUEST) ──────────────────────────────── */}
              <AnimatePresence>
                {isGuest && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 flex items-start gap-2 bg-violet-50 border border-violet-200 rounded-xl px-3 py-2.5"
                  >
                    <Ghost className="w-4 h-4 text-violet-500 mt-0.5 shrink-0" />
                    <p className="text-xs text-violet-700 leading-relaxed">
                      <strong>Modalità Ospite</strong> — Progressi solo in locale,
                      cancellati automaticamente alla chiusura dell'app.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── Banner modalità LOCAL ──────────────────────────────────── */}
              <AnimatePresence>
                {isLocal && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 flex items-start gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2.5"
                  >
                    <HardDrive className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <p className="text-xs text-emerald-700 leading-relaxed">
                      <strong>Modalità Locale</strong> — Progressi salvati solo su questo
                      dispositivo. I dati rimangono anche dopo la chiusura, ma non vengono
                      sincronizzati nel cloud.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── Sezione "Non sei tu?" ──────────────────────────────────── */}
              <AnimatePresence>
                {forceNew && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-3 space-y-2"
                  >
                    <div className="flex items-center gap-1.5 text-amber-700">
                      <UserPlus className="w-4 h-4" />
                      <p className="text-xs font-semibold">Creazione nuovo account</p>
                    </div>
                    <input
                      type="text"
                      value={nameInput}
                      onChange={e => handleForceNewNameChange(e.target.value)}
                      placeholder="Scegli un nome diverso"
                      className="w-full px-3 py-2 rounded-lg border-2 border-amber-200 focus:border-amber-400 focus:outline-none text-sm text-slate-800 bg-white"
                    />
                    {newNameSuggestion && nameInput !== newNameSuggestion && (
                      <button
                        onClick={() => setNameInput(newNameSuggestion)}
                        className="text-xs text-indigo-600 font-medium hover:underline"
                      >
                        Usa il nome suggerito: <strong>{newNameSuggestion}</strong>
                      </button>
                    )}
                    {nameWarning && (
                      <div className="flex items-start gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
                        <p className="text-[11px] text-amber-700">{nameWarning}</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* "Non sei tu?" link */}
              {supabaseOk && !isOffline && (
                <div className="text-center mt-4">
                  <button
                    onClick={() => { setForceNew(true); setShowDropdown(false); }}
                    className="text-xs text-slate-400 hover:text-indigo-500 transition-colors underline underline-offset-2"
                  >
                    Non sei tu? Crea un nuovo account
                  </button>
                </div>
              )}

              {/* Legenda suffissi */}
              <div className="mt-4 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 space-y-1">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Suffissi speciali</p>
                <p className="text-[11px] text-slate-500"><span className="font-mono font-bold text-violet-500">-GUEST</span> — Ospite: dati cancellati alla chiusura</p>
                <p className="text-[11px] text-slate-500"><span className="font-mono font-bold text-emerald-600">-LOCAL</span> — Locale persistente: dati salvati, nessun cloud</p>
              </div>

              {/* Info versione */}
              <p className="text-center text-[10px] text-slate-300 mt-3">
                CodeLearn v{APP_VERSION}
                {supabaseOk && !isOffline ? ' · ☁️ Sync attivo' : ' · 💾 Solo locale'}
              </p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Dots indicatore */}
      <div className="flex gap-2 mb-8">
        {slides.map((_, i) => (
          <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-indigo-500' : 'w-2 bg-indigo-200'}`} />
        ))}
      </div>

      {/* Pulsanti navigazione */}
      {step < slides.length - 1 ? (
        <button
          onClick={() => setStep(s => s + 1)}
          className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-semibold text-lg shadow-lg shadow-indigo-200 active:scale-95 transition-transform"
        >
          Avanti <ChevronRight className="w-5 h-5" />
        </button>
      ) : (
        <button
          onClick={finish}
          disabled={isLoading}
          className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl font-semibold text-lg shadow-lg shadow-indigo-200 active:scale-95 transition-transform disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading
            ? <><Loader2 className="w-5 h-5 animate-spin" /> Caricamento…</>
            : <><Sparkles className="w-5 h-5" /> Inizia</>
          }
        </button>
      )}
    </div>
  );
}

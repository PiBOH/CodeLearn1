// ─────────────────────────────────────────────────────────────────────────────
// Profile.tsx — Profilo utente con sezione Info Sistema
// CodeLearn BETA V1.1.1a-1 - The Synch Update
// ─────────────────────────────────────────────────────────────────────────────

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Star, Flame, Award, TrendingUp, Code2, BookOpen, Zap,
  BarChart3, Calendar, Cloud, CloudOff, Loader2, CheckCircle2,
  AlertCircle, Info, Smartphone, Monitor, Ghost, HardDrive, Cpu,
} from 'lucide-react';
import { useApp, APP_VERSION_FULL } from '../context/AppContext';
import { detectDevice } from '../lib/deviceInfo';
import { isSupabaseConfigured } from '../lib/supabase';
import { courses } from '../data/courses';

// ── Badge info ────────────────────────────────────────────────────────────────

const badgeInfo: Record<string, {
  label: string; icon: React.ElementType;
  color: string; bg: string; desc: string;
}> = {
  'first-step': { label: 'Primo Passo', icon: BookOpen, color: 'text-blue-600',   bg: 'bg-blue-50',   desc: 'Prima lezione completata' },
  'explorer':   { label: 'Esploratore', icon: Zap,      color: 'text-amber-600',  bg: 'bg-amber-50',  desc: '5 lezioni completate' },
  'coder':      { label: 'Coder',       icon: Code2,    color: 'text-violet-600', bg: 'bg-violet-50', desc: '10 lezioni completate' },
  'master':     { label: 'Maestro',     icon: Award,    color: 'text-emerald-600',bg: 'bg-emerald-50',desc: 'Raggiunto livello 5' },
};

// ── Helper sync ───────────────────────────────────────────────────────────────

function SyncIcon({ status }: { status: string }) {
  switch (status) {
    case 'syncing': return <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />;
    case 'synced':  return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    case 'error':   return <AlertCircle className="w-4 h-4 text-red-400" />;
    case 'offline': return <CloudOff className="w-4 h-4 text-slate-400" />;
    default:        return <Cloud className="w-4 h-4 text-slate-300" />;
  }
}

function syncLabel(status: string) {
  switch (status) {
    case 'syncing': return 'Sincronizzazione…';
    case 'synced':  return 'Sincronizzato';
    case 'error':   return 'Errore di sync';
    case 'offline': return 'Solo locale';
    default:        return 'In attesa';
  }
}

function PlatformIcon({ platform }: { platform: string }) {
  if (platform.includes('Android') || platform.includes('iOS'))
    return <Smartphone className="w-5 h-5 text-indigo-500" />;
  if (platform.includes('PC') || platform.includes('Mac') || platform.includes('Linux'))
    return <Monitor className="w-5 h-5 text-indigo-500" />;
  return <Cpu className="w-5 h-5 text-indigo-500" />;
}

// ── Componente principale ─────────────────────────────────────────────────────

export default function Profile() {
  const { progress, username, userMode, isGuestMode, isLocalMode, syncStatus } = useApp();
  const xpToNext = 100 - (progress.xp % 100);

  const courseProgressData = courses
    .map(c => ({
      name: c.name,
      pct: Math.min(100, Math.round(((progress.courseProgress[c.id] ?? 0) / c.totalLessons) * 100)),
      color: c.color, bg: c.bgColor,
    }))
    .filter(c => c.pct > 0);

  const activityDays = [30,45,20,60,40,80,55,35,70,90,50,25,65,85,40,75,95,30,55,70,45,85,60,40,90,50,75,35,65,80];

  const device     = useMemo(() => detectDevice(), []);
  const supabaseOk = isSupabaseConfigured();

  // Colore e icona avatar per modalità
  const avatarStyle = isGuestMode
    ? 'from-violet-400 to-fuchsia-500 shadow-violet-200'
    : isLocalMode
    ? 'from-emerald-400 to-teal-500 shadow-emerald-200'
    : 'from-indigo-500 to-violet-600 shadow-indigo-200';

  const AvatarIcon = isGuestMode ? Ghost : isLocalMode ? HardDrive : Code2;

  // Label modalità utente
  const modeLabel = userMode === 'guest'
    ? '👻 Modalità Ospite'
    : userMode === 'local'
    ? '💾 Modalità Locale'
    : null;

  const modeBadgeStyle = userMode === 'guest'
    ? 'bg-violet-100 text-violet-600'
    : 'bg-emerald-100 text-emerald-700';

  // Sync display
  const effectiveSyncStatus = userMode !== 'cloud' ? 'offline' : syncStatus;
  const syncDisplayLabel = userMode === 'guest'
    ? 'Disabilitata (Ospite)'
    : userMode === 'local'
    ? 'Disabilitata (Locale)'
    : syncLabel(syncStatus);

  return (
    <div className="pb-24 pt-6 px-5 max-w-lg mx-auto min-h-screen bg-slate-50">

      {/* ── Avatar + nome ───────────────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <div className={`w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg bg-gradient-to-br ${avatarStyle}`}>
          <AvatarIcon className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800">{username || 'Coder'}</h1>
        <p className="text-slate-500 text-sm">Livello {progress.level} · {progress.xp} XP totali</p>
        {modeLabel && (
          <span className={`inline-block mt-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full ${modeBadgeStyle}`}>
            {modeLabel}
          </span>
        )}
      </motion.div>

      {/* ── Barra XP ────────────────────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
        className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500" />
            <span className="font-bold text-slate-800">Progresso Livello</span>
          </div>
          <span className="text-sm font-bold text-indigo-600">{progress.level}</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-4 mb-2">
          <div className="bg-gradient-to-r from-indigo-500 to-violet-500 h-4 rounded-full transition-all duration-500"
            style={{ width: `${progress.xp % 100}%` }} />
        </div>
        <p className="text-slate-500 text-xs text-center">{xpToNext} XP al prossimo livello</p>
      </motion.div>

      {/* ── Statistiche ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { icon: Flame,      label: 'Streak',  value: `${progress.streak} gg`, color: 'text-orange-500', bg: 'bg-orange-50' },
          { icon: BookOpen,   label: 'Lezioni', value: `${progress.completedLessons.length}`, color: 'text-blue-500', bg: 'bg-blue-50' },
          { icon: TrendingUp, label: 'Livello', value: `${progress.level}`, color: 'text-emerald-500', bg: 'bg-emerald-50' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.05 }}
            className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center">
            <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mx-auto mb-2`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-xl font-bold text-slate-800">{stat.value}</p>
            <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Attività mensile ─────────────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-indigo-500" />
          <h2 className="font-bold text-slate-800">Attività mensile</h2>
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {activityDays.map((val, i) => (
            <div key={i} className="aspect-square rounded-md transition-all"
              style={{ backgroundColor: val > 70 ? '#6366f1' : val > 40 ? '#a5b4fc' : val > 20 ? '#e0e7ff' : '#f1f5f9' }}
            />
          ))}
        </div>
        <div className="flex items-center justify-between mt-3 text-[10px] text-slate-400">
          <span>Meno</span>
          <div className="flex gap-1">
            {['bg-slate-100','bg-indigo-100','bg-indigo-300','bg-indigo-500'].map(c => (
              <div key={c} className={`w-3 h-3 rounded-sm ${c}`} />
            ))}
          </div>
          <span>Più</span>
        </div>
      </motion.div>

      {/* ── Progressi per corso ──────────────────────────────────────────────── */}
      {courseProgressData.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
          className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-violet-500" />
            <h2 className="font-bold text-slate-800">Progressi per corso</h2>
          </div>
          <div className="space-y-3">
            {courseProgressData.map((c, i) => (
              <div key={c.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-700">{c.name}</span>
                  <span className="text-[10px] font-bold text-slate-500">{c.pct}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${c.pct}%` }}
                    transition={{ delay: 0.3 + i * 0.05, duration: 0.5 }}
                    className="h-2 rounded-full" style={{ backgroundColor: c.color }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Badge ───────────────────────────────────────────────────────────── */}
      <h2 className="text-lg font-bold text-slate-800 mb-4">I tuoi badge</h2>
      <div className="space-y-3 mb-8">
        {Object.keys(badgeInfo).map((key, i) => {
          const info = badgeInfo[key];
          const unlocked = progress.badges.includes(key);
          const Icon = info.icon;
          return (
            <motion.div key={key} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.05 }}
              className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${unlocked ? 'bg-white border-slate-100 shadow-sm' : 'bg-slate-100 border-slate-200 opacity-50'}`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${unlocked ? info.bg : 'bg-slate-200'}`}>
                <Icon className={`w-6 h-6 ${unlocked ? info.color : 'text-slate-400'}`} />
              </div>
              <div className="flex-1">
                <h3 className={`font-bold text-sm ${unlocked ? 'text-slate-800' : 'text-slate-500'}`}>{info.label}</h3>
                <p className="text-xs text-slate-500">{info.desc}</p>
              </div>
              {unlocked && <Award className="w-5 h-5 text-amber-500" />}
            </motion.div>
          );
        })}
      </div>

      {/* ── INFO SISTEMA ─────────────────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">

        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center">
            <Info className="w-4 h-4 text-slate-500" />
          </div>
          <h2 className="font-bold text-slate-800">Info Sistema</h2>
        </div>

        <div className="space-y-4">

          {/* Versione app */}
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
              <Zap className="w-4 h-4 text-indigo-500" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-0.5">Versione App</p>
              <p className="text-sm font-bold text-slate-800">v{APP_VERSION_FULL}</p>
            </div>
          </div>

          {/* Piattaforma */}
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
              <PlatformIcon platform={device.platform} />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-0.5">Piattaforma</p>
              <p className="text-sm font-bold text-slate-800">{device.platform}</p>
              {device.deviceDetails && <p className="text-xs text-slate-500 mt-0.5">{device.deviceDetails}</p>}
            </div>
          </div>

          {/* Sincronizzazione */}
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
              {userMode === 'cloud' && supabaseOk
                ? <Cloud className="w-4 h-4 text-indigo-500" />
                : <CloudOff className="w-4 h-4 text-slate-400" />
              }
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-0.5">Sincronizzazione Cloud</p>
              <div className="flex items-center gap-1.5">
                <SyncIcon status={effectiveSyncStatus} />
                <p className="text-sm font-bold text-slate-800">{syncDisplayLabel}</p>
              </div>
              {!supabaseOk && userMode === 'cloud' && (
                <p className="text-[11px] text-slate-400 mt-0.5">Configura VITE_SUPABASE_URL nel file .env</p>
              )}
            </div>
          </div>

          {/* Modalità utente */}
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
              {isGuestMode
                ? <Ghost className="w-4 h-4 text-violet-500" />
                : isLocalMode
                ? <HardDrive className="w-4 h-4 text-emerald-600" />
                : <Code2 className="w-4 h-4 text-indigo-500" />
              }
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-0.5">Modalità Utente</p>
              <p className="text-sm font-bold text-slate-800">
                {isGuestMode ? 'Ospite (temporaneo)' : isLocalMode ? 'Locale persistente' : 'Account registrato'}
              </p>
              {isGuestMode && <p className="text-xs text-violet-500 mt-0.5">Dati cancellati alla chiusura</p>}
              {isLocalMode && <p className="text-xs text-emerald-600 mt-0.5">Dati salvati su questo dispositivo</p>}
            </div>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100 text-center">
          <p className="text-[10px] text-slate-300">CodeLearn · Made with ❤️ by PiBOH</p>
        </div>
      </motion.div>
    </div>
  );
}

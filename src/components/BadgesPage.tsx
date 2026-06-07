import { motion } from 'framer-motion';
import { Award, Lock, BookOpen, Zap, Code2, Star, Trophy, Target, Rocket, Crown, Eye, Moon } from 'lucide-react';
import { useApp } from '../context/AppContext';

// ── Badge standard (sempre visibili) ──────────────────────────────────
const allBadges = [
  { id: 'first-step', label: 'Primo Passo',        icon: BookOpen, color: 'text-blue-600',    bg: 'bg-blue-50',    desc: 'Completa la tua prima lezione' },
  { id: 'explorer',   label: 'Esploratore',         icon: Zap,      color: 'text-amber-600',   bg: 'bg-amber-50',   desc: 'Completa 5 lezioni' },
  { id: 'coder',      label: 'Coder',               icon: Code2,    color: 'text-violet-600',  bg: 'bg-violet-50',  desc: 'Completa 10 lezioni' },
  { id: 'master',     label: 'Maestro',             icon: Star,     color: 'text-emerald-600', bg: 'bg-emerald-50', desc: 'Raggiungi il livello 5' },
  { id: 'streak-7',   label: 'Fiamma Settimanale',  icon: Trophy,   color: 'text-orange-600',  bg: 'bg-orange-50',  desc: 'Mantieni una streak di 7 giorni' },
  { id: 'polyglot',   label: 'Poliglotta',          icon: Target,   color: 'text-indigo-600',  bg: 'bg-indigo-50',  desc: 'Inizia 3 corsi diversi' },
  { id: 'rocket',     label: 'Razzo',               icon: Rocket,   color: 'text-cyan-600',    bg: 'bg-cyan-50',    desc: 'Completa 20 lezioni' },
  { id: 'crown',      label: 'Re del Codice',       icon: Crown,    color: 'text-rose-600',    bg: 'bg-rose-50',    desc: 'Raggiungi il livello 10' },
];

// ── Badge segreti (visibili SOLO dopo lo sblocco) ─────────────────────
const secretBadges = [
  {
    id: 'furbetto',
    label: 'Furbetto',
    icon: Eye,
    color: 'text-amber-700',
    bg: 'bg-amber-100',
    desc: 'Hai provato ad usare i poteri del creatore...',
  },
  {
    id: 'gufo-notturno',
    label: 'Gufo Notturno',
    icon: Moon,
    color: 'text-indigo-700',
    bg: 'bg-indigo-100',
    desc: 'Sei attivo tra le 00:00 e le 05:00. Notte fonda, codice fondo.',
  },
];

export default function BadgesPage() {
  const { progress } = useApp();

  const unlockedStandard = allBadges.filter(b => progress.badges.includes(b.id)).length;
  const unlockedSecrets  = secretBadges.filter(b => progress.badges.includes(b.id));
  const hasAnySecret     = unlockedSecrets.length > 0;

  return (
    <div className="pb-24 pt-6 px-5 max-w-lg mx-auto min-h-screen bg-slate-50">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="w-20 h-20 bg-amber-50 rounded-full mx-auto mb-4 flex items-center justify-center">
          <Award className="w-10 h-10 text-amber-500" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800">Badge</h1>
        <p className="text-slate-500 text-sm mt-1">
          {unlockedStandard} di {allBadges.length} sbloccati
        </p>
      </motion.div>

      {/* ── Badge standard ── */}
      <div className="grid grid-cols-2 gap-3">
        {allBadges.map((badge, i) => {
          const unlocked = progress.badges.includes(badge.id);
          const Icon = badge.icon;
          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              className={`relative p-4 rounded-2xl border text-center transition-all ${
                unlocked
                  ? 'bg-white border-slate-100 shadow-sm'
                  : 'bg-slate-100 border-slate-200 opacity-60'
              }`}
            >
              {!unlocked && (
                <div className="absolute top-3 right-3">
                  <Lock className="w-4 h-4 text-slate-400" />
                </div>
              )}
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 ${unlocked ? badge.bg : 'bg-slate-200'}`}>
                <Icon className={`w-7 h-7 ${unlocked ? badge.color : 'text-slate-400'}`} />
              </div>
              <h3 className={`font-bold text-sm ${unlocked ? 'text-slate-800' : 'text-slate-500'}`}>{badge.label}</h3>
              <p className="text-[10px] text-slate-500 mt-1 leading-tight">{badge.desc}</p>
            </motion.div>
          );
        })}
      </div>

      {/* ── Badge segreti (solo se almeno uno sbloccato) ── */}
      {hasAnySecret && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base font-bold text-slate-700">Badge Segreti</span>
            <span className="text-[10px] font-semibold px-2 py-0.5 bg-violet-100 text-violet-700 rounded-full">
              {unlockedSecrets.length} sbloccato{unlockedSecrets.length > 1 ? 'i' : ''}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {unlockedSecrets.map((badge, i) => {
              const Icon = badge.icon;
              return (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.25 + i * 0.06, type: 'spring', stiffness: 300 }}
                  className="relative p-4 rounded-2xl border text-center bg-white border-violet-100 shadow-sm ring-1 ring-violet-200"
                >
                  {/* "segreto" badge */}
                  <span className="absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 bg-violet-600 text-white rounded-full leading-none">
                    ✦
                  </span>
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 ${badge.bg}`}>
                    <Icon className={`w-7 h-7 ${badge.color}`} />
                  </div>
                  <h3 className="font-bold text-sm text-slate-800">{badge.label}</h3>
                  <p className="text-[10px] text-slate-500 mt-1 leading-tight">{badge.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}

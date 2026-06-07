import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Clock, Zap, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';

const BADGE_TOASTS: Record<string, string> = {
  'first-step':  '🎯 Badge sbloccato: Primo Passo!',
  'explorer':    '⚡ Badge sbloccato: Esploratore!',
  'coder':       '💻 Badge sbloccato: Coder!',
  'rocket':      '🚀 Badge sbloccato: Razzo!',
  'master':      '⭐ Badge sbloccato: Maestro!',
  'crown':       '👑 Badge sbloccato: Re del Codice!',
  'streak-7':    '🔥 Badge sbloccato: Fiamma Settimanale!',
  'polyglot':    '🌐 Badge sbloccato: Poliglotta!',
};

interface Challenge {
  id: string;
  title: string;
  description: string;
  courseId: string;
  lessonId: string;
  difficulty: 'Facile' | 'Medio' | 'Difficile';
  xp: number;
}

const challenges: Challenge[] = [
  { id: 'dc1', title: 'Primo Saluto', description: 'Completa la lezione "Hello Python" per iniziare la giornata con il piede giusto!', courseId: 'python', lessonId: 'py-3', difficulty: 'Facile', xp: 30 },
  { id: 'dc2', title: 'Web Starter', description: 'Crea la tua prima pagina HTML e dai forma al web.', courseId: 'html', lessonId: 'html-3', difficulty: 'Facile', xp: 30 },
  { id: 'dc3', title: 'JS Console', description: 'Stampa un messaggio in console con JavaScript.', courseId: 'javascript', lessonId: 'js-3', difficulty: 'Facile', xp: 30 },
  { id: 'dc4', title: 'Kotlin Hello', description: 'Scrivi il tuo primo programma Kotlin.', courseId: 'kotlin', lessonId: 'kt-3', difficulty: 'Facile', xp: 30 },
  { id: 'dc5', title: 'Java Class', description: 'Crea una classe Auto in Java.', courseId: 'java', lessonId: 'java-6', difficulty: 'Medio', xp: 50 },
  { id: 'dc6', title: 'Swift Struct', description: 'Crea una struct Rettangolo in Swift.', courseId: 'swift', lessonId: 'sw-10', difficulty: 'Medio', xp: 50 },
];

function getDailyChallenge(): Challenge {
  const today = new Date().toDateString();
  const seed = today.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return challenges[seed % challenges.length];
}

export default function DailyChallenge() {
  const [challenge] = useState(getDailyChallenge);
  const [timeLeft, setTimeLeft] = useState('');
  const { hasCompleted, completeLesson } = useApp();
  const { showToast } = useToast();

  const handleBadges = (ids: string[]) => {
    ids.forEach((id, i) => {
      setTimeout(() => {
        const msg = BADGE_TOASTS[id] ?? `🏅 Badge sbloccato: ${id}`;
        showToast(msg, 'success');
      }, i * 600);
    });
  };
  const navigate = useNavigate();
  const completed = hasCompleted(challenge.lessonId);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      const diff = tomorrow.getTime() - now.getTime();
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      setTimeLeft(`${h}h ${m}m`);
    }, 60000);
    setTimeLeft('');
    return () => clearInterval(interval);
  }, []);

  const diffColors = {
    Facile: 'bg-emerald-100 text-emerald-700',
    Medio: 'bg-amber-100 text-amber-700',
    Difficile: 'bg-rose-100 text-rose-700',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-3xl p-5 text-white mb-6 shadow-lg shadow-violet-200 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-300" />
            <span className="font-bold text-sm">Sfida Giornaliera</span>
          </div>
          <div className="flex items-center gap-1 bg-white/20 px-2.5 py-1 rounded-full text-xs font-medium">
            <Clock className="w-3 h-3" />
            {timeLeft}
          </div>
        </div>

        <h3 className="text-lg font-bold mb-1">{challenge.title}</h3>
        <p className="text-violet-100 text-sm mb-3 leading-relaxed">{challenge.description}</p>

        <div className="flex items-center gap-3 mb-4">
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${diffColors[challenge.difficulty]}`}>
            {challenge.difficulty}
          </span>
          <div className="flex items-center gap-1 text-amber-300 text-xs font-bold">
            <Zap className="w-3.5 h-3.5" />
            {challenge.xp} XP bonus
          </div>
        </div>

        <button
          onClick={() => {
            if (completed) {
              completeLesson(challenge.lessonId, challenge.courseId, challenge.xp, handleBadges);
            }
            navigate(`/lesson/${challenge.lessonId}`);
          }}
          className={`w-full py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform ${
            completed
              ? 'bg-white/20 text-white'
              : 'bg-white text-violet-700'
          }`}
        >
          {completed ? (
            <><CheckCircle2 className="w-4 h-4" /> Completata</>
          ) : (
            <><Zap className="w-4 h-4" /> Inizia Sfida <ChevronRight className="w-4 h-4" /></>
          )}
        </button>
      </div>
    </motion.div>
  );
}

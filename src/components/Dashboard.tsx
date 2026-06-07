import { motion } from 'framer-motion';
import { Flame, Star, TrendingUp, ChevronRight, Trophy, Target, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { courses } from '../data/courses';
import { useNavigate } from 'react-router-dom';
import { getIcon } from '../lib/icons';
import DailyChallenge from './DailyChallenge';

export default function Dashboard() {
  const { progress, username, getCourseProgress } = useApp();
  const navigate = useNavigate();

  const activeCourses = courses.filter(c => getCourseProgress(c.id, c.totalLessons) > 0);
  const displayCourses = activeCourses.length > 0 ? activeCourses.slice(0, 3) : courses.slice(0, 3);

  return (
    <div className="pb-24 pt-6 px-5 max-w-lg mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Ciao, {username || 'Coder'}!</h1>
          <p className="text-slate-500 text-sm">Continua il tuo percorso di apprendimento</p>
        </div>
        <div className="flex items-center gap-1 bg-orange-50 px-3 py-1.5 rounded-full">
          <Flame className="w-4 h-4 text-orange-500" />
          <span className="text-sm font-bold text-orange-600">{progress.streak}</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-indigo-500 to-violet-600 rounded-3xl p-5 text-white mb-6 shadow-lg shadow-indigo-200"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-300" />
            <span className="font-semibold">Livello {progress.level}</span>
          </div>
          <span className="text-indigo-100 text-sm">{progress.xp} XP</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-3 mb-2">
          <div
            className="bg-amber-400 h-3 rounded-full transition-all duration-500"
            style={{ width: `${(progress.xp % 100)}%` }}
          />
        </div>
        <p className="text-indigo-100 text-xs">{100 - (progress.xp % 100)} XP al prossimo livello</p>
      </motion.div>

      <DailyChallenge />

      <div className="grid grid-cols-2 gap-3 mb-6">
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => navigate('/leaderboard')}
          className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-left active:scale-[0.98] transition-transform"
        >
          <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center mb-2">
            <Trophy className="w-5 h-5 text-amber-500" />
          </div>
          <h3 className="font-bold text-slate-800 text-sm">Classifica</h3>
          <p className="text-[10px] text-slate-500 mt-0.5">Confrontati con gli altri</p>
        </motion.button>
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          onClick={() => navigate('/careers')}
          className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-left active:scale-[0.98] transition-transform"
        >
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center mb-2">
            <Target className="w-5 h-5 text-emerald-500" />
          </div>
          <h3 className="font-bold text-slate-800 text-sm">Percorsi</h3>
          <p className="text-[10px] text-slate-500 mt-0.5">Roadmap di carriera</p>
        </motion.button>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-800">{activeCourses.length > 0 ? 'Continua a imparare' : 'Inizia un corso'}</h2>
        <button onClick={() => navigate('/courses')} className="text-indigo-600 text-sm font-semibold flex items-center gap-1">
          Tutti <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        {displayCourses.map((course, i) => {
          const Icon = getIcon(course.icon);
          const pct = getCourseProgress(course.id, course.totalLessons);
          return (
            <motion.button
              key={course.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              onClick={() => navigate(`/course/${course.id}`)}
              className="w-full bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-4 text-left active:scale-[0.98] transition-transform"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: course.bgColor }}>
                <Icon className="w-6 h-6" style={{ color: course.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-800">{course.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 bg-slate-100 rounded-full h-2">
                    <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: course.color }} />
                  </div>
                  <span className="text-xs text-slate-500 font-medium">{pct}%</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300" />
            </motion.button>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 bg-emerald-50 rounded-2xl p-4 flex items-center gap-3"
      >
        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <p className="font-semibold text-emerald-800 text-sm">Mantieni la streak!</p>
          <p className="text-emerald-600 text-xs">Hai completato {progress.completedLessons.length} lezioni. Continua così!</p>
        </div>
        <Zap className="w-5 h-5 text-emerald-400 ml-auto" />
      </motion.div>
    </div>
  );
}

import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, CheckCircle2, Circle, Play } from 'lucide-react';
import { getCourseById, getLessonsByCourse } from '../data/courses';
import { useApp } from '../context/AppContext';
import { getIcon } from '../lib/icons';

export default function CoursePath() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { hasCompleted } = useApp();
  const course = getCourseById(courseId || '');
  const lessons = getLessonsByCourse(courseId || '');

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500">Corso non trovato</p>
      </div>
    );
  }

  const Icon = getIcon(course.icon);

  return (
    <div className="pb-24 pt-6 px-5 max-w-lg mx-auto min-h-screen bg-slate-50">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-600 mb-4 active:scale-95 transition-transform">
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Indietro</span>
      </button>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-8"
      >
        <div className="flex items-center gap-4 mb-3">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: course.bgColor }}>
            <Icon className="w-8 h-8" style={{ color: course.color }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{course.name}</h1>
            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-slate-100 text-slate-600">{course.level}</span>
          </div>
        </div>
        <p className="text-slate-600 text-sm">{course.description}</p>
      </motion.div>

      <div className="relative">
        <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-slate-200" />
        <div className="space-y-4">
          {lessons.map((lesson, i) => {
            const completed = hasCompleted(lesson.id);
            const prevCompleted = i === 0 || hasCompleted(lessons[i - 1].id);
            const unlocked = completed || prevCompleted;

            return (
              <motion.button
                key={lesson.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => unlocked && navigate(`/lesson/${lesson.id}`)}
                disabled={!unlocked}
                className={`relative w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${
                  completed
                    ? 'bg-white border-emerald-200 shadow-sm'
                    : unlocked
                    ? 'bg-white border-indigo-200 shadow-sm active:scale-[0.98]'
                    : 'bg-slate-100 border-slate-200 opacity-60'
                }`}
              >
                <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  completed ? 'bg-emerald-100 text-emerald-600' : unlocked ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 text-slate-400'
                }`}>
                  {completed ? <CheckCircle2 className="w-5 h-5" /> : unlocked ? <Play className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`font-semibold text-sm ${completed ? 'text-emerald-700' : unlocked ? 'text-slate-800' : 'text-slate-500'}`}>
                    {lesson.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      lesson.type === 'theory' ? 'bg-blue-50 text-blue-600' :
                      lesson.type === 'code' ? 'bg-amber-50 text-amber-600' :
                      'bg-violet-50 text-violet-600'
                    }`}>
                      {lesson.type === 'theory' ? 'Teoria' : lesson.type === 'code' ? 'Codice' : 'Quiz'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">{lesson.xp} XP</span>
                  </div>
                </div>
                {!completed && unlocked && <Circle className="w-4 h-4 text-indigo-300" />}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

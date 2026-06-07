import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { courses } from '../data/courses';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getIcon } from '../lib/icons';

export default function CoursesList() {
  const navigate = useNavigate();
  const { getCourseProgress } = useApp();

  return (
    <div className="pb-24 pt-6 px-5 max-w-lg mx-auto min-h-screen bg-slate-50">
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Tutti i corsi</h1>
      <p className="text-slate-500 text-sm mb-6">Scegli un linguaggio e inizia a imparare</p>

      <div className="grid grid-cols-1 gap-3">
        {courses.map((course, i) => {
          const Icon = getIcon(course.icon);
          const pct = getCourseProgress(course.id, course.totalLessons);
          return (
            <motion.button
              key={course.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => navigate(`/course/${course.id}`)}
              className="w-full bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-4 text-left active:scale-[0.98] transition-transform"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: course.bgColor }}>
                <Icon className="w-6 h-6" style={{ color: course.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-800">{course.name}</h3>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">{course.level}</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 truncate">{course.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                    <div className="h-1.5 rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: course.color }} />
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">{pct}%</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 shrink-0" />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

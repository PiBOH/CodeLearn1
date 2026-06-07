import { motion } from 'framer-motion';
import { ArrowLeft, Monitor, Server, Smartphone, Layers, ChevronRight, CheckCircle2, Circle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { courses } from '../data/courses';

const paths = [
  {
    id: 'frontend',
    title: 'Frontend Developer',
    icon: Monitor,
    color: '#f59e0b',
    bgColor: '#fffbeb',
    description: 'Crea interfacce web moderne e reattive.',
    requiredCourses: ['html', 'javascript'],
  },
  {
    id: 'backend',
    title: 'Backend Developer',
    icon: Server,
    color: '#6366f1',
    bgColor: '#eef2ff',
    description: 'Costruisci API e gestisci database.',
    requiredCourses: ['php', 'python', 'javascript'],
  },
  {
    id: 'mobile',
    title: 'Mobile Developer',
    icon: Smartphone,
    color: '#8b5cf6',
    bgColor: '#f5f3ff',
    description: 'Sviluppa app per iOS e Android.',
    requiredCourses: ['kotlin', 'swift'],
  },
  {
    id: 'fullstack',
    title: 'Full Stack Developer',
    icon: Layers,
    color: '#10b981',
    bgColor: '#ecfdf5',
    description: 'Padroneggia frontend e backend.',
    requiredCourses: ['html', 'javascript', 'php', 'python'],
  },
  {
    id: 'systems',
    title: 'Systems Developer',
    icon: Server,
    color: '#3b82f6',
    bgColor: '#eff6ff',
    description: 'Programma a basso livello e ottimizza performance.',
    requiredCourses: ['c', 'cpp', 'java'],
  },
  {
    id: 'gamedev',
    title: 'Game Developer',
    icon: Layers,
    color: '#ef4444',
    bgColor: '#fef2f2',
    description: 'Crea videogiochi e esperienze interattive.',
    requiredCourses: ['csharp', 'cpp', 'javascript'],
  },
];

export default function CareerPaths() {
  const navigate = useNavigate();
  const { getCourseProgress } = useApp();

  return (
    <div className="pb-24 pt-6 px-5 max-w-lg mx-auto min-h-screen bg-slate-50">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-600 mb-4 active:scale-95 transition-transform">
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Indietro</span>
      </button>

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Percorsi di Carriera</h1>
        <p className="text-slate-500 text-sm mt-1">Scegli un percorso e segui la roadmap</p>
      </motion.div>

      <div className="space-y-3">
        {paths.map((path, i) => {
          const Icon = path.icon;
          const completedCourses = path.requiredCourses.filter(cid => getCourseProgress(cid, courses.find(c => c.id === cid)?.totalLessons || 1) >= 100).length;
          const totalCourses = path.requiredCourses.length;
          const pct = Math.round((completedCourses / totalCourses) * 100);

          return (
            <motion.button
              key={path.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => navigate('/courses')}
              className="w-full bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-left active:scale-[0.98] transition-transform"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: path.bgColor }}>
                  <Icon className="w-6 h-6" style={{ color: path.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-800">{path.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{path.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 bg-slate-100 rounded-full h-2">
                      <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: path.color }} />
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">{completedCourses}/{totalCourses}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {path.requiredCourses.map(cid => {
                      const course = courses.find(c => c.id === cid);
                      const done = getCourseProgress(cid, course?.totalLessons || 1) >= 100;
                      return (
                        <span key={cid} className={`flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${done ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                          {done ? <CheckCircle2 className="w-3 h-3" /> : <Circle className="w-3 h-3" />}
                          {course?.name}
                        </span>
                      );
                    })}
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 shrink-0 mt-1" />
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

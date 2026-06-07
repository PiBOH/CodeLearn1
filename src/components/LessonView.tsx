import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BookOpen, Code2, HelpCircle, CheckCircle2, XCircle, RotateCcw, Lightbulb, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { getLessonsByCourse, type Lesson } from '../data/courses';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { saveUserProgress } from '../services/userService';
import CodeEditor from './CodeEditor';
import CodeExample from './CodeExample';

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

export default function LessonView() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { hasCompleted, completeLesson, progress, username: contextUsername } = useApp();
  const { showToast } = useToast();

  const handleBadges = (ids: string[]) => {
    ids.forEach((id, i) => {
      setTimeout(() => {
        const msg = BADGE_TOASTS[id] ?? `🏅 Badge sbloccato: ${id}`;
        showToast(msg, 'success');
      }, i * 600);
    });
  };

  let lesson: Lesson | undefined;
  let courseLessons: Lesson[] = [];
  for (const c of ['python', 'javascript', 'java', 'kotlin', 'swift', 'csharp', 'cpp', 'c', 'php', 'html']) {
    const ls = getLessonsByCourse(c);
    const found = ls.find(l => l.id === lessonId);
    if (found) {
      lesson = found;
      courseLessons = ls;
      break;
    }
  }

  const [showSuccess, setShowSuccess] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizChecked, setQuizChecked] = useState(false);

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500">Lezione non trovata</p>
      </div>
    );
  }

  const currentIndex = courseLessons.findIndex(l => l.id === lesson.id);
  const nextLesson = courseLessons[currentIndex + 1];
  const completed = hasCompleted(lesson.id);

  const handleComplete = () => {
    if (!completed) {
      completeLesson(lesson.id, lesson.courseId, lesson.xp, handleBadges);

      // Recupera l'username da localStorage (chiave 'current_user' impostata al login)
      // con fallback al valore già presente nel contesto
      const username = localStorage.getItem('current_user') || contextUsername || '';

      // Costruiamo lo snapshot aggiornato del progresso (il setState di completeLesson
      // è asincrono, quindi calcoliamo manualmente i nuovi valori da salvare)
      const updatedProgressData = {
        ...progress,
        completedLessons: [...progress.completedLessons, lesson.id],
        xp: progress.xp + lesson.xp,
        lessonId: lesson.id,
        courseId: lesson.courseId,
      };

      saveUserProgress(username, updatedProgressData);
    }
    setShowSuccess(true);
  };

  const handleQuizCheck = () => {
    if (!lesson.quiz) return;
    setQuizChecked(true);
    const allCorrect = lesson.quiz.every((q, i) => quizAnswers[i] === q.correct);
    if (allCorrect) {
      handleComplete();
    }
  };

  const handleCodeSuccess = () => {
    handleComplete();
  };

  const TypeIcon = lesson.type === 'theory' ? BookOpen : lesson.type === 'code' ? Code2 : HelpCircle;

  return (
    <div className="pb-24 pt-6 px-5 max-w-lg mx-auto min-h-screen bg-slate-50">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-600 mb-4 active:scale-95 transition-transform">
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Indietro</span>
      </button>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            lesson.type === 'theory' ? 'bg-blue-50 text-blue-600' :
            lesson.type === 'code' ? 'bg-amber-50 text-amber-600' :
            'bg-violet-50 text-violet-600'
          }`}>
            <TypeIcon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">{lesson.title}</h1>
            <span className="text-xs text-slate-400 font-medium">{lesson.xp} XP</span>
          </div>
        </div>

        <div className="prose prose-slate prose-sm max-w-none">
          <p className="text-slate-700 leading-relaxed whitespace-pre-line">{lesson.content}</p>
          {lesson.examples && lesson.examples.map((ex, i) => (
            <CodeExample key={i} code={ex.code} language={ex.language} />
          ))}
        </div>
      </motion.div>

      {lesson.type === 'code' && (
        <>
          {lesson.examples && lesson.examples.map((ex, i) => (
            <div key={i} className="mb-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{ex.caption || 'Esempio'}</p>
              <CodeExample code={ex.code} language={ex.language} />
            </div>
          ))}
          <CodeEditor
            initialCode={lesson.code || ''}
            expectedOutput={lesson.expectedOutput || ''}
            onSuccess={handleCodeSuccess}
            completed={completed}
            language={lesson.courseId === 'csharp' ? 'cpp' : lesson.courseId}
          />
        </>
      )}

      {lesson.type === 'quiz' && lesson.quiz && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {lesson.quiz.map((q, qi) => {
            const selected = quizAnswers[qi];
            const isCorrect = selected === q.correct;
            const showResult = quizChecked;
            return (
              <div key={qi} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                <p className="font-semibold text-slate-800 mb-3">{qi + 1}. {q.question}</p>
                <div className="space-y-2">
                  {q.options.map((opt, oi) => {
                    const optSelected = selected === oi;
                    const optCorrect = q.correct === oi;
                    return (
                      <button
                        key={oi}
                        onClick={() => !quizChecked && setQuizAnswers(prev => ({ ...prev, [qi]: oi }))}
                        disabled={quizChecked}
                        className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all text-sm font-medium ${
                          showResult && optCorrect
                            ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                            : showResult && optSelected && !optCorrect
                            ? 'border-red-400 bg-red-50 text-red-700'
                            : optSelected
                            ? 'border-indigo-400 bg-indigo-50 text-indigo-700'
                            : 'border-slate-100 hover:border-indigo-200 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-xs flex items-center justify-center font-bold shrink-0">
                            {String.fromCharCode(65 + oi)}
                          </span>
                          {opt}
                          {showResult && optCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto" />}
                          {showResult && optSelected && !optCorrect && <XCircle className="w-4 h-4 text-red-500 ml-auto" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
                {showResult && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className={`mt-3 p-3 rounded-xl text-xs leading-relaxed ${
                      isCorrect ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{q.explanation}</span>
                    </div>
                  </motion.div>
                )}
              </div>
            );
          })}
          {!quizChecked ? (
            <button
              onClick={handleQuizCheck}
              disabled={Object.keys(quizAnswers).length !== lesson.quiz.length}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:shadow-none active:scale-[0.98] transition-transform"
            >
              Verifica Risposte
            </button>
          ) : (
            <button
              onClick={() => {
                setQuizChecked(false);
                setQuizAnswers({});
              }}
              className="w-full py-4 bg-slate-100 text-slate-700 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
            >
              <RotateCcw className="w-5 h-5" /> Riprova
            </button>
          )}
        </motion.div>
      )}

      {lesson.type === 'theory' && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={handleComplete}
          disabled={completed}
          className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg active:scale-[0.98] transition-transform flex items-center justify-center gap-2 ${
            completed
              ? 'bg-emerald-100 text-emerald-700 shadow-none'
              : 'bg-indigo-600 text-white shadow-indigo-200'
          }`}
        >
          {completed ? <><CheckCircle2 className="w-5 h-5" /> Completato</> : 'Ho capito!'}
        </motion.button>
      )}

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm"
          >
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="w-10 h-10 text-amber-500" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Ottimo lavoro!</h2>
              <p className="text-slate-600 mb-2">Hai guadagnato <span className="font-bold text-amber-500">{lesson.xp} XP</span></p>
              {nextLesson ? (
                <button
                  onClick={() => {
                    setShowSuccess(false);
                    navigate(`/lesson/${nextLesson.id}`);
                  }}
                  className="w-full py-3 bg-indigo-600 text-white rounded-2xl font-bold mt-4 active:scale-95 transition-transform"
                >
                  Prossima Lezione
                </button>
              ) : (
                <button
                  onClick={() => {
                    setShowSuccess(false);
                    navigate(`/course/${lesson.courseId}`);
                  }}
                  className="w-full py-3 bg-indigo-600 text-white rounded-2xl font-bold mt-4 active:scale-95 transition-transform"
                >
                  Torna al Corso
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

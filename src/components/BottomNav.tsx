import { Home, User, Trophy, BookOpen, Compass } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const tabs = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: BookOpen, label: 'Corsi', path: '/courses' },
  { icon: Compass, label: 'Percorsi', path: '/careers' },
  { icon: Trophy, label: 'Badge', path: '/badges' },
  { icon: User, label: 'Profilo', path: '/profile' },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-slate-100 z-50 safe-area-pb">
      <div className="max-w-lg mx-auto flex justify-around items-center h-16">
        {tabs.map(tab => {
          const active = location.pathname === tab.path;
          const Icon = tab.icon;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`relative flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors ${active ? 'text-indigo-600' : 'text-slate-400'}`}
            >
              <Icon className={`w-5 h-5 ${active ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              <span className="text-[10px] font-semibold">{tab.label}</span>
              {active && (
                <div className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-indigo-600" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

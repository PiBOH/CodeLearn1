import { motion } from 'framer-motion';
import { Trophy, Medal, Crown, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const fakeUsers = [
  { name: 'MarcoDev', xp: 2450, level: 24, streak: 12, avatar: 'M' },
  { name: 'AnnaCode', xp: 2180, level: 22, streak: 8, avatar: 'A' },
  { name: 'LucaByte', xp: 1950, level: 20, streak: 15, avatar: 'L' },
  { name: 'SaraWeb', xp: 1720, level: 18, streak: 5, avatar: 'S' },
  { name: 'TomApp', xp: 1580, level: 16, streak: 7, avatar: 'T' },
  { name: 'EliData', xp: 1340, level: 14, streak: 3, avatar: 'E' },
  { name: 'DavGame', xp: 1200, level: 13, streak: 9, avatar: 'D' },
];

export default function Leaderboard() {
  const navigate = useNavigate();
  const { progress, username } = useApp();

  const allUsers = [
    ...fakeUsers,
    { name: username || 'Tu', xp: progress.xp, level: progress.level, streak: progress.streak, avatar: (username || 'T')[0].toUpperCase(), isMe: true },
  ].sort((a, b) => b.xp - a.xp);

  const myRank = allUsers.findIndex(u => 'isMe' in u && u.isMe) + 1;

  const rankColors = ['text-amber-500', 'text-slate-400', 'text-amber-700'];
  const rankBgs = ['bg-amber-50', 'bg-slate-50', 'bg-amber-50'];

  return (
    <div className="pb-24 pt-6 px-5 max-w-lg mx-auto min-h-screen bg-slate-50">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-600 mb-4 active:scale-95 transition-transform">
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Indietro</span>
      </button>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <div className="w-16 h-16 bg-amber-50 rounded-full mx-auto mb-3 flex items-center justify-center">
          <Crown className="w-8 h-8 text-amber-500" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800">Classifica</h1>
        <p className="text-slate-500 text-sm">La tua posizione: <span className="font-bold text-indigo-600">#{myRank}</span></p>
      </motion.div>

      <div className="space-y-2">
        {allUsers.map((user, i) => (
          <motion.div
            key={user.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            className={`flex items-center gap-3 p-3.5 rounded-2xl border ${
              'isMe' in user
                ? 'bg-indigo-50 border-indigo-200 shadow-sm'
                : 'bg-white border-slate-100'
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
              i < 3 ? rankBgs[i] : 'bg-slate-100 text-slate-500'
            }`}>
              {i < 3 ? (
                <Medal className={`w-5 h-5 ${rankColors[i]}`} />
              ) : (
                <span className="text-xs">{i + 1}</span>
              )}
            </div>

            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 ${
              'isMe' in user ? 'bg-indigo-500' : 'bg-gradient-to-br from-violet-500 to-fuchsia-500'
            }`}>
              {user.avatar}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className={`font-bold text-sm truncate ${'isMe' in user ? 'text-indigo-700' : 'text-slate-800'}`}>
                  {user.name}
                </h3>
                {'isMe' in user && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-200 text-indigo-700">TU</span>
                )}
              </div>
              <p className="text-[10px] text-slate-500">Livello {user.level} • {user.streak} giorni streak</p>
            </div>

            <div className="text-right shrink-0">
              <p className="font-bold text-sm text-slate-800">{user.xp.toLocaleString()}</p>
              <p className="text-[10px] text-slate-400">XP</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

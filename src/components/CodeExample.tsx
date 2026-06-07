import { Copy, Check, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { highlightCode } from './SyntaxHighlighter';
import { useApp } from '../context/AppContext';

interface Props {
  code: string;
  language?: string;
}

export default function CodeExample({ code, language = 'code' }: Props) {
  const [copied, setCopied] = useState(false);
  const { username } = useApp();
  const isAdmin = username === 'PiBOH';

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const highlighted = highlightCode(code, language);

  return (
    <div className="my-4 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between px-3 py-2 bg-slate-100 border-b border-slate-200">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{language}</span>

        {isAdmin && (
          <button
            onClick={copy}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all
              ${copied
                ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                : 'bg-indigo-600 text-white shadow-sm shadow-indigo-300 hover:bg-indigo-700 active:scale-95'
              }`}
          >
            {copied
              ? <><Check className="w-3 h-3" /> Copiato</>
              : <><ShieldCheck className="w-3 h-3" /><Copy className="w-3 h-3" /> Copia</>
            }
          </button>
        )}
      </div>
      <pre className="bg-slate-900 text-slate-200 p-4 text-xs font-mono overflow-x-auto leading-relaxed">
        <code dangerouslySetInnerHTML={{ __html: highlighted }} />
      </pre>
    </div>
  );
}

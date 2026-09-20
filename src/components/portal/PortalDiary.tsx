import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BookOpen, Smile, Send, Trophy, Sparkles, User } from 'lucide-react';

export const PortalDiary: React.FC = () => {
  const { diaryEntries, addDiaryEntry, currentUser, easyMode } = useApp();
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<'muy_bien' | 'bien' | 'regular' | 'dificil'>('bien');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    addDiaryEntry(content, mood);
    setContent('');
  };

  const getMoodEmoji = (m?: string) => {
    switch (m) {
      case 'muy_bien':
        return '😄 Muy bien';
      case 'bien':
        return '🙂 Bien';
      case 'regular':
        return '😐 Regular';
      case 'dificil':
        return '😔 Día difícil';
      default:
        return '🙂 Bien';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className={`font-bold text-slate-900 ${easyMode ? 'text-xl' : 'text-base'}`}>
            📖 Diario de Recuperación y Cuidados
          </h3>
          <p className={`text-slate-500 ${easyMode ? 'text-sm' : 'text-xs'}`}>
            Espacio compartido para escribir cómo te sientes, registrar logros diarios o notas de los cuidadores.
          </p>
        </div>
      </div>

      {/* Write Entry Box */}
      <form onSubmit={handleSubmit} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs">
              {currentUser.avatarText}
            </span>
            <div>
              <div className="text-xs font-bold text-slate-800">{currentUser.name}</div>
              <div className="text-[11px] text-slate-400">{currentUser.title}</div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-xs text-slate-500 mr-1 hidden sm:inline">Ánimo hoy:</span>
            {(['muy_bien', 'bien', 'regular', 'dificil'] as const).map(m => (
              <button
                type="button"
                key={m}
                onClick={() => setMood(m)}
                className={`px-2 py-1 rounded-lg text-xs font-semibold transition ${
                  mood === m
                    ? 'bg-sky-100 text-sky-800 border border-sky-300'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {getMoodEmoji(m)}
              </button>
            ))}
          </div>
        </div>

        <textarea
          rows={3}
          required
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Escribe una pequeña nota sobre tu día, cómo dormiste, los ejercicios que hiciste o cualquier pensamiento..."
          className={`w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 focus:outline-none ${
            easyMode ? 'text-base' : 'text-xs'
          }`}
        ></textarea>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5 text-xs text-amber-700">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>+30 XP por registrar tu diario</span>
          </div>

          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs shadow transition flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Publicar Entrada</span>
          </button>
        </div>
      </form>

      {/* Diary Timeline */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Entradas del Diario ({diaryEntries.length})
        </h4>

        {diaryEntries.map(entry => (
          <div
            key={entry.id}
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2 hover:border-slate-300 transition"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                    entry.authorType === 'clinical_team'
                      ? 'bg-purple-100 text-purple-800'
                      : entry.authorType === 'caregiver'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {entry.authorType === 'clinical_team'
                    ? 'Equipo Clínico'
                    : entry.authorType === 'caregiver'
                    ? 'Cuidador Familiar'
                    : 'Paciente'}
                </span>
                <span className="font-bold text-slate-800 text-xs">{entry.authorName}</span>
              </div>

              <div className="flex items-center gap-2">
                {entry.mood && (
                  <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                    {getMoodEmoji(entry.mood)}
                  </span>
                )}
                <span className="text-[11px] text-slate-400">{entry.entryDate}</span>
              </div>
            </div>

            <p className={`text-slate-700 leading-relaxed ${easyMode ? 'text-base' : 'text-xs'}`}>
              {entry.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

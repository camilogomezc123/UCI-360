import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RecoveryGoal } from '../../types';
import { Target, CheckCircle2, Plus, ArrowUpRight, Award, Trophy } from 'lucide-react';

export const PortalGoals: React.FC = () => {
  const { goals, reportGoalProgress, easyMode } = useApp();
  const [selectedGoal, setSelectedGoal] = useState<RecoveryGoal | null>(null);
  const [addedValue, setAddedValue] = useState<string>('5');
  const [notes, setNotes] = useState<string>('');

  const handleReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoal) return;
    const val = parseFloat(addedValue) || 1;
    reportGoalProgress(selectedGoal.id, val, notes);
    setSelectedGoal(null);
    setNotes('');
  };

  const getDomainColor = (domain: string) => {
    switch (domain) {
      case 'movilidad':
        return 'bg-emerald-500';
      case 'cognitivo':
        return 'bg-sky-500';
      case 'emocional':
        return 'bg-purple-500';
      case 'nutricional':
        return 'bg-amber-500';
      default:
        return 'bg-slate-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className={`font-bold text-slate-900 ${easyMode ? 'text-xl' : 'text-base'}`}>
            🎯 Tus Metas de Recuperación
          </h3>
          <p className={`text-slate-500 ${easyMode ? 'text-sm' : 'text-xs'}`}>
            Pequeños pasos medibles acordados con tu equipo de rehabilitación.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map(g => (
          <div
            key={g.id}
            className={`p-5 rounded-2xl border transition bg-white shadow-sm flex flex-col justify-between ${
              g.status === 'completed'
                ? 'border-emerald-200 bg-emerald-50/20'
                : 'border-slate-200 hover:border-sky-300'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide text-white ${getDomainColor(g.domain)}`}>
                  {g.domain}
                </span>

                {g.status === 'completed' ? (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" /> ¡Meta Lograda!
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-slate-500">
                    Meta: {g.targetValue} {g.unit}
                  </span>
                )}
              </div>

              <h4 className={`font-bold text-slate-800 ${easyMode ? 'text-base' : 'text-sm'}`}>
                {g.description}
              </h4>

              <div>
                <div className="flex justify-between text-xs text-slate-600 font-medium mb-1">
                  <span>Progreso actual:</span>
                  <span className="font-bold text-slate-900">
                    {g.currentValue} / {g.targetValue} {g.unit} ({g.progressPercentage}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${getDomainColor(g.domain)}`}
                    style={{ width: `${g.progressPercentage}%` }}
                  ></div>
                </div>
              </div>

              {g.lastReportNotes && (
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 italic">
                  Último reporte ({g.lastReportedDate}): "{g.lastReportNotes}"
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Fecha objetivo: {g.targetDate}
              </span>

              {g.status !== 'completed' && (
                <button
                  onClick={() => {
                    setSelectedGoal(g);
                    setAddedValue('1');
                  }}
                  className={`px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold shadow-sm transition flex items-center gap-1 ${
                    easyMode ? 'text-sm px-4 py-2' : 'text-xs'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Reportar Avance</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Report Modal */}
      {selectedGoal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleReport}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold text-sky-600 uppercase">Actualizar Meta</span>
                <h3 className="font-bold text-base text-slate-900">{selectedGoal.description}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedGoal(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ¿Cuánto avanzaste hoy? (en {selectedGoal.unit})
              </label>
              <input
                type="number"
                min="0.5"
                step="0.5"
                required
                value={addedValue}
                onChange={e => setAddedValue(e.target.value)}
                className="w-full text-sm p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Valor acumulado actual: {selectedGoal.currentValue} {selectedGoal.unit} (Meta total: {selectedGoal.targetValue} {selectedGoal.unit})
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ¿Cómo te sentiste haciéndolo? (Opcional)
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Ej. Caminé con la andadera sin fatigarse, me sentí con más fuerza en los pies..."
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 focus:outline-none"
              ></textarea>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center gap-2 text-xs text-amber-800">
              <Trophy className="w-4 h-4 text-amber-600 shrink-0" />
              <span>¡Ganarás <strong>+25 puntos de experiencia (XP)</strong> al registrar tu avance!</span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedGoal(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow transition"
              >
                Guardar y Sumar XP
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

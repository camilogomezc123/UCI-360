import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckSquare, CheckCircle2, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';

export const PortalDischarge: React.FC = () => {
  const { dischargeReadiness, toggleReadinessItem, easyMode } = useApp();

  const completedCount = dischargeReadiness.filter(i => i.status === 'completado').length;
  const totalCount = dischargeReadiness.length;
  const progressPct = Math.round((completedCount / totalCount) * 100);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completado':
        return (
          <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5" /> Completado
          </span>
        );
      case 'en_progreso':
        return (
          <span className="flex items-center gap-1 text-xs font-bold text-sky-700 bg-sky-100/70 px-2.5 py-1 rounded-full">
            <Clock className="w-3.5 h-3.5" /> En Revisión
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
            Pendiente
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className={`font-bold text-slate-900 ${easyMode ? 'text-xl' : 'text-base'}`}>
            📋 Preparación Segura para el Alta (Discharge Readiness)
          </h3>
          <p className={`text-slate-500 ${easyMode ? 'text-sm' : 'text-xs'}`}>
            Lista de chequeo institucional para asegurar una transición sin riesgos desde la UCI hacia la casa o piso.
          </p>
        </div>

        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3 self-start sm:self-auto">
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase">Progreso del Alta</div>
            <div className="text-xl font-bold text-emerald-600">{progressPct}%</div>
          </div>
          <div className="text-xs text-slate-500">
            {completedCount} de {totalCount} criterios listos
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {dischargeReadiness.map(item => (
          <div
            key={item.id}
            className={`p-5 rounded-2xl bg-white border transition shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              item.status === 'completado' ? 'border-emerald-200' : 'border-slate-200'
            }`}
          >
            <div className="space-y-1 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600">
                  {item.category}
                </span>
                <h4 className={`font-bold text-slate-900 ${easyMode ? 'text-base' : 'text-sm'}`}>
                  {item.title}
                </h4>
              </div>

              <p className={`text-slate-600 ${easyMode ? 'text-sm' : 'text-xs'}`}>
                {item.description}
              </p>

              <div className="text-[11px] text-slate-400 pt-1">
                Responsable: <strong>{item.responsible}</strong>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-center">
              {getStatusBadge(item.status)}
              <button
                onClick={() => toggleReadinessItem(item.id)}
                className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition"
              >
                Cambiar Estado
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

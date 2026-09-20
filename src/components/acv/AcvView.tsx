import React from 'react';
import { initialAcvCases } from '../../data/initialData';
import { Zap, Clock, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export const AcvView: React.FC = () => {
  const avgDoorToNeedle = Math.round(
    initialAcvCases.reduce((acc, c) => acc + c.doorToNeedleMin, 0) / initialAcvCases.length
  );
  const thrombolysisRate = Math.round(
    (initialAcvCases.filter(c => c.thrombolysisDone).length / initialAcvCases.length) * 100
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-sky-600 font-semibold text-xs tracking-wider uppercase mb-1">
            <Zap className="w-4 h-4" />
            <span>Centro de Excelencia en Ataque Cerebrovascular</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Programa de ACV Isquémico y Trombólisis / Trombectomía
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Métricas de tiempo puerta-aguja (&lt;45/60 min), puerta-punción inguinal, evolución NIHSS y disfagia precoz.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold">
          <Clock className="w-4 h-4 text-amber-600" />
          <span>Ventana Terapéutica: 4.5h / 24h</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-xs font-medium">Puerta - Aguja Promedio</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">{avgDoorToNeedle} min</div>
          <div className="text-[11px] text-emerald-700/80 mt-1">Meta nacional &lt; 60 min (Cumplida)</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-xs font-medium">Tasa de Trombólisis IV</div>
          <div className="text-2xl font-bold text-sky-600 mt-1">{thrombolysisRate}%</div>
          <div className="text-[11px] text-sky-700/80 mt-1">En pacientes elegibles en ventana</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-xs font-medium">Transformación Hemorrágica</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">0.0%</div>
          <div className="text-[11px] text-slate-400 mt-1">Seguridad estricta en infusión rtPA</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-xs font-medium">Tamizaje de Disfagia &lt; 24h</div>
          <div className="text-2xl font-bold text-purple-600 mt-1">100%</div>
          <div className="text-[11px] text-purple-700/80 mt-1">Prevención de broncoaspiración</div>
        </div>
      </div>

      {/* Cases Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 font-bold text-slate-800 text-sm">
          Casos en Seguimiento ACV
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-100">
              <tr>
                <th className="p-3">Código</th>
                <th className="p-3">Paciente</th>
                <th className="p-3">Ingreso</th>
                <th className="p-3">Puerta - Aguja</th>
                <th className="p-3">Trombectomía Mecánica</th>
                <th className="p-3">NIHSS Inicial → Egreso</th>
                <th className="p-3">Fonoaudiología</th>
                <th className="p-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {initialAcvCases.map(c => (
                <tr key={c.id} className="hover:bg-slate-50 transition">
                  <td className="p-3 font-mono font-bold text-slate-900">{c.code}</td>
                  <td className="p-3 font-semibold text-slate-800">
                    {c.patientName} <span className="text-slate-400 font-normal">({c.age}a)</span>
                  </td>
                  <td className="p-3 text-slate-500">{c.admissionTime}</td>
                  <td className="p-3">
                    <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {c.doorToNeedleMin} min
                    </span>
                  </td>
                  <td className="p-3">
                    {c.thrombectomyDone ? (
                      <span className="text-sky-700 font-semibold">Realizada ({c.doorToGroinMin}m)</span>
                    ) : (
                      <span className="text-slate-400">No requerida</span>
                    )}
                  </td>
                  <td className="p-3 font-semibold">
                    <span className="text-rose-600">{c.nihssInitial} pts</span>
                    <span className="text-slate-400 mx-1">→</span>
                    <span className="text-emerald-600">{c.nihssDischarge} pts</span>
                  </td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Evaluada
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 uppercase">
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

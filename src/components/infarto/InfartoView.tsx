import React from 'react';
import { initialInfartoCases } from '../../data/initialData';
import { HeartPulse, Clock, Activity, CheckCircle2 } from 'lucide-react';

export const InfartoView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-sky-600 font-semibold text-xs tracking-wider uppercase mb-1">
            <HeartPulse className="w-4 h-4" />
            <span>Centro de Excelencia Cardiovascular</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Síndrome Coronario Agudo (Infarto de Miocardio / SCA)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Métricas ACC/AHA: tiempo puerta-ECG (&lt;10 min), puerta-balón (&lt;90 min), adherencia DAPT y rehabilitación.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 text-xs font-semibold">
          <Activity className="w-4 h-4 text-rose-600" />
          <span>Hemodinamia 24/7 Activa</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-xs font-medium">Puerta - ECG &lt; 10 min</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">100%</div>
          <div className="text-[11px] text-emerald-700/80 mt-1">Tiempo promedio: 7.5 min</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-xs font-medium">Puerta - Balón (STEMI)</div>
          <div className="text-2xl font-bold text-sky-600 mt-1">64 min</div>
          <div className="text-[11px] text-sky-700/80 mt-1">Meta institucional: &lt; 90 min</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-xs font-medium">Adherencia a DAPT al Alta</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">100%</div>
          <div className="text-[11px] text-slate-400 mt-1">Aspirina + Inhibidor P2Y12</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-xs font-medium">Rehabilitación Cardíaca</div>
          <div className="text-2xl font-bold text-purple-600 mt-1">100%</div>
          <div className="text-[11px] text-purple-700/80 mt-1">Remisión activa en Fase I y II</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 font-bold text-slate-800 text-sm">
          Casos Clínicos de Síndrome Coronario Agudo
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-100">
              <tr>
                <th className="p-3">Código</th>
                <th className="p-3">Paciente</th>
                <th className="p-3">Diagnóstico</th>
                <th className="p-3">Puerta - ECG</th>
                <th className="p-3">Puerta - Balón</th>
                <th className="p-3">Troponinas Seriadas</th>
                <th className="p-3">Procedimiento Angioplastia</th>
                <th className="p-3">Ubicación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {initialInfartoCases.map(c => (
                <tr key={c.id} className="hover:bg-slate-50 transition">
                  <td className="p-3 font-mono font-bold text-slate-900">{c.code}</td>
                  <td className="p-3 font-semibold text-slate-800">
                    {c.patientName} <span className="text-slate-400 font-normal">({c.age}a)</span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      c.diagnosis === 'STEMI' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {c.diagnosis}
                    </span>
                  </td>
                  <td className="p-3 font-semibold text-emerald-600">{c.doorToEcgMin} min</td>
                  <td className="p-3 font-bold text-sky-700">
                    {c.doorToBalloonMin ? `${c.doorToBalloonMin} min` : 'No aplicable (NSTEMI)'}
                  </td>
                  <td className="p-3">
                    <span className="font-semibold text-slate-700">{c.troponinInitial}</span>
                    <span className="text-slate-400 mx-1">→</span>
                    <span className="font-bold text-rose-600">{c.troponinSerial} ng/L</span>
                  </td>
                  <td className="p-3">
                    {c.pciProcedure ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Stent medicado implantado
                      </span>
                    ) : (
                      <span className="text-slate-400">Manejo médico</span>
                    )}
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 uppercase">
                      {c.status.replace('_', ' ')}
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

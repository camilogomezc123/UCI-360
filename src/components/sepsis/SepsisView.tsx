import React, { useState } from 'react';
import { initialSepsisCases } from '../../data/initialData';
import { SepsisCase } from '../../types';
import {
  FlaskConical,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  ShieldCheck,
  TrendingDown,
  Activity
} from 'lucide-react';

export const SepsisView: React.FC = () => {
  const [cases, setCases] = useState<SepsisCase[]>(initialSepsisCases);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newPatient, setNewPatient] = useState('');
  const [newAge, setNewAge] = useState('65');
  const [newTriage, setNewTriage] = useState('Urgencias Adultos');

  const hour1Compliance = Math.round(
    (cases.filter(c => c.bundleHour1Completed).length / (cases.length || 1)) * 100
  );
  const abxUnderHour = Math.round(
    (cases.filter(c => c.timeToAbxMin <= 60).length / (cases.length || 1)) * 100
  );
  const lactateClearance = Math.round(
    (cases.filter(c => c.lactatePost < c.lactateInitial).length / (cases.length || 1)) * 100
  );

  const handleCreateCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatient.trim()) return;
    const newCase: SepsisCase = {
      id: `sep-${Date.now()}`,
      caseCode: `SEP-2026-${String(cases.length + 87).padStart(3, '0')}`,
      patientName: newPatient,
      age: parseInt(newAge) || 60,
      activationTime: new Date().toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' }),
      triageSource: newTriage,
      bundleHour1Completed: true,
      bundleHour3Completed: false,
      lactateInitial: 3.2,
      lactatePost: 2.1,
      bloodCulturesDrawn: true,
      broadSpectrumAbxGiven: true,
      timeToAbxMin: 35,
      fluidResuscitationGiven: true,
      mapTargetAchieved: true,
      status: 'activo'
    };
    setCases([newCase, ...cases]);
    setShowNewModal(false);
    setNewPatient('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-sky-600 font-semibold text-xs tracking-wider uppercase mb-1">
            <FlaskConical className="w-4 h-4" />
            <span>Centro de Excelencia en Sepsis</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Programa de Excelencia en Sepsis y Choque Séptico
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Vigilancia en tiempo cero, hora dorada (Bundle 1h y 3h), toma de hemocultivos y aclaramiento de lactato.
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs shadow transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Activar Código Sepsis</span>
        </button>
      </div>

      {/* Sepsis Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Cumplimiento Bundle Hora 1</span>
            <span className="font-bold text-emerald-600">{hour1Compliance}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${hour1Compliance}%` }}></div>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Meta institucional: &gt;85% en Urgencias y Hospitalización.</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Antibiótico &lt; 60 minutos</span>
            <span className="font-bold text-sky-600">{abxUnderHour}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div className="bg-sky-500 h-full rounded-full" style={{ width: `${abxUnderHour}%` }}></div>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Administración posterior a toma de hemocultivos.</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Aclaramiento de Lactato a las 2-4h</span>
            <span className="font-bold text-purple-600">{lactateClearance}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div className="bg-purple-500 h-full rounded-full" style={{ width: `${lactateClearance}%` }}></div>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Disminución &gt;20% del valor basal o normalización.</p>
        </div>
      </div>

      {/* Sepsis Cases Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 font-bold text-slate-800 text-sm flex items-center justify-between">
          <span>Casos Recientes de Código Sepsis</span>
          <span className="text-xs text-slate-500 font-normal">Trazabilidad en tiempo real</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-100">
              <tr>
                <th className="p-3">Código</th>
                <th className="p-3">Paciente</th>
                <th className="p-3">Activación / Origen</th>
                <th className="p-3">Bundle 1h</th>
                <th className="p-3">Tiempo Antibiótico</th>
                <th className="p-3">Lactato (Inicial → Control)</th>
                <th className="p-3">PAM &gt; 65</th>
                <th className="p-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cases.map(c => (
                <tr key={c.id} className="hover:bg-slate-50 transition">
                  <td className="p-3 font-mono font-bold text-slate-900">{c.caseCode}</td>
                  <td className="p-3 font-semibold text-slate-800">
                    {c.patientName} <span className="text-slate-400 font-normal">({c.age}a)</span>
                  </td>
                  <td className="p-3">
                    <div className="text-slate-800">{c.triageSource}</div>
                    <div className="text-[10px] text-slate-400">{c.activationTime}</div>
                  </td>
                  <td className="p-3">
                    {c.bundleHour1Completed ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" /> Completo
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock className="w-3 h-3" /> En curso
                      </span>
                    )}
                  </td>
                  <td className="p-3 font-bold text-slate-800">
                    <span className={c.timeToAbxMin <= 60 ? 'text-emerald-600' : 'text-rose-600'}>
                      {c.timeToAbxMin} min
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="font-semibold text-rose-600">{c.lactateInitial}</span>
                    <span className="text-slate-400 mx-1">→</span>
                    <span className="font-semibold text-emerald-600">{c.lactatePost} mmol/L</span>
                  </td>
                  <td className="p-3">
                    {c.mapTargetAchieved ? (
                      <span className="text-emerald-600 font-semibold">Sí (&gt;65)</span>
                    ) : (
                      <span className="text-rose-600 font-semibold">No (&lt;65)</span>
                    )}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        c.status === 'recuperado'
                          ? 'bg-emerald-100 text-emerald-800'
                          : c.status === 'activo'
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {c.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Sepsis Activation Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateCase}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">Activar Nuevo Código Sepsis</h3>
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre Completo del Paciente</label>
              <input
                type="text"
                required
                value={newPatient}
                onChange={e => setNewPatient(e.target.value)}
                placeholder="Ej. Carmen Teresa Salazar"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Edad</label>
                <input
                  type="number"
                  value={newAge}
                  onChange={e => setNewAge(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Servicio de Activación</label>
                <select
                  value={newTriage}
                  onChange={e => setNewTriage(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white"
                >
                  <option value="Urgencias Adultos">Urgencias Adultos</option>
                  <option value="Hospitalización Piso 3">Hospitalización Piso 3</option>
                  <option value="Hospitalización Piso 4">Hospitalización Piso 4</option>
                  <option value="Quirófano / Recuperación">Quirófano / Recuperación</option>
                </select>
              </div>
            </div>

            <div className="p-3 bg-sky-50 rounded-xl text-[11px] text-sky-800 space-y-1">
              <div className="font-bold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-sky-600" />
                <span>Acciones inmediatas automáticas activadas:</span>
              </div>
              <div>• Notificación a laboratorio para hemocultivos x 2 pares prioritarios.</div>
              <div>• Alerta a farmacia clínica para antibiótico en &lt; 60 min.</div>
              <div>• Marcación de tiempo cero para medición seriada de lactato.</div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-sky-600 hover:bg-sky-700 text-white shadow transition"
              >
                Confirmar Activación
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

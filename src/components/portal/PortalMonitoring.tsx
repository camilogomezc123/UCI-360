import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Activity, Plus, Heart, Thermometer, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

export const PortalMonitoring: React.FC = () => {
  const { homeReadings, addHomeReading, easyMode } = useApp();
  const [systolic, setSystolic] = useState('120');
  const [diastolic, setDiastolic] = useState('80');
  const [heartRate, setHeartRate] = useState('75');
  const [temperature, setTemperature] = useState('36.5');
  const [spo2, setSpo2] = useState('97');
  const [painScale, setPainScale] = useState('2');
  const [notes, setNotes] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addHomeReading({
      systolicBp: parseInt(systolic) || 120,
      diastolicBp: parseInt(diastolic) || 80,
      heartRate: parseInt(heartRate) || 75,
      temperature: parseFloat(temperature) || 36.5,
      spo2: parseInt(spo2) || 97,
      painScale: parseInt(painScale) || 0,
      notes: notes.trim() ? notes : undefined
    });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    setNotes('');
  };

  const latest = homeReadings[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className={`font-bold text-slate-900 ${easyMode ? 'text-xl' : 'text-base'}`}>
            🩺 Monitoreo de Signos Vitales en Casa
          </h3>
          <p className={`text-slate-500 ${easyMode ? 'text-sm' : 'text-xs'}`}>
            Registra tus signos vitales diarios. Tu equipo médico del programa PICS revisa estos valores antes de tu consulta.
          </p>
        </div>
      </div>

      {/* Latest Status Glance */}
      {latest && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm text-center">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Presión Arterial</div>
            <div className="text-lg font-bold text-slate-900 mt-0.5">
              {latest.systolicBp}/{latest.diastolicBp} <span className="text-xs font-normal text-slate-500">mmHg</span>
            </div>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm text-center">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Pulso</div>
            <div className="text-lg font-bold text-slate-900 mt-0.5">
              {latest.heartRate} <span className="text-xs font-normal text-slate-500">lpm</span>
            </div>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm text-center">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Oxígeno (SpO2)</div>
            <div className="text-lg font-bold text-emerald-600 mt-0.5">
              {latest.spo2}%
            </div>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm text-center">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Temperatura</div>
            <div className="text-lg font-bold text-slate-900 mt-0.5">
              {latest.temperature}°C
            </div>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm text-center col-span-2 sm:col-span-1">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Dolor (0-10)</div>
            <div className="text-lg font-bold text-slate-900 mt-0.5">
              {latest.painScale} / 10
            </div>
          </div>
        </div>
      )}

      {/* Logging Form */}
      <form onSubmit={handleSubmit} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <h4 className="font-bold text-slate-800 text-sm flex items-center justify-between">
          <span>Registrar Nueva Medición</span>
          <span className="text-xs text-amber-600 font-medium flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> +20 XP
          </span>
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Sistólica (mmHg)</label>
            <input
              type="number"
              required
              value={systolic}
              onChange={e => setSystolic(e.target.value)}
              className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Diastólica (mmHg)</label>
            <input
              type="number"
              required
              value={diastolic}
              onChange={e => setDiastolic(e.target.value)}
              className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Frecuencia (lpm)</label>
            <input
              type="number"
              required
              value={heartRate}
              onChange={e => setHeartRate(e.target.value)}
              className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">SpO2 Oxígeno (%)</label>
            <input
              type="number"
              required
              value={spo2}
              onChange={e => setSpo2(e.target.value)}
              className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Temperatura (°C)</label>
            <input
              type="number"
              step="0.1"
              required
              value={temperature}
              onChange={e => setTemperature(e.target.value)}
              className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Dolor (0 nada - 10 máx)</label>
            <input
              type="number"
              min="0"
              max="10"
              required
              value={painScale}
              onChange={e => setPainScale(e.target.value)}
              className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Observaciones o circunstancias (Opcional)</label>
          <input
            type="text"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Ej. Tomado en reposo 15 min después del desayuno"
            className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sky-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          {showSuccess && (
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> ¡Medición guardada correctamente!
            </span>
          )}
          <div className="ml-auto">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs shadow transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Guardar Signos Vitales</span>
            </button>
          </div>
        </div>
      </form>

      {/* History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 font-bold text-slate-800 text-sm">
          Historial de Mediciones Recientes ({homeReadings.length})
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-100">
              <tr>
                <th className="p-3">Fecha y Hora</th>
                <th className="p-3">Presión (mmHg)</th>
                <th className="p-3">Pulso (lpm)</th>
                <th className="p-3">SpO2 (%)</th>
                <th className="p-3">Temp (°C)</th>
                <th className="p-3">Dolor</th>
                <th className="p-3">Notas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {homeReadings.map(r => (
                <tr key={r.id} className="hover:bg-slate-50 transition">
                  <td className="p-3 font-medium text-slate-800">{r.recordedAt}</td>
                  <td className="p-3 font-semibold text-slate-900">{r.systolicBp} / {r.diastolicBp}</td>
                  <td className="p-3">{r.heartRate}</td>
                  <td className="p-3 font-bold text-emerald-600">{r.spo2}%</td>
                  <td className="p-3">{r.temperature}°C</td>
                  <td className="p-3">{r.painScale} / 10</td>
                  <td className="p-3 text-slate-500 italic">{r.notes || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

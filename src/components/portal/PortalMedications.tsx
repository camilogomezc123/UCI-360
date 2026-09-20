import React from 'react';
import { useApp } from '../../context/AppContext';
import { Pill, CheckCircle2, Clock, ShieldAlert, Sparkles } from 'lucide-react';

export const PortalMedications: React.FC = () => {
  const { medications, toggleMedicationTaken, easyMode } = useApp();

  const totalDoses = medications.reduce((acc, m) => acc + m.scheduleTimes.length, 0);
  const takenDoses = medications.reduce((acc, m) => acc + m.takenToday.filter(Boolean).length, 0);
  const adherencePct = totalDoses > 0 ? Math.round((takenDoses / totalDoses) * 100) : 100;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className={`font-bold text-slate-900 ${easyMode ? 'text-xl' : 'text-base'}`}>
            💊 Medicamentos y Horarios
          </h3>
          <p className={`text-slate-500 ${easyMode ? 'text-sm' : 'text-xs'}`}>
            Fórmula conciliada al egreso por el equipo de química farmacéutica de la Clínica de Occidente.
          </p>
        </div>

        {/* Adherence Card */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 self-start sm:self-auto">
          <div>
            <div className="text-[11px] text-slate-400 font-semibold uppercase">Adherencia de Hoy</div>
            <div className="text-xl font-bold text-emerald-600">{adherencePct}% tomada</div>
          </div>
          <div className="text-right text-xs text-slate-500">
            {takenDoses} de {totalDoses} tomas completadas
          </div>
        </div>
      </div>

      {/* Medication List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {medications.map(med => (
          <div
            key={med.id}
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 hover:border-slate-300 transition"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-sky-50 text-sky-700 uppercase mb-1">
                  {med.indicatedFor}
                </div>
                <h4 className={`font-bold text-slate-900 ${easyMode ? 'text-lg' : 'text-base'}`}>
                  {med.name} <span className="text-sky-600 font-semibold">{med.dosage}</span>
                </h4>
                <div className="text-xs text-slate-500 mt-0.5">{med.frequency} • Vía {med.route}</div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600">
              <strong>Indicación:</strong> {med.instructions}
            </div>

            <div className="space-y-2 pt-1 border-t border-slate-100">
              <div className="text-xs font-semibold text-slate-700">Tomas programadas para hoy:</div>
              <div className="flex flex-wrap gap-2">
                {med.scheduleTimes.map((time, idx) => {
                  const isTaken = med.takenToday[idx];
                  return (
                    <button
                      key={idx}
                      onClick={() => toggleMedicationTaken(med.id, idx)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition border ${
                        isTaken
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <CheckCircle2 className={`w-4 h-4 ${isTaken ? 'text-emerald-600 fill-emerald-100' : 'text-slate-300'}`} />
                      <span>{time}</span>
                      <span className="text-[10px] text-slate-400">
                        {isTaken ? 'Tomada' : 'Pendiente'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-sky-50 border border-sky-100 rounded-xl flex items-center gap-3 text-xs text-sky-800">
        <Sparkles className="w-5 h-5 text-sky-600 shrink-0" />
        <div>
          <strong>Recuerda:</strong> Nunca suspendas ni modifiques las dosis de tus medicamentos sin consultar antes con tu médico tratante en el control ambulatorio PICS o mediante el buzón de apoyo.
        </div>
      </div>
    </div>
  );
};

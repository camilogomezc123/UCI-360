import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Award, Calendar, MapPin, CheckCircle2, Clock, FileText, User, Sparkles, ArrowRight } from 'lucide-react';
import { AgendamientoPostUci30Dias } from '../posuci/AgendamientoPostUci30Dias';

export const PortalPassport: React.FC = () => {
  const { currentCase, agenda, easyMode } = useApp();
  const [showStitchModal, setShowStitchModal] = useState(false);

  if (showStitchModal) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setShowStitchModal(false)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-200 text-slate-800 text-xs font-bold hover:bg-slate-300 transition"
        >
          ← Volver a Pasaporte y Agenda General
        </button>
        <AgendamientoPostUci30Dias onBack={() => setShowStitchModal(false)} />
      </div>
    );
  }

  const day30Appt = agenda.find(a => a.id.startsWith('agenda-day30'));

  return (
    <div className="space-y-6">
      {/* Stitch Milestone 30-Day Highlight Banner */}
      <div className={`rounded-2xl p-5 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border ${
        day30Appt ? 'bg-gradient-to-r from-emerald-900 to-teal-800 border-emerald-400/40' : 'bg-gradient-to-r from-[#005c55] to-[#0f766e] border-teal-400/30'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center text-xl shrink-0">
            {day30Appt ? '✅' : '⭐'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                day30Appt ? 'bg-emerald-400 text-slate-950' : 'bg-amber-400 text-slate-900'
              }`}>
                {day30Appt ? 'Cita Programada' : 'Hito Clave Día 30'}
              </span>
              <span className="text-xs text-teal-200">Paleta Stitch</span>
            </div>
            <h3 className="font-bold text-base sm:text-lg text-white mt-1">
              Agendamiento Consulta Integral Post-UCI (30 Días)
            </h3>
            <p className="text-xs text-teal-100 max-w-xl mt-0.5">
              {day30Appt 
                ? `Cita confirmada para el ${day30Appt.dateTime}. ${day30Appt.location}.`
                : 'Sesión unificada de 90 min con Intensivista, Fisioterapia, Neuropsicología y Psicología con soporte de movilidad.'
              }
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowStitchModal(true)}
          className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs shadow-md hover:shadow-lg transition flex items-center gap-1.5 shrink-0"
        >
          <span>{day30Appt ? 'Ver / Modificar Cita' : 'Abrir Agendamiento Stitch'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Recovery Passport Summary Card */}
      <div className="bg-gradient-to-br from-[#0d2340] to-[#1a4270] rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sky-300 text-xs font-semibold border border-white/15">
              <Award className="w-3.5 h-3.5" />
              <span>Pasaporte Oficial de Recuperación PosUCI</span>
            </div>

            <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-white/20 text-white font-bold">
              {currentCase.caseNumber}
            </span>
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">{currentCase.patientName}</h2>
            <div className="text-xs text-sky-200 mt-0.5">
              Identificación: {currentCase.patientIdDoc} • {currentCase.patientAge} años • Sexo {currentCase.patientSex === 'F' ? 'Femenino' : 'Masculino'}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-white/15 text-center">
            <div className="p-3 bg-white/10 rounded-xl">
              <div className="text-[11px] text-white/70">Estancia en UCI</div>
              <div className="text-lg font-bold text-white mt-0.5">{currentCase.icuLosDays} días</div>
            </div>
            <div className="p-3 bg-white/10 rounded-xl">
              <div className="text-[11px] text-white/70">Ventilación Mecánica</div>
              <div className="text-lg font-bold text-white mt-0.5">{currentCase.mechanicalVentilationDays} días</div>
            </div>
            <div className="p-3 bg-white/10 rounded-xl">
              <div className="text-[11px] text-white/70">Barthel Egreso</div>
              <div className="text-lg font-bold text-white mt-0.5">{currentCase.barthelAtDischarge} / 100</div>
            </div>
            <div className="p-3 bg-white/10 rounded-xl">
              <div className="text-[11px] text-white/70">Fuerza MRC</div>
              <div className="text-lg font-bold text-white mt-0.5">{currentCase.mrcTotal} / 60</div>
            </div>
          </div>
        </div>
      </div>

      {/* Coordinated Agenda */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className={`font-bold text-slate-900 ${easyMode ? 'text-xl' : 'text-base'}`}>
            🗓️ Tu Agenda Coordinada de Citas PosUCI
          </h3>
          <span className="text-xs text-slate-500">Clínica de Occidente</span>
        </div>

        <div className="space-y-3">
          {agenda.map(item => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 hover:border-slate-300 transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-sky-50 text-sky-600">
                    <Calendar className="w-4 h-4" />
                  </span>
                  <div>
                    <h4 className={`font-bold text-slate-900 ${easyMode ? 'text-lg' : 'text-sm'}`}>
                      {item.specialty}
                    </h4>
                    <div className="text-xs text-slate-500">{item.professionalName}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-sky-700 bg-sky-50 px-3 py-1 rounded-full inline-block border border-sky-200">
                    {item.dateTime}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{item.location}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
                <strong>Instrucciones para la cita:</strong> {item.instructions}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

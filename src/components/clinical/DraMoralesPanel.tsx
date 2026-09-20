import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  UserCheck,
  FileText,
  Activity,
  Send,
  PlusCircle,
  ExternalLink,
  ChevronRight,
  Stethoscope,
  Award,
  Sparkles
} from 'lucide-react';
import { FhirCarePlan } from '../../types';

export const DraMoralesPanel: React.FC = () => {
  const {
    validatedActivities,
    validateActivity,
    requestActivityRevision,
    crisisAlerts,
    dismissCrisisAlert,
    addNewCarePlan,
    carePlans,
    setMode
  } = useApp();

  const [selectedActivityId, setSelectedActivityId] = useState<string>(
    validatedActivities[0]?.id || ''
  );
  const [feedbackInput, setFeedbackInput] = useState('');
  const [showPrescribeModal, setShowPrescribeModal] = useState(false);

  // New CarePlan form
  const [cpCode, setCpCode] = useState('229174000');
  const [cpTitle, setCpTitle] = useState('Nutrición Hiperproteica y Mantenimiento de Masa Magra Post-UCI');
  const [cpDose, setCpDose] = useState('1.5 g/kg/día proteína con suplemento enriquecido en leucina post-terapia');

  const selectedActivity = validatedActivities.find(a => a.id === selectedActivityId) || validatedActivities[0];

  const handleValidate = () => {
    if (!selectedActivity) return;
    const defaultText = feedbackInput.trim() || 'Excelente ejecución. Se aprueba la continuidad de las series prescritas sin evidencia de inestabilidad hemodinámica ni fatiga desproporcionada.';
    validateActivity(selectedActivity.id, defaultText);
    setFeedbackInput('');
  };

  const handleRequestRevision = () => {
    if (!selectedActivity) return;
    const revisionNote = feedbackInput.trim() || 'Por favor verificar tiempo de descanso entre repeticiones y nueva medición de SpO2.';
    requestActivityRevision(selectedActivity.id, revisionNote);
    setFeedbackInput('');
  };

  const handlePrescribeCarePlan = (e: React.FormEvent) => {
    e.preventDefault();
    const newPlan: FhirCarePlan = {
      resourceType: 'CarePlan',
      id: `CP-PICS-NUT-${Date.now().toString().slice(-4)}`,
      status: 'active',
      intent: 'order',
      subject: {
        reference: 'Patient/PICS-2024-8841',
        display: 'Carlos Alberto Mendoza Ramos'
      },
      author: {
        reference: 'Practitioner/MED-MORALES-09',
        display: 'Dra. Andrea Morales (Intensivista Titular)'
      },
      activity: [
        {
          detail: {
            code: {
              coding: [
                {
                  system: 'http://snomed.info/sct',
                  code: cpCode,
                  display: cpTitle
                }
              ],
              text: cpTitle
            },
            status: 'scheduled',
            scheduledTiming: {
              repeat: {
                frequency: 1,
                period: 1,
                periodUnit: 'd',
                timeOfDay: ['12:00:00']
              }
            },
            description: cpDose
          }
        }
      ]
    };

    addNewCarePlan(newPlan);
    setShowPrescribeModal(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-lg shrink-0">
              AM
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-sky-400 uppercase tracking-widest">
                  Panel Clínico de Validación Médica
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Ley 527 Certificada
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Dra. Andrea Morales
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">
                Intensivista Titular & Validador Clínico • Programa PICS Clínica de Occidente
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPrescribeModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-600 text-white shadow-md transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Prescribir Nuevo CarePlan</span>
            </button>

            <button
              onClick={() => setMode('fhir-traceability')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-slate-200 transition"
            >
              <Activity className="w-4 h-4 text-sky-400" />
              <span>Ver Trazabilidad FHIR</span>
            </button>
          </div>
        </div>
      </div>

      {/* Principle 5: Active Safety Alerts Table */}
      {crisisAlerts.filter(a => a.status === 'activa').length > 0 && (
        <div className="bg-red-50 border-2 border-red-500/80 rounded-2xl p-5 text-red-950 shadow-md">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2 font-black text-sm text-red-900 uppercase tracking-wider">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span>Alertas de Seguridad Clínica Desacopladas (Enfermera de Enlace Laura Galarza)</span>
            </div>
            <span className="text-xs font-bold bg-red-600 text-white px-2.5 py-0.5 rounded-full">
              Prioridad UCI
            </span>
          </div>

          <div className="space-y-2">
            {crisisAlerts.filter(a => a.status === 'activa').map(alert => (
              <div key={alert.id} className="bg-white p-3.5 rounded-xl border border-red-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-slate-900">{alert.patientName} • <span className="text-red-700">{alert.vitalMetric}</span></div>
                  <div className="text-xs text-slate-600 mt-0.5">{alert.triggerReason}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5 font-mono">Protocolo despachado a: {alert.dispatchedTo}</div>
                </div>
                <button
                  onClick={() => dismissCrisisAlert(alert.id)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                >
                  Marcar como Atendida
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Validation Split: Left Queue, Right Audit Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Queue of activities */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Bandeja de Actividades a Certificar
            </h3>
            <span className="text-xs font-bold text-slate-400">{validatedActivities.length} registros</span>
          </div>

          <div className="space-y-2.5">
            {validatedActivities.map((act) => {
              const isSelected = act.id === selectedActivity?.id;
              return (
                <div
                  key={act.id}
                  onClick={() => setSelectedActivityId(act.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-sky-50 border-sky-400 shadow-md ring-1 ring-sky-300'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono font-bold text-slate-600">{act.code}</span>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                      act.status === 'validado_clinicamente'
                        ? 'bg-emerald-100 text-emerald-800'
                        : act.status === 'por_revisar'
                        ? 'bg-amber-100 text-amber-800'
                        : act.status === 'alerta_crisis'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-sky-100 text-sky-800'
                    }`}>
                      {act.status === 'validado_clinicamente' && 'Certificado'}
                      {act.status === 'pendiente_validacion' && 'Pendiente'}
                      {act.status === 'por_revisar' && 'Por revisar'}
                      {act.status === 'alerta_crisis' && 'Crisis'}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm mt-1.5 leading-snug">
                    {act.title}
                  </h4>

                  <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                    <span>{act.patientName.split(' ')[0]}</span>
                    <span>{act.recordedAt}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Audit & Clinical Feedback */}
        <div className="lg:col-span-8">
          {selectedActivity ? (
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-lg space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                      {selectedActivity.code}
                    </span>
                    <span className="text-xs text-slate-400">Paciente: {selectedActivity.patientName}</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
                    {selectedActivity.title}
                  </h3>
                  <div className="text-xs text-slate-500 mt-0.5">
                    CarePlan de origen: <span className="font-mono text-slate-700">{selectedActivity.carePlanId}</span>
                  </div>
                </div>

                <div className="self-start sm:self-center">
                  <span className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                    selectedActivity.status === 'validado_clinicamente'
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : selectedActivity.status === 'por_revisar'
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-sky-100 text-sky-900 border border-sky-300'
                  }`}>
                    {selectedActivity.status === 'validado_clinicamente' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    <span>Estado: {selectedActivity.status.replace('_', ' ').toUpperCase()}</span>
                  </span>
                </div>
              </div>

              {/* Biometrics Audit Panel */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                  Biometría Post-Esfuerzo Reportada
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                    <div className="text-[10px] uppercase font-bold text-slate-500">Dosis Realizada</div>
                    <div className="text-sm font-black text-slate-900 mt-0.5">{selectedActivity.performedDose}</div>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                    <div className="text-[10px] uppercase font-bold text-slate-500">Escala Borg</div>
                    <div className="text-sm font-black text-slate-900 mt-0.5">{selectedActivity.borgDescription}</div>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                    <div className="text-[10px] uppercase font-bold text-slate-500">Frecuencia Cardíaca</div>
                    <div className="text-sm font-black text-slate-900 mt-0.5">{selectedActivity.heartRate} lpm</div>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                    <div className="text-[10px] uppercase font-bold text-slate-500">Oximetría SpO2</div>
                    <div className="text-sm font-black text-slate-900 mt-0.5">{selectedActivity.spo2}%</div>
                    <div className="text-[10px] text-sky-700 font-semibold">{selectedActivity.deviceSync}</div>
                  </div>
                </div>
              </div>

              {/* Caregiver Bitácora */}
              <div className="p-4 bg-sky-50/70 border border-sky-200 rounded-2xl">
                <div className="text-xs font-bold text-sky-950 mb-1">
                  Reporte del Cuidador Acompañante ({selectedActivity.caregiverName}):
                </div>
                <p className="text-xs text-sky-900 italic font-medium">
                  "{selectedActivity.caregiverNote}"
                </p>
              </div>

              {/* Existing or New Clinical Validation */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Devolución Clínica & Recomendaciones Médicas
                  </label>
                  <span className="text-[11px] text-slate-400 font-medium">
                    Se generará firma electrónica certificada Ley 527
                  </span>
                </div>

                <textarea
                  value={feedbackInput || (selectedActivity.clinicalValidation?.feedbackText || '')}
                  onChange={(e) => setFeedbackInput(e.target.value)}
                  placeholder="Escribe la recomendación clínica o ajustes al plan (ej. 'Excelente ejecución, Carlos y Lucía...')."
                  className="w-full p-3.5 text-xs rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium text-slate-800 leading-relaxed"
                  rows={4}
                />

                {selectedActivity.clinicalValidation && (
                  <div className="text-[11px] text-slate-500 bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center justify-between">
                    <span>Certificado por: <strong>{selectedActivity.clinicalValidation.validatorName}</strong> ({selectedActivity.clinicalValidation.validationTimestamp})</span>
                    <span className="font-mono text-emerald-800">Ley 527 • RETHUS Verificado</span>
                  </div>
                )}

                {/* Validation Actions */}
                <div className="flex flex-wrap items-center justify-end gap-3 pt-3">
                  <button
                    onClick={handleRequestRevision}
                    className="px-4 py-2.5 rounded-xl font-bold text-xs bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 transition"
                  >
                    ⚠️ Solicitar Ajuste / Por Revisar
                  </button>

                  <button
                    onClick={handleValidate}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Certificar y Firmar Digitalmente (Ley 527)</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center text-slate-400">
              Selecciona una actividad para auditar
            </div>
          )}
        </div>
      </div>

      {/* Prescribe CarePlan Modal */}
      {showPrescribeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-sky-600" />
                <h3 className="font-bold text-slate-900 text-lg">
                  Prescribir Nuevo CarePlan HL7-FHIR R4
                </h3>
              </div>
              <button onClick={() => setShowPrescribeModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handlePrescribeCarePlan} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Título de la Guía o Intervención</label>
                <input
                  type="text"
                  value={cpTitle}
                  onChange={(e) => setCpTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Código SNOMED-CT</label>
                <input
                  type="text"
                  value={cpCode}
                  onChange={(e) => setCpCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Dosis Prescrita y Metas</label>
                <textarea
                  value={cpDose}
                  onChange={(e) => setCpDose(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                  rows={3}
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPrescribeModal(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-sky-600 hover:bg-sky-700 text-white rounded-xl shadow-md"
                >
                  Publicar CarePlan en FHIR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

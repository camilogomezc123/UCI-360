import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileCode2,
  Copy,
  Check,
  Sparkles,
  Layers,
  Activity,
  AlertTriangle,
  Play,
  Download,
  Terminal,
  ShieldAlert,
  Share2,
  ExternalLink,
  BookOpen
} from 'lucide-react';

export const FhirTraceabilityView: React.FC = () => {
  const {
    carePlans,
    fhirObservations,
    crisisAlerts,
    triggerCrisisSimulation,
    addNewCarePlan,
    setMode
  } = useApp();

  const [activeTab, setActiveTab] = useState<'careplan' | 'observation' | 'system_prompt' | 'simulator'>('careplan');
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const systemInstructionsPrompt = `Eres el Asistente Clínico y Motor de Interoperabilidad de ÁGORA & POSUCI 360, una plataforma hospitalaria y comunitaria desarrollada para la Clínica de Occidente, orientada a la humanización en UCI y la recuperación integral del Síndrome Post-Cuidados Intensivos (PICS).

PRINCIPIOS CLÍNICOS Y ÉTICOS INVIOLABLES:
1. DESACOPLAMIENTO CLÍNICO VS. GAMIFICACIÓN: Los puntos, rachas e insignias reconocen la constancia y participación diaria del paciente o cuidador. NUNCA representan un indicador diagnóstico, pronóstico, de curación ni de alta médica. Toda respuesta debe mantener esta frontera explícita.
2. VALIDACIÓN PROFESIONAL OBLIGATORIA: Toda actividad física, respiratoria (ej. Triflo), nutricional o motora registrada por el paciente o familia se mantiene en estado "Pendiente de Validación" hasta ser certificada por el equipo de medicina intensiva, enfermería o fisioterapia. Si el paciente edita un registro previo, este regresa automáticamente a estado "Por revisar".
3. NO INVENTAR BIOMETRÍA: Solo procesa o reporta signos vitales provenientes de dispositivos validados (ej. tensiómetro/oxímetro Bluetooth OMRON Serie 7 o digitación manual explícita). No asumas frecuencias ni saturaciones sin registro.
4. INTEROPERABILIDAD HL7 / FHIR R4: Genera e interpreta recursos estándar (CarePlan, Observation, DiagnosticReport, Appointment, Communication) vinculados a la historia clínica de la Clínica de Occidente bajo los códigos SNOMED-CT y LOINC correspondientes.
5. SEGURIDAD Y LÍNEA DE CRISIS: Si se detecta un signo de alarma (PAM fuera de metas, Borg > 4 con dolor o disnea de reposo), prioriza la activación de la enfermera de enlace o la línea de crisis hospitalaria (123 / Urgencias Clínica de Occidente).`;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-900/50 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 font-black text-2xl shadow-inner shrink-0">
              <FileCode2 className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
                  Estándar Internacional HL7 FHIR R4
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-xs text-emerald-400 font-semibold">Trazabilidad en Vivo</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Mapa de Interoperabilidad & Contratos de Datos
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">
                Contratos FHIR R4, SNOMED-CT y LOINC de ÁGORA & POSUCI 360 • Clínica de Occidente
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setMode('portal')}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-slate-200 transition"
            >
              Regresar al Portal PosUCI
            </button>
            <button
              onClick={() => setMode('dra-morales')}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition"
            >
              Panel Dra. Morales
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('careplan')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'careplan'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>CarePlan ({carePlans.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('observation')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'observation'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Observation ({fhirObservations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('simulator')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'simulator'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Play className="w-4 h-4" />
          <span>Simulador de Eventos Clínicos</span>
        </button>

        <button
          onClick={() => setActiveTab('system_prompt')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'system_prompt'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>System Prompt Google AI Studio</span>
        </button>
      </div>

      {/* Tab 1: CarePlan JSON Viewer */}
      {activeTab === 'careplan' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Recursos FHIR R4: CarePlan (Prescripciones Clínicas Activas)
              </h3>
              <p className="text-xs text-slate-500">
                Prescrito por Dra. Andrea Morales (Practitioner/MED-MORALES-09) para Carlos Alberto Mendoza Ramos.
              </p>
            </div>
            <button
              onClick={() => copyToClipboard(JSON.stringify(carePlans, null, 2), 'careplans')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            >
              {copied === 'careplans' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied === 'careplans' ? 'Copiado' : 'Copiar JSON'}</span>
            </button>
          </div>

          <div className="bg-slate-900 text-slate-100 rounded-3xl p-6 font-mono text-xs overflow-x-auto shadow-inner border border-slate-800 leading-relaxed max-h-[500px]">
            <pre>{JSON.stringify(carePlans, null, 2)}</pre>
          </div>
        </div>
      )}

      {/* Tab 2: Observation JSON Viewer */}
      {activeTab === 'observation' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Recursos FHIR R4: Observation (Validaciones y Signos Vitales)
              </h3>
              <p className="text-xs text-slate-500">
                Contiene componentes de Escala Borg Adaptada, Frecuencia Cardíaca, Oximetría y notas certificadas.
              </p>
            </div>
            <button
              onClick={() => copyToClipboard(JSON.stringify(fhirObservations, null, 2), 'observations')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            >
              {copied === 'observations' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied === 'observations' ? 'Copiado' : 'Copiar JSON'}</span>
            </button>
          </div>

          <div className="bg-slate-900 text-slate-100 rounded-3xl p-6 font-mono text-xs overflow-x-auto shadow-inner border border-slate-800 leading-relaxed max-h-[500px]">
            <pre>{JSON.stringify(fhirObservations, null, 2)}</pre>
          </div>
        </div>
      )}

      {/* Tab 3: Interactive Simulation Suite */}
      {activeTab === 'simulator' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Simulador de Eventos Clínicos para Google AI Studio
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Ejecuta en tiempo real las pruebas requeridas en las instrucciones del sistema para verificar que el desacoplamiento clínico y los disparadores FHIR operan con total precisión.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Simulation 1: SpO2 Crisis */}
              <div className="p-5 rounded-2xl bg-red-50/60 border border-red-200 space-y-3">
                <div className="flex items-center gap-2 text-red-800 font-bold text-xs uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span>Prueba 1: Desaturación Crítica (SpO2 89%)</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">
                  Alerta desacoplada a Enfermera de Enlace
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Genera el recurso FHIR Observation de emergencia con SpO2 89% y frecuencia 106 lpm. Activa inmediatamente el banner de crisis sin afectar la gamificación diaria.
                </p>
                <button
                  onClick={() => {
                    triggerCrisisSimulation(89, 106, 'Simulación AI Studio: Desaturación súbita SpO2 89% en Carlos Mendoza durante bipedestación.');
                    setActiveTab('observation');
                  }}
                  className="w-full py-2 px-3 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white transition shadow-sm"
                >
                  Ejecutar Simulación SpO2 89%
                </button>
              </div>

              {/* Simulation 2: High-Protein CarePlan Sync */}
              <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Prueba 2: Nutrición Hiperproteica</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">
                  Sincronización de CarePlan Nutricional
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Genera una nueva ficha de educación personalizada para nutrición hiperproteica (SNOMED 229174000) y la sincroniza con el CarePlan de POSUCI 360.
                </p>
                <button
                  onClick={() => {
                    addNewCarePlan({
                      resourceType: 'CarePlan',
                      id: `CP-PICS-NUT-AI-${Date.now().toString().slice(-4)}`,
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
                                  code: '439925006',
                                  display: 'Régimen de suplementación hiperproteica post-UCI'
                                }
                              ],
                              text: 'Guía de Nutrición Hiperproteica para la Preservación Muscular'
                            },
                            status: 'scheduled',
                            scheduledTiming: {
                              repeat: {
                                frequency: 2,
                                period: 1,
                                periodUnit: 'd',
                                timeOfDay: ['09:00:00', '15:00:00']
                              }
                            },
                            description: 'Aporte de 1.6 g/kg/día con módulo de leucina post-ejercicio físico.'
                          }
                        }
                      ]
                    });
                    setActiveTab('careplan');
                  }}
                  className="w-full py-2 px-3 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-sm"
                >
                  Sincronizar CarePlan Nutricional
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: System Instructions for AI Studio */}
      {activeTab === 'system_prompt' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                System Instructions para Google AI Studio (Gemini 1.5 Pro / Flash)
              </h3>
              <p className="text-xs text-slate-500">
                Copia y pega este bloque en el apartado System Instructions de Google AI Studio.
              </p>
            </div>
            <button
              onClick={() => copyToClipboard(systemInstructionsPrompt, 'prompt')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition shadow-md"
            >
              {copied === 'prompt' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied === 'prompt' ? '¡Prompt Copiado!' : 'Copiar Prompt Completo'}</span>
            </button>
          </div>

          <div className="bg-slate-900 text-slate-100 rounded-3xl p-6 font-mono text-xs overflow-x-auto shadow-inner border border-slate-800 leading-relaxed whitespace-pre-wrap">
            {systemInstructionsPrompt}
          </div>
        </div>
      )}
    </div>
  );
};

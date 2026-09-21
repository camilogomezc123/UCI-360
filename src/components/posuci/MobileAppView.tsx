import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Volume2,
  VolumeX,
  Heart,
  Activity,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Flame,
  Send,
  Calendar,
  Sparkles,
  Award,
  BookOpen,
  Pill,
  Target,
  Maximize2,
  Minimize2,
  Smartphone,
  Eye,
  ArrowLeft,
  ChevronRight,
  PhoneCall,
  User,
  ExternalLink,
  Plus
} from 'lucide-react';
import { AgendamientoPostUci30Dias } from './AgendamientoPostUci30Dias';
import { PortalGoals } from '../portal/PortalGoals';
import { PortalMedications } from '../portal/PortalMedications';
import { PortalDiary } from '../portal/PortalDiary';
import { PWAInstallButton } from '../pwa/PWAInstallButton';

export const MobileAppView: React.FC = () => {
  const {
    currentCase,
    validatedActivities,
    crisisAlerts,
    thankDoctor,
    logPatientActivity,
    easyMode,
    toggleEasyMode,
    triggerCrisisSimulation,
    gamification,
    setMode,
    agenda
  } = useApp();

  // Mobile Bottom Tab: 'tomy' | 'day30' | 'goals' | 'meds' | 'diary'
  const [mobileTab, setMobileTab] = useState<'tomy' | 'day30' | 'goals' | 'meds' | 'diary'>('tomy');

  // Display mode: 'native' (full width mobile) | 'frame' (desktop phone mockup)
  const [frameMode, setFrameMode] = useState<'native' | 'frame'>('native');

  // Audio synthesis state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const speechSynthRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Activity logging state
  const [showLogModal, setShowLogModal] = useState(false);
  const [borgScore, setBorgScore] = useState(3);
  const [heartRate, setHeartRate] = useState(86);
  const [spo2, setSpo2] = useState(97);
  const [caregiverNote, setCaregiverNote] = useState('');

  const primaryActivity = validatedActivities[0];
  const activeAlert = crisisAlerts.find(a => a.status === 'activa');
  const day30Appt = agenda.find(a => a.id.startsWith('agenda-day30'));

  const handlePlayAudio = (text: string) => {
    if (!('speechSynthesis' in window)) {
      alert('La síntesis de voz no está soportada en este navegador.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-CO';
    utterance.rate = 0.95;
    utterance.pitch = 1.05;

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    speechSynthRef.current = utterance;
    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleSaveActivity = (e: React.FormEvent) => {
    e.preventDefault();
    logPatientActivity({
      code: 'ACT-MOTOR-WALK-01',
      title: 'Bipedestación y Marcha Asistida (PICS)',
      performedDose: '5 minutos de marcha asistida por Lucía con andador',
      borgScore,
      heartRate,
      spo2,
      caregiverNote: caregiverNote || 'Pepito realizó la marcha sin mareos.'
    });
    setShowLogModal(false);
    setCaregiverNote('');
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Top Bar Controls for Switching between Smartphone Mockup and Full-Width Mobile */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode('portal')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver al Portal Escritorio</span>
          </button>

          <span className="hidden sm:inline-block text-slate-300">|</span>

          <span className="font-bold text-teal-800 flex items-center gap-1.5">
            <Smartphone className="w-4 h-4 text-teal-600" />
            <span>App Móvil POSUCI 360</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* PWA Install Button */}
          <PWAInstallButton variant="header" />

          {/* Frame mode toggle */}
          <button
            onClick={() => setFrameMode(prev => prev === 'native' ? 'frame' : 'native')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 text-teal-800 hover:bg-teal-100 font-bold transition border border-teal-200"
            title="Alternar entre vista adaptable completa o marco de teléfono celular"
          >
            {frameMode === 'native' ? (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-teal-600" />
                <span>Modo Simulador Celular</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-teal-600" />
                <span>Modo Pantalla Completa</span>
              </>
            )}
          </button>

          {/* Easy mode toggle */}
          <button
            onClick={toggleEasyMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition ${
              easyMode
                ? 'bg-amber-400 text-slate-950 shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Modo Fácil: {easyMode ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* Main Container: Native full-width or Smartphone Frame */}
      <div className={`mx-auto transition-all ${
        frameMode === 'frame'
          ? 'max-w-[430px] rounded-[42px] border-[10px] border-slate-900 shadow-2xl overflow-hidden bg-slate-50'
          : 'max-w-2xl rounded-3xl border border-slate-200 shadow-md overflow-hidden bg-slate-50'
      }`}>
        {/* Smartphone Notch / Top status header in Frame Mode */}
        {frameMode === 'frame' && (
          <div className="bg-slate-900 text-white px-6 py-2 flex items-center justify-between text-[11px] font-mono">
            <span>9:41</span>
            <div className="w-20 h-4 bg-slate-800 rounded-full mx-auto"></div>
            <div className="flex items-center gap-1.5">
              <span>5G</span>
              <div className="w-5 h-2.5 border border-white rounded-xs p-0.5">
                <div className="h-full bg-emerald-400 rounded-2xs w-full"></div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile App Header */}
        <header className="bg-gradient-to-r from-purple-700 via-indigo-700 to-teal-600 p-4 sm:p-5 text-white shadow-md">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shadow-inner border border-white/20 shrink-0">
                🤖
              </div>
              <div>
                <span className="text-[11px] text-purple-200 font-semibold tracking-wide uppercase">
                  Tomy • POSUCI 360 Móvil
                </span>
                <h2 className={`font-bold leading-tight ${easyMode ? 'text-xl' : 'text-base'}`}>
                  Pepito y Lucía
                </h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-[11px] text-teal-100">Enlace Activo con Dra. Morales</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 font-bold text-xs shadow-xs">
                <Flame className="w-3.5 h-3.5 fill-slate-950" />
                <span>Nivel {gamification.level}</span>
              </div>
              <span className="text-[10px] text-white/80 mt-0.5">{gamification.points} XP</span>
            </div>
          </div>
        </header>

        {/* Crisis SOS Banner if active */}
        {activeAlert && (
          <div className="bg-rose-50 border-y-2 border-rose-500 p-4 text-rose-950 animate-pulse flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1 text-xs">
              <span className="font-bold text-rose-900 block text-sm">
                ¡ALERTA DE DESATURACIÓN ACTIVADA!
              </span>
              <p className="mt-0.5 text-rose-800">
                SpO2: {activeAlert.spo2}% • Notificación automática enviada a la Enfermera de Enlace Laura y enlace de urgencias.
              </p>
            </div>
          </div>
        )}

        {/* Dynamic Mobile Tab Content */}
        <main className="p-4 sm:p-5 space-y-4">
          {/* TAB 1: TOMY & FEEDBACK CLÍNICO */}
          {mobileTab === 'tomy' && (
            <div className="space-y-4 animate-fade-in">
              {/* Tarjeta 1: Firma Médica Digital Certificada (Ley 527) */}
              <div className="bg-white border-2 border-teal-500/50 rounded-2xl p-4 space-y-3 shadow-xs">
                <div className="flex items-center justify-between text-xs text-teal-800 font-bold">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-teal-600" />
                    FIRMA MÉDICA DIGITAL LEY 527
                  </span>
                  <span className="bg-teal-100 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded">
                    Certificado Válido
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-teal-800 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                    AM
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {primaryActivity?.clinicalValidation?.validatorName || 'Dra. Andrea Morales'}
                    </p>
                    <p className="text-xs text-slate-500 font-medium">
                      Intensivista Titular • Programa PICS
                    </p>
                  </div>
                </div>

                <div className="bg-teal-50/60 p-3.5 rounded-xl border border-teal-100 text-xs italic text-slate-700 leading-relaxed shadow-xs">
                  "{primaryActivity?.clinicalValidation?.feedbackText || 'Excelente avance, Pepito. Mantén el ritmo suave y descansa cuando sientas fatiga.'}"
                </div>

                <div className="flex items-center justify-between pt-1 gap-2">
                  <button
                    onClick={() => handlePlayAudio(primaryActivity?.clinicalValidation?.feedbackText || 'Excelente avance, Pepito.')}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition flex items-center gap-1.5 ${
                      isPlayingAudio
                        ? 'bg-amber-500 text-white border-amber-600 animate-pulse font-bold'
                        : 'text-slate-700 bg-slate-100 hover:bg-slate-200 border-slate-200'
                    }`}
                  >
                    {isPlayingAudio ? (
                      <>
                        <VolumeX className="w-3.5 h-3.5" /> Detener Voz
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5 text-teal-600" /> 🔊 Escuchar en voz alta
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => primaryActivity && thankDoctor(primaryActivity.id)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition flex items-center gap-1 ${
                      primaryActivity?.clinicalValidation?.userThanked
                        ? 'bg-rose-50 text-rose-700 border-rose-300'
                        : 'text-teal-700 bg-teal-50 hover:bg-teal-100 border-teal-200'
                    }`}
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        primaryActivity?.clinicalValidation?.userThanked
                          ? 'text-rose-500 fill-rose-500'
                          : 'text-teal-600'
                      }`}
                    />
                    <span>Gracias Dra. ({primaryActivity?.clinicalValidation?.thankCount || 1})</span>
                  </button>
                </div>
              </div>

              {/* Tarjeta 2: Banner Hito Día 30 con Acceso Inmediato */}
              <div
                onClick={() => setMobileTab('day30')}
                className="bg-gradient-to-r from-[#005c55] to-[#0f766e] rounded-2xl p-4 text-white shadow-sm cursor-pointer hover:shadow-md transition border border-teal-400/30 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center text-lg font-bold shrink-0">
                    ⭐
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-400 text-slate-950 uppercase">
                      {day30Appt ? 'Cita Programada' : 'Hito 30 Días'}
                    </span>
                    <h3 className="font-bold text-sm text-white truncate mt-1">
                      Consulta Integral Post-UCI (30 Días)
                    </h3>
                    <p className="text-xs text-teal-100 truncate">
                      {day30Appt ? day30Appt.dateTime : 'Intensivista, Fisioterapia, Neuropsicología (90 min)'}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-amber-300 shrink-0" />
              </div>

              {/* Tarjeta 3: Botón para Registrar Nueva Actividad de Ejercicio */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Activity className="w-4 h-4 text-sky-600" />
                    <span>Registro de Ejercicio y Fatiga</span>
                  </h4>
                  <span className="text-xs text-slate-500">Escala de Borg</span>
                </div>

                <button
                  onClick={() => setShowLogModal(true)}
                  className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Registrar Actividad del Paciente (Pepito)</span>
                </button>
              </div>

              {/* Botón de Emergencia y Simulación de Crisis SOS */}
              <div className="bg-rose-50 rounded-2xl p-4 border border-rose-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    Protocolo de Alerta / SOS
                  </span>
                  <span className="text-[11px] text-rose-600">Simulación PICS</span>
                </div>
                <p className="text-slate-600">
                  Prueba el envío automático de alerta a la Enfermera de Enlace Laura si Pepito desatura (&lt;90% SpO2).
                </p>
                <button
                  onClick={() => triggerCrisisSimulation(87, 118, 'Desaturación repentina durante marcha en casa')}
                  className="w-full py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition shadow-xs flex items-center justify-center gap-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Simular Desaturación de Emergencia (87% SpO2)</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: AGENDAMIENTO STITCH DÍA 30 */}
          {mobileTab === 'day30' && (
            <div className="animate-fade-in">
              <AgendamientoPostUci30Dias
                onBack={() => setMobileTab('tomy')}
                isEmbedded={true}
              />
            </div>
          )}

          {/* TAB 3: METAS DE RECUPERACIÓN */}
          {mobileTab === 'goals' && (
            <div className="animate-fade-in space-y-3">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-slate-900 text-base">Metas del Paciente</h3>
                <span className="text-xs text-teal-700 font-bold">Programa PICS</span>
              </div>
              <PortalGoals />
            </div>
          )}

          {/* TAB 4: MEDICAMENTOS */}
          {mobileTab === 'meds' && (
            <div className="animate-fade-in space-y-3">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-slate-900 text-base">Tomas de Medicamentos</h3>
                <span className="text-xs text-slate-500">Recordatorios de hoy</span>
              </div>
              <PortalMedications />
            </div>
          )}

          {/* TAB 5: DIARIO DE UCI */}
          {mobileTab === 'diary' && (
            <div className="animate-fade-in space-y-3">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-slate-900 text-base">Diario de UCI</h3>
                <span className="text-xs text-slate-500">Lucía y Pepito</span>
              </div>
              <PortalDiary />
            </div>
          )}
        </main>

        {/* Barra de Navegación Inferior Fija (Estilo PWA / Smartphone Nativo) */}
        <nav className="sticky bottom-0 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-2 flex items-center justify-around z-30 shadow-lg">
          <button
            onClick={() => setMobileTab('tomy')}
            className={`flex flex-col items-center gap-1 p-1.5 rounded-xl transition min-w-[56px] ${
              mobileTab === 'tomy'
                ? 'text-teal-700 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-base ${
              mobileTab === 'tomy' ? 'bg-teal-100 text-teal-800' : 'bg-slate-100'
            }`}>
              🤖
            </div>
            <span className="text-[10px]">Tomy SOS</span>
          </button>

          <button
            onClick={() => setMobileTab('day30')}
            className={`flex flex-col items-center gap-1 p-1.5 rounded-xl transition min-w-[56px] relative ${
              mobileTab === 'day30'
                ? 'text-amber-700 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-base ${
              mobileTab === 'day30' ? 'bg-amber-100 text-amber-900 ring-2 ring-amber-400' : 'bg-slate-100'
            }`}>
              ⭐
            </div>
            <span className="text-[10px]">Día 30</span>
            <span className="absolute -top-1 right-2 w-2 h-2 rounded-full bg-amber-500"></span>
          </button>

          <button
            onClick={() => setMobileTab('goals')}
            className={`flex flex-col items-center gap-1 p-1.5 rounded-xl transition min-w-[56px] ${
              mobileTab === 'goals'
                ? 'text-sky-700 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-base ${
              mobileTab === 'goals' ? 'bg-sky-100 text-sky-800' : 'bg-slate-100'
            }`}>
              🎯
            </div>
            <span className="text-[10px]">Metas</span>
          </button>

          <button
            onClick={() => setMobileTab('meds')}
            className={`flex flex-col items-center gap-1 p-1.5 rounded-xl transition min-w-[56px] ${
              mobileTab === 'meds'
                ? 'text-indigo-700 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-base ${
              mobileTab === 'meds' ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100'
            }`}>
              💊
            </div>
            <span className="text-[10px]">Pastillas</span>
          </button>

          <button
            onClick={() => setMobileTab('diary')}
            className={`flex flex-col items-center gap-1 p-1.5 rounded-xl transition min-w-[56px] ${
              mobileTab === 'diary'
                ? 'text-purple-700 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-base ${
              mobileTab === 'diary' ? 'bg-purple-100 text-purple-800' : 'bg-slate-100'
            }`}>
              📖
            </div>
            <span className="text-[10px]">Diario</span>
          </button>
        </nav>
      </div>

      {/* Modal para Registrar Actividad de Marcha / Borg */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="bg-teal-700 text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Activity className="w-5 h-5" />
                <span>Registrar Actividad del Paciente</span>
              </h3>
              <button
                onClick={() => setShowLogModal(false)}
                className="text-white/80 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveActivity} className="p-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Escala de Esfuerzo Percibido (Borg 0 - 10): {borgScore}/10
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={borgScore}
                  onChange={(e) => setBorgScore(Number(e.target.value))}
                  className="w-full accent-teal-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                  <span>0 (Sin esfuerzo)</span>
                  <span>5 (Moderado)</span>
                  <span>10 (Máximo)</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">SpO2 (%)</label>
                  <input
                    type="number"
                    min="70"
                    max="100"
                    value={spo2}
                    onChange={(e) => setSpo2(Number(e.target.value))}
                    className="w-full p-2 rounded-xl border border-slate-300 font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Frecuencia Cardíaca (lpm)</label>
                  <input
                    type="number"
                    min="40"
                    max="180"
                    value={heartRate}
                    onChange={(e) => setHeartRate(Number(e.target.value))}
                    className="w-full p-2 rounded-xl border border-slate-300 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Nota de Lucía (Cuidadora)
                </label>
                <textarea
                  rows={2}
                  value={caregiverNote}
                  onChange={(e) => setCaregiverNote(e.target.value)}
                  placeholder="Ej: Pepito caminó 5 minutos con apoyo, sin dolor en el pecho."
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-md"
                >
                  Guardar y Sincronizar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

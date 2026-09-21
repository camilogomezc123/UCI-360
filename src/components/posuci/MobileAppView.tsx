import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Home,
  Pill,
  Target,
  Calendar,
  BookOpen,
  Volume2,
  VolumeX,
  Heart,
  Activity,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Flame,
  Sparkles,
  Award,
  Maximize2,
  Minimize2,
  Smartphone,
  Eye,
  ArrowLeft,
  ChevronRight,
  PhoneCall,
  Smile,
  Meh,
  Frown,
  Plus,
  HelpCircle,
  UserCheck,
  Check
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
    gamification,
    setMode,
    agenda,
    medications,
    toggleMedicationTaken,
    goals
  } = useApp();

  // Navigation tab: 'home' | 'meds' | 'goals' | 'day30' | 'diary'
  const [mobileTab, setMobileTab] = useState<'home' | 'meds' | 'goals' | 'day30' | 'diary'>('home');

  // Display mode for testing on desktop
  const [frameMode, setFrameMode] = useState<'native' | 'frame'>('native');

  // Audio speech synthesis
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const speechSynthRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Quick Mood / Energy logging state
  const [loggedMood, setLoggedMood] = useState<string | null>(null);
  const [moodFeedback, setMoodFeedback] = useState<string | null>(null);

  // Detailed activity logging modal
  const [showLogModal, setShowLogModal] = useState(false);
  const [borgScore, setBorgScore] = useState(3);
  const [heartRate, setHeartRate] = useState(86);
  const [spo2, setSpo2] = useState(97);
  const [caregiverNote, setCaregiverNote] = useState('');

  // Call help modal
  const [showHelpModal, setShowHelpModal] = useState(false);

  const primaryActivity = validatedActivities[0];
  const activeAlert = crisisAlerts.find(a => a.status === 'activa');
  const day30Appt = agenda.find(a => a.id.startsWith('agenda-day30'));

  // Calculate quick medication stats
  const totalDoses = medications.reduce((acc, m) => acc + m.scheduleTimes.length, 0);
  const takenDoses = medications.reduce((acc, m) => acc + m.takenToday.filter(Boolean).length, 0);
  const nextPendingMed = medications.find(m => m.takenToday.some(t => !t)) || medications[0];

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
    utterance.rate = 0.92; // Slightly slower and gentle for patients
    utterance.pitch = 1.05;

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    speechSynthRef.current = utterance;
    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleQuickMood = (mood: 'bien' | 'regular' | 'cansado') => {
    setLoggedMood(mood);
    if (mood === 'bien') {
      setMoodFeedback('¡Qué alegría, Pepito! Has registrado que te sientes con buen ánimo. Recuerda hacer pausas.');
      logPatientActivity({
        code: 'MOOD-GOOD',
        title: 'Estado de Ánimo: Positivo y con Energía',
        performedDose: 'El paciente refiere sentirse animado y con fuerza.',
        borgScore: 2,
        heartRate: 80,
        spo2: 98,
        caregiverNote: 'Pepito reportó sentirse muy animado en la mañana.'
      });
    } else if (mood === 'regular') {
      setMoodFeedback('Anotado. Es normal sentir cansancio moderado. Tómate un vaso con agua y descansa 15 minutos.');
      logPatientActivity({
        code: 'MOOD-MODERATE',
        title: 'Estado de Ánimo: Cansancio Moderado',
        performedDose: 'Fatiga ligera post-ejercicio.',
        borgScore: 4,
        heartRate: 88,
        spo2: 96,
        caregiverNote: 'Pepito siente cansancio moderado, guardará reposo breve.'
      });
    } else {
      setMoodFeedback('Anotado. Si sientes fatiga intensa o mareo, reposa sentado y avisa a Lucía o a tu enfermera.');
      logPatientActivity({
        code: 'MOOD-TIRED',
        title: 'Estado de Ánimo: Necesidad de Reposo',
        performedDose: 'Paciente reporta sensación de cansancio marcado.',
        borgScore: 7,
        heartRate: 94,
        spo2: 95,
        caregiverNote: 'Pepito necesitó reposo extra por fatiga en la jornada.'
      });
    }

    setTimeout(() => {
      setMoodFeedback(null);
    }, 6000);
  };

  const handleSaveActivity = (e: React.FormEvent) => {
    e.preventDefault();
    logPatientActivity({
      code: 'ACT-MOTOR-WALK-01',
      title: 'Caminata Asistida en Casa',
      performedDose: '5 minutos de marcha asistida por Lucía con andador',
      borgScore,
      heartRate,
      spo2,
      caregiverNote: caregiverNote || 'Pepito realizó la marcha sin mareos ni dolor en el pecho.'
    });
    setShowLogModal(false);
    setCaregiverNote('');
  };

  return (
    <div className="space-y-4 pb-28">
      {/* Top Bar for Desktop Users (hidden on small mobile devices to save space) */}
      <div className="hidden sm:flex bg-white rounded-2xl p-3 border border-slate-200 shadow-xs items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode('portal')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Ver Portal Completo de Hospital</span>
          </button>
          <span className="text-slate-300">|</span>
          <span className="font-bold text-teal-800 flex items-center gap-1.5">
            <Smartphone className="w-4 h-4 text-teal-600" />
            <span>Vista Móvil para Pacientes y Familiares</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <PWAInstallButton variant="header" />
          <button
            onClick={() => setFrameMode(prev => prev === 'native' ? 'frame' : 'native')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 text-teal-800 hover:bg-teal-100 font-bold transition border border-teal-200"
          >
            {frameMode === 'native' ? (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-teal-600" />
                <span>Simulador Teléfono</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-teal-600" />
                <span>Pantalla Completa</span>
              </>
            )}
          </button>

          <button
            onClick={toggleEasyMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition ${
              easyMode
                ? 'bg-amber-400 text-slate-950 shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Letra Grande: {easyMode ? 'Activada' : 'Normal'}</span>
          </button>
        </div>
      </div>

      {/* Main Container: Native full-width or Smartphone Frame */}
      <div className={`mx-auto transition-all ${
        frameMode === 'frame'
          ? 'max-w-[430px] rounded-[42px] border-[10px] border-slate-900 shadow-2xl overflow-hidden bg-slate-50'
          : 'max-w-xl rounded-3xl border border-slate-200 shadow-md overflow-hidden bg-slate-50'
      }`}>
        {/* Smartphone Notch in Frame Mode */}
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

        {/* Friendly Mobile Header */}
        <header className="bg-gradient-to-r from-teal-700 via-teal-800 to-sky-800 p-4 sm:p-5 text-white shadow-md relative overflow-hidden">
          <div className="flex items-center justify-between gap-3 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shadow-inner border border-white/25 shrink-0">
                🌻
              </div>
              <div>
                <span className="text-[11px] text-teal-200 font-semibold tracking-wide uppercase">
                  POSUCI 360 • En Casa
                </span>
                <h1 className={`font-bold leading-tight text-white ${easyMode ? 'text-2xl' : 'text-lg'}`}>
                  Pepito y Lucía
                </h1>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-xs text-teal-100">Acompañados por la Clínica de Occidente</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleEasyMode}
                className={`p-2 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                  easyMode
                    ? 'bg-amber-400 text-slate-950 shadow-md'
                    : 'bg-white/15 text-white hover:bg-white/25'
                }`}
                title="Activar letra grande y lectura fácil"
              >
                <Eye className="w-4 h-4" />
                <span className="text-[11px] font-bold">{easyMode ? 'Grande' : 'Aa'}</span>
              </button>
            </div>
          </div>
        </header>

        {/* Crisis SOS Banner if active */}
        {activeAlert && (
          <div className="bg-rose-50 border-y-2 border-rose-500 p-4 text-rose-950 animate-pulse flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1 text-xs">
              <span className="font-bold text-rose-900 block text-sm">
                Aviso: El oxímetro reportó {activeAlert.spo2}% de oxígeno
              </span>
              <p className="mt-0.5 text-rose-800">
                Si sientes ahogo, siéntate erguido y respira con calma. La Enfermera Laura ya tiene la notificación en su pantalla.
              </p>
            </div>
          </div>
        )}

        {/* Dynamic Mobile View Content */}
        <main className="p-4 sm:p-5 space-y-4">
          {/* ========================================================================= */}
          {/* TAB 1: INICIO (HOY) */}
          {/* ========================================================================= */}
          {mobileTab === 'home' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Saludo de Tomy con Lenguaje Humano y Amable */}
              <div className="bg-gradient-to-r from-amber-50 via-teal-50/50 to-emerald-50 rounded-2xl p-4 border border-teal-200/60 shadow-xs flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center text-2xl shadow-sm shrink-0">
                  🤖
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-teal-900">Tomy, tu Asistente Amigo</span>
                    <span className="text-[11px] text-teal-700 font-semibold">Hoy</span>
                  </div>
                  <p className={`text-slate-800 leading-relaxed font-medium ${easyMode ? 'text-base' : 'text-xs sm:text-sm'}`}>
                    ¡Hola Pepito! Hoy es un buen día para avanzar a tu propio ritmo. Tómate las pastillas a tiempo y da unos pasos con Lucía cuando descanses.
                  </p>
                </div>
              </div>

              {/* Tarjeta 1: Mensaje de tu Médica (Dra. Andrea Morales) */}
              <div className="bg-white border border-teal-300/80 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <h3 className={`font-bold text-teal-900 ${easyMode ? 'text-lg' : 'text-sm'}`}>
                      Mensaje de tu Médica
                    </h3>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                    ✓ Revisión al Día
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-teal-800 to-teal-600 text-white flex items-center justify-center font-bold text-base shadow-sm shrink-0 border-2 border-teal-100">
                    AM
                  </div>
                  <div>
                    <h4 className={`font-bold text-slate-900 ${easyMode ? 'text-lg' : 'text-sm'}`}>
                      {primaryActivity?.clinicalValidation?.validatorName || 'Dra. Andrea Morales'}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium">
                      Médica Especialista en Cuidado Intensivo • Programa PICS
                    </p>
                  </div>
                </div>

                <div className={`bg-teal-50/70 p-3.5 rounded-xl border border-teal-100 text-slate-800 leading-relaxed italic shadow-2xs ${
                  easyMode ? 'text-base font-medium' : 'text-xs sm:text-sm'
                }`}>
                  "{primaryActivity?.clinicalValidation?.feedbackText || 'Excelente avance, Pepito. Mantén el ritmo suave y descansa cuando sientas fatiga. Lucía lo está haciendo de maravilla.'}"
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <button
                    onClick={() => handlePlayAudio(primaryActivity?.clinicalValidation?.feedbackText || 'Excelente avance, Pepito.')}
                    className={`text-xs font-bold px-3.5 py-2 rounded-xl transition flex items-center gap-2 ${
                      isPlayingAudio
                        ? 'bg-amber-500 text-white shadow-md animate-pulse'
                        : 'bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200'
                    }`}
                  >
                    {isPlayingAudio ? (
                      <>
                        <VolumeX className="w-4 h-4" /> Detener Voz
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4 text-teal-600" /> 🔊 Escuchar en voz alta
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => primaryActivity && thankDoctor(primaryActivity.id)}
                    className={`text-xs font-bold px-3.5 py-2 rounded-xl border transition flex items-center gap-1.5 ${
                      primaryActivity?.clinicalValidation?.userThanked
                        ? 'bg-rose-50 text-rose-700 border-rose-300'
                        : 'text-teal-700 bg-slate-50 hover:bg-teal-50 border-slate-200'
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        primaryActivity?.clinicalValidation?.userThanked
                          ? 'text-rose-500 fill-rose-500'
                          : 'text-rose-500'
                      }`}
                    />
                    <span>{primaryActivity?.clinicalValidation?.userThanked ? '¡Mensaje enviado!' : 'Dar las gracias a la Dra.'}</span>
                  </button>
                </div>
              </div>

              {/* Tarjeta 2: ¿Cómo te sientes hoy? (Registro en 1 solo toque) */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🩺</span>
                    <h3 className={`font-bold text-slate-900 ${easyMode ? 'text-lg' : 'text-sm'}`}>
                      ¿Cómo te sientes en este momento?
                    </h3>
                  </div>
                  <span className="text-xs text-slate-500">1 toque</span>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  <button
                    onClick={() => handleQuickMood('bien')}
                    className={`p-3 rounded-2xl border transition text-center flex flex-col items-center gap-1.5 ${
                      loggedMood === 'bien'
                        ? 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-400'
                        : 'bg-emerald-50/50 hover:bg-emerald-100/70 border-emerald-200 text-emerald-900'
                    }`}
                  >
                    <span className="text-3xl">😊</span>
                    <span className="text-xs font-bold">Con energía</span>
                  </button>

                  <button
                    onClick={() => handleQuickMood('regular')}
                    className={`p-3 rounded-2xl border transition text-center flex flex-col items-center gap-1.5 ${
                      loggedMood === 'regular'
                        ? 'bg-amber-100 border-amber-500 text-amber-950 font-bold ring-2 ring-amber-400'
                        : 'bg-amber-50/50 hover:bg-amber-100/70 border-amber-200 text-amber-900'
                    }`}
                  >
                    <span className="text-3xl">😐</span>
                    <span className="text-xs font-bold">Un poco cansado</span>
                  </button>

                  <button
                    onClick={() => handleQuickMood('cansado')}
                    className={`p-3 rounded-2xl border transition text-center flex flex-col items-center gap-1.5 ${
                      loggedMood === 'cansado'
                        ? 'bg-purple-100 border-purple-500 text-purple-950 font-bold ring-2 ring-purple-400'
                        : 'bg-purple-50/50 hover:bg-purple-100/70 border-purple-200 text-purple-900'
                    }`}
                  >
                    <span className="text-3xl">😴</span>
                    <span className="text-xs font-bold">Necesito reposo</span>
                  </button>
                </div>

                {moodFeedback && (
                  <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-teal-900 text-xs font-medium animate-in fade-in flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>{moodFeedback}</span>
                  </div>
                )}

                <div className="pt-1 flex items-center justify-between text-xs text-slate-500">
                  <span>¿Tienes oxímetro en casa?</span>
                  <button
                    onClick={() => setShowLogModal(true)}
                    className="text-teal-700 hover:text-teal-900 font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Anotar Pulso y Oxígeno</span>
                  </button>
                </div>
              </div>

              {/* Tarjeta 3: Tus Pastillas de Hoy (Resumen Claro) */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                      <Pill className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className={`font-bold text-slate-900 ${easyMode ? 'text-lg' : 'text-sm'}`}>
                        Tus Pastillas de Hoy
                      </h3>
                      <p className="text-xs text-slate-500">
                        {takenDoses} de {totalDoses} tomas completadas
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setMobileTab('meds')}
                    className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition"
                  >
                    Ver todas →
                  </button>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${totalDoses > 0 ? (takenDoses / totalDoses) * 100 : 100}%` }}
                  ></div>
                </div>

                {/* Next pending pill card */}
                {nextPendingMed && (
                  <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold text-indigo-800 uppercase tracking-wide">
                        {nextPendingMed.indicatedFor}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm">
                        {nextPendingMed.name} {nextPendingMed.dosage}
                      </h4>
                      <p className="text-xs text-slate-500">{nextPendingMed.frequency}</p>
                    </div>

                    <button
                      onClick={() => toggleMedicationTaken(nextPendingMed.id, 0)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                        nextPendingMed.takenToday[0]
                          ? 'bg-emerald-600 text-white'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                      }`}
                    >
                      {nextPendingMed.takenToday[0] ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Tomada</span>
                        </>
                      ) : (
                        <span>Marcar Tomada</span>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Tarjeta 4: Próxima Cita Post-UCI (Día 30) */}
              <div
                onClick={() => setMobileTab('day30')}
                className="bg-gradient-to-r from-teal-800 to-sky-900 rounded-2xl p-4 sm:p-5 text-white shadow-sm cursor-pointer hover:shadow-md transition flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center text-xl font-bold shrink-0 shadow-sm">
                    🗓️
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 uppercase">
                      {day30Appt ? 'Cita Confirmada' : 'Hito 30 Días'}
                    </span>
                    <h4 className={`font-bold text-white truncate mt-1 ${easyMode ? 'text-lg' : 'text-sm'}`}>
                      Consulta de Recuperación en Clínica
                    </h4>
                    <p className="text-xs text-teal-100 truncate">
                      {day30Appt ? day30Appt.dateTime : 'Mié 14 Nov • 10:30 AM • Clínica de Occidente'}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-amber-300 shrink-0" />
              </div>

              {/* Tarjeta 5: Botón de Ayuda o Contacto con Enfermera */}
              <div className="bg-slate-100 rounded-2xl p-4 border border-slate-200 text-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm">¿Dudas o inquietudes?</h5>
                    <p className="text-slate-500">Enfermera de Enlace Laura está disponible</p>
                  </div>
                </div>

                <button
                  onClick={() => setShowHelpModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition"
                >
                  Contactar
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: MEDICAMENTOS */}
          {/* ========================================================================= */}
          {mobileTab === 'meds' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <button
                  onClick={() => setMobileTab('home')}
                  className="flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-900 bg-teal-50 px-3 py-1.5 rounded-xl"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Volver a Inicio</span>
                </button>
                <h3 className="font-bold text-slate-900 text-base">Mis Pastillas de Hoy</h3>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl text-xs text-emerald-900 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p>
                  Toma tus pastillas con un vaso de agua lleno. Marca cada una tocando la casilla verde para que tu equipo médico vea tu avance.
                </p>
              </div>

              <PortalMedications />
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: METAS Y EJERCICIOS */}
          {/* ========================================================================= */}
          {mobileTab === 'goals' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <button
                  onClick={() => setMobileTab('home')}
                  className="flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-900 bg-teal-50 px-3 py-1.5 rounded-xl"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Volver a Inicio</span>
                </button>
                <h3 className="font-bold text-slate-900 text-base">Mis Metas de Recuperación</h3>
              </div>

              <div className="bg-sky-50 border border-sky-200 p-3.5 rounded-2xl text-xs text-sky-900 flex items-start gap-2.5">
                <Target className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <p>
                  Cada paso cuenta. Haz los ejercicios con calma y detente a respirar si sientes fatiga.
                </p>
              </div>

              <PortalGoals />
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: CITA DÍA 30 */}
          {/* ========================================================================= */}
          {mobileTab === 'day30' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <button
                  onClick={() => setMobileTab('home')}
                  className="flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-900 bg-teal-50 px-3 py-1.5 rounded-xl"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Volver a Inicio</span>
                </button>
                <h3 className="font-bold text-slate-900 text-base">Mi Cita de los 30 Días</h3>
              </div>

              <AgendamientoPostUci30Dias onBack={() => setMobileTab('home')} isEmbedded={true} />
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: DIARIO */}
          {/* ========================================================================= */}
          {mobileTab === 'diary' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <button
                  onClick={() => setMobileTab('home')}
                  className="flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-900 bg-teal-50 px-3 py-1.5 rounded-xl"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Volver a Inicio</span>
                </button>
                <h3 className="font-bold text-slate-900 text-base">Diario de la Familia</h3>
              </div>

              <div className="bg-purple-50 border border-purple-200 p-3.5 rounded-2xl text-xs text-purple-900 flex items-start gap-2.5">
                <BookOpen className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <p>
                  Escribe mensajes de cariño, recuerdos o preguntas que tengas para tu próxima consulta médica.
                </p>
              </div>

              <PortalDiary />
            </div>
          )}
        </main>

        {/* ========================================================================= */}
        {/* BARRA DE NAVEGACIÓN INFERIOR ULTRA-INTUITIVA (ESTILO APP NATIVA) */}
        {/* ========================================================================= */}
        <nav
          aria-label="Navegación principal de la aplicación móvil"
          className="sticky bottom-0 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 flex items-center justify-around z-30 shadow-xl"
        >
          {/* 1. Inicio */}
          <button
            onClick={() => setMobileTab('home')}
            className={`flex flex-col items-center gap-1 p-1.5 rounded-2xl transition min-w-[56px] ${
              mobileTab === 'home'
                ? 'text-teal-700 font-bold scale-105'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition ${
              mobileTab === 'home' ? 'bg-teal-100 text-teal-800 shadow-xs' : 'bg-slate-100 text-slate-600'
            }`}>
              <Home className="w-5 h-5" />
            </div>
            <span className="text-[11px]">Inicio</span>
          </button>

          {/* 2. Medicinas */}
          <button
            onClick={() => setMobileTab('meds')}
            className={`flex flex-col items-center gap-1 p-1.5 rounded-2xl transition min-w-[56px] ${
              mobileTab === 'meds'
                ? 'text-indigo-700 font-bold scale-105'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition ${
              mobileTab === 'meds' ? 'bg-indigo-100 text-indigo-800 shadow-xs' : 'bg-slate-100 text-slate-600'
            }`}>
              <Pill className="w-5 h-5" />
            </div>
            <span className="text-[11px]">Pastillas</span>
          </button>

          {/* 3. Metas */}
          <button
            onClick={() => setMobileTab('goals')}
            className={`flex flex-col items-center gap-1 p-1.5 rounded-2xl transition min-w-[56px] ${
              mobileTab === 'goals'
                ? 'text-sky-700 font-bold scale-105'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition ${
              mobileTab === 'goals' ? 'bg-sky-100 text-sky-800 shadow-xs' : 'bg-slate-100 text-slate-600'
            }`}>
              <Target className="w-5 h-5" />
            </div>
            <span className="text-[11px]">Metas</span>
          </button>

          {/* 4. Cita Día 30 */}
          <button
            onClick={() => setMobileTab('day30')}
            className={`flex flex-col items-center gap-1 p-1.5 rounded-2xl transition min-w-[56px] relative ${
              mobileTab === 'day30'
                ? 'text-amber-700 font-bold scale-105'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition ${
              mobileTab === 'day30' ? 'bg-amber-100 text-amber-900 shadow-xs ring-2 ring-amber-400' : 'bg-slate-100 text-slate-600'
            }`}>
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-[11px]">Mi Cita</span>
            <span className="absolute 1 right-2 w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
          </button>

          {/* 5. Diario */}
          <button
            onClick={() => setMobileTab('diary')}
            className={`flex flex-col items-center gap-1 p-1.5 rounded-2xl transition min-w-[56px] ${
              mobileTab === 'diary'
                ? 'text-purple-700 font-bold scale-105'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition ${
              mobileTab === 'diary' ? 'bg-purple-100 text-purple-800 shadow-xs' : 'bg-slate-100 text-slate-600'
            }`}>
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-[11px]">Diario</span>
          </button>
        </nav>
      </div>

      {/* Modal Sencillo para Anotar Signos (Pulso y Oxígeno) */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="bg-teal-700 text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Activity className="w-5 h-5" />
                <span>Anotar Pulso y Oxígeno de Pepito</span>
              </h3>
              <button
                onClick={() => setShowLogModal(false)}
                className="text-white/80 hover:text-white text-xl font-bold px-2"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveActivity} className="p-5 space-y-4 text-xs">
              <p className="text-slate-600">
                Coloca el oxímetro en el dedo índice de Pepito mientras está sentado y anota los valores que marca la pantalla:
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <label className="font-bold text-slate-800 block mb-1">Oxígeno (SpO2 %)</label>
                  <input
                    type="number"
                    min="70"
                    max="100"
                    value={spo2}
                    onChange={(e) => setSpo2(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-black text-lg text-teal-800 bg-white"
                  />
                  <span className="text-[10px] text-slate-500">Normal: 92% o más</span>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <label className="font-bold text-slate-800 block mb-1">Pulso (lpm)</label>
                  <input
                    type="number"
                    min="40"
                    max="180"
                    value={heartRate}
                    onChange={(e) => setHeartRate(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-black text-lg text-teal-800 bg-white"
                  />
                  <span className="text-[10px] text-slate-500">Normal: 60 a 100</span>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  ¿Cómo sintió el esfuerzo? (0: Muy fácil — 10: Muy cansado)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={borgScore}
                    onChange={(e) => setBorgScore(Number(e.target.value))}
                    className="w-full accent-teal-600 cursor-pointer"
                  />
                  <span className="font-bold text-sm text-teal-800 w-8">{borgScore}/10</span>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Mensaje o nota de Lucía (opcional)
                </label>
                <textarea
                  rows={2}
                  value={caregiverNote}
                  onChange={(e) => setCaregiverNote(e.target.value)}
                  placeholder="Ej: Caminó 5 minutos en el pasillo y tomó agua sin mareo."
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm"
                >
                  Cerrar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md"
                >
                  Guardar Valores
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Contacto y Ayuda */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden border border-slate-200 p-6 text-center space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-3xl mx-auto">
              👩‍⚕️
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">Enfermera de Enlace Laura</h3>
              <p className="text-xs text-slate-500">Programa PICS • Clínica de Occidente</p>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
              Estamos aquí para resolver tus dudas sobre medicamentos, síntomas o tu cita de los 30 días.
            </p>

            <div className="space-y-2">
              <a
                href="tel:6023800000"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Llamar a la Clínica (Línea PICS)</span>
              </a>

              <button
                onClick={() => setShowHelpModal(false)}
                className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

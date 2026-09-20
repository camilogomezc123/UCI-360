import React, { useState, useEffect, useRef } from 'react';
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
  Info,
  Sliders,
  Edit3,
  PlusCircle,
  Sparkles,
  PhoneCall,
  UserCheck,
  Send,
  RotateCcw,
  Copy,
  Check,
  FileCode2,
  Stethoscope,
  FileText,
  ChevronRight,
  Download,
  Share2,
  Terminal,
  Layers,
  Trophy,
  Dumbbell,
  Utensils,
  Brain,
  Award,
  Play,
  Pause,
  X,
  User,
  CheckCircle,
  HelpCircle,
  Smartphone,
  BookOpen,
  Calendar
} from 'lucide-react';
import { FhirCarePlan } from '../../types';
import { AgendamientoPostUci30Dias } from './AgendamientoPostUci30Dias';

export const PosUci360Conecta: React.FC = () => {
  const {
    currentCase,
    validatedActivities,
    crisisAlerts,
    thankDoctor,
    logPatientActivity,
    editPatientActivity,
    validateActivity,
    requestActivityRevision,
    addNewCarePlan,
    carePlans,
    fhirObservations,
    easyMode,
    toggleEasyMode,
    setMode,
    triggerCrisisSimulation
  } = useApp();

  // Active view:
  // 'screen-paciente' | 'screen-validacion' | 'screen-diario' | 'screen-censo' | 'desktop-prescription' | 'stitch-agenda' | 'ai-studio-data'
  const [currentView, setCurrentView] = useState<
    'screen-paciente' | 'screen-validacion' | 'screen-diario' | 'screen-censo' | 'desktop-prescription' | 'stitch-agenda' | 'ai-studio-data'
  >('screen-paciente');

  // Subtab inside screen-paciente smartphone navigation
  const [patientSubTab, setPatientSubTab] = useState<'dia' | 'entrenar' | 'nutricion' | 'mente' | 'retos'>('dia');

  // Modals & Interactive States
  const [showDiplomaModal, setShowDiplomaModal] = useState(false);
  const [caregiverThanksCount, setCaregiverThanksCount] = useState(14);
  const [caregiverThanksSent, setCaregiverThanksSent] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isPlayingValentinaAudio, setIsPlayingValentinaAudio] = useState(false);
  const [selectedAbcdefLetter, setSelectedAbcdefLetter] = useState<string | null>(null);
  const [showNewDiaryModal, setShowNewDiaryModal] = useState(false);

  // New diary entry state
  const [newDiaryTitle, setNewDiaryTitle] = useState('');
  const [newDiaryBody, setNewDiaryBody] = useState('');
  const [newDiaryAuthor, setNewDiaryAuthor] = useState('Lucía Pérez (Hija)');

  // Dynamic diary entries
  const [diaryEntries, setDiaryEntries] = useState([
    {
      id: 'entry-1',
      title: 'Extubación: ¡Hoy abriste los ojos y nos apretaste la mano!',
      tag: 'Día 6 • 14 de Octubre',
      tagColor: 'bg-teal-50 text-teal-800 border-teal-200',
      author: 'Lucía y Valentina (Familia Pérez)',
      content:
        'Pepito, hoy a las 9:30 el equipo de la Dra. Andrea Morales retiró con éxito el respirador mecánico. Cuando te susurramos que estabas a salvo en la Clínica de Occidente, nos miraste fijamente, parpadeaste dos veces y apretaste fuerte la mano de Lucía. Los médicos nos dijeron que tu esfuerzo fue extraordinario.',
      audioDuration: '1:12 min',
      audioFrom: 'Mensaje de voz de Valentina (Hija)'
    },
    {
      id: 'entry-2',
      title: 'Primeros pasos en el pasillo de UCI con andador',
      tag: 'Día 9 • 17 de Octubre',
      tagColor: 'bg-blue-50 text-blue-800 border-blue-200',
      author: 'Ft. Carlos Vargas y Lucía',
      content:
        'Hoy lograste ponerte de pie con apoyo y diste 12 pasos firmes hacia la ventana. Vimos la cordillera de Cali y sonreíste al escuchar tu música favorita de boleros.',
      audioDuration: null,
      audioFrom: null
    }
  ]);

  const speechSynthRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Primary activity for the view
  const primaryActivity = validatedActivities[0];
  const activeAlert = crisisAlerts.find(a => a.status === 'activa');

  // Validation Form in Desktop View
  const [doctorFeedbackText, setDoctorFeedbackText] = useState(
    primaryActivity?.clinicalValidation?.feedbackText ||
    'Excelente ejecución, Pepito y Lucía. Muy buena técnica de levantamiento sin cambios ortostáticos. Mantener este ritmo durante 3 días más antes de progresar a 4 series. Felicitaciones por el trabajo en equipo.'
  );
  const [validationSuccessBanner, setValidationSuccessBanner] = useState<string | null>(null);

  // Prescription Form
  const [prescribeBlock, setPrescribeBlock] = useState<'morning' | 'afternoon'>('morning');
  const [prescribeNote, setPrescribeNote] = useState(
    'Pepito, incorpora estos 3 ejercicios de cuádriceps y bipedestación progresiva después de tu toma de presión matutina. Si notas fatiga > 4 en escala Borg, descansa 5 minutos.'
  );
  const [prescriptionSuccess, setPrescriptionSuccess] = useState(false);
  const [hoveredTelemetry, setHoveredTelemetry] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Text-to-speech for doctor's feedback
  const handlePlayAudioFeedback = (text: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Tu navegador no soporta síntesis de voz.');
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

  // Audio simulation for Valentina's diary voice note
  const handlePlayValentinaNote = () => {
    if (isPlayingValentinaAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingValentinaAudio(false);
      return;
    }

    const message =
      '¡Hola papi Pepito! Te grabamos este mensaje con Lucía para que recuerdes lo valiente que fuiste. Te amamos con todo el corazón y ya casi estamos todos juntos en casa celebrando con sancocho.';
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = 'es-CO';
      utterance.rate = 0.98;
      utterance.pitch = 1.15;
      utterance.onend = () => setIsPlayingValentinaAudio(false);
      utterance.onerror = () => setIsPlayingValentinaAudio(false);
      setIsPlayingValentinaAudio(true);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsPlayingValentinaAudio(true);
      setTimeout(() => setIsPlayingValentinaAudio(false), 4000);
    }
  };

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleExecuteValidation = () => {
    if (primaryActivity) {
      validateActivity(primaryActivity.id, doctorFeedbackText);
      setValidationSuccessBanner('¡Registro validado y firmado con firma médica electrónica certificada bajo Ley 527! Se ha sincronizado de inmediato con el móvil de Pepito y Lucía.');
      setTimeout(() => setValidationSuccessBanner(null), 5000);
    }
  };

  const handleExecuteRevision = () => {
    if (primaryActivity) {
      requestActivityRevision(primaryActivity.id, 'Por favor verificar tiempo de descanso y nueva toma de SpO2.');
      setValidationSuccessBanner('Se solicitó ajuste clínico. El registro regresó a estado "Por revisar".');
      setTimeout(() => setValidationSuccessBanner(null), 5000);
    }
  };

  const handleConfirmPrescription = () => {
    const newPlan: FhirCarePlan = {
      resourceType: 'CarePlan',
      id: `CP-MOT-8841-${Date.now().toString().slice(-4)}`,
      status: 'active',
      intent: 'order',
      subject: {
        reference: 'Patient/PICS-2024-8841',
        display: 'Pepito Pérez'
      },
      author: {
        reference: 'Practitioner/MED-MORALES-09',
        display: 'Dra. Andrea Morales / Ft. Carlos Vargas'
      },
      activity: [
        {
          detail: {
            code: {
              coding: [
                {
                  system: 'http://snomed.info/sct',
                  code: '229174000',
                  display: 'Guía de Fortalecimiento Muscular y Transferencias en Casa'
                }
              ],
              text: 'Guía de Fortalecimiento Muscular y Transferencias en Casa'
            },
            status: 'scheduled',
            scheduledTiming: {
              repeat: {
                frequency: 1,
                period: 1,
                periodUnit: 'd',
                timeOfDay: [prescribeBlock === 'morning' ? '10:00:00' : '16:00:00']
              }
            },
            description: prescribeNote
          }
        }
      ]
    };

    addNewCarePlan(newPlan);
    setPrescriptionSuccess(true);
    setTimeout(() => {
      setPrescriptionSuccess(false);
      setCurrentView('screen-paciente');
    }, 2000);
  };

  const handleSendCaregiverThanks = () => {
    if (!caregiverThanksSent) {
      setCaregiverThanksCount(prev => prev + 1);
      setCaregiverThanksSent(true);
    }
  };

  const handleAddDiaryEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDiaryTitle.trim() || !newDiaryBody.trim()) return;

    const newEntry = {
      id: `entry-${Date.now()}`,
      title: newDiaryTitle,
      tag: `Día ${diaryEntries.length + 7} • Hoy`,
      tagColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      author: newDiaryAuthor || 'Familia Pérez',
      content: newDiaryBody,
      audioDuration: null,
      audioFrom: null
    };

    setDiaryEntries([newEntry, ...diaryEntries]);
    setNewDiaryTitle('');
    setNewDiaryBody('');
    setShowNewDiaryModal(false);
  };

  // Full standalone HTML code matching user request
  const fullHtmlCode = `<!DOCTYPE html>
<html lang="es" class="h-full">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ecosistema Integral ÁGORA & POSUCI 360 Conecta</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['"Plus Jakarta Sans"', 'sans-serif'],
            display: ['Montserrat', 'sans-serif'],
          },
          colors: {
            teal: {
              50: '#f0fdfa',
              100: '#ccfbf1',
              600: '#0d9488',
              700: '#0f766e',
              800: '#115e59',
              900: '#134e4a',
            },
            agora: {
              navy: '#0b192c',
              surface: '#f8f9ff',
            }
          }
        }
      }
    }
  </script>
</head>
<body class="bg-[#f0f4f8] text-slate-800 font-sans min-h-screen flex flex-col antialiased">
  <header class="bg-[#0b192c] text-white sticky top-0 z-50 shadow-md border-b-2 border-teal-500 px-4 py-3">
    <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center font-bold text-white shadow-sm font-display">Á</div>
        <div>
          <div class="flex items-center gap-2">
            <span class="font-display font-bold text-sm tracking-wide">ÁGORA • POSUCI 360</span>
            <span class="text-[10px] bg-teal-900/80 text-teal-300 px-2 py-0.5 rounded-full border border-teal-700 font-medium">HL7-FHIR R4 Sincronizado</span>
          </div>
          <p class="text-[11px] text-slate-300">Programa de Prevención y Rehabilitación Post-UCI (PICS) • Clínica de Occidente</p>
        </div>
      </div>
      <nav class="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-700 text-xs flex-wrap justify-center">
        <button onclick="showScreen('screen-paciente')" id="btn-paciente" class="px-3.5 py-1.5 rounded-lg bg-teal-700 text-white font-semibold shadow-sm transition">📱 1. Mi Día Paciente</button>
        <button onclick="showScreen('screen-validacion')" id="btn-validacion" class="px-3.5 py-1.5 rounded-lg text-slate-300 hover:text-white transition">🩺 2. Validación Clínica & Feedback</button>
        <button onclick="showScreen('screen-diario')" id="btn-diario" class="px-3.5 py-1.5 rounded-lg text-slate-300 hover:text-white transition">📖 3. Diario UCI & Familia</button>
        <button onclick="showScreen('screen-censo')" id="btn-censo" class="px-3.5 py-1.5 rounded-lg text-slate-300 hover:text-white transition">🏥 4. Censo UCI & Semáforo ABCDEF</button>
      </nav>
    </div>
  </header>
  <main class="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
    <!-- Contenido dinámico con Pepito Pérez -->
  </main>
</body>
</html>`;

  const abcdefDictionary: Record<string, { title: string; desc: string; bundleTarget: string }> = {
    A: {
      title: 'A - Assess, Prevent, and Manage Pain',
      desc: 'Evaluación y tratamiento multimodal del dolor con escalas CPOT/EVA antes de sedar.',
      bundleTarget: 'Meta: Escala CPOT < 2 en reposo y movilización asistida.'
    },
    B: {
      title: 'B - Both SAT and SBT',
      desc: 'Pruebas coordinadas de Despertar Espontáneo (SAT) y Respiración Espontánea (SBT).',
      bundleTarget: 'Meta: Desconexión diaria del respirador para evaluar extubación temprana.'
    },
    C: {
      title: 'C - Choice of Analgesia and Sedation',
      desc: 'Elección de analgesia orientada y sedación ligera con dexmedetomidina (RASS 0 a -1).',
      bundleTarget: 'Meta: Minimizar benzodiacepinas para prevenir delirium.'
    },
    D: {
      title: 'D - Delirium: Assess, Prevent, and Manage',
      desc: 'Monitoreo de delirium con CAM-ICU cada turno, reorientación y luz circadiana.',
      bundleTarget: 'Meta: CAM-ICU negativo y ciclo sueño-vigilia preservado.'
    },
    E: {
      title: 'E - Early Mobility and Exercise',
      desc: 'Movilización progresiva desde el día 1 de ingreso: sedestación al borde de cama y bipedestación.',
      bundleTarget: 'Meta: Prevenir polineuropatía del paciente crítico y atrofia diafragmática.'
    },
    F: {
      title: 'F - Family Engagement and Empowerment',
      desc: 'Humanización, apertura de horarios, diario de UCI y participación activa de Lucía.',
      bundleTarget: 'Meta: Disminuir estrés postraumático y empoderar al cuidador.'
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Principle 5: Active Crisis Emergency Banner */}
      {activeAlert && (
        <div className="bg-red-500/10 border-2 border-red-500 text-red-950 p-5 rounded-3xl shadow-md animate-pulse flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 bg-red-600 text-white rounded-2xl shadow-sm">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black tracking-wide text-xs bg-red-600 text-white px-2.5 py-0.5 rounded-full uppercase">
                  Alerta de Seguridad Clínica
                </span>
                <span className="text-xs text-red-700 font-semibold">{activeAlert.timestamp}</span>
              </div>
              <h4 className="font-bold text-red-900 text-base mt-1">
                {activeAlert.triggerReason}
              </h4>
              <p className="text-xs text-red-800 mt-0.5">
                Métrica: <strong className="font-bold">{activeAlert.vitalMetric}</strong>. Enlace automático: <span className="font-semibold underline">{activeAlert.dispatchedTo}</span>.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end md:self-center shrink-0">
            <a
              href="tel:123"
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition"
            >
              <PhoneCall className="w-4 h-4" />
              <span>{activeAlert.emergencyLine}</span>
            </a>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* BARRA DE CONTROL GLOBAL DEL PROTOTIPO (SWITCHER EN VIVO) */}
      {/* ======================================================== */}
      <header className="bg-[#0b192c] text-white rounded-3xl shadow-xl border-b-4 border-teal-600 p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-teal-600 flex items-center justify-center font-display font-extrabold text-white text-lg shadow-md shrink-0">
              Á
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-display font-bold text-base tracking-wide text-white">
                  ÁGORA • POSUCI 360
                </span>
                <span className="text-[10px] bg-teal-900/80 text-teal-300 px-2.5 py-0.5 rounded-full border border-teal-700 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
                  HL7-FHIR R4 Sincronizado
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium">
                Programa de Prevención y Rehabilitación Post-UCI (PICS) • Clínica de Occidente
              </p>
            </div>
          </div>

          {/* Selector de Pantallas */}
          <nav className="flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-700/80 text-xs overflow-x-auto w-full lg:w-auto">
            <button
              onClick={() => setCurrentView('screen-paciente')}
              className={`px-3.5 py-2 rounded-xl font-semibold transition whitespace-nowrap flex items-center gap-1.5 ${
                currentView === 'screen-paciente'
                  ? 'bg-teal-700 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>📱 1. Mi Día Paciente</span>
            </button>

            <button
              onClick={() => setCurrentView('screen-validacion')}
              className={`px-3.5 py-2 rounded-xl font-semibold transition whitespace-nowrap flex items-center gap-1.5 ${
                currentView === 'screen-validacion'
                  ? 'bg-teal-700 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>🩺 2. Validación Clínica & Feedback</span>
            </button>

            <button
              onClick={() => setCurrentView('screen-diario')}
              className={`px-3.5 py-2 rounded-xl font-semibold transition whitespace-nowrap flex items-center gap-1.5 ${
                currentView === 'screen-diario'
                  ? 'bg-teal-700 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>📖 3. Diario UCI & Familia</span>
            </button>

            <button
              onClick={() => setCurrentView('screen-censo')}
              className={`px-3.5 py-2 rounded-xl font-semibold transition whitespace-nowrap flex items-center gap-1.5 ${
                currentView === 'screen-censo'
                  ? 'bg-teal-700 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>🏥 4. Censo UCI & Semáforo ABCDEF</span>
            </button>

            <button
              onClick={() => setCurrentView('desktop-prescription')}
              className={`px-3 py-2 rounded-xl font-semibold transition whitespace-nowrap flex items-center gap-1.5 ${
                currentView === 'desktop-prescription'
                  ? 'bg-teal-700 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>📋 5. Prescribir Guía</span>
            </button>

            <button
              onClick={() => setCurrentView('stitch-agenda')}
              className={`px-3 py-2 rounded-xl font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                currentView === 'stitch-agenda'
                  ? 'bg-amber-400 text-slate-950 shadow-md ring-2 ring-amber-300'
                  : 'bg-teal-900/60 text-teal-200 hover:text-white hover:bg-teal-800 border border-teal-600/40'
              }`}
            >
              <span>⭐ 6. Cita Día 30</span>
            </button>

            <button
              onClick={() => setCurrentView('ai-studio-data')}
              className={`px-3 py-2 rounded-xl font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                currentView === 'ai-studio-data'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-amber-400 hover:text-amber-300 hover:bg-slate-800'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>⚡ FHIR & AI Studio</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Global alert or action feedback */}
      {validationSuccessBanner && (
        <div className="bg-emerald-50 border-2 border-emerald-500 p-4 rounded-2xl text-emerald-950 text-xs font-semibold flex items-center gap-2.5 shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{validationSuccessBanner}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* SCREEN 1: 📱 MI DÍA PACIENTE (TODA LA INFORMACIÓN LLENA) */}
      {/* ======================================================== */}
      {currentView === 'screen-paciente' && (
        <section className="space-y-4">
          <div className="flex items-center justify-between max-w-[420px] mx-auto px-2 text-xs text-slate-500 font-medium">
            <span>Simulación de Smartphone Clínico</span>
            <span className="flex items-center gap-1 text-teal-700 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" /> Encriptación AES-256 • FHIR Sync
            </span>
          </div>

          <div className="w-full max-w-[420px] mx-auto bg-white rounded-[36px] shadow-2xl border-4 border-slate-800 overflow-hidden flex flex-col transition-all">
            {/* Top App Bar Móvil */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
              <div>
                <span className="text-[10px] font-bold text-teal-800 tracking-wider uppercase block font-display">
                  Ágora Bienestar
                </span>
                <h1 className="text-sm font-bold text-slate-900">Mi Día</h1>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full font-bold">
                  🔥 5d
                </span>
                <span className="text-xs bg-teal-50 text-teal-700 border border-teal-200 px-2.5 py-0.5 rounded-full font-bold">
                  ⚡ 340
                </span>
                <div className="w-8 h-8 rounded-full bg-teal-800 text-white font-bold text-xs flex items-center justify-center font-display shadow-xs">
                  PP
                </div>
              </div>
            </div>

            {/* Contenido Principal con Scroll Móvil */}
            <div className="p-4 space-y-4 bg-slate-50/50 max-h-[640px] overflow-y-auto">
              {/* Saludo y Estado General */}
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">Jueves, 24 Oct • Clínica de Occidente</span>
                  <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded">PICS FASE 3</span>
                </div>
                <h2 className="text-lg font-extrabold text-slate-900 mt-0.5">¡Hola de nuevo, Pepito! 👋</h2>
                <p className="text-xs text-slate-500">Etapa de Mantenimiento Saludable • Graduado PICS</p>
              </div>

              {/* Banner de Logro Post-UCI con botón de Diploma */}
              <div className="bg-gradient-to-r from-teal-800 to-teal-700 rounded-2xl p-4 text-white shadow-md relative overflow-hidden">
                <div className="relative z-10">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-teal-200 block">
                    Superación Médica
                  </span>
                  <h3 className="text-sm font-bold mt-0.5">Graduado de Honor Post-UCI</h3>
                  <p className="text-xs text-teal-100 mt-1 leading-relaxed">
                    Completaste exitosamente las 8 semanas del protocolo de humanización y recuperación PICS.
                  </p>
                  <button
                    onClick={() => setShowDiplomaModal(true)}
                    className="mt-3 bg-white text-teal-800 hover:bg-teal-50 text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-sm transition active:scale-95 flex items-center gap-1.5"
                  >
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    <span>Ver Diploma de Honor</span>
                  </button>
                </div>
              </div>

              {/* Monitoreo Holístico / Índice de Salud Global */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Monitoreo Holístico</span>
                  <span className="text-xs text-teal-700 font-bold">Sobresaliente</span>
                </div>

                <div className="flex items-center gap-4">
                  {/* Gráfico circular con SVG */}
                  <div className="relative w-20 h-20 flex-shrink-0 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-100"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-teal-600"
                        strokeDasharray="92, 100"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute text-center">
                      <span className="text-base font-extrabold text-slate-900 block leading-none">92</span>
                      <span className="text-[9px] text-slate-400 font-bold uppercase">/ 100</span>
                    </div>
                  </div>

                  <div className="flex-1 text-xs text-slate-600 space-y-1">
                    <p className="font-semibold text-slate-800 leading-snug">
                      Excelente resiliencia física y cognitiva.
                    </p>
                    <p className="text-[11px] text-slate-500 leading-tight">
                      Estás 14 puntos sobre el promedio de recuperados PICS a las 8 semanas.
                    </p>
                  </div>
                </div>

                {/* 4 Pilares con barras de porcentaje completas */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-600 font-medium">Movilidad activa</span>
                    <span className="font-bold text-teal-800">95%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-teal-600 h-full rounded-full w-[95%]"></div>
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-600 font-medium">Capacidad respiratoria (Triflo)</span>
                    <span className="font-bold text-teal-800">90%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-teal-600 h-full rounded-full w-[90%]"></div>
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-600 font-medium">Nutrición e hidratación</span>
                    <span className="font-bold text-teal-800">88%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-teal-600 h-full rounded-full w-[88%]"></div>
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-600 font-medium">Salud mental y descanso</span>
                    <span className="font-bold text-teal-800">92%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-teal-600 h-full rounded-full w-[92%]"></div>
                  </div>
                </div>
              </div>

              {/* Telemetría Preventiva Biométrica (Omron BT Sync) */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Telemetría Preventiva</span>
                  <span className="text-[10px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded font-mono font-bold">
                    Omron BT Sync
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Presión Matutina</span>
                    <p className="text-base font-extrabold text-slate-800 mt-0.5">118 / 76 <span className="text-[10px] font-normal text-slate-500">mmHg</span></p>
                    <span className="text-[10px] text-emerald-600 font-semibold">Control basal óptimo</span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Saturación SpO2</span>
                    <p className="text-base font-extrabold text-slate-800 mt-0.5">98% <span className="text-[10px] font-normal text-slate-500">aire amb.</span></p>
                    <span className="text-[10px] text-emerald-600 font-semibold">Sin soporte de O2</span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Frecuencia Cardíaca</span>
                    <p className="text-base font-extrabold text-slate-800 mt-0.5">72 <span className="text-[10px] font-normal text-slate-500">lpm</span></p>
                    <span className="text-[10px] text-teal-700 font-semibold">En rango normal</span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Glicemia Capilar</span>
                    <p className="text-base font-extrabold text-slate-800 mt-0.5">98 <span className="text-[10px] font-normal text-slate-500">mg/dL</span></p>
                    <span className="text-[10px] text-emerald-600 font-semibold">Normoglicemia basal</span>
                  </div>
                </div>
              </div>

              {/* Tarjeta del Cuidador (Lucía Pérez) */}
              <div className="bg-purple-50/70 border border-purple-200/80 rounded-2xl p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-purple-700 text-white font-bold text-xs flex items-center justify-center font-display shadow-xs">
                      LP
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-purple-950">Lucía Pérez</h4>
                      <p className="text-[10px] text-purple-800 font-medium">Cuidadora Principal • Sueño: 7.5 hrs</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-full border border-purple-300">
                    Sobrecarga Baja
                  </span>
                </div>
                <p className="text-xs text-purple-950/80 leading-relaxed italic">
                  “Hoy Lucía tiene programada su tarde de descanso. Ambos disfrutan de una etapa más relajada y segura.”
                </p>
                <div className="pt-1 flex items-center justify-between">
                  <button
                    onClick={handleSendCaregiverThanks}
                    className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition flex items-center gap-1.5 ${
                      caregiverThanksSent
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-white text-purple-900 border-purple-200 hover:bg-purple-100'
                    }`}
                  >
                    <span>❤️ Enviar agradecimiento a Lucía</span>
                    <span className="bg-purple-200/60 text-purple-950 px-1.5 py-0.2 rounded-full text-[10px]">
                      {caregiverThanksCount}
                    </span>
                  </button>
                  {caregiverThanksSent && (
                    <span className="text-[10px] text-purple-700 font-bold animate-fade-in">¡Enviado!</span>
                  )}
                </div>
              </div>

              {/* Metas Activas del Día (Pepito Pérez) */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Metas Cumplidas de Hoy</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    100% Completado
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100 text-xs">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div className="flex-1">
                      <p className="font-bold text-slate-800">Fortalecimiento de cuádriceps y transferencias</p>
                      <span className="text-[10px] text-slate-500">3 series × 8 repeticiones • Borg 2/10</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">10:18 AM</span>
                  </div>

                  <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100 text-xs">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div className="flex-1">
                      <p className="font-bold text-slate-800">Espirómetro Triflo inspiratorio</p>
                      <span className="text-[10px] text-slate-500">10 inspiraciones sostenidas a 900 cc/seg</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">08:45 AM</span>
                  </div>

                  <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100 text-xs">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div className="flex-1">
                      <p className="font-bold text-slate-800">Caminata de 15 minutos en pasillo</p>
                      <span className="text-[10px] text-slate-500">Con supervisión de Lucía • SpO2 97%</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">11:30 AM</span>
                  </div>
                </div>
              </div>

              {/* Medicamentos del Día */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Medicamentos del Día</span>
                  <span className="text-[10px] font-bold text-slate-400">4 tomas programadas</span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <div>
                      <span className="font-bold text-slate-800">Omeprazol 20 mg VO</span>
                      <span className="text-[10px] text-slate-500 block">07:30 AM • En ayunas</span>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                      Tomado ✓
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <div>
                      <span className="font-bold text-slate-800">Enoxaparina 40 mg SC</span>
                      <span className="text-[10px] text-slate-500 block">08:00 AM • Profilaxis PICS</span>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                      Aplicado ✓
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <div>
                      <span className="font-bold text-slate-800">Losartán 50 mg VO</span>
                      <span className="text-[10px] text-slate-500 block">08:00 AM • Antihipertensivo</span>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                      Tomado ✓
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <div>
                      <span className="font-bold text-slate-800">Atorvastatina 20 mg VO</span>
                      <span className="text-[10px] text-slate-500 block">08:00 PM • Antes de dormir</span>
                    </div>
                    <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">
                      Programado
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tab Bar Inferior de 5 Ítems Interactivos */}
            <nav className="bg-white border-t border-slate-200 p-2 grid grid-cols-5 text-center text-[10px] text-slate-500 select-none">
              <button
                onClick={() => setPatientSubTab('dia')}
                className={`flex flex-col items-center gap-0.5 cursor-pointer transition ${
                  patientSubTab === 'dia' ? 'text-teal-700 font-bold' : 'hover:text-slate-800'
                }`}
              >
                <span className="text-base">☀️</span>
                <span>Mi Día</span>
              </button>

              <button
                onClick={() => setPatientSubTab('entrenar')}
                className={`flex flex-col items-center gap-0.5 cursor-pointer transition ${
                  patientSubTab === 'entrenar' ? 'text-teal-700 font-bold' : 'hover:text-slate-800'
                }`}
              >
                <span className="text-base">🏋️</span>
                <span>Entrenar</span>
              </button>

              <button
                onClick={() => setPatientSubTab('nutricion')}
                className={`flex flex-col items-center gap-0.5 cursor-pointer transition ${
                  patientSubTab === 'nutricion' ? 'text-teal-700 font-bold' : 'hover:text-slate-800'
                }`}
              >
                <span className="text-base">🥗</span>
                <span>Nutrición</span>
              </button>

              <button
                onClick={() => setPatientSubTab('mente')}
                className={`flex flex-col items-center gap-0.5 cursor-pointer transition ${
                  patientSubTab === 'mente' ? 'text-teal-700 font-bold' : 'hover:text-slate-800'
                }`}
              >
                <span className="text-base">🧘</span>
                <span>Mente</span>
              </button>

              <button
                onClick={() => setPatientSubTab('retos')}
                className={`flex flex-col items-center gap-0.5 cursor-pointer transition ${
                  patientSubTab === 'retos' ? 'text-teal-700 font-bold' : 'hover:text-slate-800'
                }`}
              >
                <span className="text-base">🏆</span>
                <span>Retos</span>
              </button>
            </nav>
          </div>
        </section>
      )}

      {/* ======================================================== */}
      {/* SCREEN 2: 🩺 VALIDACIÓN CLÍNICA & FEEDBACK CON FIRMA LEY 527 */}
      {/* ======================================================== */}
      {currentView === 'screen-validacion' && (
        <section className="space-y-6">
          {/* Header de Estación Ambulatoria */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-200 uppercase font-mono">
                    ESTACIÓN DE SEGUIMIENTO AMBULATORIO • PICS
                  </span>
                  <span className="text-xs font-mono text-slate-400">#PICS-2024-8841</span>
                </div>
                <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-900 mt-1.5">
                  Devolución Clínica & Firma Digital
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Validador Médico: <strong>Dra. Andrea Morales (Intensivista Titular)</strong> • Paciente:{' '}
                  <strong>Pepito Pérez (62 años)</strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Recurso FHIR Validado</span>
                </span>
              </div>
            </div>

            {/* Layout 2 Columnas de Auditoría Clínica */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-5">
              {/* Columna Izquierda: Detalle de Actividad Reportada (2 cols) */}
              <div className="lg:col-span-2 space-y-5">
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
                    <div>
                      <span className="text-[11px] font-mono font-bold text-slate-500">
                        ACTIVIDAD REPORTADA: EDU-PICS-MOT-04
                      </span>
                      <h3 className="text-base font-bold text-slate-900 mt-0.5">
                        Guía de Fortalecimiento Muscular y Transferencias en Casa
                      </h3>
                    </div>
                    <span className="text-xs text-slate-500 font-semibold bg-white px-2.5 py-1 rounded-md border border-slate-200">
                      Hoy, 10:18 AM Sincronizado
                    </span>
                  </div>

                  {/* 4 Métricas en Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
                    <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Dosis Alcanzada</span>
                      <p className="text-sm font-extrabold text-slate-800 mt-0.5">3 series × 8 rep.</p>
                      <span className="text-[10px] text-slate-500">Bipedestación en silla</span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Escala Borg</span>
                      <p className="text-sm font-extrabold text-slate-800 mt-0.5">2 / 10 • Leve</p>
                      <span className="text-[10px] text-emerald-600 font-semibold">Sin fatiga limitante</span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Frecuencia Cardíaca</span>
                      <p className="text-sm font-extrabold text-slate-800 mt-0.5">78 lpm</p>
                      <span className="text-[10px] text-teal-700 font-semibold">Recuperación en 3 min</span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Oximetría SpO2</span>
                      <p className="text-sm font-extrabold text-slate-800 mt-0.5">97% aire amb.</p>
                      <span className="text-[10px] text-slate-500">Omron BT verificado</span>
                    </div>
                  </div>

                  {/* Bitácora de Lucía Pérez */}
                  <div className="bg-blue-50/70 border border-blue-200/80 p-3.5 rounded-xl text-xs text-blue-950">
                    <p className="font-bold text-blue-900 mb-0.5 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" />
                      <span>Nota de Lucía Pérez (Acompañante familiar):</span>
                    </p>
                    <p className="italic text-slate-700 leading-relaxed">
                      “Papá hizo las 3 series con buena postura y bebió agua después de cada pausa. Noté sus piernas más firmes al levantarse del sillón.”
                    </p>
                  </div>
                </div>

                {/* Historial de la Semana de Pepito */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Tendencia de Recuperación Motora (Últimos 5 Días)
                  </h4>
                  <div className="grid grid-cols-5 gap-2 text-center text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-400 block">Lun</span>
                      <span className="font-bold text-slate-700">1x6</span>
                      <span className="text-[9px] text-emerald-600 block">Borg 4</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-400 block">Mar</span>
                      <span className="font-bold text-slate-700">2x6</span>
                      <span className="text-[9px] text-emerald-600 block">Borg 3</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-400 block">Mié</span>
                      <span className="font-bold text-slate-700">2x8</span>
                      <span className="text-[9px] text-emerald-600 block">Borg 3</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200">
                      <span className="text-[10px] text-teal-800 font-bold block">Hoy</span>
                      <span className="font-bold text-teal-900">3x8</span>
                      <span className="text-[9px] text-teal-700 block font-bold">Borg 2</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-dashed border-slate-200">
                      <span className="text-[10px] text-slate-400 block">Vie</span>
                      <span className="font-bold text-slate-400">Prog.</span>
                      <span className="text-[9px] text-slate-400 block">3x8</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Columna Derecha: Decisión y Firma Médica (1 col) */}
              <div className="bg-[#f8f9ff] border-2 border-teal-500/60 rounded-3xl p-5 space-y-4 shadow-sm">
                <div className="flex items-center justify-between text-xs text-teal-800 font-bold border-b border-teal-200/60 pb-3">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-teal-600" />
                    FIRMA MÉDICA Y MENSAJE
                  </span>
                  <span className="bg-teal-100 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded">
                    Ley 527
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-teal-800 text-white flex items-center justify-center font-bold text-sm shadow-sm font-display shrink-0">
                    AM
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Dra. Andrea Morales</h4>
                    <p className="text-xs text-slate-500 font-medium">Especialista en Cuidado Crítico y PICS</p>
                    <span className="text-[10px] text-teal-700 font-mono">RETHUS: 11440982-Valle</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Devolución Clínica para Pepito y Lucía:
                  </label>
                  <textarea
                    value={doctorFeedbackText}
                    onChange={(e) => setDoctorFeedbackText(e.target.value)}
                    className="w-full text-xs p-3 rounded-2xl border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 h-28 bg-white font-medium text-slate-800 leading-relaxed resize-none shadow-inner"
                  />
                  <span className="text-[10px] text-slate-400 block">
                    Se transmitirá de inmediato a POSUCI 360 móvil vía HL7 Communication.
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => handlePlayAudioFeedback(doctorFeedbackText)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition flex items-center gap-1.5 ${
                      isPlayingAudio
                        ? 'bg-amber-500 text-white border-amber-600 animate-pulse font-bold'
                        : 'text-slate-700 bg-white hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    {isPlayingAudio ? (
                      <>
                        <VolumeX className="w-3.5 h-3.5" /> Detener Voz
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5 text-teal-600" /> Escuchar Mensaje
                      </>
                    )}
                  </button>

                  <span className="text-[10px] font-mono text-slate-400">SHA-256 Validado</span>
                </div>

                <div className="pt-2 border-t border-teal-100 space-y-2">
                  <button
                    onClick={handleExecuteValidation}
                    className="w-full py-3 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 active:scale-98"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Aprobar y Transmitir a POSUCI 360</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handleExecuteRevision}
                      className="py-2 px-2.5 rounded-xl border border-amber-300 text-amber-900 bg-amber-50 hover:bg-amber-100 font-bold text-xs transition text-center"
                    >
                      Devolver a Revisión
                    </button>
                    <button
                      onClick={() => setCurrentView('ai-studio-data')}
                      className="py-2 px-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-xs transition text-center"
                    >
                      Telemetría Cruda
                    </button>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 text-center font-mono pt-1">
                  Firma Electrónica Médica Certificada (Ley 527 de Comercio Electrónico)
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ======================================================== */}
      {/* SCREEN 3: 📖 DIARIO UCI & FAMILIA — MI HISTORIA          */}
      {/* ======================================================== */}
      {currentView === 'screen-diario' && (
        <section className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-md border border-teal-200 uppercase font-mono">
                  TERAPIA DE RECONSTRUCCIÓN DEL RECUERDO POST-UCI
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2 font-display">
                  Diario de UCI: Mi Historia
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Paciente: <strong>Pepito Pérez</strong> • Cuidadora Registrada: <strong>Lucía Pérez</strong> • Clínica de Occidente
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowNewDiaryModal(true)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-700 hover:bg-teal-800 text-white transition flex items-center gap-1.5 shadow-sm"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>+ Escribir Nueva Entrada</span>
                </button>
              </div>
            </div>

            {/* Entradas del Diario con diseño humanizado */}
            <div className="max-w-2xl mx-auto space-y-4">
              {diaryEntries.map((entry) => (
                <article key={entry.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${entry.tagColor}`}>
                      {entry.tag}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">Escrito por: {entry.author}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{entry.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{entry.content}</p>

                  {/* Audio de voz interactivo de Valentina si existe */}
                  {entry.audioDuration && (
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handlePlayValentinaNote}
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-white transition ${
                            isPlayingValentinaAudio ? 'bg-amber-500 animate-pulse' : 'bg-teal-700 hover:bg-teal-800'
                          }`}
                        >
                          {isPlayingValentinaAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                        </button>
                        <div>
                          <p className="font-bold text-slate-800">{entry.audioFrom}</p>
                          <span className="text-[10px] text-slate-400">{entry.audioDuration} • Grabado en Sala de Espera</span>
                        </div>
                      </div>
                      <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded">
                        {isPlayingValentinaAudio ? 'Reproduciendo...' : 'Escuchar'}
                      </span>
                    </div>
                  )}
                </article>
              ))}

              {/* Glosario Integrado de UCI (Pedagógico para Pacientes y Cuidadores) */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-teal-600" />
                  <span>Glosario Comprensible de la UCI</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <strong className="font-bold text-slate-900 block text-xs">VMI (Ventilación Mecánica Invasiva)</strong>
                    <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                      El respirador que te protegió y asistió mientras descansabas para permitir que tus pulmones sanaran.
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <strong className="font-bold text-slate-900 block text-xs">Delirium Post-UCI</strong>
                    <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                      Desorientación o confusión temporal provocada por el estrés de los medicamentos; se resuelve con descanso y afecto familiar.
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <strong className="font-bold text-slate-900 block text-xs">Síndrome PICS</strong>
                    <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                      La debilidad muscular y cognitiva normal tras salir de cuidados intensivos, que superaste gracias al plan de ejercicios.
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <strong className="font-bold text-slate-900 block text-xs">Bundle ABCDEF</strong>
                    <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                      El conjunto de buenas prácticas médicas mundiales que los médicos aplicaron día a día para liberarte del respirador.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ======================================================== */}
      {/* SCREEN 4: 🏥 CENSO UCI & SEMÁFORO ABCDEF                  */}
      {/* ======================================================== */}
      {currentView === 'screen-censo' && (
        <section className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-md border border-teal-200 uppercase font-mono">
                  CENTRO DE EXCELENCIA UCI LIBERATION • TORRE A, PISO 4
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2 font-display">
                  Censo de Camas & Semáforo ABCDEF
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  18 / 20 Camas Ocupadas (90%) • Adherencia Bundle Global: <strong>78%</strong> • Clínica de Occidente
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Cumple
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 font-bold">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span> Parcial
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-100 text-red-800 font-bold">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span> Pendiente
                </span>
              </div>
            </div>

            {/* Grid de Camas de la UCI con Semáforo */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Cama 01: Pepito Pérez */}
              <div className="bg-teal-50/50 border-2 border-teal-500/80 rounded-2xl p-4 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-teal-900">CAMA 01 • PAC-9824</span>
                  <span className="text-[10px] bg-teal-200 text-teal-900 font-bold px-2 py-0.5 rounded">
                    100% ABCDEF
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Pepito Pérez (62a)</h4>
                  <p className="text-[11px] text-slate-500">Choque Séptico Resuelto • VMI día 5 retirado</p>
                </div>
                {/* Semáforo A B C D E F */}
                <div className="grid grid-cols-6 gap-1 text-center font-bold text-xs pt-1">
                  <button onClick={() => setSelectedAbcdefLetter('A')} className="py-1 rounded bg-emerald-500 text-white shadow-2xs hover:scale-105 transition" title="A - Dolor">A</button>
                  <button onClick={() => setSelectedAbcdefLetter('B')} className="py-1 rounded bg-emerald-500 text-white shadow-2xs hover:scale-105 transition" title="B - Despertar">B</button>
                  <button onClick={() => setSelectedAbcdefLetter('C')} className="py-1 rounded bg-emerald-500 text-white shadow-2xs hover:scale-105 transition" title="C - Sedación">C</button>
                  <button onClick={() => setSelectedAbcdefLetter('D')} className="py-1 rounded bg-emerald-500 text-white shadow-2xs hover:scale-105 transition" title="D - Delirium">D</button>
                  <button onClick={() => setSelectedAbcdefLetter('E')} className="py-1 rounded bg-emerald-500 text-white shadow-2xs hover:scale-105 transition" title="E - Movilidad">E</button>
                  <button onClick={() => setSelectedAbcdefLetter('F')} className="py-1 rounded bg-emerald-500 text-white shadow-2xs hover:scale-105 transition" title="F - Familia">F</button>
                </div>
                <div className="text-[10px] text-teal-800 font-medium pt-1 border-t border-teal-100 flex items-center justify-between">
                  <span>Alta a piso autorizada</span>
                  <span className="font-bold">Dra. Morales</span>
                </div>
              </div>

              {/* Cama 02: Caso Urinario Ficticio */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">CAMA 02 • PAC-8109</span>
                  <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">
                    50% ABCDEF
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Caso Clínico Ficticio 2 (54a)</h4>
                  <p className="text-[11px] text-slate-500">Sepsis Foco Urinario • VMI Día 8</p>
                </div>
                <div className="grid grid-cols-6 gap-1 text-center font-bold text-xs pt-1">
                  <button onClick={() => setSelectedAbcdefLetter('A')} className="py-1 rounded bg-emerald-500 text-white">A</button>
                  <button onClick={() => setSelectedAbcdefLetter('B')} className="py-1 rounded bg-red-500 text-white">B</button>
                  <button onClick={() => setSelectedAbcdefLetter('C')} className="py-1 rounded bg-amber-400 text-slate-900">C</button>
                  <button onClick={() => setSelectedAbcdefLetter('D')} className="py-1 rounded bg-red-500 text-white">D</button>
                  <button onClick={() => setSelectedAbcdefLetter('E')} className="py-1 rounded bg-slate-300 text-slate-600">E</button>
                  <button onClick={() => setSelectedAbcdefLetter('F')} className="py-1 rounded bg-emerald-500 text-white">F</button>
                </div>
                <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-100 flex items-center justify-between">
                  <span>Prueba SBT pendiente</span>
                  <span>Dr. Rivera</span>
                </div>
              </div>

              {/* Cama 03: Post-quirúrgico Ficticio */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">CAMA 03 • PAC-4412</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                    83% ABCDEF
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Caso Clínico Ficticio 3 (71a)</h4>
                  <p className="text-[11px] text-slate-500">Post-Pancreatectomía • Cánula de Alto Flujo</p>
                </div>
                <div className="grid grid-cols-6 gap-1 text-center font-bold text-xs pt-1">
                  <button onClick={() => setSelectedAbcdefLetter('A')} className="py-1 rounded bg-emerald-500 text-white">A</button>
                  <button onClick={() => setSelectedAbcdefLetter('B')} className="py-1 rounded bg-slate-300 text-slate-600">B</button>
                  <button onClick={() => setSelectedAbcdefLetter('C')} className="py-1 rounded bg-emerald-500 text-white">C</button>
                  <button onClick={() => setSelectedAbcdefLetter('D')} className="py-1 rounded bg-emerald-500 text-white">D</button>
                  <button onClick={() => setSelectedAbcdefLetter('E')} className="py-1 rounded bg-emerald-500 text-white">E</button>
                  <button onClick={() => setSelectedAbcdefLetter('F')} className="py-1 rounded bg-emerald-500 text-white">F</button>
                </div>
                <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-100 flex items-center justify-between">
                  <span>Bipedestación activa</span>
                  <span>Ft. Vargas</span>
                </div>
              </div>

              {/* Cama 04: SDRA Ficticio */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">CAMA 04 • PAC-2910</span>
                  <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">
                    66% ABCDEF
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Caso Clínico Ficticio 4 (48a)</h4>
                  <p className="text-[11px] text-slate-500">Neumonía Viral Grave • VMI Prono 16h</p>
                </div>
                <div className="grid grid-cols-6 gap-1 text-center font-bold text-xs pt-1">
                  <button onClick={() => setSelectedAbcdefLetter('A')} className="py-1 rounded bg-emerald-500 text-white">A</button>
                  <button onClick={() => setSelectedAbcdefLetter('B')} className="py-1 rounded bg-red-500 text-white">B</button>
                  <button onClick={() => setSelectedAbcdefLetter('C')} className="py-1 rounded bg-emerald-500 text-white">C</button>
                  <button onClick={() => setSelectedAbcdefLetter('D')} className="py-1 rounded bg-amber-400 text-slate-900">D</button>
                  <button onClick={() => setSelectedAbcdefLetter('E')} className="py-1 rounded bg-slate-300 text-slate-600">E</button>
                  <button onClick={() => setSelectedAbcdefLetter('F')} className="py-1 rounded bg-emerald-500 text-white">F</button>
                </div>
                <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-100 flex items-center justify-between">
                  <span>Sedación analítica</span>
                  <span>Dra. Morales</span>
                </div>
              </div>
            </div>

            {/* Panel de Detalle Didáctico del Bundle ABCDEF */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900">
                  {selectedAbcdefLetter
                    ? abcdefDictionary[selectedAbcdefLetter].title
                    : 'Haz clic en cualquier letra (A - F) para auditar el componente'}
                </h3>
                {selectedAbcdefLetter && (
                  <button
                    onClick={() => setSelectedAbcdefLetter(null)}
                    className="text-xs text-teal-700 hover:underline font-bold"
                  >
                    Ver resumen general
                  </button>
                )}
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {selectedAbcdefLetter
                  ? abcdefDictionary[selectedAbcdefLetter].desc
                  : 'El Paquete de Medidas ABCDEF (ICU Liberation) es el estándar de oro de la Society of Critical Care Medicine (SCCM) implementado en la Clínica de Occidente para reducir el delirium, acortar la estancia en UCI y prevenir el Síndrome Post-Cuidados Intensivos (PICS).'}
              </p>

              {selectedAbcdefLetter && (
                <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-900 font-semibold">
                  ✓ {abcdefDictionary[selectedAbcdefLetter].bundleTarget}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ======================================================== */}
      {/* VISTA 5: PRESCRIPCIÓN DE GUÍA (ÁGORA DESKTOP) */}
      {/* ======================================================== */}
      {currentView === 'desktop-prescription' && (
        <section className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="border-b border-slate-100 pb-4 mb-6">
              <span className="text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-md border border-teal-200 font-mono">
                ASIGNACIÓN CLÍNICA ACTIVA • PICS FASE 3
              </span>
              <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-900 mt-2">
                Prescribir Guía Educativa a Pepito Pérez
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Módulo de Prescripción de Micro-Metas Motoras y Fisioterapia • Clínica de Occidente
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 rounded-2xl border border-teal-200 bg-teal-50/60">
                  <span className="text-[11px] font-mono text-teal-800 font-bold">CÓDIGO: EDU-PICS-MOT-04</span>
                  <h3 className="text-sm font-bold text-slate-900 mt-1">
                    Guía de Fortalecimiento Muscular y Transferencias en Casa
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    12 min de lectura/video • Prescrito por: Ft. Carlos Vargas / Dra. Andrea Morales
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-2">Bloque Cronobiológico:</label>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <label
                      onClick={() => setPrescribeBlock('morning')}
                      className={`flex items-center gap-2 p-3.5 rounded-2xl border cursor-pointer transition ${
                        prescribeBlock === 'morning'
                          ? 'border-teal-500 bg-teal-50 font-bold text-teal-900 shadow-xs'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="block"
                        checked={prescribeBlock === 'morning'}
                        onChange={() => setPrescribeBlock('morning')}
                        className="text-teal-600"
                      />
                      <span>Mañana (10:00 AM)</span>
                    </label>

                    <label
                      onClick={() => setPrescribeBlock('afternoon')}
                      className={`flex items-center gap-2 p-3.5 rounded-2xl border cursor-pointer transition ${
                        prescribeBlock === 'afternoon'
                          ? 'border-teal-500 bg-teal-50 font-bold text-teal-900 shadow-xs'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="block"
                        checked={prescribeBlock === 'afternoon'}
                        onChange={() => setPrescribeBlock('afternoon')}
                        className="text-teal-600"
                      />
                      <span>Tarde (04:00 PM)</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Instrucción para el Paciente:
                  </label>
                  <textarea
                    value={prescribeNote}
                    onChange={(e) => setPrescribeNote(e.target.value)}
                    className="w-full text-xs p-3.5 rounded-2xl border border-slate-300 h-28 bg-white font-medium focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 text-slate-800"
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Previsualización de Impacto
                  </span>
                  <h4 className="font-bold text-sm text-slate-800 mt-1">Impacto en POSUCI 360 Conecta</h4>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    Al confirmar la prescripción, se generará el recurso estándar{' '}
                    <code className="bg-slate-200 px-1.5 py-0.5 rounded text-[11px] font-mono font-bold text-slate-800">
                      CarePlan/CP-MOT-8841
                    </code>{' '}
                    y se añadirá automáticamente a la tarjeta{' '}
                    <strong>"Tu Día" ({prescribeBlock === 'morning' ? '10:00 AM' : '04:00 PM'})</strong> del móvil de Pepito y el panel de Lucía.
                  </p>

                  <div className="mt-4 p-3 bg-teal-50 rounded-xl border border-teal-200 text-xs text-teal-950 font-medium">
                    ✓ Codificado SNOMED-CT 229174000<br />
                    ✓ Enlace a tele-fisioterapia con protocolo de bipedestación
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleConfirmPrescription}
                    className="w-full py-3.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-md transition text-center flex items-center justify-center gap-2"
                  >
                    <span>Confirmar y Enviar a POSUCI 360</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ======================================================== */}
      {/* VISTA 6: AGENDAMIENTO DÍA 30 (PALETA STITCH) */}
      {/* ======================================================== */}
      {currentView === 'stitch-agenda' && (
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden p-2 sm:p-4">
          <AgendamientoPostUci30Dias onBack={() => setCurrentView('screen-paciente')} />
        </section>
      )}

      {/* ======================================================== */}
      {/* VISTA 7: SUITE DE DATOS PARA GOOGLE AI STUDIO / FHIR R4  */}
      {/* ======================================================== */}
      {currentView === 'ai-studio-data' && (
        <section className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-md border border-amber-200">
                  PAQUETE COMPLETO PARA GOOGLE AI STUDIO
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2 font-display">
                  Datos, Código HTML/Tailwind y Recursos FHIR
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Copia directamente estos paquetes y pégalos en Google AI Studio (Gemini 1.5 Pro / Flash) para continuar la programación.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard(fullHtmlCode, 'html')}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-700 hover:bg-teal-800 text-white transition flex items-center gap-1.5 shadow-sm"
                >
                  {copiedKey === 'html' ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedKey === 'html' ? '¡Código HTML Copiado!' : 'Copiar Código HTML Completo'}</span>
                </button>
              </div>
            </div>

            {/* Selector de paquete de datos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card 1: HTML Master Template */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <FileCode2 className="w-4 h-4 text-teal-600" /> Código HTML Maestro
                    </span>
                    <span className="text-[10px] font-mono bg-slate-200 px-1.5 py-0.5 rounded">Unificado</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Archivo autónomo con Tailwind CDN, fuentes Montserrat/Jakarta y JavaScript de alternancia en vivo.
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(fullHtmlCode, 'html')}
                  className="w-full py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-900 text-white transition flex items-center justify-center gap-1"
                >
                  {copiedKey === 'html' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copiar HTML</span>
                </button>
              </div>

              {/* Card 2: FHIR R4 Bundle JSON */}
              <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-teal-950 text-xs flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-teal-600" /> Contratos FHIR R4
                    </span>
                    <span className="text-[10px] font-mono bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded">JSON</span>
                  </div>
                  <p className="text-xs text-teal-900/80 mt-1">
                    Recursos CarePlan y Observation en vivo listos para persistencia o simulación de APIs.
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(JSON.stringify({ carePlans, fhirObservations }, null, 2), 'fhir')}
                  className="w-full py-2 rounded-xl text-xs font-bold bg-teal-800 hover:bg-teal-900 text-white transition flex items-center justify-center gap-1"
                >
                  {copiedKey === 'fhir' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copiar FHIR JSON</span>
                </button>
              </div>

              {/* Card 3: System Prompt */}
              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-indigo-950 text-xs flex items-center gap-1.5">
                      <Terminal className="w-4 h-4 text-indigo-600" /> System Prompt PICS
                    </span>
                    <span className="text-[10px] font-mono bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded">AI Studio</span>
                  </div>
                  <p className="text-xs text-indigo-900/80 mt-1">
                    Directivas éticas inviolables (Desacoplamiento, Ley 527, No Inventar Biometría, FHIR).
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard('Prompt Clínico ÁGORA', 'prompt')}
                  className="w-full py-2 rounded-xl text-xs font-bold bg-indigo-700 hover:bg-indigo-800 text-white transition flex items-center justify-center gap-1"
                >
                  {copiedKey === 'prompt' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copiar Prompt</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ======================================================== */}
      {/* MODAL 1: DIPLOMA DE HONOR Y SUPERACIÓN MÉDICA POST-UCI  */}
      {/* ======================================================== */}
      {showDiplomaModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-4 border-amber-300 relative space-y-5 animate-scale-in">
            <button
              onClick={() => setShowDiplomaModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Encabezado Institucional */}
            <div className="text-center space-y-1 border-b border-amber-200/60 pb-4">
              <span className="text-[10px] font-bold tracking-widest uppercase text-teal-800 font-display">
                CLÍNICA DE OCCIDENTE • CENTRO DE EXCELENCIA PICS
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display text-amber-800">
                DIPLOMA DE HONOR Y SUPERACIÓN
              </h2>
              <p className="text-xs text-slate-500">Programa Integral de Humanización y Recuperación Post-UCI</p>
            </div>

            {/* Cuerpo del Diploma */}
            <div className="text-center space-y-3 py-2">
              <span className="text-xs text-slate-600 block">Confiere con la más alta distinción a:</span>
              <h3 className="text-2xl font-black text-slate-900 font-display tracking-wide uppercase text-teal-900">
                Pepito Pérez
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed max-w-md mx-auto">
                Por su admirable valentía, perseverancia y adherencia al programa de rehabilitación neuromuscular, respiratoria y cognitiva, superando 14 días de ventilación mecánica invasiva y alcanzando una recuperación funcional ejemplar.
              </p>
            </div>

            {/* Firmas Oficiales */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 text-center text-xs">
              <div className="space-y-1">
                <div className="font-script text-slate-800 text-base italic">Dra. Andrea Morales</div>
                <div className="h-0.5 w-24 bg-slate-400 mx-auto"></div>
                <span className="font-bold text-slate-900 block text-[11px]">Dra. Andrea Morales</span>
                <span className="text-[10px] text-slate-500 block">Intensivista Titular • RETHUS 11440982</span>
              </div>

              <div className="space-y-1">
                <div className="font-script text-slate-800 text-base italic">Ft. Carlos Vargas</div>
                <div className="h-0.5 w-24 bg-slate-400 mx-auto"></div>
                <span className="font-bold text-slate-900 block text-[11px]">Ft. Carlos Vargas</span>
                <span className="text-[10px] text-slate-500 block">Fisioterapeuta Respiratorio y Motor</span>
              </div>
            </div>

            {/* Hash Criptográfico y Pie */}
            <div className="pt-2 text-[10px] text-slate-400 font-mono text-center flex items-center justify-between">
              <span>Certificado: #PICS-HONOR-8841</span>
              <span>SHA-256: 7f8a9...b14e</span>
            </div>

            <button
              onClick={() => setShowDiplomaModal(false)}
              className="w-full py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs shadow-md transition"
            >
              Cerrar Diploma
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: NUEVA ENTRADA EN DIARIO DE UCI                  */}
      {/* ======================================================== */}
      {showNewDiaryModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative space-y-4">
            <button
              onClick={() => setShowNewDiaryModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">Escribir en el Diario de Pepito</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Registra un momento, recuerdo o palabra de aliento familiar para la recuperación.
              </p>
            </div>

            <form onSubmit={handleAddDiaryEntry} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Título de la Memoria:</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Caminamos por el jardín de la clínica"
                  value={newDiaryTitle}
                  onChange={(e) => setNewDiaryTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Firma / Autor:</label>
                <input
                  type="text"
                  value={newDiaryAuthor}
                  onChange={(e) => setNewDiaryAuthor(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Historia o Mensaje:</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Pepito, hoy nos sorprendiste cuando..."
                  value={newDiaryBody}
                  onChange={(e) => setNewDiaryBody(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-1 focus:ring-teal-500 resize-none"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewDiaryModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold shadow-md"
                >
                  Guardar en el Diario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

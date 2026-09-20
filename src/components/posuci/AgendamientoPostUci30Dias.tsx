import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  HelpCircle,
  User,
  Star,
  ShieldCheck,
  Check,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Video,
  Building2,
  PhoneCall,
  Send,
  Sparkles,
  Info,
  Code2,
  Palette,
  Layers,
  ChevronRight,
  Accessibility,
  Heart,
  Brain,
  Activity,
  UserCheck,
  Share2,
  X
} from 'lucide-react';

interface Props {
  onBack?: () => void;
  isEmbedded?: boolean;
}

export const AgendamientoPostUci30Dias: React.FC<Props> = ({ onBack, isEmbedded = false }) => {
  const { currentCase, agenda, bookCoordinatedAppointment, gamification } = useApp();

  // Check if already booked in global state
  const existingAppt = agenda.find(a => a.id.startsWith('agenda-day30'));

  // Selected date and hour
  const [selectedDate, setSelectedDate] = useState('Mié 14 Nov');
  const [selectedHour, setSelectedHour] = useState('10:30 AM');

  // Modality: 'presencial' | 'virtual'
  const [modality, setModality] = useState<'presencial' | 'virtual'>('presencial');

  // Wheelchair assistance toggle
  const [wheelchairRequested, setWheelchairRequested] = useState(true);

  // Preparation checklist items
  const [checklist, setChecklist] = useState<{ id: string; title: string; subtitle: string; checked: boolean }[]>([
    {
      id: 'item-1',
      title: 'Diario de UCI (físico o digital)',
      subtitle: 'Con preguntas o dudas que hayan surgido en casa',
      checked: true
    },
    {
      id: 'item-2',
      title: 'Medicamentos actuales y caja de Losartán / inhalador',
      subtitle: 'Para reconciliación farmacológica completa',
      checked: true
    },
    {
      id: 'item-3',
      title: 'Últimos exámenes de laboratorio de egreso',
      subtitle: 'Si los realizaste fuera de la red de Occidente',
      checked: false
    },
    {
      id: 'item-4',
      title: 'Acompañante principal confirmado',
      subtitle: 'Lucía Restrepo (Cuidadora activa)',
      checked: true
    },
    {
      id: 'item-5',
      title: 'Ropa y calzado deportivo cómodo',
      subtitle: 'Para prueba de marcha y dinamometría sin tropiezos',
      checked: false
    }
  ]);

  // Toast confirmation state
  const [showToast, setShowToast] = useState(false);
  const [confirmedData, setConfirmedData] = useState<{
    date: string;
    hour: string;
    modality: string;
    wheelchair: boolean;
  } | null>(null);

  // Modal / Nurse chat drawer
  const [showNurseChat, setShowNurseChat] = useState(false);
  const [nurseMessages, setNurseMessages] = useState<{ sender: 'nurse' | 'user'; text: string; time: string }[]>([
    {
      sender: 'nurse',
      text: '¡Hola Carlos y Lucía! Soy Laura Gómez, Enfermera de Enlace PICS de la Clínica de Occidente. ¿En qué podemos orientarles respecto a la cita de los 30 días?',
      time: '10:00 AM'
    }
  ]);
  const [nurseInput, setNurseInput] = useState('');

  // Help FAQ Modal
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Developer / Stitch Palette drawer tab
  const [showDevTokens, setShowDevTokens] = useState(false);

  const toggleChecklistItem = (id: string) => {
    setChecklist(prev =>
      prev.map(item => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const handleConfirmBooking = () => {
    bookCoordinatedAppointment({
      date: selectedDate,
      hour: selectedHour,
      modality,
      wheelchairRequested
    });
    setConfirmedData({
      date: selectedDate,
      hour: selectedHour,
      modality,
      wheelchair: wheelchairRequested
    });
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 5500);
  };

  const handleSendNurseMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!nurseInput.trim()) return;

    const userText = nurseInput;
    const nowTime = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
    setNurseMessages(prev => [...prev, { sender: 'user', text: userText, time: nowTime }]);
    setNurseInput('');

    setTimeout(() => {
      setNurseMessages(prev => [
        ...prev,
        {
          sender: 'nurse',
          text: 'Perfecto, Carlos y Lucía. Tomo nota en su expediente PICS (#PICS-2024-8841). Nuestro equipo de camillería y los especialistas ya tienen preparada la sala para recibirlos.',
          time: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1200);
  };

  // Day carousel data
  const daysOptions = [
    { day: 'LUN', dateNum: '12', hour: '09:00 AM', status: 'full' },
    { day: 'MAR', dateNum: '13', hour: '09:00 AM', status: 'available', fullDate: 'Mar 13 Nov' },
    { day: 'MIÉ', dateNum: '14', hour: '10:30 AM', status: 'available', fullDate: 'Mié 14 Nov' },
    { day: 'JUE', dateNum: '15', hour: '02:00 PM', status: 'available', fullDate: 'Jue 15 Nov' },
    { day: 'VIE', dateNum: '16', hour: '11:00 AM', status: 'available', fullDate: 'Vie 16 Nov' }
  ];

  // Stitch Palette reference tokens for inspection
  const stitchColors = [
    { token: 'primary', hex: '#005c55', name: 'Deep Teal (Marca PICS)', text: '#ffffff' },
    { token: 'primary-container', hex: '#0f766e', name: 'Teal Container', text: '#ffffff' },
    { token: 'secondary', hex: '#855300', name: 'Golden Amber (Hito 30)', text: '#ffffff' },
    { token: 'secondary-fixed', hex: '#ffddb8', name: 'Warm Amber Badge', text: '#2a1700' },
    { token: 'tertiary', hex: '#3b3bc9', name: 'Royal Cognitive Violet', text: '#ffffff' },
    { token: 'tertiary-fixed', hex: '#e1e0ff', name: 'Lavender Surface', text: '#07006c' },
    { token: 'surface', hex: '#f8f9ff', name: 'Canvas Principal', text: '#0b1c30' },
    { token: 'surface-container-low', hex: '#eff4ff', name: 'Container Suave', text: '#0b1c30' },
    { token: 'surface-container-lowest', hex: '#ffffff', name: 'Card Blanca', text: '#0b1c30' }
  ];

  return (
    <div className="w-full bg-surface text-on-surface font-body-md min-h-screen relative flex flex-col antialiased">
      {/* ======================================================== */}
      {/* HEADER DE STITCH CON DISEÑO MATERIAL 3                   */}
      {/* ======================================================== */}
      <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-xl border-b border-surface-container shadow-[0_1px_8px_rgba(0,0,0,0.04)] px-4 sm:px-6 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <button
              onClick={() => (onBack ? onBack() : window.history.back())}
              aria-label="Regresar"
              className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex flex-col min-w-0">
              <span className="font-label-sm text-[11px] text-primary uppercase tracking-wider truncate font-bold">
                Clínica de Occidente • Programa PICS
              </span>
              <h1 className="font-title-md text-base sm:text-lg font-bold text-on-surface truncate">
                Agendamiento Post Uci (30 Días)
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Developer Stitch Inspector Toggle */}
            <button
              onClick={() => setShowDevTokens(prev => !prev)}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-secondary-fixed text-on-secondary-fixed hover:bg-secondary-container transition"
              title="Ver tokens Stitch y arquitectura de código"
            >
              <Palette className="w-3.5 h-3.5 text-secondary" />
              <span>Paleta Stitch</span>
            </button>

            <button
              onClick={() => setShowHelpModal(true)}
              aria-label="Centro de ayuda y soporte clínico"
              className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
            >
              <HelpCircle className="w-5 h-5" />
            </button>

            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-[0_2px_6px_rgba(0,92,85,0.25)] text-on-primary font-bold text-xs">
              CM
            </div>
          </div>
        </div>
      </header>

      {/* ======================================================== */}
      {/* CUERPO PRINCIPAL                                         */}
      {/* ======================================================== */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 pb-28 space-y-6">
        {/* Banner para móviles que avisa de la paleta Stitch */}
        <div className="sm:hidden flex items-center justify-between bg-surface-container p-2.5 rounded-xl text-xs">
          <span className="font-semibold text-primary flex items-center gap-1">
            <Palette className="w-3.5 h-3.5 text-primary" /> Paleta Stitch Activa
          </span>
          <button
            onClick={() => setShowDevTokens(true)}
            className="text-[11px] font-bold text-secondary underline"
          >
            Ver Tokens
          </button>
        </div>

        {/* Estado actual si ya está agendada en la plataforma */}
        {existingAppt && (
          <div className="bg-teal-900/10 border border-teal-600/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold shrink-0">
                <CheckCircle2 className="w-5 h-5 text-on-primary" />
              </div>
              <div>
                <span className="text-xs font-bold text-primary uppercase tracking-wide flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Cita Activa Sincronizada en tu Expediente
                </span>
                <p className="font-bold text-sm text-slate-900">{existingAppt.dateTime}</p>
                <p className="text-xs text-slate-600 truncate">{existingAppt.location}</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold shrink-0">
              Confirmada
            </span>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* 1. BANNER CLÍNICO & VALOR TERAPÉUTICO DEL HITO 30 DÍAS */}
        {/* ---------------------------------------------------- */}
        <section className="relative overflow-hidden rounded-2xl bg-surface-container-low shadow-xs p-5 sm:p-6 flex flex-col gap-4 border border-surface-container">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-xs font-bold tracking-wide shadow-xs">
              <Star className="w-4 h-4 fill-secondary text-secondary" />
              Hito Clave • Día 30
            </span>
            <span className="inline-flex items-center gap-1.5 text-primary font-label-sm text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
              Programa PICS
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <h2 className="font-headline-md text-xl sm:text-2xl text-on-surface font-bold">
              Consulta Integral Post-UCI
            </h2>
            <p className="font-body-md text-sm sm:text-base text-on-surface-variant leading-relaxed">
              Carlos, esta sesión coordinada evalúa en profundidad la recuperación de tu cuerpo, tu memoria y tu bienestar emocional, consolidando el retorno gradual a tu vida cotidiana junto a Lucía.
            </p>
          </div>

          {/* Cobertura Institucional Card */}
          <div className="rounded-xl bg-surface-container-lowest p-4 flex items-center gap-3.5 shadow-xs border border-surface-container/60">
            <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center shrink-0 text-on-primary-fixed">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-label-md text-sm text-primary font-bold">
                100% Cubierto por Humanización UCI
              </span>
              <span className="font-body-sm text-xs text-on-surface-variant truncate">
                Clínica de Occidente S.A. • Sin copagos ni cuotas moderadoras
              </span>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------- */}
        {/* 2. LAS 3 ESFERAS PICS: EVALUACIÓN MULTIDISCIPLINARIA */}
        {/* ---------------------------------------------------- */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="font-title-md text-base sm:text-lg font-bold text-on-surface">
              Las 3 Esferas de tu Valoración
            </h3>
            <span className="font-label-sm text-xs font-bold text-on-surface-variant bg-surface-container px-2.5 py-0.5 rounded-full">
              90 min unificados
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {/* Esfera Física */}
            <div className="rounded-xl bg-surface-container-lowest p-4 shadow-xs flex items-start gap-3.5 border border-surface-container/60">
              <div className="w-11 h-11 rounded-xl bg-primary-fixed-dim/40 flex items-center justify-center shrink-0 text-primary">
                <Activity className="w-6 h-6" />
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h4 className="font-title-md text-sm sm:text-base font-bold text-on-surface">
                    Esfera Física & Motora
                  </h4>
                  <span className="font-label-sm text-[11px] text-primary px-2.5 py-0.5 rounded-full bg-surface-container font-bold">
                    Ft + Neumología
                  </span>
                </div>
                <p className="font-body-sm text-xs sm:text-sm text-on-surface-variant mt-1 leading-relaxed">
                  Fuerza muscular post-ventilación (ICUAW), prueba de marcha de 6 minutos, capacidad pulmonar y revisión de vía aérea.
                </p>
              </div>
            </div>

            {/* Esfera Cognitiva */}
            <div className="rounded-xl bg-surface-container-lowest p-4 shadow-xs flex items-start gap-3.5 border border-surface-container/60">
              <div className="w-11 h-11 rounded-xl bg-tertiary-fixed flex items-center justify-center shrink-0 text-tertiary">
                <Brain className="w-6 h-6 text-tertiary" />
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h4 className="font-title-md text-sm sm:text-base font-bold text-on-surface">
                    Esfera Cognitiva & Memoria
                  </h4>
                  <span className="font-label-sm text-[11px] text-tertiary px-2.5 py-0.5 rounded-full bg-surface-container font-bold">
                    Neuropsicología
                  </span>
                </div>
                <p className="font-body-sm text-xs sm:text-sm text-on-surface-variant mt-1 leading-relaxed">
                  Agilidad mental, concentración, memoria de trabajo y resolución de dudas sobre lagunas temporales del periodo en UCI.
                </p>
              </div>
            </div>

            {/* Esfera Emocional & Cuidador */}
            <div className="rounded-xl bg-surface-container-lowest p-4 shadow-xs flex items-start gap-3.5 border border-surface-container/60">
              <div className="w-11 h-11 rounded-xl bg-secondary-fixed flex items-center justify-center shrink-0 text-secondary">
                <Heart className="w-6 h-6 text-secondary" />
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h4 className="font-title-md text-sm sm:text-base font-bold text-on-surface">
                    Esfera Emocional & Familiar
                  </h4>
                  <span className="font-label-sm text-[11px] text-secondary px-2.5 py-0.5 rounded-full bg-surface-container font-bold">
                    Psicología UCI
                  </span>
                </div>
                <p className="font-body-sm text-xs sm:text-sm text-on-surface-variant mt-1 leading-relaxed">
                  Gestión del descanso, prevención de pesadillas/ansiedad y valoración de sobrecarga para Lucía (Protocolo PICS-Familiar).
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------- */}
        {/* 3. SELECTOR DE MODALIDAD                             */}
        {/* ---------------------------------------------------- */}
        <section className="flex flex-col gap-3">
          <h3 className="font-title-md text-base sm:text-lg font-bold text-on-surface">
            Modalidad de Consulta
          </h3>

          <div className="grid grid-cols-1 gap-2.5">
            {/* Presencial (Recomendado) */}
            <div
              onClick={() => setModality('presencial')}
              className={`cursor-pointer rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col gap-2 transition-all duration-200 border ${
                modality === 'presencial'
                  ? 'bg-primary-container text-on-primary border-primary ring-2 ring-primary/40'
                  : 'bg-surface-container-lowest text-on-surface border-surface-container hover:bg-surface-container-low'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className={`w-5 h-5 ${modality === 'presencial' ? 'text-on-primary' : 'text-primary'}`} />
                  <span className="font-title-md font-bold">Presencial en Sede Especializada</span>
                </div>
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    modality === 'presencial'
                      ? 'bg-on-primary text-primary font-bold'
                      : 'bg-surface-container text-on-surface-variant'
                  }`}
                >
                  {modality === 'presencial' && <Check className="w-4 h-4 stroke-[3]" />}
                </span>
              </div>
              <p
                className={`font-body-sm text-xs sm:text-sm leading-relaxed ${
                  modality === 'presencial' ? 'text-on-primary-container' : 'text-on-surface-variant'
                }`}
              >
                Altamente recomendada por tu equipo médico para realizar la dinamometría física y espirometría completa.
              </p>
              <div
                className={`mt-1 pt-2 rounded-lg p-2.5 flex items-center gap-2 text-xs ${
                  modality === 'presencial' ? 'bg-black/15 text-white' : 'bg-surface-container text-on-surface'
                }`}
              >
                <Accessibility className="w-4 h-4 shrink-0" />
                <span className="font-label-sm">
                  Torre Médica Occidente, Piso 4 - Cons. 408 (100% Sin barreras arquitectónicas)
                </span>
              </div>
            </div>

            {/* Teleconsulta Integral */}
            <div
              onClick={() => setModality('virtual')}
              className={`cursor-pointer rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col gap-2 transition-all duration-200 border ${
                modality === 'virtual'
                  ? 'bg-primary-container text-on-primary border-primary ring-2 ring-primary/40'
                  : 'bg-surface-container-lowest text-on-surface border-surface-container hover:bg-surface-container-low'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Video className={`w-5 h-5 ${modality === 'virtual' ? 'text-on-primary' : 'text-on-surface-variant'}`} />
                  <span className="font-title-md font-bold">Teleconsulta Domiciliaria</span>
                </div>
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    modality === 'virtual'
                      ? 'bg-on-primary text-primary font-bold'
                      : 'bg-surface-container text-on-surface-variant'
                  }`}
                >
                  {modality === 'virtual' && <Check className="w-4 h-4 stroke-[3]" />}
                </span>
              </div>
              <p
                className={`font-body-sm text-xs sm:text-sm leading-relaxed ${
                  modality === 'virtual' ? 'text-on-primary-container' : 'text-on-surface-variant'
                }`}
              >
                Indicada exclusivamente si presentas fiebre, fatiga extrema o imposibilidad severa de traslado en vehículo.
              </p>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------- */}
        {/* 4. SELECCIÓN DE FECHA Y HORARIO SUGERIDO             */}
        {/* ---------------------------------------------------- */}
        <section className="flex flex-col gap-3">
          <div className="flex flex-col">
            <h3 className="font-title-md text-base sm:text-lg font-bold text-on-surface">
              Ventana Óptima Post-UCI
            </h3>
            <p className="font-body-sm text-xs sm:text-sm text-on-surface-variant">
              Semana del 12 al 16 de Noviembre (Días 28–32 post-alta)
            </p>
          </div>

          {/* Carrusel Horizontal de Días */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-1.5 -mx-4 px-4 sm:mx-0 sm:px-0">
            {daysOptions.map(day => {
              const isFull = day.status === 'full';
              const isSelected = selectedDate === day.fullDate;

              if (isFull) {
                return (
                  <div
                    key={day.day}
                    className="shrink-0 w-20 py-3 rounded-2xl bg-surface-container-high text-on-surface-variant opacity-50 flex flex-col items-center gap-1 cursor-not-allowed text-center border border-surface-container"
                  >
                    <span className="font-label-sm text-xs">{day.day}</span>
                    <span className="font-headline-sm text-lg font-bold">{day.dateNum}</span>
                    <span className="font-label-sm text-[10px] uppercase font-bold text-error">Lleno</span>
                  </div>
                );
              }

              return (
                <button
                  key={day.day}
                  type="button"
                  onClick={() => {
                    if (day.fullDate) {
                      setSelectedDate(day.fullDate);
                      setSelectedHour(day.hour);
                    }
                  }}
                  className={`shrink-0 py-3 rounded-2xl flex flex-col items-center gap-1 transition-all text-center border shadow-xs ${
                    isSelected
                      ? 'w-24 bg-primary text-on-primary scale-105 border-primary shadow-md font-bold'
                      : 'w-20 bg-surface-container-lowest text-on-surface border-surface-container hover:bg-surface-container-low'
                  }`}
                >
                  <span className={`font-label-sm text-xs ${isSelected ? 'text-primary-fixed' : 'text-on-surface-variant'}`}>
                    {day.day}
                  </span>
                  <span className="font-headline-sm text-lg font-bold">{day.dateNum}</span>
                  <span
                    className={`font-label-sm text-[10px] px-2 py-0.5 rounded-full ${
                      isSelected ? 'bg-on-primary/20 text-white font-bold' : 'text-primary'
                    }`}
                  >
                    {day.hour}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Bloque de Horario Activo */}
          <div className="rounded-2xl bg-surface-container p-4 flex items-center justify-between border border-surface-container-high">
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-primary shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="font-label-md text-sm font-bold text-on-surface">
                  {selectedDate} • {selectedHour} – 12:00 PM
                </span>
                <span className="font-body-sm text-xs text-on-surface-variant truncate">
                  Bloque continuo de 90 min sin esperas entre especialistas
                </span>
              </div>
            </div>
            <span className="hidden sm:inline text-xs font-bold text-primary bg-surface-container-lowest px-2.5 py-1 rounded-lg border border-surface-container">
              Programado
            </span>
          </div>
        </section>

        {/* ---------------------------------------------------- */}
        {/* 5. EQUIPO PROFESIONAL MULTIDISCIPLINARIO             */}
        {/* ---------------------------------------------------- */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="font-title-md text-base sm:text-lg font-bold text-on-surface">
              Equipo Asignado a tu Caso
            </h3>
            <span className="font-label-sm text-xs font-bold text-primary bg-surface-container px-2.5 py-0.5 rounded-full">
              Unidad PICS Occidente
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Dra. Andrea Morales */}
            <div className="rounded-2xl bg-surface-container-lowest p-3.5 shadow-xs flex items-center gap-3 border border-surface-container/60">
              <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-surface-container ring-2 ring-teal-500/20">
                <img
                  className="w-full h-full object-cover"
                  alt="Dra. Andrea Morales"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDK5CMAxozSBmVa0k7Fs3Ae7fSLecob_HjlKC0IuOjL1j6dwm4C2awjwIHVul39oKVe31KSmY--M-gELHVwxVhKjSSqLj-nA_ow_BFjqWDdjzcR-MT7Th0KLsYWWSPZBwGtehHdQlaz74_QfCX7_-pi4fROjCzyT1YOIVlj2TyHhyne3Fr1H1CHJ69RQQkIcnSDx3vmbR1AVmpwheYVKkGKYETH-xRZRYJPJAbi7Hi6wYSeGA2qcmOh"
                />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-md text-sm font-bold text-on-surface truncate">
                  Dra. A. Morales
                </span>
                <span className="font-body-sm text-xs text-on-surface-variant truncate">
                  Medicina Intensiva
                </span>
              </div>
            </div>

            {/* Ft. Carlos Vargas */}
            <div className="rounded-2xl bg-surface-container-lowest p-3.5 shadow-xs flex items-center gap-3 border border-surface-container/60">
              <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-surface-container ring-2 ring-teal-500/20">
                <img
                  className="w-full h-full object-cover"
                  alt="Ft. Carlos Vargas"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAC1i7-SqNgvdx7IDJcHwOk5NbNnqw5F9vY6UrK5E6w85_rDpQRzx6TWxa-4-ALPpYjLV2nVvU7GMxt8CGDW3Te6I5f0fdxg5IFcIXFVfYy89JzcL2UW-b_5nFdsoSmFoGenoReLX_lSQtVZ_Ni80DIzEGoMd3rdN-cItid434WlQA35dNmaDVQwj-dEkW2o_c6k3vaLu83dXgWnBcj8X8ae21g4Vu7gk0iyJOVk035mIyF74rjsmkf"
                />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-md text-sm font-bold text-on-surface truncate">
                  Ft. C. Vargas
                </span>
                <span className="font-body-sm text-xs text-on-surface-variant truncate">
                  Rehab Pulmonar
                </span>
              </div>
            </div>

            {/* Psic. Clara Santamaría */}
            <div className="rounded-2xl bg-surface-container-lowest p-3.5 shadow-xs flex items-center gap-3 border border-surface-container/60">
              <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-surface-container ring-2 ring-teal-500/20">
                <img
                  className="w-full h-full object-cover"
                  alt="Psic. Clara Santamaría"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBNV-uZfWjHdNxS7g1ks0LT06ZeexcBTuXFHNsvI2d48O-kBCCJzuSMB-kjs5xjiuckjCaD1yjOqAEGvBsmsU_65PA7H15ihwGFi_OxXIPBnsiMyPX0nq9wbw99gKiUFvjx_wcxFlJ6G8QZWzftokX9V8QYHhMlt2g7sqV3wImot4QspO0iRkzzHfNgEybfNQ-pagQYYFj0D7yp3YNUfvdF6FfRb8jEiQ2d9UDkga9O64WlJfN-ouWV"
                />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-md text-sm font-bold text-on-surface truncate">
                  Psic. C. Santamaría
                </span>
                <span className="font-body-sm text-xs text-on-surface-variant truncate">
                  Psicología Clínica
                </span>
              </div>
            </div>

            {/* Lic. Laura Gómez */}
            <div className="rounded-2xl bg-surface-container-lowest p-3.5 shadow-xs flex items-center gap-3 border border-surface-container/60">
              <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-surface-container ring-2 ring-teal-500/20">
                <img
                  className="w-full h-full object-cover"
                  alt="Lic. Laura Gómez"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWkmo48XpwXKNVYA-vF0ZAKtYYWKijVQ2VtsPrlwxnhFeEPEzkMlu4rvw3U2zp9XlbUtSPpfnTLlDQT2R7HUtCZLpBZCYp8OQVxVfFUZWCHaO1iImNWZkFKs21BSFKsG2MtPVXFZWUymuYjUkIbpfS2VgM3vB25LzfHU8yY1NTtQIV8HBZvN3T9gCukX8lXhZPI9Cy9E-NgY2UjDf0nIFc2egldPOVW1Y68NhIUXflj4YG_jBmk3do"
                />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-md text-sm font-bold text-on-surface truncate">
                  Lic. L. Gómez
                </span>
                <span className="font-body-sm text-xs text-on-surface-variant truncate">
                  Enfermera de Enlace
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------- */}
        {/* 6. CHECKLIST "QUÉ TRAER A TU CITA"                   */}
        {/* ---------------------------------------------------- */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="font-title-md text-base sm:text-lg font-bold text-on-surface">
              Lista de Preparación
            </h3>
            <span className="font-label-sm text-xs text-on-surface-variant">
              Guía para Lucía y Carlos ({checklist.filter(c => c.checked).length}/{checklist.length})
            </span>
          </div>

          <div className="rounded-2xl bg-surface-container-lowest p-4 sm:p-5 shadow-xs flex flex-col gap-3.5 border border-surface-container/60">
            {checklist.map((item, idx) => (
              <React.Fragment key={item.id}>
                {idx > 0 && <div className="w-full h-px bg-surface-container"></div>}
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => toggleChecklistItem(item.id)}
                    className="mt-1 w-5 h-5 rounded text-primary focus:ring-primary accent-primary cursor-pointer"
                  />
                  <div className="flex flex-col min-w-0">
                    <span
                      className={`font-label-md text-sm ${
                        item.checked ? 'text-on-surface font-semibold' : 'text-on-surface-variant'
                      }`}
                    >
                      {item.title}
                    </span>
                    <span className="font-body-sm text-xs text-on-surface-variant mt-0.5">
                      {item.subtitle}
                    </span>
                  </div>
                </label>
              </React.Fragment>
            ))}
          </div>
        </section>

        {/* ---------------------------------------------------- */}
        {/* 7. ACCESIBILIDAD Y TRASLADO ASISTIDO                 */}
        {/* ---------------------------------------------------- */}
        <section className="rounded-2xl bg-surface-container-low p-4 sm:p-5 shadow-xs flex flex-col gap-3 border border-surface-container">
          <div className="flex items-start gap-3">
            <Accessibility className="w-6 h-6 text-secondary shrink-0 mt-0.5" />
            <div className="flex flex-col min-w-0">
              <h4 className="font-title-md text-sm sm:text-base font-bold text-on-surface">
                ¿Necesitas apoyo de movilidad en la entrada?
              </h4>
              <p className="font-body-sm text-xs sm:text-sm text-on-surface-variant mt-1 leading-relaxed">
                Nuestro personal de camillería puede esperarte con silla de ruedas directamente en el parqueadero o la bahía de ambulancias de la Torre Médica.
              </p>
            </div>
          </div>

          <div className="mt-1 flex items-center justify-between bg-surface-container-lowest rounded-xl p-3.5 border border-surface-container/60">
            <span className="font-label-md text-xs sm:text-sm font-semibold text-on-surface">
              Solicitar asistencia de silla de ruedas
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={wheelchairRequested}
              onClick={() => setWheelchairRequested(prev => !prev)}
              className={`w-12 h-7 rounded-full relative transition-colors duration-200 p-0.5 flex items-center ${
                wheelchairRequested ? 'bg-primary' : 'bg-surface-container-highest'
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full bg-surface-container-lowest shadow-md transform transition-transform duration-200 flex items-center justify-center ${
                  wheelchairRequested ? 'translate-x-5' : 'translate-x-0'
                }`}
              >
                {wheelchairRequested && <Check className="w-3.5 h-3.5 text-primary stroke-[3]" />}
              </span>
            </button>
          </div>
        </section>

        {/* ---------------------------------------------------- */}
        {/* 8. ACCIONES Y CONFIRMACIÓN                           */}
        {/* ---------------------------------------------------- */}
        <section className="flex flex-col gap-3 pt-2">
          <button
            type="button"
            onClick={handleConfirmBooking}
            className="w-full h-14 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-md text-sm sm:text-base font-bold shadow-md hover:shadow-lg active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Calendar className="w-5 h-5" />
            <span>Confirmar Agendamiento ({selectedDate} • {selectedHour})</span>
          </button>

          <button
            type="button"
            onClick={() => setShowNurseChat(true)}
            className="w-full h-12 rounded-xl bg-surface-container text-primary font-label-md text-xs sm:text-sm font-semibold hover:bg-surface-container-high transition-colors flex items-center justify-center gap-2 cursor-pointer border border-surface-container-high"
          >
            <PhoneCall className="w-4 h-4 text-primary" />
            <span>Consultar otra fecha con Enfermera Laura por Chat</span>
          </button>

          {/* Micro-recordatorio humanizado */}
          <div className="mt-2 text-center flex flex-col items-center gap-1 text-xs">
            <span className="font-body-sm text-on-surface-variant flex items-center gap-1.5 justify-center">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              Enviaremos confirmación por WhatsApp y SMS a Carlos y Lucía.
            </span>
            <span className="font-label-sm text-[11px] text-outline">
              Recordatorios automáticos: 7 días y 24 horas previas a la cita.
            </span>
          </div>
        </section>
      </main>

      {/* ======================================================== */}
      {/* TOAST DE CONFIRMACIÓN LÚDICO & TERAPÉUTICO               */}
      {/* ======================================================== */}
      {showToast && (
        <aside
          aria-live="polite"
          className="fixed bottom-6 left-4 right-4 max-w-md mx-auto bg-slate-950 text-white p-4 rounded-2xl shadow-2xl z-50 flex items-center gap-3.5 border border-amber-400/40 animate-in fade-in slide-in-from-bottom-5 duration-300"
        >
          <div className="w-11 h-11 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 font-bold shadow-md">
            <CheckCircle2 className="w-6 h-6 text-slate-950" />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-label-md text-sm font-bold text-white">
                ¡Cita Agendada y Sincronizada!
              </span>
              <span className="text-[10px] bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded font-bold">
                +50 XP 🌟
              </span>
            </div>
            <span className="font-body-sm text-xs text-slate-300 truncate">
              {confirmedData?.date} • {confirmedData?.hour} ({confirmedData?.modality === 'presencial' ? 'Presencial Piso 4' : 'Teleconsulta'})
            </span>
            <span className="text-[11px] text-teal-300">
              Registrado en expediente HL7 FHIR • Notificado a Enfermera Laura
            </span>
          </div>
          <button
            onClick={() => setShowToast(false)}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </aside>
      )}

      {/* ======================================================== */}
      {/* MODAL / CHAT SEGURO CON ENFERMERA LAURA                   */}
      {/* ======================================================== */}
      {showNurseChat && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col border border-surface-container max-h-[85vh]">
            {/* Header chat */}
            <div className="bg-primary text-on-primary p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-white/20">
                  <img
                    className="w-full h-full object-cover"
                    alt="Laura Gómez"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWkmo48XpwXKNVYA-vF0ZAKtYYWKijVQ2VtsPrlwxnhFeEPEzkMlu4rvw3U2zp9XlbUtSPpfnTLlDQT2R7HUtCZLpBZCYp8OQVxVfFUZWCHaO1iImNWZkFKs21BSFKsG2MtPVXFZWUymuYjUkIbpfS2VgM3vB25LzfHU8yY1NTtQIV8HBZvN3T9gCukX8lXhZPI9Cy9E-NgY2UjDf0nIFc2egldPOVW1Y68NhIUXflj4YG_jBmk3do"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Lic. Laura Gómez</h4>
                  <p className="text-xs text-primary-fixed">Enfermera de Enlace PICS • En línea</p>
                </div>
              </div>
              <button
                onClick={() => setShowNurseChat(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mensajes */}
            <div className="p-4 flex-1 overflow-y-auto space-y-3 bg-slate-50/60 min-h-[220px]">
              {nurseMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-primary text-on-primary rounded-br-none'
                        : 'bg-white text-on-surface shadow-xs border border-slate-200 rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.time}</span>
                </div>
              ))}
            </div>

            {/* Input */}
            <form onSubmit={handleSendNurseMessage} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
              <input
                type="text"
                placeholder="Escribe tu consulta o cambio de fecha..."
                value={nurseInput}
                onChange={e => setNurseInput(e.target.value)}
                className="flex-1 bg-surface-container-low border border-surface-container rounded-xl px-3.5 py-2 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                className="p-2.5 bg-primary hover:bg-primary-container text-on-primary rounded-xl shadow-xs transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL DE AYUDA Y PREGUNTAS FRECUENTES                    */}
      {/* ======================================================== */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl p-6 space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-base text-slate-900">Guía para el Hito de los 30 Días</h3>
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
              <div className="bg-surface-container-low p-3 rounded-xl">
                <p className="font-bold text-slate-900 text-sm mb-1">¿Por qué es vital esta cita de 90 minutos?</p>
                <p>
                  El día 30 post-alta es el punto de inflexión clínico para prevenir el reingreso hospitalario y evaluar secuelas físicas (debilidad muscular adquirida en UCI), cognitivas y emocionales del paciente y de su cuidador.
                </p>
              </div>

              <div className="bg-surface-container-low p-3 rounded-xl">
                <p className="font-bold text-slate-900 text-sm mb-1">¿Tiene algún costo económico?</p>
                <p>
                  No. Esta valoración multidisciplinaria forma parte integral de la Política de Humanización y el Centro de Excelencia PICS de la Clínica de Occidente S.A.
                </p>
              </div>

              <div className="bg-surface-container-low p-3 rounded-xl">
                <p className="font-bold text-slate-900 text-sm mb-1">¿Dónde queda la Torre Médica?</p>
                <p>
                  Calle 18N # 5N-34, Cali. El consultorio 408 del piso 4 cuenta con ascensor camillero y rampa de acceso directo para sillas de ruedas desde el parqueadero.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full py-2.5 bg-primary hover:bg-primary-container text-on-primary font-bold text-xs rounded-xl transition"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* DRAWER / MODAL: PALETA STITCH & ARQUITECTURA TÉCNICA     */}
      {/* ======================================================== */}
      {showDevTokens && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl p-6 space-y-5 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-secondary" />
                <div>
                  <h3 className="font-bold text-base text-slate-900">Paleta de Colores de Stitch & Código</h3>
                  <p className="text-xs text-slate-500">Tokens Material 3 programados en Tailwind CSS v4</p>
                </div>
              </div>
              <button
                onClick={() => setShowDevTokens(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Muestras de la Paleta */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Muestras de Color Stitch (Tokens)</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                {stitchColors.map(c => (
                  <div
                    key={c.token}
                    className="p-2.5 rounded-xl border border-slate-200 flex flex-col justify-between"
                    style={{ backgroundColor: c.hex, color: c.text }}
                  >
                    <span className="font-mono text-[11px] font-bold">{c.token}</span>
                    <span className="text-[10px] opacity-90">{c.hex}</span>
                    <span className="text-[9px] mt-1 opacity-80">{c.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Explicación de programación */}
            <div className="space-y-2 text-xs text-slate-700">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Cómo Queda Programado</h4>
              <div className="bg-slate-900 text-slate-200 p-4 rounded-xl font-mono text-[11px] space-y-2 overflow-x-auto">
                <p className="text-emerald-400 font-bold">// 1. En src/index.css con Tailwind v4 @theme:</p>
                <p>@theme &#123;</p>
                <p className="pl-4">--color-primary: #005c55;</p>
                <p className="pl-4">--color-primary-container: #0f766e;</p>
                <p className="pl-4">--color-secondary: #855300;</p>
                <p className="pl-4">--color-secondary-fixed: #ffddb8;</p>
                <p className="pl-4">--color-surface: #f8f9ff;</p>
                <p className="pl-4">--color-surface-container: #e5eeff;</p>
                <p className="pl-4">--font-display: 'Plus Jakarta Sans', sans-serif;</p>
                <p className="pl-4">--font-body: 'Inter', sans-serif;</p>
                <p>&#125;</p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] space-y-1">
                <p className="font-bold text-slate-900">2. Recurso HL7 FHIR R4 generado al confirmar:</p>
                <p className="text-slate-600">
                  Crea un objeto estándar <code>Appointment</code> con código <code>SNOMED-CT 394539006</code> (Valoración multidisciplinaria PICS), estado <code>booked</code>, participantes (Paciente, Familiar, Intensivista, Fisioterapeuta) y solicitud de asistencia de movilidad.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowDevTokens(false)}
              className="w-full py-2.5 bg-primary hover:bg-primary-container text-on-primary font-bold text-xs rounded-xl transition"
            >
              Cerrar Inspector
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

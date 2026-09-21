import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PortalGoals } from './PortalGoals';
import { PortalDiary } from './PortalDiary';
import { PortalMedications } from './PortalMedications';
import { PortalMonitoring } from './PortalMonitoring';
import { PortalDischarge } from './PortalDischarge';
import { PortalPassport } from './PortalPassport';
import { PortalSupport } from './PortalSupport';
import {
  Sparkles,
  Target,
  BookOpen,
  Pill,
  Activity,
  CheckSquare,
  Award,
  HelpCircle,
  Sun,
  Flame,
  CheckCircle2,
  Calendar,
  HeartHandshake,
  ShieldCheck,
  Smartphone
} from 'lucide-react';
import { PosUci360Conecta } from '../posuci/PosUci360Conecta';
import { AgendamientoPostUci30Dias } from '../posuci/AgendamientoPostUci30Dias';

export const PortalView: React.FC = () => {
  const { currentCase, gamification, currentUser, easyMode, setMode } = useApp();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'meds' | 'goals' | 'stitch-agenda' | 'diary' | 'vitals' | 'discharge' | 'passport' | 'support' | 'conecta'
  >('overview');

  const [showAdvancedTabs, setShowAdvancedTabs] = useState(false);

  const primaryTabs: { key: typeof activeTab; label: string; icon: React.ReactNode }[] = [
    { key: 'overview', label: '🌟 Mi Día a Día', icon: <Sparkles className="w-4 h-4 text-amber-500" /> },
    { key: 'meds', label: '💊 Medicamentos', icon: <Pill className="w-4 h-4 text-indigo-500" /> },
    { key: 'goals', label: '🎯 Metas y Ejercicios', icon: <Target className="w-4 h-4 text-emerald-500" /> },
    { key: 'stitch-agenda', label: '🗓️ Mi Cita Día 30', icon: <Calendar className="w-4 h-4 text-sky-500" /> },
    { key: 'diary', label: '📖 Diario Familiar', icon: <BookOpen className="w-4 h-4 text-purple-500" /> }
  ];

  const advancedTabs: { key: typeof activeTab; label: string; icon: React.ReactNode }[] = [
    { key: 'vitals', label: 'Signos Vitales', icon: <Activity className="w-4 h-4 text-rose-500" /> },
    { key: 'discharge', label: 'Preparación de Alta', icon: <CheckSquare className="w-4 h-4 text-slate-500" /> },
    { key: 'passport', label: 'Pasaporte Clínico', icon: <Award className="w-4 h-4 text-amber-500" /> },
    { key: 'support', label: 'Guías de Apoyo', icon: <HelpCircle className="w-4 h-4 text-teal-500" /> },
    { key: 'conecta', label: 'Panel Clínico Avanzado', icon: <ShieldCheck className="w-4 h-4 text-slate-400" /> }
  ];

  const firstName = currentUser.role === 'patient'
    ? currentCase.patientName.split(' ')[0]
    : currentUser.name.split(' ')[0];

  return (
    <div className="space-y-6">
      {/* Mobile Experience Quick Switch Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-emerald-900 rounded-2xl p-4 text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md border border-emerald-500/40">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center text-2xl font-bold shadow-md shrink-0">
            📱
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-white">¿Estás navegando desde un celular o prefieres la vista móvil?</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-400 text-slate-950 uppercase hidden sm:inline-block">
                Nueva
              </span>
            </div>
            <p className="text-xs text-teal-200">
              Accede a la experiencia interactiva móvil: Tomy SOS, Metas PICS, Registro de Borg/SpO2 y Agendador Día 30.
            </p>
          </div>
        </div>

        <button
          onClick={() => setMode('movil')}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition flex items-center justify-center gap-2 shrink-0 transform hover:scale-102"
        >
          <Smartphone className="w-4 h-4" />
          <span>Acceder a la Versión Móvil →</span>
        </button>
      </div>

      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-r from-[#1b3a5b] via-[#204975] to-[#2b5d92] rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 relative z-10">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center text-3xl sm:text-4xl shadow-inner shrink-0">
            🦸‍♀️
          </div>
          <div className="space-y-1.5 flex-1">
            <h1 className={`font-bold tracking-tight text-white ${easyMode ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'}`}>
              ¡Hola, {firstName}! 👋
            </h1>
            <p className={`text-sky-100 font-medium ${easyMode ? 'text-base' : 'text-xs sm:text-sm'}`}>
              Cada cosita que registras hoy suma para tu recuperación. ¡Vamos por más! 💪
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-xs">
                Caso {currentCase.caseNumber}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-400 text-slate-900">
                Etapa: {currentCase.clinicalStage === 'seguimiento' ? 'Seguimiento Activo' : currentCase.clinicalStage.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Gamification & XP Bar */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-black text-xl flex items-center justify-center shadow-md shrink-0">
              {gamification.level}
            </div>
            <div>
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Nivel de Recuperación</div>
              <div className="font-bold text-slate-900 text-base">{gamification.levelTitle}</div>
            </div>
          </div>

          <div className="flex-1 max-w-md">
            <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
              <span>Progreso de Nivel</span>
              <span className="text-purple-600 font-bold">{gamification.xpIntoLevel} / {gamification.xpForNextLevel} XP</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-indigo-600 h-full rounded-full transition-all duration-700"
                style={{ width: `${gamification.xpProgressPct}%` }}
              ></div>
            </div>
          </div>

          <div className="flex items-center gap-4 self-end sm:self-center">
            <div className="text-right">
              <div className="text-xl font-black text-slate-900">{gamification.points}</div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Puntos Totales</div>
            </div>

            {gamification.streakDays > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold">
                <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>{gamification.streakDays} días en racha</span>
              </div>
            )}
          </div>
        </div>

        {/* Badges Shelf */}
        <div className="pt-3 border-t border-slate-100">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Insignias Desbloqueadas
          </div>
          <div className="flex flex-wrap gap-2">
            {gamification.badges.map(badge => (
              <span
                key={badge.id}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                  badge.unlocked
                    ? 'bg-purple-50 text-purple-900 border-purple-200 shadow-xs'
                    : 'bg-slate-50 text-slate-400 border-slate-200 opacity-60'
                }`}
                title={badge.unlocked ? '¡Insignia Desbloqueada!' : 'Insignia por desbloquear'}
              >
                <span>{badge.icon}</span>
                <span>{badge.label}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Daily Tip */}
      <div className="bg-gradient-to-r from-amber-50 via-amber-50/60 to-orange-50 p-4 sm:p-5 rounded-2xl border border-amber-200 flex items-start gap-3 shadow-xs">
        <span className="text-2xl shrink-0">✨</span>
        <div className="space-y-0.5">
          <div className="text-xs font-bold text-amber-900 uppercase tracking-wide">Consejo del Día</div>
          <p className="text-xs sm:text-sm text-amber-950 font-medium leading-relaxed">
            Hacer pausas activas al caminar y respirar lento por la nariz ayuda a que los pulmones se expandan mejor y disminuye la fatiga muscular. ¡Celebra cada metro que caminas hoy!
          </p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {primaryTabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                activeTab === tab.key
                  ? 'bg-teal-700 text-white shadow-md'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-teal-50/50 hover:border-teal-200'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowAdvancedTabs(prev => !prev)}
          className="text-xs font-semibold px-3 py-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition shrink-0"
        >
          {showAdvancedTabs ? '▲ Menos Opciones' : '▼ Más Opciones Clínicas'}
        </button>
      </div>

      {/* Secondary/Advanced Tabs for Detailed Medical History */}
      {showAdvancedTabs && (
        <div className="flex items-center gap-1.5 overflow-x-auto p-2 bg-slate-100/70 rounded-2xl border border-slate-200 animate-in fade-in duration-150">
          <span className="text-[11px] font-bold text-slate-500 uppercase px-2">Detalles:</span>
          {advancedTabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                activeTab === tab.key
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Active Tab View */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Daily Ritual */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className={`font-bold text-slate-900 ${easyMode ? 'text-xl' : 'text-base'}`}>
                ☀️ Tu Ritual Diario
              </h3>
              <span className="text-xs text-slate-500">A tu propio ritmo</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Morning */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                  <span className="text-lg">🌅</span>
                  <span>Mañana</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div
                    onClick={() => setActiveTab('meds')}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-sky-50 border border-slate-100 flex items-center gap-2 cursor-pointer transition"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Tomar Losartán 50mg con el desayuno</span>
                  </div>
                  <div
                    onClick={() => setActiveTab('vitals')}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-sky-50 border border-slate-100 flex items-center gap-2 cursor-pointer transition"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Tomar y registrar presión arterial</span>
                  </div>
                </div>
              </div>

              {/* Afternoon */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                  <span className="text-lg">☀️</span>
                  <span>Tarde</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div
                    onClick={() => setActiveTab('goals')}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-sky-50 border border-slate-100 flex items-center gap-2 cursor-pointer transition"
                  >
                    <Target className="w-4 h-4 text-sky-500 shrink-0" />
                    <span>Caminata guiada de 15 a 20 metros</span>
                  </div>
                  <div
                    onClick={() => setActiveTab('support')}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-sky-50 border border-slate-100 flex items-center gap-2 cursor-pointer transition"
                  >
                    <BookOpen className="w-4 h-4 text-purple-500 shrink-0" />
                    <span>Ejercicios respiratorios diafragmáticos</span>
                  </div>
                </div>
              </div>

              {/* Night */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                  <span className="text-lg">🌙</span>
                  <span>Noche</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div
                    onClick={() => setActiveTab('meds')}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-sky-50 border border-slate-100 flex items-center gap-2 cursor-pointer transition"
                  >
                    <Pill className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Atorvastatina 20mg a las 8:00 PM</span>
                  </div>
                  <div
                    onClick={() => setActiveTab('diary')}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-sky-50 border border-slate-100 flex items-center gap-2 cursor-pointer transition"
                  >
                    <BookOpen className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Escribir una breve nota en tu diario</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Mission Grid */}
          <div>
            <h3 className={`font-bold text-slate-900 mb-3 ${easyMode ? 'text-xl' : 'text-base'}`}>
              🗺️ Módulos de Recuperación
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
                onClick={() => setActiveTab('goals')}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-md transition cursor-pointer space-y-2 group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition">
                  <Target className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-base">Metas de Recuperación</h4>
                <p className="text-xs text-slate-500">
                  Caminar, ejercicios cognitivos, nutrición proteica y descanso reparador.
                </p>
              </div>

              <div
                onClick={() => setActiveTab('diary')}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-sky-400 hover:shadow-md transition cursor-pointer space-y-2 group"
              >
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-110 transition">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-base">Diario de Cuidados</h4>
                <p className="text-xs text-slate-500">
                  Anota cómo te sientes y lee las observaciones de tus terapeutas.
                </p>
              </div>

              <div
                onClick={() => setActiveTab('meds')}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-purple-400 hover:shadow-md transition cursor-pointer space-y-2 group"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition">
                  <Pill className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-base">Medicamentos al Día</h4>
                <p className="text-xs text-slate-500">
                  Horarios y dosis exactas conciliadas para tomar seguro en casa.
                </p>
              </div>

              <div
                onClick={() => setActiveTab('vitals')}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-rose-400 hover:shadow-md transition cursor-pointer space-y-2 group"
              >
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition">
                  <Activity className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-base">Signos Vitales</h4>
                <p className="text-xs text-slate-500">
                  Registro diario de presión, pulso, saturación de oxígeno y dolor.
                </p>
              </div>

              <div
                onClick={() => setActiveTab('passport')}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-md transition cursor-pointer space-y-2 group"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition">
                  <Calendar className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-base">Pasaporte & Citas</h4>
                <p className="text-xs text-slate-500">
                  Controles médicos programados con medicina crítica y fisiatría.
                </p>
              </div>

              <div
                onClick={() => setActiveTab('support')}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-md transition cursor-pointer space-y-2 group"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-base">Línea de Apoyo & Guías</h4>
                <p className="text-xs text-slate-500">
                  Preguntas al equipo clínico y biblioteca de ejercicios en casa.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'conecta' && <PosUci360Conecta />}
      {activeTab === 'stitch-agenda' && <AgendamientoPostUci30Dias onBack={() => setActiveTab('passport')} />}
      {activeTab === 'goals' && <PortalGoals />}
      {activeTab === 'diary' && <PortalDiary />}
      {activeTab === 'meds' && <PortalMedications />}
      {activeTab === 'vitals' && <PortalMonitoring />}
      {activeTab === 'discharge' && <PortalDischarge />}
      {activeTab === 'passport' && <PortalPassport />}
      {activeTab === 'support' && <PortalSupport />}
    </div>
  );
};

import React from 'react';
import { useApp } from '../../context/AppContext';
import { initialCenters } from '../../data/initialData';
import { AppMode } from '../../types';
import {
  Activity,
  FlaskConical,
  Zap,
  HeartPulse,
  ShieldAlert,
  ClipboardCheck,
  ArrowRight,
  Sparkles,
  Users,
  Award,
  CheckCircle2,
  Smartphone
} from 'lucide-react';

export const HubView: React.FC = () => {
  const { setMode, picsCases } = useApp();

  const getIcon = (code: string) => {
    switch (code) {
      case 'PICS':
        return <Activity className="w-6 h-6" />;
      case 'SEPSIS':
        return <FlaskConical className="w-6 h-6" />;
      case 'ACV':
        return <Zap className="w-6 h-6" />;
      case 'INFARTO':
        return <HeartPulse className="w-6 h-6" />;
      case 'ICULIB':
        return <ShieldAlert className="w-6 h-6" />;
      default:
        return <ClipboardCheck className="w-6 h-6" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Banner introduction */}
      <div className="bg-gradient-to-r from-[#0d2340] via-[#123055] to-[#1a4270] rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-200 text-xs font-semibold mb-3 border border-sky-400/20">
            <Award className="w-3.5 h-3.5" />
            <span>Acreditación Institucional y Centros de Excelencia</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            Centros de Excelencia Clínica
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            Plataforma centralizada de trazabilidad asistencial, auditoría continua y seguimiento interdisciplinario de la Clínica de Occidente.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setMode('movil')}
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5"
            >
              <Smartphone className="w-4 h-4 text-slate-950" />
              <span>Abrir Versión Móvil POSUCI 360</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMode('portal')}
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg transition"
            >
              <Sparkles className="w-4 h-4 text-emerald-100" />
              <span>Portal Web PosUCI</span>
            </button>
            <button
              onClick={() => setMode('pics')}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-white/20 transition"
            >
              <Users className="w-4 h-4 text-sky-300" />
              <span>Gestión de Casos PICS Staff</span>
            </button>
          </div>
        </div>
      </div>

      {/* Centers Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Programas Institucionales</h2>
            <p className="text-xs text-slate-500">
              Seleccione el Centro de Excelencia que desea auditar o revisar en detalle.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {initialCenters.map((center) => {
            const isAvailable = center.available;
            return (
              <div
                key={center.code}
                onClick={() => {
                  if (isAvailable && center.modeKey !== 'hub') {
                    setMode(center.modeKey);
                  }
                }}
                className={`group relative flex flex-col justify-between rounded-2xl p-6 transition border ${
                  isAvailable
                    ? 'border-slate-200 bg-white hover:border-sky-400 hover:shadow-xl cursor-pointer hover:-translate-y-1'
                    : 'border-dashed border-slate-200 bg-slate-50/70 opacity-75'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`p-3 rounded-xl ${
                        isAvailable
                          ? 'bg-sky-50 text-sky-600 group-hover:bg-sky-500 group-hover:text-white transition'
                          : 'bg-slate-200 text-slate-400'
                      }`}
                    >
                      {getIcon(center.code)}
                    </div>
                    {isAvailable ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Activo
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide bg-slate-200 text-slate-600">
                        Próximamente
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-sky-700 transition">
                    {center.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 min-h-[32px]">
                    {center.subtitle}
                  </p>

                  {isAvailable && (
                    <div className="mt-5 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4 text-center">
                      <div>
                        <div className="text-xl font-black text-slate-800">
                          {center.code === 'PICS' ? picsCases.length : center.stats.total}
                        </div>
                        <div className="text-[10px] font-semibold text-slate-400 uppercase">
                          Total
                        </div>
                      </div>
                      <div>
                        <div className="text-xl font-black text-slate-800">
                          {center.stats.hospitalized}
                        </div>
                        <div className="text-[10px] font-semibold text-slate-400 uppercase">
                          Activos
                        </div>
                      </div>
                      <div>
                        <div className="text-xl font-black text-slate-800">
                          {center.stats.currentMonth}
                        </div>
                        <div className="text-[10px] font-semibold text-slate-400 uppercase">
                          Este Mes
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {isAvailable && (
                  <div className="mt-5 flex items-center justify-between text-xs font-bold text-sky-600 group-hover:text-sky-800 transition pt-2">
                    <span>Entrar al panel</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Highlights and Quality Standards */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>Metas Asistenciales Clave de los Centros de Excelencia</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="font-semibold text-slate-700">ACV: Puerta - Aguja</div>
            <div className="text-lg font-black text-emerald-600 mt-1">&lt; 45 / 60 min</div>
            <p className="text-[11px] text-slate-500 mt-1">Meta institucional &gt; 85% de adherencia en ventana terapéutica.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="font-semibold text-slate-700">Sepsis: Hora Dorada</div>
            <div className="text-lg font-black text-sky-600 mt-1">Bundle 1h y 3h</div>
            <p className="text-[11px] text-slate-500 mt-1">Cultivos precoces, antibiótico de amplio espectro y lactato sérico.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="font-semibold text-slate-700">Infarto: Puerta - Balón</div>
            <div className="text-lg font-black text-indigo-600 mt-1">&lt; 90 min</div>
            <p className="text-[11px] text-slate-500 mt-1">Reperfusión por angioplastia primaria (PCI) en STEMI.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="font-semibold text-slate-700">PICS: Seguimiento 30d</div>
            <div className="text-lg font-black text-purple-600 mt-1">&gt; 80% Cobertura</div>
            <p className="text-[11px] text-slate-500 mt-1">Evaluación física, cognitiva, nutricional y apoyo al cuidador.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

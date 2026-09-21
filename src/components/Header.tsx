import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AppMode } from '../types';
import {
  LayoutDashboard,
  HeartPulse,
  FlaskConical,
  Zap,
  Activity,
  ShieldAlert,
  User,
  Sparkles,
  RefreshCw,
  Eye,
  Sliders,
  FileCode2,
  Stethoscope,
  ShieldCheck,
  Smartphone,
  Menu,
  X
} from 'lucide-react';
import { PWAInstallButton } from './pwa/PWAInstallButton';

export const Header: React.FC = () => {
  const {
    mode,
    setMode,
    currentUser,
    setCurrentUser,
    users,
    easyMode,
    toggleEasyMode,
    resetToInitialData
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: { key: AppMode; label: string; icon: React.ReactNode; badge?: string; highlight?: boolean }[] = [
    {
      key: 'movil',
      label: 'App Móvil',
      icon: <Smartphone className="w-4 h-4 text-emerald-400" />,
      badge: 'Móvil',
      highlight: true
    },
    { key: 'hub', label: 'Inicio Centros', icon: <LayoutDashboard className="w-4 h-4" /> },
    { key: 'pics', label: 'PICS Staff', icon: <Activity className="w-4 h-4" /> },
    { key: 'sepsis', label: 'Sepsis', icon: <FlaskConical className="w-4 h-4" /> },
    { key: 'acv', label: 'ACV', icon: <Zap className="w-4 h-4" /> },
    { key: 'infarto', label: 'Infarto', icon: <HeartPulse className="w-4 h-4" /> },
    { key: 'icu-liberation', label: 'ICU Liberation', icon: <ShieldAlert className="w-4 h-4" /> },
    {
      key: 'portal',
      label: 'Portal PosUCI',
      icon: <Sparkles className="w-4 h-4 text-emerald-400" />,
      badge: 'Paciente/Familia'
    },
    {
      key: 'dra-morales',
      label: 'Panel Dra. Morales',
      icon: <Stethoscope className="w-4 h-4 text-sky-400" />,
      badge: 'Validación Ley 527'
    },
    {
      key: 'fhir-traceability',
      label: 'Trazabilidad FHIR R4',
      icon: <FileCode2 className="w-4 h-4 text-indigo-400" />
    }
  ];

  return (
    <header className="bg-[#0b1b2f] text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
      {/* Top institution bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold tracking-wide text-slate-200">
            CLÍNICA DE OCCIDENTE
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400 hidden sm:inline">
            ÁGORA: Analítica y Gestión Operacional para Resultados Asistenciales
          </span>
          <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
            <ShieldCheck className="w-3 h-3" /> HL7-FHIR R4 Activo
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* PWA Direct Mobile Install Button */}
          <PWAInstallButton variant="header" />

          {/* Direct App Móvil Quick Access Button */}
          <button
            onClick={() => setMode('movil')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition shadow-sm shrink-0 ${
              mode === 'movil'
                ? 'bg-emerald-400 text-slate-950 ring-2 ring-emerald-300'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white animate-pulse'
            }`}
            title="Abrir App Móvil POSUCI 360 (Tomy, Metas, Medicamentos)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>📱 Versión Móvil</span>
          </button>

          {mode === 'portal' && (
            <button
              onClick={toggleEasyMode}
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition ${
                easyMode
                  ? 'bg-amber-400 text-slate-900 shadow-sm'
                  : 'bg-white/10 text-slate-300 hover:bg-white/20'
              }`}
              title="Modo Fácil con tipografía ampliada y alto contraste"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Modo Fácil: {easyMode ? 'ON' : 'OFF'}</span>
            </button>
          )}

          {/* User selector */}
          <div className="flex items-center gap-1.5 bg-slate-800/80 px-2 py-1 rounded-lg border border-slate-700">
            <User className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-slate-400 hidden sm:inline">Rol:</span>
            <select
              value={currentUser.id}
              onChange={(e) => {
                const selected = users.find(u => u.id === e.target.value);
                if (selected) {
                  setCurrentUser(selected);
                  if (selected.id === 'usr-morales') {
                    setMode('dra-morales');
                  } else if (selected.role === 'patient' || selected.role === 'caregiver') {
                    setMode('movil');
                  }
                }
              }}
              className="bg-transparent text-white font-medium text-xs focus:outline-none cursor-pointer max-w-[130px] sm:max-w-none truncate"
            >
              {users.map(u => (
                <option key={u.id} value={u.id} className="bg-slate-900 text-white">
                  {u.name} ({u.role === 'intensivist' ? 'Intensivista' : u.role === 'patient' ? 'Paciente' : 'Cuidador'})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={resetToInitialData}
            title="Reiniciar datos demostrativos"
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main navigation menu */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <div
              onClick={() => {
                setMode('hub');
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center font-black text-white text-base shadow-sm group-hover:scale-105 transition">
                Á
              </div>
              <div>
                <div className="font-bold text-base tracking-tight leading-none text-white">
                  ÁGORA
                </div>
                <div className="text-[10px] text-sky-300 font-medium tracking-wide">
                  CENTROS DE EXCELENCIA
                </div>
              </div>
            </div>
          </div>

          {/* Desktop & Tablet nav */}
          <nav className="hidden md:flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
            {navItems.map((item) => {
              const isActive = mode === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setMode(item.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition relative ${
                    isActive
                      ? 'bg-sky-500 text-white shadow-sm'
                      : item.highlight
                      ? 'bg-emerald-900 text-emerald-200 border border-emerald-500/50 hover:bg-emerald-800'
                      : item.key === 'portal'
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-900/60'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="hidden lg:inline-block ml-1 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-emerald-400 text-slate-950 uppercase">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMode('movil')}
              className={`p-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 ${
                mode === 'movil'
                  ? 'bg-emerald-400 text-slate-950 border-emerald-300'
                  : 'bg-emerald-900/80 text-emerald-200 border-emerald-500/40'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Móvil</span>
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(prev => !prev)}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition"
              aria-label="Abrir menú de navegación móvil"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6 text-amber-400" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown / Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-950/98 border-t border-slate-800 p-4 space-y-3 animate-in fade-in slide-in-from-top-3 duration-200 shadow-2xl">
          <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-900 to-teal-800 border border-emerald-400/40 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-lg">
                📱
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">App Móvil POSUCI 360</h4>
                <p className="text-[11px] text-emerald-200">Experiencia completa para smartphone</p>
              </div>
            </div>
            <button
              onClick={() => {
                setMode('movil');
                setIsMobileMenuOpen(false);
              }}
              className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-sm"
            >
              Abrir
            </button>
          </div>

          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
            Secciones y Centros de Excelencia
          </div>

          <div className="grid grid-cols-1 gap-1.5">
            {navItems.map((item) => {
              const isActive = mode === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => {
                    setMode(item.key);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-sky-500 text-white font-bold'
                      : item.highlight
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Modo Accesible:</span>
            <button
              onClick={toggleEasyMode}
              className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                easyMode ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-300'
              }`}
            >
              {easyMode ? 'Modo Fácil Activado' : 'Activar Modo Fácil'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

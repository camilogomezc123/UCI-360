import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ClinicalStage, PicsCase } from '../../types';
import {
  Activity,
  User,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  Search,
  Filter,
  ArrowRight,
  ShieldCheck,
  FileText,
  Heart,
  ChevronRight
} from 'lucide-react';

export const PicsView: React.FC = () => {
  const { picsCases, selectedCaseId, setSelectedCaseId, updateCaseStage, setMode } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [activeModalCase, setActiveModalCase] = useState<PicsCase | null>(null);

  const filteredCases = picsCases.filter(c => {
    const matchesSearch =
      c.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.patientIdDoc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = stageFilter === 'all' || c.clinicalStage === stageFilter;
    return matchesSearch && matchesStage;
  });

  const activeCount = picsCases.filter(c => c.status === 'active').length;
  const highRiskCount = picsCases.filter(c => c.riskScore === 'alto').length;
  const avgBarthel = Math.round(
    picsCases.reduce((acc, c) => acc + c.barthelAtDischarge, 0) / (picsCases.length || 1)
  );

  const getStageBadge = (stage: ClinicalStage) => {
    switch (stage) {
      case 'hospitalizacion':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">Hospitalización</span>;
      case 'egreso_uci':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">Egreso UCI</span>;
      case 'seguimiento':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">Seguimiento Activo</span>;
      case 'finalizado':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Finalizado</span>;
    }
  };

  const getRiskBadge = (risk: 'alto' | 'moderado' | 'estandar') => {
    switch (risk) {
      case 'alto':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800">Riesgo Alto</span>;
      case 'moderado':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800">Riesgo Moderado</span>;
      case 'estandar':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700">Riesgo Estándar</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-sky-600 font-semibold text-xs tracking-wider uppercase mb-1">
            <Activity className="w-4 h-4" />
            <span>Centro de Excelencia PICS</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Programa de Seguimiento del Síndrome Post Cuidado Intensivo
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Gestión clínica interdisciplinaria, estratificación de riesgo ABCDEF y enlace asistencial con el portal PosUCI.
          </p>
        </div>

        <button
          onClick={() => setMode('portal')}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow transition self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4" />
          <span>Ver como Paciente (PosUCI)</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-xs font-medium">Total Casos Registrados</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{picsCases.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">Casos longitudinales</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-xs font-medium">En Seguimiento Activo</div>
          <div className="text-2xl font-bold text-purple-600 mt-1">{activeCount}</div>
          <div className="text-[11px] text-purple-600/80 mt-1">Con metas de recuperación</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-xs font-medium">Riesgo Alto PICS</div>
          <div className="text-2xl font-bold text-rose-600 mt-1">{highRiskCount}</div>
          <div className="text-[11px] text-rose-600/80 mt-1">VM &gt;48h o shock previo</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-xs font-medium">Barthel Promedio al Alta</div>
          <div className="text-2xl font-bold text-sky-600 mt-1">{avgBarthel} / 100</div>
          <div className="text-[11px] text-sky-600/80 mt-1">Dependencia leve a moderada</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nombre, código de caso o identificación..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={stageFilter}
            onChange={e => setStageFilter(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="all">Todas las etapas</option>
            <option value="hospitalizacion">Hospitalización</option>
            <option value="egreso_uci">Egreso UCI</option>
            <option value="seguimiento">Seguimiento activo</option>
            <option value="finalizado">Finalizado</option>
          </select>
        </div>
      </div>

      {/* Cases List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 font-bold text-slate-800 text-sm flex items-center justify-between">
          <span>Casos Clínicos PICS ({filteredCases.length})</span>
          <span className="text-xs font-normal text-slate-500">Seleccione un paciente para auditar</span>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredCases.map(c => (
            <div
              key={c.id}
              className={`p-5 transition hover:bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                selectedCaseId === c.id ? 'bg-sky-50/50 border-l-4 border-sky-500' : ''
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">{c.patientName}</span>
                  <span className="text-xs text-slate-400">({c.patientAge} años, {c.patientSex === 'F' ? 'Fem' : 'Masc'})</span>
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {c.caseNumber}
                  </span>
                  {getRiskBadge(c.riskScore)}
                  {getStageBadge(c.clinicalStage)}
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 pt-1">
                  <span><strong>Id:</strong> {c.patientIdDoc}</span>
                  <span><strong>Ventilación:</strong> {c.mechanicalVentilationDays} días</span>
                  <span><strong>Delirium:</strong> {c.deliriumDays} días</span>
                  <span><strong>Estancia UCI:</strong> {c.icuLosDays} días</span>
                  <span><strong>Barthel al alta:</strong> {c.barthelAtDischarge}/100</span>
                  <span><strong>MRC:</strong> {c.mrcTotal}/60</span>
                </div>

                {c.notes && (
                  <p className="text-xs text-slate-600 italic line-clamp-1 pt-0.5">
                    "{c.notes}"
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 self-end md:self-center">
                <button
                  onClick={() => {
                    setSelectedCaseId(c.id);
                    setActiveModalCase(c);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                >
                  Expediente Clínico
                </button>
                <button
                  onClick={() => {
                    setSelectedCaseId(c.id);
                    setMode('portal');
                  }}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition flex items-center gap-1"
                >
                  <span>Abrir PosUCI</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Case Details Modal */}
      {activeModalCase && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="text-xs font-bold text-sky-600 uppercase">Expediente Clínico PICS</div>
                <h2 className="text-xl font-bold text-slate-900 mt-0.5">{activeModalCase.patientName}</h2>
                <div className="text-xs text-slate-500 mt-0.5">
                  Caso {activeModalCase.caseNumber} • ID: {activeModalCase.patientIdDoc}
                </div>
              </div>
              <button
                onClick={() => setActiveModalCase(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-5 py-4 text-xs text-slate-700">
              {/* Stage selector */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <label className="font-bold text-slate-800 block mb-1.5">
                  Etapa Clínica del Protocolo:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['hospitalizacion', 'egreso_uci', 'seguimiento', 'finalizado'] as ClinicalStage[]).map(st => (
                    <button
                      key={st}
                      onClick={() => {
                        updateCaseStage(activeModalCase.id, st);
                        setActiveModalCase({ ...activeModalCase, clinicalStage: st });
                      }}
                      className={`py-1.5 px-2 rounded-lg font-semibold text-center transition ${
                        activeModalCase.clinicalStage === st
                          ? 'bg-sky-600 text-white shadow-sm'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {st === 'hospitalizacion' ? 'Hospitalización' : st === 'egreso_uci' ? 'Egreso UCI' : st === 'seguimiento' ? 'Seguimiento' : 'Finalizado'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clinical Metrics */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="text-slate-500 text-[11px]">Días en Ventilación</div>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">{activeModalCase.mechanicalVentilationDays} d</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="text-slate-500 text-[11px]">Días de Delirium</div>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">{activeModalCase.deliriumDays} d</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="text-slate-500 text-[11px]">Estancia UCI Total</div>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">{activeModalCase.icuLosDays} d</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="text-slate-500 text-[11px]">Índice de Barthel al Egreso</div>
                  <div className="text-base font-bold text-slate-900 mt-0.5">{activeModalCase.barthelAtDischarge} / 100</div>
                  <div className="text-[10px] text-slate-400">Escala de independencia funcional</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="text-slate-500 text-[11px]">Fuerza Muscular MRC Total</div>
                  <div className="text-base font-bold text-slate-900 mt-0.5">{activeModalCase.mrcTotal} / 60</div>
                  <div className="text-[10px] text-slate-400">&lt; 48 sugiere DAUCI (debilidad adquirida)</div>
                </div>
              </div>

              {/* Caregivers */}
              <div>
                <h4 className="font-bold text-slate-800 mb-2">Cuidadores Autorizados (Red de Apoyo)</h4>
                {activeModalCase.caregivers.length > 0 ? (
                  <div className="space-y-2">
                    {activeModalCase.caregivers.map(cg => (
                      <div key={cg.id} className="p-3 rounded-lg border border-slate-200 bg-white flex justify-between items-center">
                        <div>
                          <div className="font-semibold text-slate-800">{cg.name} ({cg.relationship})</div>
                          <div className="text-slate-400 text-[11px]">{cg.email} • Tel: {cg.phone}</div>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                          Autorizado Portal
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-slate-50 text-slate-500 text-xs italic">
                    No hay cuidadores registrados todavía para este caso.
                  </div>
                )}
              </div>

              {/* Auditor */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-sky-50/50 border border-sky-100">
                <div>
                  <span className="text-slate-500 text-[11px] block">Auditor Clínico Asignado:</span>
                  <span className="font-bold text-slate-800">{activeModalCase.assignedAuditor}</span>
                </div>
                <span className="text-[11px] font-semibold text-sky-700 bg-sky-100/70 px-2.5 py-1 rounded-full">
                  Auditoría Vigente
                </span>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 flex justify-end gap-2">
              <button
                onClick={() => setActiveModalCase(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  setSelectedCaseId(activeModalCase.id);
                  setActiveModalCase(null);
                  setMode('portal');
                }}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 shadow transition flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>Abrir Portal PosUCI de este Paciente</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

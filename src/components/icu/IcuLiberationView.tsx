import React from 'react';
import { initialIcuBeds } from '../../data/initialData';
import { ShieldAlert, CheckCircle2, XCircle, AlertCircle, Users, Activity } from 'lucide-react';

export const IcuLiberationView: React.FC = () => {
  const avgBundle = Math.round(
    initialIcuBeds.reduce((acc, b) => acc + b.bundleCompliancePct, 0) / initialIcuBeds.length
  );
  const ventCount = initialIcuBeds.filter(b => b.ventilated).length;
  const deliriumCount = initialIcuBeds.filter(b => b.camIcuDelirium === 'positivo').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-sky-600 font-semibold text-xs tracking-wider uppercase mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>Centro de Excelencia en Recuperación del Paciente Crítico</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Programa ICU Liberation (Bundle ABCDEF)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manejo del dolor, pruebas de despertar espontáneo (SAT/SBT), metas RASS, tamizaje CAM-ICU y movilización temprana.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-50 text-purple-800 border border-purple-200 text-xs font-semibold">
          <Activity className="w-4 h-4 text-purple-600" />
          <span>Meta ABCDEF Institucional: &gt;90%</span>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-xs font-medium">Adherencia Bundle Global</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">{avgBundle}%</div>
          <div className="text-[11px] text-emerald-700/80 mt-1">Censo activo evaluado</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-xs font-medium">Pacientes en Ventilación</div>
          <div className="text-2xl font-bold text-sky-600 mt-1">{ventCount}</div>
          <div className="text-[11px] text-sky-700/80 mt-1">Con protocolo diario SAT/SBT</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-xs font-medium">Delirium Activo (CAM-ICU+)</div>
          <div className="text-2xl font-bold text-amber-600 mt-1">{deliriumCount}</div>
          <div className="text-[11px] text-amber-700/80 mt-1">Con medidas no farmacológicas</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-xs font-medium">Restricción Física Mecánica</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">0%</div>
          <div className="text-[11px] text-slate-400 mt-1">Cero sujeción mediante bundle</div>
        </div>
      </div>

      {/* Bundle Explanation Card */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
        <div className="text-xs font-bold text-slate-700 mb-2">Componentes del Paquete ABCDEF:</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-[11px]">
          <div className="bg-white p-2 rounded border border-slate-200">
            <span className="font-bold text-sky-600">A</span>: Manejo del Dolor (CPOT)
          </div>
          <div className="bg-white p-2 rounded border border-slate-200">
            <span className="font-bold text-sky-600">B</span>: Pruebas SAT y SBT
          </div>
          <div className="bg-white p-2 rounded border border-slate-200">
            <span className="font-bold text-sky-600">C</span>: Sedación Liviana (RASS)
          </div>
          <div className="bg-white p-2 rounded border border-slate-200">
            <span className="font-bold text-sky-600">D</span>: Tamizaje Delirium (CAM-ICU)
          </div>
          <div className="bg-white p-2 rounded border border-slate-200">
            <span className="font-bold text-sky-600">E</span>: Movilización Temprana
          </div>
          <div className="bg-white p-2 rounded border border-slate-200">
            <span className="font-bold text-sky-600">F</span>: Participación Familiar
          </div>
        </div>
      </div>

      {/* Bed-by-bed census */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 font-bold text-slate-800 text-sm flex items-center justify-between">
          <span>Censo Activo de Camas UCI y Cumplimiento de Bundle</span>
          <span className="text-xs text-slate-500 font-normal">Actualización de ronda clínica</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          {initialIcuBeds.map(bed => (
            <div
              key={bed.bedNumber}
              className="p-4 rounded-xl border border-slate-200 bg-white hover:border-sky-300 transition space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-slate-900 text-white font-mono font-bold text-xs">
                    {bed.bedNumber}
                  </span>
                  <span className="text-xs text-slate-500">{bed.unit}</span>
                </div>
                <div className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {bed.bundleCompliancePct}% Bundle
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm">{bed.patientName}</h4>
                <div className="text-xs text-slate-500">
                  {bed.ventilated ? `En ventilación mecánica (${bed.ventDays} días)` : 'Sin ventilación invasiva'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded bg-slate-50 border border-slate-100">
                  <div className="text-slate-400 text-[10px]">RASS (Meta vs Real)</div>
                  <div className="font-semibold text-slate-800">
                    Meta: {bed.targetRass} • Real: <span className={bed.actualRass === bed.targetRass ? 'text-emerald-600' : 'text-amber-600 font-bold'}>{bed.actualRass}</span>
                  </div>
                </div>

                <div className="p-2 rounded bg-slate-50 border border-slate-100">
                  <div className="text-slate-400 text-[10px]">CAM-ICU Delirium</div>
                  <div className={`font-semibold ${
                    bed.camIcuDelirium === 'negativo' ? 'text-emerald-600' : bed.camIcuDelirium === 'positivo' ? 'text-rose-600' : 'text-slate-600'
                  }`}>
                    {bed.camIcuDelirium.toUpperCase()}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-[11px] pt-1">
                <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-700 font-medium">
                  SAT/SBT: {bed.satTrial}
                </span>
                <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-medium">
                  Movilidad: {bed.earlyMobility}
                </span>
                {bed.familyEngaged && (
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-medium flex items-center gap-1">
                    <Users className="w-3 h-3" /> Familia presente
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

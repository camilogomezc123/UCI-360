import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { HubView } from './components/hub/HubView';
import { PicsView } from './components/pics/PicsView';
import { SepsisView } from './components/sepsis/SepsisView';
import { AcvView } from './components/acv/AcvView';
import { InfartoView } from './components/infarto/InfartoView';
import { IcuLiberationView } from './components/icu/IcuLiberationView';
import { PortalView } from './components/portal/PortalView';
import { DraMoralesPanel } from './components/clinical/DraMoralesPanel';
import { FhirTraceabilityView } from './components/interop/FhirTraceabilityView';
import { MobileAppView } from './components/posuci/MobileAppView';

const MainContent: React.FC = () => {
  const { mode } = useApp();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {mode === 'hub' && <HubView />}
      {mode === 'pics' && <PicsView />}
      {mode === 'sepsis' && <SepsisView />}
      {mode === 'acv' && <AcvView />}
      {mode === 'infarto' && <InfartoView />}
      {mode === 'icu-liberation' && <IcuLiberationView />}
      {mode === 'portal' && <PortalView />}
      {mode === 'dra-morales' && <DraMoralesPanel />}
      {mode === 'fhir-traceability' && <FhirTraceabilityView />}
      {mode === 'movil' && <MobileAppView />}
    </main>
  );
};

export function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-between selection:bg-sky-500 selection:text-white">
        <div>
          <Header />
          <MainContent />
        </div>

        <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 space-y-1">
            <div className="font-semibold text-slate-700">
              ÁGORA & PosUCI • Clínica de Occidente S.A.
            </div>
            <div>
              Centros de Excelencia en Atención Médica Especializada • Protocolos ACC/AHA, SCCM y Guías Nacionales de Calidad.
            </div>
            <div className="text-[11px] text-slate-400">
              Ambiente de Demostración y Auditoría Clínica Asistencial • Todos los derechos reservados.
            </div>
          </div>
        </footer>
      </div>
    </AppProvider>
  );
}

export default App;

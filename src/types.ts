export type AppMode = 'hub' | 'pics' | 'sepsis' | 'acv' | 'infarto' | 'icu-liberation' | 'portal' | 'dra-morales' | 'fhir-traceability' | 'movil';

export type UserRoleType = 'admin' | 'clinical_leader' | 'intensivist' | 'auditor' | 'patient' | 'caregiver';

export interface CurrentUser {
  id: string;
  name: string;
  role: UserRoleType;
  title: string;
  email: string;
  avatarText: string;
  isDoctor?: boolean;
}

export type ClinicalStage = 'hospitalizacion' | 'egreso_uci' | 'seguimiento' | 'finalizado';

export interface Patient {
  id: string;
  identification: string;
  fullName: string;
  sex: 'M' | 'F';
  age: number;
  email: string;
  phone?: string;
  portalUsername: string;
}

export interface Caregiver {
  id: string;
  name: string;
  relationship: string;
  email: string;
  phone: string;
  canWriteDiary: boolean;
  canAccessJourney: boolean;
}

export interface PicsCase {
  id: string;
  caseNumber: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientSex: 'M' | 'F';
  patientIdDoc: string;
  clinicalStage: ClinicalStage;
  status: 'active' | 'in_review' | 'completed';
  enrollmentAt: string;
  enrollmentSource: string;
  mechanicalVentilationDays: number;
  deliriumDays: number;
  icuLosDays: number;
  barthelAtDischarge: number; // 0-100
  mrcTotal: number; // 0-60
  shockOrSepsis: boolean;
  riskScore: 'alto' | 'moderado' | 'estandar';
  riskScoreValue: number;
  assignedAuditor: string;
  caregivers: Caregiver[];
  lastFollowupDate?: string;
  nextAppointmentDate?: string;
  notes?: string;
}

export interface RecoveryGoal {
  id: string;
  picsCaseId: string;
  domain: 'movilidad' | 'cognitivo' | 'emocional' | 'nutricional';
  description: string;
  measure: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  targetDate: string;
  status: 'active' | 'completed' | 'paused';
  progressPercentage: number;
  lastReportedDate?: string;
  lastReportNotes?: string;
}

export interface DiaryEntry {
  id: string;
  picsCaseId: string;
  authorType: 'patient' | 'caregiver' | 'clinical_team';
  authorName: string;
  authorRole: string;
  entryDate: string;
  content: string;
  mood?: 'muy_bien' | 'bien' | 'regular' | 'dificil';
  visibleToPatient: boolean;
}

export interface DischargeReadinessItem {
  id: string;
  category: 'movilidad' | 'dispositivos' | 'medicacion' | 'alarma' | 'citas';
  title: string;
  description: string;
  status: 'completado' | 'en_progreso' | 'pendiente';
  responsible: string;
}

export interface MedicationItem {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  route: string;
  scheduleTimes: string[]; // e.g. ["08:00", "20:00"]
  instructions: string;
  takenToday: boolean[];
  indicatedFor: string;
}

export interface HomeReading {
  id: string;
  recordedAt: string;
  systolicBp: number;
  diastolicBp: number;
  heartRate: number;
  temperature: number;
  spo2: number;
  painScale: number; // 0-10
  notes?: string;
}

export interface CoordinatedAgendaItem {
  id: string;
  specialty: string;
  professionalName: string;
  dateTime: string;
  location: string;
  status: 'programada' | 'realizada' | 'pendiente';
  instructions: string;
}

export interface EducationResource {
  id: string;
  title: string;
  category: 'ejercicios' | 'nutricion' | 'cognitivo' | 'cuidado_en_casa';
  readTime: string;
  summary: string;
  read: boolean;
  content: string;
}

export interface SupportRequest {
  id: string;
  date: string;
  subject: string;
  message: string;
  status: 'abierta' | 'respondida';
  response?: string;
  respondedBy?: string;
  respondedAt?: string;
}

export interface GamificationState {
  level: number;
  levelTitle: string;
  points: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
  xpProgressPct: number;
  streakDays: number;
  badges: {
    id: string;
    label: string;
    icon: string;
    unlocked: boolean;
  }[];
}

// Clinical Centers Statistics & Sepsis/ACV/Infarto/ICU types
export interface CenterMetric {
  name: string;
  subtitle: string;
  code: string;
  icon: string;
  available: boolean;
  modeKey: AppMode;
  stats: {
    total: number;
    hospitalized: number;
    currentMonth: number;
  };
}

export interface SepsisCase {
  id: string;
  caseCode: string;
  patientName: string;
  age: number;
  activationTime: string;
  triageSource: string;
  bundleHour1Completed: boolean;
  bundleHour3Completed: boolean;
  lactateInitial: number;
  lactatePost: number;
  bloodCulturesDrawn: boolean;
  broadSpectrumAbxGiven: boolean;
  timeToAbxMin: number;
  fluidResuscitationGiven: boolean;
  mapTargetAchieved: boolean; // >65 mmHg
  status: 'activo' | 'recuperado' | 'traslado_uci' | 'fallecido';
}

export interface AcvCaseItem {
  id: string;
  code: string;
  patientName: string;
  age: number;
  admissionTime: string;
  doorToNeedleMin: number; // target <45 or 60 min
  doorToGroinMin?: number; // target <90 or 120 min
  thrombolysisDone: boolean;
  thrombectomyDone: boolean;
  nihssInitial: number;
  nihssDischarge?: number;
  hemorrhagicTransformation: boolean;
  speechTherapyCompliance: boolean;
  status: 'hospitalizado' | 'egresado' | 'auditoria';
}

export interface InfartoCaseItem {
  id: string;
  code: string;
  patientName: string;
  age: number;
  diagnosis: 'STEMI' | 'NSTEMI' | 'Angina Inestable';
  doorToEcgMin: number; // target <10 min
  doorToBalloonMin?: number; // target <90 min
  troponinInitial: number;
  troponinSerial: number;
  pciProcedure: boolean;
  daptPrescribed: boolean;
  cardiacRehabReferred: boolean;
  status: 'uci_coronaria' | 'piso' | 'egresado';
}

export interface IcuLiberationBed {
  bedNumber: string;
  unit: 'UCI Adultos' | 'UCI Cardiovascular' | 'UCI Quirúrgica';
  patientName: string;
  ventilated: boolean;
  ventDays: number;
  targetRass: number;
  actualRass: number;
  camIcuDelirium: 'positivo' | 'negativo' | 'no_evaluable';
  satTrial: 'aprobado' | 'fallido' | 'contraindicado';
  sbtTrial: 'aprobado' | 'fallido' | 'contraindicado';
  earlyMobility: 'realizada' | 'pendiente' | 'contraindicada';
  physicalRestraints: boolean;
  familyEngaged: boolean;
  bundleCompliancePct: number;
}

// FHIR R4 & POSUCI 360 Ecosystem Types
export interface FhirCarePlan {
  resourceType: 'CarePlan';
  id: string;
  status: 'active' | 'completed' | 'on-hold';
  intent: 'order';
  subject: {
    reference: string;
    display: string;
  };
  author: {
    reference: string;
    display: string;
  };
  activity: Array<{
    detail: {
      code: {
        coding: Array<{
          system: string;
          code: string;
          display: string;
        }>;
        text: string;
      };
      status: string;
      scheduledTiming: {
        repeat: {
          frequency: number;
          period: number;
          periodUnit: string;
          timeOfDay: string[];
        };
      };
      description: string;
    };
  }>;
}

export interface FhirObservationComponent {
  code: {
    text: string;
  };
  valueQuantity: {
    value: number;
    unit: string;
    system?: string;
  };
}

export interface FhirObservation {
  resourceType: 'Observation';
  id: string;
  status: 'final' | 'preliminary' | 'amended';
  category: Array<{
    coding: Array<{
      system: string;
      code: string;
      display: string;
    }>;
  }>;
  code: {
    coding: Array<{
      system: string;
      code: string;
      display: string;
    }>;
  };
  subject: {
    reference: string;
    display: string;
  };
  performer: Array<{
    reference: string;
    display: string;
  }>;
  effectiveDateTime: string;
  component: FhirObservationComponent[];
  note: Array<{
    authorString: string;
    text: string;
  }>;
}

export interface ValidatedActivity {
  id: string;
  code: string; // e.g. EDU-PICS-MOT-04
  title: string;
  carePlanId: string;
  status: 'validado_clinicamente' | 'pendiente_validacion' | 'por_revisar' | 'alerta_crisis';
  prescribedDose: string;
  performedDose: string;
  borgScore: number;
  borgDescription: string;
  heartRate: number;
  spo2: number;
  deviceSync: string; // e.g. "Omron BT Sync Serie 7"
  caregiverNote: string;
  caregiverName: string;
  patientName: string;
  recordedAt: string;
  clinicalValidation?: {
    validatorName: string;
    validatorRole: string;
    lawArticle: string; // "Ley 527 de Firma Digital"
    validationTimestamp: string;
    feedbackText: string;
    doctorAvatar: string;
    thankCount: number;
    userThanked: boolean;
  };
}

export interface CrisisAlert {
  id: string;
  timestamp: string;
  patientName: string;
  triggerReason: string;
  vitalMetric: string;
  spo2: number;
  heartRate: number;
  borgScore: number;
  dispatchedTo: string;
  emergencyLine: string;
  status: 'activa' | 'atendida';
  fhirObservationId?: string;
}

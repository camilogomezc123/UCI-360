import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AppMode,
  CurrentUser,
  PicsCase,
  RecoveryGoal,
  DiaryEntry,
  DischargeReadinessItem,
  MedicationItem,
  HomeReading,
  CoordinatedAgendaItem,
  EducationResource,
  SupportRequest,
  GamificationState,
  ClinicalStage,
  FhirCarePlan,
  FhirObservation,
  ValidatedActivity,
  CrisisAlert
} from '../types';
import {
  initialUsers,
  initialPicsCases,
  initialGoals,
  initialDiaryEntries,
  initialDischargeReadiness,
  initialMedications,
  initialHomeReadings,
  initialAgenda,
  initialEducation,
  initialSupportRequests,
  initialGamification,
  initialCarePlans,
  initialFhirObservations,
  initialValidatedActivities,
  initialCrisisAlerts
} from '../data/initialData';

interface AppContextType {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  currentUser: CurrentUser;
  setCurrentUser: (user: CurrentUser) => void;
  users: CurrentUser[];
  easyMode: boolean;
  toggleEasyMode: () => void;

  // Data collections
  picsCases: PicsCase[];
  selectedCaseId: string;
  setSelectedCaseId: (id: string) => void;
  currentCase: PicsCase;
  
  goals: RecoveryGoal[];
  diaryEntries: DiaryEntry[];
  dischargeReadiness: DischargeReadinessItem[];
  medications: MedicationItem[];
  homeReadings: HomeReading[];
  agenda: CoordinatedAgendaItem[];
  education: EducationResource[];
  supportRequests: SupportRequest[];
  gamification: GamificationState;

  // HL7 FHIR R4 & POSUCI 360 Ecosystem
  carePlans: FhirCarePlan[];
  fhirObservations: FhirObservation[];
  validatedActivities: ValidatedActivity[];
  crisisAlerts: CrisisAlert[];

  // Actions
  reportGoalProgress: (goalId: string, addedValue: number, notes: string) => void;
  addDiaryEntry: (content: string, mood?: 'muy_bien' | 'bien' | 'regular' | 'dificil') => void;
  toggleMedicationTaken: (medId: string, index: number) => void;
  addHomeReading: (reading: Omit<HomeReading, 'id' | 'recordedAt'>) => void;
  toggleReadinessItem: (itemId: string) => void;
  markEducationRead: (eduId: string) => void;
  submitSupportRequest: (subject: string, message: string) => void;
  updateCaseStage: (caseId: string, stage: ClinicalStage) => void;
  updateCaseRisk: (caseId: string, risk: 'alto' | 'moderado' | 'estandar', value: number) => void;
  
  // Clinical validation actions
  validateActivity: (activityId: string, feedback: string) => void;
  requestActivityRevision: (activityId: string, notes: string) => void;
  logPatientActivity: (data: {
    code: string;
    title: string;
    performedDose: string;
    borgScore: number;
    heartRate: number;
    spo2: number;
    caregiverNote: string;
  }) => void;
  editPatientActivity: (activityId: string, data: {
    performedDose?: string;
    borgScore?: number;
    heartRate?: number;
    spo2?: number;
    caregiverNote?: string;
  }) => void;
  thankDoctor: (activityId: string) => void;
  triggerCrisisSimulation: (spo2?: number, hr?: number, reason?: string) => void;
  dismissCrisisAlert: (alertId: string) => void;
  addNewCarePlan: (plan: FhirCarePlan) => void;
  bookCoordinatedAppointment: (data: {
    date: string;
    hour: string;
    modality: 'presencial' | 'virtual';
    wheelchairRequested: boolean;
    notes?: string;
  }) => void;
  resetToInitialData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<AppMode>(() => {
    // 1. Prioritize URL query param: ?mode=movil, ?tab=movil, etc.
    if (typeof window !== 'undefined' && window.location.search) {
      const params = new URLSearchParams(window.location.search);
      const urlMode = params.get('mode') || params.get('tab') || params.get('view');
      const validModes: AppMode[] = [
        'movil',
        'hub',
        'pics',
        'sepsis',
        'acv',
        'infarto',
        'icu-liberation',
        'portal',
        'dra-morales',
        'fhir-traceability'
      ];
      if (urlMode && validModes.includes(urlMode as AppMode)) {
        return urlMode as AppMode;
      }
    }

    // 2. Saved preference in localStorage
    const saved = localStorage.getItem('agora_mode') as AppMode;
    if (saved) {
      return saved;
    }

    // 3. Auto-detect mobile devices or PWA standalone mode
    if (typeof window !== 'undefined') {
      const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true;
      const isSmallScreen = window.innerWidth < 768;
      const isMobileUA = /android|iphone|ipad|ipod|mobile/i.test(window.navigator.userAgent);

      if (isStandalone || isSmallScreen || isMobileUA) {
        return 'movil';
      }
    }

    return 'hub';
  });

  const [easyMode, setEasyMode] = useState<boolean>(() => {
    return localStorage.getItem('agora_easy_mode') === 'true';
  });

  const [users] = useState<CurrentUser[]>(initialUsers);
  const [currentUser, setCurrentUser] = useState<CurrentUser>(() => {
    const saved = localStorage.getItem('agora_user_id');
    const found = initialUsers.find(u => u.id === saved);
    return found || initialUsers[0];
  });

  const [picsCases, setPicsCases] = useState<PicsCase[]>(() => {
    const saved = localStorage.getItem('agora_pics_cases');
    if (saved && saved.includes('Pepito Pérez')) {
      return JSON.parse(saved);
    }
    return initialPicsCases;
  });

  const [selectedCaseId, setSelectedCaseId] = useState<string>('pics-carlos');

  const [goals, setGoals] = useState<RecoveryGoal[]>(() => {
    const saved = localStorage.getItem('agora_goals');
    return saved ? JSON.parse(saved) : initialGoals;
  });

  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>(() => {
    const saved = localStorage.getItem('agora_diary');
    if (saved && saved.includes('Pepito')) {
      return JSON.parse(saved);
    }
    return initialDiaryEntries;
  });

  const [dischargeReadiness, setDischargeReadiness] = useState<DischargeReadinessItem[]>(() => {
    const saved = localStorage.getItem('agora_readiness');
    return saved ? JSON.parse(saved) : initialDischargeReadiness;
  });

  const [medications, setMedications] = useState<MedicationItem[]>(() => {
    const saved = localStorage.getItem('agora_medications');
    return saved ? JSON.parse(saved) : initialMedications;
  });

  const [homeReadings, setHomeReadings] = useState<HomeReading[]>(() => {
    const saved = localStorage.getItem('agora_readings');
    return saved ? JSON.parse(saved) : initialHomeReadings;
  });

  const [agenda, setAgenda] = useState<CoordinatedAgendaItem[]>(() => {
    const saved = localStorage.getItem('agora_agenda');
    return saved ? JSON.parse(saved) : initialAgenda;
  });

  const [education, setEducation] = useState<EducationResource[]>(() => {
    const saved = localStorage.getItem('agora_education');
    return saved ? JSON.parse(saved) : initialEducation;
  });

  const [supportRequests, setSupportRequests] = useState<SupportRequest[]>(() => {
    const saved = localStorage.getItem('agora_support');
    return saved ? JSON.parse(saved) : initialSupportRequests;
  });

  const [gamification, setGamification] = useState<GamificationState>(() => {
    const saved = localStorage.getItem('agora_gamification');
    return saved ? JSON.parse(saved) : initialGamification;
  });

  const [carePlans, setCarePlans] = useState<FhirCarePlan[]>(() => {
    const saved = localStorage.getItem('agora_care_plans');
    if (saved && saved.includes('Pepito Pérez')) {
      return JSON.parse(saved);
    }
    return initialCarePlans;
  });

  const [fhirObservations, setFhirObservations] = useState<FhirObservation[]>(() => {
    const saved = localStorage.getItem('agora_fhir_obs');
    if (saved && saved.includes('Pepito Pérez')) {
      return JSON.parse(saved);
    }
    return initialFhirObservations;
  });

  const [validatedActivities, setValidatedActivities] = useState<ValidatedActivity[]>(() => {
    const saved = localStorage.getItem('agora_val_activities');
    if (saved && saved.includes('Pepito Pérez')) {
      return JSON.parse(saved);
    }
    return initialValidatedActivities;
  });

  const [crisisAlerts, setCrisisAlerts] = useState<CrisisAlert[]>(() => {
    const saved = localStorage.getItem('agora_crisis_alerts');
    if (saved && saved.includes('Pepito Pérez')) {
      return JSON.parse(saved);
    }
    return initialCrisisAlerts;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('agora_mode', mode);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem('agora_easy_mode', String(easyMode));
  }, [easyMode]);

  useEffect(() => {
    localStorage.setItem('agora_user_id', currentUser.id);
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('agora_pics_cases', JSON.stringify(picsCases));
  }, [picsCases]);

  useEffect(() => {
    localStorage.setItem('agora_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('agora_diary', JSON.stringify(diaryEntries));
  }, [diaryEntries]);

  useEffect(() => {
    localStorage.setItem('agora_care_plans', JSON.stringify(carePlans));
  }, [carePlans]);

  useEffect(() => {
    localStorage.setItem('agora_fhir_obs', JSON.stringify(fhirObservations));
  }, [fhirObservations]);

  useEffect(() => {
    localStorage.setItem('agora_val_activities', JSON.stringify(validatedActivities));
  }, [validatedActivities]);

  useEffect(() => {
    localStorage.setItem('agora_crisis_alerts', JSON.stringify(crisisAlerts));
  }, [crisisAlerts]);

  useEffect(() => {
    localStorage.setItem('agora_readiness', JSON.stringify(dischargeReadiness));
  }, [dischargeReadiness]);

  useEffect(() => {
    localStorage.setItem('agora_medications', JSON.stringify(medications));
  }, [medications]);

  useEffect(() => {
    localStorage.setItem('agora_readings', JSON.stringify(homeReadings));
  }, [homeReadings]);

  useEffect(() => {
    localStorage.setItem('agora_agenda', JSON.stringify(agenda));
  }, [agenda]);

  useEffect(() => {
    localStorage.setItem('agora_education', JSON.stringify(education));
  }, [education]);

  useEffect(() => {
    localStorage.setItem('agora_support', JSON.stringify(supportRequests));
  }, [supportRequests]);

  useEffect(() => {
    localStorage.setItem('agora_gamification', JSON.stringify(gamification));
  }, [gamification]);

  const currentCase = picsCases.find(c => c.id === selectedCaseId) || picsCases[0];

  const addPointsAndCheckXp = (pts: number) => {
    setGamification(prev => {
      const newPoints = prev.points + pts;
      const newXpInto = prev.xpIntoLevel + pts;
      if (newXpInto >= prev.xpForNextLevel) {
        return {
          ...prev,
          level: prev.level + 1,
          points: newPoints,
          xpIntoLevel: newXpInto - prev.xpForNextLevel,
          xpForNextLevel: prev.xpForNextLevel + 50,
          xpProgressPct: Math.round(((newXpInto - prev.xpForNextLevel) / (prev.xpForNextLevel + 50)) * 100)
        };
      }
      return {
        ...prev,
        points: newPoints,
        xpIntoLevel: newXpInto,
        xpProgressPct: Math.round((newXpInto / prev.xpForNextLevel) * 100)
      };
    });
  };

  const reportGoalProgress = (goalId: string, addedValue: number, notes: string) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id !== goalId) return goal;
      const updatedVal = Math.min(goal.targetValue, goal.currentValue + addedValue);
      const pct = Math.round((updatedVal / goal.targetValue) * 100);
      return {
        ...goal,
        currentValue: updatedVal,
        progressPercentage: pct,
        status: pct >= 100 ? 'completed' : 'active',
        lastReportedDate: new Date().toISOString().split('T')[0],
        lastReportNotes: notes
      };
    }));
    addPointsAndCheckXp(25);
  };

  const addDiaryEntry = (content: string, mood?: 'muy_bien' | 'bien' | 'regular' | 'dificil') => {
    const newEntry: DiaryEntry = {
      id: `diary-${Date.now()}`,
      picsCaseId: selectedCaseId,
      authorType: currentUser.role === 'caregiver' ? 'caregiver' : (currentUser.role === 'patient' ? 'patient' : 'clinical_team'),
      authorName: currentUser.name,
      authorRole: currentUser.title,
      entryDate: new Date().toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' }),
      content,
      mood: mood || 'bien',
      visibleToPatient: true
    };
    setDiaryEntries(prev => [newEntry, ...prev]);
    addPointsAndCheckXp(30);
  };

  const toggleMedicationTaken = (medId: string, index: number) => {
    setMedications(prev => prev.map(med => {
      if (med.id !== medId) return med;
      const updatedTaken = [...med.takenToday];
      updatedTaken[index] = !updatedTaken[index];
      return { ...med, takenToday: updatedTaken };
    }));
    addPointsAndCheckXp(15);
  };

  const addHomeReading = (reading: Omit<HomeReading, 'id' | 'recordedAt'>) => {
    const newReading: HomeReading = {
      id: `read-${Date.now()}`,
      recordedAt: new Date().toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' }),
      ...reading
    };
    setHomeReadings(prev => [newReading, ...prev]);
    addPointsAndCheckXp(20);
  };

  const toggleReadinessItem = (itemId: string) => {
    setDischargeReadiness(prev => prev.map(item => {
      if (item.id !== itemId) return item;
      const nextStatus = item.status === 'completado' ? 'en_progreso' : (item.status === 'en_progreso' ? 'pendiente' : 'completado');
      return { ...item, status: nextStatus };
    }));
  };

  const markEducationRead = (eduId: string) => {
    setEducation(prev => prev.map(item => {
      if (item.id !== eduId) return item;
      return { ...item, read: true };
    }));
    addPointsAndCheckXp(20);
  };

  const submitSupportRequest = (subject: string, message: string) => {
    const newReq: SupportRequest = {
      id: `sup-${Date.now()}`,
      date: new Date().toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' }),
      subject,
      message,
      status: 'abierta'
    };
    setSupportRequests(prev => [newReq, ...prev]);
    addPointsAndCheckXp(10);
  };

  const updateCaseStage = (caseId: string, stage: ClinicalStage) => {
    setPicsCases(prev => prev.map(c => {
      if (c.id !== caseId) return c;
      return { ...c, clinicalStage: stage };
    }));
  };

  const updateCaseRisk = (caseId: string, risk: 'alto' | 'moderado' | 'estandar', value: number) => {
    setPicsCases(prev => prev.map(c => {
      if (c.id !== caseId) return c;
      return { ...c, riskScore: risk, riskScoreValue: value };
    }));
  };

  const toggleEasyMode = () => {
    setEasyMode(prev => !prev);
  };

  const validateActivity = (activityId: string, feedback: string) => {
    const timestamp = new Date().toLocaleString('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });

    setValidatedActivities(prev => prev.map(act => {
      if (act.id !== activityId) return act;
      return {
        ...act,
        status: 'validado_clinicamente',
        clinicalValidation: {
          validatorName: 'Dra. Andrea Morales',
          validatorRole: 'Intensivista Titular • Programa PICS',
          lawArticle: 'Ley 527 de Comercio Electrónico y Firma Digital',
          validationTimestamp: timestamp,
          feedbackText: feedback || 'Validación clínica satisfactoria de la actividad motora. Se aprueba la continuidad del plan prescrito.',
          doctorAvatar: 'AM',
          thankCount: act.clinicalValidation?.thankCount || 0,
          userThanked: act.clinicalValidation?.userThanked || false
        }
      };
    }));

    // Update or append FHIR Observation with status 'final'
    const targetActivity = validatedActivities.find(a => a.id === activityId);
    if (targetActivity) {
      const newObs: FhirObservation = {
        resourceType: 'Observation',
        id: `Obs-${activityId}-${Date.now().toString().slice(-4)}`,
        status: 'final',
        category: [
          {
            coding: [
              {
                system: 'http://terminology.hl7.org/CodeSystem/observation-category',
                code: 'activity',
                display: 'Physical Activity & Rehabilitation'
              }
            ]
          }
        ],
        code: {
          coding: [
            {
              system: 'http://snomed.info/sct',
              code: '229174000',
              display: targetActivity.title
            }
          ]
        },
        subject: {
          reference: 'Patient/PICS-2024-8841',
          display: targetActivity.patientName
        },
        performer: [
          {
            reference: 'RelatedPerson/FAM-MENDOZA-LUCIA',
            display: targetActivity.caregiverName
          },
          {
            reference: 'Practitioner/MED-MORALES-09',
            display: 'Dra. Andrea Morales (Validador Clínico Certificado Ley 527)'
          }
        ],
        effectiveDateTime: new Date().toISOString(),
        component: [
          {
            code: { text: 'Escala de Esfuerzo Percibido Borg Adaptada' },
            valueQuantity: { value: targetActivity.borgScore, unit: '/10' }
          },
          {
            code: { text: 'Frecuencia Cardíaca Post-Esfuerzo' },
            valueQuantity: { value: targetActivity.heartRate, unit: 'lpm' }
          },
          {
            code: { text: 'Saturación de Oxígeno SpO2' },
            valueQuantity: { value: targetActivity.spo2, unit: '%' }
          }
        ],
        note: [
          {
            authorString: targetActivity.caregiverName,
            text: targetActivity.caregiverNote
          },
          {
            authorString: 'Dra. Andrea Morales',
            text: feedback
          }
        ]
      };

      setFhirObservations(prev => [newObs, ...prev]);
    }
  };

  const requestActivityRevision = (activityId: string, notes: string) => {
    setValidatedActivities(prev => prev.map(act => {
      if (act.id !== activityId) return act;
      return {
        ...act,
        status: 'por_revisar',
        clinicalValidation: act.clinicalValidation ? {
          ...act.clinicalValidation,
          feedbackText: `Solicitud de revisión: ${notes}`
        } : undefined
      };
    }));
  };

  const logPatientActivity = (data: {
    code: string;
    title: string;
    performedDose: string;
    borgScore: number;
    heartRate: number;
    spo2: number;
    caregiverNote: string;
  }) => {
    const isCrisis = data.spo2 < 90 || data.borgScore > 4;

    const newAct: ValidatedActivity = {
      id: `act-${Date.now().toString().slice(-6)}`,
      code: data.code || 'EDU-PICS-MOT-NEW',
      title: data.title || 'Sesión de Fisioterapia Domiciliaria',
      carePlanId: 'CP-PICS-MOT-8841-04',
      status: isCrisis ? 'alerta_crisis' : 'pendiente_validacion',
      prescribedDose: 'Según prescripción activa en CarePlan',
      performedDose: data.performedDose,
      borgScore: data.borgScore,
      borgDescription: `${data.borgScore} / 10 ${data.borgScore <= 2 ? '• Leve' : data.borgScore <= 4 ? '• Moderado' : '• Alto / Disnea'}`,
      heartRate: data.heartRate,
      spo2: data.spo2,
      deviceSync: 'Omron BT Sync Serie 7',
      caregiverName: currentUser.role === 'caregiver' ? currentUser.name : 'Lucía Pérez (Cuidadora Familiar)',
      caregiverNote: data.caregiverNote,
      patientName: currentCase.patientName,
      recordedAt: 'Hoy, ' + new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
    };

    setValidatedActivities(prev => [newAct, ...prev]);

    if (isCrisis) {
      triggerCrisisSimulation(data.spo2, data.heartRate, `Lectura crítica en actividad ${newAct.code}: SpO2 ${data.spo2}% con Borg ${data.borgScore}/10.`);
    }

    addPointsAndCheckXp(15);
  };

  const editPatientActivity = (activityId: string, data: {
    performedDose?: string;
    borgScore?: number;
    heartRate?: number;
    spo2?: number;
    caregiverNote?: string;
  }) => {
    // CLINICAL PRINCIPLE 2: "Si el paciente edita un registro previo, este regresa automáticamente a estado 'Por revisar'."
    setValidatedActivities(prev => prev.map(act => {
      if (act.id !== activityId) return act;
      return {
        ...act,
        ...data,
        status: 'por_revisar',
        clinicalValidation: act.clinicalValidation ? {
          ...act.clinicalValidation,
          feedbackText: 'El registro fue editado por el paciente/familiar y requiere re-certificación clínica.'
        } : undefined
      };
    }));
  };

  const thankDoctor = (activityId: string) => {
    setValidatedActivities(prev => prev.map(act => {
      if (act.id !== activityId || !act.clinicalValidation) return act;
      const currentThanked = act.clinicalValidation.userThanked;
      return {
        ...act,
        clinicalValidation: {
          ...act.clinicalValidation,
          thankCount: currentThanked ? Math.max(0, act.clinicalValidation.thankCount - 1) : act.clinicalValidation.thankCount + 1,
          userThanked: !currentThanked
        }
      };
    }));
  };

  const triggerCrisisSimulation = (spo2 = 89, hr = 104, reason?: string) => {
    const newAlert: CrisisAlert = {
      id: `crisis-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleDateString('es-CO') + ' ' + new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
      patientName: currentCase.patientName,
      triggerReason: reason || `Desaturación crítica SpO2 ${spo2}% detectada post-esfuerzo con frecuencia ${hr} lpm. Se activa protocolo de seguridad.`,
      vitalMetric: `SpO2: ${spo2}% • FC: ${hr} lpm • Borg: 5/10 (Disnea de esfuerzo)`,
      spo2,
      heartRate: hr,
      borgScore: 5,
      dispatchedTo: 'Enfermera de Enlace Laura Galarza (Protocolo PICS)',
      emergencyLine: '123 / Urgencias Clínica de Occidente (Línea Prioritaria)',
      status: 'activa',
      fhirObservationId: `Obs-Crisis-${Date.now().toString().slice(-4)}`
    };

    setCrisisAlerts(prev => [newAlert, ...prev]);

    // Generate emergency FHIR Observation
    const emergencyObs: FhirObservation = {
      resourceType: 'Observation',
      id: newAlert.fhirObservationId!,
      status: 'amended',
      category: [
        {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/observation-category',
              code: 'vital-signs',
              display: 'Vital Signs Safety Alert'
            }
          ]
        }
      ],
      code: {
        coding: [
          {
            system: 'http://snomed.info/sct',
            code: '103228002',
            display: 'Desaturación y respuesta fisiológica anormal'
          }
        ]
      },
      subject: {
        reference: 'Patient/PICS-2024-8841',
        display: currentCase.patientName
      },
      performer: [
        {
          reference: 'Practitioner/ENF-GALARZA-01',
          display: 'Enfermera de Enlace Laura Galarza'
        }
      ],
      effectiveDateTime: new Date().toISOString(),
      component: [
        {
          code: { text: 'Saturación de Oxígeno SpO2 Crítica' },
          valueQuantity: { value: spo2, unit: '%' }
        },
        {
          code: { text: 'Frecuencia Cardíaca' },
          valueQuantity: { value: hr, unit: 'lpm' }
        }
      ],
      note: [
        {
          authorString: 'Motor de Seguridad ÁGORA / POSUCI 360',
          text: `ALERTA DE SEGURIDAD CLÍNICA: Valor fuera de rango seguro. Notificación automática enviada a Enfermera de Enlace Laura Galarza y enlace con Urgencias Clínica de Occidente.`
        }
      ]
    };

    setFhirObservations(prev => [emergencyObs, ...prev]);
  };

  const dismissCrisisAlert = (alertId: string) => {
    setCrisisAlerts(prev => prev.map(a => {
      if (a.id !== alertId) return a;
      return { ...a, status: 'atendida' };
    }));
  };

  const addNewCarePlan = (plan: FhirCarePlan) => {
    setCarePlans(prev => [plan, ...prev]);
  };

  const bookCoordinatedAppointment = (data: {
    date: string;
    hour: string;
    modality: 'presencial' | 'virtual';
    wheelchairRequested: boolean;
    notes?: string;
  }) => {
    const newAgendaItem: CoordinatedAgendaItem = {
      id: `agenda-day30-${Date.now()}`,
      specialty: 'Consulta Integral Multidisciplinaria Post-UCI (Día 30)',
      professionalName: 'Dra. Andrea Morales (Intensivista) • Ft. Carlos Vargas • Psic. Clara Santamaría',
      dateTime: `${data.date} • ${data.hour} (90 min)`,
      location: data.modality === 'presencial'
        ? 'Torre Médica Occidente, Piso 4 - Cons. 408'
        : 'Teleconsulta Domiciliaria Enlace PICS',
      status: 'programada',
      instructions: `Modalidad: ${data.modality === 'presencial' ? 'Presencial (Acceso sin barreras)' : 'Teleconsulta Domiciliaria'}. Asistencia de silla de ruedas: ${data.wheelchairRequested ? 'Sí (Camillería activada en entrada)' : 'No requerida'}. Traer diario de UCI, medicamentos y acompañante.`
    };

    setAgenda(prev => [newAgendaItem, ...prev.filter(item => !item.id.startsWith('agenda-day30'))]);

    // Gamification reward
    addPointsAndCheckXp(50);
    setGamification(prev => ({
      ...prev,
      badges: prev.badges.map(b => b.id === 'badge-3' ? { ...b, unlocked: true } : b)
    }));

    // Record FHIR Observation for scheduled appointment
    const appointmentObs: FhirObservation = {
      resourceType: 'Observation',
      id: `Obs-Appt-Day30-${Date.now().toString().slice(-4)}`,
      status: 'final',
      category: [
        {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/observation-category',
              code: 'exam',
              display: 'Multidisciplinary Followup Coordination'
            }
          ]
        }
      ],
      code: {
        coding: [
          {
            system: 'http://snomed.info/sct',
            code: '394539006',
            display: 'Post-ICU multidisciplinary team consultation (PICS Protocol)'
          }
        ]
      },
      subject: {
        reference: 'Patient/PICS-2024-8841',
        display: currentCase.patientName
      },
      performer: [
        {
          reference: 'Practitioner/ENF-GALARZA-01',
          display: 'Lic. Laura Gómez (Enfermera de Enlace PICS)'
        },
        {
          reference: 'Practitioner/MED-MORALES-09',
          display: 'Dra. Andrea Morales (Intensivista Titular)'
        }
      ],
      effectiveDateTime: new Date().toISOString(),
      component: [
        {
          code: { text: 'Fecha y Hora Asignada' },
          valueQuantity: { value: 30, unit: 'días post-alta' }
        }
      ],
      note: [
        {
          authorString: 'Coordinación PICS Clínica de Occidente',
          text: `Cita del Hito de 30 días agendada exitosamente: ${data.date} a las ${data.hour}. Modalidad: ${data.modality}. Asistencia de movilidad: ${data.wheelchairRequested ? 'Activada' : 'No requerida'}.`
        }
      ]
    };

    setFhirObservations(prev => [appointmentObs, ...prev]);
  };

  const resetToInitialData = () => {
    localStorage.clear();
    setPicsCases(initialPicsCases);
    setGoals(initialGoals);
    setDiaryEntries(initialDiaryEntries);
    setDischargeReadiness(initialDischargeReadiness);
    setMedications(initialMedications);
    setHomeReadings(initialHomeReadings);
    setAgenda(initialAgenda);
    setEducation(initialEducation);
    setSupportRequests(initialSupportRequests);
    setGamification(initialGamification);
    setCarePlans(initialCarePlans);
    setFhirObservations(initialFhirObservations);
    setValidatedActivities(initialValidatedActivities);
    setCrisisAlerts(initialCrisisAlerts);
    setEasyMode(false);
  };

  return (
    <AppContext.Provider
      value={{
        mode,
        setMode,
        currentUser,
        setCurrentUser,
        users,
        easyMode,
        toggleEasyMode,
        picsCases,
        selectedCaseId,
        setSelectedCaseId,
        currentCase,
        goals,
        diaryEntries,
        dischargeReadiness,
        medications,
        homeReadings,
        agenda,
        education,
        supportRequests,
        gamification,
        carePlans,
        fhirObservations,
        validatedActivities,
        crisisAlerts,
        reportGoalProgress,
        addDiaryEntry,
        toggleMedicationTaken,
        addHomeReading,
        toggleReadinessItem,
        markEducationRead,
        submitSupportRequest,
        updateCaseStage,
        updateCaseRisk,
        validateActivity,
        requestActivityRevision,
        logPatientActivity,
        editPatientActivity,
        thankDoctor,
        triggerCrisisSimulation,
        dismissCrisisAlert,
        addNewCarePlan,
        bookCoordinatedAppointment,
        resetToInitialData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

import {
  PicsCase,
  RecoveryGoal,
  DiaryEntry,
  DischargeReadinessItem,
  MedicationItem,
  HomeReading,
  CoordinatedAgendaItem,
  EducationResource,
  SupportRequest,
  CenterMetric,
  SepsisCase,
  AcvCaseItem,
  InfartoCaseItem,
  IcuLiberationBed,
  GamificationState,
  CurrentUser,
  FhirCarePlan,
  FhirObservation,
  ValidatedActivity,
  CrisisAlert
} from '../types';

export const initialUsers: CurrentUser[] = [
  {
    id: 'usr-morales',
    name: 'Dra. Andrea Morales',
    role: 'intensivist',
    title: 'Intensivista Titular & Validador Clínico Certificado (PICS)',
    email: 'a.morales@occidente.salud.co',
    avatarText: 'AM',
    isDoctor: true
  },
  {
    id: 'usr-carlos',
    name: 'Pepito Pérez',
    role: 'patient',
    title: 'Paciente Ficticio en Fase III Post-UCI (PICS-2024-8841)',
    email: 'pepito.perez@paciente-ficticio.salud.co',
    avatarText: 'PP'
  },
  {
    id: 'usr-lucia',
    name: 'Lucía Pérez',
    role: 'caregiver',
    title: 'Cuidadora Acompañante de Pepito Pérez (Ficticio)',
    email: 'lucia.perez@familiar-ficticio.salud.co',
    avatarText: 'LP'
  },
  {
    id: 'usr-admin',
    name: 'Dra. Laura Galarza',
    role: 'clinical_leader',
    title: 'Enfermera de Enlace & Auditora de Centros de Excelencia',
    email: 'l.galarza@occidente.salud.co',
    avatarText: 'LG',
    isDoctor: true
  },
  {
    id: 'usr-paciente',
    name: 'Pepito Pérez',
    role: 'patient',
    title: 'Paciente Ficticio en Seguimiento PICS (PICS-DEMO-001)',
    email: 'pepito.perez.demo@paciente-ficticio.salud.co',
    avatarText: 'PP'
  }
];

export const initialCenters: CenterMetric[] = [
  {
    name: 'PICS',
    subtitle: 'Síndrome post cuidado intensivo & PosUCI',
    code: 'PICS',
    icon: 'Activity',
    available: true,
    modeKey: 'pics',
    stats: { total: 42, hospitalized: 14, currentMonth: 8 }
  },
  {
    name: 'Sepsis',
    subtitle: 'Código Sepsis y Choque Séptico',
    code: 'SEPSIS',
    icon: 'FlaskConical',
    available: true,
    modeKey: 'sepsis',
    stats: { total: 68, hospitalized: 19, currentMonth: 12 }
  },
  {
    name: 'ACV',
    subtitle: 'Ataque Cerebrovascular',
    code: 'ACV',
    icon: 'Zap',
    available: true,
    modeKey: 'acv',
    stats: { total: 54, hospitalized: 11, currentMonth: 9 }
  },
  {
    name: 'Infarto',
    subtitle: 'Síndrome Coronario Agudo (SCA / IAM)',
    code: 'INFARTO',
    icon: 'HeartPulse',
    available: true,
    modeKey: 'infarto',
    stats: { total: 61, hospitalized: 16, currentMonth: 10 }
  },
  {
    name: 'ICU Liberation',
    subtitle: 'Bundle ABCDEF & Despertar en UCI',
    code: 'ICULIB',
    icon: 'ShieldAlert',
    available: true,
    modeKey: 'icu-liberation',
    stats: { total: 38, hospitalized: 22, currentMonth: 7 }
  },
  {
    name: 'Colon y Recto',
    subtitle: 'Cirugía colorrectal y recuperación ERAS',
    code: 'COLON',
    icon: 'ClipboardCheck',
    available: false,
    modeKey: 'hub',
    stats: { total: 0, hospitalized: 0, currentMonth: 0 }
  }
];

export const initialPicsCases: PicsCase[] = [
  {
    id: 'pics-carlos',
    caseNumber: 'PICS-2024-8841',
    patientId: 'pat-pepito-8841',
    patientName: 'Pepito Pérez',
    patientAge: 62,
    patientSex: 'M',
    patientIdDoc: 'CC-000.123.456 (Ficticio)',
    clinicalStage: 'seguimiento',
    status: 'active',
    enrollmentAt: '2026-05-10',
    enrollmentSource: 'Egreso UCI Adultos - Clínica de Occidente',
    mechanicalVentilationDays: 5,
    deliriumDays: 2,
    icuLosDays: 9,
    barthelAtDischarge: 70,
    mrcTotal: 44,
    shockOrSepsis: true,
    riskScore: 'alto',
    riskScoreValue: 74,
    assignedAuditor: 'Dra. Andrea Morales (Intensivista Titular)',
    caregivers: [
      {
        id: 'cg-lucia',
        name: 'Lucía Pérez',
        relationship: 'Hija & Cuidadora Acompañante',
        email: 'lucia.perez@familiar-ficticio.salud.co',
        phone: '300 000 0001 (Ficticio)',
        canWriteDiary: true,
        canAccessJourney: true
      }
    ],
    lastFollowupDate: '2026-05-18',
    nextAppointmentDate: '2026-05-25',
    notes: 'Paciente ficticio Pepito Pérez con choque séptico resuelto y polineuropatía del paciente crítico. En fase III de rehabilitación con seguimiento domiciliario y validación por Dra. Andrea Morales.'
  },
  {
    id: 'pics-1',
    caseNumber: 'PICS-DEMO-001',
    patientId: 'pat-1',
    patientName: 'Pepito Pérez',
    patientAge: 54,
    patientSex: 'M',
    patientIdDoc: 'CC-000.123.457 (Ficticio)',
    clinicalStage: 'seguimiento',
    status: 'active',
    enrollmentAt: '2026-09-10',
    enrollmentSource: 'Egreso UCI Adultos',
    mechanicalVentilationDays: 3,
    deliriumDays: 1,
    icuLosDays: 7,
    barthelAtDischarge: 65,
    mrcTotal: 41,
    shockOrSepsis: true,
    riskScore: 'alto',
    riskScoreValue: 78,
    assignedAuditor: 'Dra. Laura Galarza',
    caregivers: [
      {
        id: 'cg-1',
        name: 'Cuidador Ficticio',
        relationship: 'Hija cuidadora',
        email: 'familiar1@paciente-ficticio.salud.co',
        phone: '300 000 0002 (Ficticio)',
        canWriteDiary: true,
        canAccessJourney: true
      }
    ],
    lastFollowupDate: '2026-09-18',
    nextAppointmentDate: '2026-09-24',
    notes: 'Paciente ficticio con debilidad adquirida en UCI leve-moderada. Evoluciona favorablemente con plan de fisioterapia domiciliaria.'
  },
  {
    id: 'pics-2',
    caseNumber: 'PICS-DEMO-002',
    patientId: 'pat-2',
    patientName: 'Pepito Pérez',
    patientAge: 58,
    patientSex: 'M',
    patientIdDoc: 'CC-000.123.458 (Ficticio)',
    clinicalStage: 'egreso_uci',
    status: 'active',
    enrollmentAt: '2026-09-12',
    enrollmentSource: 'Egreso UCI Cardiovascular',
    mechanicalVentilationDays: 4,
    deliriumDays: 2,
    icuLosDays: 8,
    barthelAtDischarge: 70,
    mrcTotal: 42,
    shockOrSepsis: false,
    riskScore: 'moderado',
    riskScoreValue: 56,
    assignedAuditor: 'Dra. Laura Galarza',
    caregivers: [
      {
        id: 'cg-2',
        name: 'Cuidadora Ficticia',
        relationship: 'Esposa',
        email: 'familiar2@paciente-ficticio.salud.co',
        phone: '300 000 0003 (Ficticio)',
        canWriteDiary: true,
        canAccessJourney: true
      }
    ],
    lastFollowupDate: '2026-09-15',
    nextAppointmentDate: '2026-09-22',
    notes: 'Paciente ficticio en posoperatorio de revascularización miocárdica con estancia prolongada. Requiere vigilancia de ansiedad y disnea.'
  },
  {
    id: 'pics-3',
    caseNumber: 'PICS-DEMO-003',
    patientId: 'pat-3',
    patientName: 'Pepito Pérez',
    patientAge: 62,
    patientSex: 'M',
    patientIdDoc: 'CC-000.123.459 (Ficticio)',
    clinicalStage: 'hospitalizacion',
    status: 'in_review',
    enrollmentAt: '2026-09-15',
    enrollmentSource: 'Piso de Medicina Interna',
    mechanicalVentilationDays: 5,
    deliriumDays: 0,
    icuLosDays: 9,
    barthelAtDischarge: 75,
    mrcTotal: 43,
    shockOrSepsis: true,
    riskScore: 'alto',
    riskScoreValue: 82,
    assignedAuditor: 'Dra. Laura Galarza',
    caregivers: [],
    lastFollowupDate: '2026-09-17',
    nextAppointmentDate: '2026-09-20',
    notes: 'Paciente ficticio en recuperación de choque séptico de origen pulmonar. Buena respuesta al destete ventilatorio.'
  },
  {
    id: 'pics-4',
    caseNumber: 'PICS-DEMO-004',
    patientId: 'pat-4',
    patientName: 'Pepito Pérez',
    patientAge: 66,
    patientSex: 'M',
    patientIdDoc: 'CC-000.123.460 (Ficticio)',
    clinicalStage: 'seguimiento',
    status: 'active',
    enrollmentAt: '2026-09-08',
    enrollmentSource: 'Egreso UCI Adultos',
    mechanicalVentilationDays: 6,
    deliriumDays: 1,
    icuLosDays: 10,
    barthelAtDischarge: 80,
    mrcTotal: 44,
    shockOrSepsis: false,
    riskScore: 'moderado',
    riskScoreValue: 52,
    assignedAuditor: 'Dra. Laura Galarza',
    caregivers: [],
    lastFollowupDate: '2026-09-16',
    nextAppointmentDate: '2026-09-27',
    notes: 'Paciente ficticio en seguimiento ambulatorio a 15 días. Reporta mejora en marcha y descanso nocturno.'
  }
];

export const initialGoals: RecoveryGoal[] = [
  {
    id: 'goal-1',
    picsCaseId: 'pics-1',
    domain: 'movilidad',
    description: 'Caminar 20 metros continuos con acompañamiento en el pasillo o sala',
    measure: 'Distancia caminada',
    targetValue: 20,
    currentValue: 15,
    unit: 'metros',
    targetDate: '2026-09-26',
    status: 'active',
    progressPercentage: 75,
    lastReportedDate: '2026-09-18',
    lastReportNotes: 'Hoy caminamos 15 metros sin mareos, solo algo de fatiga en piernas.'
  },
  {
    id: 'goal-2',
    picsCaseId: 'pics-1',
    domain: 'cognitivo',
    description: 'Completar 10 minutos de lectura o ejercicios de memoria diarios',
    measure: 'Tiempo de concentración',
    targetValue: 10,
    currentValue: 8,
    unit: 'minutos',
    targetDate: '2026-09-25',
    status: 'active',
    progressPercentage: 80,
    lastReportedDate: '2026-09-17',
    lastReportNotes: 'Resolvió sopa de letras guiada por su hija con buena atención.'
  },
  {
    id: 'goal-3',
    picsCaseId: 'pics-1',
    domain: 'emocional',
    description: 'Registrar estado de ánimo en el diario y dormir al menos 6 horas continuas',
    measure: 'Horas de sueño reparador',
    targetValue: 7,
    currentValue: 6,
    unit: 'horas',
    targetDate: '2026-09-28',
    status: 'active',
    progressPercentage: 85,
    lastReportedDate: '2026-09-18',
    lastReportNotes: 'Durmió más tranquila después de los ejercicios de respiración.'
  },
  {
    id: 'goal-4',
    picsCaseId: 'pics-1',
    domain: 'nutricional',
    description: 'Consumir el aporte proteico prescrito (mínimo 3 comidas completas sin atragantamiento)',
    measure: 'Comidas toleradas',
    targetValue: 3,
    currentValue: 3,
    unit: 'comidas',
    targetDate: '2026-09-24',
    status: 'completed',
    progressPercentage: 100,
    lastReportedDate: '2026-09-19',
    lastReportNotes: 'Deglución adecuada de dieta blanda con líquidos espesados.'
  }
];

export const initialDiaryEntries: DiaryEntry[] = [
  {
    id: 'diary-1',
    picsCaseId: 'pics-1',
    authorType: 'caregiver',
    authorName: 'Lucía Pérez (Cuidadora)',
    authorRole: 'Cuidador Principal',
    entryDate: '2026-09-18 17:30',
    content: 'Hoy Pepito dio un gran paso: se levantó del sillón sin quejarse del dolor de espalda y caminó hasta el balcón. Tomó sus gotas y almorzó sopa de verduras.',
    mood: 'bien',
    visibleToPatient: true
  },
  {
    id: 'diary-2',
    picsCaseId: 'pics-1',
    authorType: 'patient',
    authorName: 'Pepito Pérez',
    authorRole: 'Paciente',
    entryDate: '2026-09-17 19:15',
    content: 'Me sentí con más energía por la tarde. Ya no siento el mareo que me daba en el hospital. Estoy muy agradecido con mi familia y los terapeutas que vinieron.',
    mood: 'muy_bien',
    visibleToPatient: true
  },
  {
    id: 'diary-3',
    picsCaseId: 'pics-1',
    authorType: 'clinical_team',
    authorName: 'Lic. Andrés Peña',
    authorRole: 'Fisioterapeuta Respiratorio ÁGORA',
    entryDate: '2026-09-16 11:00',
    content: 'Visita de seguimiento domiciliario PICS: Patrón ventilatorio regular. Se instruyó técnica de respiración diafragmática y movilización articular en sedente. Buena tolerancia hemodinámica.',
    visibleToPatient: true
  }
];

export const initialDischargeReadiness: DischargeReadinessItem[] = [
  {
    id: 'read-1',
    category: 'movilidad',
    title: 'Capacidad de traslado cama-sillón segura',
    description: 'El paciente realiza bipedestación y traslado con apoyo de una persona sin riesgo de caída.',
    status: 'completado',
    responsible: 'Equipo de Terapia Física'
  },
  {
    id: 'read-2',
    category: 'dispositivos',
    title: 'Retiro o manejo seguro de accesos venosos / sondas',
    description: 'Verificación de retiro de catéter venoso central y vías invasivas antes del egreso.',
    status: 'completado',
    responsible: 'Enfermería UCI'
  },
  {
    id: 'read-3',
    category: 'medicacion',
    title: 'Conciliación y educación de medicamentos orales',
    description: 'Familiar y paciente comprenden horarios, dosis y contraindicaciones de la fórmula domiciliaria.',
    status: 'en_progreso',
    responsible: 'Química Farmacéutica & Enfermería'
  },
  {
    id: 'read-4',
    category: 'alarma',
    title: 'Identificación de signos de alarma de reingreso',
    description: 'Fiebre >38°C, dificultad respiratoria súbita, confusión o dolor precordial explicados claramente.',
    status: 'completado',
    responsible: 'Médico Tratante'
  },
  {
    id: 'read-5',
    category: 'citas',
    title: 'Agendamiento de control ambulatorio PICS a 14-30 días',
    description: 'Cita coordinada con medicina interna, fisiatría y psicología.',
    status: 'completado',
    responsible: 'Coordinación ÁGORA'
  }
];

export const initialMedications: MedicationItem[] = [
  {
    id: 'med-1',
    name: 'Losartán Potásico',
    dosage: '50 mg',
    frequency: 'Cada 12 horas (8:00 AM y 8:00 PM)',
    route: 'Oral',
    scheduleTimes: ['08:00', '20:00'],
    instructions: 'Tomar con medio vaso de agua después del desayuno y cena.',
    takenToday: [true, false],
    indicatedFor: 'Control de Presión Arterial'
  },
  {
    id: 'med-2',
    name: 'Atorvastatina',
    dosage: '20 mg',
    frequency: 'Una vez al día en la noche (8:00 PM)',
    route: 'Oral',
    scheduleTimes: ['20:00'],
    instructions: 'Tomar antes de acostarse.',
    takenToday: [false],
    indicatedFor: 'Protección cardiovascular y lípidos'
  },
  {
    id: 'med-3',
    name: 'Metformina',
    dosage: '850 mg',
    frequency: 'Cada 24 horas con el almuerzo (12:30 PM)',
    route: 'Oral',
    scheduleTimes: ['12:30'],
    instructions: 'Tomar inmediatamente después del almuerzo.',
    takenToday: [true],
    indicatedFor: 'Control glucémico'
  },
  {
    id: 'med-4',
    name: 'Suplemento Proteico Fortificado',
    dosage: '1 porción (200 ml)',
    frequency: 'Media mañana (10:00 AM)',
    route: 'Oral',
    scheduleTimes: ['10:00'],
    instructions: 'Diluir en agua o leche descremada para recuperación muscular.',
    takenToday: [true],
    indicatedFor: 'Recuperación de masa muscular post-UCI'
  }
];

export const initialHomeReadings: HomeReading[] = [
  {
    id: 'read-1',
    recordedAt: '2026-09-19 08:30',
    systolicBp: 122,
    diastolicBp: 78,
    heartRate: 74,
    temperature: 36.6,
    spo2: 97,
    painScale: 2,
    notes: 'Tomado en reposo al despertar.'
  },
  {
    id: 'read-2',
    recordedAt: '2026-09-18 18:00',
    systolicBp: 128,
    diastolicBp: 80,
    heartRate: 79,
    temperature: 36.8,
    spo2: 96,
    painScale: 3,
    notes: 'Leve molestia lumbar tras caminata.'
  },
  {
    id: 'read-3',
    recordedAt: '2026-09-18 08:15',
    systolicBp: 120,
    diastolicBp: 76,
    heartRate: 72,
    temperature: 36.5,
    spo2: 98,
    painScale: 2,
    notes: 'Muy estable.'
  },
  {
    id: 'read-4',
    recordedAt: '2026-09-17 08:30',
    systolicBp: 125,
    diastolicBp: 82,
    heartRate: 76,
    temperature: 36.7,
    spo2: 97,
    painScale: 3,
    notes: 'Buen estado general.'
  }
];

export const initialAgenda: CoordinatedAgendaItem[] = [
  {
    id: 'ag-1',
    specialty: 'Control Interdisciplinario PosUCI (PICS)',
    professionalName: 'Dra. Laura Galarza (Medicina Crítica y Post-UCI)',
    dateTime: '2026-09-24 10:30 AM',
    location: 'Consultorio 304 - Edificio Consulta Externa Occidente',
    status: 'programada',
    instructions: 'Traer carné de vacunación, registro de presión de la semana y exámenes de laboratorio recientes.'
  },
  {
    id: 'ag-2',
    specialty: 'Fisioterapia y Rehabilitación Pulmonar',
    professionalName: 'Lic. Andrés Peña',
    dateTime: '2026-09-26 02:00 PM',
    location: 'Gimnasio Terapéutico Piso 2',
    status: 'programada',
    instructions: 'Ropa cómoda deportiva y calzado antideslizante.'
  },
  {
    id: 'ag-3',
    specialty: 'Psicología Clínica y Bienestar Emocional',
    professionalName: 'Psic. Claudia Morales',
    dateTime: '2026-09-29 09:00 AM',
    location: 'Teleconsulta o Consultorio 201',
    status: 'programada',
    instructions: 'Sesión enfocada en adaptación familiar y prevención de estrés postraumático.'
  }
];

export const initialEducation: EducationResource[] = [
  {
    id: 'edu-1',
    title: '¿Qué es el Síndrome Post Cuidado Intensivo (PICS)?',
    category: 'cuidado_en_casa',
    readTime: '4 min de lectura',
    summary: 'Guía clara para pacientes y familiares sobre los efectos físicos, cognitivos y emocionales tras salir de UCI y cómo superarlos.',
    read: true,
    content: `El Síndrome Post Cuidado Intensivo (PICS) es el conjunto de síntomas físicos (como debilidad muscular o fatiga), de pensamiento (olvidos leves o dificultad para concentrarse) y emocionales (ansiedad, miedos o problemas para dormir) que pueden presentarse tras sobrevivir a una enfermedad crítica.

Puntos clave:
1. Es común y esperado: no estás solo ni retrocediendo, es parte normal de la convalecencia.
2. El ejercicio suave y progresivo reconstruye la masa muscular perdida.
3. La rutina estructurada ayuda a la mente a reenfocarse.
4. El apoyo familiar y del equipo médico marca la diferencia.`
  },
  {
    id: 'edu-2',
    title: 'Ejercicios respiratorios y de expansión torácica en casa',
    category: 'ejercicios',
    readTime: '3 min de lectura',
    summary: 'Paso a paso para mejorar la capacidad pulmonar, disminuir la fatiga y prevenir neumonías.',
    read: true,
    content: `Realiza estos ejercicios 2 veces al día en posición sentada:

1. Respiración diafragmática: coloca una mano en tu pecho y otra en tu abdomen. Inhala lentamente por la nariz sintiendo cómo sube tu abdomen sin mover bruscamente el pecho. Exhala suavemente por la boca frunciendo los labios.
2. Respiración con pausa: inhala hondo durante 3 segundos, mantén el aire 2 segundos y expulsa lentamente durante 4 segundos.
3. Tos eficaz: inhala suavemente y tose con apoyo de un cojín sobre tu abdomen si sientes secreciones.`
  },
  {
    id: 'edu-3',
    title: 'Nutrición rica en proteínas para reparar tus músculos',
    category: 'nutricion',
    readTime: '5 min de lectura',
    summary: 'Alimentos recomendados para combatir la debilidad muscular adquirida en UCI.',
    read: false,
    content: `Durante la estancia en cama en UCI se pierde masa muscular valiosa. Para recuperarla:
- Prioriza proteínas en cada comida: claras de huevo, pollo magro, pescado, queso campesino o suplementos indicados.
- Hidratación adecuada con agua y caldos nutritivos.
- Come porciones pequeñas pero frecuentes (5 veces al día) si te llenas rápido.`
  },
  {
    id: 'edu-4',
    title: 'Ejercicios de memoria y orientación para el día a día',
    category: 'cognitivo',
    readTime: '4 min de lectura',
    summary: 'Estrategias lúdicas para recuperar agilidad mental y memoria.',
    read: false,
    content: `Juegos sencillos pero muy potentes:
- Llevar un calendario visible tachando cada día cumplido.
- Resolver crucigramas sencillos o sopas de letras.
- Recordar tres cosas que hiciste ayer antes de dormir.
- Llamar a un ser querido y contarle un recuerdo agradable.`
  }
];

export const initialSupportRequests: SupportRequest[] = [
  {
    id: 'sup-1',
    date: '2026-09-17 14:20',
    subject: 'Duda sobre el horario del suplemento proteico',
    message: 'Buenas tardes equipo, ¿el suplemento se debe tomar antes o después del almuerzo si mamá no tiene mucho apetito a medio día?',
    status: 'respondida',
    response: 'Hola María. Si el suplemento le genera saciedad antes del almuerzo, es preferible que lo tome a media tarde (tipo 3:30 PM) como refrigerio. Así no compite con el almuerzo.',
    respondedBy: 'Nutr. Juliana Vélez - ÁGORA',
    respondedAt: '2026-09-17 16:05'
  }
];

export const initialGamification: GamificationState = {
  level: 3,
  levelTitle: 'Héroe de la Convalecencia',
  points: 420,
  xpIntoLevel: 70,
  xpForNextLevel: 100,
  xpProgressPct: 70,
  streakDays: 5,
  badges: [
    { id: 'b1', label: 'Primer Registro', icon: '📝', unlocked: true },
    { id: 'b2', label: 'Racha 5 Días', icon: '🔥', unlocked: true },
    { id: 'b3', label: 'Caminante Firme', icon: '🚶‍♀️', unlocked: true },
    { id: 'b4', label: 'Mente Activa', icon: '🧩', unlocked: true },
    { id: 'b5', label: 'Monitoreo Puntual', icon: '🩺', unlocked: true },
    { id: 'b6', label: 'Graduado PosUCI', icon: '🎓', unlocked: false }
  ]
};

// Sepsis clinical sample cases
export const initialSepsisCases: SepsisCase[] = [
  {
    id: 'sep-1',
    caseCode: 'SEP-2026-084 (Ficticio)',
    patientName: 'Pepito Pérez',
    age: 63,
    activationTime: '2026-09-19 09:15',
    triageSource: 'Urgencias Adultos',
    bundleHour1Completed: true,
    bundleHour3Completed: true,
    lactateInitial: 3.8,
    lactatePost: 1.8,
    bloodCulturesDrawn: true,
    broadSpectrumAbxGiven: true,
    timeToAbxMin: 38,
    fluidResuscitationGiven: true,
    mapTargetAchieved: true,
    status: 'recuperado'
  },
  {
    id: 'sep-2',
    caseCode: 'SEP-2026-085 (Ficticio)',
    patientName: 'Pepito Pérez',
    age: 71,
    activationTime: '2026-09-19 11:40',
    triageSource: 'Hospitalización Piso 4',
    bundleHour1Completed: true,
    bundleHour3Completed: false,
    lactateInitial: 4.5,
    lactatePost: 2.9,
    bloodCulturesDrawn: true,
    broadSpectrumAbxGiven: true,
    timeToAbxMin: 44,
    fluidResuscitationGiven: true,
    mapTargetAchieved: false,
    status: 'traslado_uci'
  },
  {
    id: 'sep-3',
    caseCode: 'SEP-2026-086 (Ficticio)',
    patientName: 'Pepito Pérez',
    age: 58,
    activationTime: '2026-09-18 15:20',
    triageSource: 'Urgencias Adultos',
    bundleHour1Completed: true,
    bundleHour3Completed: true,
    lactateInitial: 2.4,
    lactatePost: 1.2,
    bloodCulturesDrawn: true,
    broadSpectrumAbxGiven: true,
    timeToAbxMin: 29,
    fluidResuscitationGiven: true,
    mapTargetAchieved: true,
    status: 'activo'
  }
];

// ACV Stroke sample cases
export const initialAcvCases: AcvCaseItem[] = [
  {
    id: 'acv-1',
    code: 'S-2026-104 (Ficticio)',
    patientName: 'Pepito Pérez',
    age: 67,
    admissionTime: '2026-09-19 06:10',
    doorToNeedleMin: 36,
    doorToGroinMin: 78,
    thrombolysisDone: true,
    thrombectomyDone: true,
    nihssInitial: 14,
    nihssDischarge: 4,
    hemorrhagicTransformation: false,
    speechTherapyCompliance: true,
    status: 'hospitalizado'
  },
  {
    id: 'acv-2',
    code: 'S-2026-103 (Ficticio)',
    patientName: 'Pepito Pérez',
    age: 74,
    admissionTime: '2026-09-18 14:05',
    doorToNeedleMin: 42,
    thrombolysisDone: true,
    thrombectomyDone: false,
    nihssInitial: 10,
    nihssDischarge: 3,
    hemorrhagicTransformation: false,
    speechTherapyCompliance: true,
    status: 'hospitalizado'
  },
  {
    id: 'acv-3',
    code: 'S-2026-102 (Ficticio)',
    patientName: 'Pepito Pérez',
    age: 59,
    admissionTime: '2026-09-17 21:30',
    doorToNeedleMin: 52,
    thrombolysisDone: true,
    thrombectomyDone: false,
    nihssInitial: 8,
    nihssDischarge: 2,
    hemorrhagicTransformation: false,
    speechTherapyCompliance: true,
    status: 'auditoria'
  }
];

// Infarto / SCA sample cases
export const initialInfartoCases: InfartoCaseItem[] = [
  {
    id: 'inf-1',
    code: 'SCA-2026-092 (Ficticio)',
    patientName: 'Pepito Pérez',
    age: 61,
    diagnosis: 'STEMI',
    doorToEcgMin: 7,
    doorToBalloonMin: 64,
    troponinInitial: 450,
    troponinSerial: 3200,
    pciProcedure: true,
    daptPrescribed: true,
    cardiacRehabReferred: true,
    status: 'uci_coronaria'
  },
  {
    id: 'inf-2',
    code: 'SCA-2026-091 (Ficticio)',
    patientName: 'Pepito Pérez',
    age: 69,
    diagnosis: 'NSTEMI',
    doorToEcgMin: 8,
    troponinInitial: 85,
    troponinSerial: 240,
    pciProcedure: true,
    daptPrescribed: true,
    cardiacRehabReferred: true,
    status: 'piso'
  }
];

// ICU Liberation beds
export const initialIcuBeds: IcuLiberationBed[] = [
  {
    bedNumber: 'UCI-01',
    unit: 'UCI Adultos',
    patientName: 'Pepito Pérez',
    ventilated: true,
    ventDays: 4,
    targetRass: -1,
    actualRass: -1,
    camIcuDelirium: 'negativo',
    satTrial: 'aprobado',
    sbtTrial: 'aprobado',
    earlyMobility: 'realizada',
    physicalRestraints: false,
    familyEngaged: true,
    bundleCompliancePct: 95
  },
  {
    bedNumber: 'UCI-02',
    unit: 'UCI Adultos',
    patientName: 'Pepito Pérez',
    ventilated: false,
    ventDays: 0,
    targetRass: 0,
    actualRass: 0,
    camIcuDelirium: 'negativo',
    satTrial: 'aprobado',
    sbtTrial: 'aprobado',
    earlyMobility: 'realizada',
    physicalRestraints: false,
    familyEngaged: true,
    bundleCompliancePct: 100
  },
  {
    bedNumber: 'UCI-03',
    unit: 'UCI Cardiovascular',
    patientName: 'Pepito Pérez',
    ventilated: true,
    ventDays: 2,
    targetRass: -2,
    actualRass: -2,
    camIcuDelirium: 'no_evaluable',
    satTrial: 'aprobado',
    sbtTrial: 'contraindicado',
    earlyMobility: 'realizada',
    physicalRestraints: false,
    familyEngaged: true,
    bundleCompliancePct: 88
  },
  {
    bedNumber: 'UCI-04',
    unit: 'UCI Quirúrgica',
    patientName: 'Pepito Pérez',
    ventilated: false,
    ventDays: 0,
    targetRass: 0,
    actualRass: 1,
    camIcuDelirium: 'positivo',
    satTrial: 'aprobado',
    sbtTrial: 'aprobado',
    earlyMobility: 'realizada',
    physicalRestraints: false,
    familyEngaged: true,
    bundleCompliancePct: 80
  }
];

export const initialCarePlans: FhirCarePlan[] = [
  {
    resourceType: 'CarePlan',
    id: 'CP-PICS-MOT-8841-04',
    status: 'active',
    intent: 'order',
    subject: {
      reference: 'Patient/PICS-2024-8841',
      display: 'Pepito Pérez'
    },
    author: {
      reference: 'Practitioner/MED-MORALES-09',
      display: 'Dra. Andrea Morales (Intensivista Titular)'
    },
    activity: [
      {
        detail: {
          code: {
            coding: [
              {
                system: 'http://snomed.info/sct',
                code: '229174000',
                display: 'Ejercicio de fortalecimiento muscular de miembros inferiores'
              }
            ],
            text: 'Guía de Fortalecimiento Muscular y Transferencias en Casa (Fase III Post-UCI)'
          },
          status: 'scheduled',
          scheduledTiming: {
            repeat: {
              frequency: 1,
              period: 1,
              periodUnit: 'd',
              timeOfDay: ['10:00:00']
            }
          },
          description: '3 series x 8 repeticiones en bipedestación asistida con reposo intermedio'
        }
      }
    ]
  }
];

export const initialFhirObservations: FhirObservation[] = [
  {
    resourceType: 'Observation',
    id: 'Obs-Activity-8841-04',
    status: 'final',
    category: [
      {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/observation-category',
            code: 'activity',
            display: 'Activity'
          }
        ]
      }
    ],
    code: {
      coding: [
        {
          system: 'http://snomed.info/sct',
          code: '229174000',
          display: 'Bipedestación y cuádriceps asistido'
        }
      ]
    },
    subject: {
      reference: 'Patient/PICS-2024-8841',
      display: 'Pepito Pérez'
    },
    performer: [
      {
        reference: 'RelatedPerson/FAM-PEREZ-LUCIA',
        display: 'Lucía Pérez (Cuidadora Acompañante)'
      },
      {
        reference: 'Practitioner/MED-MORALES-09',
        display: 'Dra. Andrea Morales (Validador Clínico Certificado)'
      }
    ],
    effectiveDateTime: '2026-05-18T10:18:00-05:00',
    component: [
      {
        code: {
          text: 'Escala de Esfuerzo Percibido Borg Adaptada'
        },
        valueQuantity: {
          value: 2,
          unit: '/10',
          system: 'http://unitsofmeasure.org'
        }
      },
      {
        code: {
          text: 'Frecuencia Cardíaca Post-Esfuerzo'
        },
        valueQuantity: {
          value: 78,
          unit: 'lpm',
          system: 'http://unitsofmeasure.org'
        }
      },
      {
        code: {
          text: 'Saturación de Oxígeno SpO2'
        },
        valueQuantity: {
          value: 97,
          unit: '%',
          system: 'http://unitsofmeasure.org'
        }
      }
    ],
    note: [
      {
        authorString: 'Lucía Pérez (Cuidadora)',
        text: 'Pepito hizo las 3 series con buena postura y bebió agua después.'
      },
      {
        authorString: 'Dra. Andrea Morales',
        text: 'Excelente ejecución, Pepito y Lucía. Muy buena técnica de levantamiento sin cambios ortostáticos. Mantener este ritmo durante 3 días más antes de progresar a 4 series.'
      }
    ]
  }
];

export const initialValidatedActivities: ValidatedActivity[] = [
  {
    id: 'act-8841-04',
    code: 'EDU-PICS-MOT-04',
    title: 'Guía de Fortalecimiento Muscular y Transferencias en Casa',
    carePlanId: 'CP-PICS-MOT-8841-04',
    status: 'validado_clinicamente',
    prescribedDose: '3 series × 8 repeticiones en bipedestación asistida con reposo intermedio',
    performedDose: '3 series × 8 reps',
    borgScore: 2,
    borgDescription: '2 / 10 • Leve (Sin mareo ortostático)',
    heartRate: 78,
    spo2: 97,
    deviceSync: 'Omron BT Sync Serie 7 (Ficticio)',
    caregiverName: 'Lucía Pérez (Cuidadora Familiar)',
    caregiverNote: 'Pepito hizo las 3 series con buena postura y bebió agua después de cada pausa. Noté sus piernas más firmes al levantarse del sillón.',
    patientName: 'Pepito Pérez',
    recordedAt: '2026-05-18 10:18 AM',
    clinicalValidation: {
      validatorName: 'Dra. Andrea Morales',
      validatorRole: 'Intensivista Titular • Programa PICS',
      lawArticle: 'Ley 527 de Comercio Electrónico y Firma Digital',
      validationTimestamp: '2026-05-18 10:45 AM',
      feedbackText: 'Excelente ejecución, Pepito y Lucía. Muy buena técnica de levantamiento sin cambios ortostáticos. Mantener este ritmo durante 3 días más antes de progresar a 4 series. Felicitaciones por el trabajo en equipo.',
      doctorAvatar: 'AM',
      thankCount: 1,
      userThanked: true
    }
  },
  {
    id: 'act-8841-05',
    code: 'EDU-PICS-RESP-02',
    title: 'Terapia Espirométrica de Incentivo (Triflo) Domiciliario',
    carePlanId: 'CP-PICS-MOT-8841-04',
    status: 'pendiente_validacion',
    prescribedDose: '5 ciclos de 10 inspiraciones lentas cada 2 horas durante el día',
    performedDose: '5 ciclos × 10 inspiraciones',
    borgScore: 3,
    borgDescription: '3 / 10 • Moderado suave',
    heartRate: 82,
    spo2: 96,
    deviceSync: 'Omron BT Sync Serie 7 (Ficticio)',
    caregiverName: 'Lucía Pérez (Cuidadora Familiar)',
    caregiverNote: 'Logró elevar las 2 primeras esferas sostenidas por 3 segundos. No refirió dolor torácico ni mareo.',
    patientName: 'Pepito Pérez',
    recordedAt: 'Hoy, 12:30 PM'
  }
];

export const initialCrisisAlerts: CrisisAlert[] = [
  {
    id: 'alert-01',
    timestamp: '2026-05-14 16:20',
    patientName: 'Pepito Pérez',
    triggerReason: 'Lectura aislada de PAM 62 mmHg post-ejercicio inicial (Simulación Ficticia)',
    vitalMetric: 'PAM: 62 mmHg • SpO2: 94%',
    spo2: 94,
    heartRate: 88,
    borgScore: 4,
    dispatchedTo: 'Enfermera de Enlace (Dra. Laura Galarza)',
    emergencyLine: 'Línea de Enlace Asistencial (Ficticia)',
    status: 'atendida',
    fhirObservationId: 'Obs-Alert-8841-01'
  }
];

import { PersonBiorhythmData } from './multi-biorhythm-calculator'

export interface PersonalAnalysis {
  personId: string
  personName: string
  physical: {
    value: number
    state: 'high' | 'medium' | 'low'
    specificNeeds: string[]
    energyLevel: string
  }
  emotional: {
    value: number
    state: 'high' | 'medium' | 'low'
    specificNeeds: string[]
    moodDescription: string
  }
  intellectual: {
    value: number
    state: 'high' | 'medium' | 'low'
    specificNeeds: string[]
    mentalCapacity: string
  }
}

export interface SmartRecommendation {
  category: 'nutrition' | 'exercise' | 'creativity' | 'wellness'
  title: string
  groupDynamics: string
  individualProfiles: PersonalAnalysis[]
  intelligentFusion: {
    strategy: string
    adaptations: string[]
    sharedActivities: string[]
    personalizedTips: { [personId: string]: string[] }
  }
}

// Análisis detallado de cada persona
function analyzeIndividualCycles(person: PersonBiorhythmData): PersonalAnalysis {
  const physical = person.today.physical || 0
  const emotional = person.today.emotional || 0
  const intellectual = person.today.intellectual || 0

  const getState = (value: number): 'high' | 'medium' | 'low' => {
    if (value >= 70) return 'high'
    if (value >= 40) return 'medium'
    return 'low'
  }

  // Análisis físico específico
  const getPhysicalAnalysis = (value: number) => {
    if (value >= 80) {
      return {
        specificNeeds: [
          "Necesita actividades de muy alta intensidad para canalizar energía excesiva",
          "Puede liderar actividades físicas grupales y motivar a otros",
          "Requiere desafíos físicos constantes para evitar inquietud",
          "Necesita proteínas extra y carbohidratos complejos para sostener energía"
        ],
        energyLevel: "Energía máxima - Líder natural en actividades físicas"
      }
    } else if (value >= 60) {
      return {
        specificNeeds: [
          "Necesita actividades de alta intensidad pero controlada",
          "Puede participar activamente en deportes grupales",
          "Ideal para ejercicios de resistencia y fuerza",
          "Requiere alimentación energética balanceada"
        ],
        energyLevel: "Alta energía - Participante activo"
      }
    } else if (value >= 40) {
      return {
        specificNeeds: [
          "Necesita actividades moderadas y progresivas",
          "Puede seguir rutinas establecidas sin liderar",
          "Ideal para ejercicios de intensidad media",
          "Requiere alimentación equilibrada y regular"
        ],
        energyLevel: "Energía moderada - Seguidor confiable"
      }
    } else if (value >= 20) {
      return {
        specificNeeds: [
          "Necesita actividades suaves y de recuperación",
          "Debe evitar esfuerzos físicos intensos",
          "Ideal para yoga, estiramientos y caminatas ligeras",
          "Requiere alimentos nutritivos y fáciles de digerir"
        ],
        energyLevel: "Baja energía - Necesita apoyo y recuperación"
      }
    } else {
      return {
        specificNeeds: [
          "Necesita descanso completo y actividades muy suaves",
          "Debe evitar cualquier actividad física demandante",
          "Solo actividades de relajación y recuperación pasiva",
          "Requiere alimentos reconfortantes y suplementos energéticos"
        ],
        energyLevel: "Energía mínima - Prioridad en descanso"
      }
    }
  }

  // Análisis emocional específico
  const getEmotionalAnalysis = (value: number) => {
    if (value >= 80) {
      return {
        specificNeeds: [
          "Necesita expresión emocional intensa y conexiones sociales profundas",
          "Puede ser el motivador y animador principal del grupo",
          "Requiere actividades colaborativas y celebraciones",
          "Necesita canalizar energía emocional positiva en proyectos grupales"
        ],
        moodDescription: "Estado emocional excelente - Motivador natural del grupo"
      }
    } else if (value >= 60) {
      return {
        specificNeeds: [
          "Necesita interacción social activa y expresión emocional",
          "Puede facilitar conversaciones y actividades grupales",
          "Ideal para actividades creativas y colaborativas",
          "Requiere reconocimiento y feedback positivo"
        ],
        moodDescription: "Buen estado emocional - Facilitador social"
      }
    } else if (value >= 40) {
      return {
        specificNeeds: [
          "Necesita equilibrio entre socialización y tiempo personal",
          "Puede participar en actividades grupales sin presión",
          "Ideal para conversaciones moderadas y actividades tranquilas",
          "Requiere apoyo emocional suave y comprensión"
        ],
        moodDescription: "Estado emocional estable - Participante equilibrado"
      }
    } else if (value >= 20) {
      return {
        specificNeeds: [
          "Necesita apoyo emocional constante y actividades calmantes",
          "Debe evitar situaciones estresantes o conflictivas",
          "Ideal para actividades de autocuidado y relajación",
          "Requiere comprensión, paciencia y espacio personal"
        ],
        moodDescription: "Estado emocional frágil - Necesita apoyo y cuidado"
      }
    } else {
      return {
        specificNeeds: [
          "Necesita apoyo emocional intensivo y actividades muy suaves",
          "Debe evitar cualquier situación emocionalmente demandante",
          "Solo actividades de autocuidado y recuperación emocional",
          "Requiere comprensión total y ambiente muy protegido"
        ],
        moodDescription: "Estado emocional muy bajo - Prioridad en recuperación emocional"
      }
    }
  }

  // Análisis intelectual específico
  const getIntellectualAnalysis = (value: number) => {
    if (value >= 80) {
      return {
        specificNeeds: [
          "Necesita desafíos mentales complejos y proyectos innovadores",
          "Puede liderar la planificación y toma de decisiones grupales",
          "Ideal para resolver problemas complejos y crear estrategias",
          "Requiere estimulación mental constante y variada"
        ],
        mentalCapacity: "Capacidad intelectual máxima - Líder estratégico"
      }
    } else if (value >= 60) {
      return {
        specificNeeds: [
          "Necesita actividades mentales desafiantes pero estructuradas",
          "Puede contribuir significativamente en planificación grupal",
          "Ideal para análisis, organización y resolución de problemas",
          "Requiere proyectos estimulantes con objetivos claros"
        ],
        mentalCapacity: "Alta capacidad intelectual - Contribuidor clave"
      }
    } else if (value >= 40) {
      return {
        specificNeeds: [
          "Necesita actividades mentales moderadas y bien estructuradas",
          "Puede seguir planes establecidos y contribuir con ideas",
          "Ideal para tareas organizadas y aprendizaje gradual",
          "Requiere claridad en objetivos y apoyo en decisiones complejas"
        ],
        mentalCapacity: "Capacidad intelectual moderada - Ejecutor confiable"
      }
    } else if (value >= 20) {
      return {
        specificNeeds: [
          "Necesita descanso mental y actividades simples",
          "Debe evitar decisiones complejas o presión mental",
          "Ideal para tareas rutinarias y actividades relajantes",
          "Requiere apoyo constante en la toma de decisiones"
        ],
        mentalCapacity: "Baja capacidad intelectual - Necesita apoyo mental"
      }
    } else {
      return {
        specificNeeds: [
          "Necesita descanso mental completo y actividades muy simples",
          "Debe evitar cualquier actividad mentalmente demandante",
          "Solo actividades automáticas y de relajación mental",
          "Requiere apoyo total en cualquier decisión"
        ],
        mentalCapacity: "Capacidad intelectual mínima - Prioridad en descanso mental"
      }
    }
  }

  const physicalAnalysis = getPhysicalAnalysis(physical)
  const emotionalAnalysis = getEmotionalAnalysis(emotional)
  const intellectualAnalysis = getIntellectualAnalysis(intellectual)

  return {
    personId: person.id,
    personName: person.name,
    physical: {
      value: physical,
      state: getState(physical),
      specificNeeds: physicalAnalysis.specificNeeds,
      energyLevel: physicalAnalysis.energyLevel
    },
    emotional: {
      value: emotional,
      state: getState(emotional),
      specificNeeds: emotionalAnalysis.specificNeeds,
      moodDescription: emotionalAnalysis.moodDescription
    },
    intellectual: {
      value: intellectual,
      state: getState(intellectual),
      specificNeeds: intellectualAnalysis.specificNeeds,
      mentalCapacity: intellectualAnalysis.mentalCapacity
    }
  }
}

// Fusión inteligente para nutrición
function createNutritionFusion(profiles: PersonalAnalysis[]): SmartRecommendation {
  const highEnergyPeople = profiles.filter(p => p.physical.value >= 60)
  const lowEnergyPeople = profiles.filter(p => p.physical.value < 40)
  const mediumEnergyPeople = profiles.filter(p => p.physical.value >= 40 && p.physical.value < 60)

  let strategy = ""
  let adaptations: string[] = []
  let sharedActivities: string[] = []
  let personalizedTips: { [personId: string]: string[] } = {}

  // Crear tips personalizados para cada persona
  profiles.forEach(person => {
    personalizedTips[person.personId] = [
      `${person.personName}: ${person.physical.energyLevel}`,
      ...person.physical.specificNeeds.slice(0, 2)
    ]
  })

  if (highEnergyPeople.length > 0 && lowEnergyPeople.length > 0) {
    strategy = `Estrategia de Menú Adaptativo: El grupo tiene energías contrastantes que requieren un enfoque de alimentación diferenciada pero compartida.`
    
    adaptations = [
      `**Buffet Inteligente**: Crear estaciones de comida donde ${highEnergyPeople.map(p => p.personName).join(', ')} pueden acceder a opciones energéticas (proteínas, carbohidratos complejos, frutos secos) mientras ${lowEnergyPeople.map(p => p.personName).join(', ')} tienen opciones reconfortantes (sopas, caldos, comidas tibias)`,
      `**Horarios Flexibles**: ${highEnergyPeople.map(p => p.personName).join(', ')} pueden desayunar temprano con opciones energéticas, mientras ${lowEnergyPeople.map(p => p.personName).join(', ')} pueden tener un brunch más tardío y relajado`,
      `**Porciones Adaptadas**: Porciones más grandes y densas en nutrientes para los de alta energía, porciones más pequeñas y fáciles de digerir para los de baja energía`,
      `**Preparación Colaborativa**: Los de alta energía pueden encargarse de la preparación activa (cortar, cocinar), mientras los de baja energía supervisan y organizan desde una posición más relajada`
    ]

    sharedActivities = [
      "Cocina colaborativa donde cada persona tiene un rol según su nivel de energía",
      "Comidas familiares con menús personalizados pero momento social compartido",
      "Preparación de meal prep grupal con opciones para diferentes necesidades energéticas"
    ]
  } else if (highEnergyPeople.length === profiles.length) {
    strategy = "Estrategia de Alta Energía Grupal: Todo el grupo tiene energía elevada, ideal para comidas energéticas y preparación activa."
    
    adaptations = [
      "**Comidas Energéticas Grupales**: Desayunos abundantes con proteínas, almuerzos ricos en carbohidratos complejos, cenas balanceadas",
      "**Cocina Activa y Competitiva**: Preparación colaborativa con elementos de competencia amistosa, parrilladas grupales, experimentos culinarios",
      "**Snacks Energéticos Constantes**: Estaciones de frutos secos, barras energéticas, smoothies post-ejercicio disponibles todo el día",
      "**Hidratación Deportiva**: Bebidas con electrolitos, aguas saborizadas naturales, jugos energéticos frescos"
    ]
  } else if (lowEnergyPeople.length === profiles.length) {
    strategy = "Estrategia de Recuperación Grupal: Todo el grupo necesita alimentación reconfortante y de fácil digestión."
    
    adaptations = [
      "**Comidas Reconfortantes**: Sopas nutritivas, guisos caseros, comidas tibias preparadas con métodos de cocción lenta",
      "**Preparación Relajada**: Uso de slow cooker, comidas preparadas con anticipación, recetas simples y nutritivas",
      "**Alimentos Curativos**: Caldos de hueso, tés medicinales, alimentos ricos en vitaminas y minerales",
      "**Ambiente Tranquilo**: Comidas en espacios relajados con música suave y conversaciones calmadas"
    ]
  }

  return {
    category: 'nutrition',
    title: 'Plan Nutricional Inteligente Personalizado',
    groupDynamics: strategy,
    individualProfiles: profiles,
    intelligentFusion: {
      strategy,
      adaptations,
      sharedActivities,
      personalizedTips
    }
  }
}

// Fusión inteligente para ejercicio
function createExerciseFusion(profiles: PersonalAnalysis[]): SmartRecommendation {
  const highEnergyPeople = profiles.filter(p => p.physical.value >= 60)
  const lowEnergyPeople = profiles.filter(p => p.physical.value < 40)

  let strategy = ""
  let adaptations: string[] = []
  let sharedActivities: string[] = []
  let personalizedTips: { [personId: string]: string[] } = {}

  profiles.forEach(person => {
    personalizedTips[person.personId] = [
      `${person.personName}: ${person.physical.energyLevel}`,
      ...person.physical.specificNeeds.slice(0, 2)
    ]
  })

  if (highEnergyPeople.length > 0 && lowEnergyPeople.length > 0) {
    strategy = `Estrategia de Ejercicio Multinivel: Crear rutinas donde cada persona puede participar según su capacidad física actual.`
    
    adaptations = [
      `**Circuitos Adaptativos**: ${highEnergyPeople.map(p => p.personName).join(', ')} realizan ejercicios de alta intensidad mientras ${lowEnergyPeople.map(p => p.personName).join(', ')} hacen versiones modificadas o ejercicios de recuperación`,
      `**Roles Complementarios**: Los de alta energía lideran el calentamiento y motivan, los de baja energía se enfocan en técnica y proporcionan apoyo emocional`,
      `**Tiempos Flexibles**: Sesiones más largas para los activos (60-90 min), sesiones más cortas para los que se recuperan (20-30 min)`,
      `**Actividades Híbridas**: Yoga dinámico para los activos, yoga restaurativo para los que descansan, en el mismo espacio y tiempo`
    ]

    sharedActivities = [
      "Caminatas grupales donde el ritmo se adapta al más lento, con intervalos de intensidad para los más activos",
      "Clases de baile donde cada persona baila a su intensidad pero todos siguen la misma música",
      "Deportes en equipo con roles adaptados: los activos en posiciones demandantes, los que descansan en roles de apoyo"
    ]
  }

  return {
    category: 'exercise',
    title: 'Programa de Ejercicio Adaptativo Inteligente',
    groupDynamics: strategy,
    individualProfiles: profiles,
    intelligentFusion: {
      strategy,
      adaptations,
      sharedActivities,
      personalizedTips
    }
  }
}

// Fusión inteligente para creatividad
function createCreativityFusion(profiles: PersonalAnalysis[]): SmartRecommendation {
  const highIntellectualPeople = profiles.filter(p => p.intellectual.value >= 60)
  const lowIntellectualPeople = profiles.filter(p => p.intellectual.value < 40)

  let strategy = ""
  let adaptations: string[] = []
  let sharedActivities: string[] = []
  let personalizedTips: { [personId: string]: string[] } = {}

  profiles.forEach(person => {
    personalizedTips[person.personId] = [
      `${person.personName}: ${person.intellectual.mentalCapacity}`,
      ...person.intellectual.specificNeeds.slice(0, 2)
    ]
  })

  if (highIntellectualPeople.length > 0 && lowIntellectualPeople.length > 0) {
    strategy = `Estrategia de Colaboración Intelectual: Aprovechar las diferentes capacidades mentales para crear proyectos colaborativos enriquecedores.`
    
    adaptations = [
      `**Roles Complementarios**: ${highIntellectualPeople.map(p => p.personName).join(', ')} lideran la conceptualización y planificación, mientras ${lowIntellectualPeople.map(p => p.personName).join(', ')} se enfocan en la ejecución práctica y aportan perspectivas intuitivas`,
      `**Proyectos Multinivel**: Crear actividades que permiten participación en diferentes niveles de complejidad, desde tareas simples hasta desafíos complejos`,
      `**Rotación de Liderazgo**: Alternar quién lidera según las capacidades del momento y el tipo de actividad`,
      `**Apoyo Bidireccional**: Los activos mentalmente enseñan y estructuran, los que descansan aportan creatividad espontánea y feedback honesto`
    ]

    sharedActivities = [
      "Proyectos de escritura colaborativa donde unos crean la estructura narrativa y otros desarrollan personajes y diálogos",
      "Actividades artísticas donde cada persona contribuye según su capacidad: planificación vs ejecución vs decoración",
      "Resolución de problemas en equipo con roles rotativos según la complejidad de cada fase"
    ]
  }

  return {
    category: 'creativity',
    title: 'Actividades Creativas Colaborativas Inteligentes',
    groupDynamics: strategy,
    individualProfiles: profiles,
    intelligentFusion: {
      strategy,
      adaptations,
      sharedActivities,
      personalizedTips
    }
  }
}

// Fusión inteligente para bienestar
function createWellnessFusion(profiles: PersonalAnalysis[]): SmartRecommendation {
  const highEmotionalPeople = profiles.filter(p => p.emotional.value >= 60)
  const lowEmotionalPeople = profiles.filter(p => p.emotional.value < 40)

  let strategy = ""
  let adaptations: string[] = []
  let sharedActivities: string[] = []
  let personalizedTips: { [personId: string]: string[] } = {}

  profiles.forEach(person => {
    personalizedTips[person.personId] = [
      `${person.personName}: ${person.emotional.moodDescription}`,
      ...person.emotional.specificNeeds.slice(0, 2)
    ]
  })

  if (highEmotionalPeople.length > 0 && lowEmotionalPeople.length > 0) {
    strategy = `Estrategia de Equilibrio Emocional: Crear un ambiente donde los estados emocionales diferentes se complementen y apoyen mutuamente.`
    
    adaptations = [
      `**Apoyo Emocional Bidireccional**: ${highEmotionalPeople.map(p => p.personName).join(', ')} proporcionan energía y motivación, mientras ${lowEmotionalPeople.map(p => p.personName).join(', ')} aportan calma y perspectiva reflexiva`,
      `**Actividades Graduales**: Comenzar con actividades suaves que permitan a todos participar, luego escalar según el estado emocional grupal`,
      `**Espacios Seguros**: Crear ambientes donde cada persona puede expresarse según su capacidad emocional sin presión`,
      `**Ritmos Respetados**: Permitir que cada persona participe en las actividades según su estado emocional del momento`
    ]

    sharedActivities = [
      "Círculos de conversación donde los emocionalmente activos facilitan y los que necesitan apoyo pueden compartir sin presión",
      "Actividades artísticas expresivas donde cada uno participa según su estado: creación activa vs observación reflexiva",
      "Meditaciones grupales con roles adaptados: algunos guían, otros simplemente reciben y se relajan"
    ]
  }

  return {
    category: 'wellness',
    title: 'Bienestar Emocional Grupal Inteligente',
    groupDynamics: strategy,
    individualProfiles: profiles,
    intelligentFusion: {
      strategy,
      adaptations,
      sharedActivities,
      personalizedTips
    }
  }
}

// Función principal para generar recomendaciones inteligentes
export function generateSmartRecommendations(people: PersonBiorhythmData[]): SmartRecommendation[] {
  const individualProfiles = people.map(person => analyzeIndividualCycles(person))
  
  return [
    createNutritionFusion(individualProfiles),
    createExerciseFusion(individualProfiles),
    createCreativityFusion(individualProfiles),
    createWellnessFusion(individualProfiles)
  ]
}
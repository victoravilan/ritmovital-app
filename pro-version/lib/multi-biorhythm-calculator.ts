export interface ProUserProfile {
  id: string
  name: string
  birthDate: string
  birthTime?: string
  birthPlace: string
  ethnicity?: string
  color: string // Color único para el gráfico
}

export interface BiorhythmValues {
  physical: number
  emotional: number
  intellectual: number
}

export interface PersonBiorhythmData {
  profile: ProUserProfile
  today: BiorhythmValues
  yesterday: BiorhythmValues
  selectedDate?: BiorhythmValues
  chartData: Array<{
    date: string
    physical: number
    emotional: number
    intellectual: number
    isToday?: boolean
    isSelected?: boolean
    fullDate: Date
  }>
}

export interface MultiBiorhythmData {
  people: PersonBiorhythmData[]
  combinedChartData: Array<{
    date: string
    fullDate: Date
    isToday?: boolean
    isSelected?: boolean
    [key: string]: any // Para datos dinámicos de cada persona
  }>
}

export type ComparisonType = 'physical' | 'emotional' | 'intellectual'

export function calculateMultiBiorhythms(
  profiles: ProUserProfile[], 
  selectedDate?: Date,
  comparisonType: ComparisonType = 'physical'
): MultiBiorhythmData {
  const today = new Date()
  const referenceDate = selectedDate || today

  // Biorhythm periods
  const PHYSICAL_PERIOD = 23
  const EMOTIONAL_PERIOD = 28
  const INTELLECTUAL_PERIOD = 33

  const people: PersonBiorhythmData[] = profiles.map(profile => {
    const birthDate = new Date(profile.birthDate)
    const daysSinceBirth = Math.floor((today.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24))
    const daysSinceBirthReference = Math.floor((referenceDate.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24))
    const daysSinceBirthYesterday = daysSinceBirthReference - 1

    // Calculate today's values
    const todayValues: BiorhythmValues = {
      physical: Math.round(Math.sin((2 * Math.PI * daysSinceBirth) / PHYSICAL_PERIOD) * 100),
      emotional: Math.round(Math.sin((2 * Math.PI * daysSinceBirth) / EMOTIONAL_PERIOD) * 100),
      intellectual: Math.round(Math.sin((2 * Math.PI * daysSinceBirth) / INTELLECTUAL_PERIOD) * 100),
    }

    // Calculate yesterday's values
    const yesterdayValues: BiorhythmValues = {
      physical: Math.round(Math.sin((2 * Math.PI * daysSinceBirthYesterday) / PHYSICAL_PERIOD) * 100),
      emotional: Math.round(Math.sin((2 * Math.PI * daysSinceBirthYesterday) / EMOTIONAL_PERIOD) * 100),
      intellectual: Math.round(Math.sin((2 * Math.PI * daysSinceBirthYesterday) / INTELLECTUAL_PERIOD) * 100),
    }

    // Calculate selected date values
    let selectedDateValues: BiorhythmValues | undefined
    if (selectedDate && selectedDate.getTime() !== today.getTime()) {
      selectedDateValues = {
        physical: Math.round(Math.sin((2 * Math.PI * daysSinceBirthReference) / PHYSICAL_PERIOD) * 100),
        emotional: Math.round(Math.sin((2 * Math.PI * daysSinceBirthReference) / EMOTIONAL_PERIOD) * 100),
        intellectual: Math.round(Math.sin((2 * Math.PI * daysSinceBirthReference) / INTELLECTUAL_PERIOD) * 100),
      }
    }

    // Generate chart data: 15 days before reference date to 15 days after
    const chartData = []
    for (let i = -15; i <= 15; i++) {
      const date = new Date(referenceDate)
      date.setDate(date.getDate() + i)
      const daysFromBirth = daysSinceBirthReference + i

      const isToday = date.toDateString() === today.toDateString()
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString()

      chartData.push({
        date: date.toLocaleDateString("es-ES", { month: "short", day: "numeric" }),
        physical: Math.round(Math.sin((2 * Math.PI * daysFromBirth) / PHYSICAL_PERIOD) * 100),
        emotional: Math.round(Math.sin((2 * Math.PI * daysFromBirth) / EMOTIONAL_PERIOD) * 100),
        intellectual: Math.round(Math.sin((2 * Math.PI * daysFromBirth) / INTELLECTUAL_PERIOD) * 100),
        isToday,
        isSelected,
        fullDate: new Date(date),
      })
    }

    return {
      profile,
      today: todayValues,
      yesterday: yesterdayValues,
      selectedDate: selectedDateValues,
      chartData,
    }
  })

  // Create combined chart data
  const combinedChartData = []
  for (let i = -15; i <= 15; i++) {
    const date = new Date(referenceDate)
    date.setDate(date.getDate() + i)
    
    const isToday = date.toDateString() === today.toDateString()
    const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString()

    const dataPoint: any = {
      date: date.toLocaleDateString("es-ES", { month: "short", day: "numeric" }),
      fullDate: new Date(date),
      isToday,
      isSelected,
    }

    // Add data for each person
    people.forEach(person => {
      const dayData = person.chartData.find(d => d.fullDate.toDateString() === date.toDateString())
      if (dayData) {
        // Ensure we're accessing the correct property based on comparison type
        const value = comparisonType === 'physical' ? dayData.physical :
                     comparisonType === 'emotional' ? dayData.emotional :
                     comparisonType === 'intellectual' ? dayData.intellectual : 0
        
        dataPoint[`${person.profile.id}_${comparisonType}`] = value
        dataPoint[`${person.profile.id}_name`] = person.profile.name
        dataPoint[`${person.profile.id}_color`] = person.profile.color
      }
    })

    combinedChartData.push(dataPoint)
  }

  return {
    people,
    combinedChartData,
  }
}

export function generateCombinedRecommendations(
  people: PersonBiorhythmData[],
  comparisonType: ComparisonType,
  selectedDate?: Date
): string[] {
  const recommendations: string[] = []
  const today = new Date()
  const isToday = !selectedDate || selectedDate.toDateString() === today.toDateString()
  
  const dateStr = isToday ? "hoy" : selectedDate!.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long"
  })

  // Analyze group dynamics
  const values = people.map(person => {
    const data = isToday ? person.today : person.selectedDate || person.today
    return {
      name: person.profile.name,
      value: data[comparisonType],
      color: person.profile.color
    }
  })

  const avgValue = values.reduce((sum, v) => sum + v.value, 0) / values.length
  const highPerformers = values.filter(v => v.value > 50)
  const lowPerformers = values.filter(v => v.value < -20)

  // General group analysis
  if (avgValue > 50) {
    recommendations.push(`🌟 **Excelente momento grupal para ${comparisonType}** - El grupo tiene una energía promedio de ${Math.round(avgValue)}% ${dateStr}.`)
  } else if (avgValue < -20) {
    recommendations.push(`⚠️ **Momento de cuidado grupal** - El grupo necesita atención especial en el aspecto ${comparisonType} ${dateStr} (promedio: ${Math.round(avgValue)}%).`)
  } else {
    recommendations.push(`⚖️ **Estado grupal equilibrado** - El grupo mantiene un nivel moderado en ${comparisonType} ${dateStr} (promedio: ${Math.round(avgValue)}%).`)
  }

  // Individual highlights
  if (highPerformers.length > 0) {
    const names = highPerformers.map(p => p.name).join(", ")
    recommendations.push(`🚀 **Líderes del día**: ${names} están en su mejor momento para ${comparisonType}. Pueden guiar y apoyar al resto del grupo.`)
  }

  if (lowPerformers.length > 0) {
    const names = lowPerformers.map(p => p.name).join(", ")
    recommendations.push(`🤝 **Necesitan apoyo**: ${names} podrían beneficiarse de cuidado extra en ${comparisonType}. El grupo puede brindar soporte.`)
  }

  // Specific recommendations by type
  switch (comparisonType) {
    case 'physical':
      if (avgValue > 50) {
        recommendations.push("💪 **Actividades grupales recomendadas**: Deportes en equipo, senderismo grupal, entrenamientos HIIT colectivos, o competencias amistosas.")
        recommendations.push("🏃‍♂️ **Aprovechen la energía**: Es el momento perfecto para proyectos que requieran resistencia física o actividades desafiantes.")
      } else {
        recommendations.push("🧘‍♀️ **Actividades de recuperación**: Yoga grupal, caminatas suaves, estiramientos colectivos, o sesiones de relajación.")
        recommendations.push("🛌 **Prioricen el descanso**: Planifiquen actividades de baja intensidad y asegúrense de dormir bien.")
      }
      break

    case 'emotional':
      if (avgValue > 50) {
        recommendations.push("❤️ **Momento ideal para conexión**: Conversaciones profundas, actividades creativas grupales, celebraciones, o resolver conflictos pendientes.")
        recommendations.push("🎉 **Expresen gratitud**: Compartan apreciaciones mutuas y fortalezcan los vínculos emocionales del grupo.")
      } else {
        recommendations.push("🤗 **Apoyo emocional mutuo**: Practiquen la escucha activa, eviten decisiones emocionales importantes, y brinden comprensión.")
        recommendations.push("🌸 **Actividades calmantes**: Meditación grupal, música relajante, tiempo en la naturaleza, o actividades artísticas suaves.")
      }
      break

    case 'intellectual':
      if (avgValue > 50) {
        recommendations.push("🧠 **Momento para desafíos mentales**: Brainstorming grupal, resolución de problemas complejos, aprendizaje de nuevas habilidades, o debates constructivos.")
        recommendations.push("📚 **Proyectos intelectuales**: Planificación estratégica, análisis de datos, escritura colaborativa, o investigación grupal.")
      } else {
        recommendations.push("🎨 **Actividades creativas simples**: Arte libre, música, juegos relajantes, o actividades que no requieran mucha concentración.")
        recommendations.push("📖 **Aprendizaje ligero**: Documentales interesantes, lecturas inspiradoras, o conversaciones casuales sobre temas de interés.")
      }
      break
  }

  // Timing recommendations
  if (isToday) {
    recommendations.push(`⏰ **Mejor momento del día**: ${avgValue > 50 ? "Mañana (8-11 AM) para maximizar la energía grupal" : "Tarde (2-5 PM) para actividades más relajadas"}.`)
  }

  return recommendations
}

// Predefined colors for people
export const PERSON_COLORS = [
  "#fb7185", // Pink
  "#60a5fa", // Blue  
  "#4ade80", // Green
  "#fbbf24", // Yellow
  "#a78bfa", // Purple
  "#f97316", // Orange
  "#06b6d4", // Cyan
  "#ef4444", // Red
  "#84cc16", // Lime
  "#ec4899", // Fuchsia
]

// Function to ensure all people have unique colors assigned
export function ensurePeopleHaveColors(people: ProUserProfile[]): ProUserProfile[] {
  return people.map((person, index) => {
    if (!person.color || person.color === '') {
      return {
        ...person,
        color: PERSON_COLORS[index % PERSON_COLORS.length]
      }
    }
    return person
  })
}
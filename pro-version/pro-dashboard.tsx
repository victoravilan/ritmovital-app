"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card"
import { Button } from "./components/ui/button"
import { Badge } from "./components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs"
import { Crown, Users, TrendingUp, Calendar, Sparkles, Activity, Brain, Heart } from "lucide-react"
import DateSelector from "./components/ui/date-selector"
// Removed LanguageSelector to avoid translation issues
import PeopleManager from "./components/people-manager"
import ComparisonSelector from "./components/comparison-selector"
import MultiBiorhythmChart from "./components/multi-biorhythm-chart"
import PersonDetailsCard from "./components/person-details-card"
// Removed translations import to avoid complexity
import {
  calculateMultiBiorhythms,
  generateCombinedRecommendations,
  ensurePeopleHaveColors,
  type ProUserProfile,
  type MultiBiorhythmData,
  type ComparisonType,
} from "./lib/multi-biorhythm-calculator"
import {
  calculateLunarPhase,
  calculateTimeData,
  getLunarBiorhythmRecommendations,
  type LunarData,
  type TimeData,
} from "./lib/lunar-calculator"
import {
  generateSmartRecommendations,
  type SmartRecommendation,
  type PersonalAnalysis,
} from "./lib/dynamic-recommendations"

interface ProDashboardProps {
  onBackToBasic?: () => void
  initialUser?: {
    name: string
    birthDate: string
    birthPlace: string
  }
}

export default function ProDashboard({ onBackToBasic, initialUser }: ProDashboardProps = {}) {
  const [people, setPeople] = useState<ProUserProfile[]>([])
  const [activePeople, setActivePeople] = useState<string[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [comparisonType, setComparisonType] = useState<ComparisonType>('physical')
  const [biorhythmData, setBiorhythmData] = useState<MultiBiorhythmData | null>(null)
  const [recommendations, setRecommendations] = useState<string[]>([])
  const [lunarData, setLunarData] = useState<LunarData | null>(null)
  const [timeData, setTimeData] = useState<TimeData | null>(null)
  const [lunarBiorhythmRecommendations, setLunarBiorhythmRecommendations] = useState<string[]>([])
  const [smartRecommendations, setSmartRecommendations] = useState<SmartRecommendation[]>([])

  // Load saved data and add initial user
  useEffect(() => {
    const savedPeople = localStorage.getItem("biorhythm-pro-people")
    const savedActivePeople = localStorage.getItem("biorhythm-pro-active-people")
    let loadedPeople: ProUserProfile[] = []
    let loadedActivePeople: string[] = []

    if (savedPeople) {
      loadedPeople = JSON.parse(savedPeople)
    }

    if (savedActivePeople) {
      loadedActivePeople = JSON.parse(savedActivePeople)
    }

    // Add initial user if provided and not already in the list
    if (initialUser && !loadedPeople.find(p => p.name === initialUser.name && p.birthDate === initialUser.birthDate)) {
      const initialUserProfile: ProUserProfile = {
        id: 'initial-user',
        name: initialUser.name,
        birthDate: initialUser.birthDate,
        birthPlace: initialUser.birthPlace,
        color: "#fb7185", // Pink color for initial user
      }
      loadedPeople = [initialUserProfile, ...loadedPeople]
      loadedActivePeople = ['initial-user', ...loadedActivePeople]
    }

    // Ensure all people have unique colors assigned
    const peopleWithColors = ensurePeopleHaveColors(loadedPeople)
    
    setPeople(peopleWithColors)
    setActivePeople(loadedActivePeople)
  }, [initialUser])

  // Save people data
  useEffect(() => {
    if (people.length > 0) {
      localStorage.setItem("biorhythm-pro-people", JSON.stringify(people))
    }
  }, [people])

  // Save active people data
  useEffect(() => {
    localStorage.setItem("biorhythm-pro-active-people", JSON.stringify(activePeople))
  }, [activePeople])

  // Calculate biorhythms when data changes
  useEffect(() => {
    if (people.length > 0 && activePeople.length > 0) {
      const activePeopleData = people.filter(person => activePeople.includes(person.id))
      const data = calculateMultiBiorhythms(activePeopleData, selectedDate, comparisonType)
      setBiorhythmData(data)

      const recs = generateCombinedRecommendations(data.people, comparisonType, selectedDate)
      setRecommendations(recs)

      // Calculate lunar data
      const lunar = calculateLunarPhase(selectedDate)
      setLunarData(lunar)

      // Calculate time data (use first person's birth place as reference)
      const firstPerson = activePeopleData[0]
      const time = calculateTimeData(firstPerson.birthPlace, firstPerson.birthTime)
      setTimeData(time)

      // Calculate lunar-biorhythm recommendations
      const avgBiorhythm = {
        physical: data.people.reduce((sum, p) => sum + (p.today.physical || 0), 0) / data.people.length,
        emotional: data.people.reduce((sum, p) => sum + (p.today.emotional || 0), 0) / data.people.length,
        intellectual: data.people.reduce((sum, p) => sum + (p.today.intellectual || 0), 0) / data.people.length
      }
      const lunarRecs = getLunarBiorhythmRecommendations(lunar, avgBiorhythm)
      setLunarBiorhythmRecommendations(lunarRecs)

      // Calculate smart recommendations
      const smartRecs = generateSmartRecommendations(data.people)
      setSmartRecommendations(smartRecs)
    } else {
      setBiorhythmData(null)
      setRecommendations([])
      setLunarData(null)
      setTimeData(null)
      setLunarBiorhythmRecommendations([])
      setSmartRecommendations([])
    }
  }, [people, activePeople, selectedDate, comparisonType])

  const handleDateChange = (newDate: Date) => {
    setSelectedDate(newDate)
  }

  const handlePeopleChange = (newPeople: ProUserProfile[]) => {
    setPeople(newPeople)
  }

  const handleComparisonTypeChange = (newType: ComparisonType) => {
    setComparisonType(newType)
  }

  return (
    <div className="min-h-screen relative text-white">
      {/* Background Image with Overlay */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/img/cover-ritmovital-pro.png"
          alt="RitmoVital Pro Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-purple-900/20 to-amber-900/30 backdrop-blur-sm" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 container mx-auto p-4 space-y-6">
        {/* Pro Header */}
        <div className="relative">
          {/* Back button */}
          {onBackToBasic && (
            <div className="absolute top-0 left-0 z-20">
              <Button
                onClick={onBackToBasic}
                variant="outline"
                className="bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600/50"
              >
← Versión Básica
              </Button>
            </div>
          )}

          {/* Language Selector removed to avoid translation issues */}

          <div className="text-center py-8">
            <div className="flex items-center justify-center mb-4">
              <Crown className="h-8 w-8 text-amber-400 mr-3 animate-pulse" />
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-400 bg-clip-text text-transparent drop-shadow-2xl">
RitmoVital Pro
              </h1>
              <Crown className="h-8 w-8 text-amber-400 ml-3 animate-pulse" />
            </div>
            <p className="text-xl md:text-2xl text-amber-300 drop-shadow-lg">
Comparación Avanzada de Biorritmos
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg">
                <Sparkles className="mr-2 h-4 w-4" />
Versión Profesional
              </Badge>
              <Badge variant="outline" className="border-amber-400 text-amber-400">
  Premium
              </Badge>
            </div>
          </div>
        </div>

        {/* Main Dashboard */}
        <Tabs defaultValue="comparison" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
            <TabsTrigger value="people" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Personas</span>
            </TabsTrigger>
            <TabsTrigger value="details" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Detalles</span>
            </TabsTrigger>
            <TabsTrigger value="comparison" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Comparación</span>
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">Recomendaciones</span>
            </TabsTrigger>
          </TabsList>

          {/* People Management Tab */}
          <TabsContent value="people" className="space-y-6">
            <PeopleManager
              people={people}
              onPeopleChange={handlePeopleChange}
              activePeople={activePeople}
              onActivePeopleChange={setActivePeople}
              maxPeople={3}
            />
          </TabsContent>

          {/* Details Tab - Show all cycles for each active person */}
          <TabsContent value="details" className="space-y-6">
            {activePeople.length === 0 ? (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="text-center py-12">
                  <Activity className="mx-auto h-16 w-16 text-slate-400 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
No hay personas activas
                  </h3>
                  <p className="text-slate-400 mb-4">
Selecciona personas en la pestaña "Personas" para ver sus detalles completos
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Date Selector for Details */}
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <CardTitle className="flex items-center text-lg sm:text-xl">
                        <Activity className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
Detalles Individuales
                      </CardTitle>
                      <div className="w-full sm:w-auto">
                        <DateSelector selectedDate={selectedDate} onDateChange={handleDateChange} />
                      </div>
                    </div>
                    <CardDescription className="mt-2 text-xs sm:text-sm">
Información completa de todos los ciclos para cada persona activa
                      {selectedDate.toDateString() !== new Date().toDateString() && (
                        <span className="block mt-1 text-purple-400">
Mostrando datos para: {selectedDate.toLocaleDateString("es-ES", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric"
                          })}
                        </span>
                      )}
                    </CardDescription>
                  </CardHeader>
                </Card>

                {/* Individual Person Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {biorhythmData?.people
                    .filter(personData => activePeople.includes(personData.profile.id))
                    .map((personData) => (
                      <PersonDetailsCard
                        key={personData.profile.id}
                        personData={personData}
                        selectedDate={selectedDate}
                      />
                    ))}
                </div>
              </>
            )}
          </TabsContent>

          {/* Comparison Tab */}
          <TabsContent value="comparison" className="space-y-6">
            {people.length === 0 ? (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="text-center py-12">
                  <Users className="mx-auto h-16 w-16 text-slate-400 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
No hay personas para comparar
                  </h3>
                  <p className="text-slate-400 mb-4">
Agrega al menos 2 personas en la pestaña "Personas" para comenzar la comparación
                  </p>
                </CardContent>
              </Card>
            ) : people.length === 1 ? (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="text-center py-12">
                  <TrendingUp className="mx-auto h-16 w-16 text-slate-400 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
Necesitas más personas
                  </h3>
                  <p className="text-slate-400 mb-4">
Agrega al menos una persona más para poder hacer comparaciones
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Comparison Type Selector */}
                <ComparisonSelector
                  selectedType={comparisonType}
                  onTypeChange={handleComparisonTypeChange}
                />

                {/* Chart Section */}
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <CardTitle className="flex items-center text-lg sm:text-xl">
                        <Calendar className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="hidden sm:inline">Comparación de Biorritmos (31 días)</span>
                        <span className="sm:hidden">Comparación (31 días)</span>
                      </CardTitle>
                      <div className="w-full sm:w-auto">
                        <DateSelector selectedDate={selectedDate} onDateChange={handleDateChange} />
                      </div>
                    </div>
                    <CardDescription className="mt-2 text-xs sm:text-sm">
                      <span className="block sm:inline">15 días antes y 15 días después de la fecha seleccionada.</span>
                      <span className="block sm:inline mt-1 sm:mt-0">
                        <span className="text-amber-400 ml-0 sm:ml-2">● Hoy</span>
                        {selectedDate.toDateString() !== new Date().toDateString() && (
                          <span className="text-purple-400 ml-2">● Fecha seleccionada</span>
                        )}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-2 sm:p-6">
                    {biorhythmData && (
                      <MultiBiorhythmChart
                        data={biorhythmData.combinedChartData}
                        people={people.filter(person => activePeople.includes(person.id))}
                        comparisonType={comparisonType}
                      />
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-6">
            {recommendations.length === 0 ? (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="text-center py-12">
                  <Sparkles className="mx-auto h-16 w-16 text-slate-400 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
No hay recomendaciones disponibles
                  </h3>
                  <p className="text-slate-400 mb-4">
Agrega personas y selecciona un tipo de comparación para ver recomendaciones personalizadas
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Sparkles className="mr-2 h-5 w-5 text-amber-400" />
Recomendaciones Grupales
                  </CardTitle>
                  <CardDescription>
Sugerencias personalizadas basadas en la comparación de biorritmos del grupo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recommendations.map((recommendation, index) => (
                      <div
                        key={index}
                        className="p-4 bg-slate-700/50 rounded-lg border-l-4 border-amber-400"
                      >
                        <div
                          className="text-sm text-slate-200 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: recommendation.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>') }}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Lunar Influence Section */}
        {activePeople.length > 0 && biorhythmData && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="mr-2">🌙</span>
                Influencia Lunar y Horarios Óptimos
              </CardTitle>
              <CardDescription>Análisis lunar personalizado y mejores horarios para actividades grupales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Lunar Phase Info */}
                <Card className="bg-slate-700/50">
                  <CardContent className="p-4">
                    <div className="text-center mb-4">
                      <div className="text-4xl mb-2">{lunarData?.phaseIcon || "🌙"}</div>
                      <h3 className="text-xl font-semibold text-amber-400">{lunarData?.phase || "Calculando..."}</h3>
                      <p className="text-sm text-slate-300 mt-2">{lunarData?.influence || "Analizando influencia lunar..."}</p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-300">Progreso del ciclo:</span>
                        <span className="text-sm font-semibold text-white">{lunarData?.phasePercentage || 0}%</span>
                      </div>
                      <div className="w-full bg-slate-600 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${lunarData.phasePercentage}%` }}
                        ></div>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-slate-400">
                          Próxima fase: <span className="text-amber-300">{lunarData.nextPhase}</span> en {lunarData.daysToNextPhase} días
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Optimal Times */}
                <Card className="bg-slate-700/50">
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold text-amber-400 mb-4">Horarios Óptimos Grupales</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center mb-2">
                          <Activity className="h-4 w-4 text-orange-400 mr-2" />
                          <span className="text-sm font-semibold text-orange-400">Actividad Física</span>
                        </div>
                        <div className="text-xs text-slate-300 ml-6">
                          {timeData.bestTimes.physical.join(" • ")}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center mb-2">
                          <Heart className="h-4 w-4 text-blue-400 mr-2" />
                          <span className="text-sm font-semibold text-blue-400">Conexión Emocional</span>
                        </div>
                        <div className="text-xs text-slate-300 ml-6">
                          {timeData.bestTimes.emotional.join(" • ")}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center mb-2">
                          <Brain className="h-4 w-4 text-green-400 mr-2" />
                          <span className="text-sm font-semibold text-green-400">Trabajo Intelectual</span>
                        </div>
                        <div className="text-xs text-slate-300 ml-6">
                          {timeData.bestTimes.intellectual.join(" • ")}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-600">
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-slate-400">Hora actual:</span>
                          <div className="text-white font-semibold">{timeData.currentTime}</div>
                        </div>
                        <div>
                          <span className="text-slate-400">Zona horaria:</span>
                          <div className="text-white font-semibold">{timeData.timezone}</div>
                        </div>
                        <div>
                          <span className="text-slate-400">Amanecer:</span>
                          <div className="text-white font-semibold">{timeData.sunrise}</div>
                        </div>
                        <div>
                          <span className="text-slate-400">Atardecer:</span>
                          <div className="text-white font-semibold">{timeData.sunset}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Lunar Recommendations */}
              <Card className="bg-slate-700/50 mt-6">
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold text-amber-400 mb-4">Recomendaciones Lunares Personalizadas</h3>
                  <div className="space-y-3">
                    {lunarBiorhythmRecommendations.map((recommendation, index) => (
                      <div
                        key={index}
                        className="p-3 bg-slate-600/50 rounded-lg border-l-4 border-purple-400"
                      >
                        <div
                          className="text-sm text-slate-200 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: recommendation.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>') }}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        )}

        {/* Detailed Recommendations Section */}
        {activePeople.length > 0 && biorhythmData && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle>Recomendaciones Detalladas Grupales</CardTitle>
              <CardDescription>Consejos personalizados basados en el estado grupal y perfiles individuales</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="nutrition" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-slate-700">
                  <TabsTrigger value="nutrition" className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    Nutrición
                  </TabsTrigger>
                  <TabsTrigger value="exercise" className="flex items-center gap-1">
                    <Activity className="h-4 w-4" />
                    Ejercicio
                  </TabsTrigger>
                  <TabsTrigger value="creativity" className="flex items-center gap-1">
                    <Brain className="h-4 w-4" />
                    Creatividad
                  </TabsTrigger>
                  <TabsTrigger value="wellness" className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    Bienestar
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="nutrition" className="mt-4">
                  {smartRecommendations.find(rec => rec.category === 'nutrition') ? (
                    <div className="space-y-6">
                      {(() => {
                        const nutritionRec = smartRecommendations.find(rec => rec.category === 'nutrition')!
                        return (
                          <>
                            {/* Header with Group Dynamics */}
                            <div className="mb-6">
                              <h3 className="text-lg font-semibold text-amber-400 mb-3">{nutritionRec.title}</h3>
                              <div className="p-4 bg-slate-700/30 rounded-lg border-l-4 border-amber-400">
                                <p className="text-sm text-slate-200 font-medium">🍽️ Estrategia Grupal:</p>
                                <p className="text-sm text-slate-300 mt-1">{nutritionRec.groupDynamics}</p>
                              </div>
                            </div>

                            {/* Individual Profiles */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                              {nutritionRec.individualProfiles.map((person, index) => (
                                <Card key={person.personId} className="bg-slate-700/50 border-l-4" style={{borderLeftColor: `hsl(${index * 120}, 70%, 60%)`}}>
                                  <CardContent className="p-4">
                                    <h4 className="font-semibold mb-2 text-white flex items-center">
                                      <div className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: `hsl(${index * 120}, 70%, 60%)`}}></div>
                                      {person.personName}
                                    </h4>
                                    <p className="text-xs text-slate-300 mb-3">{person.physical.energyLevel}</p>
                                    <div className="space-y-1">
                                      {nutritionRec.intelligentFusion.personalizedTips[person.personId]?.slice(1, 3).map((tip, tipIndex) => (
                                        <p key={tipIndex} className="text-xs text-slate-200 leading-relaxed">• {tip}</p>
                                      ))}
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>

                            {/* Intelligent Fusion Strategy */}
                            <Card className="bg-slate-700/50">
                              <CardContent className="p-4">
                                <h4 className="font-semibold mb-3 text-white">🧠 Estrategia de Fusión Inteligente</h4>
                                <div className="space-y-3">
                                  {nutritionRec.intelligentFusion.adaptations.map((adaptation, index) => (
                                    <div key={index} className="p-3 bg-slate-600/50 rounded-lg">
                                      <div 
                                        className="text-sm text-slate-200 leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: adaptation.replace(/\*\*(.*?)\*\*/g, '<strong class="text-amber-300">$1</strong>') }}
                                      />
                                    </div>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>

                            {/* Shared Activities */}
                            {nutritionRec.intelligentFusion.sharedActivities.length > 0 && (
                              <Card className="bg-slate-700/50">
                                <CardContent className="p-4">
                                  <h4 className="font-semibold mb-3 text-white">👥 Actividades Compartidas</h4>
                                  <div className="space-y-2">
                                    {nutritionRec.intelligentFusion.sharedActivities.map((activity, index) => (
                                      <p key={index} className="text-sm text-slate-200 leading-relaxed">• {activity}</p>
                                    ))}
                                  </div>
                                </CardContent>
                              </Card>
                            )}
                          </>
                        )
                      })()}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-slate-400">Agregue personas para ver recomendaciones nutricionales inteligentes</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="exercise" className="mt-4">
                  {smartRecommendations.find(rec => rec.category === 'exercise') ? (
                    <div className="space-y-6">
                      {(() => {
                        const exerciseRec = smartRecommendations.find(rec => rec.category === 'exercise')!
                        return (
                          <>
                            {/* Header with Group Dynamics */}
                            <div className="mb-6">
                              <h3 className="text-lg font-semibold text-amber-400 mb-3">{exerciseRec.title}</h3>
                              <div className="p-4 bg-slate-700/30 rounded-lg border-l-4 border-orange-400">
                                <p className="text-sm text-slate-200 font-medium">🏃‍♂️ Estrategia Grupal:</p>
                                <p className="text-sm text-slate-300 mt-1">{exerciseRec.groupDynamics}</p>
                              </div>
                            </div>

                            {/* Individual Profiles */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                              {exerciseRec.individualProfiles.map((person, index) => (
                                <Card key={person.personId} className="bg-slate-700/50 border-l-4" style={{borderLeftColor: `hsl(${index * 120}, 70%, 60%)`}}>
                                  <CardContent className="p-4">
                                    <h4 className="font-semibold mb-2 text-white flex items-center">
                                      <div className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: `hsl(${index * 120}, 70%, 60%)`}}></div>
                                      {person.personName}
                                    </h4>
                                    <p className="text-xs text-slate-300 mb-3">{person.physical.energyLevel}</p>
                                    <div className="space-y-1">
                                      {exerciseRec.intelligentFusion.personalizedTips[person.personId]?.slice(1, 3).map((tip, tipIndex) => (
                                        <p key={tipIndex} className="text-xs text-slate-200 leading-relaxed">• {tip}</p>
                                      ))}
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>

                            {/* Intelligent Fusion Strategy */}
                            <Card className="bg-slate-700/50">
                              <CardContent className="p-4">
                                <h4 className="font-semibold mb-3 text-white">🏋️‍♂️ Programa Adaptativo Inteligente</h4>
                                <div className="space-y-3">
                                  {exerciseRec.intelligentFusion.adaptations.map((adaptation, index) => (
                                    <div key={index} className="p-3 bg-slate-600/50 rounded-lg">
                                      <div 
                                        className="text-sm text-slate-200 leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: adaptation.replace(/\*\*(.*?)\*\*/g, '<strong class="text-orange-300">$1</strong>') }}
                                      />
                                    </div>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>

                            {/* Shared Activities */}
                            {exerciseRec.intelligentFusion.sharedActivities.length > 0 && (
                              <Card className="bg-slate-700/50">
                                <CardContent className="p-4">
                                  <h4 className="font-semibold mb-3 text-white">👥 Actividades Físicas Compartidas</h4>
                                  <div className="space-y-2">
                                    {exerciseRec.intelligentFusion.sharedActivities.map((activity, index) => (
                                      <p key={index} className="text-sm text-slate-200 leading-relaxed">• {activity}</p>
                                    ))}
                                  </div>
                                </CardContent>
                              </Card>
                            )}
                          </>
                        )
                      })()}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-slate-400">Agregue personas para ver recomendaciones de ejercicio inteligentes</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="creativity" className="mt-4">
                  {smartRecommendations.find(rec => rec.category === 'creativity') ? (
                    <div className="space-y-6">
                      {(() => {
                        const creativityRec = smartRecommendations.find(rec => rec.category === 'creativity')!
                        return (
                          <>
                            {/* Header with Group Dynamics */}
                            <div className="mb-6">
                              <h3 className="text-lg font-semibold text-amber-400 mb-3">{creativityRec.title}</h3>
                              <div className="p-4 bg-slate-700/30 rounded-lg border-l-4 border-purple-400">
                                <p className="text-sm text-slate-200 font-medium">🎨 Estrategia Grupal:</p>
                                <p className="text-sm text-slate-300 mt-1">{creativityRec.groupDynamics}</p>
                              </div>
                            </div>

                            {/* Individual Profiles */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                              {creativityRec.individualProfiles.map((person, index) => (
                                <Card key={person.personId} className="bg-slate-700/50 border-l-4" style={{borderLeftColor: `hsl(${index * 120}, 70%, 60%)`}}>
                                  <CardContent className="p-4">
                                    <h4 className="font-semibold mb-2 text-white flex items-center">
                                      <div className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: `hsl(${index * 120}, 70%, 60%)`}}></div>
                                      {person.personName}
                                    </h4>
                                    <p className="text-xs text-slate-300 mb-3">{person.intellectual.mentalCapacity}</p>
                                    <div className="space-y-1">
                                      {creativityRec.intelligentFusion.personalizedTips[person.personId]?.slice(1, 3).map((tip, tipIndex) => (
                                        <p key={tipIndex} className="text-xs text-slate-200 leading-relaxed">• {tip}</p>
                                      ))}
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>

                            {/* Intelligent Fusion Strategy */}
                            <Card className="bg-slate-700/50">
                              <CardContent className="p-4">
                                <h4 className="font-semibold mb-3 text-white">🧠 Proyectos Creativos Inteligentes</h4>
                                <div className="space-y-3">
                                  {creativityRec.intelligentFusion.adaptations.map((adaptation, index) => (
                                    <div key={index} className="p-3 bg-slate-600/50 rounded-lg">
                                      <div 
                                        className="text-sm text-slate-200 leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: adaptation.replace(/\*\*(.*?)\*\*/g, '<strong class="text-purple-300">$1</strong>') }}
                                      />
                                    </div>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>

                            {/* Shared Activities */}
                            {creativityRec.intelligentFusion.sharedActivities.length > 0 && (
                              <Card className="bg-slate-700/50">
                                <CardContent className="p-4">
                                  <h4 className="font-semibold mb-3 text-white">👥 Proyectos Colaborativos</h4>
                                  <div className="space-y-2">
                                    {creativityRec.intelligentFusion.sharedActivities.map((activity, index) => (
                                      <p key={index} className="text-sm text-slate-200 leading-relaxed">• {activity}</p>
                                    ))}
                                  </div>
                                </CardContent>
                              </Card>
                            )}
                          </>
                        )
                      })()}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-slate-400">Agregue personas para ver recomendaciones creativas inteligentes</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="wellness" className="mt-4">
                  {smartRecommendations.find(rec => rec.category === 'wellness') ? (
                    <div className="space-y-6">
                      {(() => {
                        const wellnessRec = smartRecommendations.find(rec => rec.category === 'wellness')!
                        return (
                          <>
                            {/* Header with Group Dynamics */}
                            <div className="mb-6">
                              <h3 className="text-lg font-semibold text-amber-400 mb-3">{wellnessRec.title}</h3>
                              <div className="p-4 bg-slate-700/30 rounded-lg border-l-4 border-green-400">
                                <p className="text-sm text-slate-200 font-medium">💚 Estrategia Grupal:</p>
                                <p className="text-sm text-slate-300 mt-1">{wellnessRec.groupDynamics}</p>
                              </div>
                            </div>

                            {/* Individual Profiles */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                              {wellnessRec.individualProfiles.map((person, index) => (
                                <Card key={person.personId} className="bg-slate-700/50 border-l-4" style={{borderLeftColor: `hsl(${index * 120}, 70%, 60%)`}}>
                                  <CardContent className="p-4">
                                    <h4 className="font-semibold mb-2 text-white flex items-center">
                                      <div className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: `hsl(${index * 120}, 70%, 60%)`}}></div>
                                      {person.personName}
                                    </h4>
                                    <p className="text-xs text-slate-300 mb-3">{person.emotional.moodDescription}</p>
                                    <div className="space-y-1">
                                      {wellnessRec.intelligentFusion.personalizedTips[person.personId]?.slice(1, 3).map((tip, tipIndex) => (
                                        <p key={tipIndex} className="text-xs text-slate-200 leading-relaxed">• {tip}</p>
                                      ))}
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>

                            {/* Intelligent Fusion Strategy */}
                            <Card className="bg-slate-700/50">
                              <CardContent className="p-4">
                                <h4 className="font-semibold mb-3 text-white">🧘‍♀️ Bienestar Emocional Inteligente</h4>
                                <div className="space-y-3">
                                  {wellnessRec.intelligentFusion.adaptations.map((adaptation, index) => (
                                    <div key={index} className="p-3 bg-slate-600/50 rounded-lg">
                                      <div 
                                        className="text-sm text-slate-200 leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: adaptation.replace(/\*\*(.*?)\*\*/g, '<strong class="text-green-300">$1</strong>') }}
                                      />
                                    </div>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>

                            {/* Shared Activities */}
                            {wellnessRec.intelligentFusion.sharedActivities.length > 0 && (
                              <Card className="bg-slate-700/50">
                                <CardContent className="p-4">
                                  <h4 className="font-semibold mb-3 text-white">👥 Actividades de Bienestar Compartidas</h4>
                                  <div className="space-y-2">
                                    {wellnessRec.intelligentFusion.sharedActivities.map((activity, index) => (
                                      <p key={index} className="text-sm text-slate-200 leading-relaxed">• {activity}</p>
                                    ))}
                                  </div>
                                </CardContent>
                              </Card>
                            )}
                          </>
                        )
                      })()}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-slate-400">Agregue personas para ver recomendaciones de bienestar inteligentes</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        {/* Footer Credit */}
        <div className="text-center py-4">
          <p className="text-xs text-slate-400">
RitmoVital Pro • Creado por Victor M.F. Avilan
          </p>
        </div>
      </div>
    </div>
  )
}
"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Crown, Users, TrendingUp, Calendar, Sparkles } from "lucide-react"
import DateSelector from "@/components/ui/date-selector"
import PeopleManager from "./components/people-manager"
import ComparisonSelector from "./components/comparison-selector"
import MultiBiorhythmChart from "./components/multi-biorhythm-chart"
import {
  calculateMultiBiorhythms,
  generateCombinedRecommendations,
  type ProUserProfile,
  type MultiBiorhythmData,
  type ComparisonType,
} from "./lib/multi-biorhythm-calculator"

interface ProDashboardProps {
  onBackToBasic?: () => void
}

export default function ProDashboard({ onBackToBasic }: ProDashboardProps = {}) {
  const [people, setPeople] = useState<ProUserProfile[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [comparisonType, setComparisonType] = useState<ComparisonType>('physical')
  const [biorhythmData, setBiorhythmData] = useState<MultiBiorhythmData | null>(null)
  const [recommendations, setRecommendations] = useState<string[]>([])

  // Load saved data
  useEffect(() => {
    const savedPeople = localStorage.getItem("biorhythm-pro-people")
    if (savedPeople) {
      setPeople(JSON.parse(savedPeople))
    }
  }, [])

  // Save people data
  useEffect(() => {
    if (people.length > 0) {
      localStorage.setItem("biorhythm-pro-people", JSON.stringify(people))
    }
  }, [people])

  // Calculate biorhythms when data changes
  useEffect(() => {
    if (people.length > 0) {
      const data = calculateMultiBiorhythms(people, selectedDate, comparisonType)
      setBiorhythmData(data)
      
      const recs = generateCombinedRecommendations(data.people, comparisonType, selectedDate)
      setRecommendations(recs)
    } else {
      setBiorhythmData(null)
      setRecommendations([])
    }
  }, [people, selectedDate, comparisonType])

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
          src="/img/cover-ritmovital.png"
          alt="RitmoVital Pro Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 container mx-auto p-4 space-y-6">
        {/* Pro Header */}
        <div className="relative">
          {/* Back button */}
          {onBackToBasic && (
            <div className="absolute top-0 left-0">
              <Button
                onClick={onBackToBasic}
                variant="outline"
                className="bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600/50"
              >
                ← Versión Básica
              </Button>
            </div>
          )}
          
          <div className="text-center py-8">
            <div className="flex items-center justify-center mb-4">
              <Crown className="h-8 w-8 text-amber-400 mr-3" />
              <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-2xl">
                RitmoVital Pro
              </h1>
              <Crown className="h-8 w-8 text-amber-400 ml-3" />
            </div>
            <p className="text-xl md:text-2xl text-amber-300 drop-shadow-lg">
              Comparación Avanzada de Biorritmos
            </p>
            <Badge className="mt-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
              <Sparkles className="mr-2 h-4 w-4" />
              Versión Profesional
            </Badge>
          </div>
        </div>

        {/* Main Dashboard */}
        <Tabs defaultValue="comparison" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
            <TabsTrigger value="people" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Personas</span>
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
              maxPeople={3}
            />
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
                        people={people}
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
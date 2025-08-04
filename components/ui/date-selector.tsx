"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react"

interface DateSelectorProps {
  selectedDate: Date
  onDateChange: (date: Date) => void
}

export default function DateSelector({ selectedDate, onDateChange }: DateSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i)
  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ]
  
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }
  
  const handleDateChange = (year: number, month: number, day: number) => {
    const newDate = new Date(year, month, day)
    onDateChange(newDate)
    setIsOpen(false)
  }
  
  const goToToday = () => {
    onDateChange(new Date())
    setIsOpen(false)
  }
  
  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate)
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1)
    } else {
      newDate.setDate(newDate.getDate() + 1)
    }
    onDateChange(newDate)
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateDate('prev')}
          className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600 min-w-[200px]"
        >
          <Calendar className="mr-2 h-4 w-4" />
          {selectedDate.toLocaleDateString("es-ES", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateDate('next')}
          className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={goToToday}
          className="bg-amber-600 border-amber-500 text-white hover:bg-amber-500"
        >
          Hoy
        </Button>
      </div>

      {isOpen && (
        <Card className="absolute top-full left-0 mt-2 z-50 bg-slate-800 border-slate-600">
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">Año</label>
                <Select
                  value={selectedDate.getFullYear().toString()}
                  onValueChange={(value) => {
                    const year = parseInt(value)
                    handleDateChange(year, selectedDate.getMonth(), selectedDate.getDate())
                  }}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()} className="text-white hover:bg-slate-600">
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">Mes</label>
                <Select
                  value={selectedDate.getMonth().toString()}
                  onValueChange={(value) => {
                    const month = parseInt(value)
                    const maxDay = getDaysInMonth(selectedDate.getFullYear(), month)
                    const day = Math.min(selectedDate.getDate(), maxDay)
                    handleDateChange(selectedDate.getFullYear(), month, day)
                  }}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    {months.map((month, index) => (
                      <SelectItem key={index} value={index.toString()} className="text-white hover:bg-slate-600">
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">Día</label>
              <div className="grid grid-cols-7 gap-1 max-h-48 overflow-y-auto">
                {Array.from({ length: getDaysInMonth(selectedDate.getFullYear(), selectedDate.getMonth()) }, (_, i) => i + 1).map((day) => (
                  <Button
                    key={day}
                    variant={day === selectedDate.getDate() ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleDateChange(selectedDate.getFullYear(), selectedDate.getMonth(), day)}
                    className={`h-8 w-8 p-0 text-xs ${
                      day === selectedDate.getDate()
                        ? "bg-amber-600 hover:bg-amber-500"
                        : "bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                    }`}
                  >
                    {day}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
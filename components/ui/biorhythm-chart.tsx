"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, TooltipProps } from "recharts"

interface ChartDataPoint {
  date: string
  physical: number
  emotional: number
  intellectual: number
  isToday?: boolean
}

interface BiorhythmChartProps {
  data: ChartDataPoint[]
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-lg">
        <p className="text-white font-semibold mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={`tooltip-item-${index}`} style={{ color: entry.color }} className="text-sm">
            {entry.name}: {entry.value}%
          </p>
        ))}
      </div>
    )
  }
  return null
}

const CustomDot = (props: any) => {
  const { cx, cy, payload } = props
  if (payload && payload.isToday) {
    return <circle cx={cx} cy={cy} r={6} fill="#fbbf24" stroke="#f59e0b" strokeWidth={2} />
  }
  return <circle cx={cx} cy={cy} r={0} />
}

export default function BiorhythmChart({ data }: BiorhythmChartProps) {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
          <YAxis domain={[-100, 100]} stroke="#9ca3af" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={0} stroke="#6b7280" strokeDasharray="2 2" />
          <ReferenceLine y={50} stroke="#4b5563" strokeDasharray="1 1" />
          <ReferenceLine y={-50} stroke="#4b5563" strokeDasharray="1 1" />

          <Line
            type="monotone"
            dataKey="physical"
            stroke="#fb7185"
            strokeWidth={3}
            name="Físico"            
            dot={CustomDot}
            activeDot={{ r: 4, fill: "#fb7185" }}
          />
          <Line
            type="monotone"
            dataKey="emotional"
            stroke="#60a5fa"
            strokeWidth={3}            
            name="Emocional"
            dot={CustomDot}
            activeDot={{ r: 4, fill: "#60a5fa" }}
          />
          <Line
            type="monotone"
            dataKey="intellectual"
            stroke="#4ade80"
            strokeWidth={3}            
            name="Intelectual"
            dot={CustomDot}
            activeDot={{ r: 4, fill: "#4ade80" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Gauge, AlertTriangle, CheckCircle2, Clock } from "lucide-react"

interface StatisticsGridProps {
  systemStatus?: {
    status: string
    total_records: number
    model_trained: boolean
  } | null
  metricsCount: number
  anomaliesCount: number
  loading?: boolean
}

function AnimatedCounter({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    if (value === 0) {
      setDisplayValue(0)
      return
    }

    let currentValue = 0
    const increment = Math.ceil(value / 30)
    const interval = setInterval(() => {
      currentValue += increment
      if (currentValue >= value) {
        setDisplayValue(value)
        clearInterval(interval)
      } else {
        setDisplayValue(currentValue)
      }
    }, 30)

    return () => clearInterval(interval)
  }, [value])

  return <span>{displayValue.toLocaleString()}</span>
}

export default function StatisticsGrid({ systemStatus, metricsCount, anomaliesCount, loading }: StatisticsGridProps) {
  const stats = [
    {
      id: "records",
      label: "Total Records",
      value: systemStatus?.total_records || 0,
      icon: Gauge,
      color: "from-blue-600 to-blue-700",
      bgColor: "rgb(59, 130, 246)",
      borderColor: "border-blue-500/20",
    },
    {
      id: "anomalies",
      label: "Anomalies Detected",
      value: anomaliesCount,
      icon: AlertTriangle,
      color: anomaliesCount > 0 ? "from-red-600 to-red-700" : "from-gray-600 to-gray-700",
      bgColor: anomaliesCount > 0 ? "rgb(239, 68, 68)" : "rgb(107, 114, 128)",
      borderColor: anomaliesCount > 0 ? "border-red-500/20 glow-red" : "border-gray-500/20",
      glow: anomaliesCount > 0,
    },
    {
      id: "model",
      label: "Model Status",
      value: systemStatus?.model_trained ? "Trained" : "Not Trained",
      icon: CheckCircle2,
      color: systemStatus?.model_trained ? "from-green-600 to-green-700" : "from-yellow-600 to-yellow-700",
      bgColor: systemStatus?.model_trained ? "rgb(16, 185, 129)" : "rgb(245, 158, 11)",
      borderColor: systemStatus?.model_trained ? "border-green-500/20" : "border-yellow-500/20",
    },
    {
      id: "lastUpdated",
      label: "Last Updated",
      value: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      icon: Clock,
      color: "from-purple-600 to-purple-700",
      bgColor: "rgb(139, 92, 246)",
      borderColor: "border-purple-500/20",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => {
        const Icon = stat.icon
        const isNumber = typeof stat.value === "number"

        return (
          <Card
            key={stat.id}
            className={`relative overflow-hidden border-white/10 bg-black/40 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-black/60 group floating ${stat.glow ? "glow-red" : ""}`}
          >
            {/* Gradient background */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                backgroundColor: `rgba(${stat.bgColor.match(/\d+/g)?.join(", ")}, 0.1)`,
              }}
            />

            {/* Content */}
            <div className="relative z-10">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {loading ? (
                  <div className="h-8 bg-white/10 rounded animate-pulse" />
                ) : (
                  <div className="text-3xl font-bold text-white">
                    {isNumber ? <AnimatedCounter value={stat.value as number} /> : stat.value}
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  {stat.id === "anomalies" && anomaliesCount > 0 ? "⚠️ Alerts active" : "Active"}
                </p>
              </CardContent>
            </div>
          </Card>
        )
      })}
    </div>
  )
}

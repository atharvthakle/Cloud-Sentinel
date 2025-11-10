"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle2, AlertCircle } from "lucide-react"

interface Metric {
  timestamp: string
  instance_id: string
  cpu_usage: number
  memory_usage: number
  network_traffic: number
}

interface AnomaliesSectionProps {
  anomalies: Metric[]
  loading?: boolean
}

export default function AnomaliesSection({ anomalies, loading }: AnomaliesSectionProps) {
  const isHigh = (value: number) => value > 80
  const isWarning = (value: number) => value > 60 && value <= 80

  if (loading) {
    return (
      <Card className="border-white/10 bg-black/40 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <AlertTriangle className="w-5 h-5" />
            Detected Anomalies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-24 bg-white/5 rounded-lg animate-pulse" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-white/10 bg-black/40 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <AlertTriangle className="w-5 h-5" />
          Detected Anomalies
        </CardTitle>
      </CardHeader>
      <CardContent>
        {anomalies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CheckCircle2 className="w-12 h-12 text-green-500 mb-3" />
            <p className="text-lg font-semibold text-white mb-1">All Clear!</p>
            <p className="text-sm text-muted-foreground">No anomalies detected in your system</p>
          </div>
        ) : (
          <div className="space-y-3">
            {anomalies.map((anomaly, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg border-l-4 border-red-500 bg-red-950/20 backdrop-blur-sm hover:bg-red-950/30 transition-all duration-300 slide-in glow-red group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-white flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      {anomaly.instance_id}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{new Date(anomaly.timestamp).toLocaleString()}</p>
                  </div>
                </div>

                {/* Metrics Badges */}
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge
                    variant="outline"
                    className={`${
                      isHigh(anomaly.cpu_usage)
                        ? "border-red-500/50 bg-red-950/30 text-red-300"
                        : isWarning(anomaly.cpu_usage)
                          ? "border-yellow-500/50 bg-yellow-950/30 text-yellow-300"
                          : "border-gray-500/50 bg-gray-950/30 text-gray-300"
                    }`}
                  >
                    CPU: {anomaly.cpu_usage.toFixed(1)}%
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`${
                      isHigh(anomaly.memory_usage)
                        ? "border-red-500/50 bg-red-950/30 text-red-300"
                        : isWarning(anomaly.memory_usage)
                          ? "border-yellow-500/50 bg-yellow-950/30 text-yellow-300"
                          : "border-gray-500/50 bg-gray-950/30 text-gray-300"
                    }`}
                  >
                    Memory: {anomaly.memory_usage.toFixed(1)}%
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`${
                      isHigh(anomaly.network_traffic)
                        ? "border-red-500/50 bg-red-950/30 text-red-300"
                        : isWarning(anomaly.network_traffic)
                          ? "border-yellow-500/50 bg-yellow-950/30 text-yellow-300"
                          : "border-gray-500/50 bg-gray-950/30 text-gray-300"
                    }`}
                  >
                    Network: {anomaly.network_traffic.toFixed(1)}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

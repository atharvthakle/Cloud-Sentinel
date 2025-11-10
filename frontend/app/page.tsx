"use client"

import { useEffect, useState } from "react"
import { Toaster, toast } from "sonner"
import Navigation from "@/components/navigation"
import ActionPanel from "@/components/action-panel"
import StatisticsGrid from "@/components/statistics-grid"
import ChartsSection from "@/components/charts-section"
import AnomaliesSection from "@/components/anomalies-section"

interface SystemStatus {
  status: string
  total_records: number
  model_trained: boolean
}

interface Metric {
  timestamp: string
  instance_id: string
  cpu_usage: number
  memory_usage: number
  network_traffic: number
}

interface ApiResponse {
  data?: SystemStatus | Metric[] | any
  error?: string
}

export default function Dashboard() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null)
  const [metrics, setMetrics] = useState<Metric[]>([])
  const [anomalies, setAnomalies] = useState<Metric[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const API_BASE = "http://127.0.0.1:5000"

  const fetchStatus = async () => {
  try {
    const response = await fetch(`${API_BASE}/status`)
    const result = await response.json()
    if (result.status === 'success') {
      setSystemStatus(result.data)
    }
  } catch (error) {
    console.error("Failed to fetch status:", error)
  }
}

const fetchMetrics = async () => {
  try {
    const response = await fetch(`${API_BASE}/metrics`)
    const result = await response.json()
    if (result.status === 'success') {
      setMetrics(result.metrics || [])
    }
  } catch (error) {
    console.error("Failed to fetch metrics:", error)
  }
}

const fetchAnomalies = async () => {
  try {
    const response = await fetch(`${API_BASE}/anomalies`)
    const result = await response.json()
    if (result.status === 'success') {
      setAnomalies(result.anomalies || [])
    }
  } catch (error) {
    console.error("Failed to fetch anomalies:", error)
  }
}

  const loadAllData = async () => {
    try {
      setRefreshing(true)
      await Promise.all([fetchStatus(), fetchMetrics(), fetchAnomalies()])
    } finally {
      setRefreshing(false)
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAllData()
    const interval = setInterval(loadAllData, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleActionSuccess = (message: string) => {
    toast.success(message)
    loadAllData()
  }

  const handleActionError = (message: string) => {
    toast.error(message)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-950 animated-bg">
      <Toaster position="top-right" richColors />

      <Navigation systemStatus={systemStatus} />

      <main className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        <ActionPanel onSuccess={handleActionSuccess} onError={handleActionError} isLoading={refreshing} />

        <StatisticsGrid
          systemStatus={systemStatus}
          metricsCount={metrics.length}
          anomaliesCount={anomalies.length}
          loading={loading}
        />

        <ChartsSection metrics={metrics} loading={loading} />

        <AnomaliesSection anomalies={anomalies} loading={loading} />
      </main>
    </div>
  )
}

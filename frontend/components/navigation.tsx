"use client"

import { useEffect, useState } from "react"
import { Shield } from "lucide-react"

interface NavigationProps {
  systemStatus?: {
    status: string
    total_records: number
    model_trained: boolean
  } | null
}

export default function Navigation({ systemStatus }: NavigationProps) {
  const [currentTime, setCurrentTime] = useState("")

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      )
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  const isHealthy = systemStatus?.status === "healthy"

  return (
    <nav className="relative z-20 border-b border-white/10 bg-black/40 backdrop-blur-xl sticky top-0">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-600 to-purple-700 glow-purple">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">
                Cloud Sentinel
              </h1>
              <p className="text-xs text-muted-foreground">Security Monitoring</p>
            </div>
          </div>

          {/* Right side info */}
          <div className="flex items-center gap-6">
            {/* Status Indicator */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
              <div
                className={`w-3 h-3 rounded-full ${isHealthy ? "bg-green-500 pulse-glow" : "bg-yellow-500 pulse-glow"}`}
              />
              <span className="text-sm font-medium">{isHealthy ? "System Healthy" : "System Warning"}</span>
            </div>

            {/* Time */}
            <div className="text-sm font-mono text-muted-foreground">{currentTime}</div>
          </div>
        </div>
      </div>
    </nav>
  )
}

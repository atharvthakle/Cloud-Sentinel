"use client"

import { useState } from "react"
import { Database, Brain, Search, RotateCw, Trash2, Loader2 } from "lucide-react"

interface ActionPanelProps {
  onSuccess: (message: string) => void
  onError: (message: string) => void
  isLoading?: boolean
}

export default function ActionPanel({ onSuccess, onError, isLoading }: ActionPanelProps) {
  const [loading, setLoading] = useState<Record<string, boolean>>({})

  const API_BASE = "http://127.0.0.1:5000"

  const handleAction = async (action: string, endpoint: string) => {
  setLoading((prev) => ({ ...prev, [action]: true }))
  try {
    const body = action === "collect" ? JSON.stringify({ num_collections: 5 }) : undefined

    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body,
    })

    const result = await response.json()

    if (result.status !== 'success') {
      throw new Error(result.message || `${action} failed`)
    }

    if (action === "collect") {
      onSuccess(`✅ ${result.message}`)
    } else if (action === "train") {
      onSuccess(`✅ ${result.message}`)
    } else if (action === "detect") {
      onSuccess(`✅ Found ${result.anomalies_found || 0} anomalies`)
    } else if (action === "clear") {
      onSuccess("✅ All data cleared")
    }
  } catch (error: any) {
    onError(`❌ Failed to ${action}: ${error.message}`)
    console.error(error)
  } finally {
    setLoading((prev) => ({ ...prev, [action]: false }))
  }
}

  const buttons = [
    {
      id: "collect",
      label: "Collect Data",
      icon: Database,
      color: "from-blue-600 to-blue-700",
      glowColor: "glow-blue",
    },
    {
      id: "train",
      label: "Train Model",
      icon: Brain,
      color: "from-purple-600 to-purple-700",
      glowColor: "glow-purple",
    },
    {
      id: "detect",
      label: "Detect Anomalies",
      icon: Search,
      color: "from-orange-600 to-orange-700",
      glowColor: "glow-orange",
    },
    {
      id: "refresh",
      label: "Refresh",
      icon: RotateCw,
      color: "from-cyan-600 to-cyan-700",
      glowColor: "glow-cyan",
      isLoading: isLoading,
    },
    {
      id: "clear",
      label: "Clear All",
      icon: Trash2,
      color: "from-red-600 to-red-700",
      glowColor: "glow-red",
      destructive: true,
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
      {buttons.map((btn) => {
        const Icon = btn.icon
        const isLoading = loading[btn.id] || btn.isLoading

        return (
          <button
            key={btn.id}
            onClick={() => {
              if (btn.id === "refresh") {
                window.location.reload()
              } else {
                handleAction(btn.id, `/${btn.id}`)
              }
            }}
            disabled={isLoading}
            className={`relative group px-4 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 text-white overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed
              ${btn.destructive ? "border border-red-500/30 hover:border-red-500/60 bg-gradient-to-r from-red-950 to-red-900 hover:from-red-900 hover:to-red-800" : `border border-white/10 hover:border-white/20 bg-gradient-to-r ${btn.color}`}
              ${isLoading ? btn.glowColor : ""}`}
          >
            <span className="relative z-10 flex items-center gap-2">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Icon className="w-4 h-4" />}
              <span className="text-xs md:text-sm">{btn.label}</span>
            </span>
          </button>
        )
      })}
    </div>
  )
}

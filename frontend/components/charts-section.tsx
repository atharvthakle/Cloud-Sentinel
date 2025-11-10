"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface Metric {
  timestamp: string
  instance_id: string
  cpu_usage: number
  memory_usage: number
  network_traffic: number
}

interface ChartsSectionProps {
  metrics: Metric[]
  loading?: boolean
}

const ChartSkeleton = () => <div className="w-full h-72 bg-white/5 rounded-lg animate-pulse" />

export default function ChartsSection({ metrics, loading }: ChartsSectionProps) {
  // Process metrics for line charts
  const chartData = metrics.slice(-12).map((m) => ({
    time: new Date(m.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    cpu: Math.round(m.cpu_usage * 100) / 100,
    memory: Math.round(m.memory_usage * 100) / 100,
    network: Math.round(m.network_traffic * 100) / 100,
  }))

  // Calculate averages
  const avgMetrics =
    metrics.length > 0
      ? {
          cpu: Math.round((metrics.reduce((sum, m) => sum + m.cpu_usage, 0) / metrics.length) * 100) / 100,
          memory: Math.round((metrics.reduce((sum, m) => sum + m.memory_usage, 0) / metrics.length) * 100) / 100,
          network: Math.round((metrics.reduce((sum, m) => sum + m.network_traffic, 0) / metrics.length) * 100) / 100,
        }
      : { cpu: 0, memory: 0, network: 0 }

  const averageData = [
    { name: "CPU", value: avgMetrics.cpu, fill: "#8b5cf6" },
    { name: "Memory", value: avgMetrics.memory, fill: "#3b82f6" },
    { name: "Network", value: avgMetrics.network, fill: "#10b981" },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* CPU Usage Chart */}
      <Card className="relative overflow-hidden border-white/10 bg-black/40 backdrop-blur-sm group floating">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-white">CPU Usage</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <ChartSkeleton />
          ) : chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <defs>
                  <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="time" stroke="#666" style={{ fontSize: "12px" }} />
                <YAxis stroke="#666" style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111",
                    border: "1px solid #333",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#f3f4f6" }}
                />
                <Line
                  type="monotone"
                  dataKey="cpu"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={false}
                  fillOpacity={1}
                  fill="url(#colorCpu)"
                  isAnimationActive={true}
                  animationDuration={1000}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-72 flex items-center justify-center text-muted-foreground">No data available</div>
          )}
        </CardContent>
      </Card>

      {/* Memory Usage Chart */}
      <Card className="relative overflow-hidden border-white/10 bg-black/40 backdrop-blur-sm group floating">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-white">Memory Usage</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <ChartSkeleton />
          ) : chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <defs>
                  <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="time" stroke="#666" style={{ fontSize: "12px" }} />
                <YAxis stroke="#666" style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111",
                    border: "1px solid #333",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#f3f4f6" }}
                />
                <Line
                  type="monotone"
                  dataKey="memory"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                  fillOpacity={1}
                  fill="url(#colorMemory)"
                  isAnimationActive={true}
                  animationDuration={1000}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-72 flex items-center justify-center text-muted-foreground">No data available</div>
          )}
        </CardContent>
      </Card>

      {/* Network Traffic Chart */}
      <Card className="relative overflow-hidden border-white/10 bg-black/40 backdrop-blur-sm group floating">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-white">Network Traffic</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <ChartSkeleton />
          ) : chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <defs>
                  <linearGradient id="colorNetwork" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="time" stroke="#666" style={{ fontSize: "12px" }} />
                <YAxis stroke="#666" style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111",
                    border: "1px solid #333",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#f3f4f6" }}
                />
                <Line
                  type="monotone"
                  dataKey="network"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={false}
                  fillOpacity={1}
                  fill="url(#colorNetwork)"
                  isAnimationActive={true}
                  animationDuration={1000}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-72 flex items-center justify-center text-muted-foreground">No data available</div>
          )}
        </CardContent>
      </Card>

      {/* Average Metrics Bar Chart */}
      <Card className="relative overflow-hidden border-white/10 bg-black/40 backdrop-blur-sm group floating">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-white">Average Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <ChartSkeleton />
          ) : metrics.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={averageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#666" style={{ fontSize: "12px" }} />
                <YAxis stroke="#666" style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111",
                    border: "1px solid #333",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#f3f4f6" }}
                  formatter={(value: any) => `${value.toFixed(2)}%`}
                />
                <Bar
                  dataKey="value"
                  fill="#8b5cf6"
                  radius={[8, 8, 0, 0]}
                  isAnimationActive={true}
                  animationDuration={1000}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-72 flex items-center justify-center text-muted-foreground">No data available</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

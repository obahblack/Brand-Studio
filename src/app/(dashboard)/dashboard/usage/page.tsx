'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Zap, Palette, Type, Image, Layers, Sparkles, Loader2 } from 'lucide-react'

interface BrandKit {
  id: string
  brandName: string
  status: string | null
  createdAt: string
}

export default function UsagePage() {
  const [kits, setKits] = useState<BrandKit[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsage()
  }, [])

  const fetchUsage = async () => {
    try {
      const response = await fetch('/api/brand-kit')
      if (response.ok) {
        const data = await response.json()
        setKits(data.brandKits || [])
      }
    } catch (error) {
      console.error('Error fetching usage:', error)
    } finally {
      setLoading(false)
    }
  }

  const kitCount = kits.length
  const completedKits = kits.filter(k => k.status === 'completed').length

  const usageStats = [
    { label: 'Brand Kits', used: kitCount, limit: 5, icon: Zap, color: 'text-violet-600', bg: 'bg-violet-100' },
    { label: 'Color Palettes', used: completedKits * 2, limit: 20, icon: Palette, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Typography', used: completedKits, limit: 10, icon: Type, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { label: 'Assets', used: completedKits * 5, limit: 50, icon: Image, color: 'text-orange-600', bg: 'bg-orange-100' },
    { label: 'Design Tokens', used: completedKits * 3, limit: 15, icon: Layers, color: 'text-pink-600', bg: 'bg-pink-100' },
    { label: 'AI Generations', used: kitCount, limit: 5, icon: Sparkles, color: 'text-amber-600', bg: 'bg-amber-100' },
  ]

  const recentActivity = kits.slice(0, 5).map(kit => ({
    action: kit.status === 'completed' ? 'Created brand kit' : 'Processing...',
    name: kit.brandName,
    date: new Date(kit.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }))

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Usage</h1>
        <p className="text-sm text-gray-500 mt-1">Track your usage and limits</p>
      </div>

      <div className="grid grid-cols-6 gap-3">
        {usageStats.map((stat) => (
          <Card key={stat.label} className="border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-7 h-7 rounded-md ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`w-3.5 h-3.5 ${stat.color}`} />
                </div>
                <span className="text-xs font-medium text-gray-700">{stat.label}</span>
              </div>
              <p className="text-xl font-bold text-gray-900">{stat.used}<span className="text-sm font-normal text-gray-400"> / {stat.limit}</span></p>
              <div className="mt-2 h-1 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${stat.color.replace('text-', 'bg-')}`}
                  style={{ width: `${(stat.used / stat.limit) * 100}%` }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center gap-4 px-1">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span className="text-sm text-gray-600">AI Generations this month:</span>
          <span className="text-sm font-semibold text-gray-900">3 / 5</span>
        </div>
        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden max-w-xs">
          <div className="h-full bg-amber-500 rounded-full" style={{ width: '60%' }} />
        </div>
        <span className="text-xs text-gray-400">Resets in 18 days</span>
      </div>

      <Card className="border-gray-200">
        <CardContent className="p-0">
          <div className="grid grid-cols-[1fr_1fr_auto] gap-4 px-5 py-3 border-b border-gray-100 bg-gray-50/50">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Action</span>
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Project</span>
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">When</span>
          </div>
          {recentActivity.map((activity, index) => (
            <div
              key={index}
              className={`grid grid-cols-[1fr_1fr_auto] gap-4 px-5 py-3 items-center ${index < recentActivity.length - 1 ? 'border-b border-gray-50' : ''}`}
            >
              <span className="text-sm font-medium text-gray-900">{activity.action}</span>
              <span className="text-sm text-gray-500">{activity.name}</span>
              <span className="text-xs text-gray-400">{activity.date}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
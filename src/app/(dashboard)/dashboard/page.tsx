'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, ArrowRight, Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface BrandKit {
  id: string
  brandName: string
  status: string | null
  colorPalette: Record<string, string[]> | null
  createdAt: string
}

export default function DashboardPage() {
  const [kits, setKits] = useState<BrandKit[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchKits()
  }, [])

  const fetchKits = async () => {
    try {
      const response = await fetch('/api/brand-kit')
      if (response.ok) {
        const data = await response.json()
        setKits(data.brandKits || [])
      }
    } catch (error) {
      console.error('Error fetching brand kits:', error)
    } finally {
      setLoading(false)
    }
  }

  const getColorPreview = (palette: Record<string, string[] | Record<string, string>> | null): string[] => {
    if (!palette) return ['#6D28D9', '#8B5CF6', '#A78BFA', '#C4B5FD']
    const toArray = (val: string[] | Record<string, string> | undefined): string[] => {
      if (!val) return []
      if (Array.isArray(val)) return val
      return Object.values(val)
    }
    const primary = toArray(palette.primary || palette.Primary)
    const secondary = toArray(palette.secondary || palette.Secondary)
    const accent = toArray(palette.accent || palette.Accent)
    const colors = [...primary.slice(0, 2), ...secondary.slice(0, 1), ...accent.slice(0, 1)]
    return colors.length > 0 ? colors : ['#6D28D9', '#8B5CF6', '#A78BFA', '#C4B5FD']
  }

  const getTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    if (diffMins < 60) return `${diffMins} minutes ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours} hours ago`
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays} days ago`
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Projects</h1>
          <p className="text-sm text-gray-500 mt-1">Click a project to view its brand kit</p>
        </div>
        <Link
          href="/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Project
        </Link>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
        </div>
      ) : (
        /* Projects Grid */
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Create New Card */}
          <Link href="/create">
            <Card className="border-2 border-dashed border-gray-200 hover:border-violet-300 transition-colors cursor-pointer h-full">
              <CardContent className="p-6 flex flex-col items-center justify-center h-full min-h-[220px]">
                <div className="w-12 h-12 rounded-full bg-violet-50 flex items-center justify-center mb-3">
                  <Plus className="w-6 h-6 text-violet-600" />
                </div>
                <p className="font-medium text-gray-900">Create New Project</p>
                <p className="text-sm text-gray-500 mt-1">Generate a brand system from a URL</p>
              </CardContent>
            </Card>
          </Link>

          {/* Project Cards */}
          {kits.map((kit) => (
            <Link key={kit.id} href={`/brand-kit/${kit.id}`}>
              <Card className="border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer h-full">
                <CardContent className="p-6 min-h-[220px]">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">{kit.brandName}</h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        kit.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-700'
                          : kit.status === 'processing'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {kit.status || 'pending'}
                    </span>
                  </div>

                  {/* Color Preview */}
                  <div className="flex gap-1.5 mb-4">
                    {getColorPreview(kit.colorPalette).map((color, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-lg"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-400">{getTimeAgo(kit.createdAt)}</p>
                    <span className="text-xs text-violet-600 font-medium flex items-center gap-1">
                      View <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

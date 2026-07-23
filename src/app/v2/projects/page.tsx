'use client'

import Link from 'next/link'
import { useState, useEffect, useRef, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, LayoutGrid, List, ArrowRight, Loader2, MoreHorizontal, ExternalLink, Trash2, X } from 'lucide-react'

interface BrandKit {
  id: string
  brandName: string
  websiteUrl: string | null
  status: string
  colorPalette: Record<string, Record<string, string>> | null
  createdAt: string
}

export default function V2ProjectsPage() {
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const [projects, setProjects] = useState<BrandKit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number } | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<BrandKit | null>(null)
  const [deleting, setDeleting] = useState(false)
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    fetchProjects()
  }, [])

  const closeDropdown = useCallback(() => {
    setOpenDropdownId(null)
    setDropdownPos(null)
  }, [])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        closeDropdown()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [closeDropdown])

  const openDropdown = (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation()
    if (openDropdownId === projectId) {
      closeDropdown()
      return
    }
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    setDropdownPos({ top: rect.bottom + 4, left: Math.min(rect.right - 160, window.innerWidth - 180) })
    setOpenDropdownId(projectId)
  }

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/brand-kit')
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.error || `Failed to fetch projects (${response.status})`)
      }
      const data = await response.json()
      setProjects(data.brandKits || [])
    } catch (err) {
      console.error('Error fetching projects:', err)
      setError(err instanceof Error ? err.message : 'Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const response = await fetch(`/api/brand-kit/${deleteTarget.id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete')
      setProjects(prev => prev.filter(p => p.id !== deleteTarget.id))
      setDeleteTarget(null)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setDeleting(false)
    }
  }

  const getProjectColors = (palette: Record<string, Record<string, string>> | null): string[] => {
    if (!palette) return []
    const colors: string[] = []
    Object.values(palette).forEach((group) => {
      if (group && typeof group === 'object') {
        const values = Object.values(group)
        if (values.length > 0) colors.push(values[0])
        if (values.length > 2) colors.push(values[2])
      }
    })
    return colors.slice(0, 4)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-violet-600 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">{error}</p>
        <Button onClick={fetchProjects} variant="outline" className="mt-4">
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/40" onClick={() => !deleting && setDeleteTarget(null)} />
          <div className="relative z-10 w-full max-w-[400px] bg-white rounded-2xl shadow-2xl p-6 mx-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Delete Project</h3>
              <button onClick={() => setDeleteTarget(null)} disabled={deleting} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600">
              Are you sure you want to delete <span className="font-semibold text-gray-900">{deleteTarget.brandName}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-1">
              <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={deleting} className="border-gray-200">
                Cancel
              </Button>
              <Button onClick={handleDelete} disabled={deleting} className="bg-red-600 hover:bg-red-700 text-white">
                {deleting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Deleting...</> : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-sm text-gray-500 mt-1">All your brand projects</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 ${viewMode === 'table' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
          <Link href="/v2/create">
            <Button className="bg-violet-600 hover:bg-violet-700">
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </Link>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-full bg-violet-50 flex items-center justify-center mx-auto mb-4">
            <Plus className="w-6 h-6 text-violet-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects yet</h3>
          <p className="text-gray-500 mb-6">Create your first brand kit to get started</p>
          <Link href="/v2/create">
            <Button className="bg-violet-600 hover:bg-violet-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Project
            </Button>
          </Link>
        </div>
      ) : viewMode === 'table' ? (
        <Card className="border-gray-200">
          <CardContent className="p-0">
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_80px] gap-4 px-5 py-3 border-b border-gray-100 bg-gray-50/50">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Project</span>
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Status</span>
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Assets</span>
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Created</span>
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider text-center">Actions</span>
            </div>
            {projects.map((project, index) => (
              <div key={project.id} className={`relative ${index < projects.length - 1 ? 'border-b border-gray-50' : ''}`}>
                <Link href={`/v2/projects/${project.id}`} className="grid grid-cols-[2fr_1fr_1fr_1fr_80px] gap-4 px-5 py-4 items-center hover:bg-gray-50/50 cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      {getProjectColors(project.colorPalette).map((color, i) => (
                        <div key={i} className="w-4 h-4 rounded" style={{ backgroundColor: color }} />
                      ))}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{project.brandName}</p>
                      {project.websiteUrl && <p className="text-xs text-gray-400">{project.websiteUrl}</p>}
                    </div>
                  </div>
                  <span
                    className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium w-fit ${
                      project.status === 'completed'
                        ? 'bg-emerald-50 text-emerald-700'
                        : project.status === 'processing'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-gray-50 text-gray-700'
                    }`}
                  >
                    {project.status}
                  </span>
                  <span className="text-sm text-gray-600">-</span>
                  <span className="text-xs text-gray-400">{formatDate(project.createdAt)}</span>
                </Link>
                <div className="absolute right-0 top-0 bottom-0 flex items-center pr-4">
                  <button
                    onClick={(e) => openDropdown(e, project.id)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {projects.map((project) => (
            <Link key={project.id} href={`/v2/projects/${project.id}`}>
              <Card className="border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer h-full">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">{project.brandName}</h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        project.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-700'
                          : project.status === 'processing'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-gray-50 text-gray-700'
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>
                  <div className="flex gap-1.5 mb-3">
                    {getProjectColors(project.colorPalette).map((color, i) => (
                      <div key={i} className="w-6 h-6 rounded-md" style={{ backgroundColor: color }} />
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{project.websiteUrl || 'No URL'}</span>
                    <span>{formatDate(project.createdAt)}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
          <Link href="/v2/create">
            <Card className="border-2 border-dashed border-gray-200 hover:border-violet-300 transition-colors cursor-pointer h-full">
              <CardContent className="p-5 flex flex-col items-center justify-center min-h-[160px]">
                <div className="w-9 h-9 rounded-full bg-violet-50 flex items-center justify-center mb-2">
                  <Plus className="w-4 h-4 text-violet-600" />
                </div>
                <p className="text-sm font-medium text-gray-900">New Project</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      )}

      {/* Fixed-position dropdown menu */}
      {openDropdownId && dropdownPos && (() => {
        const project = projects.find(p => p.id === openDropdownId)
        if (!project) return null
        return (
          <div
            ref={dropdownRef}
            className="fixed z-50 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1"
            style={{ top: dropdownPos.top, left: dropdownPos.left }}
          >
            <Link href={`/v2/projects/${project.id}`} onClick={() => closeDropdown()}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              <ExternalLink className="w-3.5 h-3.5" /> Open
            </Link>
            <button onClick={(e) => { e.stopPropagation(); closeDropdown(); setDeleteTarget(project) }}
              className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left">
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          </div>
        )
      })()}
    </div>
  )
}

'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useDropzone } from 'react-dropzone'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Globe, Upload, Sparkles, ArrowRight, Check, Loader2 } from 'lucide-react'
import { InstagramIcon, FacebookIcon, TwitterXIcon, TikTokIcon, LinkedInIcon, YouTubeIcon, PinterestIcon, ThreadsIcon } from '@/components/icons/platform-icons'

const platforms = [
  { id: 'instagram', name: 'Instagram', icon: InstagramIcon },
  { id: 'facebook', name: 'Facebook', icon: FacebookIcon },
  { id: 'x', name: 'X / Twitter', icon: TwitterXIcon },
  { id: 'tiktok', name: 'TikTok', icon: TikTokIcon },
  { id: 'linkedin', name: 'LinkedIn', icon: LinkedInIcon },
  { id: 'youtube', name: 'YouTube', icon: YouTubeIcon },
  { id: 'pinterest', name: 'Pinterest', icon: PinterestIcon },
  { id: 'threads', name: 'Threads', icon: ThreadsIcon },
]

export default function V2CreatePage() {
  const router = useRouter()
  const [brandName, setBrandName] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [brandDescription, setBrandDescription] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['instagram', 'x', 'facebook'])
  const [loading, setLoading] = useState(false)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [urlError, setUrlError] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => setLogoPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.svg', '.webp'] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
  })

  const togglePlatform = (id: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    )
  }

  const validateUrl = (url: string): boolean => {
    if (!url.trim()) {
      setUrlError(null)
      return true
    }
    try {
      const parsed = new URL(url)
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        setUrlError('URL must start with http:// or https://')
        return false
      }
      if (!parsed.hostname.includes('.')) {
        setUrlError('Please enter a valid website URL')
        return false
      }
      setUrlError(null)
      return true
    } catch {
      setUrlError('Please enter a valid website URL (e.g. https://example.com)')
      return false
    }
  }

  const handleUrlBlur = () => {
    if (websiteUrl.trim()) {
      validateUrl(websiteUrl)
    }
  }

  const handleSubmit = async () => {
    if (!brandName.trim()) return
    if (websiteUrl.trim() && !validateUrl(websiteUrl)) return
    setLoading(true)
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandName: brandName.trim(),
          websiteUrl: websiteUrl.trim() || null,
          brandDescription: brandDescription.trim() || null,
          logoUrl: logoPreview || null,
          platforms: selectedPlatforms,
        }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create brand kit')
      }
      router.push(`/v2/projects/${data.brandKitId}`)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-[650px] space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create New Project</h1>
        <p className="text-sm text-gray-500 mt-1">Enter your brand details and select platforms to generate assets for</p>
      </div>

      {/* Brand Details */}
      <Card className="border-gray-200">
        <CardContent className="p-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="brand-name" className="text-sm font-medium">Brand Name *</Label>
            <Input
              id="brand-name"
              placeholder="e.g. Acme Corp"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website-url" className="text-sm font-medium">Website URL</Label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="website-url"
                placeholder="https://example.com"
                value={websiteUrl}
                onChange={(e) => { setWebsiteUrl(e.target.value); if (urlError) setUrlError(null) }}
                onBlur={handleUrlBlur}
                className={`pl-9 ${urlError ? 'border-red-300 focus:ring-red-500' : ''}`}
              />
            </div>
            {urlError && <p className="text-xs text-red-500">{urlError}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">Brand Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your brand, its personality, and target audience..."
              value={brandDescription}
              onChange={(e) => setBrandDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Logo (optional)</Label>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-violet-400 bg-violet-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input {...getInputProps()} />
              {logoPreview ? (
                <div className="flex items-center gap-3">
                  <img src={logoPreview} alt="Logo" className="w-10 h-10 rounded-lg object-cover" />
                  <span className="text-sm text-gray-600">Logo uploaded</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <Upload className="w-4 h-4" />
                  Drop your logo here or click to browse
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Platform Selection */}
      <Card className="border-gray-200">
        <CardContent className="p-6">
          <Label className="text-sm font-medium mb-3 block">Select Platforms</Label>
          <div className="grid grid-cols-4 gap-2">
            {platforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => togglePlatform(platform.id)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border-2 text-sm font-medium transition-all ${
                  selectedPlatforms.includes(platform.id)
                    ? 'border-violet-500 bg-violet-50 text-violet-700'
                    : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'
                }`}
              >
                <platform.icon className="w-4 h-4" />
                {platform.name}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={!brandName.trim() || loading}
          className="bg-violet-600 hover:bg-violet-700 px-8"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              Create Project
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

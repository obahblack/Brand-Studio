'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Palette, Type, Layers, Image, Download, Plus, Sparkles, Copy, Check, ChevronRight, X, Loader2, MoreHorizontal, ExternalLink, Trash2, RefreshCw } from 'lucide-react'
import { InstagramIcon, FacebookIcon, TwitterXIcon, TikTokIcon, LinkedInIcon, YouTubeIcon, PinterestIcon, ThreadsIcon, SnapchatIcon, RedditIcon, DiscordIcon, TelegramIcon, WhatsAppIcon, MastodonIcon, BlueskyIcon, TwitchIcon, MediumIcon, SubstackIcon } from '@/components/icons/platform-icons'

const platformIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  instagram: InstagramIcon,
  'instagram-post': InstagramIcon,
  x: TwitterXIcon,
  'twitter-card': TwitterXIcon,
  facebook: FacebookIcon,
  'facebook-post': FacebookIcon,
  linkedin: LinkedInIcon,
  'linkedin-post': LinkedInIcon,
  tiktok: TikTokIcon,
  'tiktok-post': TikTokIcon,
  youtube: YouTubeIcon,
  'youtube-thumbnail': YouTubeIcon,
  pinterest: PinterestIcon,
  threads: ThreadsIcon,
  snapchat: SnapchatIcon,
  reddit: RedditIcon,
  discord: DiscordIcon,
  telegram: TelegramIcon,
  whatsapp: WhatsAppIcon,
  mastodon: MastodonIcon,
  bluesky: BlueskyIcon,
  twitch: TwitchIcon,
  medium: MediumIcon,
  substack: SubstackIcon,
}

const platformNames: Record<string, string> = {
  instagram: 'Instagram', 'instagram-post': 'Instagram',
  x: 'X / Twitter', 'twitter-card': 'X / Twitter',
  facebook: 'Facebook', 'facebook-post': 'Facebook',
  linkedin: 'LinkedIn', 'linkedin-post': 'LinkedIn',
  tiktok: 'TikTok', 'tiktok-post': 'TikTok',
  youtube: 'YouTube', 'youtube-thumbnail': 'YouTube',
  pinterest: 'Pinterest', threads: 'Threads',
  snapchat: 'Snapchat', reddit: 'Reddit',
  discord: 'Discord', telegram: 'Telegram',
  whatsapp: 'WhatsApp', mastodon: 'Mastodon',
  bluesky: 'Bluesky', twitch: 'Twitch',
  medium: 'Medium', substack: 'Substack',
}

const platformAspects: Record<string, { aspect: string; label: string; size: string }> = {
  instagram: { aspect: 'aspect-square', label: '1:1', size: '1080 × 1080' },
  'instagram-post': { aspect: 'aspect-square', label: '1:1', size: '1080 × 1080' },
  x: { aspect: 'aspect-video', label: '16:9', size: '1600 × 900' },
  'twitter-card': { aspect: 'aspect-video', label: '16:9', size: '1600 × 900' },
  facebook: { aspect: 'aspect-square', label: '1:1', size: '1200 × 1200' },
  'facebook-post': { aspect: 'aspect-square', label: '1:1', size: '1200 × 1200' },
  linkedin: { aspect: 'aspect-square', label: '1:1', size: '1200 × 1200' },
  'linkedin-post': { aspect: 'aspect-square', label: '1:1', size: '1200 × 1200' },
  tiktok: { aspect: 'aspect-square', label: '1:1', size: '1080 × 1080' },
  'tiktok-post': { aspect: 'aspect-square', label: '1:1', size: '1080 × 1080' },
  youtube: { aspect: 'aspect-video', label: '16:9', size: '1280 × 720' },
  'youtube-thumbnail': { aspect: 'aspect-video', label: '16:9', size: '1280 × 720' },
  pinterest: { aspect: 'aspect-[2/3]', label: '2:3', size: '1000 × 1500' },
  threads: { aspect: 'aspect-square', label: '1:1', size: '1080 × 1080' },
  snapchat: { aspect: 'aspect-[9/16]', label: '9:16', size: '1080 × 1920' },
  reddit: { aspect: 'aspect-video', label: '16:9', size: '1200 × 675' },
  discord: { aspect: 'aspect-video', label: '16:9', size: '1200 × 675' },
  telegram: { aspect: 'aspect-video', label: '16:9', size: '1200 × 675' },
  whatsapp: { aspect: 'aspect-square', label: '1:1', size: '800 × 800' },
  mastodon: { aspect: 'aspect-video', label: '16:9', size: '1200 × 675' },
  bluesky: { aspect: 'aspect-video', label: '16:9', size: '1200 × 675' },
  twitch: { aspect: 'aspect-video', label: '16:9', size: '1280 × 720' },
  medium: { aspect: 'aspect-video', label: '16:9', size: '1400 × 788' },
  substack: { aspect: 'aspect-video', label: '16:9', size: '1200 × 675' },
}

const allPlatforms = [
  { id: 'instagram', name: 'Instagram', icon: InstagramIcon },
  { id: 'x', name: 'X / Twitter', icon: TwitterXIcon },
  { id: 'facebook', name: 'Facebook', icon: FacebookIcon },
  { id: 'linkedin', name: 'LinkedIn', icon: LinkedInIcon },
  { id: 'tiktok', name: 'TikTok', icon: TikTokIcon },
  { id: 'youtube', name: 'YouTube', icon: YouTubeIcon },
  { id: 'pinterest', name: 'Pinterest', icon: PinterestIcon },
  { id: 'threads', name: 'Threads', icon: ThreadsIcon },
  { id: 'snapchat', name: 'Snapchat', icon: SnapchatIcon },
  { id: 'reddit', name: 'Reddit', icon: RedditIcon },
  { id: 'discord', name: 'Discord', icon: DiscordIcon },
  { id: 'telegram', name: 'Telegram', icon: TelegramIcon },
  { id: 'whatsapp', name: 'WhatsApp', icon: WhatsAppIcon },
  { id: 'mastodon', name: 'Mastodon', icon: MastodonIcon },
  { id: 'bluesky', name: 'Bluesky', icon: BlueskyIcon },
  { id: 'twitch', name: 'Twitch', icon: TwitchIcon },
  { id: 'medium', name: 'Medium', icon: MediumIcon },
  { id: 'substack', name: 'Substack', icon: SubstackIcon },
]

interface BrandKit {
  id: string
  brandName: string
  websiteUrl: string | null
  brandDescription: string | null
  logoUrl: string | null
  brandAnalysis: Record<string, unknown> | null
  designSystem: Record<string, unknown> | null
  colorPalette: Record<string, Record<string, string>> | null
  typography: {
    headingFont: string
    bodyFont: string
    scale: Record<string, { size: string; weight: string; lineHeight: string; label: string }>
  } | null
  designTokens: {
    spacing: Record<string, string>
    borderRadius: Record<string, string>
    shadows: Record<string, string>
  } | null
  status: string
  createdAt: string
}

interface Asset {
  id: string
  assetType: string
  assetName: string
  fileUrl: string | null
  fileType: string | null
  metadata: { campaign?: string; template?: string; description?: string } | null
  createdAt: string
}

interface CampaignGroup {
  name: string
  description?: string
  assets: Asset[]
  createdAt: string
}

const defaultTypography = {
  headingFont: 'Inter',
  bodyFont: 'Inter',
  scale: {
    display: { size: '60px', weight: '800', lineHeight: '1.05', label: 'Display' },
    h1: { size: '48px', weight: '700', lineHeight: '1.15', label: 'Heading 1' },
    h2: { size: '36px', weight: '700', lineHeight: '1.2', label: 'Heading 2' },
    h3: { size: '28px', weight: '600', lineHeight: '1.3', label: 'Heading 3' },
    h4: { size: '22px', weight: '600', lineHeight: '1.35', label: 'Heading 4' },
    'body-lg': { size: '18px', weight: '400', lineHeight: '1.7', label: 'Body Large' },
    body: { size: '16px', weight: '400', lineHeight: '1.7', label: 'Body' },
    'body-sm': { size: '14px', weight: '400', lineHeight: '1.6', label: 'Body Small' },
    caption: { size: '12px', weight: '400', lineHeight: '1.5', label: 'Caption' },
    footnote: { size: '11px', weight: '400', lineHeight: '1.4', label: 'Footnote' },
    label: { size: '14px', weight: '500', lineHeight: '1.4', label: 'Label' },
    overline: { size: '12px', weight: '600', lineHeight: '1.2', label: 'Overline' },
  },
}

const defaultDesignTokens = {
  spacing: { xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '32px', '2xl': '48px', '3xl': '64px' },
  borderRadius: { sm: '4px', md: '8px', lg: '12px', xl: '16px', '2xl': '24px', full: '9999px' },
  shadows: { sm: '0 1px 2px rgba(0,0,0,0.05)', md: '0 4px 6px rgba(0,0,0,0.07)', lg: '0 10px 15px rgba(0,0,0,0.1)', xl: '0 20px 25px rgba(0,0,0,0.1)' },
}

const defaultDesignSystem = {
  buttons: {
    primary: { bg: '#7C3AED', text: '#FFFFFF', radius: '12px', padding: '12px 24px', fontSize: '16px', fontWeight: '600' },
    secondary: { bg: '#22C55E', text: '#FFFFFF', radius: '12px', padding: '12px 24px', fontSize: '16px', fontWeight: '600' },
    ghost: { bg: 'transparent', text: '#374151', radius: '12px', padding: '12px 24px', fontSize: '16px', fontWeight: '500' },
    destructive: { bg: '#EF4444', text: '#FFFFFF', radius: '12px', padding: '12px 24px', fontSize: '16px', fontWeight: '600' },
  },
}

export default function V2ProjectDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [copied, setCopied] = useState<string | null>(null)
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null)
  const [showAssetDetail, setShowAssetDetail] = useState(false)
  const [showPlatformPicker, setShowPlatformPicker] = useState(false)
  const [campaignName, setCampaignName] = useState('')
  const [generateDescription, setGenerateDescription] = useState('')
  const [selectedGeneratePlatforms, setSelectedGeneratePlatforms] = useState<string[]>([])
  const [generating, setGenerating] = useState(false)
  const [project, setProject] = useState<BrandKit | null>(null)
  const [assets, setAssets] = useState<Asset[]>([])
  const [error, setError] = useState<string | null>(null)
  const [openAssetDropdown, setOpenAssetDropdown] = useState<string | null>(null)
  const [assetDropdownPos, setAssetDropdownPos] = useState<{ top: number; left: number } | null>(null)
  const [deleteAssetTarget, setDeleteAssetTarget] = useState<Asset | null>(null)
  const [deletingAsset, setDeletingAsset] = useState(false)
  const assetDropdownRef = useRef<HTMLDivElement | null>(null)

  const [openCampaignDropdown, setOpenCampaignDropdown] = useState<string | null>(null)
  const [campaignDropdownPos, setCampaignDropdownPos] = useState<{ top: number; left: number } | null>(null)
  const [deleteCampaignTarget, setDeleteCampaignTarget] = useState<CampaignGroup | null>(null)
  const [deletingCampaign, setDeletingCampaign] = useState(false)
  const campaignDropdownRef = useRef<HTMLDivElement | null>(null)

  // Channel picker state
  const [showChannelPicker, setShowChannelPicker] = useState(false)
  const [selectedChannels, setSelectedChannels] = useState<string[]>([])

  const closeAssetDropdown = useCallback(() => {
    setOpenAssetDropdown(null)
    setAssetDropdownPos(null)
  }, [])

  const closeCampaignDropdown = useCallback(() => {
    setOpenCampaignDropdown(null)
    setCampaignDropdownPos(null)
  }, [])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (assetDropdownRef.current && !assetDropdownRef.current.contains(e.target as Node)) {
        closeAssetDropdown()
      }
      if (campaignDropdownRef.current && !campaignDropdownRef.current.contains(e.target as Node)) {
        closeCampaignDropdown()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [closeAssetDropdown, closeCampaignDropdown])

  const openAssetDropdownHandler = (e: React.MouseEvent, assetId: string) => {
    e.stopPropagation()
    if (openAssetDropdown === assetId) {
      closeAssetDropdown()
      return
    }
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    setAssetDropdownPos({ top: rect.bottom + 4, left: Math.min(rect.right - 144, window.innerWidth - 164) })
    setOpenAssetDropdown(assetId)
  }

  const openCampaignDropdownHandler = (e: React.MouseEvent, campaignName: string) => {
    e.stopPropagation()
    if (openCampaignDropdown === campaignName) {
      closeCampaignDropdown()
      return
    }
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    setCampaignDropdownPos({ top: rect.bottom + 4, left: Math.min(rect.right - 160, window.innerWidth - 180) })
    setOpenCampaignDropdown(campaignName)
  }

  const handleDeleteCampaign = async () => {
    if (!deleteCampaignTarget) return
    setDeletingCampaign(true)
    try {
      const assetIds = deleteCampaignTarget.assets.map(a => a.id)
      await Promise.all(assetIds.map(aid =>
        fetch(`/api/brand-kit/${id}/assets/${aid}`, { method: 'DELETE' })
      ))
      setAssets(prev => prev.filter(a => !assetIds.includes(a.id)))
      setDeleteCampaignTarget(null)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete campaign')
    } finally {
      setDeletingCampaign(false)
    }
  }

  useEffect(() => {
    fetchProject()
  }, [id])

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/brand-kit/${id}`)
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.error || `Failed to fetch project (${response.status})`)
      }
      const data = await response.json()
      setProject(data.brandKit)
      setAssets(data.assets || [])
    } catch (err) {
      console.error('Error fetching project:', err)
      setError(err instanceof Error ? err.message : 'Failed to load project')
    }
  }

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value)
    setCopied(value)
    setTimeout(() => setCopied(null), 1500)
  }

  const toggleGeneratePlatform = (platformId: string) => {
    setSelectedGeneratePlatforms(prev =>
      prev.includes(platformId) ? prev.filter(p => p !== platformId) : [...prev, platformId]
    )
  }

  const handleGenerateAssets = async () => {
    if (selectedGeneratePlatforms.length === 0 || !id) return
    if (!campaignName.trim()) return
    setGenerating(true)
    try {
      const response = await fetch('/api/generate/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandKitId: id,
          platforms: selectedGeneratePlatforms,
          campaignName: campaignName.trim(),
          description: generateDescription.trim() || undefined,
        }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate assets')
      }
      setShowPlatformPicker(false)
      // Poll for assets since generation runs in background
      for (let i = 0; i < 30; i++) {
        await new Promise(r => setTimeout(r, 1000))
        const res = await fetch(`/api/brand-kit/${id}`)
        const json = await res.json()
        if (json.assets && json.assets.length > 0) {
          setAssets(json.assets)
          setProject(json.brandKit)
          setShowAssetDetail(true)
          return
        }
      }
      fetchProject()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setGenerating(false)
    }
  }

  const handleDeleteAsset = async () => {
    if (!deleteAssetTarget) return
    setDeletingAsset(true)
    try {
      const response = await fetch(`/api/brand-kit/${id}/assets/${deleteAssetTarget.id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete asset')
      setAssets(prev => prev.filter(a => a.id !== deleteAssetTarget.id))
      setDeleteAssetTarget(null)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setDeletingAsset(false)
    }
  }

  const handleAddChannels = async () => {
    if (selectedChannels.length === 0 || !id || !selectedCampaign) return
    setGenerating(true)
    try {
      const response = await fetch('/api/generate/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandKitId: id,
          platforms: selectedChannels,
          campaignName: selectedCampaign,
          description: filteredCampaignAssets[0]?.metadata?.description || undefined,
        }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to add channels')
      }
      setShowChannelPicker(false)
      setSelectedChannels([])
      // Poll for new assets
      for (let i = 0; i < 30; i++) {
        await new Promise(r => setTimeout(r, 1000))
        const res = await fetch(`/api/brand-kit/${id}`)
        const json = await res.json()
        if (json.assets && json.assets.length > assets.length) {
          setAssets(json.assets)
          return
        }
      }
      fetchProject()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setGenerating(false)
    }
  }

  if (error || !project) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">{error || 'Project not found'}</p>
        <Link href="/v2/projects">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Projects
          </Button>
        </Link>
      </div>
    )
  }

  const colorPalette = project.colorPalette || {}
  const typography = project.typography || defaultTypography
  const designTokens = project.designTokens || defaultDesignTokens
  const designSystem = (project.designSystem as { buttons?: Record<string, { bg: string; text: string; radius: string; padding: string; fontSize: string; fontWeight: string }> })?.buttons
    ? project.designSystem as { buttons: Record<string, { bg: string; text: string; radius: string; padding: string; fontSize: string; fontWeight: string }> }
    : defaultDesignSystem

  const groupByCampaign = () => {
    const groups = new Map<string, CampaignGroup>()
    for (const asset of assets) {
      const name = asset.metadata?.campaign || 'Untitled'
      if (!groups.has(name)) {
        groups.set(name, { name, description: asset.metadata?.description, assets: [], createdAt: asset.createdAt })
      }
      groups.get(name)!.assets.push(asset)
    }
    return Array.from(groups.values()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  const filteredCampaignAssets = selectedCampaign
    ? assets.filter(a => a.metadata?.campaign === selectedCampaign)
    : assets

  return (
    <div className="space-y-6">
      {/* Centered Generate Assets Modal */}
      {showPlatformPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/40" onClick={() => setShowPlatformPicker(false)} />
          <div className="relative z-10 w-full max-w-[560px] bg-white rounded-2xl shadow-2xl p-6 mx-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Generate Assets</h3>
              <button onClick={() => setShowPlatformPicker(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <input
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                placeholder="Campaign name (e.g. Summer Sale)"
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
              <textarea
                value={generateDescription}
                onChange={(e) => setGenerateDescription(e.target.value)}
                placeholder="Describe your campaign visually... (e.g. Summer Sale with tropical vibes, beach colors, 50% off)"
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                rows={3}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {allPlatforms.map((platform) => (
                <button key={platform.id} onClick={() => toggleGeneratePlatform(platform.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                    selectedGeneratePlatforms.includes(platform.id)
                      ? 'border-violet-500 bg-violet-50 text-violet-700'
                      : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                  }`}>
                  <platform.icon className="w-4 h-4" /> {platform.name}
                </button>
              ))}
            </div>
            <button
              onClick={handleGenerateAssets}
              disabled={selectedGeneratePlatforms.length === 0 || generating || !campaignName.trim()}
              className="w-full py-2.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
            >
              {generating ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
              ) : (
                <><Sparkles className="w-4 h-4" /> Generate Assets</>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Delete Asset Confirmation Modal */}
      {deleteAssetTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/40" onClick={() => !deletingAsset && setDeleteAssetTarget(null)} />
          <div className="relative z-10 w-full max-w-[400px] bg-white rounded-2xl shadow-2xl p-6 mx-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Delete Asset</h3>
              <button onClick={() => setDeleteAssetTarget(null)} disabled={deletingAsset} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600">
              Are you sure you want to delete <span className="font-semibold text-gray-900">{deleteAssetTarget.assetName}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-1">
              <Button variant="outline" onClick={() => setDeleteAssetTarget(null)} disabled={deletingAsset} className="border-gray-200">
                Cancel
              </Button>
              <Button onClick={handleDeleteAsset} disabled={deletingAsset} className="bg-red-600 hover:bg-red-700 text-white">
                {deletingAsset ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Deleting...</> : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Campaign Confirmation Modal */}
      {deleteCampaignTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/40" onClick={() => !deletingCampaign && setDeleteCampaignTarget(null)} />
          <div className="relative z-10 w-full max-w-[400px] bg-white rounded-2xl shadow-2xl p-6 mx-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Delete Campaign</h3>
              <button onClick={() => setDeleteCampaignTarget(null)} disabled={deletingCampaign} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600">
              Are you sure you want to delete <span className="font-semibold text-gray-900">{deleteCampaignTarget.name}</span> and all {deleteCampaignTarget.assets.length} assets? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-1">
              <Button variant="outline" onClick={() => setDeleteCampaignTarget(null)} disabled={deletingCampaign} className="border-gray-200">
                Cancel
              </Button>
              <Button onClick={handleDeleteCampaign} disabled={deletingCampaign} className="bg-red-600 hover:bg-red-700 text-white">
                {deletingCampaign ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Deleting...</> : 'Delete Campaign'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Channel Modal */}
      {showChannelPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/40" onClick={() => { setShowChannelPicker(false); setSelectedChannels([]) }} />
          <div className="relative z-10 w-full max-w-[480px] bg-white rounded-2xl shadow-2xl p-6 mx-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Add Channels</h3>
              <button onClick={() => { setShowChannelPicker(false); setSelectedChannels([]) }} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-500">Select channels to add to this campaign</p>
            <div className="grid grid-cols-3 gap-2">
              {allPlatforms
                .filter(p => {
                  const existingTypes = filteredCampaignAssets.map(a => a.assetType)
                  return !existingTypes.includes(p.id) && !existingTypes.includes(`${p.id}-post`) && !existingTypes.includes(`${p.id}-card`) && !existingTypes.includes(`${p.id}-thumbnail`)
                })
                .map((platform) => {
                  const isSelected = selectedChannels.includes(platform.id)
                  return (
                    <button
                      key={platform.id}
                      onClick={() => setSelectedChannels(prev => isSelected ? prev.filter(c => c !== platform.id) : [...prev, platform.id])}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                        isSelected
                          ? 'border-violet-500 bg-violet-50 text-violet-700'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <platform.icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{platform.name}</span>
                    </button>
                  )
                })}
            </div>
            <button
              onClick={handleAddChannels}
              disabled={selectedChannels.length === 0 || generating}
              className="w-full py-2.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
            >
              {generating ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Adding...</>
              ) : (
                <>Add Channel{selectedChannels.length > 1 ? 's' : ''}</>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Fixed-position asset dropdown menu */}
      {openAssetDropdown && assetDropdownPos && (() => {
        const asset = assets.find(a => a.id === openAssetDropdown)
        if (!asset) return null
        return (
          <div
            ref={assetDropdownRef}
            className="fixed z-50 w-36 bg-white rounded-lg shadow-lg border border-gray-200 py-1"
            style={{ top: assetDropdownPos.top, left: assetDropdownPos.left }}
          >
            <button onClick={() => { closeAssetDropdown(); setSelectedCampaign(asset.metadata?.campaign || 'Untitled'); setShowAssetDetail(true) }}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors w-full text-left">
              <ExternalLink className="w-3.5 h-3.5" /> View
            </button>
            <button onClick={() => { closeAssetDropdown(); setDeleteAssetTarget(asset) }}
              className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left">
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          </div>
        )
      })()}

      {/* Fixed-position campaign dropdown menu */}
      {openCampaignDropdown && campaignDropdownPos && (() => {
        const campaign = groupByCampaign().find(c => c.name === openCampaignDropdown)
        if (!campaign) return null
        return (
          <div
            ref={campaignDropdownRef}
            className="fixed z-50 w-44 bg-white rounded-lg shadow-lg border border-gray-200 py-1"
            style={{ top: campaignDropdownPos.top, left: campaignDropdownPos.left }}
          >
            <button onClick={() => { closeCampaignDropdown(); setSelectedCampaign(campaign.name); setShowAssetDetail(true) }}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors w-full text-left">
              <ExternalLink className="w-3.5 h-3.5" /> Open
            </button>
            <button onClick={() => { closeCampaignDropdown(); /* TODO: download all */ }}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors w-full text-left">
              <Download className="w-3.5 h-3.5" /> Download All
            </button>
            <button onClick={() => { closeCampaignDropdown(); /* TODO: regenerate */ }}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors w-full text-left">
              <RefreshCw className="w-3.5 h-3.5" /> Regenerate
            </button>
            <div className="border-t border-gray-100 my-1" />
            <button onClick={() => { closeCampaignDropdown(); setDeleteCampaignTarget(campaign) }}
              className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left">
              <Trash2 className="w-3.5 h-3.5" /> Delete Campaign
            </button>
          </div>
        )
      })()}

      {/* Header */}
      {!showAssetDetail && (
      <div className="flex items-start justify-between">
        <div>
          <Link href="/v2/projects" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-2">
            <ArrowLeft className="w-4 h-4" /> Projects
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{project.brandName}</h1>
          {project.websiteUrl && <p className="text-sm text-gray-500 mt-1">{project.websiteUrl}</p>}
        </div>
        <Button variant="outline" className="border-gray-200">
          <Download className="w-4 h-4 mr-2" />
          Export Design System
        </Button>
      </div>
      )}

      {/* Tabs */}
      {!showAssetDetail ? (
      <Tabs defaultValue="assets" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="assets" className="flex items-center gap-2"><Image className="w-4 h-4" /> Assets</TabsTrigger>
          <TabsTrigger value="colors" className="flex items-center gap-2"><Palette className="w-4 h-4" /> Colors</TabsTrigger>
          <TabsTrigger value="typography" className="flex items-center gap-2"><Type className="w-4 h-4" /> Typography</TabsTrigger>
          <TabsTrigger value="tokens" className="flex items-center gap-2"><Layers className="w-4 h-4" /> Tokens</TabsTrigger>
          <TabsTrigger value="download" className="flex items-center gap-2"><Download className="w-4 h-4" /> Download</TabsTrigger>
        </TabsList>

        {/* ==================== ASSETS TAB ==================== */}
        <TabsContent value="assets" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Assets</h2>
                <Button className="bg-violet-600 hover:bg-violet-700" onClick={() => {
                  setSelectedGeneratePlatforms(allPlatforms.map(p => p.id))
                  setCampaignName('')
                  setGenerateDescription('')
                  setShowPlatformPicker(true)
                }}>
                  <Plus className="w-4 h-4 mr-2" /> Generate Assets
                </Button>
              </div>

              {assets.length === 0 ? (
                <Card className="border-gray-200">
                  <CardContent className="py-12 text-center">
                    <Image className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No assets yet</p>
                    <p className="text-sm text-gray-400 mt-1">Generate assets for your brand</p>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-gray-200">
                  <CardContent className="p-0">
                    <div className="grid grid-cols-[2fr_1fr_1fr_80px] gap-4 px-5 py-3 border-b border-gray-100 bg-gray-50/50">
                      <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Campaign</span>
                      <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Platforms</span>
                      <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Created</span>
                      <span className="text-xs font-medium text-gray-400 uppercase tracking-wider text-center">Actions</span>
                    </div>
                    {groupByCampaign().map((campaign) => (
                      <div key={campaign.name} className="border-b border-gray-50 last:border-0">
                        <div className="grid grid-cols-[2fr_1fr_1fr_80px] gap-4 px-5 py-4 items-center hover:bg-gray-50/50 transition-colors cursor-pointer"
                          onClick={() => { setSelectedCampaign(campaign.name); setShowAssetDetail(true) }}>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-violet-50 flex items-center justify-center">
                              <Image className="w-4 h-4 text-violet-600" />
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-900">{campaign.name}</span>
                              {campaign.description && <p className="text-xs text-gray-400">{campaign.description}</p>}
                            </div>
                          </div>
                          <div className="flex gap-1.5 flex-wrap">
                            {campaign.assets.map(a => {
                              const Icon = platformIcons[a.assetType]
                              return Icon ? <Icon key={a.id} className="w-4 h-4 text-gray-400" /> : null
                            })}
                          </div>
                          <span className="text-xs text-gray-400">{new Date(campaign.createdAt).toLocaleDateString()}</span>
                          <div className="flex justify-center">
                            <button
                              onClick={(e) => openCampaignDropdownHandler(e, campaign.name)}
                              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
        </TabsContent>

        {/* ==================== COLORS TAB ==================== */}
        <TabsContent value="colors" className="space-y-6">
          {Object.keys(colorPalette).length === 0 ? (
            <Card className="border-gray-200">
              <CardContent className="py-12 text-center">
                <Palette className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No color palette generated yet</p>
              </CardContent>
            </Card>
          ) : (
            Object.entries(colorPalette).map(([groupName, colors]) => (
              <Card key={groupName} className="border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base capitalize">{groupName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    {Object.entries(colors).map(([shade, hex]) => (
                      <div key={shade} className="flex-1 group">
                        <button onClick={() => handleCopy(hex)}
                          className="h-16 w-full rounded-lg cursor-pointer relative overflow-hidden border border-gray-100"
                          style={{ backgroundColor: hex }}>
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10">
                            {copied === hex ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4 text-white" />}
                          </div>
                        </button>
                        <p className="text-[10px] text-gray-400 mt-1.5 text-center font-mono">{hex}</p>
                        <p className="text-[10px] text-gray-300 text-center">{shade}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* ==================== TYPOGRAPHY TAB ==================== */}
        <TabsContent value="typography" className="space-y-8">
          <Card className="border-gray-200">
            <CardHeader className="pb-4"><CardTitle className="text-base">Font Pairing</CardTitle></CardHeader>
            <CardContent className="space-y-8">
              <div className="flex items-start gap-8">
                <div className="w-32 shrink-0">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Heading</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{typography.headingFont}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Weights: 600, 700, 800</p>
                </div>
                <div className="flex-1 border-l border-gray-100 pl-8">
                  <p className="font-black text-4xl tracking-tight text-gray-900">The quick brown fox</p>
                  <p className="font-bold text-2xl text-gray-900 mt-2">jumps over the lazy dog</p>
                </div>
              </div>
              <div className="flex items-start gap-8">
                <div className="w-32 shrink-0">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Body</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{typography.bodyFont}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Weights: 400, 500</p>
                </div>
                <div className="flex-1 border-l border-gray-100 pl-8">
                  <p className="text-lg leading-relaxed text-gray-700">The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump!</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-gray-200">
            <CardHeader className="pb-4"><CardTitle className="text-base">Type Scale</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(typography.scale).map(([key, scale]) => {
                  const isHeading = key.startsWith('h') || key === 'display'
                  const fontFamily = isHeading ? typography.headingFont : typography.bodyFont
                  return (
                    <div key={key} className="flex items-start gap-8 pb-6 border-b border-gray-50 last:border-0 last:pb-0">
                      <div className="w-32 shrink-0 pt-1">
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{scale.label}</p>
                        <p className="text-[10px] text-gray-300 font-mono mt-1">{scale.size} / {scale.weight}</p>
                        <p className="text-[10px] text-gray-300 font-mono">leading {scale.lineHeight}</p>
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-900" style={{ fontFamily, fontSize: scale.size, fontWeight: scale.weight, lineHeight: scale.lineHeight }}>
                          {key === 'overline' ? 'OVERLINE TEXT STYLE' : key === 'label' ? 'Label Text' : key === 'footnote' ? 'Footnote text for supplementary information and references.' : key === 'caption' ? 'Caption text for images and media.' : 'The quick brown fox jumps over the lazy dog'}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==================== TOKENS TAB ==================== */}
        <TabsContent value="tokens" className="space-y-6">
          <Card className="border-gray-200">
            <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Layers className="w-4 h-4 text-gray-400" /> Spacing</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(designTokens.spacing).map(([name, value]) => (
                  <button key={name} onClick={() => handleCopy(`--space-${name}: ${value};`)}
                    className="p-3 rounded-lg border border-gray-100 hover:border-gray-200 text-left transition-colors group">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-mono font-medium text-gray-900">space-{name}</span>
                      {copied === `--space-${name}: ${value};` ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-gray-300 group-hover:text-gray-500" />}
                    </div>
                    <span className="text-xs text-gray-500 font-mono">{value}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="border-gray-200">
            <CardHeader className="pb-3"><CardTitle className="text-base">Border Radius</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(designTokens.borderRadius).map(([name, value]) => (
                  <button key={name} onClick={() => handleCopy(`--radius-${name}: ${value};`)}
                    className="p-3 rounded-lg border border-gray-100 hover:border-gray-200 text-left transition-colors group">
                    <div className="h-12 bg-violet-100 mb-2" style={{ borderRadius: value }} />
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-mono font-medium text-gray-900">radius-{name}</span>
                      {copied === `--radius-${name}: ${value};` ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-gray-300 group-hover:text-gray-500" />}
                    </div>
                    <span className="text-xs text-gray-500 font-mono">{value}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="border-gray-200">
            <CardHeader className="pb-3"><CardTitle className="text-base">Shadows</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(designTokens.shadows).map(([name, value]) => (
                  <button key={name} onClick={() => handleCopy(`--shadow-${name}: ${value};`)}
                    className="p-3 rounded-lg border border-gray-100 hover:border-gray-200 text-left transition-colors group">
                    <div className="h-16 bg-white rounded-lg mb-2" style={{ boxShadow: value }} />
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-mono font-medium text-gray-900">shadow-{name}</span>
                      {copied === `--shadow-${name}: ${value};` ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-gray-300 group-hover:text-gray-500" />}
                    </div>
                    <span className="text-xs text-gray-500 font-mono truncate block">{value}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="border-gray-200">
            <CardHeader className="pb-3"><CardTitle className="text-base">Buttons</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(designSystem.buttons).map(([type, style]) => (
                  <div key={type} className="space-y-2">
                    <p className="text-sm font-medium capitalize text-gray-700">{type}</p>
                    <button className="w-full" style={{ backgroundColor: style.bg, color: style.text, borderRadius: style.radius, padding: style.padding, fontSize: style.fontSize, fontWeight: style.fontWeight }}>Button</button>
                    <div className="text-[10px] text-gray-400 space-y-0.5">
                      <p>BG: {style.bg}</p><p>Radius: {style.radius}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==================== DOWNLOAD TAB ==================== */}
        <TabsContent value="download">
          <div className="grid grid-cols-2 gap-4">
            <Card className="border-gray-200">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Download className="w-8 h-8 text-red-400 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">Brand Guidelines PDF</h3>
                <p className="text-sm text-gray-500 mb-4">Complete brand guidelines document</p>
                <Button 
                  variant="outline" 
                  className="border-gray-200"
                  onClick={() => window.open(`/api/download/pdf/${id}`, '_blank')}
                >
                  <Download className="w-4 h-4 mr-2" /> Download PDF
                </Button>
              </CardContent>
            </Card>
            <Card className="border-gray-200">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Download className="w-8 h-8 text-blue-400 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">Complete Brand Kit</h3>
                <p className="text-sm text-gray-500 mb-4">ZIP with all assets and tokens</p>
                <Button 
                  variant="outline" 
                  className="border-gray-200"
                  onClick={() => window.open(`/api/download/zip/${id}`, '_blank')}
                >
                  <Download className="w-4 h-4 mr-2" /> Download ZIP
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      ) : (
        /* Asset Detail View (shown when a campaign is selected) */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <button onClick={() => { setShowAssetDetail(false); setSelectedCampaign(null) }} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-2">
                <ArrowLeft className="w-4 h-4" /> {project.brandName}
              </button>
              <h2 className="text-xl font-bold text-gray-900">{selectedCampaign || 'Assets'}</h2>
            </div>
            <Button variant="outline" className="border-gray-200">
              <Download className="w-4 h-4 mr-2" />
              Download All Assets
            </Button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {filteredCampaignAssets.map((asset) => {
              const PlatformIcon = platformIcons[asset.assetType] || Image
              const platformName = platformNames[asset.assetType] || asset.assetType
              const aspectInfo = platformAspects[asset.assetType] || { aspect: 'aspect-square', label: '1:1', size: '' }
              return (
                <div key={asset.id} className="shrink-0 w-[320px] group">
                  <div className="flex items-center gap-2 mb-2">
                    <PlatformIcon className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">{platformName}</span>
                    <span className="text-xs text-gray-400">{aspectInfo.label} — {aspectInfo.size}</span>
                  </div>
                  <div className={`relative ${aspectInfo.aspect} rounded-xl border border-gray-100 flex items-center justify-center overflow-hidden bg-gray-50`}>
                    {asset.fileUrl ? (
                      <img src={asset.fileUrl} alt={asset.assetName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center p-8">
                        <Image className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-xs text-gray-400">No asset</p>
                      </div>
                    )}
                    <button
                      onClick={() => setDeleteAssetTarget(asset)}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )
            })}
            {/* Add Channel Slot */}
            <div className="shrink-0 w-[320px]">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-transparent">Add Channel</span>
              </div>
              <button
                onClick={() => {
                  setSelectedChannels([])
                  setShowChannelPicker(true)
                }}
                className="aspect-square w-full rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-3 bg-gray-50/50 hover:border-violet-300 hover:bg-violet-50/30 transition-colors cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <Plus className="w-5 h-5 text-gray-400" />
                </div>
                <span className="text-sm font-medium text-gray-500">Add Channel</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

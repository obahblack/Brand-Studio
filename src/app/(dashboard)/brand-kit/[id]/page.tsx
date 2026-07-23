'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Palette, Type, Layers, Image, Download, Copy, Check, Edit2, Sparkles, ArrowLeft, Plus, Folder, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { InstagramIcon, FacebookIcon, TwitterXIcon, TikTokIcon, LinkedInIcon, YouTubeIcon, PinterestIcon, ThreadsIcon } from '@/components/icons/platform-icons'

const mockBrandKit = {
  id: '1',
  brand_name: 'Acme Corp',
  website_url: 'https://acme.com',
  brand_analysis: {
    personality: ['modern', 'innovative', 'professional'],
    audience: 'Tech-savvy professionals',
    tone: 'Confident',
    visualStyle: 'Clean and minimal',
  },
  color_palette: {
    primary: { '50': '#F5F3FF', '100': '#EDE9FE', '200': '#DDD6FE', '300': '#C4B5FD', '400': '#A78BFA', '500': '#8B5CF6', '600': '#7C3AED', '700': '#6D28D9', '800': '#5B21B6', '900': '#4C1D95' },
    secondary: { '50': '#F0FDF4', '100': '#DCFCE7', '200': '#BBF7D0', '300': '#86EFAC', '400': '#4ADE80', '500': '#22C55E', '600': '#16A34A', '700': '#15803D', '800': '#166534', '900': '#14532D' },
    accent: { '50': '#FFF7ED', '100': '#FFEDD5', '200': '#FED7AA', '300': '#FDBA74', '400': '#FB923C', '500': '#F97316', '600': '#EA580C', '700': '#C2410C', '800': '#9A3412', '900': '#7C2D12' },
    neutral: { '50': '#F9FAFB', '100': '#F3F4F6', '200': '#E5E7EB', '300': '#D1D5DB', '400': '#9CA3AF', '500': '#6B7280', '600': '#4B5563', '700': '#374151', '800': '#1F2937', '900': '#111827' },
  },
  typography: {
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
  },
  design_tokens: {
    spacing: { xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '32px', '2xl': '48px', '3xl': '64px' },
    borderRadius: { sm: '4px', md: '8px', lg: '12px', xl: '16px', '2xl': '24px', full: '9999px' },
    shadows: { sm: '0 1px 2px rgba(0,0,0,0.05)', md: '0 4px 6px rgba(0,0,0,0.07)', lg: '0 10px 15px rgba(0,0,0,0.1)', xl: '0 20px 25px rgba(0,0,0,0.1)' },
  },
  design_system: {
    buttons: {
      primary: { bg: '#7C3AED', text: '#FFFFFF', radius: '12px', padding: '12px 24px', fontSize: '16px', fontWeight: '600' },
      secondary: { bg: '#22C55E', text: '#FFFFFF', radius: '12px', padding: '12px 24px', fontSize: '16px', fontWeight: '600' },
      ghost: { bg: 'transparent', text: '#374151', radius: '12px', padding: '12px 24px', fontSize: '16px', fontWeight: '500' },
      destructive: { bg: '#EF4444', text: '#FFFFFF', radius: '12px', padding: '12px 24px', fontSize: '16px', fontWeight: '600' },
    },
  },
  status: 'completed' as const,
}

const platformConfigs = [
  { id: 'instagram', name: 'Instagram Post', ratio: '1:1', size: '1080 × 1080', icon: InstagramIcon, aspectClass: 'aspect-square' },
  { id: 'instagram-story', name: 'Instagram Story', ratio: '9:16', size: '1080 × 1920', icon: InstagramIcon, aspectClass: 'aspect-[9/16]' },
  { id: 'x', name: 'X / Twitter', ratio: '16:9', size: '1600 × 900', icon: TwitterXIcon, aspectClass: 'aspect-video' },
  { id: 'facebook', name: 'Facebook Post', ratio: '1:1', size: '1200 × 1200', icon: FacebookIcon, aspectClass: 'aspect-square' },
  { id: 'linkedin', name: 'LinkedIn Post', ratio: '1:1', size: '1200 × 1200', icon: LinkedInIcon, aspectClass: 'aspect-square' },
  { id: 'tiktok', name: 'TikTok', ratio: '9:16', size: '1080 × 1920', icon: TikTokIcon, aspectClass: 'aspect-[9/16]' },
  { id: 'youtube', name: 'YouTube Thumbnail', ratio: '16:9', size: '1280 × 720', icon: YouTubeIcon, aspectClass: 'aspect-video' },
  { id: 'pinterest', name: 'Pinterest Pin', ratio: '2:3', size: '1000 × 1500', icon: PinterestIcon, aspectClass: 'aspect-[2/3]' },
  { id: 'threads', name: 'Threads', ratio: '1:1', size: '1080 × 1080', icon: ThreadsIcon, aspectClass: 'aspect-square' },
]

const mockCampaigns = [
  {
    id: '1',
    name: 'Summer Sale 2025',
    createdAt: '2 hours ago',
    platforms: ['instagram', 'x', 'facebook', 'linkedin'],
  },
  {
    id: '2',
    name: 'Product Launch',
    createdAt: '1 day ago',
    platforms: ['instagram', 'instagram-story', 'x', 'tiktok'],
  },
  {
    id: '3',
    name: 'Brand Awareness',
    createdAt: '3 days ago',
    platforms: ['x', 'linkedin', 'youtube'],
  },
]

export default function BrandKitPage() {
  const brandKit = mockBrandKit
  const [copied, setCopied] = useState<string | null>(null)
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null)
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['instagram', 'x', 'facebook'])
  const [creatingCampaign, setCreatingCampaign] = useState(false)
  const [newCampaignName, setNewCampaignName] = useState('')

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value)
    setCopied(value)
    setTimeout(() => setCopied(null), 1500)
  }

  const togglePlatform = (id: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    )
  }

  const activeCampaign = mockCampaigns.find(c => c.id === selectedCampaign)

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-3">
            <ArrowLeft className="w-4 h-4" />
            Projects
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{brandKit.brand_name}</h1>
          {brandKit.website_url && (
            <p className="text-sm text-gray-500 mt-1">{brandKit.website_url}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-gray-200">
            <Edit2 className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button className="bg-violet-600 hover:bg-violet-700">
            <Sparkles className="w-4 h-4 mr-2" />
            Regenerate
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="assets" className="space-y-6">
        <Card className="border-gray-200">
          <CardContent className="p-5">
            {brandKit.brand_analysis && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-5 border-b border-gray-100 mb-5">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Personality</p>
                  <p className="text-sm font-medium text-gray-900">{brandKit.brand_analysis.personality.join(' · ')}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Audience</p>
                  <p className="text-sm font-medium text-gray-900">{brandKit.brand_analysis.audience}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Tone</p>
                  <p className="text-sm font-medium text-gray-900">{brandKit.brand_analysis.tone}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Visual Style</p>
                  <p className="text-sm font-medium text-gray-900">{brandKit.brand_analysis.visualStyle}</p>
                </div>
              </div>
            )}
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="assets" className="flex items-center gap-2">
                <Image className="w-4 h-4" />
                Assets
              </TabsTrigger>
              <TabsTrigger value="colors" className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Colors
              </TabsTrigger>
              <TabsTrigger value="typography" className="flex items-center gap-2">
                <Type className="w-4 h-4" />
                Typography
              </TabsTrigger>
              <TabsTrigger value="tokens" className="flex items-center gap-2">
                <Layers className="w-4 h-4" />
                Tokens
              </TabsTrigger>
              <TabsTrigger value="download" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download
              </TabsTrigger>
            </TabsList>
          </CardContent>
        </Card>

        {/* ==================== ASSETS TAB ==================== */}
        <TabsContent value="assets" className="space-y-6">
          {selectedCampaign ? (
            /* Campaign Detail View */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <button
                    onClick={() => setSelectedCampaign(null)}
                    className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    All Campaigns
                  </button>
                  <h2 className="text-2xl font-bold text-gray-900">{activeCampaign?.name}</h2>
                  <p className="text-sm text-gray-500 mt-1">Created {activeCampaign?.createdAt}</p>
                </div>
                <Button className="bg-violet-600 hover:bg-violet-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Social Media
                </Button>
              </div>

              {/* Platform Selector */}
              <Card className="border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Select Platforms</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {platformConfigs.map((platform) => (
                      <button
                        key={platform.id}
                        onClick={() => togglePlatform(platform.id)}
                        className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                          selectedPlatforms.includes(platform.id)
                            ? 'border-violet-500 bg-violet-50 text-violet-700'
                            : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'
                        }`}
                      >
                        <platform.icon className="w-4 h-4" />
                        {platform.name}
                        <span className="text-[10px] text-gray-400">{platform.ratio}</span>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Generated Assets per Platform */}
              {platformConfigs
                .filter(p => selectedPlatforms.includes(p.id))
                .map((platform) => (
                  <Card key={platform.id} className="border-gray-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                          <platform.icon className="w-5 h-5" />
                          {platform.name}
                          <span className="text-xs text-gray-400 font-normal">{platform.size}</span>
                        </CardTitle>
                        <Button variant="ghost" size="sm" className="text-violet-600">
                          <Sparkles className="w-4 h-4 mr-1" />
                          Generate
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className={`${platform.aspectClass} max-h-[300px] rounded-xl bg-gradient-to-br from-violet-50 to-indigo-50 flex items-center justify-center border border-gray-100`}>
                        <div className="text-center">
                          <Image className="w-8 h-8 text-violet-200 mx-auto mb-2" />
                          <p className="text-sm text-gray-400">No assets yet</p>
                          <p className="text-xs text-gray-300 mt-1">{platform.size}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          ) : (
            /* Campaign Groups List */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Asset Campaigns</h2>
                  <p className="text-sm text-gray-500 mt-1">Group your social media assets by campaign or project</p>
                </div>
                <Button
                  className="bg-violet-600 hover:bg-violet-700"
                  onClick={() => setCreatingCampaign(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Campaign
                </Button>
              </div>

              {/* New Campaign Form */}
              {creatingCampaign && (
                <Card className="border-violet-200 bg-violet-50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        placeholder="Campaign name (e.g., Summer Sale 2025)"
                        value={newCampaignName}
                        onChange={(e) => setNewCampaignName(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg border border-violet-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                        autoFocus
                      />
                      <Button
                        size="sm"
                        className="bg-violet-600 hover:bg-violet-700"
                        onClick={() => {
                          setCreatingCampaign(false)
                          setNewCampaignName('')
                        }}
                      >
                        Create
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setCreatingCampaign(false)
                          setNewCampaignName('')
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Campaign Cards */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockCampaigns.map((campaign) => (
                  <button
                    key={campaign.id}
                    onClick={() => setSelectedCampaign(campaign.id)}
                    className="text-left"
                  >
                    <Card className="border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer h-full">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
                            <Folder className="w-5 h-5 text-violet-600" />
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-300" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">{campaign.name}</h3>
                        <p className="text-xs text-gray-400 mb-3">{campaign.createdAt}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {campaign.platforms.map((pid) => {
                            const p = platformConfigs.find(pc => pc.id === pid)
                            return p ? (
                              <span key={pid} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-50 rounded-md text-xs text-gray-600">
                                <p.icon className="w-3.5 h-3.5" /> {p.name}
                              </span>
                            ) : null
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  </button>
                ))}

                {/* Create New Campaign Card */}
                <button
                  onClick={() => setCreatingCampaign(true)}
                  className="text-left"
                >
                  <Card className="border-2 border-dashed border-gray-200 hover:border-violet-300 transition-colors cursor-pointer h-full">
                    <CardContent className="p-5 flex flex-col items-center justify-center min-h-[180px]">
                      <div className="w-10 h-10 rounded-full bg-violet-50 flex items-center justify-center mb-3">
                        <Plus className="w-5 h-5 text-violet-600" />
                      </div>
                      <p className="font-medium text-gray-900">New Campaign</p>
                      <p className="text-xs text-gray-500 mt-1">Create a new asset group</p>
                    </CardContent>
                  </Card>
                </button>
              </div>
            </div>
          )}
        </TabsContent>

        {/* ==================== COLORS TAB ==================== */}
        <TabsContent value="colors" className="space-y-6">
          {Object.entries(brandKit.color_palette).map(([groupName, colors]) => (
            <Card key={groupName} className="border-gray-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base capitalize">{groupName}</CardTitle>
                  <Button variant="ghost" size="sm" className="text-gray-500">
                    <Edit2 className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  {Object.entries(colors).map(([shade, hex]) => (
                    <div key={shade} className="flex-1 group">
                      <button
                        onClick={() => handleCopy(hex)}
                        className="h-16 w-full rounded-lg cursor-pointer relative overflow-hidden border border-gray-100"
                        style={{ backgroundColor: hex }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10">
                          {copied === hex ? (
                            <Check className="w-4 h-4 text-white" />
                          ) : (
                            <Copy className="w-4 h-4 text-white" />
                          )}
                        </div>
                      </button>
                      <p className="text-[10px] text-gray-400 mt-1.5 text-center font-mono">{hex}</p>
                      <p className="text-[10px] text-gray-300 text-center">{shade}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* ==================== TYPOGRAPHY TAB ==================== */}
        <TabsContent value="typography" className="space-y-8">
          {/* Font Pairing */}
          <Card className="border-gray-200">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Font Pairing</CardTitle>
                <Button variant="ghost" size="sm" className="text-gray-500">
                  <Edit2 className="w-4 h-4 mr-1" />
                  Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="flex items-start gap-8">
                <div className="w-32 shrink-0">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Heading</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{brandKit.typography.headingFont}</p>
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
                  <p className="text-sm font-medium text-gray-900 mt-1">{brandKit.typography.bodyFont}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Weights: 400, 500</p>
                </div>
                <div className="flex-1 border-l border-gray-100 pl-8">
                  <p className="text-lg leading-relaxed text-gray-700">The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump!</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Type Scale */}
          <Card className="border-gray-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Type Scale</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(brandKit.typography.scale).map(([key, scale]) => {
                  const isHeading = key.startsWith('h') || key === 'display'
                  const fontFamily = isHeading ? brandKit.typography.headingFont : brandKit.typography.bodyFont
                  return (
                    <div key={key} className="flex items-start gap-8 pb-6 border-b border-gray-50 last:border-0 last:pb-0">
                      <div className="w-32 shrink-0 pt-1">
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{scale.label}</p>
                        <p className="text-[10px] text-gray-300 font-mono mt-1">{scale.size} / {scale.weight}</p>
                        <p className="text-[10px] text-gray-300 font-mono">leading {scale.lineHeight}</p>
                      </div>
                      <div className="flex-1">
                        <p
                          className="text-gray-900"
                          style={{
                            fontFamily,
                            fontSize: scale.size,
                            fontWeight: scale.weight,
                            lineHeight: scale.lineHeight,
                          }}
                        >
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
          {/* Spacing */}
          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Layers className="w-4 h-4 text-gray-400" />
                Spacing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(brandKit.design_tokens.spacing).map(([name, value]) => (
                  <button
                    key={name}
                    onClick={() => handleCopy(`--space-${name}: ${value};`)}
                    className="p-3 rounded-lg border border-gray-100 hover:border-gray-200 text-left transition-colors group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-mono font-medium text-gray-900">space-{name}</span>
                      {copied === `--space-${name}: ${value};` ? (
                        <Check className="w-3 h-3 text-emerald-500" />
                      ) : (
                        <Copy className="w-3 h-3 text-gray-300 group-hover:text-gray-500 transition-colors" />
                      )}
                    </div>
                    <span className="text-xs text-gray-500 font-mono">{value}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Border Radius */}
          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Border Radius</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(brandKit.design_tokens.borderRadius).map(([name, value]) => (
                  <button
                    key={name}
                    onClick={() => handleCopy(`--radius-${name}: ${value};`)}
                    className="p-3 rounded-lg border border-gray-100 hover:border-gray-200 text-left transition-colors group"
                  >
                    <div className="h-12 bg-violet-100 mb-2" style={{ borderRadius: value }} />
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-mono font-medium text-gray-900">radius-{name}</span>
                      {copied === `--radius-${name}: ${value};` ? (
                        <Check className="w-3 h-3 text-emerald-500" />
                      ) : (
                        <Copy className="w-3 h-3 text-gray-300 group-hover:text-gray-500 transition-colors" />
                      )}
                    </div>
                    <span className="text-xs text-gray-500 font-mono">{value}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Shadows */}
          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Shadows</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(brandKit.design_tokens.shadows).map(([name, value]) => (
                  <button
                    key={name}
                    onClick={() => handleCopy(`--shadow-${name}: ${value};`)}
                    className="p-3 rounded-lg border border-gray-100 hover:border-gray-200 text-left transition-colors group"
                  >
                    <div className="h-16 bg-white rounded-lg mb-2" style={{ boxShadow: value }} />
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-mono font-medium text-gray-900">shadow-{name}</span>
                      {copied === `--shadow-${name}: ${value};` ? (
                        <Check className="w-3 h-3 text-emerald-500" />
                      ) : (
                        <Copy className="w-3 h-3 text-gray-300 group-hover:text-gray-500 transition-colors" />
                      )}
                    </div>
                    <span className="text-xs text-gray-500 font-mono truncate block">{value}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Buttons */}
          {brandKit.design_system?.buttons && (
            <Card className="border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Buttons</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(brandKit.design_system.buttons).map(([type, style]) => (
                    <div key={type} className="space-y-2">
                      <p className="text-sm font-medium capitalize text-gray-700">{type}</p>
                      <button
                        className="w-full"
                        style={{
                          backgroundColor: style.bg,
                          color: style.text,
                          borderRadius: style.radius,
                          padding: style.padding,
                          fontSize: style.fontSize,
                          fontWeight: style.fontWeight,
                        }}
                      >
                        Button
                      </button>
                      <div className="text-[10px] text-gray-400 space-y-0.5">
                        <p>BG: {style.bg}</p>
                        <p>Radius: {style.radius}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ==================== DOWNLOAD TAB ==================== */}
        <TabsContent value="download" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-gray-200">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mb-3">
                  <Download className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Brand Guidelines PDF</h3>
                <p className="text-sm text-gray-500 mb-4">Complete brand guidelines document with all rules</p>
                <Button variant="outline" className="border-gray-200">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </CardContent>
            </Card>
            <Card className="border-gray-200">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-3">
                  <Download className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Complete Brand Kit</h3>
                <p className="text-sm text-gray-500 mb-4">ZIP with all assets, tokens, and design system</p>
                <Button variant="outline" className="border-gray-200">
                  <Download className="w-4 h-4 mr-2" />
                  Download ZIP
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

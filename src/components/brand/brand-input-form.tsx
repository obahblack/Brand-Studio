'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Upload, Globe, Sparkles, Loader2, ArrowRight, ArrowLeft, Check } from 'lucide-react'
import { InstagramIcon, FacebookIcon, TwitterXIcon, TikTokIcon, LinkedInIcon, YouTubeIcon, PinterestIcon, ThreadsIcon, EmailIcon } from '@/components/icons/platform-icons'


const marketingChannels = [
  { id: 'instagram', name: 'Instagram', icon: InstagramIcon, ratio: '1:1 / 4:5 / 9:16' },
  { id: 'facebook', name: 'Facebook', icon: FacebookIcon, ratio: '1:1 / 16:9' },
  { id: 'twitter', name: 'Twitter / X', icon: TwitterXIcon, ratio: '16:9' },
  { id: 'tiktok', name: 'TikTok', icon: TikTokIcon, ratio: '9:16' },
  { id: 'linkedin', name: 'LinkedIn', icon: LinkedInIcon, ratio: '1:1 / 16:9' },
  { id: 'youtube', name: 'YouTube', icon: YouTubeIcon, ratio: '16:9' },
  { id: 'pinterest', name: 'Pinterest', icon: PinterestIcon, ratio: '2:3' },
  { id: 'threads', name: 'Threads', icon: ThreadsIcon, ratio: '1:1 / 9:16' },
  { id: 'email', name: 'Email Header', icon: EmailIcon, ratio: '600:200' },
]

export function BrandInputForm() {
  const [step, setStep] = useState(1)
  const [brandName, setBrandName] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [brandDescription, setBrandDescription] = useState('')
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [selectedChannels, setSelectedChannels] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.svg', '.webp']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024
  })

  const toggleChannel = (channelId: string) => {
    setSelectedChannels(prev =>
      prev.includes(channelId)
        ? prev.filter(id => id !== channelId)
        : [...prev, channelId]
    )
  }

  const handleNextStep = () => {
    if (!brandName.trim()) {
      setError('Please enter a brand name')
      return
    }
    setError(null)
    setStep(2)
  }

  const handlePrevStep = () => {
    setStep(1)
  }

  const handleSubmit = async () => {
    if (!brandName.trim()) {
      setError('Please enter a brand name')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandName: brandName.trim(),
          websiteUrl: websiteUrl.trim() || null,
          brandDescription: brandDescription.trim() || null,
          logoUrl: logoPreview || null,
          platforms: selectedChannels,
        }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create brand kit')
      }
      router.push(`/brand-kit/${data.brandKitId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Create Your Brand Kit</CardTitle>
        </div>
        <CardDescription className="ml-[52px]">
          {step === 1
            ? 'Enter your brand details to get started'
            : 'Select where you want to create marketing assets'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Step Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center w-full">
            {/* Step 1 */}
            <div className="flex items-center gap-2">
              <div className={`flex items-center justify-center w-9 h-9 rounded-full border-2 transition-all duration-300 ${
                step >= 1
                  ? 'bg-violet-600 border-violet-600 text-white'
                  : 'bg-white border-gray-300 text-gray-400'
              }`}>
                {step > 1 ? <Check className="w-4 h-4" /> : <span className="text-sm font-semibold">1</span>}
              </div>
              <span className={`text-sm font-semibold whitespace-nowrap ${
                step >= 1 ? 'text-violet-600' : 'text-gray-400'
              }`}>
                Brand Info
              </span>
            </div>

            {/* Connector line - fills remaining width */}
            <div className="flex-1 mx-4 h-0.5 bg-gray-200 rounded-full overflow-hidden">
              <div className={`h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all duration-500 ease-out ${
                step >= 2 ? 'w-full' : 'w-0'
              }`} />
            </div>

            {/* Step 2 */}
            <div className="flex items-center gap-2">
              <div className={`flex items-center justify-center w-9 h-9 rounded-full border-2 transition-all duration-300 ${
                step >= 2
                  ? 'bg-violet-600 border-violet-600 text-white'
                  : 'bg-white border-gray-300 text-gray-400'
              }`}>
                <span className="text-sm font-semibold">2</span>
              </div>
              <span className={`text-sm font-semibold whitespace-nowrap ${
                step >= 2 ? 'text-violet-600' : 'text-gray-400'
              }`}>
                Channels
              </span>
            </div>
          </div>
        </div>

        {/* Step 1: Brand Info */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="brandName">Brand Name *</Label>
              <Input
                id="brandName"
                placeholder="Acme Inc"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="websiteUrl">Website URL</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="websiteUrl"
                  placeholder="https://example.com"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="brandDescription">Describe Your Brand</Label>
              <Textarea
                id="brandDescription"
                placeholder="Modern AI SaaS company focused on productivity tools for developers..."
                value={brandDescription}
                onChange={(e) => setBrandDescription(e.target.value)}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>Upload Logo (Optional)</Label>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
                }`}
              >
                <input {...getInputProps()} />
                {logoPreview ? (
                  <div className="flex flex-col items-center">
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="w-20 h-20 object-contain mb-2"
                    />
                    <p className="text-sm text-muted-foreground">Click to change</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                    <p className="text-sm font-medium">Drag & drop your logo here</p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG, SVG, or WebP (max 5MB)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            <Button type="button" className="w-full" size="lg" onClick={handleNextStep}>
              Continue to Channels
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {/* Step 2: Marketing Channels */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-3">
              {marketingChannels.map((channel) => (
                <button
                  key={channel.id}
                  type="button"
                  onClick={() => toggleChannel(channel.id)}
                  className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer hover:shadow-md ${
                    selectedChannels.includes(channel.id)
                      ? 'border-violet-500 bg-violet-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  {selectedChannels.includes(channel.id) && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-violet-500 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <channel.icon className="w-8 h-8 mb-2 text-gray-700" />
                  <span className="text-sm font-medium text-gray-900">{channel.name}</span>
                  <span className="text-xs text-gray-500 mt-1">{channel.ratio}</span>
                </button>
              ))}
            </div>

            <p className="text-sm text-muted-foreground text-center">
              {selectedChannels.length === 0
                ? 'Select at least one channel to continue'
                : `${selectedChannels.length} channel${selectedChannels.length > 1 ? 's' : ''} selected`
              }
            </p>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={handlePrevStep}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                type="button"
                size="lg"
                className="flex-1"
                onClick={handleSubmit}
                disabled={loading || selectedChannels.length === 0}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Brand Kit
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

'use client'

import { useState } from 'react'
import type { BrandKit, Asset } from '@/types/database'
import { ColorPaletteDisplay } from './color-palette-display'
import { TypographyDisplay } from './typography-display'
import { DesignTokensDisplay } from './design-tokens-display'
import { AssetsGallery } from './assets-gallery'
import { DownloadPanel } from './download-panel'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Palette, Type, Layers, Image, Download, Loader2 } from 'lucide-react'

interface BrandKitViewProps {
  brandKit: BrandKit
  assets: Asset[]
}

export function BrandKitView({ brandKit, assets }: BrandKitViewProps) {
  const [generatingAssets, setGeneratingAssets] = useState(false)

  const handleGenerateAssets = async () => {
    setGeneratingAssets(true)
    try {
      await fetch('/api/generate/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brandKitId: brandKit.id })
      })
      // Refresh page after generation starts
      window.location.reload()
    } catch (error) {
      console.error('Error generating assets:', error)
    } finally {
      setGeneratingAssets(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Brand Identity Header */}
      {brandKit.brand_analysis && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Brand Identity</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Personality</p>
              <p className="font-medium">
                {brandKit.brand_analysis.personality?.join(' · ') || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Audience</p>
              <p className="font-medium">{brandKit.brand_analysis.audience || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Tone</p>
              <p className="font-medium">{brandKit.brand_analysis.tone || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Visual Style</p>
              <p className="font-medium">{brandKit.brand_analysis.visualStyle || 'N/A'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="colors" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
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
          <TabsTrigger value="assets" className="flex items-center gap-2">
            <Image className="w-4 h-4" />
            Assets
          </TabsTrigger>
          <TabsTrigger value="download" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Download
          </TabsTrigger>
        </TabsList>

        <TabsContent value="colors">
          {brandKit.color_palette && (
            <ColorPaletteDisplay colors={brandKit.color_palette} />
          )}
        </TabsContent>

        <TabsContent value="typography">
          {brandKit.typography && (
            <TypographyDisplay typography={brandKit.typography} />
          )}
        </TabsContent>

        <TabsContent value="tokens">
          {brandKit.design_tokens && (
            <DesignTokensDisplay tokens={brandKit.design_tokens} designSystem={brandKit.design_system} />
          )}
        </TabsContent>

        <TabsContent value="assets">
          <AssetsGallery 
            assets={assets} 
            brandKitId={brandKit.id}
            onGenerateAssets={handleGenerateAssets}
            generating={generatingAssets}
          />
        </TabsContent>

        <TabsContent value="download">
          <DownloadPanel brandKit={brandKit} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

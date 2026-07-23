'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Download, Loader2, Sparkles } from 'lucide-react'
import type { Asset } from '@/types/database'

interface AssetsGalleryProps {
  assets: Asset[]
  brandKitId: string
  onGenerateAssets: () => void
  generating: boolean
}

export function AssetsGallery({ assets, brandKitId, onGenerateAssets, generating }: AssetsGalleryProps) {
  const socialAssets = assets.filter(a => a.asset_type.startsWith('social_'))

  if (socialAssets.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No assets yet</h3>
          <p className="text-muted-foreground text-center mb-4">
            Generate social media templates for your brand
          </p>
          <Button onClick={onGenerateAssets} disabled={generating}>
            {generating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Assets
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    )
  }

  const getAssetTitle = (type: string) => {
    const titles: Record<string, string> = {
      'social_linkedin-post': 'LinkedIn Post',
      'social_instagram-post': 'Instagram Post',
      'social_instagram-story': 'Instagram Story',
      'social_twitter-card': 'Twitter Card',
      'social_youtube-thumbnail': 'YouTube Thumbnail'
    }
    return titles[type] || type
  }

  const getAssetDimensions = (type: string) => {
    const dimensions: Record<string, string> = {
      'social_linkedin-post': '1200 × 627',
      'social_instagram-post': '1080 × 1080',
      'social_instagram-story': '1080 × 1920',
      'social_twitter-card': '1200 × 675',
      'social_youtube-thumbnail': '1280 × 720'
    }
    return dimensions[type] || 'Custom'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Marketing Assets</h3>
          <p className="text-sm text-muted-foreground">
            {socialAssets.length} assets generated
          </p>
        </div>
        <Button variant="outline" onClick={onGenerateAssets} disabled={generating}>
          {generating ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4 mr-2" />
          )}
          Regenerate
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {socialAssets.map((asset) => (
          <Card key={asset.id} className="overflow-hidden">
            <div className="aspect-video bg-muted relative">
              {asset.file_url && (
                <img
                  src={asset.file_url}
                  alt={asset.asset_name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium">{getAssetTitle(asset.asset_type)}</p>
                  <p className="text-xs text-muted-foreground">
                    {getAssetDimensions(asset.asset_type)}
                  </p>
                </div>
                <Badge variant="secondary">
                  {asset.file_type?.split('/')[1]?.toUpperCase() || 'PNG'}
                </Badge>
              </div>
              {asset.file_url && (
                <a 
                  href={asset.file_url} 
                  download={asset.asset_name}
                  className="inline-flex items-center justify-center w-full rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </a>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

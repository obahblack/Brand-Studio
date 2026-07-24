'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Copy, Check, ChevronDown, ChevronUp, Info, ExternalLink, Download } from 'lucide-react'
import type { ColorSystem, ColorToken, ColorPairing } from '@/types/database'

interface ColorStyleTabProps {
  colorSystem: ColorSystem | null
  colorPalette: Record<string, Record<string, string>> | null
  websiteUrl: string | null
  brandName: string
  onCopy: (value: string) => void
  copied: string | null
}

function TokenSwatch({ token, onCopy, copied, size = 'md' }: { token: ColorToken; onCopy: (v: string) => void; copied: string | null; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = { sm: 'h-8 w-8', md: 'h-10 w-10', lg: 'h-14 w-14' }
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onCopy(token.value)}
        className={`${sizeClasses[size]} rounded-lg border border-gray-200 cursor-pointer relative overflow-hidden shrink-0 group`}
        style={{ backgroundColor: token.value }}
      >
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10">
          {copied === token.value ? <Check className="w-3 h-3 text-white" /> : <Copy className="w-3 h-3 text-white" />}
        </div>
      </button>
      <div className="min-w-0">
        <p className="text-xs font-mono text-gray-700 truncate">{token.value}</p>
        {token.description && <p className="text-[10px] text-gray-400 truncate">{token.description}</p>}
      </div>
    </div>
  )
}

function SourceBadge({ source }: { source: ColorToken['source'] }) {
  const styles = {
    extracted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    inferred: 'bg-blue-50 text-blue-700 border-blue-200',
    generated: 'bg-gray-50 text-gray-600 border-gray-200',
    manually_overridden: 'bg-amber-50 text-amber-700 border-amber-200',
  }
  const labels = { extracted: 'Extracted', inferred: 'Inferred', generated: 'Generated', manually_overridden: 'Overridden' }
  return (
    <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${styles[source]}`}>
      {labels[source]}
    </span>
  )
}

function ContrastBadge({ ratio, passesAA }: { ratio: number; passesAA: boolean }) {
  return (
    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
      passesAA ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
    }`}>
      {ratio.toFixed(1)}:1 {passesAA ? 'AA' : 'FAIL'}
    </span>
  )
}

function TokenRow({ label, token, onCopy, copied }: { label: string; token: ColorToken; onCopy: (v: string) => void; copied: string | null }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
      <div className="flex items-center gap-2 min-w-0">
        <TokenSwatch token={token} onCopy={onCopy} copied={copied} size="sm" />
        <div className="min-w-0">
          <p className="text-sm text-gray-800 font-medium">{label}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <SourceBadge source={token.source} />
      </div>
    </div>
  )
}

function StatusPreview({ label, fg, bg, border }: { label: string; fg: string; bg: string; border: string }) {
  return (
    <div className="rounded-lg border p-3" style={{ backgroundColor: bg, borderColor: border }}>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: fg }} />
        <span className="text-sm font-medium" style={{ color: fg }}>{label}</span>
      </div>
    </div>
  )
}

function ButtonPreview({ label, bg, text, hoverBg }: { label: string; bg: string; text: string; hoverBg?: string }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
      <div className="flex gap-2">
        <button
          className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{ backgroundColor: bg, color: text }}
        >
          Default
        </button>
        <button
          className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{ backgroundColor: hoverBg || bg, color: text, opacity: 0.85 }}
        >
          Hover
        </button>
      </div>
    </div>
  )
}

function SocialPostPreview({ colors }: { colors: Record<string, ColorToken> }) {
  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm max-w-[280px]">
      <div className="p-4" style={{ backgroundColor: colors['background-primary']?.value || '#6366F1' }}>
        <p className="text-lg font-bold mb-1" style={{ color: colors.headline?.value || '#FFFFFF' }}>
          Your Brand Headline
        </p>
        <p className="text-sm mb-3" style={{ color: colors['body-text']?.value || '#E5E7EB' }}>
          Supporting body text for your social media post content.
        </p>
        <div className="inline-block px-3 py-1.5 rounded-lg text-xs font-semibold"
          style={{ backgroundColor: colors['cta-background']?.value || '#F59E0B', color: colors['cta-text']?.value || '#000000' }}>
          Learn More
        </div>
      </div>
      <div className="h-2" style={{ backgroundColor: colors['decorative-accent']?.value || '#22C55E' }} />
    </div>
  )
}

export function ColorStyleTab({ colorSystem, colorPalette, websiteUrl, brandName, onCopy, copied }: ColorStyleTabProps) {
  const [showPrimitive, setShowPrimitive] = useState(false)

  if (!colorSystem) {
    return (
      <Card className="border-gray-200">
        <CardContent className="py-12 text-center">
          <p className="text-gray-500">No color system generated yet</p>
        </CardContent>
      </Card>
    )
  }

  const { semantic, component, social, primitive, pairings, sourceType, status, lastAnalyzedAt, generatedRationale } = colorSystem

  const statusColors: Record<string, string> = {
    website: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    generated: 'bg-violet-50 text-violet-700 border-violet-200',
    partially_extracted: 'bg-amber-50 text-amber-700 border-amber-200',
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Color System</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${statusColors[sourceType] || statusColors.generated}`}>
              {sourceType === 'website' ? 'Extracted from website' : sourceType === 'partially_extracted' ? 'Partially extracted' : 'AI-generated'}
            </span>
            {lastAnalyzedAt && (
              <span className="text-xs text-gray-400">Updated {new Date(lastAnalyzedAt).toLocaleDateString()}</span>
            )}
          </div>
          {generatedRationale && (
            <p className="text-xs text-gray-500 mt-1 max-w-xl">{generatedRationale}</p>
          )}
        </div>
        {websiteUrl && (
          <Button variant="outline" size="sm" className="border-gray-200 text-xs">
            <ExternalLink className="w-3 h-3 mr-1" /> Reanalyze
          </Button>
        )}
      </div>

      {/* Section 1: Brand Foundation */}
      <Card className="border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Brand Foundation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <TokenRow label="Primary" token={semantic.brand.primary} onCopy={onCopy} copied={copied} />
          <TokenRow label="Primary Hover" token={semantic.brand['primary-hover']} onCopy={onCopy} copied={copied} />
          <TokenRow label="Primary Active" token={semantic.brand['primary-active']} onCopy={onCopy} copied={copied} />
          <TokenRow label="Secondary" token={semantic.brand.secondary} onCopy={onCopy} copied={copied} />
          <TokenRow label="Secondary Hover" token={semantic.brand['secondary-hover']} onCopy={onCopy} copied={copied} />
          <TokenRow label="Accent" token={semantic.brand.accent} onCopy={onCopy} copied={copied} />
          <TokenRow label="Accent Subtle" token={semantic.brand['accent-subtle']} onCopy={onCopy} copied={copied} />
        </CardContent>
      </Card>

      {/* Section 2: Backgrounds and Surfaces */}
      <Card className="border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Backgrounds & Surfaces</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(semantic.background).map(([key, token]) => (
              <div key={key} className="space-y-1">
                <div className="rounded-lg border border-gray-200 h-16 relative overflow-hidden"
                  style={{ backgroundColor: token.value }}>
                  <button onClick={() => onCopy(token.value)}
                    className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/5">
                    {copied === token.value ? <Check className="w-4 h-4 text-gray-600" /> : <Copy className="w-4 h-4 text-gray-600" />}
                  </button>
                </div>
                <p className="text-xs font-medium text-gray-700 capitalize">{key.replace(/-/g, ' ')}</p>
                <p className="text-[10px] font-mono text-gray-400">{token.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Text and Icon Colors */}
      <Card className="border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Text & Icons</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {Object.entries(semantic.text).map(([key, token]) => (
              <TokenRow key={key} label={key.replace(/-/g, ' ')} token={token} onCopy={onCopy} copied={copied} />
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Icons</p>
            <div className="space-y-1">
              <TokenRow label="Default Icon" token={component.icon.default} onCopy={onCopy} copied={copied} />
              <TokenRow label="Muted Icon" token={component.icon.muted} onCopy={onCopy} copied={copied} />
              <TokenRow label="Inverse Icon" token={component.icon.inverse} onCopy={onCopy} copied={copied} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 4: Borders and Dividers */}
      <Card className="border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Borders & Dividers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {Object.entries(semantic.border).map(([key, token]) => (
              <TokenRow key={key} label={key.replace(/-/g, ' ')} token={token} onCopy={onCopy} copied={copied} />
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <TokenRow label="Divider" token={component.divider.default} onCopy={onCopy} copied={copied} />
          </div>
        </CardContent>
      </Card>

      {/* Section 5: Status Colors */}
      <Card className="border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Status Colors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatusPreview label="Informational" fg={semantic.status.info.value} bg={semantic.status['info-background'].value} border={semantic.status.info.value} />
            <StatusPreview label="Success" fg={semantic.status.success.value} bg={semantic.status['success-background'].value} border={semantic.status.success.value} />
            <StatusPreview label="Warning" fg={semantic.status.warning.value} bg={semantic.status['warning-background'].value} border={semantic.status.warning.value} />
            <StatusPreview label="Error" fg={semantic.status.error.value} bg={semantic.status['error-background'].value} border={semantic.status.error.value} />
          </div>
        </CardContent>
      </Card>

      {/* Section 6: Button States */}
      <Card className="border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Button States</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <ButtonPreview label="Primary" bg={component['button-primary'].background.value} text={component['button-primary'].text.value} hoverBg={component['button-primary']['background-hover'].value} />
          <ButtonPreview label="Secondary" bg={component['button-secondary'].background.value} text={component['button-secondary'].text.value} hoverBg={component['button-secondary']['background-hover'].value} />
          <ButtonPreview label="Destructive" bg={component['button-destructive'].background.value} text={component['button-destructive'].text.value} hoverBg={component['button-destructive']['background-hover'].value} />
        </CardContent>
      </Card>

      {/* Section 7: Social Media Colors */}
      <Card className="border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Social Media Application</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-4">
            <SocialPostPreview colors={social as unknown as Record<string, ColorToken>} />
            <div className="flex-1 min-w-[200px] space-y-2">
              {Object.entries(social).map(([key, token]) => (
                <TokenRow key={key} label={key.replace(/-/g, ' ')} token={token} onCopy={onCopy} copied={copied} />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 8: Recommended Pairings */}
      <Card className="border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Recommended Color Pairings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pairings.map((pairing: ColorPairing, i: number) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100">
                <div className="flex shrink-0">
                  <div className="w-8 h-8 rounded-l-lg border border-gray-200" style={{ backgroundColor: pairing.background }} />
                  <div className="w-8 h-8 rounded-r-lg border border-gray-200 border-l-0 flex items-center justify-center" style={{ backgroundColor: pairing.background }}>
                    <span className="text-xs font-bold" style={{ color: pairing.foreground }}>Aa</span>
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-gray-700 truncate">{pairing.usage}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <ContrastBadge ratio={pairing.contrastRatio} passesAA={pairing.passesAA} />
                    {pairing.recommendedAssetType && (
                      <span className="text-[10px] text-gray-400">{pairing.recommendedAssetType}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Section 9: Primitive Palette (collapsible) */}
      <Card className="border-gray-200">
        <button
          onClick={() => setShowPrimitive(!showPrimitive)}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
        >
          <CardTitle className="text-base">Advanced Primitive Palette</CardTitle>
          {showPrimitive ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </button>
        {showPrimitive && (
          <CardContent className="pt-0 space-y-4">
            {Object.entries(primitive).map(([groupName, shades]) => (
              <div key={groupName}>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 capitalize">{groupName}</p>
                <div className="flex gap-1">
                  {Object.entries(shades).map(([shade, token]) => (
                    <button key={shade} onClick={() => onCopy(token.value)}
                      className="flex-1 group relative">
                      <div className="h-10 w-full rounded-md border border-gray-100 cursor-pointer"
                        style={{ backgroundColor: token.value }}>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10 rounded-md">
                          {copied === token.value ? <Check className="w-3 h-3 text-white" /> : <Copy className="w-3 h-3 text-white" />}
                        </div>
                      </div>
                      <p className="text-[9px] text-gray-400 mt-0.5 text-center font-mono">{shade}</p>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        )}
      </Card>
    </div>
  )
}

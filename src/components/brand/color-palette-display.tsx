'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Copy, Check } from 'lucide-react'
import type { ColorPalette } from '@/types/database'

interface ColorPaletteDisplayProps {
  colors: ColorPalette
}

export function ColorPaletteDisplay({ colors }: ColorPaletteDisplayProps) {
  const [copiedColor, setCopiedColor] = useState<string | null>(null)

  const copyToClipboard = (color: string) => {
    navigator.clipboard.writeText(color)
    setCopiedColor(color)
    setTimeout(() => setCopiedColor(null), 2000)
  }

  const colorGroups = [
    { name: 'Primary', colors: colors.primary },
    { name: 'Secondary', colors: colors.secondary },
    { name: 'Accent', colors: colors.accent },
    { name: 'Neutral', colors: colors.neutral }
  ]

  return (
    <div className="space-y-6">
      {colorGroups.map((group) => (
        <Card key={group.name}>
          <CardHeader>
            <CardTitle className="text-lg">{group.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {Object.entries(group.colors).map(([shade, color]) => (
                <div key={shade} className="flex flex-col items-center gap-2">
                  <button
                    onClick={() => copyToClipboard(color)}
                    className="w-16 h-16 rounded-xl shadow-sm hover:shadow-md transition-shadow relative group"
                    style={{ backgroundColor: color }}
                    title={`Click to copy ${color}`}
                  >
                    <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      {copiedColor === color ? (
                        <Check className="w-5 h-5 text-white drop-shadow" />
                      ) : (
                        <Copy className="w-4 h-4 text-white drop-shadow" />
                      )}
                    </span>
                  </button>
                  <div className="text-center">
                    <p className="text-xs font-medium">{shade}</p>
                    <p className="text-xs text-muted-foreground font-mono">{color}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {colors.background && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Background</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {Object.entries(colors.background).map(([variant, color]) => (
                <div key={variant} className="flex flex-col items-center gap-2">
                  <button
                    onClick={() => copyToClipboard(color)}
                    className="w-16 h-16 rounded-xl shadow-sm border hover:shadow-md transition-shadow relative group"
                    style={{ backgroundColor: color }}
                    title={`Click to copy ${color}`}
                  >
                    <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      {copiedColor === color ? (
                        <Check className="w-5 h-5 text-gray-800 drop-shadow" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-800 drop-shadow" />
                      )}
                    </span>
                  </button>
                  <div className="text-center">
                    <p className="text-xs font-medium">{variant}</p>
                    <p className="text-xs text-muted-foreground font-mono">{color}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

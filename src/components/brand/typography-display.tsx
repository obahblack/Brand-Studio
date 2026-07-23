'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Typography } from '@/types/database'

interface TypographyDisplayProps {
  typography: Typography
}

export function TypographyDisplay({ typography }: TypographyDisplayProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Font Families</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Heading Font</p>
              <p className="text-2xl font-semibold" style={{ fontFamily: typography.headingFont }}>
                {typography.headingFont}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Used for headlines and headings
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Body Font</p>
              <p className="text-2xl" style={{ fontFamily: typography.bodyFont }}>
                {typography.bodyFont}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Used for body text and paragraphs
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Type Scale</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(typography.scale).map(([key, scale]) => (
              <div key={key} className="flex items-baseline justify-between pb-4 border-b last:border-0">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">{key.toUpperCase()}</p>
                  <p 
                    style={{ 
                      fontFamily: key.startsWith('h') ? typography.headingFont : typography.bodyFont,
                      fontSize: scale.size,
                      fontWeight: scale.weight,
                      lineHeight: scale.lineHeight
                    }}
                  >
                    The quick brown fox jumps over the lazy dog
                  </p>
                </div>
                <div className="text-right text-sm text-muted-foreground ml-4">
                  <p>{scale.size}</p>
                  <p>Weight: {scale.weight}</p>
                  <p>Line Height: {scale.lineHeight}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

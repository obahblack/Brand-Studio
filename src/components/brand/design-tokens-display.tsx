'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { DesignTokens, DesignSystem } from '@/types/database'

interface DesignTokensDisplayProps {
  tokens: DesignTokens
  designSystem: DesignSystem | null
}

export function DesignTokensDisplay({ tokens, designSystem }: DesignTokensDisplayProps) {
  return (
    <Tabs defaultValue="buttons" className="space-y-6">
      <TabsList>
        <TabsTrigger value="buttons">Buttons</TabsTrigger>
        <TabsTrigger value="cards">Cards</TabsTrigger>
        <TabsTrigger value="forms">Forms</TabsTrigger>
        <TabsTrigger value="spacing">Spacing</TabsTrigger>
        <TabsTrigger value="shadows">Shadows</TabsTrigger>
      </TabsList>

      <TabsContent value="buttons">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Button Styles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {designSystem?.buttons && Object.entries(designSystem.buttons).map(([type, style]) => (
                <div key={type} className="space-y-2">
                  <p className="text-sm font-medium capitalize">{type}</p>
                  <button
                    className="w-full"
                    style={{
                      backgroundColor: style.bg,
                      color: style.text,
                      borderRadius: style.radius,
                      padding: style.padding,
                      fontSize: style.fontSize,
                      fontWeight: style.fontWeight,
                      border: style.border || 'none'
                    }}
                  >
                    Button
                  </button>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>BG: {style.bg}</p>
                    <p>Radius: {style.radius}</p>
                    <p>Padding: {style.padding}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="cards">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Card Styles</CardTitle>
          </CardHeader>
          <CardContent>
            {designSystem?.cards && (
              <div className="space-y-4">
                <div 
                  className="p-6"
                  style={{
                    backgroundColor: designSystem.cards.bg,
                    border: designSystem.cards.border,
                    borderRadius: designSystem.cards.radius,
                    boxShadow: designSystem.cards.shadow,
                    padding: designSystem.cards.padding
                  }}
                >
                  <h3 className="text-lg font-semibold mb-2">Card Title</h3>
                  <p className="text-muted-foreground">This is an example card using your design tokens.</p>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Background: {designSystem.cards.bg}</p>
                  <p>Border: {designSystem.cards.border}</p>
                  <p>Radius: {designSystem.cards.radius}</p>
                  <p>Shadow: {designSystem.cards.shadow}</p>
                  <p>Padding: {designSystem.cards.padding}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="forms">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Form Styles</CardTitle>
          </CardHeader>
          <CardContent>
            {designSystem?.forms && (
              <div className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <label 
                    className="text-sm font-medium"
                    style={{
                      fontSize: designSystem.forms.label.fontSize,
                      fontWeight: designSystem.forms.label.fontWeight,
                      color: designSystem.forms.label.color
                    }}
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    className="w-full"
                    style={{
                      backgroundColor: designSystem.forms.input.bg,
                      border: designSystem.forms.input.border,
                      borderRadius: designSystem.forms.input.radius,
                      padding: designSystem.forms.input.padding
                    }}
                  />
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Input BG: {designSystem.forms.input.bg}</p>
                  <p>Input Border: {designSystem.forms.input.border}</p>
                  <p>Input Radius: {designSystem.forms.input.radius}</p>
                  <p>Input Padding: {designSystem.forms.input.padding}</p>
                  <p>Focus Border: {designSystem.forms.input.focusBorder}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="spacing">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Spacing Scale</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(tokens.spacing).map(([key, value]) => (
                <div key={key} className="flex items-center gap-4">
                  <p className="w-12 text-sm font-medium">{key}</p>
                  <div 
                    className="h-4 bg-primary/20"
                    style={{ width: value }}
                  />
                  <p className="text-sm text-muted-foreground">{value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="shadows">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Shadow Styles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(tokens.shadows).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <div 
                    className="h-24 bg-white rounded-lg"
                    style={{ boxShadow: value }}
                  />
                  <p className="text-sm font-medium">{key}</p>
                  <p className="text-xs text-muted-foreground break-all">{value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

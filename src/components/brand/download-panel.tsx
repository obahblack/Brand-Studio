'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, FileText, Archive, Loader2 } from 'lucide-react'
import type { BrandKit } from '@/types/database'

interface DownloadPanelProps {
  brandKit: BrandKit
}

export function DownloadPanel({ brandKit }: DownloadPanelProps) {
  const [downloadingPdf, setDownloadingPdf] = useState(false)
  const [downloadingZip, setDownloadingZip] = useState(false)

  const handleDownloadPdf = async () => {
    setDownloadingPdf(true)
    try {
      const response = await fetch(`/api/download/pdf/${brandKit.id}`)
      if (!response.ok) throw new Error('Download failed')
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${brandKit.brand_name}-Guidelines.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error downloading PDF:', error)
    } finally {
      setDownloadingPdf(false)
    }
  }

  const handleDownloadZip = async () => {
    setDownloadingZip(true)
    try {
      const response = await fetch(`/api/download/zip/${brandKit.id}`)
      if (!response.ok) throw new Error('Download failed')
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${brandKit.brand_name}-Brand-Kit.zip`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error downloading ZIP:', error)
    } finally {
      setDownloadingZip(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Export Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-2 border-dashed hover:border-primary/50 transition-colors">
              <CardContent className="flex flex-col items-center justify-center py-8">
                <FileText className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">Brand Guidelines PDF</h3>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Complete brand guidelines document with all rules and specifications
                </p>
                <Button onClick={handleDownloadPdf} disabled={downloadingPdf}>
                  {downloadingPdf ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4 mr-2" />
                  )}
                  Download PDF
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-dashed hover:border-primary/50 transition-colors">
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Archive className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">Complete Brand Kit</h3>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  ZIP package with all assets, templates, and design tokens
                </p>
                <Button onClick={handleDownloadZip} disabled={downloadingZip}>
                  {downloadingZip ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4 mr-2" />
                  )}
                  Download ZIP
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Package Contents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-3 py-2">
              <div className="w-8 h-8 rounded bg-red-100 flex items-center justify-center">
                <FileText className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <p className="font-medium">Brand-Guidelines.pdf</p>
                <p className="text-sm text-muted-foreground">Complete brand guidelines</p>
              </div>
            </div>
            <div className="flex items-center gap-3 py-2">
              <div className="w-8 h-8 rounded bg-yellow-100 flex items-center justify-center">
                <span className="text-yellow-600 text-xs font-mono">{'{}'}</span>
              </div>
              <div>
                <p className="font-medium">Colors.json</p>
                <p className="text-sm text-muted-foreground">Color palette definitions</p>
              </div>
            </div>
            <div className="flex items-center gap-3 py-2">
              <div className="w-8 h-8 rounded bg-purple-100 flex items-center justify-center">
                <span className="text-purple-600 text-xs font-mono">{'{}'}</span>
              </div>
              <div>
                <p className="font-medium">Design-System.json</p>
                <p className="text-sm text-muted-foreground">Complete design system</p>
              </div>
            </div>
            <div className="flex items-center gap-3 py-2">
              <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 text-xs font-mono">CSS</span>
              </div>
              <div>
                <p className="font-medium">design-tokens.css</p>
                <p className="text-sm text-muted-foreground">CSS custom properties</p>
              </div>
            </div>
            <div className="flex items-center gap-3 py-2">
              <div className="w-8 h-8 rounded bg-green-100 flex items-center justify-center">
                <Archive className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Social-Assets/</p>
                <p className="text-sm text-muted-foreground">Social media templates</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
        <AlertTriangle className="w-6 h-6 text-red-600" />
      </div>
      <div className="text-center">
        <h2 className="text-lg font-semibold text-gray-900">Something went wrong</h2>
        <p className="text-sm text-gray-500 mt-1">An unexpected error occurred</p>
      </div>
      <Button onClick={reset} variant="outline" className="border-gray-200">
        Try again
      </Button>
    </div>
  )
}
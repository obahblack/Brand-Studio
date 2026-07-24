'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle, ArrowLeft } from 'lucide-react'

const errorMessages: Record<string, { title: string; message: string }> = {
  unable_to_create_user: {
    title: 'Account creation failed',
    message:
      'We could not finish creating your account. Please try again. If the issue continues, contact support.',
  },
  access_denied: {
    title: 'Access denied',
    message:
      'The sign-in request was denied. You may have cancelled the login or the account does not have permission.',
  },
  state_mismatch: {
    title: 'Session mismatch',
    message:
      'The sign-in session could not be verified. Please try again from the login page.',
  },
  invalid_callback: {
    title: 'Invalid callback',
    message:
      'The authentication response was invalid. Please try signing in again.',
  },
  default: {
    title: 'Authentication error',
    message:
      'Something went wrong during authentication. Please try again.',
  },
}

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const code = searchParams.get('error') || 'default'
  const error = errorMessages[code] || errorMessages.default

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f8f8] px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-xl font-bold text-gray-900">
            {error.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-500 text-center">{error.message}</p>
          <div className="flex flex-col gap-2">
            <Link href="/login">
              <Button className="w-full bg-violet-600 hover:bg-violet-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Return to Login
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full border-gray-200">
                Go to Homepage
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#f8f8f8]">
          <Card className="w-full max-w-md shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-xl font-bold text-gray-900">
                Loading...
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
      }
    >
      <AuthErrorContent />
    </Suspense>
  )
}

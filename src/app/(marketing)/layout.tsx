import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'
import { Footer } from '@/components/landing/footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Brand Kit Generator',
  description: 'Generate your complete brand system and marketing kit in minutes',
}

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      <main>{children}</main>
      <Footer />
    </div>
  )
}

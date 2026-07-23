'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, ChevronDown, Settings, CreditCard, BarChart3, LogOut, User, LayoutDashboard, Sidebar } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { authClient } from '@/lib/auth-client'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = async () => {
    await authClient.signOut()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      {/* Top Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          {/* Left: Logo */}
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-lg text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>Brand Studio</span>
          </Link>

          {/* Center: V1 / V2 Toggle */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
            <Link
              href="/dashboard"
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                pathname.startsWith('/dashboard') && !pathname.startsWith('/v2')
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              V1
            </Link>
            <Link
              href="/v2"
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                pathname.startsWith('/v2')
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              V2
            </Link>
          </div>

          {/* Right: User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center">
                <User className="w-4 h-4 text-violet-600" />
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl border border-gray-200 shadow-lg z-50 py-2">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">Account</p>
                    <p className="text-xs text-gray-500">Free Plan</p>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/dashboard/settings"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Settings className="w-4 h-4 text-gray-400" />
                      General Settings
                    </Link>
                    <Link
                      href="/dashboard/subscription"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <CreditCard className="w-4 h-4 text-gray-400" />
                      Subscription
                    </Link>
                    <Link
                      href="/dashboard/usage"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <BarChart3 className="w-4 h-4 text-gray-400" />
                      Usage
                    </Link>
                  </div>
                  <div className="border-t border-gray-100 py-1">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full"
                    >
                      <LogOut className="w-4 h-4" />
                      Log out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  )
}

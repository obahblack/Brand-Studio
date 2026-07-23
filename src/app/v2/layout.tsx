'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Sparkles, Plus, FolderOpen, LogOut, User, ChevronDown } from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import SettingsModal from '@/components/settings-modal'

export default function V2Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [settingsTab, setSettingsTab] = useState<'settings' | 'notifications' | 'subscription'>('settings')
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = async () => {
    await authClient.signOut()
    router.push('/')
  }

  const navItems = [
    { href: '/v2/create', label: 'Create', icon: Plus },
    { href: '/v2/projects', label: 'Projects', icon: FolderOpen },
  ]

  const isActive = (href: string) => pathname.startsWith(href)

  return (
    <div className="h-screen bg-[#f8f8f8] flex overflow-hidden">
      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        defaultTab={settingsTab}
      />

      {/* Sidebar */}
      <aside className="h-screen w-[240px] bg-white border-r border-gray-200 flex flex-col shrink-0">
        {/* Logo + Toggle */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
          <Link href="/v2/projects" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>
              Brand Studio
            </span>
          </Link>
          <div className="w-20" />
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? 'bg-violet-50 text-violet-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Bottom Nav - User */}
        <div className="px-3 py-4 border-t border-gray-100">
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 w-full"
            >
              <div className="w-5 h-5 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
                <User className="w-3 h-3 text-violet-600" />
              </div>
              <span className="flex-1 text-left">Account</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                <div className="absolute bottom-full left-0 mb-2 w-56 bg-white rounded-xl border border-gray-200 shadow-lg z-50 py-2">
                  <button
                    onClick={() => { setDropdownOpen(false); setSettingsTab('settings'); setSettingsOpen(true) }}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 w-full"
                  >
                    <User className="w-4 h-4" />
                    Settings
                  </button>
                  <button
                    onClick={() => { setDropdownOpen(false); setSettingsTab('notifications'); setSettingsOpen(true) }}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 w-full"
                  >
                    <Sparkles className="w-4 h-4" />
                    Notifications
                  </button>
                  <button
                    onClick={() => { setDropdownOpen(false); setSettingsTab('subscription'); setSettingsOpen(true) }}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 w-full"
                  >
                    <Sparkles className="w-4 h-4" />
                    Subscription
                  </button>
                  <div className="border-t border-gray-100 my-1" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full"
                  >
                    <LogOut className="w-4 h-4" />
                    Log out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="pl-6 pr-8 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}

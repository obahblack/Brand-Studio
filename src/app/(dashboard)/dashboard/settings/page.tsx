'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { User, Shield, Trash2, Loader2 } from 'lucide-react'

interface UserProfile {
  name: string
  email: string
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile>({ name: '', email: '' })
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/auth/session')
      if (response.ok) {
        const data = await response.json()
        if (data?.user) {
          setProfile(data.user)
          setName(data.user.name || '')
          setEmail(data.user.email || '')
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 1000))
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">General Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your account settings and preferences</p>
      </div>

      {/* Profile */}
      <Card className="border-gray-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <User className="w-4 h-4 text-gray-400" />
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-violet-100 flex items-center justify-center">
              <User className="w-8 h-8 text-violet-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{name}</p>
              <p className="text-sm text-gray-500">{email}</p>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Account Type</Label>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">Free Plan</span>
              <Button variant="link" className="text-violet-600 text-sm p-0">Upgrade</Button>
            </div>
          </div>
          <div className="pt-2">
            <Button onClick={handleSave} disabled={saving} className="bg-violet-600 hover:bg-violet-700">
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="border-gray-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="w-4 h-4 text-gray-400" />
            Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input id="current-password" type="password" placeholder="Enter current password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input id="new-password" type="password" placeholder="Enter new password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input id="confirm-password" type="password" placeholder="Confirm new password" />
          </div>
          <div className="pt-2">
            <Button variant="outline" className="border-gray-200">
              Update Password
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2 text-red-600">
            <Trash2 className="w-4 h-4" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <Button className="bg-red-600 hover:bg-red-700 text-white">
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { User, Shield, Trash2 } from 'lucide-react'

export default function V2SettingsPage() {
  const [name, setName] = useState('Praise Obah')
  const [email, setEmail] = useState('obahsomto@gmail.com')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 1000))
    setSaving(false)
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your account settings</p>
      </div>

      <Card className="border-gray-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <User className="w-4 h-4 text-gray-400" />
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <Button onClick={handleSave} disabled={saving} className="bg-violet-600 hover:bg-violet-700">
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardContent>
      </Card>

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
          <Button variant="outline" className="border-gray-200">Update Password</Button>
        </CardContent>
      </Card>

      <Card className="border-red-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2 text-red-600">
            <Trash2 className="w-4 h-4" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mb-4">Once you delete your account, there is no going back.</p>
          <Button className="bg-red-600 hover:bg-red-700 text-white">Delete Account</Button>
        </CardContent>
      </Card>
    </div>
  )
}

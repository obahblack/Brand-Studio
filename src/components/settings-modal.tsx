'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X, User, Bell, CreditCard, Shield, Trash2, Check, Zap, ArrowLeft, ExternalLink, Loader2 } from 'lucide-react'

type SettingsTab = 'settings' | 'notifications' | 'subscription'

interface SettingsModalProps {
  open: boolean
  onClose: () => void
  defaultTab?: SettingsTab
}

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    description: 'For individuals getting started',
    features: ['1 brand kit', 'Basic color palette', 'Typography recommendations', 'PNG export', '5 AI generations/month'],
    current: true,
  },
  {
    name: 'Pro',
    price: '$29.99',
    period: '/month',
    description: 'For professionals and growing teams',
    features: ['Unlimited brand kits', 'Advanced color systems', 'Full typography package', 'Design tokens', 'PDF + ZIP export', 'Social media templates', 'Brand guidelines document', 'Priority support', 'Unlimited AI generations'],
    current: false,
    popular: true,
  },
]

const proPlanDetails = {
  name: 'Pro',
  price: '$29.99',
  period: '/month',
  features: [
    { title: 'Unlimited Brand Kits', description: 'Create as many brand kits as you need for all your projects' },
    { title: 'Advanced Color Systems', description: 'Full color palettes with shades, tints, and accessibility checks' },
    { title: 'Full Typography Package', description: 'Complete type scale with heading and body font pairings' },
    { title: 'Design Tokens', description: 'Export spacing, border radius, shadows, and component tokens' },
    { title: 'PDF + ZIP Export', description: 'Download brand guidelines as PDF or complete kit as ZIP' },
    { title: 'Social Media Templates', description: 'Generate posts for Instagram, X, Facebook, LinkedIn, TikTok, YouTube' },
    { title: 'Brand Guidelines Document', description: 'Auto-generated comprehensive brand guidelines' },
    { title: 'Priority Support', description: 'Get help faster with priority customer support' },
    { title: 'Unlimited AI Generations', description: 'No limits on AI-powered brand asset generation' },
  ],
}

export default function SettingsModal({ open, onClose, defaultTab = 'settings' }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>(defaultTab)
  const [name, setName] = useState('Praise Obah')
  const [email, setEmail] = useState('obahsomto@gmail.com')
  const [saving, setSaving] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [productUpdates, setProductUpdates] = useState(false)
  const [marketingEmails, setMarketingEmails] = useState(false)

  // Subscription state
  const [subscriptionView, setSubscriptionView] = useState<'plans' | 'pro-details' | 'subscribed'>('plans')
  const [subscribing, setSubscribing] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 1000))
    setSaving(false)
  }

  const handleSubscribe = async () => {
    setSubscribing(true)
    // Simulate subscription process (bypass Stripe for now)
    await new Promise(r => setTimeout(r, 2000))
    setSubscribing(false)
    setSubscriptionView('subscribed')
  }

  const handleCancelSubscription = async () => {
    setSubscribing(true)
    await new Promise(r => setTimeout(r, 1500))
    setSubscribing(false)
    setSubscriptionView('plans')
  }

  if (!open) return null

  const tabs = [
    { id: 'settings' as const, label: 'Settings', icon: User },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
    { id: 'subscription' as const, label: 'Subscription', icon: CreditCard },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-[800px] h-[600px] bg-white rounded-2xl shadow-2xl mx-4 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-[200px] border-r border-gray-200 bg-gray-50/50 p-4 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-semibold text-gray-900">Account</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
              <X className="w-4 h-4" />
            </button>
          </div>
          <nav className="space-y-1 flex-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); if (tab.id === 'subscription') setSubscriptionView('plans') }}
                className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-violet-50 text-violet-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-md">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Profile</h3>
                <p className="text-sm text-gray-500 mt-1">Manage your account information</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="modal-name">Full Name</Label>
                  <Input id="modal-name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="modal-email">Email</Label>
                  <Input id="modal-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <Button onClick={handleSave} disabled={saving} className="bg-violet-600 hover:bg-violet-700">
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-gray-400" />
                  Security
                </h3>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="modal-current-password">Current Password</Label>
                    <Input id="modal-current-password" type="password" placeholder="Enter current password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="modal-new-password">New Password</Label>
                    <Input id="modal-new-password" type="password" placeholder="Enter new password" />
                  </div>
                  <Button variant="outline" className="border-gray-200">Update Password</Button>
                </div>
              </div>

              <div className="pt-4 border-t border-red-100">
                <h3 className="text-lg font-semibold text-red-600 flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  Danger Zone
                </h3>
                <p className="text-sm text-gray-500 mt-1">Once you delete your account, there is no going back.</p>
                <Button className="mt-3 bg-red-600 hover:bg-red-700 text-white">Delete Account</Button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6 max-w-md">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                <p className="text-sm text-gray-500 mt-1">Choose what notifications you receive</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                    <p className="text-xs text-gray-500">Receive email updates about your account activity</p>
                  </div>
                  <button
                    onClick={() => setEmailNotifications(!emailNotifications)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      emailNotifications ? 'bg-violet-600' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      emailNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Product Updates</p>
                    <p className="text-xs text-gray-500">Get notified about new features and improvements</p>
                  </div>
                  <button
                    onClick={() => setProductUpdates(!productUpdates)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      productUpdates ? 'bg-violet-600' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      productUpdates ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Marketing Emails</p>
                    <p className="text-xs text-gray-500">Receive tips, trends, and inspiration</p>
                  </div>
                  <button
                    onClick={() => setMarketingEmails(!marketingEmails)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      marketingEmails ? 'bg-violet-600' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      marketingEmails ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'subscription' && (
            <div className="h-full">
              {subscriptionView === 'plans' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Subscription</h3>
                    <p className="text-sm text-gray-500 mt-1">Choose the plan that works for you</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {plans.map((plan) => (
                      <Card key={plan.name} className={`border-gray-200 relative flex flex-col ${plan.popular ? 'border-violet-300 shadow-md overflow-visible' : ''}`}>
                        {plan.popular && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-violet-600 text-white text-xs font-medium rounded-full flex items-center gap-1">
                            <Zap className="w-3 h-3" /> Most Popular
                          </div>
                        )}
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">{plan.name}</CardTitle>
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold">{plan.price}</span>
                            <span className="text-sm text-gray-500">{plan.period}</span>
                          </div>
                          <p className="text-xs text-gray-500">{plan.description}</p>
                        </CardHeader>
                        <CardContent className="space-y-3 flex-1 flex flex-col">
                          <ul className="space-y-2 flex-1">
                            {plan.features.slice(0, 5).map((feature) => (
                              <li key={feature} className="flex items-start gap-2 text-xs">
                                <Check className="w-3.5 h-3.5 text-violet-600 mt-0.5 shrink-0" />
                                <span className="text-gray-600">{feature}</span>
                              </li>
                            ))}
                          </ul>
                          {plan.current ? (
                            <Button variant="outline" className="w-full border-gray-200 text-gray-500" disabled>Current Plan</Button>
                          ) : (
                            <Button className="w-full bg-violet-600 hover:bg-violet-700" onClick={() => setSubscriptionView('pro-details')}>
                              Upgrade to Pro
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {subscriptionView === 'pro-details' && (
                <div className="space-y-6">
                  <button onClick={() => setSubscriptionView('plans')} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
                    <ArrowLeft className="w-4 h-4" /> Back to plans
                  </button>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Pro Plan</h3>
                    <p className="text-sm text-gray-500 mt-1">Everything you need to scale your brand</p>
                  </div>
                  <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-6 border border-violet-100">
                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="text-3xl font-bold text-violet-700">$29.99</span>
                      <span className="text-sm text-violet-500">/month</span>
                    </div>
                    <div className="space-y-3">
                      {proPlanDetails.features.map((feature) => (
                        <div key={feature.title} className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-violet-100 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-3 h-3 text-violet-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{feature.title}</p>
                            <p className="text-xs text-gray-500">{feature.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button
                    className="w-full bg-violet-600 hover:bg-violet-700"
                    onClick={handleSubscribe}
                    disabled={subscribing}
                  >
                    {subscribing ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</>
                    ) : (
                      <>Subscribe to Pro — $29.99/month</>
                    )}
                  </Button>
                  <p className="text-xs text-center text-gray-400">Cancel anytime. No long-term contracts.</p>
                </div>
              )}

              {subscriptionView === 'subscribed' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <Check className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">You&apos;re on Pro!</h3>
                      <p className="text-sm text-gray-500">Your subscription is active</p>
                    </div>
                  </div>

                  <Card className="border-gray-200">
                    <CardContent className="p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Current Plan</p>
                          <p className="text-xs text-gray-500">Pro — $29.99/month</p>
                        </div>
                        <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Active</span>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Next billing date</p>
                          <p className="text-xs text-gray-500">August 23, 2026</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Payment method</p>
                          <p className="text-xs text-gray-500">Visa ending in 4242</p>
                        </div>
                        <button className="text-xs text-violet-600 hover:text-violet-700 font-medium">Update</button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-gray-200">
                    <CardContent className="p-5">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">What&apos;s included</h4>
                      <ul className="space-y-2">
                        {proPlanDetails.features.slice(0, 5).map((feature) => (
                          <li key={feature.title} className="flex items-center gap-2 text-xs text-gray-600">
                            <Check className="w-3.5 h-3.5 text-violet-600 shrink-0" />
                            {feature.title}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1 border-gray-200" onClick={() => setSubscriptionView('plans')}>
                      Manage Subscription
                    </Button>
                    <Button
                      variant="outline"
                      className="border-red-200 text-red-600 hover:bg-red-50"
                      onClick={handleCancelSubscription}
                      disabled={subscribing}
                    >
                      {subscribing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Cancel Subscription'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

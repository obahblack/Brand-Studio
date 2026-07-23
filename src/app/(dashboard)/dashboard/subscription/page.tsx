'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, Zap, CreditCard, Shield, ArrowRight, Loader2 } from 'lucide-react'

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    description: 'For individuals getting started',
    features: [
      '1 brand kit',
      'Basic color palette',
      'Typography recommendations',
      'PNG export',
      '5 AI generations/month',
    ],
    current: true,
  },
  {
    name: 'Pro',
    price: '$29.99',
    period: '/month',
    description: 'For professionals and growing teams',
    features: [
      'Unlimited brand kits',
      'Advanced color systems',
      'Full typography package',
      'Design tokens',
      'PDF + ZIP export',
      'Social media templates',
      'Brand guidelines document',
      'Priority support',
      'Unlimited AI generations',
    ],
    current: false,
    popular: true,
  },
]

export default function SubscriptionPage() {
  const [showCheckout, setShowCheckout] = useState(false)
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvc, setCardCvc] = useState('')
  const [cardName, setCardName] = useState('')
  const [loading, setLoading] = useState(true)
  const [billingHistory, setBillingHistory] = useState<Array<{ date: string; amount: string; status: string; plan: string }>>([])

  useEffect(() => {
    fetchSubscription()
  }, [])

  const fetchSubscription = async () => {
    try {
      const response = await fetch('/api/brand-kit')
      if (response.ok) {
        const data = await response.json()
        const kits = data.brandKits || []
        if (kits.length > 0) {
          const latest = kits[0]
          setBillingHistory([
            { 
              date: new Date(latest.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), 
              amount: '$0.00', 
              status: 'Active', 
              plan: 'Free' 
            }
          ])
        }
      }
    } catch (error) {
      console.error('Error fetching subscription:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Subscription</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your plan and billing</p>
      </div>

      {/* Current Plan Status */}
      <Card className="border-gray-200">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                <Shield className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Current Plan</p>
                <p className="text-lg font-semibold text-gray-900">Free</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Renews</p>
              <p className="text-sm font-medium text-gray-900">No renewal — Free plan</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plan Cards */}
      <div className="grid grid-cols-2 gap-6 max-w-4xl">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`border-gray-200 relative flex flex-col ${plan.popular ? 'border-violet-300 shadow-md overflow-visible' : ''}`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-violet-600 text-white text-xs font-medium rounded-full flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Most Popular
              </div>
            )}
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">{plan.name}</CardTitle>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-sm text-gray-500">{plan.period}</span>
              </div>
              <p className="text-sm text-gray-500">{plan.description}</p>
            </CardHeader>
            <CardContent className="space-y-4 flex-1 flex flex-col">
              <ul className="space-y-2.5 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-violet-600 mt-0.5 shrink-0" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              {plan.current ? (
                <Button
                  variant="outline"
                  className="w-full border-gray-200 text-gray-500 hover:bg-gray-50"
                  disabled
                >
                  Current Plan
                </Button>
              ) : (
                <Button
                  className="w-full bg-violet-600 hover:bg-violet-700"
                  onClick={() => setShowCheckout(true)}
                >
                  Upgrade to Pro
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <Card className="border-violet-200 bg-violet-50/30">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-violet-600" />
                Payment Details
              </CardTitle>
              <button
                onClick={() => setShowCheckout(false)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="card-name" className="text-sm">Name on card</Label>
                <Input
                  id="card-name"
                  placeholder="John Doe"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="card-number" className="text-sm">Card number</Label>
                <Input
                  id="card-number"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  maxLength={19}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="card-expiry" className="text-sm">Expiry</Label>
                <Input
                  id="card-expiry"
                  placeholder="MM / YY"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  maxLength={7}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="card-cvc" className="text-sm">CVC</Label>
                <Input
                  id="card-cvc"
                  placeholder="123"
                  value={cardCvc}
                  onChange={(e) => setCardCvc(e.target.value)}
                  maxLength={4}
                />
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <Shield className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-500">Secured by Stripe. Your card info is encrypted.</span>
            </div>
            <Button className="w-full bg-violet-600 hover:bg-violet-700">
              Subscribe to Pro — $29.99/month
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Billing History */}
      <Card className="border-gray-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Billing History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-4 px-5 py-3 border-b border-gray-100 bg-gray-50/50">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Date</span>
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Plan</span>
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</span>
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Status</span>
          </div>
          {billingHistory.map((entry, index) => (
            <div
              key={index}
              className="grid grid-cols-[1fr_1fr_1fr_auto] gap-4 px-5 py-3 items-center"
            >
              <span className="text-sm text-gray-900">{entry.date}</span>
              <span className="text-sm text-gray-600">{entry.plan}</span>
              <span className="text-sm font-medium text-gray-900">{entry.amount}</span>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium">
                {entry.status}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

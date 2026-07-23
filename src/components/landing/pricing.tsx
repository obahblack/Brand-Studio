import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import Link from 'next/link'
import { ScrollReveal } from './scroll-reveal'

const plans = [
  {
    name: 'Starter',
    description: 'Perfect for small teams getting things off the ground.',
    price: 'Free',
    period: '',
    cta: 'Get Started',
    features: [
      '1 brand kit',
      'Basic color palette',
      'Typography recommendations',
      'Simple design tokens',
      'PNG export',
    ],
  },
  {
    name: 'Pro',
    description: 'For startups ready to level up. Best for growing products.',
    price: '$29',
    period: '/month',
    cta: 'Start Free Trial',
    popular: true,
    features: [
      'Unlimited brand kits',
      'Advanced color systems',
      'Full typography package',
      'Complete design tokens',
      'PDF + ZIP export',
      'Social media templates',
      'Brand guidelines document',
      'Priority support',
    ],
  },
]

export function Pricing() {
  return (
    <section className="py-24 bg-white" id="pricing">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">
            Invest in <span className="text-gray-400">better design</span>
          </h2>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {plans.map((plan, index) => (
            <ScrollReveal key={plan.name} delay={index * 0.15}>
              <div
                className={`relative p-8 rounded-2xl border ${
                  plan.popular
                    ? 'border-violet-200 bg-violet-50/50'
                    : 'border-border bg-white'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-8 px-3 py-1 bg-violet-600 text-white text-xs font-medium rounded-full">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground mb-6">{plan.description}</p>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-5xl font-bold">{plan.price}</span>
                  {plan.period && (
                    <span className="text-muted-foreground">{plan.period}</span>
                  )}
                </div>
                <Link href="/signup">
                  <Button
                    className="w-full mb-8"
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    {plan.cta}
                  </Button>
                </Link>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-violet-600 shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

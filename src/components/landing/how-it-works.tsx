import Link from 'next/link'
import { ScrollReveal } from './scroll-reveal'

const steps = [
  {
    number: '01',
    title: 'Enter your URL',
    description: 'Paste your website URL or describe your brand. Our AI will analyze your existing brand identity.',
    image: '/placeholder-step1.svg',
  },
  {
    number: '02',
    title: 'AI generates your brand',
    description: 'Our AI extracts colors, typography, and style patterns to create a comprehensive brand system.',
    image: '/placeholder-step2.svg',
  },
  {
    number: '03',
    title: 'Download your kit',
    description: 'Get your complete brand system with design tokens, guidelines, and ready-to-use marketing templates.',
    image: '/placeholder-step3.svg',
  },
]

export function HowItWorks() {
  return (
    <section className="py-24 bg-slate-50" id="how-it-works">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="flex items-end justify-between mb-16">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-4">PROCESS</p>
              <h2 className="text-4xl md:text-5xl font-bold">
                How it works
              </h2>
              <p className="text-gray-500 text-lg mt-4 max-w-xl">
                Three simple steps to get your complete brand system in under 2 minutes.
              </p>
            </div>
            <Link
              href="/signup"
              className="px-6 py-3 bg-violet-600 text-white rounded-full text-sm font-medium hover:bg-violet-700 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <ScrollReveal key={step.number} delay={index * 0.15}>
              <div className="group">
                <div className="relative aspect-[4/3] rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 mb-6 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl font-bold text-violet-200">{step.number}</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

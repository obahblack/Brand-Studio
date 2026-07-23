import { ScrollReveal } from './scroll-reveal'
import { Sparkles, Zap, Palette, Download } from 'lucide-react'

const benefits = [
  {
    icon: Sparkles,
    title: 'AI-Powered Generation',
    description: 'Our AI understands your brand and generates consistent assets across all platforms in minutes, not days.',
  },
  {
    icon: Zap,
    title: 'Instant Delivery',
    description: 'Get your complete brand kit delivered in under 2 minutes. No waiting, no delays, no back-and-forth.',
  },
  {
    icon: Palette,
    title: 'Consistent Branding',
    description: 'Every asset follows your brand guidelines perfectly. Maintain consistency across all channels effortlessly.',
  },
  {
    icon: Download,
    title: 'Export Anywhere',
    description: 'Download as PDF, ZIP, or individual files. Use your brand kit anywhere, anytime, on any platform.',
  },
]

export function Benefits() {
  return (
    <section className="py-24 px-11" id="benefits">
      <div className="bg-black rounded-3xl py-20 px-8">
        <div className="max-w-[1200px] mx-auto">
          <ScrollReveal>
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20">
                <Sparkles className="w-4 h-4 text-white/70" />
                <span className="text-sm font-medium text-white/80">Core Features</span>
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
              What&apos;s inside Brand Studio?
            </h2>
            <p className="text-white/50 text-center text-lg mb-16 max-w-2xl mx-auto">
              Teams choose Brand Studio because it simplifies the complexity of building and maintaining a consistent brand.
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <ScrollReveal key={benefit.title} delay={index * 0.1}>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 h-full">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-6">
                    <benefit.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
                  <p className="text-white/60 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

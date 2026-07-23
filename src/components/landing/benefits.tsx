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
      <div className="bg-[#0a0a0a] rounded-3xl py-20 px-8">
        <div className="max-w-[1200px] mx-auto">
          <ScrollReveal>
            <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
              Why teams stick with us
            </h2>
            <p className="text-white/50 text-center text-lg mb-16 max-w-2xl mx-auto">
               Teams choose Brand Studio because it simplifies the complexity of building and maintaining a consistent brand.
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <ScrollReveal key={benefit.title} delay={index * 0.1}>
                <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 h-full">
                  <div className="w-12 h-12 rounded-xl bg-violet-600/20 flex items-center justify-center mb-6">
                    <benefit.icon className="w-6 h-6 text-violet-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
                  <p className="text-white/50 leading-relaxed">
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

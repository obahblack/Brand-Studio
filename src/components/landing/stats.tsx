import { ScrollReveal } from './scroll-reveal'

const stats = [
  { value: '1000+', label: 'Kits Generated' },
  { value: '98%', label: 'Client Satisfaction' },
  { value: '<2min', label: 'Average Speed' },
]

export function Stats() {
  return (
    <section className="py-16 bg-white border-y">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Trusted by teams worldwide
          </h2>
          <p className="text-gray-500 text-lg text-center mb-12 max-w-2xl mx-auto">
            Our numbers speak for themselves. Join thousands of satisfied teams building better brands.
          </p>
        </ScrollReveal>
        <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto">
          {stats.map((stat, index) => (
            <ScrollReveal key={stat.label} delay={index * 0.1}>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

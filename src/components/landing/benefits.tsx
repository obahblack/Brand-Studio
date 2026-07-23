import { ScrollReveal } from './scroll-reveal'

const benefits = [
  {
    title: 'Get it fast',
    description: 'Less explaining, more doing. Our AI picks things up quickly and delivers in minutes.',
    stat: '<2min',
    statLabel: 'avg. delivery',
  },
  {
    title: 'On time, every time',
    description: 'We\'ve delivered 99% of kits on schedule. No surprises, no delays.',
    stat: '99%',
    statLabel: 'on-time delivery',
  },
  {
    title: 'Results you can measure',
    description: 'Average 2.4× increase in brand consistency within 60 days of using our kits.',
    stat: '2.4×',
    statLabel: 'brand consistency boost',
  },
  {
    title: 'No design drama',
    description: 'Skip the back-and-forth with designers. Get exactly what you need, instantly.',
    stat: '0',
    statLabel: 'revision rounds needed',
  },
]

export function Benefits() {
  return (
    <section className="py-24 bg-white" id="benefits">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <p className="text-sm font-medium text-muted-foreground mb-4">BENEFITS</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-16 max-w-lg">
            Why teams stick with us
          </h2>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-12 max-w-4xl">
          {benefits.map((benefit, index) => (
            <ScrollReveal key={benefit.title} delay={index * 0.1}>
              <div className="group">
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="text-3xl font-bold text-violet-600">{benefit.stat}</span>
                  <span className="text-sm text-muted-foreground">{benefit.statLabel}</span>
                </div>
                <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

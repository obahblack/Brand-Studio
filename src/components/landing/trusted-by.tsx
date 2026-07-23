import { ScrollReveal } from './scroll-reveal'

const brands = [
  'Acme Corp',
  'Globex',
  'Initech',
  'Umbrella',
  'Hooli',
  'Pied Piper',
]

export function TrustedBy() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <p className="text-center text-sm text-muted-foreground mb-12">
            Trusted by 500+ teams worldwide
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="flex flex-wrap items-center justify-center gap-12 md:gap-20">
            {brands.map((brand) => (
              <div
                key={brand}
                className="text-xl md:text-2xl font-bold text-muted-foreground/40 hover:text-muted-foreground/60 transition-colors"
              >
                {brand}
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

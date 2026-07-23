import { Hero } from '@/components/landing/hero'
import { TrustedBy } from '@/components/landing/trusted-by'
import { Features } from '@/components/landing/features'
import { HowItWorks } from '@/components/landing/how-it-works'
import { Benefits } from '@/components/landing/benefits'
import { Testimonials } from '@/components/landing/testimonials'
import { Pricing } from '@/components/landing/pricing'
import { FAQ } from '@/components/landing/faq'
import { CTA } from '@/components/landing/cta'
import { Footer } from '@/components/landing/footer'

export default function Home() {
  return (
    <>
      <Hero />
      <TrustedBy />
      <Features />
      <HowItWorks />
      <Benefits />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </>
  )
}

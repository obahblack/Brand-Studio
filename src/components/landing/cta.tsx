import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { ScrollReveal } from './scroll-reveal'

export function CTA() {
  return (
    <section className="py-24 bg-white" id="contact">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="relative rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-700 p-12 md:p-16 overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative z-10 max-w-2xl">
              <p className="text-sm font-medium text-white/80 mb-4">START GENERATING</p>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to create your brand kit?
              </h2>
              <p className="text-lg text-white/80 mb-8 leading-relaxed">
                Join thousands of businesses who&apos;ve transformed their brand identity 
                with our AI-powered generation system.
              </p>
              <Link href="/signup">
                <Button size="lg" className="bg-white text-violet-700 hover:bg-white/90 text-base px-8">
                  Get Started Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

'use client'

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { ScrollReveal } from './scroll-reveal'

const faqs = [
  {
    question: 'What features does the platform offer?',
    answer: 'The platform generates complete brand systems including color palettes, typography, design tokens, and marketing assets — all powered by AI.',
  },
  {
    question: 'How does the platform process work?',
    answer: 'Simply enter your website URL or describe your brand. Our AI analyzes your input, extracts visual patterns, and generates a comprehensive brand system in under 2 minutes.',
  },
  {
    question: "What's your typical turnaround time?",
    answer: 'Most brand kits are generated in under 2 minutes. Complex brands with extensive analysis may take up to 5 minutes.',
  },
  {
    question: 'How is the platform priced?',
    answer: 'The platform offers a free Starter plan with 1 brand kit, and a Pro plan at $29/month for unlimited kits with advanced features.',
  },
  {
    question: 'How do we get started?',
    answer: 'Sign up for free, enter your brand information, and our AI will generate your complete brand system. No design skills needed.',
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-24 bg-[#f5f5f5]" id="faq">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            Let&apos;s <span className="text-gray-400">clear things up</span>
          </h2>
          <p className="text-gray-500 text-lg text-center mb-16 max-w-2xl mx-auto">
            Got questions? We&apos;ve got answers. Here&apos;s everything you need to know about Brand Studio.
          </p>
        </ScrollReveal>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <ScrollReveal key={faq.question} delay={index * 0.05}>
              <div
                className="bg-white rounded-2xl overflow-hidden cursor-pointer"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <div className="flex items-center gap-4 p-6">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                    {openIndex === index ? (
                      <Minus className="w-4 h-4 text-gray-600" />
                    ) : (
                      <Plus className="w-4 h-4 text-gray-600" />
                    )}
                  </div>
                  <span className="text-lg font-medium text-gray-900">{faq.question}</span>
                </div>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index ? 'max-h-40' : 'max-h-0'
                  }`}
                >
                  <div className="px-6 pb-6 pl-18">
                    <p className="text-gray-500 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

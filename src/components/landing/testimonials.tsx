'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { ScrollReveal } from './scroll-reveal'

const testimonials = [
  {
    quote: 'Working with this tool transformed our online presence completely. Our leads increased by 3x.',
    name: 'Alex Turner',
    role: 'Founder',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
  },
  {
    quote: 'Our brand consistency finally makes sense. Revenue jumped 40% in two months — highly recommended.',
    name: 'Sarah Mitchell',
    role: 'CEO',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
  },
  {
    quote: 'They understood our brand voice instantly and delivered a system that felt authentic.',
    name: 'James Chen',
    role: 'Head of Marketing',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
  },
  {
    quote: 'The AI-generated assets saved us weeks of design work. Quality is outstanding.',
    name: 'Emily Rodriguez',
    role: 'Creative Director',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
  },
  {
    quote: 'Best investment for our startup. Complete brand kit in minutes, not months.',
    name: 'Michael Park',
    role: 'Co-founder',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
  },
  {
    quote: 'Finally a tool that understands modern branding. Our social media looks incredible now.',
    name: 'Lisa Wang',
    role: 'Marketing Lead',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
  },
]

const allTestimonials = [...testimonials, ...testimonials, ...testimonials]

export function Testimonials() {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    let animationId: number
    let scrollPosition = 0
    const scrollSpeed = 0.5

    const animate = () => {
      scrollPosition += scrollSpeed
      const maxScroll = scrollContainer.scrollWidth / 3
      if (scrollPosition >= maxScroll) {
        scrollPosition = 0
      }
      scrollContainer.scrollLeft = scrollPosition
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    const handleMouseEnter = () => {
      cancelAnimationFrame(animationId)
    }

    const handleMouseLeave = () => {
      animationId = requestAnimationFrame(animate)
    }

    scrollContainer.addEventListener('mouseenter', handleMouseEnter)
    scrollContainer.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      cancelAnimationFrame(animationId)
      scrollContainer.removeEventListener('mouseenter', handleMouseEnter)
      scrollContainer.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <section className="py-24 bg-[#f5f5f5] overflow-hidden" id="testimonials">
      <div className="container mx-auto px-4 mb-12">
        <ScrollReveal>
          <h2 className="text-4xl md:text-5xl font-bold text-center">
            Don&apos;t just take <span className="text-gray-400">our word</span>
          </h2>
        </ScrollReveal>
      </div>

      <div className="relative">
        {/* Left fade overlay */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#f5f5f5] to-transparent z-10 pointer-events-none" />
        
        {/* Right fade overlay */}
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#f5f5f5] to-transparent z-10 pointer-events-none" />

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-hidden px-8"
          style={{ scrollBehavior: 'auto' }}
        >
          {allTestimonials.map((testimonial, index) => (
            <div
              key={`${testimonial.name}-${index}`}
              className="shrink-0 w-[350px] bg-white rounded-2xl p-2 shadow-sm"
            >
              {/* Quote container with off-white background */}
              <div className="bg-[#f5f5f5] rounded-xl p-6 mb-4">
                {/* Quote mark */}
                <div className="text-4xl text-gray-300 font-serif leading-none mb-3">
                  &ldquo;
                </div>
                
                {/* Quote text */}
                <p className="text-base leading-relaxed text-gray-800">
                  {testimonial.quote}
                </p>
              </div>
              
              {/* Author section */}
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-400 shrink-0">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
                <div>
                  <div className="font-semibold text-sm text-gray-900">{testimonial.name}</div>
                  <div className="text-xs text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

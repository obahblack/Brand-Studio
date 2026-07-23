'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'

const rotatingWords = ['brands', 'assets', 'styles', 'tokens', 'palettes', 'systems']

const images = [
  { 
    src: '/1.jpg', alt: 'Brand design mockup', rotate: -6, y: 20,
    pills: [
      { text: 'Typography', top: '8%', left: '-15px' },
      { text: 'Text Styles', bottom: '12%', right: '-10px' }
    ]
  },
  { 
    src: '/2.jpg', alt: 'Social media post', rotate: -2, y: 0,
    pills: [
      { text: 'Design System', top: '18%', right: '-20px' },
      { text: 'Tokens', bottom: '25%', left: '-18px' }
    ]
  },
  { 
    src: '/3.jpg', alt: 'Marketing template', rotate: 3, y: 10,
    pills: [
      { text: 'Social Media', top: '5%', left: '10%' },
      { text: 'Color Palette', bottom: '8%', right: '5%' }
    ]
  },
  { 
    src: '/4.jpg', alt: 'Brand identity', rotate: 7, y: -10,
    pills: [
      { text: 'Marketing', top: '15%', right: '-25px' },
      { text: 'Branding', bottom: '18%', left: '-22px' }
    ]
  },
]

export function Hero() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative bg-[#f0f0f0] overflow-hidden">
      {/* Floating Nav */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
        <nav className="flex items-center justify-between bg-white/90 backdrop-blur-md rounded-2xl px-6 py-3 shadow-sm border-2 border-gray-200" style={{ width: '820px', maxWidth: '90vw' }}>
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">✦</span>
            </div>
            <span className="font-semibold text-lg text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>Brand Studio</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="#features" className="px-5 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100">
              Features
            </Link>
            <Link href="#how-it-works" className="px-5 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100">
              How it Works
            </Link>
            <Link href="#pricing" className="px-5 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100">
              Pricing
            </Link>
            <Link href="#faq" className="px-5 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100">
              FAQ
            </Link>
          </div>
        </nav>
      </div>

      {/* Centered Text Content */}
      <div className="h-screen flex flex-col items-center justify-center text-center px-4 -mt-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
            We design{' '}
            <span className="text-violet-600 inline-block overflow-hidden h-[1.2em] align-bottom">
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentWordIndex}
                  initial={{ y: '100%', opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: '-100%', opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="inline-block"
                >
                  {rotatingWords[currentWordIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
            <br />
            that mean something
          </h1>
          <p className="text-lg text-gray-500 mb-8 max-w-md mx-auto">
            AI-powered brand generation. Complete visual identity systems and marketing kits — delivered in minutes.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link
            href="/signup"
            className="inline-block px-8 py-4 bg-violet-600 text-white rounded-full text-lg font-medium hover:bg-violet-700 transition-colors"
          >
            Get Started
          </Link>
        </motion.div>
      </div>

      {/* Chaos Pattern Ring - Right Side */}
      <div className="absolute right-[-200px] top-1/2 -translate-y-1/2 pointer-events-none z-0">
        <svg
          className="w-[700px] h-[700px]"
          viewBox="0 0 700 700"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ transform: 'rotate(-25deg)' }}
        >
          <defs>
            <linearGradient id="travelingLight1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0">
                <animate attributeName="offset" values="0;1" dur="3s" repeatCount="indefinite" />
              </stop>
              <stop offset="10%" stopColor="#8b5cf6" stopOpacity="1">
                <animate attributeName="offset" values="0.1;1;0" dur="3s" repeatCount="indefinite" />
              </stop>
              <stop offset="20%" stopColor="#8b5cf6" stopOpacity="0">
                <animate attributeName="offset" values="0.2;1;0.1" dur="3s" repeatCount="indefinite" />
              </stop>
            </linearGradient>
            <linearGradient id="travelingLight2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#a78bfa" stopOpacity="0">
                <animate attributeName="offset" values="0;1" dur="4s" repeatCount="indefinite" />
              </stop>
              <stop offset="10%" stopColor="#a78bfa" stopOpacity="0.8">
                <animate attributeName="offset" values="0.1;1;0" dur="4s" repeatCount="indefinite" />
              </stop>
              <stop offset="20%" stopColor="#a78bfa" stopOpacity="0">
                <animate attributeName="offset" values="0.2;1;0.1" dur="4s" repeatCount="indefinite" />
              </stop>
            </linearGradient>
            <linearGradient id="travelingLight3" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#c4b5fd" stopOpacity="0">
                <animate attributeName="offset" values="0;1" dur="5s" repeatCount="indefinite" />
              </stop>
              <stop offset="10%" stopColor="#c4b5fd" stopOpacity="0.6">
                <animate attributeName="offset" values="0.1;1;0" dur="5s" repeatCount="indefinite" />
              </stop>
              <stop offset="20%" stopColor="#c4b5fd" stopOpacity="0">
                <animate attributeName="offset" values="0.2;1;0.1" dur="5s" repeatCount="indefinite" />
              </stop>
            </linearGradient>
          </defs>

          {/* Ring made of many concentric circles */}
          {Array.from({ length: 60 }).map((_, i) => {
            const radius = 250 + (i * 1.5)
            const shade = i < 15 ? '#4c1d95' : i < 30 ? '#6d28d9' : i < 45 ? '#7c3aed' : '#8b5cf6'
            const opacity = 0.2 + (Math.sin(i * 0.15) * 0.1)
            return (
              <circle
                key={`ring-${i}`}
                cx="350"
                cy="350"
                r={radius}
                stroke={shade}
                strokeWidth="1"
                fill="none"
                opacity={opacity}
              />
            )
          })}

          {/* Traveling light rings */}
          <circle
            cx="350"
            cy="350"
            r="260"
            stroke="url(#travelingLight1)"
            strokeWidth="1.5"
            fill="none"
          />
          <circle
            cx="350"
            cy="350"
            r="280"
            stroke="url(#travelingLight2)"
            strokeWidth="1"
            fill="none"
          />
          <circle
            cx="350"
            cy="350"
            r="300"
            stroke="url(#travelingLight3)"
            strokeWidth="1"
            fill="none"
          />

          {/* Animated traveling light dots */}
          <circle r="3" fill="#8b5cf6">
            <animateMotion
              dur="4s"
              repeatCount="indefinite"
              path="M350,350 m-260,0 a260,260 0 1,0 520,0 a260,260 0 1,0 -520,0"
            />
          </circle>
          <circle r="2.5" fill="#a78bfa">
            <animateMotion
              dur="5s"
              repeatCount="indefinite"
              path="M350,350 m-280,0 a280,280 0 1,0 560,0 a280,280 0 1,0 -560,0"
            />
          </circle>
          <circle r="2" fill="#c4b5fd">
            <animateMotion
              dur="6s"
              repeatCount="indefinite"
              path="M350,350 m-300,0 a300,300 0 1,0 600,0 a300,300 0 1,0 -600,0"
            />
          </circle>
        </svg>
      </div>

      {/* Image Gallery */}
      <motion.div
        className="flex gap-4 md:gap-6 justify-center items-end px-4 max-w-6xl mx-auto -mt-52 pb-16 relative z-10"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {images.map((img, index) => (
          <motion.div
            key={index}
            className="relative shrink-0 w-56 md:w-72 lg:w-80"
            style={{ rotate: img.rotate, y: img.y }}
            whileHover={{ scale: 1.05, rotate: 0, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Image with border radius and clipping */}
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-gray-400 shadow-2xl">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 224px, (max-width: 1024px) 288px, 320px"
              />
            </div>
            
            {/* Floating Pills - positioned outside the image frame */}
            {img.pills.map((pill, pillIndex) => (
              <div
                key={pillIndex}
                className="absolute border border-gray-400 bg-white px-4 py-2 rounded-full shadow-md text-sm font-medium text-gray-800 whitespace-nowrap z-10"
                style={{
                  top: pill.top,
                  bottom: pill.bottom,
                  left: pill.left,
                  right: pill.right,
                }}
              >
                {pill.text}
              </div>
            ))}
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

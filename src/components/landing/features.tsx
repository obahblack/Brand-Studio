'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { ScrollReveal } from './scroll-reveal'

const features = [
  {
    number: '01',
    title: 'AI Brand Analysis',
    description: 'Our AI analyzes your website to understand your brand identity, visual style, and market positioning.',
    images: [
      'https://media.licdn.com/dms/image/v2/C5112AQE3GoAe1kNIwQ/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1520166991870?e=2147483647&v=beta&t=IncHejGtQ-pIl4r3dCgfcdRDc4FR9lPMs4khI2OaTkg',
      'https://cdn.prod.website-files.com/665d764211c8c75a684bcf9d/6874d678b7be4b8fdc523cf0_6874c6366002c02a8239b505-1752485149881.jpeg',
      'https://tint.creativemarket.com/DwMFZGHS5ViA7hhbPGPwIc1Vga1YIlEvT5TANZ8DHCk/width:1200/height:800/gravity:nowe/rt:fill-down/el:1/czM6Ly9maWxlcy5jcmVhdGl2ZW1hcmtldC5jb20vaW1hZ2VzL3NjcmVlbnNob3RzL3Byb2R1Y3RzLzE1OTIvMTU5MjkvMTU5Mjk2MTMvMDQtd2ViLXNob3djYXNlLW1vY2t1cC1vLmpwZw?1665513924',
    ],
  },
  {
    number: '02',
    title: 'Design System',
    description: 'Get a complete design system with colors, typography, and visual guidelines — all extracted from your brand.',
    images: [
      'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=200&h=200&fit=crop',
      'https://cdn.prod.website-files.com/68c16ea7c1eae0d50ce60d98/68c17b9cae4a630ea9cff5a9_5H3XDgQAjeojS70GjC6o5CAw.png',
    ],
  },
  {
    number: '03',
    title: 'Multichannel Content',
    description: 'Generate optimized images for every platform — Instagram, Facebook, Twitter, LinkedIn — all with perfect frame sizes.',
    images: [
      'https://www.spielwarenmesse.de/fileadmin/_processed_/1/7/csm_20240411_Teaser_10772779af.jpg',
      'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=200&h=200&fit=crop',
      'https://cdn.vectorstock.com/i/1000v/89/13/computer-social-network-connection-apps-vector-11738913.jpg',
    ],
  },
  {
    number: '04',
    title: 'Asset Generation',
    description: 'Generate ready-to-use social media templates, marketing assets, and brand guidelines.',
    images: [
      'https://tint.creativemarket.com/XZcP_ZH2Uv1Ri4zyhYLOvtML9p28uiXDDCES3XFvndI/width:1200/height:800/gravity:nowe/rt:fill-down/el:1/czM6Ly9maWxlcy5jcmVhdGl2ZW1hcmtldC5jb20vaW1hZ2VzL3NjcmVlbnNob3RzL3Byb2R1Y3RzLzUwMjgvNTAyODcvNTAyODc2NzIvMTAtby5wbmc?1709957357',
      'https://cdn.dribbble.com/userupload/48420209/file/5233c01292f0f5fd6f70d989f9f5ad23.png?resize=2048x1536&vertical=center',
      'https://weandthecolor.com/wp-content/uploads/2021/09/Clean-Business-Social-Media-Templates-with-Graphic-Shapes-and-Yellow-Accents.jpg',
    ],
  },
]

export function Features() {
  const [activeIndex, setActiveIndex] = useState<number>(0)

  return (
    <section className="py-24 bg-white" id="features">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            What we <span className="text-violet-600">bring</span>
            <br />
            to the table
          </h2>
          <p className="text-gray-500 text-lg text-center mb-16 max-w-2xl mx-auto">
            Discover how Brand Studio helps you create, manage, and scale your brand identity.
          </p>
        </ScrollReveal>

        <div className="max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <ScrollReveal key={feature.number} delay={index * 0.1}>
              <div
                className="border-b border-gray-200"
                onMouseEnter={() => setActiveIndex(index)}
              >
                {/* Main Row */}
                <div className="flex items-center justify-between py-8 cursor-pointer">
                  <h3
                    className={`text-2xl md:text-3xl font-medium transition-all duration-300 ${
                      activeIndex === index
                        ? 'text-gray-900'
                        : 'text-gray-900 opacity-60'
                    }`}
                  >
                    {feature.title}
                  </h3>
                  <span className="text-xl text-gray-400 font-medium">
                    {feature.number}
                  </span>
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                  {activeIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pb-8">
                        <p className="text-gray-500 leading-relaxed mb-6 max-w-xl">
                          {feature.description}
                        </p>
                        <div className="flex gap-4">
                          {feature.images.map((img, imgIndex) => (
                            <div
                              key={imgIndex}
                              className="relative w-[120px] h-[120px] rounded-lg overflow-hidden border border-gray-300"
                            >
                              <Image
                                src={img}
                                alt={`${feature.title} example ${imgIndex + 1}`}
                                fill
                                className="object-cover"
                                sizes="120px"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

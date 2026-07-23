'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

export function Footer() {
  const [email, setEmail] = useState('')

  return (
    <footer className="bg-white border-t border-gray-200">
      {/* Top Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-start justify-between gap-12">
          {/* Copyright */}
          <div className="text-gray-500 text-sm">
            ©2026 Brand Studio, All rights reserved.
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col gap-2">
            <Link href="#features" className="text-gray-900 hover:text-gray-600 transition-colors">
              Features
            </Link>
            <Link href="#benefits" className="text-gray-900 hover:text-gray-600 transition-colors">
              Who it is for
            </Link>
            <Link href="#pricing" className="text-gray-900 hover:text-gray-600 transition-colors">
              Pricing
            </Link>
            <Link href="#faq" className="text-gray-900 hover:text-gray-600 transition-colors">
              FAQ
            </Link>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col gap-3">
            <span className="text-gray-900 text-sm">Subscribe to our newsletter</span>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="example@brand.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-3 bg-gray-100 rounded-full text-sm w-64 focus:outline-none focus:ring-2 focus:ring-gray-200"
              />
              <button className="px-6 py-3 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Big Brand Name with Background Image */}
      <div className="mx-4 mb-4 rounded-3xl overflow-hidden relative h-[300px] md:h-[400px]">
        {/* Background Image */}
        <Image
          src="https://img.magnific.com/free-vector/realistic-technology-background_52683-73672.jpg?semt=ais_hybrid&w=740&q=80"
          alt="Technology background"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, calc(100vw - 32px)"
        />
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/70" />
        
        {/* Brand Name */}
        <div className="absolute inset-0 flex items-center justify-center">
          <h2 className="text-[100px] md:text-[180px] lg:text-[250px] font-bold text-white/20 leading-none tracking-tighter">
            Brand Studio
          </h2>
        </div>
      </div>
    </footer>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <nav id="main-nav">
        <Link href="/" className="nav-logo">
          Healthy<span>Bite</span>
        </Link>
        <ul className="nav-links">
          <li><Link href="#how-it-works">How It Works</Link></li>
          <li><Link href="#para-shop">Shop</Link></li>
          <li><Link href="#delivery-schedule">Delivery</Link></li>
          <li><Link href="#featured">Blog</Link></li>
          <li><Link href="#how-it-works" className="nav-cta">Get Started</Link></li>
        </ul>
        <button
          className="nav-hamburger"
          aria-label="Open menu"
          onClick={() => setOpen(!open)}
        >
          <span /><span /><span />
        </button>
      </nav>

      <div className={`nav-mobile${open ? ' open' : ''}`}>
        <Link href="#how-it-works" onClick={() => setOpen(false)}>How It Works</Link>
        <Link href="#para-shop" onClick={() => setOpen(false)}>Shop</Link>
        <Link href="#delivery-schedule" onClick={() => setOpen(false)}>Delivery</Link>
        <Link href="#featured" onClick={() => setOpen(false)}>Blog</Link>
        <Link href="#how-it-works" onClick={() => setOpen(false)} style={{ color: '#1a9e8e', fontWeight: 700 }}>
          Get Started
        </Link>
      </div>
    </>
  )
}

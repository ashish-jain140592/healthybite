'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

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
          {user ? (
            <>
              <li><Link href="/orders">My Orders</Link></li>
              <li><Link href="/checkout" className="nav-cta">Order Now</Link></li>
              <li><button onClick={handleSignOut} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#555', fontFamily: 'inherit' }}>Sign Out</button></li>
            </>
          ) : (
            <>
              <li><Link href="/login">Sign In</Link></li>
              <li><Link href="/checkout" className="nav-cta">Get Started</Link></li>
            </>
          )}
        </ul>
        <button className="nav-hamburger" aria-label="Open menu" onClick={() => setOpen(!open)}>
          <span /><span /><span />
        </button>
      </nav>

      <div className={`nav-mobile${open ? ' open' : ''}`}>
        <Link href="#how-it-works" onClick={() => setOpen(false)}>How It Works</Link>
        <Link href="#para-shop" onClick={() => setOpen(false)}>Shop</Link>
        <Link href="#delivery-schedule" onClick={() => setOpen(false)}>Delivery</Link>
        <Link href="#featured" onClick={() => setOpen(false)}>Blog</Link>
        {user ? (
          <>
            <Link href="/orders" onClick={() => setOpen(false)}>My Orders</Link>
            <Link href="/checkout" onClick={() => setOpen(false)} style={{ color: '#1a9e8e', fontWeight: 700 }}>Order Now</Link>
            <button onClick={() => { handleSignOut(); setOpen(false) }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#555', fontFamily: 'inherit', textAlign: 'left', padding: '12px 0', borderBottom: '1px solid #f5f5f5' }}>Sign Out</button>
          </>
        ) : (
          <>
            <Link href="/login" onClick={() => setOpen(false)}>Sign In</Link>
            <Link href="/checkout" onClick={() => setOpen(false)} style={{ color: '#1a9e8e', fontWeight: 700 }}>Get Started</Link>
          </>
        )}
      </div>
    </>
  )
}

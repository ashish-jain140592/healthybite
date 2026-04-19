'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="auth-card">
        <Link href="/" className="nav-logo" style={{ display: 'block', marginBottom: 24 }}>
          Healthy<span>Bite</span>
        </Link>
        <div className="auth-success">
          <div style={{ fontSize: 40, marginBottom: 16 }}>📬</div>
          <h2>Check your email</h2>
          <p>We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.</p>
          <Link href="/login" className="auth-btn" style={{ display: 'block', textAlign: 'center', marginTop: 24 }}>
            Back to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-card">
      <Link href="/" className="nav-logo" style={{ display: 'block', marginBottom: 24 }}>
        Healthy<span>Bite</span>
      </Link>
      <h1 className="auth-title">Create account</h1>
      <p className="auth-subtitle">Start your healthy journey today</p>

      <form onSubmit={handleSubmit} className="auth-form">
        {error && <div className="auth-error">{error}</div>}
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            id="fullName" type="text" required
            value={fullName} onChange={e => setFullName(e.target.value)}
            placeholder="Ashi Jain"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email" type="email" required
            value={email} onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password" type="password" required minLength={6}
            value={password} onChange={e => setPassword(e.target.value)}
            placeholder="Min. 6 characters"
          />
        </div>
        <button type="submit" className="auth-btn" disabled={loading}>
          {loading ? 'Creating account…' : 'Create Account'}
        </button>
      </form>

      <p className="auth-footer">
        Already have an account? <Link href="/login">Sign in</Link>
      </p>
    </div>
  )
}

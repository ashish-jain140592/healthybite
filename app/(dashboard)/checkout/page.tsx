'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const PLANS = [
  { id: 'single',  name: 'Single Day',  price: 499,  multiplier: 1,  desc: '1 day',       badge: null },
  { id: 'weekly',  name: 'Weekly',      price: 2994, multiplier: 6,  desc: '7 days',      badge: '1 day free' },
  { id: 'monthly', name: 'Monthly',     price: 10978,multiplier: 22, desc: '30 days',     badge: '8 days free' },
]

const SLOTS = [
  { id: 'morning',   name: 'Morning',   icon: '🌅', time: 'By 8 AM' },
  { id: 'afternoon', name: 'Afternoon', icon: '☀️', time: '12–2 PM' },
  { id: 'evening',   name: 'Evening',   icon: '🌙', time: '6–8 PM' },
]

declare global {
  interface Window { Razorpay: any }
}

export default function CheckoutPage() {
  const router = useRouter()
  const [plan, setPlan]         = useState('weekly')
  const [slot, setSlot]         = useState('morning')
  const [paying, setPaying]     = useState(false)
  const [address, setAddress]   = useState({ line1: '', line2: '', city: '', pincode: '' })

  const selectedPlan = PLANS.find(p => p.id === plan)!

  function handleAddressChange(e: React.ChangeEvent<HTMLInputElement>) {
    setAddress(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handlePay() {
    if (!address.line1 || !address.city || !address.pincode) {
      alert('Please fill in your delivery address.')
      return
    }
    setPaying(true)

    // Load Razorpay script if not loaded
    if (!window.Razorpay) {
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.onload = () => resolve()
        script.onerror = () => reject()
        document.body.appendChild(script)
      })
    }

    // Create order on server
    const res = await fetch('/api/payment/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan, slot, address, amount: selectedPlan.price }),
    })
    const data = await res.json()
    if (!res.ok) { alert(data.error || 'Failed to create order'); setPaying(false); return }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: data.amount,
      currency: 'INR',
      name: 'HealthyBite',
      description: `${selectedPlan.name} Plan — ${slot} delivery`,
      order_id: data.razorpayOrderId,
      handler: async (response: any) => {
        const verify = await fetch('/api/payment/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...response, orderId: data.orderId }),
        })
        if (verify.ok) {
          router.push('/orders?success=1')
        } else {
          alert('Payment verification failed. Contact support.')
          setPaying(false)
        }
      },
      prefill: {},
      theme: { color: '#1a9e8e' },
      modal: { ondismiss: () => setPaying(false) },
      callback_url: `${window.location.origin}/api/payment/verify-redirect?orderId=${data.orderId}`,
      redirect: true,
    }

    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  return (
    <div className="checkout-layout">
      <div style={{ maxWidth: 860, margin: '0 auto 24px' }}>
        <Link href="/" className="nav-logo">Healthy<span>Bite</span></Link>
      </div>
      <div className="checkout-inner">
        {/* Left column */}
        <div>
          {/* Plan selector */}
          <div className="checkout-section">
            <h2>Choose Your Plan</h2>
            <div className="plan-grid">
              {PLANS.map(p => (
                <div
                  key={p.id}
                  className={`plan-card${plan === p.id ? ' selected' : ''}`}
                  onClick={() => setPlan(p.id)}
                >
                  <div className="plan-name">{p.name}</div>
                  <div className="plan-price">₹{p.price.toLocaleString('en-IN')}</div>
                  <div className="plan-desc">{p.desc}</div>
                  {p.badge && <div className="plan-badge">{p.badge}</div>}
                </div>
              ))}
            </div>
          </div>

          {/* Delivery slot */}
          <div className="checkout-section">
            <h2>Delivery Slot</h2>
            <div className="slot-grid">
              {SLOTS.map(s => (
                <div
                  key={s.id}
                  className={`slot-card${slot === s.id ? ' selected' : ''}`}
                  onClick={() => setSlot(s.id)}
                >
                  <div className="slot-icon">{s.icon}</div>
                  <div className="slot-name">{s.name}</div>
                  <div className="slot-time">{s.time}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Address */}
          <div className="checkout-section">
            <h2>Delivery Address</h2>
            <div className="address-grid">
              <div className="form-group full-width">
                <label>Address Line 1</label>
                <input name="line1" value={address.line1} onChange={handleAddressChange} placeholder="House no., Street name" />
              </div>
              <div className="form-group full-width">
                <label>Address Line 2 (optional)</label>
                <input name="line2" value={address.line2} onChange={handleAddressChange} placeholder="Landmark, Area" />
              </div>
              <div className="form-group">
                <label>City</label>
                <input name="city" value={address.city} onChange={handleAddressChange} placeholder="Mumbai" />
              </div>
              <div className="form-group">
                <label>Pincode</label>
                <input name="pincode" value={address.pincode} onChange={handleAddressChange} placeholder="400001" />
              </div>
            </div>
          </div>
        </div>

        {/* Order summary */}
        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="summary-row"><span>Plan</span><span>{selectedPlan.name}</span></div>
          <div className="summary-row"><span>Duration</span><span>{selectedPlan.desc}</span></div>
          <div className="summary-row"><span>Slot</span><span style={{ textTransform: 'capitalize' }}>{slot}</span></div>
          <div className="summary-row"><span>Base price/day</span><span>₹499</span></div>
          <div className="summary-row total"><span>Total</span><span>₹{selectedPlan.price.toLocaleString('en-IN')}</span></div>
          <button className="pay-btn" onClick={handlePay} disabled={paying}>
            {paying ? 'Processing…' : `Pay ₹${selectedPlan.price.toLocaleString('en-IN')}`}
          </button>
          <p style={{ fontSize: 11, color: '#aaa', textAlign: 'center', marginTop: 12 }}>
            Secured by Razorpay · Test mode
          </p>
        </div>
      </div>
    </div>
  )
}

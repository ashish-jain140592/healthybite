import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ success?: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { success } = await searchParams

  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const statusClass: Record<string, string> = {
    pending:          'status-pending',
    confirmed:        'status-confirmed',
    out_for_delivery: 'status-confirmed',
    delivered:        'status-delivered',
    cancelled:        'status-cancelled',
  }

  return (
    <div className="orders-layout">
      <div className="orders-inner">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <Link href="/" className="nav-logo">Healthy<span>Bite</span></Link>
          <Link href="/checkout" className="hero-cta" style={{ fontSize: 13, padding: '10px 22px' }}>New Order</Link>
        </div>

        {success && (
          <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '14px 20px', borderRadius: 12, marginBottom: 24, fontWeight: 600, fontSize: 14 }}>
            🎉 Payment successful! Your order is confirmed.
          </div>
        )}

        <h1>My Orders</h1>

        {!orders || orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#888' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🍽️</div>
            <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>No orders yet</p>
            <p style={{ fontSize: 14, marginBottom: 24 }}>Start your healthy journey today</p>
            <Link href="/checkout" className="hero-cta">Browse Plans</Link>
          </div>
        ) : (
          orders.map(order => (
            <div className="order-card" key={order.id}>
              <div className="order-card-info">
                <h4 style={{ textTransform: 'capitalize' }}>{order.plan} Plan — {order.delivery_slot} delivery</h4>
                <p>Delivery: {new Date(order.delivery_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                <p style={{ marginTop: 4 }}>₹{Number(order.total_amount).toLocaleString('en-IN')}</p>
              </div>
              <span className={`order-status ${statusClass[order.status] ?? 'status-pending'}`} style={{ textTransform: 'capitalize' }}>
                {order.status.replace(/_/g, ' ')}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

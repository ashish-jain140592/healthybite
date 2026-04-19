import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'
import { sendOrderConfirmation } from '@/lib/email'

// Use service role client — webhook has no user session
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  const signature = req.headers.get('x-razorpay-signature')

  // Verify webhook signature
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(rawBody)
    .digest('hex')

  if (expectedSignature !== signature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const event = JSON.parse(rawBody)

  if (event.event === 'payment.captured') {
    const payment = event.payload.payment.entity
    const razorpayOrderId = payment.order_id
    const razorpayPaymentId = payment.id

    // Find order by razorpay_order_id
    const { data: order } = await supabase
      .from('orders')
      .update({ payment_status: 'paid', status: 'confirmed', razorpay_payment_id: razorpayPaymentId })
      .eq('razorpay_order_id', razorpayOrderId)
      .select('*, addresses(line1, city, pincode), profiles(id)')
      .single()

    // Send confirmation email
    if (order) {
      // Get user email from auth
      const { data: { users } } = await supabase.auth.admin.listUsers()
      const user = users.find(u => u.id === order.user_id)
      if (user?.email) {
        const addr = order.addresses
        sendOrderConfirmation({
          to: user.email,
          orderId: order.id,
          plan: order.plan,
          slot: order.delivery_slot,
          amount: Number(order.total_amount),
          deliveryDate: order.delivery_date,
          address: addr ? `${addr.line1}, ${addr.city} — ${addr.pincode}` : 'Your delivery address',
        }).catch(console.error)
      }
    }
  }

  if (event.event === 'payment.failed') {
    const payment = event.payload.payment.entity
    await supabase
      .from('orders')
      .update({ payment_status: 'failed', status: 'cancelled' })
      .eq('razorpay_order_id', payment.order_id)
  }

  return NextResponse.json({ received: true })
}

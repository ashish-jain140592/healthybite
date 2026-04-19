import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@/lib/supabase/server'
import { sendOrderConfirmation } from '@/lib/email'

export async function POST(req: NextRequest) {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderId,
  } = await req.json()

  // Verify HMAC signature
  const body = `${razorpay_order_id}|${razorpay_payment_id}`
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest('hex')

  if (expectedSignature !== razorpay_signature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = await createClient()

  // Update order status
  const { data: order } = await supabase
    .from('orders')
    .update({ payment_status: 'paid', status: 'confirmed', razorpay_payment_id })
    .eq('id', orderId)
    .select('*, addresses(line1, city, pincode)')
    .single()

  // Send confirmation email (non-blocking)
  if (order) {
    const { data: { user } } = await supabase.auth.getUser()
    if (user?.email) {
      const addr = order.addresses
      const addressStr = addr
        ? `${addr.line1}, ${addr.city} — ${addr.pincode}`
        : 'Your delivery address'

      sendOrderConfirmation({
        to: user.email,
        orderId: order.id,
        plan: order.plan,
        slot: order.delivery_slot,
        amount: Number(order.total_amount),
        deliveryDate: order.delivery_date,
        address: addressStr,
      }).catch(console.error)
    }
  }

  return NextResponse.json({ success: true })
}

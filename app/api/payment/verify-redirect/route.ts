import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { sendOrderConfirmation } from '@/lib/email'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || ''

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const orderId = searchParams.get('orderId')

  const formData = await req.formData()
  const razorpay_order_id   = formData.get('razorpay_order_id') as string
  const razorpay_payment_id = formData.get('razorpay_payment_id') as string
  const razorpay_signature  = formData.get('razorpay_signature') as string

  // Verify HMAC signature
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex')

  if (expectedSignature !== razorpay_signature) {
    return NextResponse.redirect(`${siteUrl}/checkout?error=payment_failed`)
  }

  // Use service role — no browser session available in redirect
  const supabase = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: order } = await supabase
    .from('orders')
    .update({ payment_status: 'paid', status: 'confirmed', razorpay_payment_id })
    .eq('id', orderId)
    .select('*, addresses(line1, city, pincode)')
    .single()

  if (order) {
    // Fetch user email via service role
    const { data: { user } } = await supabase.auth.admin.getUserById(order.user_id)
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

  return NextResponse.redirect(`${siteUrl}/orders?success=1`)
}

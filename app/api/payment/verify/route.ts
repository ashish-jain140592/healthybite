import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@/lib/supabase/server'

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

  // Update order in Supabase
  const supabase = await createClient()
  await supabase
    .from('orders')
    .update({
      payment_status: 'paid',
      status: 'confirmed',
      razorpay_payment_id,
    })
    .eq('id', orderId)

  return NextResponse.json({ success: true })
}

import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { createClient } from '@/lib/supabase/server'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { plan, slot, address, amount } = await req.json()
  if (!plan || !slot || !address || !amount) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  // Amount in paise
  const amountPaise = Math.round(amount * 100)

  const razorpayOrder = await razorpay.orders.create({
    amount: amountPaise,
    currency: 'INR',
    receipt: `hb_${Date.now()}`,
  })

  // Save address and order to Supabase
  const { data: addressRow } = await supabase
    .from('addresses')
    .insert({ user_id: user.id, line1: address.line1, line2: address.line2 || null, city: address.city, pincode: address.pincode })
    .select('id')
    .single()

  const deliveryDate = new Date()
  deliveryDate.setDate(deliveryDate.getDate() + 1)

  const { data: orderRow } = await supabase
    .from('orders')
    .insert({
      user_id: user.id,
      address_id: addressRow!.id,
      plan,
      delivery_slot: slot,
      subtotal: amount,
      total_amount: amount,
      delivery_date: deliveryDate.toISOString().split('T')[0],
      razorpay_order_id: razorpayOrder.id,
    })
    .select('id')
    .single()

  return NextResponse.json({
    razorpayOrderId: razorpayOrder.id,
    amount: amountPaise,
    orderId: orderRow!.id,
  })
}

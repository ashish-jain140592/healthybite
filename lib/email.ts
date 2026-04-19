import { Resend } from 'resend'

const PLAN_LABELS: Record<string, string> = {
  single: 'Single Day',
  weekly: 'Weekly (7 days)',
  monthly: 'Monthly (30 days)',
}

const SLOT_LABELS: Record<string, string> = {
  morning: 'Morning (by 8 AM)',
  afternoon: 'Afternoon (12–2 PM)',
  evening: 'Evening (6–8 PM)',
}

interface OrderConfirmationParams {
  to: string
  orderId: string
  plan: string
  slot: string
  amount: number
  deliveryDate: string
  address: string
}

export async function sendOrderConfirmation(params: OrderConfirmationParams) {
  const { to, orderId, plan, slot, amount, deliveryDate, address } = params

  const formattedDate = new Date(deliveryDate).toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  const resend = new Resend(process.env.RESEND_API_KEY)
  await resend.emails.send({
    from: 'HealthyBite <orders@healthybite.in>',
    to,
    subject: `Order Confirmed — ₹${amount.toLocaleString('en-IN')} · HealthyBite`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width" /></head>
<body style="margin:0;padding:0;background:#f4faf9;font-family:'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#0d7b6e,#1a9e8e);padding:32px 40px;text-align:center;">
            <h1 style="margin:0;color:#fff;font-size:24px;font-weight:800;letter-spacing:-0.5px;">
              Healthy<span style="color:#ff7043;">Bite</span>
            </h1>
            <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">Your order is confirmed 🎉</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:36px 40px;">
            <p style="margin:0 0 24px;font-size:15px;color:#444;line-height:1.6;">
              Great news! Your order has been confirmed and our kitchen is already preparing your meals.
            </p>

            <!-- Order details -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4faf9;border-radius:12px;padding:20px;margin-bottom:24px;">
              <tr>
                <td style="padding:8px 0;font-size:13px;color:#888;font-weight:600;text-transform:uppercase;letter-spacing:1px;" colspan="2">Order Details</td>
              </tr>
              <tr>
                <td style="padding:8px 0;font-size:14px;color:#555;">Order ID</td>
                <td style="padding:8px 0;font-size:14px;color:#111;font-weight:600;text-align:right;">#${orderId.slice(-8).toUpperCase()}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;font-size:14px;color:#555;border-top:1px solid #e8f5f2;">Plan</td>
                <td style="padding:8px 0;font-size:14px;color:#111;font-weight:600;text-align:right;border-top:1px solid #e8f5f2;">${PLAN_LABELS[plan] ?? plan}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;font-size:14px;color:#555;border-top:1px solid #e8f5f2;">Delivery Slot</td>
                <td style="padding:8px 0;font-size:14px;color:#111;font-weight:600;text-align:right;border-top:1px solid #e8f5f2;">${SLOT_LABELS[slot] ?? slot}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;font-size:14px;color:#555;border-top:1px solid #e8f5f2;">First Delivery</td>
                <td style="padding:8px 0;font-size:14px;color:#111;font-weight:600;text-align:right;border-top:1px solid #e8f5f2;">${formattedDate}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;font-size:14px;color:#555;border-top:1px solid #e8f5f2;">Deliver To</td>
                <td style="padding:8px 0;font-size:14px;color:#111;font-weight:600;text-align:right;border-top:1px solid #e8f5f2;">${address}</td>
              </tr>
              <tr>
                <td style="padding:12px 0 8px;font-size:16px;color:#111;font-weight:800;border-top:2px solid #0d7b6e;">Total Paid</td>
                <td style="padding:12px 0 8px;font-size:16px;color:#1a9e8e;font-weight:800;text-align:right;border-top:2px solid #0d7b6e;">₹${amount.toLocaleString('en-IN')}</td>
              </tr>
            </table>

            <p style="margin:0 0 24px;font-size:14px;color:#666;line-height:1.6;">
              You'll receive a notification when your delivery is on the way. Have questions? Reply to this email.
            </p>

            <div style="text-align:center;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}/orders"
                 style="display:inline-block;background:#ff7043;color:#fff;text-decoration:none;font-weight:700;font-size:14px;padding:13px 32px;border-radius:30px;">
                View My Orders
              </a>
            </div>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f4faf9;padding:20px 40px;text-align:center;border-top:1px solid #e0f5f2;">
            <p style="margin:0;font-size:12px;color:#aaa;">
              © 2026 HealthyBite · Nutritionist-approved meals delivered to your door
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
    `,
  })
}

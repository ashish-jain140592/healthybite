import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'

const poppins = Poppins({
  weight: ['400', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'HealthyBite — Customized Diet Plans & Healthy Food Delivery',
  description:
    'Get nutritionist-approved meal plans delivered to your doorstep. Choose from single-day, weekly, or monthly plans. Fresh, healthy food — delivered on your schedule.',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={poppins.className}>
      <body>{children}</body>
    </html>
  )
}

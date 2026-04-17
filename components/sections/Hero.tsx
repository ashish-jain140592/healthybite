import Link from 'next/link'
import Image from 'next/image'

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-inner">
        <div className="hero-content">
          <span className="hero-tag">Healthy Living</span>
          <h1>Customized Diet Plans &amp; Healthy Food Delivery</h1>
          <p>Get nutritionist-approved meal plans delivered right to your doorstep. Eat healthy, live better — every single day.</p>
          <div className="hero-actions">
            <Link href="#how-it-works" className="hero-cta">Get Started</Link>
            <Link href="#para-shop" className="hero-secondary">Browse Menu</Link>
          </div>
          <div className="hero-stats">
            <div>
              <div className="hero-stat-value">50+</div>
              <div className="hero-stat-label">Diet Plans</div>
            </div>
            <div>
              <div className="hero-stat-value">10k+</div>
              <div className="hero-stat-label">Happy Customers</div>
            </div>
            <div>
              <div className="hero-stat-value">4.9★</div>
              <div className="hero-stat-label">Avg Rating</div>
            </div>
          </div>
        </div>
        <div className="hero-image-wrap">
          <Image
            src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop"
            alt="Healthy meal bowl"
            width={260}
            height={320}
            style={{ objectFit: 'cover', width: '100%', height: '320px' }}
            priority
          />
        </div>
      </div>
    </section>
  )
}

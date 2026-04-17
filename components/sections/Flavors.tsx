import Image from 'next/image'
import Link from 'next/link'

const chips = ['🥗 Salads & Bowls', '🍗 Lean Proteins', '🥤 Detox Drinks', '🌾 Whole Grains', '🥦 Vegan Options', '🍎 Fresh Fruits']

export default function Flavors() {
  return (
    <section id="flavors">
      <div className="flavors-inner">
        <div className="flavors-img-wrap">
          <Image
            src="https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=700&auto=format&fit=crop"
            alt="Fine flavors food spread"
            width={320}
            height={340}
            style={{ objectFit: 'cover', width: '100%', height: '340px' }}
            loading="lazy"
          />
        </div>
        <div className="flavors-text">
          <span className="section-label">Our Menu</span>
          <h2 className="section-title">Fine Flavors of Choice</h2>
          <p>From vibrant salads to hearty grain bowls, our chefs craft meals that combine nutrition with incredible taste — no compromises.</p>
          <div className="flavors-grid">
            {chips.map((chip) => (
              <span className="flavor-chip" key={chip}>{chip}</span>
            ))}
          </div>
          <Link href="#para-shop" className="flavors-cta">Browse Menu</Link>
        </div>
      </div>
    </section>
  )
}

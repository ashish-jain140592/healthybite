import Image from 'next/image'
import Link from 'next/link'

const items = [
  { img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&auto=format&fit=crop', alt: 'Salad Bowl', name: 'Garden Salad Bowl', desc: 'Fresh greens, cherry tomatoes', price: '₹199' },
  { img: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&auto=format&fit=crop', alt: 'Protein Bowl', name: 'Protein Power Bowl', desc: 'Grilled chicken, quinoa', price: '₹349' },
  { img: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&auto=format&fit=crop', alt: 'Smoothie', name: 'Green Detox Smoothie', desc: 'Spinach, banana, almond milk', price: '₹149' },
  { img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&auto=format&fit=crop', alt: 'Meal Prep', name: 'Weekly Meal Prep', desc: '5-day balanced diet plan', price: '₹1,499' },
  { img: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&auto=format&fit=crop', alt: 'Pancakes', name: 'Healthy Pancakes', desc: 'Oat-based, low sugar', price: '₹249' },
  { img: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400&auto=format&fit=crop', alt: 'Veggie Box', name: 'Veggie Box', desc: 'Seasonal organic vegetables', price: '₹299' },
]

export default function ParaShop() {
  return (
    <section id="para-shop">
      <div className="label-wrap"><span className="section-label">#PARASHOP</span></div>
      <h2 className="section-title">Fresh &amp; Healthy Items</h2>
      <p className="section-subtitle">Delivered same-day from local kitchens</p>
      <div className="shop-grid">
        {items.map((item) => (
          <div className="shop-card" key={item.name}>
            <Image
              src={item.img}
              alt={item.alt}
              width={200}
              height={130}
              style={{ objectFit: 'cover', width: '100%', height: '130px' }}
              loading="lazy"
            />
            <div className="shop-card-info">
              <h4>{item.name}</h4>
              <p>{item.desc}</p>
              <div className="price-row">
                <span className="price">{item.price}</span>
                <button className="add-btn">+</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="shop-view-all"><Link href="#">View All Products →</Link></div>
    </section>
  )
}

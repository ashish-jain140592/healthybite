import Image from 'next/image'
import Link from 'next/link'

export default function Featured() {
  return (
    <section id="featured">
      <div className="label-wrap"><span className="section-label">#FEATURED</span></div>
      <h2 className="section-title">From Our Community</h2>
      <p className="section-subtitle">Real stories from real customers</p>
      <div className="featured-layout">
        {/* Hero card */}
        <div className="featured-card hero-card">
          <Image
            src="https://images.unsplash.com/photo-1543353071-873f17a7a088?w=600&auto=format&fit=crop"
            alt="Healthy Eating"
            width={480}
            height={260}
            style={{ objectFit: 'cover', width: '100%', height: '260px' }}
            loading="lazy"
          />
          <div className="featured-card-body">
            <div className="author">
              <Image className="author-avatar" src="https://i.pravatar.cc/80?img=47" alt="Alicia Hart" width={32} height={32} loading="lazy" />
              <div className="author-info">
                <span className="author-name">Alicia Hart</span>
                <span className="author-role">Nutritionist &amp; Blogger</span>
              </div>
            </div>
            <h4>How I Lost 8kg in 3 Months Eating Healthy</h4>
            <p>I switched to customized meal plans and the results were life-changing. No starvation, just the right food at the right time.</p>
            <Link href="#" className="read-more">Read More →</Link>
          </div>
        </div>
        {/* Small card 1 */}
        <div className="featured-card small-card">
          <Image
            src="https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=300&auto=format&fit=crop"
            alt="Meal Prep"
            width={110}
            height={110}
            style={{ objectFit: 'cover', width: '110px', height: '110px', flexShrink: 0 }}
            loading="lazy"
          />
          <div className="featured-card-body">
            <div className="author">
              <Image className="author-avatar" src="https://i.pravatar.cc/80?img=12" alt="Rahul Mehta" width={32} height={32} loading="lazy" />
              <div className="author-info">
                <span className="author-name">Rahul Mehta</span>
                <span className="author-role">Fitness Coach</span>
              </div>
            </div>
            <h4>Why Meal Prep is the Secret Weapon for Athletes</h4>
            <p>Consistency in nutrition is as important as training consistency.</p>
            <Link href="#" className="read-more">Read More →</Link>
          </div>
        </div>
        {/* Small card 2 */}
        <div className="featured-card small-card">
          <Image
            src="https://images.unsplash.com/photo-1547592180-85f173990554?w=300&auto=format&fit=crop"
            alt="Vegan Diet"
            width={110}
            height={110}
            style={{ objectFit: 'cover', width: '110px', height: '110px', flexShrink: 0 }}
            loading="lazy"
          />
          <div className="featured-card-body">
            <div className="author">
              <Image className="author-avatar" src="https://i.pravatar.cc/80?img=32" alt="Priya Nair" width={32} height={32} loading="lazy" />
              <div className="author-info">
                <span className="author-name">Priya Nair</span>
                <span className="author-role">Yoga Instructor</span>
              </div>
            </div>
            <h4>Going Plant-Based: My 30-Day Journey</h4>
            <p>Transitioning to a vegan diet was seamless with curated plans.</p>
            <Link href="#" className="read-more">Read More →</Link>
          </div>
        </div>
      </div>
    </section>
  )
}

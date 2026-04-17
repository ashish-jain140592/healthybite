import Link from 'next/link'

export default function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-brand">
          <Link href="/" className="nav-logo">Healthy<span>Bite</span></Link>
          <p>Nutritionist-approved meal plans &amp; fresh food delivered to your door. Eat well, live better.</p>
        </div>
        <div className="footer-col">
          <h5>Explore</h5>
          <ul>
            <li><Link href="#how-it-works">How It Works</Link></li>
            <li><Link href="#para-shop">Shop</Link></li>
            <li><Link href="#flavors">Our Menu</Link></li>
            <li><Link href="#featured">Blog</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h5>Delivery</h5>
          <ul>
            <li><Link href="#">Morning Slot</Link></li>
            <li><Link href="#">Afternoon Slot</Link></li>
            <li><Link href="#">Evening Slot</Link></li>
            <li><Link href="#">Subscribe &amp; Save</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h5>Company</h5>
          <ul>
            <li><Link href="#">About Us</Link></li>
            <li><Link href="#">Nutritionists</Link></li>
            <li><Link href="#">Privacy Policy</Link></li>
            <li><Link href="#">Contact</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">© 2026 HealthyBite. All rights reserved.</div>
    </footer>
  )
}

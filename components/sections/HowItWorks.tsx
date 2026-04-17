import Image from 'next/image'

const steps = [
  {
    img: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500&auto=format&fit=crop',
    alt: 'Choose Plan',
    icon: '🥗',
    title: 'Choose Plan',
    desc: 'Pick a diet plan tailored to your health goals — weight loss, muscle gain, or balanced nutrition.',
    num: 1,
  },
  {
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&auto=format&fit=crop',
    alt: 'Doorstep Delivery',
    icon: '🚚',
    title: 'Doorstep Delivery',
    desc: 'We deliver fresh, chef-prepared meals straight to your door — on time, every time.',
    num: 2,
  },
  {
    img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop',
    alt: 'Enjoy Your Meal',
    icon: '🍽️',
    title: 'Enjoy Your Meal',
    desc: 'Savour delicious, calorie-counted meals that fuel your body and delight your taste buds.',
    num: 3,
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works">
      <div className="label-wrap"><span className="section-label">#HOWITWORKS</span></div>
      <h2 className="section-title">How It Works</h2>
      <p className="section-subtitle">Three simple steps to healthier eating</p>
      <div className="steps">
        {steps.map((step) => (
          <div className="step" key={step.num}>
            <div className="step-img-wrap">
              <Image
                className="step-img"
                src={step.img}
                alt={step.alt}
                width={270}
                height={150}
                style={{ objectFit: 'cover', width: '100%', height: '150px' }}
                loading="lazy"
              />
              <div className="step-number">{step.num}</div>
            </div>
            <div className="step-body">
              <div className="step-icon">{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

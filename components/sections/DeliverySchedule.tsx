const slots = [
  { icon: '🌅', title: 'Morning Delivery', desc: 'Delivered by 8 AM so you start your day with a nutritious breakfast.' },
  { icon: '☀️', title: 'Afternoon Delivery', desc: 'Lunchtime slots between 12–2 PM, fresh and ready to eat.' },
  { icon: '🌙', title: 'Evening Delivery', desc: 'Dinner deliveries between 6–8 PM, perfectly timed for your evening meal.' },
  { icon: '📦', title: 'Weekly Subscription', desc: 'Subscribe and get automated deliveries for an entire week — save 15%.' },
]

export default function DeliverySchedule() {
  return (
    <section id="delivery-schedule">
      <div className="label-wrap"><span className="section-label">#DELIVERY SCHEDULE</span></div>
      <h2 className="section-title">Choose Your Slot</h2>
      <p className="section-subtitle">Morning, afternoon or evening — we deliver on your schedule</p>
      <div className="schedule-grid">
        {slots.map((slot) => (
          <div className="schedule-card" key={slot.title}>
            <div className="schedule-icon">{slot.icon}</div>
            <div>
              <h4>{slot.title}</h4>
              <p>{slot.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

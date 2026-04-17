import Navbar from '@/components/sections/Navbar'
import Hero from '@/components/sections/Hero'
import HowItWorks from '@/components/sections/HowItWorks'
import ParaShop from '@/components/sections/ParaShop'
import Flavors from '@/components/sections/Flavors'
import DeliverySchedule from '@/components/sections/DeliverySchedule'
import Featured from '@/components/sections/Featured'
import Footer from '@/components/sections/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <HowItWorks />
      <ParaShop />
      <Flavors />
      <DeliverySchedule />
      <Featured />
      <Footer />
    </>
  )
}

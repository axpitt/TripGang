import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { AnimatePresence } from 'framer-motion'

import Preloader from '../components/ui/Preloader'
import Navbar from '../components/ui/Navbar'
import HeroSection from '../sections/HeroSection'
import AboutSection from '../sections/AboutSection'
import TripsSection from '../sections/TripsSection'
import GallerySection from '../sections/GallerySection'
import InstagramSection from '../sections/InstagramSection'
import TeamSection from '../sections/TeamSection'
import FooterSection from '../sections/FooterSection'

const PRELOADER_KEY = 'tg_loaded_v2'

const Home = () => {
  const [showPreloader, setShowPreloader] = useState(() => {
    // Only show preloader once per session
    return !sessionStorage.getItem(PRELOADER_KEY)
  })

  const handlePreloaderComplete = () => {
    sessionStorage.setItem(PRELOADER_KEY, '1')
    setShowPreloader(false)
  }

  return (
    <>
      <Helmet>
        <title>TripGang — Explore. Experience. Evolve. | Monsoon Treks Maharashtra</title>
        <meta name="description" content="TripGang runs affordable monsoon treks and day trips across Maharashtra. Based in Chhatrapati Sambhajinagar. Book the Adrai Jungle Trek 2026 — ₹1,499 early bird." />
        <meta property="og:title" content="TripGang — Monsoon Treks Maharashtra" />
        <meta property="og:description" content="Walk through clouds, waterfalls & untouched rainforest. Book your monsoon trek now." />
        <meta property="og:type" content="website" />
        <meta name="theme-color" content="#081120" />
      </Helmet>

      <AnimatePresence>
        {showPreloader && (
          <Preloader onComplete={handlePreloaderComplete} />
        )}
      </AnimatePresence>

      {!showPreloader && (
        <div style={{ background: '#081120', minHeight: '100vh' }}>
          <Navbar />
          <main>
            <HeroSection />
            <AboutSection />
            <GallerySection />
            <TeamSection />
            <InstagramSection />
          </main>
          <FooterSection />
        </div>
      )}
    </>
  )
}

export default Home

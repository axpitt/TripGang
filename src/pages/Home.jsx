import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'

import Preloader from '../components/ui/Preloader'
import Navbar from '../components/ui/Navbar'
import HeroSection from '../sections/HeroSection'
import AboutSection from '../sections/AboutSection'
import TripsSection from '../sections/TripsSection'
import GallerySection from '../sections/GallerySection'
import InstagramSection from '../sections/InstagramSection'
import TeamSection from '../sections/TeamSection'
import FooterSection from '../sections/FooterSection'

const PRELOADER_KEY = 'tg_loaded_v4'

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
        <title>TripGang — Explore. Experience. Evolve. | Group Trips, Road Trips &amp; Adventures</title>
        <meta name="description" content="TripGang curates affordable group trips, road trips, weekend getaways, camping nights, and mountain adventures across Maharashtra &amp; India. Based in Chhatrapati Sambhajinagar." />
        <meta property="og:title" content="TripGang — Group Trips, Road Trips &amp; Adventures" />
        <meta property="og:description" content="Not just treks — road trips, camping, beach getaways &amp; epic group adventures. Join the gang." />
        <meta property="og:type" content="website" />
        <meta name="theme-color" content="#0A0B0E" />
      </Helmet>

      <AnimatePresence mode="wait">
        {showPreloader && (
          <Preloader onComplete={handlePreloaderComplete} />
        )}
      </AnimatePresence>

      {!showPreloader && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ background: '#0A0B0E', minHeight: '100vh' }}
        >
          <Navbar />
          <main>
            <HeroSection />
            <AboutSection />
            <GallerySection />
            <TeamSection />
            <InstagramSection />
          </main>
          <FooterSection />
        </motion.div>
      )}
    </>
  )
}

export default Home

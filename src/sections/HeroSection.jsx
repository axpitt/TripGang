import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { CampfireParticles } from '../components/prototypes/CampfireParticles'
import QuickBookingModal from '../components/ui/QuickBookingModal'

// Authentic local photography
import hero1 from '../assets/hero1.png'
import hero2 from '../assets/hero2.png'
import hero3 from '../assets/hero3.png'
import hero4 from '../assets/hero4.png'
import hero5 from '../assets/hero5.png'

const SLIDES = [hero1, hero2, hero3, hero4, hero5]

const SLIDE_DURATION = 7000
const KEN_BURNS_DURATION = 8

const HeroSection = () => {
  const ref = useRef(null)
  const [activeSlide, setActiveSlide] = useState(0)
  const [prevSlide, setPrevSlide] = useState(null)
  const [isQuickBookOpen, setIsQuickBookOpen] = useState(false)

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '14%'])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  useEffect(() => {
    const timer = setInterval(() => {
      setPrevSlide(activeSlide)
      setActiveSlide(s => (s + 1) % SLIDES.length)
    }, SLIDE_DURATION)
    return () => clearInterval(timer)
  }, [activeSlide])

  const scrollToTrips = () => {
    const el = document.querySelector('#trips') || document.querySelector('#about')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="hero"
      ref={ref}
      style={{
        position: 'relative',
        height: '100vh',
        minHeight: 680,
        overflow: 'hidden',
        background: '#0A0B0E',
      }}
    >
      {/* ── Background Slideshow with Parallax & Ken Burns ── */}
      <motion.div style={{ y: bgY, position: 'absolute', inset: 0, zIndex: 0 }}>
        <AnimatePresence>
          {prevSlide !== null && (
            <motion.div
              key={`prev-${prevSlide}`}
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 1.6, ease: 'easeInOut' }}
              style={{
                position: 'absolute', inset: 0,
                backgroundImage: `url(${SLIDES[prevSlide]})`,
                backgroundSize: 'cover', backgroundPosition: 'center',
              }}
            />
          )}
        </AnimatePresence>

        <motion.div
          key={`slide-${activeSlide}`}
          initial={{ scale: 1.06, opacity: 0 }}
          animate={{ scale: 1.0, opacity: 1 }}
          transition={{
            scale: { duration: KEN_BURNS_DURATION, ease: 'linear' },
            opacity: { duration: 1.2, ease: 'easeOut' },
          }}
          style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${SLIDES[activeSlide]})`,
            backgroundSize: 'cover', backgroundPosition: 'center',
          }}
        />

        {/* Cinematic Scrim: Deep obsidian vignette with maximum clarity */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `
            radial-gradient(circle at center, rgba(10,11,14,0.3) 0%, rgba(10,11,14,0.72) 100%),
            linear-gradient(to bottom, rgba(10,11,14,0.8) 0%, rgba(10,11,14,0.2) 30%, rgba(10,11,14,0.55) 75%, #0A0B0E 100%)
          `,
        }} />
      </motion.div>

      {/* ── Ambient Campfire Embers (Subtle, Atmospheric) ── */}
      <CampfireParticles
        className="absolute inset-0 z-[4] pointer-events-none"
        maxEmbers={45}
        starCount={30}
      />

      {/* ── Minimalist Content Center ── */}
      <motion.div
        style={{
          y: contentY,
          opacity,
          position: 'relative',
          zIndex: 10,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 24px 20px',
          textAlign: 'center',
          maxWidth: 920,
          margin: '0 auto',
          boxSizing: 'border-box',
        }}
      >
        {/* Subtle Minimal Pill */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: 20 }}
        >
          <button
            onClick={() => setIsQuickBookOpen(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 14px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 9999,
              backdropFilter: 'blur(12px)',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(46, 194, 126, 0.4)'
              e.currentTarget.style.background = 'rgba(46, 194, 126, 0.08)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'
            }}
          >
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#2EC27E',
              boxShadow: '0 0 8px #2EC27E',
            }} />
            <span style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 11.5,
              fontWeight: 500,
              color: '#CBD5E1',
              letterSpacing: 1.2,
              textTransform: 'uppercase',
            }}>
              This Weekend · Harishchandragad Camp
            </span>
            <span style={{ color: '#2EC27E', fontSize: 12 }}>↗</span>
          </button>
        </motion.div>

        {/* Clean, Massive Minimalist Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: 'clamp(52px, 8.5vw, 110px)',
            lineHeight: 0.94,
            letterSpacing: '0.02em',
            color: '#F8FAFC',
            margin: '0 0 20px 0',
            textShadow: '0 10px 30px rgba(0,0,0,0.6)',
          }}
        >
          EXPLORE.<br />
          <span style={{ color: '#2EC27E' }}>EXPERIENCE.</span><br />
          EVOLVE.
        </motion.h1>

        {/* Minimalist Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(14px, 1.2vw, 17px)',
            color: 'rgba(241, 245, 249, 0.72)',
            maxWidth: 580,
            lineHeight: 1.6,
            margin: '0 0 32px 0',
            fontWeight: 300,
            letterSpacing: 0.2,
          }}
        >
          Unscripted group trips, weekend Sahyadri getaways &amp; lakeside campfire nights across Maharashtra. Capped squads. Zero rigidity.
        </motion.p>

        {/* Minimalist Dual CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.34, duration: 0.75 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
            flexWrap: 'wrap',
          }}
        >
          <button
            id="hero-explore"
            onClick={scrollToTrips}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '13px 28px',
              borderRadius: 9999,
              background: '#2EC27E',
              color: '#07160E',
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700,
              fontSize: 14,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 6px 24px rgba(46, 194, 126, 0.35)',
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 10px 32px rgba(46, 194, 126, 0.55)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 6px 24px rgba(46, 194, 126, 0.35)'
            }}
          >
            <span>Explore Trips</span>
            <span>↓</span>
          </button>

          <button
            onClick={() => setIsQuickBookOpen(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '12px 24px',
              borderRadius: 9999,
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#CBD5E1',
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 500,
              fontSize: 13.5,
              cursor: 'pointer',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)'
              e.currentTarget.style.color = '#F8FAFC'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)'
              e.currentTarget.style.color = '#CBD5E1'
            }}
          >
            <span>Lock Spot for ₹499</span>
          </button>
        </motion.div>
      </motion.div>

      {/* ── Minimalist Bottom Scroll Cue ── */}
      <div
        onClick={scrollToTrips}
        style={{
          position: 'absolute',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 15,
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
          opacity: 0.6,
          transition: 'opacity 0.2s',
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
        onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}
      >
        <span style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: 10,
          color: '#94A3B8',
          letterSpacing: 2,
          textTransform: 'uppercase',
        }}>
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ width: 1, height: 18, background: 'rgba(255, 255, 255, 0.3)' }}
        />
      </div>

      {/* ── Seamless Bottom Gradient Edge ── */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 90,
        background: 'linear-gradient(to bottom, transparent, #0A0B0E)',
        pointerEvents: 'none', zIndex: 12,
      }} />

      {/* Quick Booking Modal */}
      <QuickBookingModal
        isOpen={isQuickBookOpen}
        onClose={() => setIsQuickBookOpen(false)}
      />
    </section>
  )
}

export default HeroSection

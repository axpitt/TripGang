import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'

import hero1 from '../assets/hero1.png'
import hero2 from '../assets/hero2.png'
import hero3 from '../assets/hero3.png'
import hero4 from '../assets/hero4.png'
import hero5 from '../assets/hero5.png'

const SLIDES = [hero1, hero2, hero3, hero4, hero5]
const SLIDE_DURATION = 7000
const KEN_BURNS_DURATION = 8

// Navbar height — must match Navbar.jsx height: 72
const NAV_H = 72
// WhatsApp FAB bottom — must match .whatsapp-fab bottom: 24px
const FAB_BOTTOM = 24
// Extra clearance above CTA buttons so they don't crowd the FAB
const CTA_BOTTOM = FAB_BOTTOM + 54  // 78px from bottom — raised to fit tagline below

const generateRain = (count = 20) =>
  Array.from({ length: count }, () => ({
    left: `${Math.random() * 100}%`,
    height: `${Math.random() * 50 + 30}px`,
    animationDuration: `${Math.random() * 1.5 + 0.8}s`,
    animationDelay: `${Math.random() * 3}s`,
    opacity: Math.random() * 0.2 + 0.05,
  }))

const rainDrops = generateRain(20)

// Headline entrance — staggered blocks
const blockEntrance = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: 0.4 + i * 0.14, duration: 1.0, ease: [0.22, 1, 0.36, 1] },
  }),
}

// Side quotes — lateral fade in after headline
const sideEntrance = (dir = 1) => ({
  hidden: { opacity: 0, x: dir * 18 },
  visible: {
    opacity: 1, x: 0,
    transition: { delay: 1.0, duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
})

const HeroSection = () => {
  const ref = useRef(null)
  const [activeSlide, setActiveSlide] = useState(0)
  const [prevSlide, setPrevSlide] = useState(null)

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  // Parallax: background drifts slower, content faster
  const bgY      = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])
  // Content parallax — shifts the center zone up as user scrolls
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '35%'])
  const opacity  = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  useEffect(() => {
    const timer = setInterval(() => {
      setPrevSlide(activeSlide)
      setActiveSlide(s => (s + 1) % SLIDES.length)
    }, SLIDE_DURATION)
    return () => clearInterval(timer)
  }, [activeSlide])

  return (
    <section
      id="hero"
      ref={ref}
      style={{
        position: 'relative',
        height: '100vh',
        minHeight: 600,
        overflow: 'hidden',
      }}
    >

      {/* ══════════════════════════════════════════════════════════
          LAYER 0 — Ken Burns Slideshow
          ══════════════════════════════════════════════════════════ */}
      <motion.div style={{ y: bgY, position: 'absolute', inset: 0, zIndex: 0 }}>

        {/* Outgoing slide fades away */}
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

        {/* Active slide — Ken Burns zoom out */}
        <motion.div
          key={`slide-${activeSlide}`}
          initial={{ scale: 1.08, opacity: 0 }}
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

        {/* Cinematic scrim — darker at top+bottom, lighter in mid */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(
            to bottom,
            rgba(8,17,32,0.72) 0%,
            rgba(8,17,32,0.18) 28%,
            rgba(8,17,32,0.18) 62%,
            rgba(8,17,32,0.78) 100%
          )`,
        }} />

        {/* Slide indicators — vertically centered on right edge */}
        <div style={{
          position: 'absolute', right: 22, top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 5, display: 'flex', gap: 6, flexDirection: 'column',
          alignItems: 'center',
        }}>
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => { setPrevSlide(activeSlide); setActiveSlide(i) }}
              style={{
                width: 2, height: i === activeSlide ? 28 : 10,
                background: i === activeSlide ? '#2EC27E' : 'rgba(255,255,255,0.22)',
                border: 'none', borderRadius: 2, cursor: 'pointer',
                transition: 'all 0.4s ease', padding: 0,
              }}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </motion.div>

      {/* ══════════════════════════════════════════════════════════
          LAYER 1 — Ghost "TRIPGANG" watermark (behind content)
          ══════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.07 }}
        transition={{ delay: 1.4, duration: 1.2, ease: 'easeOut' }}
        style={{
          position: 'absolute', inset: 0, zIndex: 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none', userSelect: 'none', overflow: 'hidden',
        }}
      >
        <span style={{
          fontFamily: 'Bebas Neue, sans-serif',
          fontSize: 'clamp(70px, 14vw, 220px)',
          color: '#F1F5F9',
          letterSpacing: '0.06em',
          lineHeight: 1,
          whiteSpace: 'nowrap',
        }}>
          TRIPGANG
        </span>
      </motion.div>

      {/* ══════════════════════════════════════════════════════════
          LAYER 2 — Rain particles
          ══════════════════════════════════════════════════════════ */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2,
        pointerEvents: 'none', overflow: 'hidden',
      }}>
        <div className="rain-container">
          {rainDrops.map((drop, i) => (
            <div key={i} className="rain-drop" style={drop} />
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          ZONE A — Season badge
          Anchored at top: 0, height: NAV_H
          → sits at EXACTLY the same vertical strip as the navbar
          → nav has z-index:100, badge has z-index:20 (behind nav bar bg)
          → badge appears in the horizontal CENTER gap of the nav
          ══════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0, right: 0,
          height: NAV_H,               // ← matches navbar height exactly
          display: 'flex',
          alignItems: 'center',        // ← vertically aligns with nav links
          justifyContent: 'center',    // ← horizontally centered
          zIndex: 20,                  // ← below nav (100) so nav draws on top
          pointerEvents: 'none',       // ← don't block nav interaction
        }}
      >
        <span
          className="badge badge-accent"
          style={{ fontSize: 10, letterSpacing: 2, pointerEvents: 'none' }}
        >
          <span style={{
            width: 5, height: 5, background: '#2EC27E',
            borderRadius: '50%', display: 'inline-block',
            animation: 'pulse-dot 2s ease-in-out infinite',
            flexShrink: 0,
          }} />
          MONSOON SEASON 2026
        </span>
      </motion.div>

      {/* ══════════════════════════════════════════════════════════
          ZONE B — Headline + side quotes
          Fills the space between badge strip and CTA strip
          paddingTop: NAV_H clears the badge zone
          paddingBottom: CTA area clears the CTA zone
          flexbox centers the 3-col grid in the remaining space
          ══════════════════════════════════════════════════════════ */}
      <motion.div
        style={{
          y: contentY,
          opacity,
          position: 'absolute',
          inset: 0,
          zIndex: 10,
          paddingTop: NAV_H,            // ← clear badge/nav zone
          paddingBottom: 130,           // ← clear CTA zone (78 bottom + 48 button height)
          paddingLeft: 40,
          paddingRight: 40,
          display: 'flex',
          alignItems: 'center',        // ← vertically centers within available space
          justifyContent: 'center',
          pointerEvents: 'none',       // ← let clicks pass to bg for slide dots
        }}
      >
        {/* 3-column editorial grid */}
        <div className="hero-grid" style={{ width: '100%', maxWidth: 1280 }}>

          {/* LEFT QUOTE — John Muir */}
          <motion.div
            variants={sideEntrance(-1)}
            initial="hidden"
            animate="visible"
            className="hero-quote hero-quote--left"
            style={{ pointerEvents: 'auto' }}
          >
            {/* Large opening quote mark */}
            <span style={{
              fontFamily: 'Georgia, serif',
              fontSize: 48,
              color: '#38BDF8',
              lineHeight: 1,
              marginBottom: -8,
              display: 'block',
              opacity: 0.8,
            }}>&ldquo;</span>
            <p style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 'clamp(11px, 0.95vw, 14px)',
              color: 'rgba(241,245,249,0.72)',
              lineHeight: 1.75,
              letterSpacing: 0.2,
              fontStyle: 'italic',
            }}>
              The mountains are calling,<br />
              and I must go.
            </p>
            <span style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 11,
              color: '#2EC27E',
              letterSpacing: 1.5,
              marginTop: 10,
              display: 'block',
              fontStyle: 'normal',
              fontWeight: 600,
            }}>— John Muir</span>
          </motion.div>

          {/* CENTER — Headline + tagline */}
          <div style={{ textAlign: 'center', pointerEvents: 'auto' }}>
            <motion.h1
              custom={0}
              variants={blockEntrance}
              initial="hidden"
              animate="visible"
              style={{
                fontFamily: 'Bebas Neue, sans-serif',
                fontSize: 'clamp(50px, 9vw, 136px)',
                lineHeight: 0.93,
                color: '#F1F5F9',
                letterSpacing: '0.025em',
                margin: 0,
              }}
            >
              EXPLORE.<br />
              <span style={{ color: '#2EC27E' }}>EXPERIENCE.</span><br />
              EVOLVE.
            </motion.h1>

            {/* Center tagline — unique from both side quotes */}
            <motion.p
              custom={1}
              variants={blockEntrance}
              initial="hidden"
              animate="visible"
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: 'clamp(13px, 1.1vw, 16px)',
                color: 'rgba(241,245,249,0.70)',
                lineHeight: 1.65,
                marginTop: 20,
                letterSpacing: 0.3,
              }}
            >
              Walk through clouds, waterfalls &amp; untouched Sahyadri rainforest.{' '}
              <span style={{ color: '#38BDF8', fontWeight: 500 }}>Not just treks.</span>
            </motion.p>
          </div>

          {/* RIGHT QUOTE — J.R.R. Tolkien */}
          <motion.div
            variants={sideEntrance(1)}
            initial="hidden"
            animate="visible"
            className="hero-quote hero-quote--right"
            style={{ pointerEvents: 'auto' }}
          >
            {/* Large opening quote mark — right-aligned */}
            <span style={{
              fontFamily: 'Georgia, serif',
              fontSize: 48,
              color: '#2EC27E',
              lineHeight: 1,
              marginBottom: -8,
              display: 'block',
              textAlign: 'right',
              opacity: 0.8,
            }}>&ldquo;</span>
            <p style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 'clamp(11px, 0.95vw, 14px)',
              color: 'rgba(241,245,249,0.72)',
              lineHeight: 1.75,
              letterSpacing: 0.2,
              textAlign: 'right',
              fontStyle: 'italic',
            }}>
              Not all those who<br />
              wander are lost.
            </p>
            <span style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 11,
              color: '#2EC27E',
              letterSpacing: 1.5,
              marginTop: 10,
              display: 'block',
              textAlign: 'right',
              fontStyle: 'normal',
              fontWeight: 600,
            }}>— J.R.R. Tolkien</span>
          </motion.div>
        </div>
      </motion.div>

      {/* ══════════════════════════════════════════════════════════
          ZONE C — CTA Buttons
          Anchored at bottom: CTA_BOTTOM (32px)
          → matches the WhatsApp FAB which is at bottom: 24px
          → buttons bottom edge is at 32px, FAB center at ~53px
          → visually they share the same horizontal band
          ══════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'absolute',
          bottom: CTA_BOTTOM,           // ← anchored to match FAB level
          left: 0, right: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          zIndex: 20,
          padding: '0 40px',
          flexWrap: 'wrap',
        }}
      >
        <a
          id="hero-book-now"
          href="https://wa.me/917038276535?text=Hi%20Arpit!%20I%20want%20to%20book%20the%20Adrai%20Jungle%20Trek%202026"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-cta"
          style={{ fontSize: 14, padding: '12px 30px' }}
        >
          <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.5-.173-.001-.371-.001-.57-.001-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
          </svg>
          Book Now — ₹1,499
        </a>
        <button
          id="hero-explore"
          onClick={() => document.querySelector('#trips')?.scrollIntoView({ behavior: 'smooth' })}
          className="btn-outline"
          style={{ fontSize: 14, padding: '12px 30px' }}
        >
          <span>Explore Trips ↓</span>
        </button>
      </motion.div>

      {/* Keyframe */}
      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.7); }
        }

        /* ── Editorial 3-column grid ── */
        .hero-grid {
          display: grid;
          grid-template-columns: 185px 1fr 185px;
          gap: 28px;
          align-items: center;
        }

        .hero-quote {
          display: flex;
          flex-direction: column;
        }
        .hero-quote--left  { align-items: flex-start;  padding-top: 18px; }
        .hero-quote--right { align-items: flex-end;    padding-top: 18px; }

        /* Wide screens — expand side columns */
        @media (min-width: 1440px) {
          .hero-grid { grid-template-columns: 220px 1fr 220px; gap: 44px; }
        }

        /* Narrow laptop — compress side columns */
        @media (max-width: 1280px) {
          .hero-grid { grid-template-columns: 145px 1fr 145px; gap: 20px; }
        }

        /* Tablet — hide side quotes, single column */
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr; gap: 0; }
          .hero-quote { display: none; }
        }

        /* Mobile — tighter padding */
        @media (max-width: 600px) {
          #hero [style*="padding: 0 40px"] { padding: 0 20px !important; }
        }
      `}</style>
    </section>
  )
}

export default HeroSection

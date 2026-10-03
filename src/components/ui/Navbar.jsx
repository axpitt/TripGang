import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import logoImg from '../../assets/logo.png'

const NAV_LINKS = [
  { label: 'Home',    href: '#hero' },
  { label: 'About',   href: '#about' },
  { label: 'Trips',   href: '#trips' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Team',    href: '#team' },
]

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNav = (href) => {
    setMenuOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <header
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
          padding: '0 24px',
          background: scrolled ? 'rgba(8, 17, 32, 0.88)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(56,189,248,0.08)' : 'none',
          transition: 'background 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: 72,
        }}
      >
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            display: 'flex', alignItems: 'center', gap: 11,
          }}
        >
          <img
            src={logoImg}
            alt="TripGang Logo"
            style={{
              width: 38, height: 38, borderRadius: '50%',
              objectFit: 'cover',
              border: '1.5px solid rgba(46,194,126,0.5)',
              boxShadow: '0 0 14px rgba(46,194,126,0.25)',
            }}
          />
          <span style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: 28,
            letterSpacing: 3,
            lineHeight: 1,
          }}>
            <span style={{ color: '#F1F5F9' }}>TRIP</span>
            <span style={{ color: '#2EC27E' }}>GANG</span>
          </span>
        </button>

        {/* Desktop links */}
        <div style={{ display: 'flex', gap: 36, alignItems: 'center' }} className="desktop-nav">
          {NAV_LINKS.map(link => (
            <NavLink key={link.label} link={link} onClick={() => handleNav(link.href)} />
          ))}
          <a
            href="https://wa.me/917038276535?text=Hi%20TripGang!%20I%20want%20to%20know%20more%20about%20upcoming%20trips."
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cta"
            style={{ padding: '10px 24px', fontSize: 13 }}
          >
            Book Now
          </a>
        </div>

        {/* Hamburger */}
        <button
          id="hamburger-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: 'none', background: 'none', border: 'none',
            cursor: 'pointer', flexDirection: 'column', gap: 6, padding: 4,
          }}
          className="hamburger"
          aria-label="Toggle menu"
        >
          {[0, 1, 2].map(i => (
            <motion.span
              key={i}
              animate={menuOpen ? {
                rotate: i === 0 ? 45 : i === 2 ? -45 : 0,
                y: i === 0 ? 10 : i === 2 ? -10 : 0,
                opacity: i === 1 ? 0 : 1,
              } : { rotate: 0, y: 0, opacity: 1 }}
              transition={{ duration: 0.25 }}
              style={{
                display: 'block', width: 26, height: 2,
                background: '#2EC27E', borderRadius: 2,
                transformOrigin: 'center',
              }}
            />
          ))}
        </button>
      </header>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'fixed', top: 72, left: 0, right: 0, zIndex: 99,
              background: 'rgba(8,17,32,0.97)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(56,189,248,0.08)',
              padding: '28px 32px 36px',
              display: 'flex', flexDirection: 'column', gap: 8,
            }}
          >
            {NAV_LINKS.map((link, i) => (
              <motion.button
                key={link.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => handleNav(link.href)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontFamily: 'Bebas Neue, sans-serif',
                  fontSize: 36, letterSpacing: 3,
                  color: '#F1F5F9', textAlign: 'left',
                  padding: '10px 0',
                  borderBottom: '1px solid rgba(56,189,248,0.06)',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#2EC27E'}
                onMouseLeave={e => e.currentTarget.style.color = '#F1F5F9'}
              >
                {link.label}
              </motion.button>
            ))}
            <motion.a
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              href="https://wa.me/917038276535?text=Hi%20TripGang!%20I%20want%20to%20book%20a%20trip."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-cta"
              style={{ textAlign: 'center', marginTop: 16 }}
              onClick={() => setMenuOpen(false)}
            >
              Book Now on WhatsApp
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: flex !important; }
        }
      `}</style>
    </>
  )
}

// Nav link with cyan underline hover effect
const NavLink = ({ link, onClick }) => {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'none', border: 'none', cursor: 'pointer',
        fontFamily: 'Space Grotesk, sans-serif', fontSize: 14,
        fontWeight: 500, color: hovered ? '#F1F5F9' : '#94A3B8',
        letterSpacing: 0.5, position: 'relative', padding: '4px 0',
        transition: 'color 0.2s',
      }}
    >
      {link.label}
      {/* Waterfall Cyan underline slides in from left */}
      <motion.span
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: 1.5, background: '#38BDF8',
          transformOrigin: 'left',
        }}
      />
    </button>
  )
}

export default Navbar

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import logoImg from '../../assets/logo.png'
import QuickBookingModal from './QuickBookingModal'

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
  const [activeSection, setActiveSection] = useState('#hero')
  const [isQuickBookOpen, setIsQuickBookOpen] = useState(false)

  // Scroll listener for sticky floating capsule & active section spy
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setScrolled(scrollY > 35)

      // If near top of viewport, definitely Home
      if (scrollY < 120) {
        setActiveSection('#hero')
        return
      }

      // Robust getBoundingClientRect spy
      const sectionIds = ['#team', '#gallery', '#trips', '#about', '#hero']
      for (const id of sectionIds) {
        const el = document.querySelector(id)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= window.innerHeight * 0.45 && rect.bottom >= 120) {
            setActiveSection(id)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNav = (href) => {
    setMenuOpen(false)
    setActiveSection(href)
    const el = document.querySelector(href)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      {/* ── Outer Shell: Floating Island Capsule ── */}
      <div
        style={{
          position: 'fixed',
          top: scrolled ? 12 : 0,
          left: 0,
          right: 0,
          zIndex: 90,
          display: 'flex',
          justifyContent: 'center',
          padding: scrolled ? '0 16px' : '0',
          pointerEvents: 'none',
          transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <header
          style={{
            pointerEvents: 'auto',
            width: scrolled ? 'min(980px, 100%)' : '100%',
            height: scrolled ? 54 : 68,
            padding: scrolled ? '0 18px' : '0 32px',
            background: scrolled
              ? 'rgba(10, 11, 14, 0.85)'
              : 'transparent',
            backdropFilter: scrolled ? 'blur(20px)' : 'none',
            WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
            borderRadius: scrolled ? 9999 : 0,
            border: scrolled
              ? '1px solid rgba(255, 255, 255, 0.1)'
              : '1px solid transparent',
            boxShadow: scrolled
              ? '0 12px 32px rgba(0, 0, 0, 0.6), 0 0 16px rgba(46, 194, 126, 0.08)'
              : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
            boxSizing: 'border-box',
          }}
        >
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 9,
            }}
          >
            <img
              src={logoImg}
              alt="TripGang Logo"
              style={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                objectFit: 'cover',
                border: '1.5px solid rgba(46,194,126,0.6)',
              }}
            />
            <span
              style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: 22,
                letterSpacing: 2,
                lineHeight: 1,
              }}
            >
              <span style={{ color: '#F8FAFC' }}>TRIP</span>
              <span style={{ color: '#2EC27E' }}>GANG</span>
            </span>
          </button>

          {/* Desktop links */}
          <nav
            style={{
              display: 'flex',
              gap: 6,
              alignItems: 'center',
            }}
            className="desktop-nav"
          >
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.href
              return (
                <button
                  key={link.label}
                  onClick={() => handleNav(link.href)}
                  style={{
                    position: 'relative',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: 13,
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? '#F8FAFC' : '#94A3B8',
                    padding: '6px 14px',
                    borderRadius: 9999,
                    transition: 'color 0.2s',
                    outline: 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.color = '#F8FAFC'
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.color = '#94A3B8'
                  }}
                >
                  {/* Subtle Gliding Pill Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: 9999,
                        background: 'rgba(46, 194, 126, 0.12)',
                        border: '1px solid rgba(46, 194, 126, 0.35)',
                        zIndex: -1,
                      }}
                    />
                  )}
                  {link.label}
                </button>
              )
            })}
          </nav>

          {/* Right Action: Clean Minimal Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={() => setIsQuickBookOpen(true)}
              className="desktop-nav"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '7px 18px',
                borderRadius: 9999,
                background: '#2EC27E',
                color: '#07160E',
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 700,
                fontSize: 12.5,
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)'
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(46, 194, 126, 0.4)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <span>Book A Trip</span>
            </button>

            {/* Mobile Hamburger */}
            <button
              id="hamburger-btn"
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                display: 'none',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 8,
                cursor: 'pointer',
                flexDirection: 'column',
                gap: 4,
                padding: '8px',
              }}
              className="hamburger"
              aria-label="Toggle menu"
            >
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  animate={menuOpen ? {
                    rotate: i === 0 ? 45 : i === 2 ? -45 : 0,
                    y: i === 0 ? 6 : i === 2 ? -6 : 0,
                    opacity: i === 1 ? 0 : 1,
                  } : { rotate: 0, y: 0, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    display: 'block',
                    width: 20,
                    height: 2,
                    background: '#2EC27E',
                    borderRadius: 2,
                    transformOrigin: 'center',
                  }}
                />
              ))}
            </button>
          </div>
        </header>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed',
              top: 70,
              left: 16,
              right: 16,
              zIndex: 99,
              background: '#101218',
              borderRadius: 20,
              border: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.85)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.href
              return (
                <button
                  key={link.label}
                  onClick={() => handleNav(link.href)}
                  style={{
                    background: isActive ? 'rgba(46, 194, 126, 0.12)' : 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: 20,
                    letterSpacing: 1.5,
                    color: isActive ? '#2EC27E' : '#F8FAFC',
                    textAlign: 'left',
                    padding: '10px 14px',
                    borderRadius: 10,
                  }}
                >
                  {link.label}
                </button>
              )
            })}

            <button
              onClick={() => {
                setMenuOpen(false)
                setIsQuickBookOpen(true)
              }}
              style={{
                marginTop: 10,
                width: '100%',
                padding: '12px',
                borderRadius: 10,
                background: '#2EC27E',
                color: '#07160E',
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 700,
                fontSize: 13.5,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Instant Booking / ₹499 Hold
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Booking Interactive Drawer/Modal */}
      <QuickBookingModal
        isOpen={isQuickBookOpen}
        onClose={() => setIsQuickBookOpen(false)}
      />

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: flex !important; }
        }
      `}</style>
    </>
  )
}

export default Navbar

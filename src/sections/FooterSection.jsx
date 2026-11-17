import { motion } from 'framer-motion'
import logoImg from '../assets/logo.png'

const LINKS = {
  quick: [
    { label: 'Home', href: '#hero' },
    { label: 'About Us', href: '#about' },
    { label: 'Upcoming Trips', href: '#trips' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Meet the Gang', href: '#team' },
  ],
}

const FooterSection = () => {
  const scrollTo = (href) => {
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer style={{
      background: '#07080B',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      padding: 'clamp(60px, 8vw, 100px) 24px 32px',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Top grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr',
          gap: 60, marginBottom: 60
        }}
        className="footer-grid"
        >
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <img
                src={logoImg}
                alt="TripGang Logo"
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '1.5px solid rgba(46,194,126,0.4)',
                  boxShadow: '0 0 16px rgba(46,194,126,0.2)',
                }}
              />
              <div style={{ fontFamily: 'Clash Display, sans-serif', fontSize: 36, letterSpacing: 4, lineHeight: 1 }}>
                <span style={{ color: '#F1F5F9' }}>TRIP</span><span style={{ color: '#2EC27E' }}>GANG</span>
              </div>
            </div>
            <p style={{ fontFamily: 'Satoshi, sans-serif', fontSize: 15, color: '#475569', lineHeight: 1.7, maxWidth: 280, marginBottom: 24 }}>
              Not just treks — road trips, weekend getaways, camping, and group adventures all around. We're the friends who plan the trip so you don't have to.
            </p>
            {/* Social */}
            <div style={{ display: 'flex', gap: 12 }}>
              <a
                href="https://wa.me/917038276535"
                target="_blank" rel="noopener noreferrer"
                style={{
                  width: 40, height: 40, borderRadius: '50%', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.18)',
                  color: '#25d366', fontSize: 18, textDecoration: 'none', transition: 'all 0.2s',
                }}
              >
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.5-.173-.001-.371-.001-.57-.001-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/></svg>
              </a>
              <a
                href="https://instagram.com/tripgang.co"
                target="_blank" rel="noopener noreferrer"
                style={{
                  width: 40, height: 40, borderRadius: '50%', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(56,189,248,0.07)', border: '1px solid rgba(56,189,248,0.15)',
                  color: '#38BDF8', fontSize: 18, textDecoration: 'none', transition: 'all 0.2s',
                }}
              >
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a
                href="mailto:tripgangofficial@gmail.com"
                style={{
                  width: 40, height: 40, borderRadius: '50%', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(56,189,248,0.07)', border: '1px solid rgba(56,189,248,0.15)',
                  color: '#38BDF8', textDecoration: 'none', transition: 'all 0.2s',
                }}
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 style={{ fontFamily: 'Satoshi, sans-serif', fontSize: 11, fontWeight: 700, color: '#2EC27E', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 20 }}>
              Quick Links
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {LINKS.quick.map(l => (
                <button key={l.label} onClick={() => scrollTo(l.href)}
                   style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Satoshi, sans-serif', fontSize: 14, color: '#475569', textAlign: 'left', transition: 'color 0.2s', padding: 0 }}
                  onMouseEnter={e => e.target.style.color = '#38BDF8'}
                  onMouseLeave={e => e.target.style.color = '#475569'}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontFamily: 'Satoshi, sans-serif', fontSize: 11, fontWeight: 700, color: '#2EC27E', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 20 }}>
              Contact
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { icon: '📍', text: 'Chhatrapati Sambhajinagar, Maharashtra' },
                { icon: '📧', text: 'tripgangofficial@gmail.com', href: 'mailto:tripgangofficial@gmail.com' },
                { icon: '📱', text: '+91 70382 76535', href: 'tel:+917038276535' },
              ].map(({ icon, text, href }) => (
                <div key={text} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span>{icon}</span>
                  {href ? (
                    <a href={href} style={{ fontFamily: 'Satoshi, sans-serif', fontSize: 14, color: '#475569', textDecoration: 'none', transition: 'color 0.2s', lineHeight: 1.4 }}
                      onMouseEnter={e => e.target.style.color = '#38BDF8'}
                      onMouseLeave={e => e.target.style.color = '#475569'}
                    >{text}</a>
                  ) : (
                    <span style={{ fontFamily: 'Satoshi, sans-serif', fontSize: 14, color: '#475569', lineHeight: 1.4 }}>{text}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(56,189,248,0.07)', marginBottom: 28 }} />

        {/* Bottom bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontFamily: 'Satoshi, sans-serif', fontSize: 13, color: '#475569' }}>
            © 2026 TripGang. All rights reserved.
          </p>
          <p style={{ fontFamily: 'Satoshi, sans-serif', fontSize: 11, color: '#1B3B5A', letterSpacing: 2 }}>
            EXPLORE. EXPERIENCE. EVOLVE.
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </footer>
  )
}

export default FooterSection




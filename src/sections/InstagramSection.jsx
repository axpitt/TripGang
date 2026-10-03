import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const InstagramSection = () => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section
      id="instagram"
      style={{
        padding: 'clamp(80px, 10vw, 120px) 24px',
        background: '#081120',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Gradient orbs */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `
          radial-gradient(circle at 20% 50%, rgba(138,58,185,0.05) 0%, transparent 50%),
          radial-gradient(circle at 80% 50%, rgba(240,148,51,0.05) 0%, transparent 50%)
        `,
      }} />

      <div ref={ref} style={{ maxWidth: 700, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <motion.p
            className="section-eyebrow"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{ justifyContent: 'center', display: 'flex' }}
          >
            Follow the Journey
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 50, scale: 0.96 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ delay: 0.12, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: 'clamp(42px, 6vw, 84px)',
              lineHeight: 1, color: '#F1F5F9', letterSpacing: 1,
              marginBottom: 16,
            }}
          >
            WE'RE ON{' '}
            <span style={{
              background: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>INSTAGRAM</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.25, duration: 0.7 }}
            style={{
              fontFamily: 'Inter, sans-serif', fontSize: 16,
              color: '#94A3B8', maxWidth: 420, margin: '0 auto',
            }}
          >
            Live updates, behind-the-scenes, and real moments from every trek. Don't miss out.
          </motion.p>
        </div>

        {/* CTA Block */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.35, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', gap: 24,
            background: 'linear-gradient(135deg, rgba(138,58,185,0.08), rgba(240,148,51,0.08))',
            border: '1px solid rgba(240,148,51,0.12)',
            borderRadius: 24, padding: '48px 32px',
            textAlign: 'center',
          }}
        >
          {/* Instagram handle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 60, height: 60, borderRadius: '50%',
              background: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 8px 24px rgba(220,39,67,0.3)',
            }}>
              <svg width="28" height="28" fill="white" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{
                fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700,
                fontSize: 22, color: '#F1F5F9',
              }}>@tripgang.co</div>
              <div style={{
                fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#475569', marginTop: 2,
              }}>Follow us for real-time trek updates</div>
            </div>
          </div>

          <a
            id="footer-instagram-cta"
            href="https://instagram.com/tripgang.co"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '14px 40px',
              background: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
              color: '#fff', fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700, fontSize: 16, borderRadius: 8,
              textDecoration: 'none', transition: 'transform 0.25s ease, box-shadow 0.25s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(220,39,67,0.4)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
            </svg>
            Follow @tripgang.co
          </a>
        </motion.div>
      </div>
    </section>
  )
}

export default InstagramSection

import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useRef } from 'react'
import TripsSection from './TripsSection'

const stats = [
  { value: '12+', label: 'Trips Completed' },
  { value: '100+', label: 'Happy Travelers' },
  { value: '4',   label: 'Trip Coordinators' },
  { value: '0',   label: 'Boring Weekends' },
]

const StatCard = ({ value, label, index }) => (
  <div
    style={{
      textAlign: 'center', padding: '16px 14px',
      borderLeft: index > 0 ? '1px solid rgba(255,255,255,0.08)' : 'none',
      flex: 1,
    }}
  >
    <div style={{
      fontFamily: 'Clash Display, sans-serif',
      fontSize: 'clamp(32px, 4.5vw, 48px)',
      color: '#2EC27E', lineHeight: 1, marginBottom: 4,
    }}>{value}</div>
    <div style={{
      fontFamily: 'Satoshi, sans-serif',
      fontSize: 11.5, color: '#94A3B8',
      letterSpacing: 1.8, textTransform: 'uppercase',
    }}>{label}</div>
  </div>
)

const AboutSection = () => {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Silky physics-based spring to eliminate mouse wheel stepped increments
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 65,
    damping: 26,
    mass: 0.18,
    restDelta: 0.0001,
  })

  // Pointer events driven smoothly without sudden display toggles
  const aboutPointerEvents = useTransform(smoothProgress, v => v < 0.24 ? 'auto' : 'none')
  const tripsPointerEvents = useTransform(smoothProgress, v => v > 0.26 ? 'auto' : 'none')

  // Phase 1: About Section fade out and gentle float up as zoom starts
  const aboutOpacity = useTransform(smoothProgress, [0.04, 0.26], [1, 0])
  const aboutScale   = useTransform(smoothProgress, [0.04, 0.26], [1, 0.94])
  const aboutY       = useTransform(smoothProgress, [0.04, 0.26], [0, -28])

  // Phase 2: Sahyadri photo zooms smoothly forward toward center screen
  const zoomScale    = useTransform(smoothProgress, [0.04, 0.30], [1, 5.2])
  const zoomX        = useTransform(smoothProgress, [0.04, 0.30], ['0%', '24%'])
  const zoomY        = useTransform(smoothProgress, [0.04, 0.30], ['0%', '-14%'])
  const zoomRadius   = useTransform(smoothProgress, [0.04, 0.24], [14, 0])
  const pinOpacity   = useTransform(smoothProgress, [0.04, 0.16], [1, 0])

  // Fullscreen high-res Sahyadri background backdrop takes over (softly fainted)
  const bgOpacity    = useTransform(smoothProgress, [0.08, 0.26, 0.88, 1], [0, 0.48, 0.48, 0.18])
  const bgScale      = useTransform(smoothProgress, [0.08, 0.55], [1.2, 1.02])

  // Phase 3: Upcoming Trips emerges cleanly from inside the Sahyadri mountains
  const tripsOpacity = useTransform(smoothProgress, [0.22, 0.38, 0.88, 1], [0, 1, 1, 0.75])
  const tripsScale   = useTransform(smoothProgress, [0.22, 0.38], [0.94, 1])
  const tripsY       = useTransform(smoothProgress, [0.22, 0.38], [30, 0])

  return (
    <section id="about" style={{ background: '#0A0B0E', position: 'relative' }}>
      {/* 300vh Scroll track: pins at top, zooms into Sahyadri, reveals Trips */}
      <div ref={containerRef} style={{ height: '300vh', position: 'relative' }}>
        <div style={{
          position: 'sticky', top: 0, height: '100vh', width: '100%',
          overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>

          {/* ── Layer 0: Full-screen Sahyadri Mountain Landscape Backdrop (Fainted) ── */}
          <motion.div
            style={{
              position: 'absolute', inset: 0,
              scale: bgScale, opacity: bgOpacity,
              zIndex: 1, pointerEvents: 'none',
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=85"
              alt="Sahyadri Maharashtra landscape"
              style={{
                width: '100%', height: '100%', objectFit: 'cover',
                filter: 'brightness(0.5) contrast(1.05)',
              }}
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(ellipse at center, rgba(10,11,14,0.75) 0%, rgba(10,11,14,0.98) 100%)',
            }} />
          </motion.div>

          {/* ── Layer 1: The About Story Screen (Hidden once Trips begins) ── */}
          <motion.div
            style={{
              position: 'absolute', inset: 0,
              display: 'flex',
              flexDirection: 'column', justifyContent: 'center',
              padding: 'clamp(20px, 3vh, 32px) 24px', boxSizing: 'border-box',
              zIndex: 10,
              opacity: aboutOpacity,
              scale: aboutScale,
              y: aboutY,
              pointerEvents: aboutPointerEvents,
            }}
          >
            <div style={{ maxWidth: 1180, margin: '0 auto', width: '100%', position: 'relative' }}>

              {/* Heading */}
              <div
                style={{
                  marginBottom: 18, textAlign: 'center', position: 'relative',
                }}
              >
                <span
                  style={{
                    fontFamily: 'Clash Display, sans-serif',
                    fontSize: 'clamp(60px, 12vw, 120px)',
                    color: '#F1F5F9', opacity: 0.04,
                    position: 'absolute', top: '-0.3em', left: '50%',
                    transform: 'translateX(-50%)', whiteSpace: 'nowrap',
                    pointerEvents: 'none', userSelect: 'none',
                    letterSpacing: '0.08em', lineHeight: 1, zIndex: 0,
                  }}
                >
                  ABOUT
                </span>

                <p
                  className="section-eyebrow"
                  style={{ position: 'relative', zIndex: 2, marginBottom: 4, letterSpacing: 2.5, fontSize: 13 }}
                >
                  Our Story
                </p>

                <h2
                  style={{
                    fontFamily: 'Clash Display, sans-serif',
                    fontSize: 'clamp(34px, 4.4vw, 52px)',
                    lineHeight: 1, color: '#F1F5F9',
                    letterSpacing: 1, margin: 0,
                    position: 'relative', zIndex: 2,
                  }}
                >
                  THE STORY BEHIND <span style={{ color: '#2EC27E' }}>THE GANG</span>
                </h2>
              </div>

              {/* Content grid */}
              <div style={{
                display: 'grid', gridTemplateColumns: '1.05fr 0.95fr',
                gap: 28, alignItems: 'center',
              }}>
                {/* Left: story text + zooming Sahyadri photo */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <p style={{
                      fontFamily: 'Satoshi, sans-serif', fontSize: 14.5,
                      color: '#94A3B8', lineHeight: 1.65, margin: 0,
                    }}>
                      It started with a simple idea — take 30 friends on an impromptu weekend escape. When we all arrived at our campsite, sharing laughs, music, and stories around the campfire... we looked like a{' '}
                      <span style={{ color: '#2EC27E', fontWeight: 600 }}>gang</span>. A trip gang.
                    </p>
                    <p style={{
                      fontFamily: 'Satoshi, sans-serif', fontSize: 14.5,
                      color: '#94A3B8', lineHeight: 1.65, margin: 0,
                    }}>
                      Based out of Chhatrapati Sambhajinagar, TripGang curates all-inclusive group trips, road trips, weekend getaways, camping nights, and adventure expeditions across Maharashtra &amp; India. We're not a travel agency — we're the friends who plan the entire trip so you don't have to.
                    </p>
                    <p style={{
                      fontFamily: 'Satoshi, sans-serif', fontSize: 16,
                      color: '#F1F5F9', fontWeight: 600, letterSpacing: 0.5, margin: '2px 0 0',
                    }}>
                      Spontaneous. Affordable. <span style={{ color: '#2EC27E' }}>Unforgettable.</span>
                    </p>
                  </div>

                  {/* Sahyadri Photo — zooms forward to fill screen */}
                  <motion.div
                    style={{
                      borderRadius: zoomRadius,
                      overflow: 'hidden',
                      border: '1px solid rgba(255,255,255,0.08)',
                      marginTop: 6, position: 'relative',
                      scale: zoomScale,
                      x: zoomX,
                      y: zoomY,
                      transformOrigin: 'center center',
                    }}
                  >
                    <img
                      src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=85"
                      alt="Sahyadri, Maharashtra"
                      style={{ width: '100%', height: 135, objectFit: 'cover', display: 'block' }}
                    />
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(to top, rgba(10,11,14,0.7) 0%, transparent 50%)',
                    }} />
                    <motion.div
                      style={{
                        position: 'absolute', bottom: 10, left: 14,
                        fontFamily: 'Satoshi, sans-serif', fontSize: 11.5,
                        color: '#2EC27E', letterSpacing: 1.5, fontWeight: 600,
                        opacity: pinOpacity,
                      }}
                    >
                      📍 Maharashtra &amp; Beyond
                    </motion.div>
                  </motion.div>
                </div>

                {/* Right: brand card */}
                <div
                  style={{
                    position: 'relative', borderRadius: 18, overflow: 'hidden',
                    background: 'linear-gradient(145deg, rgba(20,24,33,0.85) 0%, rgba(14,16,22,0.95) 100%)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex', flexDirection: 'column',
                    backdropFilter: 'blur(16px)',
                  }}
                >
                  <div style={{ position: 'relative', height: 130, overflow: 'hidden' }}>
                    <img
                      src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80"
                      alt="Road trip adventure"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(to bottom, transparent 30%, rgba(14,16,22,0.95) 100%)',
                    }} />
                    <div style={{
                      position: 'absolute', top: 12, left: 16,
                      fontFamily: 'Clash Display, sans-serif', fontSize: 12,
                      color: '#2EC27E', letterSpacing: 3,
                      background: 'rgba(10,11,14,0.75)',
                      padding: '3px 8px', borderRadius: 4, backdropFilter: 'blur(8px)',
                    }}>TRIPGANG</div>
                  </div>

                  <div style={{ padding: '16px 22px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div>
                      <div style={{
                        fontFamily: 'Clash Display, sans-serif', fontSize: 30,
                        color: '#F1F5F9', lineHeight: 1,
                      }}>
                        TRIPS <span style={{ color: '#2EC27E' }}>ALL AROUND.</span>
                      </div>
                      <div style={{
                        fontFamily: 'Satoshi, sans-serif', fontSize: 13,
                        color: '#94A3B8', marginTop: 3,
                      }}>
                        Road trips, weekend escapes &amp; mountain expeditions.
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {['Road Trips', 'Weekend Escapes', 'Camping Nights', 'Backpacking', 'Mountain Treks', 'Beach Escapes'].map(tag => (
                        <span key={tag} className="badge badge-accent" style={{ fontSize: 10.5, padding: '3px 9px' }}>{tag}</span>
                      ))}
                    </div>

                    <div style={{
                      display: 'flex', gap: 0, marginTop: 4,
                      borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 12,
                    }}>
                      {[
                        { v: '100+', l: 'Travelers' },
                        { v: '4', l: 'Coordinators' },
                        { v: '0', l: 'Boring Weekends' },
                      ].map((s, i) => (
                        <div key={s.l} style={{
                          flex: 1, textAlign: 'center',
                          borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                        }}>
                          <div style={{
                            fontFamily: 'Clash Display, sans-serif', fontSize: 24,
                            color: '#2EC27E', lineHeight: 1,
                          }}>{s.v}</div>
                          <div style={{
                            fontFamily: 'Satoshi, sans-serif', fontSize: 9.5,
                            color: '#64748B', letterSpacing: 1.2, textTransform: 'uppercase', marginTop: 2,
                          }}>{s.l}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Banner */}
              <div
                style={{
                  display: 'flex', flexWrap: 'wrap', marginTop: 18,
                  background: 'rgba(18,21,28,0.75)', borderRadius: 16,
                  border: '1px solid rgba(255,255,255,0.08)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                  backdropFilter: 'blur(16px)',
                }}
              >
                {stats.map((s, i) => <StatCard key={s.label} {...s} index={i} />)}
              </div>
            </div>
          </motion.div>

          {/* ── Layer 2: Upcoming Trips Inside the Sahyadri Portal ── */}
          <motion.div
            style={{
              position: 'absolute', inset: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center', alignItems: 'center',
              zIndex: 20,
              opacity: tripsOpacity,
              scale: tripsScale,
              y: tripsY,
              pointerEvents: tripsPointerEvents,
              padding: 'clamp(36px, 5vh, 60px) 16px 20px', boxSizing: 'border-box',
            }}
          >
            <div style={{ maxWidth: 1180, margin: '0 auto', width: '100%' }}>
              <TripsSection isPortal={true} />
            </div>
          </motion.div>

          {/* Bottom seamless blend into GallerySection */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 100,
            background: 'linear-gradient(to bottom, transparent, #0A0B0E)',
            pointerEvents: 'none', zIndex: 25,
          }} />

        </div>
      </div>
    </section>
  )
}

export default AboutSection




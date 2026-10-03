import { useEffect, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { getTrips } from '../lib/firestore'
import TripCard from '../components/ui/TripCard'
import CoverFlowCarousel, { defaultTrips } from '../components/ui/3-d-coverflow-carousel'

const cardReveal = {
  hidden: { opacity: 0, y: 70, scale: 0.94 },
  visible: (i) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { delay: i * 0.14, duration: 0.85, ease: [0.22, 1, 0.36, 1] },
  }),
}

const TripsSection = ({ isPortal = false }) => {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const headRef = useRef(null)
  const inView = useInView(headRef, { once: true, amount: 0.1 })
  const shouldShow = inView || isPortal

  useEffect(() => {
    getTrips().then(data => {
      setTrips(data.filter(t => t.status !== 'cancelled'))
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const [viewMode, setViewMode] = useState('carousel')

  const upcoming = trips.filter(t => {
    const d = t.date?.toDate ? t.date.toDate() : new Date(t.date)
    return d >= new Date()
  })
  const past = trips.filter(t => {
    const d = t.date?.toDate ? t.date.toDate() : new Date(t.date)
    return d < new Date()
  })

  // Format upcoming trips for 3D Coverflow Carousel (or fall back to curated template treks)
  const carouselItems = upcoming.length > 0
    ? upcoming.map(t => ({
        id: t.id,
        tag: t.difficulty === 'Easy' ? '🌿 BEGINNER FRIENDLY' : t.difficulty === 'Hard' ? '⚡ THRILL SEEKER' : '🔥 POPULAR',
        difficulty: t.difficulty || 'Moderate',
        titleLine1: t.name ? t.name.toUpperCase() : 'TREK ADVENTURE',
        titleLine2: t.destination ? t.destination.toUpperCase() : 'MAHARASHTRA',
        desc: t.duration ? `${t.duration} · ${t.distance || 'Sahyadri'}` : 'Epic trekking experience with TripGang',
        duration: t.duration || '1-2 Days',
        distance: t.distance || '12 km',
        price: t.earlyBirdPrice ? `₹${t.earlyBirdPrice.toLocaleString()}` : t.regularPrice ? `₹${t.regularPrice.toLocaleString()}` : '₹1,499',
        originalPrice: t.regularPrice ? `₹${t.regularPrice.toLocaleString()}` : null,
        img: t.heroImage || (t.photos && t.photos[0]) || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
        ctaText: 'Book Now',
        ctaUrl: `https://wa.me/917038276535?text=Hi%20Arpit!%20I%20want%20to%20book%20${encodeURIComponent(t.name || 'this trek')}`,
      }))
    : defaultTrips

  return (
    <section
      id="trips"
      style={{
        padding: isPortal ? '0 16px' : '24px 16px 64px',
        background: 'transparent',
        position: 'relative',
        width: '100%',
      }}
    >

      <div style={{ maxWidth: 1150, margin: '0 auto', width: '100%', position: 'relative', zIndex: 1 }}>

        {/* Section heading */}
        <div ref={headRef} style={{ marginBottom: 16, textAlign: 'center', position: 'relative' }}>
          {/* Ghost watermark — only in standalone section, not in portal to prevent clutter */}
          {!isPortal && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={shouldShow ? { opacity: 0.04 } : {}}
              transition={{ duration: 1.2 }}
              style={{
                fontFamily: 'Bebas Neue, sans-serif',
                fontSize: 'clamp(50px, 10vw, 110px)',
                color: '#F1F5F9',
                position: 'absolute', top: '-0.3em', left: '50%', transform: 'translateX(-50%)',
                whiteSpace: 'nowrap',
                pointerEvents: 'none', userSelect: 'none',
                letterSpacing: '0.06em', lineHeight: 1,
              }}
            >TRIPS</motion.span>
          )}

          <motion.p
            className="section-eyebrow"
            initial={{ opacity: 0, y: -10 }}
            animate={shouldShow ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            style={{ position: 'relative', zIndex: 2, marginBottom: 6, letterSpacing: 3, fontSize: 12 }}
          >
            Upcoming Adventures
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={shouldShow ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ delay: 0.08, duration: 0.7 }}
            style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: 'clamp(34px, 4.4vw, 54px)',
              lineHeight: 1, color: '#F1F5F9', letterSpacing: 1.5,
              position: 'relative', zIndex: 2, marginBottom: 8,
            }}
          >
            UPCOMING <span style={{ color: '#2EC27E' }}>TRIPS</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={shouldShow ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.16, duration: 0.6 }}
            style={{
              fontFamily: 'Inter, sans-serif', fontSize: 13.5,
              color: '#94A3B8', margin: '0 auto', maxWidth: 540, lineHeight: 1.5,
              position: 'relative', zIndex: 2,
            }}
          >
            Spots fill up fast. Early bird pricing ends soon —{' '}
            <span style={{ color: '#FB8500', fontWeight: 500 }}>lock in your seat before it's gone.</span>
          </motion.p>
        </div>

        {/* Toggle switch if there are active database trips */}
        {upcoming.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
            <div style={{
              display: 'inline-flex',
              background: '#081120',
              border: '1px solid rgba(56,189,248,0.15)',
              borderRadius: 10,
              padding: 4,
              gap: 4,
            }}>
              <button
                type="button"
                onClick={() => setViewMode('carousel')}
                style={{
                  background: viewMode === 'carousel' ? 'rgba(46,194,126,0.15)' : 'transparent',
                  color: viewMode === 'carousel' ? '#2EC27E' : '#64748B',
                  border: viewMode === 'carousel' ? '1px solid rgba(46,194,126,0.3)' : '1px solid transparent',
                  borderRadius: 6,
                  padding: '6px 14px',
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                3D Carousel
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                style={{
                  background: viewMode === 'grid' ? 'rgba(46,194,126,0.15)' : 'transparent',
                  color: viewMode === 'grid' ? '#2EC27E' : '#64748B',
                  border: viewMode === 'grid' ? '1px solid rgba(46,194,126,0.3)' : '1px solid transparent',
                  borderRadius: 6,
                  padding: '6px 14px',
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                Grid View
              </button>
            </div>
          </div>
        )}

        {/* 3D Coverflow or Grid display */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{
                height: 420, borderRadius: 20,
                background: 'linear-gradient(90deg, #102A43 25%, #1B3B5A 50%, #102A43 75%)',
                backgroundSize: '400% 100%',
                animation: 'shimmer 1.5s ease-in-out infinite',
              }} />
            ))}
          </div>
        ) : viewMode === 'carousel' ? (
          <div>
            <CoverFlowCarousel
              items={carouselItems}
              onCtaClick={(item) => {
                if (item.ctaUrl && item.ctaUrl.startsWith('http')) {
                  window.open(item.ctaUrl, '_blank')
                } else if (item.id) {
                  window.location.href = `/trip/${item.id}`
                }
              }}
            />

            {upcoming.length === 0 && (
              <div style={{
                marginTop: 12,
                textAlign: 'center',
                display: 'flex',
                justifyContent: 'center',
              }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  gap: 12,
                  padding: '6px 16px',
                  background: 'rgba(16,42,67,0.55)',
                  borderRadius: 100,
                  border: '1px solid rgba(56,189,248,0.15)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                    <span>🔔</span>
                    <span style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#F1F5F9', fontWeight: 600 }}>
                      Official dates dropping soon!
                    </span>
                    <span style={{ fontFamily: 'Inter, sans-serif', color: '#94A3B8', fontSize: 12 }}>
                      Join WhatsApp for priority access.
                    </span>
                  </div>
                  <a
                    href="https://wa.me/917038276535?text=Hi%20TripGang!%20Notify%20me%20for%20the%20next%20trip."
                    target="_blank" rel="noopener noreferrer"
                    className="btn-cta"
                    style={{ padding: '4px 14px', fontSize: 11, borderRadius: 100 }}
                  >
                    Get Notified First
                  </a>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
            {upcoming.map((trip, i) => (
              <motion.div
                key={trip.id}
                custom={i}
                variants={cardReveal}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
              >
                <TripCard trip={trip} index={i} />
              </motion.div>
            ))}
          </div>
        )}

        {/* Past trips */}
        {past.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{ marginTop: 80 }}
          >
            <p className="section-eyebrow" style={{ marginBottom: 8 }}>Where We've Been</p>
            <h3 style={{
              fontFamily: 'Space Grotesk, sans-serif', fontSize: 24,
              color: '#94A3B8', marginBottom: 32,
            }}>
              Past Trips
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
              {past.map((trip, i) => (
                <motion.div
                  key={trip.id}
                  custom={i}
                  variants={cardReveal}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                >
                  <TripCard trip={trip} index={i} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: -400% 0; }
          100% { background-position: 400% 0; }
        }
      `}</style>
    </section>
  )
}

export default TripsSection

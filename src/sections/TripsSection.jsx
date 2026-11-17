import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import { getTrips } from '../lib/firestore'
import TripCard from '../components/ui/TripCard'
import CoverFlowCarousel, { defaultTrips } from '../components/ui/3-d-coverflow-carousel'

// ─── Interactive "About The Trip" Modal ──────────────────────────────────────
const AboutTripModal = ({ trip, onClose }) => {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  if (!trip) return null

  const raw = trip.rawTrip || {}
  const title = trip.titleLine1 || trip.name || 'Group Expedition'
  const subtitle = trip.titleLine2 || trip.destination || 'Maharashtra & Beyond'
  const itinerary = raw.itinerary && raw.itinerary.length > 0 ? raw.itinerary : [
    {
      day: 1,
      title: 'Road Journey & Scenic Arrival',
      description: 'Morning departure from Chhatrapati Sambhajinagar / Pune. Scenic highway drive with breakfast stop. Reach campsite / base, settle in, explore hidden trails, sunset viewpoints and campfire night with music & barbecue.'
    },
    {
      day: 2,
      title: 'Sunrise Exploration & Return',
      description: 'Golden hour sunrise view, authentic local breakfast, visit iconic natural landmarks / waterfalls / historic spots, group photo sessions, and comfortable journey back by evening.'
    }
  ]
  const thingsToPack = raw.thingsToPack && raw.thingsToPack.length > 0 ? raw.thingsToPack : [
    'Comfortable footwear / trekking shoes',
    'Warm jacket or hoodie for campfire night',
    'Reusable 2L water bottle & personal snacks',
    'Government ID proof & personal medications',
    'Power bank & camera to capture memories'
  ]

  const bookingUrl = trip.ctaUrl && trip.ctaUrl.startsWith('http')
    ? trip.ctaUrl
    : `https://wa.me/917038276535?text=Hi%20Arpit!%20I%20want%20to%20book%20the%20${encodeURIComponent(title)}%20trip.`

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(5, 7, 10, 0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'rgba(14, 18, 24, 0.98)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 24,
          width: '100%',
          maxWidth: 720,
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 32px 80px rgba(0,0,0,0.8), 0 0 40px rgba(46,194,126,0.15)',
        }}
      >
        {/* Hero Header with Trip Cover */}
        <div style={{ position: 'relative', height: 220, flexShrink: 0, overflow: 'hidden' }}>
          <img
            src={trip.img}
            alt={title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(14, 18, 24, 1) 0%, rgba(14, 18, 24, 0.4) 50%, rgba(0,0,0,0.7) 100%)',
          }} />

          {/* Close Button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: 16, right: 16,
              background: 'rgba(10, 11, 14, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '50%', width: 38, height: 38,
              color: '#F1F5F9', fontSize: 16, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(8px)', transition: 'all 0.2s', zIndex: 10,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#2EC27E'; e.currentTarget.style.color = '#041a10' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(10, 11, 14, 0.75)'; e.currentTarget.style.color = '#F1F5F9' }}
          >
            ✕
          </button>

          {/* Title and Badges overlay */}
          <div style={{ position: 'absolute', bottom: 16, left: 24, right: 24 }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
              <span style={{
                background: '#2EC27E', color: '#041a10',
                fontFamily: 'Satoshi, sans-serif', fontSize: 11, fontWeight: 700,
                padding: '2px 10px', borderRadius: 100, textTransform: 'uppercase',
              }}>
                {trip.difficulty || 'Moderate'}
              </span>
              <span style={{
                background: 'rgba(56,189,248,0.18)', border: '1px solid rgba(56,189,248,0.3)',
                color: '#38BDF8', fontFamily: 'Satoshi, sans-serif', fontSize: 11, fontWeight: 700,
                padding: '2px 10px', borderRadius: 100,
              }}>
                {trip.tag || '🔥 POPULAR'}
              </span>
            </div>
            <h2 style={{
              fontFamily: 'Clash Display, sans-serif', fontSize: 'clamp(28px, 4vw, 42px)',
              color: '#F1F5F9', letterSpacing: 1, margin: 0, lineHeight: 1,
            }}>
              {title}
            </h2>
            <p style={{
              fontFamily: 'Satoshi, sans-serif', fontSize: 12.5,
              color: '#2EC27E', letterSpacing: 1, textTransform: 'uppercase', margin: '4px 0 0',
            }}>
              📍 {subtitle}
            </p>
          </div>
        </div>

        {/* Scrollable Body Content */}
        <div style={{
          padding: '24px 24px 32px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
        }}>
          {/* Quick Metrics Bar */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: 10, background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '12px 16px',
          }}>
            <div>
              <div style={{ fontFamily: 'Satoshi, sans-serif', fontSize: 11, color: '#64748B' }}>Duration</div>
              <div style={{ fontFamily: 'Satoshi, sans-serif', fontSize: 13, fontWeight: 700, color: '#F1F5F9' }}>
                ⏱️ {trip.duration || '1-2 Days'}
              </div>
            </div>
            <div>
              <div style={{ fontFamily: 'Satoshi, sans-serif', fontSize: 11, color: '#64748B' }}>Distance / Terrain</div>
              <div style={{ fontFamily: 'Satoshi, sans-serif', fontSize: 13, fontWeight: 700, color: '#F1F5F9' }}>
                📍 {trip.distance || 'Road Trip & Trail'}
              </div>
            </div>
            <div>
              <div style={{ fontFamily: 'Satoshi, sans-serif', fontSize: 11, color: '#64748B' }}>Trip Price</div>
              <div style={{ fontFamily: 'Satoshi, sans-serif', fontSize: 13, fontWeight: 800, color: '#2EC27E' }}>
                {trip.price} {trip.originalPrice && <span style={{ textDecoration: 'line-through', fontSize: 11, color: '#64748B' }}>{trip.originalPrice}</span>}
              </div>
            </div>
          </div>

          {/* About Section */}
          <div>
            <h4 style={{
              fontFamily: 'Clash Display, sans-serif', fontSize: 20, color: '#F1F5F9',
              letterSpacing: 1, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span style={{ color: '#2EC27E' }}>✦</span> ABOUT THIS TRIP
            </h4>
            <p style={{
              fontFamily: 'Satoshi, sans-serif', fontSize: 14, color: '#94A3B8',
              lineHeight: 1.7, margin: 0,
            }}>
              {trip.desc || 'Join the gang for an unforgettable group escape. We handle all logistics, route planning, stays, and guided experiences so you can make authentic memories with awesome people.'}
            </p>
          </div>

          {/* Itinerary */}
          <div>
            <h4 style={{
              fontFamily: 'Clash Display, sans-serif', fontSize: 20, color: '#F1F5F9',
              letterSpacing: 1, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span style={{ color: '#2EC27E' }}>✦</span> TRIP SCHEDULE & ITINERARY
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {itinerary.map((step, idx) => (
                <div key={idx} style={{
                  display: 'flex', gap: 14, background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 14,
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: 'rgba(46,194,126,0.12)', border: '1px solid rgba(46,194,126,0.3)',
                    color: '#2EC27E', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    D{step.day || idx + 1}
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Satoshi, sans-serif', fontSize: 14, fontWeight: 700, color: '#F1F5F9', marginBottom: 4 }}>
                      {step.title}
                    </div>
                    <div style={{ fontFamily: 'Satoshi, sans-serif', fontSize: 13, color: '#94A3B8', lineHeight: 1.6 }}>
                      {step.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* What's Included & Things to Pack Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            {/* Inclusions */}
            <div style={{ background: 'rgba(46,194,126,0.04)', border: '1px solid rgba(46,194,126,0.15)', borderRadius: 14, padding: 16 }}>
              <div style={{ fontFamily: 'Satoshi, sans-serif', fontSize: 12, fontWeight: 700, color: '#2EC27E', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>
                ✓ WHAT'S INCLUDED
              </div>
              <ul style={{ margin: 0, paddingLeft: 16, fontFamily: 'Satoshi, sans-serif', fontSize: 12.5, color: '#CBD5E1', lineHeight: 1.8 }}>
                <li>Group transportation to and from base</li>
                <li>Breakfast & local homestyle meals</li>
                <li>Tent stay / camping gear (if overnight)</li>
                <li>Trip coordinator & local certified guide</li>
                <li>First aid kit & 24/7 safety management</li>
              </ul>
            </div>

            {/* Things to Pack */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: 16 }}>
              <div style={{ fontFamily: 'Satoshi, sans-serif', fontSize: 12, fontWeight: 700, color: '#38BDF8', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>
                🎒 THINGS TO PACK
              </div>
              <ul style={{ margin: 0, paddingLeft: 16, fontFamily: 'Satoshi, sans-serif', fontSize: 12.5, color: '#CBD5E1', lineHeight: 1.8 }}>
                {thingsToPack.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Action Bar */}
        <div style={{
          padding: '16px 24px',
          background: 'rgba(10, 12, 16, 0.95)',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 12,
        }}>
          {trip.id && (
            <Link
              to={`/trip/${trip.id}`}
              style={{
                fontFamily: 'Satoshi, sans-serif', fontSize: 13,
                color: '#38BDF8', textDecoration: 'none', fontWeight: 600,
                display: 'inline-flex', alignItems: 'center', gap: 4,
              }}
            >
              Open Dedicated Page ↗
            </Link>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto' }}>
            <button
              onClick={onClose}
              style={{
                padding: '10px 18px', borderRadius: 100,
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                color: '#94A3B8', fontFamily: 'Satoshi, sans-serif', fontSize: 13, fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Close
            </button>
            <a
              href={bookingUrl}
              target="_blank" rel="noopener noreferrer"
              className="btn-cta"
              style={{ padding: '10px 24px', fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              <span>Book via WhatsApp ({trip.price}) →</span>
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

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
  const [selectedTrip, setSelectedTrip] = useState(null)
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
        rawTrip: t,
        tag: t.difficulty === 'Easy' ? '🌿 BEGINNER FRIENDLY' : t.difficulty === 'Hard' ? '⚡ THRILL SEEKER' : '🔥 POPULAR',
        difficulty: t.difficulty || 'Moderate',
        titleLine1: t.name ? t.name.toUpperCase() : 'GROUP TRIP',
        titleLine2: t.destination ? t.destination.toUpperCase() : 'MAHARASHTRA',
        desc: t.duration ? `${t.duration} · ${t.distance || 'Road Trip & Trail'}` : 'Epic travel experience with TripGang',
        duration: t.duration || '1-2 Days',
        distance: t.distance || 'Weekend Escape',
        price: t.earlyBirdPrice ? `₹${t.earlyBirdPrice.toLocaleString()}` : t.regularPrice ? `₹${t.regularPrice.toLocaleString()}` : '₹1,499',
        originalPrice: t.regularPrice ? `₹${t.regularPrice.toLocaleString()}` : null,
        img: t.heroImage || (t.photos && t.photos[0]) || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
        ctaText: 'Book',
        ctaUrl: `https://wa.me/917038276535?text=Hi%20Arpit!%20I%20want%20to%20book%20${encodeURIComponent(t.name || 'this trip')}`,
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
          {!isPortal && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={shouldShow ? { opacity: 0.04 } : {}}
              transition={{ duration: 1.2 }}
              style={{
                fontFamily: 'Clash Display, sans-serif',
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
              fontFamily: 'Clash Display, sans-serif',
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
              fontFamily: 'Satoshi, sans-serif', fontSize: 13.5,
              color: '#94A3B8', margin: '0 auto', maxWidth: 540, lineHeight: 1.5,
              position: 'relative', zIndex: 2,
            }}
          >
            Spots fill up fast. Click any card to explore the full itinerary, dates & pricing —{' '}
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
                  fontFamily: 'Satoshi, sans-serif',
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
                  fontFamily: 'Satoshi, sans-serif',
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
              onTripSelect={(item) => setSelectedTrip(item)}
              onCtaClick={(item) => setSelectedTrip(item)}
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
                    <span style={{ fontFamily: 'Satoshi, sans-serif', color: '#F1F5F9', fontWeight: 600 }}>
                      Official dates dropping soon!
                    </span>
                    <span style={{ fontFamily: 'Satoshi, sans-serif', color: '#94A3B8', fontSize: 12 }}>
                      Click any card above to see details.
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
                initial="hidden"
                animate={shouldShow ? 'visible' : 'hidden'}
                variants={cardReveal}
              >
                <TripCard trip={trip} />
              </motion.div>
            ))}
          </div>
        )}

      </div>

      {/* About The Trip Interactive Modal */}
      <AnimatePresence>
        {selectedTrip && (
          <AboutTripModal
            trip={selectedTrip}
            onClose={() => setSelectedTrip(null)}
          />
        )}
      </AnimatePresence>
    </section>
  )
}

export default TripsSection




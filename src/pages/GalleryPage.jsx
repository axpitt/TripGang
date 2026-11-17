import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { getGallery } from '../lib/firestore'
import Navbar from '../components/ui/Navbar'

// ─── High-Fidelity Cinema Lightbox ───────────────────────────────────────────
const Lightbox = ({ photo, photos, onClose }) => {
  const [current, setCurrent] = useState(photo)

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') {
        const idx = photos.findIndex(p => p.id === current.id)
        if (idx < photos.length - 1) setCurrent(photos[idx + 1])
      }
      if (e.key === 'ArrowLeft') {
        const idx = photos.findIndex(p => p.id === current.id)
        if (idx > 0) setCurrent(photos[idx - 1])
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [current, photos, onClose])

  const idx = photos.findIndex(p => p.id === current.id)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(5, 7, 10, 0.94)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '20px 24px',
      }}
    >
      {/* Top Bar with metadata and close button */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0,
          padding: '20px 28px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'linear-gradient(to bottom, rgba(5,7,10,0.85) 0%, transparent 100%)',
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(46,194,126,0.12)', border: '1px solid rgba(46,194,126,0.25)',
            padding: '5px 12px', borderRadius: 100,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2EC27E' }} />
            <span style={{ fontFamily: 'Satoshi, sans-serif', fontSize: 12, fontWeight: 600, color: '#2EC27E', letterSpacing: 0.5 }}>
              {current.tripName || 'TripGang Archive'}
            </span>
          </div>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#64748B' }}>
            {idx + 1} / {photos.length}
          </span>
        </div>

        <button
          onClick={onClose}
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '50%', width: 42, height: 42, color: '#F1F5F9',
            cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.transform = 'scale(1.08)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'scale(1)' }}
        >
          ✕
        </button>
      </div>

      {/* Prev button */}
      {idx > 0 && (
        <button
          onClick={e => { e.stopPropagation(); setCurrent(photos[idx - 1]) }}
          style={{
            position: 'fixed', left: 24, top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(18,21,28,0.85)', border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '50%', width: 52, height: 52, color: '#F1F5F9',
            cursor: 'pointer', fontSize: 24, display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 12px 32px rgba(0,0,0,0.5)', zIndex: 10,
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#2EC27E'; e.currentTarget.style.color = '#05070a' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(18,21,28,0.85)'; e.currentTarget.style.color = '#F1F5F9' }}
        >
          ‹
        </button>
      )}

      {/* Main Large Image Container */}
      <motion.div
        key={current.id}
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.94 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        onClick={e => e.stopPropagation()}
        style={{
          position: 'relative',
          maxWidth: 'min(92vw, 1100px)',
          maxHeight: '74vh',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <img
          src={current.url}
          alt={current.alt || current.tripName}
          style={{
            maxWidth: '100%',
            maxHeight: '74vh',
            objectFit: 'contain',
            borderRadius: 16,
            boxShadow: '0 24px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.1)',
          }}
        />
      </motion.div>

      {/* Next button */}
      {idx < photos.length - 1 && (
        <button
          onClick={e => { e.stopPropagation(); setCurrent(photos[idx + 1]) }}
          style={{
            position: 'fixed', right: 24, top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(18,21,28,0.85)', border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '50%', width: 52, height: 52, color: '#F1F5F9',
            cursor: 'pointer', fontSize: 24, display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 12px 32px rgba(0,0,0,0.5)', zIndex: 10,
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#2EC27E'; e.currentTarget.style.color = '#05070a' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(18,21,28,0.85)'; e.currentTarget.style.color = '#F1F5F9' }}
        >
          ›
        </button>
      )}

      {/* Bottom Thumbnail Strip */}
      {photos.length > 1 && (
        <div
          onClick={e => e.stopPropagation()}
          style={{
            position: 'fixed', bottom: 18,
            display: 'flex', gap: 10,
            padding: '8px 14px',
            background: 'rgba(18,21,28,0.85)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 100,
            backdropFilter: 'blur(16px)',
            maxWidth: '90vw', overflowX: 'auto',
            zIndex: 10,
          }}
        >
          {photos.map((p, i) => (
            <button
              key={p.id || i}
              onClick={() => setCurrent(p)}
              style={{
                width: 44, height: 44, borderRadius: '50%', overflow: 'hidden',
                padding: 0, border: current.id === p.id ? '2px solid #2EC27E' : '2px solid transparent',
                cursor: 'pointer', opacity: current.id === p.id ? 1 : 0.5,
                transform: current.id === p.id ? 'scale(1.15)' : 'scale(1)',
                transition: 'all 0.2s ease',
                flexShrink: 0,
              }}
            >
              <img src={p.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </button>
          ))}
        </div>
      )}
    </motion.div>
  )
}

// ─── Trip Gallery Section (Smart Dynamic Bento Layout) ───────────────────────
const TripGallerySection = ({ tripName, photos, onPhotoClick, index }) => {
  const isSingle = photos.length === 1
  const isTwo = photos.length === 2

  // Format clean capital title
  const formattedTitle = tripName.charAt(0).toUpperCase() + tripName.slice(1)

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      style={{ marginBottom: 64 }}
    >
      {/* Editorial Chapter Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 16, marginBottom: 24,
        paddingBottom: 16,
        borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Chapter badge */}
          <div style={{
            width: 38, height: 38, borderRadius: 12,
            background: 'rgba(46,194,126,0.1)',
            border: '1px solid rgba(46,194,126,0.22)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#2EC27E', fontFamily: 'JetBrains Mono, monospace', fontSize: 13, fontWeight: 700,
          }}>
            0{index + 1}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
              <span style={{
                fontFamily: 'Satoshi, sans-serif', fontSize: 11,
                fontWeight: 600, color: '#2EC27E', letterSpacing: 2, textTransform: 'uppercase',
              }}>
                📍 Destination
              </span>
            </div>
            <h2 style={{
              fontFamily: 'Clash Display, sans-serif',
              fontSize: 'clamp(30px, 4vw, 44px)',
              color: '#F1F5F9', letterSpacing: 1.5, lineHeight: 1,
            }}>
              {formattedTitle} <span style={{ color: '#2EC27E' }}>EXPEDITION</span>
            </h2>
          </div>
        </div>

        {/* Count Pill */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(18,21,28,0.7)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 100, padding: '6px 16px',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2EC27E' }} />
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#94A3B8' }}>
            {photos.length} {photos.length === 1 ? 'Photo Captured' : 'Photos Captured'}
          </span>
        </div>
      </div>

      {/* Dynamic Grid Rendering */}
      {isSingle ? (
        /* Single Photo: Widescreen Cinematic Hero Card */
        <motion.div
          whileHover={{ y: -6 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          onClick={() => onPhotoClick(photos[0])}
          style={{
            position: 'relative',
            borderRadius: 22,
            overflow: 'hidden',
            cursor: 'pointer',
            background: 'rgba(18,21,28,0.6)',
            border: '1px solid rgba(255,255,255,0.09)',
            boxShadow: '0 16px 40px rgba(0,0,0,0.4)',
            maxHeight: 520,
          }}
          className="gallery-card-hover"
        >
          <img
            src={photos[0].url}
            alt={photos[0].alt || tripName}
            style={{
              width: '100%', height: '100%', maxHeight: 520,
              objectFit: 'cover', display: 'block',
              transition: 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
            className="gallery-img-target"
            loading="lazy"
          />

          {/* Vignette & Gradient Overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(10,11,14,0.95) 0%, rgba(10,11,14,0.3) 50%, transparent 100%)',
            display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
            padding: 'clamp(20px, 4vw, 36px)',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: 'rgba(46,194,126,0.2)', border: '1px solid rgba(46,194,126,0.4)',
                  padding: '4px 12px', borderRadius: 100, marginBottom: 8,
                  fontFamily: 'Satoshi, sans-serif', fontSize: 11, fontWeight: 600, color: '#2EC27E',
                }}>
                  ✦ FEATURED SHOT
                </span>
                <h3 style={{
                  fontFamily: 'Clash Display, sans-serif', fontSize: 'clamp(24px, 3vw, 36px)',
                  color: '#F1F5F9', letterSpacing: 1, margin: 0,
                }}>
                  {formattedTitle} · ROAD TRIP MOMENTS
                </h3>
                <p style={{ fontFamily: 'Satoshi, sans-serif', fontSize: 13.5, color: '#94A3B8', margin: '4px 0 0' }}>
                  Raw, unscripted group memories from the trail.
                </p>
              </div>

              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                padding: '10px 20px', borderRadius: 100,
                color: '#F1F5F9', fontFamily: 'Satoshi, sans-serif', fontSize: 13, fontWeight: 600,
              }}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
                View High-Res
              </div>
            </div>
          </div>
        </motion.div>
      ) : isTwo ? (
        /* 2 Photos: Balanced Split Grid */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
          {photos.map((photo, i) => (
            <motion.div
              key={photo.id || i}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => onPhotoClick(photo)}
              style={{
                position: 'relative',
                borderRadius: 20,
                overflow: 'hidden',
                cursor: 'pointer',
                background: 'rgba(18,21,28,0.6)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 12px 32px rgba(0,0,0,0.3)',
                height: 380,
              }}
              className="gallery-card-hover"
            >
              <img
                src={photo.url}
                alt={photo.alt || tripName}
                style={{
                  width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                  transition: 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
                }}
                className="gallery-img-target"
                loading="lazy"
              />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(10,11,14,0.9) 0%, rgba(10,11,14,0.2) 60%, transparent 100%)',
                display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
                padding: 24,
              }}>
                <div>
                  <p style={{ fontFamily: 'Satoshi, sans-serif', fontSize: 14, fontWeight: 600, color: '#F1F5F9', margin: 0 }}>
                    {formattedTitle} · Story #{i + 1}
                  </p>
                </div>
                <div style={{
                  width: 38, height: 38, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.14)', backdropFilter: 'blur(8px)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '1px solid rgba(255,255,255,0.25)', color: '#FFF',
                }}>
                  🔍
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        /* 3+ Photos: Aesthetic Bento / Masonry Grid */
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 20,
        }}>
          {photos.map((photo, i) => {
            const isHero = i === 0 && photos.length >= 3
            return (
              <motion.div
                key={photo.id || i}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => onPhotoClick(photo)}
                style={{
                  gridColumn: isHero ? 'span 2' : 'span 1',
                  height: isHero ? 360 : 300,
                  position: 'relative',
                  borderRadius: 20,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  background: 'rgba(18,21,28,0.6)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  boxShadow: '0 12px 32px rgba(0,0,0,0.3)',
                }}
                className="gallery-card-hover"
              >
                <img
                  src={photo.url}
                  alt={photo.alt || tripName}
                  style={{
                    width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                    transition: 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
                  }}
                  className="gallery-img-target"
                  loading="lazy"
                />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(10,11,14,0.92) 0%, rgba(10,11,14,0.2) 60%, transparent 100%)',
                  display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
                  padding: 20,
                }}>
                  <div>
                    <span style={{
                      fontFamily: 'Satoshi, sans-serif', fontSize: 13,
                      fontWeight: 600, color: '#F1F5F9',
                    }}>
                      {formattedTitle}
                    </span>
                  </div>
                  <div style={{
                    width: 34, height: 34, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '1px solid rgba(255,255,255,0.2)', color: '#FFF', fontSize: 14,
                  }}>
                    🔍
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}

// ─── Main Gallery Page ────────────────────────────────────────────────────────
const GalleryPage = () => {
  const [allPhotos, setAllPhotos] = useState([])
  const [grouped, setGrouped] = useState({})
  const [tripOrder, setTripOrder] = useState([])
  const [loading, setLoading] = useState(true)
  const [lightbox, setLightbox] = useState(null)
  const [lightboxPhotos, setLightboxPhotos] = useState([])
  const [activeTrip, setActiveTrip] = useState('All')

  useEffect(() => {
    getGallery()
      .then(data => {
        setAllPhotos(data)
        const groups = {}
        const order = []
        data.forEach(photo => {
          const trip = photo.tripName || 'General'
          if (!groups[trip]) {
            groups[trip] = []
            order.push(trip)
          }
          groups[trip].push(photo)
        })
        setGrouped(groups)
        setTripOrder(order)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const openLightbox = (photo, tripPhotos) => {
    setLightboxPhotos(tripPhotos)
    setLightbox(photo)
  }

  const displayedTrips = activeTrip === 'All' ? tripOrder : [activeTrip]

  return (
    <>
      <Helmet>
        <title>Gallery — TripGang | Real Road Trips, Getaways & Treks</title>
        <meta name="description" content="Browse authentic photography from TripGang's road trips, camping nights, weekend getaways, and mountain expeditions across Maharashtra & India." />
      </Helmet>

      <div style={{ background: '#0A0B0E', minHeight: '100vh', color: '#F1F5F9', position: 'relative', overflowX: 'hidden' }}>
        <Navbar />

        {/* Ambient background glows */}
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: 'min(1200px, 100vw)', height: 600,
          background: 'radial-gradient(ellipse 60% 40% at 50% 10%, rgba(46,194,126,0.13), transparent 70%), radial-gradient(ellipse 40% 30% at 20% 30%, rgba(56,189,248,0.08), transparent 60%)',
          pointerEvents: 'none', zIndex: 0,
        }} />

        {/* ── HERO BANNER ── */}
        <div style={{
          padding: 'clamp(120px, 16vw, 170px) 24px clamp(40px, 6vw, 64px)',
          textAlign: 'center', position: 'relative', zIndex: 1,
        }}>
          {/* Subtle ghost text */}
          <div style={{
            fontFamily: 'Clash Display, sans-serif',
            fontSize: 'clamp(90px, 18vw, 220px)',
            color: '#F1F5F9', opacity: 0.025,
            position: 'absolute', top: '48%', left: '50%',
            transform: 'translate(-50%, -50%)',
            whiteSpace: 'nowrap', pointerEvents: 'none', userSelect: 'none',
            letterSpacing: '0.08em', lineHeight: 1,
          }}>
            TRIP ARCHIVE
          </div>

          {/* Beacon pill */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(46,194,126,0.1)', border: '1px solid rgba(46,194,126,0.25)',
              padding: '6px 18px', borderRadius: 100, marginBottom: 20,
              backdropFilter: 'blur(8px)',
            }}
          >
            <span style={{
              width: 8, height: 8, borderRadius: '50%', background: '#2EC27E',
              boxShadow: '0 0 10px #2EC27E', display: 'inline-block',
            }} />
            <span style={{
              fontFamily: 'Satoshi, sans-serif', fontSize: 11.5,
              fontWeight: 600, color: '#2EC27E', letterSpacing: 2, textTransform: 'uppercase',
            }}>
              UNCUT & RAW · STORIES FROM THE ROAD
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: 'Clash Display, sans-serif',
              fontSize: 'clamp(52px, 8.5vw, 108px)',
              lineHeight: 0.95, color: '#F1F5F9', letterSpacing: 2,
              marginBottom: 18,
            }}
          >
            TRIP <span style={{ color: '#2EC27E' }}>GALLERY</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            style={{
              fontFamily: 'Satoshi, sans-serif', fontSize: 16, color: '#94A3B8',
              maxWidth: 540, margin: '0 auto 32px', lineHeight: 1.6,
            }}
          >
            Midnight highway drives, sunset coastal stops & campfire stories.
            Real moments uploaded directly by our travel crew.
          </motion.p>

          {/* Action Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}
          >
            <Link
              to="/#trips"
              className="btn-cta"
              style={{ padding: '12px 28px', fontSize: 14 }}
            >
              <span>Explore Upcoming Trips →</span>
            </Link>
            <Link
              to="/"
              className="btn-outline"
              style={{ padding: '11px 24px', fontSize: 14 }}
            >
              <span>← Back to Home</span>
            </Link>
          </motion.div>

          {/* Stat highlights bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            style={{
              maxWidth: 820, margin: '48px auto 0',
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: 12,
              background: 'rgba(18,21,28,0.5)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 20, padding: '18px 24px',
              backdropFilter: 'blur(16px)',
            }}
          >
            <div>
              <div style={{ fontFamily: 'Clash Display, sans-serif', fontSize: 28, color: '#2EC27E', letterSpacing: 1 }}>
                {allPhotos.length > 0 ? `${allPhotos.length}+` : '12+'}
              </div>
              <div style={{ fontFamily: 'Satoshi, sans-serif', fontSize: 12, color: '#94A3B8' }}>Captured Moments</div>
            </div>
            <div>
              <div style={{ fontFamily: 'Clash Display, sans-serif', fontSize: 28, color: '#38BDF8', letterSpacing: 1 }}>
                {tripOrder.length > 0 ? `${tripOrder.length} Destinations` : '4+ Routes'}
              </div>
              <div style={{ fontFamily: 'Satoshi, sans-serif', fontSize: 12, color: '#94A3B8' }}>Trips Explored</div>
            </div>
            <div>
              <div style={{ fontFamily: 'Clash Display, sans-serif', fontSize: 28, color: '#FB8500', letterSpacing: 1 }}>
                100+
              </div>
              <div style={{ fontFamily: 'Satoshi, sans-serif', fontSize: 12, color: '#94A3B8' }}>Happy Travelers</div>
            </div>
            <div>
              <div style={{ fontFamily: 'Clash Display, sans-serif', fontSize: 28, color: '#F1F5F9', letterSpacing: 1 }}>
                100%
              </div>
              <div style={{ fontFamily: 'Satoshi, sans-serif', fontSize: 12, color: '#94A3B8' }}>Unscripted Vibes</div>
            </div>
          </motion.div>
        </div>

        {/* ── STICKY TRIP FILTER DOCK ── */}
        {tripOrder.length > 0 && (
          <div style={{
            position: 'sticky', top: 72, zIndex: 40,
            background: 'rgba(10, 11, 14, 0.88)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            padding: '14px 24px',
          }}>
            <div style={{
              maxWidth: 1200, margin: '0 auto',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              flexWrap: 'wrap', gap: 12,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{
                  fontFamily: 'Satoshi, sans-serif', fontSize: 11,
                  fontWeight: 600, color: '#64748B', letterSpacing: 2, textTransform: 'uppercase',
                  marginRight: 4,
                }}>
                  Filter:
                </span>

                {['All', ...tripOrder].map(trip => {
                  const isActive = activeTrip === trip
                  const count = trip === 'All' ? allPhotos.length : grouped[trip]?.length || 0
                  const displayName = trip === 'All' ? 'All Journeys' : trip.charAt(0).toUpperCase() + trip.slice(1)

                  return (
                    <button
                      key={trip}
                      onClick={() => setActiveTrip(trip)}
                      style={{
                        fontFamily: 'Satoshi, sans-serif',
                        fontSize: 12.5, fontWeight: 600,
                        padding: '8px 18px', borderRadius: 100, cursor: 'pointer',
                        background: isActive ? '#2EC27E' : 'rgba(18,21,28,0.7)',
                        color: isActive ? '#05070a' : '#94A3B8',
                        border: isActive ? '1px solid #2EC27E' : '1px solid rgba(255,255,255,0.08)',
                        boxShadow: isActive ? '0 0 20px rgba(46,194,126,0.35)' : 'none',
                        transition: 'all 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                      }}
                    >
                      <span>{displayName}</span>
                      <span style={{
                        fontSize: 10, fontFamily: 'JetBrains Mono, monospace',
                        background: isActive ? 'rgba(0,0,0,0.18)' : 'rgba(255,255,255,0.07)',
                        padding: '2px 6px', borderRadius: 10,
                        color: isActive ? '#05070a' : '#64748B',
                      }}>
                        {count}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── TRIP SECTIONS CONTENT ── */}
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(40px, 6vw, 72px) 24px', position: 'relative', zIndex: 1 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '100px 0' }}>
              <div style={{
                width: 48, height: 48, border: '3px solid rgba(46,194,126,0.2)',
                borderTopColor: '#2EC27E', borderRadius: '50%',
                margin: '0 auto 20px',
                animation: 'spin 0.8s linear infinite',
              }} />
              <div style={{ fontFamily: 'Clash Display, sans-serif', fontSize: 24, color: '#2EC27E', letterSpacing: 3 }}>
                LOADING TRIP VAULT…
              </div>
            </div>
          ) : tripOrder.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '90px 24px',
              background: 'rgba(18,21,28,0.6)', borderRadius: 24,
              border: '1px solid rgba(255,255,255,0.08)',
              maxWidth: 520, margin: '0 auto',
            }}>
              <div style={{ fontSize: 52, marginBottom: 16 }}>🏕️</div>
              <h3 style={{ fontFamily: 'Clash Display, sans-serif', fontSize: 32, color: '#F1F5F9', letterSpacing: 1, marginBottom: 8 }}>
                Visual Archive Loading Soon
              </h3>
              <p style={{ fontFamily: 'Satoshi, sans-serif', color: '#94A3B8', fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
                Photos from our latest group trips are being curated and will be uploaded here.
              </p>
              <Link to="/#trips" className="btn-cta" style={{ display: 'inline-flex' }}>
                Explore Next Trips →
              </Link>
            </div>
          ) : (
            displayedTrips.map((tripName, index) => (
              grouped[tripName] && (
                <TripGallerySection
                  key={tripName}
                  tripName={tripName}
                  photos={grouped[tripName]}
                  onPhotoClick={(photo) => openLightbox(photo, grouped[tripName])}
                  index={index}
                />
              )
            ))
          )}
        </div>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {lightbox && (
            <Lightbox
              photo={lightbox}
              photos={lightboxPhotos}
              onClose={() => setLightbox(null)}
            />
          )}
        </AnimatePresence>

        <style>{`
          .gallery-card-hover:hover .gallery-img-target {
            transform: scale(1.04);
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          @media (max-width: 768px) {
            .gallery-card-hover {
              grid-column: span 1 !important;
            }
          }
        `}</style>
      </div>
    </>
  )
}

export default GalleryPage




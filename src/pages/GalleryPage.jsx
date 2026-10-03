import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { getGallery } from '../lib/firestore'
import Navbar from '../components/ui/Navbar'

// ─── Lightbox ────────────────────────────────────────────────────────────────
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
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9000,
        background: 'rgba(8,17,32,0.97)', backdropFilter: 'blur(14px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
      }}
    >
      {/* Prev */}
      {idx > 0 && (
        <button
          onClick={e => { e.stopPropagation(); setCurrent(photos[idx - 1]) }}
          style={{
            position: 'fixed', left: 20, top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.2)',
            borderRadius: '50%', width: 48, height: 48, color: '#F1F5F9',
            cursor: 'pointer', fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >‹</button>
      )}

      <motion.div
        key={current.id}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        onClick={e => e.stopPropagation()}
        style={{ position: 'relative', maxWidth: 960, textAlign: 'center' }}
      >
        <img
          src={current.url} alt={current.alt}
          style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: 14 }}
        />
        <div style={{
          marginTop: 14, display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: 12,
        }}>
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, color: '#94A3B8' }}>
            {current.tripName}
          </span>
          <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, color: '#475569' }}>
            {idx + 1} / {photos.length}
          </span>
        </div>
      </motion.div>

      {/* Next */}
      {idx < photos.length - 1 && (
        <button
          onClick={e => { e.stopPropagation(); setCurrent(photos[idx + 1]) }}
          style={{
            position: 'fixed', right: 20, top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.2)',
            borderRadius: '50%', width: 48, height: 48, color: '#F1F5F9',
            cursor: 'pointer', fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >›</button>
      )}

      {/* Close */}
      <button onClick={onClose} style={{
        position: 'fixed', top: 20, right: 20,
        background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.15)',
        borderRadius: '50%', width: 44, height: 44, color: '#F1F5F9',
        cursor: 'pointer', fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>✕</button>
    </motion.div>
  )
}

// ─── Trip Section Card ────────────────────────────────────────────────────────
const TripGallerySection = ({ tripName, photos, onPhotoClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      style={{ marginBottom: 72 }}
    >
      {/* Trip header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28,
        paddingBottom: 20, borderBottom: '1px solid rgba(56,189,248,0.08)',
      }}>
        {/* Accent line */}
        <div style={{ width: 4, height: 36, borderRadius: 2, background: 'linear-gradient(to bottom, #2EC27E, #38BDF8)', flexShrink: 0 }} />
        <div>
          <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, fontWeight: 600, color: '#2EC27E', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 4 }}>
            Trip Gallery
          </p>
          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(28px, 4vw, 44px)', color: '#F1F5F9', letterSpacing: 1, lineHeight: 1 }}>
            {tripName}
          </h2>
        </div>
        <div style={{ marginLeft: 'auto', flexShrink: 0 }}>
          <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 12, color: '#475569' }}>
            {photos.length} photo{photos.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Masonry grid */}
      <div style={{ columns: '3 240px', columnGap: 14 }}>
        {photos.map((photo, i) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ delay: (i % 6) * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -4 }}
            onClick={() => onPhotoClick(photo)}
            style={{
              breakInside: 'avoid', marginBottom: 14,
              borderRadius: 12, overflow: 'hidden', cursor: 'pointer',
              background: '#102A43',
              border: '1px solid rgba(56,189,248,0.06)',
              position: 'relative',
              transition: 'border-color 0.3s, box-shadow 0.3s',
              boxShadow: '0 0 0 rgba(56,189,248,0)',
            }}
            className="gp-item"
          >
            <motion.img
              src={photo.url} alt={photo.alt || tripName}
              style={{ width: '100%', display: 'block', objectFit: 'cover' }}
              loading="lazy"
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.45 }}
            />
            {/* Hover overlay */}
            <div className="gp-overlay" style={{
              position: 'absolute', inset: 0,
              background: 'rgba(8,17,32,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: 0, transition: 'opacity 0.3s',
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1px solid rgba(255,255,255,0.25)',
              }}>
                <svg width="18" height="18" fill="white" viewBox="0 0 24 24">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" strokeWidth="2" stroke="white" fill="none" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// ─── Gallery Page ─────────────────────────────────────────────────────────────
const GalleryPage = () => {
  const [allPhotos, setAllPhotos] = useState([])
  const [grouped, setGrouped] = useState({})
  const [tripOrder, setTripOrder] = useState([])
  const [loading, setLoading] = useState(true)
  const [lightbox, setLightbox] = useState(null)
  const [lightboxPhotos, setLightboxPhotos] = useState([])
  const [activeTrip, setActiveTrip] = useState('All')

  useEffect(() => {
    getGallery().then(data => {
      setAllPhotos(data)
      // Group by trip name, maintain order of first appearance
      const groups = {}
      const order = []
      data.forEach(photo => {
        const trip = photo.tripName || 'General'
        if (!groups[trip]) { groups[trip] = []; order.push(trip) }
        groups[trip].push(photo)
      })
      setGrouped(groups)
      setTripOrder(order)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const openLightbox = (photo, tripPhotos) => {
    setLightboxPhotos(tripPhotos)
    setLightbox(photo)
  }

  const displayedTrips = activeTrip === 'All' ? tripOrder : [activeTrip]

  return (
    <>
      <Helmet>
        <title>Gallery — TripGang | Trip Photos</title>
        <meta name="description" content="Browse photos from all TripGang monsoon treks across Maharashtra. Real moments, real adventures." />
      </Helmet>

      <div style={{ background: '#081120', minHeight: '100vh' }}>
        <Navbar />

        {/* ── HERO BANNER ── */}
        <div style={{
          padding: 'clamp(100px, 14vw, 160px) 24px clamp(48px, 6vw, 80px)',
          textAlign: 'center', position: 'relative', overflow: 'hidden',
          background: 'linear-gradient(to bottom, #0c1a2e, #081120)',
        }}>
          {/* Ghost text */}
          <div style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: 'clamp(80px, 16vw, 200px)',
            color: '#F1F5F9', opacity: 0.04,
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            whiteSpace: 'nowrap', pointerEvents: 'none', userSelect: 'none',
            letterSpacing: '0.06em', lineHeight: 1,
          }}>MOMENTS</div>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="section-eyebrow"
            style={{ justifyContent: 'center', display: 'flex', position: 'relative', zIndex: 2 }}
          >
            Every Trek, Every Memory
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: 'clamp(48px, 8vw, 100px)',
              lineHeight: 1, color: '#F1F5F9', letterSpacing: 1,
              position: 'relative', zIndex: 2, marginBottom: 16,
            }}
          >
            TRIP <span style={{ color: '#38BDF8' }}>GALLERY</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            style={{
              fontFamily: 'Inter, sans-serif', fontSize: 16, color: '#94A3B8',
              maxWidth: 400, margin: '0 auto 32px', position: 'relative', zIndex: 2,
            }}
          >
            Real moments from every TripGang adventure
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.6 }}
            style={{ position: 'relative', zIndex: 2 }}
          >
            <Link to="/#gallery" className="btn-outline" style={{ fontSize: 14, padding: '10px 24px' }}>
              <span>← Back to Home</span>
            </Link>
          </motion.div>
        </div>

        {/* ── TRIP FILTER TABS ── */}
        {tripOrder.length > 1 && (
          <div style={{
            position: 'sticky', top: 72, zIndex: 50,
            background: 'rgba(8,17,32,0.92)', backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(56,189,248,0.07)',
            padding: '16px 24px',
          }}>
            <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, color: '#475569', letterSpacing: 2, textTransform: 'uppercase', marginRight: 8 }}>Trip:</span>
              {['All', ...tripOrder].map(trip => (
                <button
                  key={trip}
                  onClick={() => setActiveTrip(trip)}
                  style={{
                    fontFamily: 'Space Grotesk, sans-serif', fontSize: 12, fontWeight: 600,
                    padding: '7px 18px', borderRadius: 100, cursor: 'pointer',
                    background: activeTrip === trip ? '#2EC27E' : '#102A43',
                    color: activeTrip === trip ? '#041a10' : '#94A3B8',
                    border: activeTrip === trip ? 'none' : '1px solid rgba(56,189,248,0.1)',
                    transition: 'all 0.25s ease', letterSpacing: 0.5,
                  }}
                >
                  {trip} {trip !== 'All' && <span style={{ opacity: 0.6, fontSize: 11 }}>({grouped[trip]?.length || 0})</span>}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── TRIP SECTIONS ── */}
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(40px, 6vw, 80px) 24px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 28, color: '#2EC27E', letterSpacing: 4 }}>LOADING…</div>
            </div>
          ) : tripOrder.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 24px', background: '#102A43', borderRadius: 20, border: '1px solid rgba(56,189,248,0.1)' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🏔️</div>
              <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 22, color: '#F1F5F9', marginBottom: 8 }}>No Photos Yet</h3>
              <p style={{ fontFamily: 'Inter, sans-serif', color: '#94A3B8', marginBottom: 24 }}>Trip photos will appear here after the first trek!</p>
              <Link to="/" className="btn-cta">Go to Home</Link>
            </div>
          ) : (
            displayedTrips.map(tripName => (
              grouped[tripName] && (
                <TripGallerySection
                  key={tripName}
                  tripName={tripName}
                  photos={grouped[tripName]}
                  onPhotoClick={(photo) => openLightbox(photo, grouped[tripName])}
                />
              )
            ))
          )}
        </div>

        {/* Lightbox */}
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
          .gp-item:hover { border-color: rgba(56,189,248,0.2) !important; box-shadow: 0 8px 32px rgba(56,189,248,0.08) !important; }
          .gp-item:hover .gp-overlay { opacity: 1 !important; }
          @media (max-width: 600px) { [style*="columns: 3"] { columns: 2 240px !important; } }
        `}</style>
      </div>
    </>
  )
}

export default GalleryPage

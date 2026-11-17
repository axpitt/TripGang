import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import { getFeaturedGallery } from '../lib/firestore'

// ─── 3D Interactive Card with Parallax Tilt & Cursor Spotlight ───────────────
const InteractiveGalleryCard = ({ photo, index, inView, onSelect }) => {
  const cardRef = useRef(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0, active: false })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    // Gentle 3D tilt calculation (-7deg to +7deg)
    const rotX = ((y - centerY) / centerY) * -7
    const rotY = ((x - centerX) / centerX) * 7

    setTilt({ x: rotX, y: rotY })
    setSpotlight({ x, y, active: true })
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
    setSpotlight(prev => ({ ...prev, active: true }))
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setTilt({ x: 0, y: 0 })
    setSpotlight(prev => ({ ...prev, active: false }))
  }

  const formattedTrip = photo.tripName
    ? photo.tripName.charAt(0).toUpperCase() + photo.tripName.slice(1)
    : 'TripGang Journey'

  return (
    <motion.div
      initial={{ opacity: 0, y: 45, scale: 0.94, filter: 'blur(6px)' }}
      animate={inView ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' } : {}}
      transition={{
        delay: 0.1 + (index % 6) * 0.09,
        duration: 0.75,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{ perspective: 1000 }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => photo.url && onSelect(photo)}
        style={{
          position: 'relative',
          height: 240,
          borderRadius: 20,
          overflow: 'hidden',
          cursor: photo.url ? 'pointer' : 'default',
          background: 'rgba(18, 21, 28, 0.75)',
          border: isHovered
            ? '1px solid rgba(46, 194, 126, 0.45)'
            : '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: isHovered
            ? '0 24px 48px -12px rgba(0, 0, 0, 0.7), 0 0 28px rgba(46, 194, 126, 0.22)'
            : '0 10px 30px -10px rgba(0, 0, 0, 0.45)',
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(${isHovered ? -6 : 0}px)`,
          transition: isHovered
            ? 'transform 0.1s ease-out, border-color 0.25s, box-shadow 0.25s'
            : 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.35s, box-shadow 0.35s',
          transformStyle: 'preserve-3d',
        }}
      >
        {photo.url ? (
          <>
            {/* Background Image with smooth zoom and counter-translation for parallax */}
            <img
              src={photo.url}
              alt={photo.alt || photo.tripName}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                transform: isHovered ? 'scale(1.08)' : 'scale(1.01)',
                transition: 'transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
              loading="lazy"
            />

            {/* Dynamic Cursor Spotlight Following Mouse */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                opacity: spotlight.active ? 1 : 0,
                background: `radial-gradient(circle 180px at ${spotlight.x}px ${spotlight.y}px, rgba(46, 194, 126, 0.22), transparent 70%)`,
                transition: 'opacity 0.3s ease',
                zIndex: 2,
              }}
            />

            {/* Glass Shimmer Beam Gliding Across Card on Hover */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '60%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.12), transparent)',
                transform: isHovered ? 'translateX(350%) skewX(-20deg)' : 'none',
                transition: isHovered ? 'transform 0.85s ease' : 'none',
                pointerEvents: 'none',
                zIndex: 3,
              }}
            />

            {/* Center Floating "Expand" Action Pill on Hover */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
                zIndex: 4,
              }}
            >
              <div
                style={{
                  opacity: isHovered ? 1 : 0,
                  transform: isHovered ? 'scale(1)' : 'scale(0.75)',
                  transition: 'opacity 0.25s ease, transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                  background: 'rgba(10, 11, 14, 0.75)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  padding: '8px 16px',
                  borderRadius: 100,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                }}
              >
                <span style={{ fontSize: 13 }}>🔍</span>
                <span style={{
                  fontFamily: 'Satoshi, sans-serif',
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#F1F5F9',
                  letterSpacing: 0.5,
                }}>
                  View Shot
                </span>
              </div>
            </div>

            {/* Bottom Caption Overlay */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(to top, rgba(10, 11, 14, 0.95) 0%, rgba(10, 11, 14, 0.5) 60%, transparent 100%)',
                padding: '40px 18px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                zIndex: 3,
                transform: isHovered ? 'translateY(0)' : 'translateY(2px)',
                transition: 'transform 0.3s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, minWidth: 0 }}>
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: isHovered ? '#2EC27E' : '#94A3B8',
                    boxShadow: isHovered ? '0 0 8px #2EC27E' : 'none',
                    transition: 'all 0.3s',
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: 'Satoshi, sans-serif',
                    fontSize: 13.5,
                    color: isHovered ? '#FFFFFF' : '#F1F5F9',
                    fontWeight: 600,
                    letterSpacing: 0.5,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    transition: 'color 0.25s',
                  }}
                >
                  {formattedTrip}
                </span>
              </div>

              <span
                style={{
                  fontFamily: 'Satoshi, sans-serif',
                  fontSize: 10,
                  color: '#2EC27E',
                  letterSpacing: 1.2,
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  background: isHovered ? 'rgba(46,194,126,0.22)' : 'rgba(46,194,126,0.12)',
                  border: '1px solid rgba(46,194,126,0.3)',
                  padding: '3px 9px',
                  borderRadius: 100,
                  flexShrink: 0,
                  transition: 'background 0.25s',
                }}
              >
                TripGang ✦
              </span>
            </div>
          </>
        ) : (
          <div
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              background: 'rgba(255,255,255,0.02)',
            }}
          >
            <span style={{ fontSize: 32 }}>🏔️</span>
            <span
              style={{
                fontFamily: 'Satoshi, sans-serif',
                fontSize: 12,
                color: '#64748B',
                textAlign: 'center',
                padding: '0 16px',
              }}
            >
              Photos coming after the trip!
            </span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ─── Main GallerySection Component ───────────────────────────────────────────
const GallerySection = () => {
  const [photos, setPhotos] = useState([])
  const [lightbox, setLightbox] = useState(null)
  const headRef = useRef(null)
  const inView = useInView(headRef, { once: true, amount: 0.15 })

  useEffect(() => {
    getFeaturedGallery()
      .then(data => setPhotos(data))
      .catch(() => setPhotos([]))
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') setLightbox(null)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // Curated authentic photography fallback
  const placeholders = [
    { id: 'p0', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80', tripName: 'Harishchandragad Camp', alt: 'Konkan Kada Peak & Camping' },
    { id: 'p1', url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80', tripName: 'Gokarna Coastal Drive', alt: 'Beach Sunsets & Road Trips' },
    { id: 'p2', url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80', tripName: 'Pawna Lake Camping', alt: 'Bonfire & Stargazing' },
    { id: 'p3', url: 'https://images.unsplash.com/photo-1600100397608-f010f421a150?w=800&q=80', tripName: 'Hampi Backpacking', alt: 'Boulder Trails & Sunset Views' },
    { id: 'p4', url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80', tripName: 'Aadrai Rainforest Trail', alt: 'Deep Jungle & Waterfalls' },
    { id: 'p5', url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80', tripName: 'Western Ghats Road Trip', alt: 'Open Highway & Group Journeys' },
  ]

  // Map 6 slots from database or fallback
  const displayPhotos = [1, 2, 3, 4, 5, 6].map((slotNum, idx) => {
    const found = photos.find(p => p.slot === slotNum || p.featuredOrder === slotNum) || photos[idx]
    if (found && found.url) {
      return { ...found, slot: slotNum }
    }
    return { ...placeholders[idx], slot: slotNum }
  })

  return (
    <section
      id="gallery"
      style={{
        padding: 'clamp(80px, 11vw, 130px) 24px',
        background: '#0A0B0E',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient Animated Floating Orbs */}
      <motion.div
        animate={{
          x: [0, 40, -30, 0],
          y: [0, -35, 25, 0],
          scale: [1, 1.15, 0.9, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          top: '15%',
          left: '10%',
          width: 480,
          height: 480,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(46, 194, 126, 0.1) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <motion.div
        animate={{
          x: [0, -50, 30, 0],
          y: [0, 40, -30, 0],
          scale: [1, 0.9, 1.2, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          bottom: '10%',
          right: '8%',
          width: 520,
          height: 520,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.08) 0%, transparent 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Section Heading with Animated Radar Beacon */}
        <div ref={headRef} style={{ marginBottom: 48, position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 24 }}>
            <div>
              {/* Pulsing Radar Beacon Pill */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6 }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 10,
                  background: 'rgba(46,194,126,0.1)',
                  border: '1px solid rgba(46,194,126,0.25)',
                  padding: '5px 14px',
                  borderRadius: 100,
                }}
              >
                <span style={{ position: 'relative', display: 'flex', width: 8, height: 8 }}>
                  <span
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '50%',
                      background: '#2EC27E',
                      opacity: 0.75,
                      animation: 'radar-ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite',
                    }}
                  />
                  <span
                    style={{
                      position: 'relative',
                      display: 'inline-flex',
                      borderRadius: '50%',
                      width: 8,
                      height: 8,
                      background: '#2EC27E',
                    }}
                  />
                </span>
                <span
                  style={{
                    fontFamily: 'Satoshi, sans-serif',
                    fontSize: 11,
                    fontWeight: 600,
                    color: '#2EC27E',
                    letterSpacing: 2,
                    textTransform: 'uppercase',
                  }}
                >
                  Captured Moments · Real Stories
                </span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 35, scale: 0.97 }}
                animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ delay: 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  fontFamily: 'Clash Display, sans-serif',
                  fontSize: 'clamp(44px, 6.5vw, 88px)',
                  lineHeight: 0.95,
                  color: '#F1F5F9',
                  letterSpacing: 1.5,
                }}
              >
                PAST <span style={{ color: '#2EC27E' }}>GALLERY</span>
              </motion.h2>
            </div>

            {/* See All Trips Button with Magnetic Hover Animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.35, duration: 0.7 }}
            >
              <Link
                to="/gallery"
                className="btn-outline"
                style={{
                  fontSize: 14,
                  padding: '12px 28px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span>See All Trips</span>
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  →
                </motion.span>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* 6-Slot Grid with 3D Tilt & Staggered Reveal */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
            gap: 22,
          }}
        >
          {displayPhotos.map((photo, i) => (
            <InteractiveGalleryCard
              key={photo.id || `slot-${photo.slot}`}
              photo={photo}
              index={i}
              inView={inView}
              onSelect={setLightbox}
            />
          ))}
        </div>

        {/* Bottom Full Gallery CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.65, duration: 0.7 }}
          style={{ textAlign: 'center', marginTop: 44 }}
        >
          <Link
            to="/gallery"
            className="btn-outline"
            style={{ fontSize: 14, padding: '12px 36px', display: 'inline-flex', alignItems: 'center', gap: 8 }}
          >
            <span>Browse Full Visual Vault ({photos.length > 0 ? `${photos.length} photos` : 'All trips'})</span>
            <span>→</span>
          </Link>
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setLightbox(null)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              background: 'rgba(5, 7, 10, 0.94)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 24,
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'relative',
                maxWidth: 960,
                maxHeight: '90vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <img
                src={lightbox.url}
                alt={lightbox.alt || lightbox.tripName}
                style={{
                  maxWidth: '100%',
                  maxHeight: '78vh',
                  objectFit: 'contain',
                  borderRadius: 16,
                  boxShadow: '0 24px 64px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.1)',
                }}
              />

              <div
                style={{
                  marginTop: 16,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  background: 'rgba(18,21,28,0.85)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 100,
                  padding: '6px 20px',
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2EC27E' }} />
                <span
                  style={{
                    fontFamily: 'Satoshi, sans-serif',
                    fontSize: 13,
                    color: '#F1F5F9',
                    fontWeight: 600,
                  }}
                >
                  {lightbox.tripName}
                </span>
              </div>

              <button
                onClick={() => setLightbox(null)}
                style={{
                  position: 'absolute',
                  top: -16,
                  right: -16,
                  background: 'rgba(18,21,28,0.9)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '50%',
                  width: 38,
                  height: 38,
                  color: '#F1F5F9',
                  fontSize: 16,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                }}
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes radar-ping {
          75%, 100% {
            transform: scale(2.4);
            opacity: 0;
          }
        }
      `}</style>
    </section>
  )
}

export default GallerySection




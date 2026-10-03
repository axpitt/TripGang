import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import { getFeaturedGallery } from '../lib/firestore'

const GallerySection = () => {
  const [photos, setPhotos] = useState([])
  const [lightbox, setLightbox] = useState(null)
  const headRef = useRef(null)
  const inView = useInView(headRef, { once: true, amount: 0.1 })

  useEffect(() => {
    getFeaturedGallery()
      .then(data => setPhotos(data))
      .catch(() => setPhotos([]))
  }, [])

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setLightbox(null) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // Placeholders when no featured photos uploaded yet
  const placeholders = Array.from({ length: 6 }, (_, i) => ({
    id: `p${i}`, url: '', tripName: 'Adrai Trek', alt: `Photo ${i + 1}`,
  }))

  const displayPhotos = photos.length > 0 ? photos : placeholders

  return (
    <section
      id="gallery"
      style={{
        padding: 'clamp(80px, 10vw, 120px) 24px',
        background: '#081120',
        position: 'relative',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Heading */}
        <div ref={headRef} style={{ marginBottom: 48, position: 'relative' }}>
          {/* Ghost watermark */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 0.055 } : {}}
            transition={{ duration: 1.2 }}
            style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: 'clamp(80px, 16vw, 200px)',
              color: '#F1F5F9',
              position: 'absolute', top: '-0.2em', left: 0,
              whiteSpace: 'nowrap',
              pointerEvents: 'none', userSelect: 'none',
              letterSpacing: '0.06em', lineHeight: 1, zIndex: 0,
            }}
          >MEMORIES</motion.span>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 24, position: 'relative', zIndex: 2, paddingTop: '0.5em' }}>
            <div>
              <motion.p
                className="section-eyebrow"
                initial={{ opacity: 0, x: -30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                Captured Moments
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 50, scale: 0.97 }}
                animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ delay: 0.15, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  fontFamily: 'Bebas Neue, sans-serif',
                  fontSize: 'clamp(42px, 6vw, 84px)',
                  lineHeight: 1, color: '#F1F5F9', letterSpacing: 1,
                }}
              >
                PAST <span style={{ color: '#38BDF8' }}>GALLERY</span>
              </motion.h2>
            </div>

            {/* See More link */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.7 }}
            >
              <Link
                to="/gallery"
                className="btn-outline"
                style={{ fontSize: 14, padding: '11px 28px' }}
              >
                <span>See All Trips →</span>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Masonry grid — featured photos only */}
        <div style={{ columns: '3 280px', columnGap: 16 }}>
          {displayPhotos.map((photo, i) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ delay: (i % 6) * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              style={{
                breakInside: 'avoid', marginBottom: 16,
                borderRadius: 12, overflow: 'hidden', cursor: photo.url ? 'pointer' : 'default',
                background: '#102A43',
                border: '1px solid rgba(56,189,248,0.06)',
                position: 'relative',
                transition: 'border-color 0.3s',
              }}
              className="gallery-item"
              onClick={() => photo.url && setLightbox(photo)}
            >
              {photo.url ? (
                <>
                  <motion.img
                    src={photo.url}
                    alt={photo.alt || photo.tripName}
                    style={{ width: '100%', display: 'block', objectFit: 'cover' }}
                    loading="lazy"
                    whileHover={{ scale: 1.04 }}
                    transition={{ duration: 0.4 }}
                  />
                  {/* Caption overlay */}
                  <div className="gallery-overlay" style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    background: 'linear-gradient(transparent, rgba(8,17,32,0.88))',
                    padding: '32px 14px 12px',
                    transform: 'translateY(4px)', opacity: 0,
                    transition: 'opacity 0.3s ease, transform 0.3s ease',
                  }}>
                    <span style={{
                      fontFamily: 'Space Grotesk, sans-serif', fontSize: 12,
                      color: '#F1F5F9', fontWeight: 600, letterSpacing: 0.5,
                    }}>
                      {photo.tripName}
                    </span>
                  </div>
                </>
              ) : (
                <div style={{
                  height: i % 3 === 0 ? 240 : i % 3 === 1 ? 180 : 210,
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', gap: 10,
                }}>
                  <span style={{ fontSize: 32 }}>🏔️</span>
                  <span style={{
                    fontFamily: 'Space Grotesk, sans-serif', fontSize: 12,
                    color: '#475569', textAlign: 'center', padding: '0 16px',
                  }}>Photos coming after the trek!</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* See More button — bottom center */}
        {photos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginTop: 40 }}
          >
            <Link to="/gallery" className="btn-outline" style={{ fontSize: 15, padding: '13px 40px' }}>
              <span>See Full Trip Gallery →</span>
            </Link>
          </motion.div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            style={{
              position: 'fixed', inset: 0, zIndex: 1000,
              background: 'rgba(8,17,32,0.97)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
              backdropFilter: 'blur(12px)',
            }}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={e => e.stopPropagation()}
              style={{ position: 'relative', maxWidth: 900, maxHeight: '90vh' }}
            >
              <img
                src={lightbox.url} alt={lightbox.alt}
                style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: 12 }}
              />
              <button onClick={() => setLightbox(null)} style={{
                position: 'absolute', top: -44, right: 0,
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#F1F5F9', fontSize: 28, lineHeight: 1,
              }}>✕</button>
              <div style={{
                fontFamily: 'Space Grotesk, sans-serif', fontSize: 13,
                color: '#94A3B8', marginTop: 12, textAlign: 'center',
              }}>
                {lightbox.tripName}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .gallery-item:hover .gallery-overlay { opacity: 1 !important; transform: translateY(0) !important; }
        .gallery-item:hover { border-color: rgba(56,189,248,0.15) !important; }
        @media (max-width: 600px) { [style*="columns: 3"] { columns: 2 280px !important; } }
      `}</style>
    </section>
  )
}

export default GallerySection

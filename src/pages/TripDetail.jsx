import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { getTripById, submitLead } from '../lib/firestore'
import { defaultTrips } from '../components/ui/3-d-coverflow-carousel'
import Navbar from '../components/ui/Navbar'

// ─── I'm Interested Modal ───────────────────────────────────────────────────
const InterestedModal = ({ trip, onClose }) => {
  const [form, setForm] = useState({ name: '', phone: '', city: '', message: '' })
  const [status, setStatus] = useState('idle')
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    try {
      await submitLead({
        name: form.name, phone: form.phone,
        city: form.city, message: form.message,
        tripId: trip.id, tripName: trip.name,
      })
      setStatus('success')
    } catch (err) {
      if (err.message === 'DUPLICATE') setStatus('duplicate')
      else setStatus('error')
    }
  }

  const inp = {
    background: '#081120', border: '1px solid rgba(56,189,248,0.15)',
    borderRadius: 8, padding: '10px 14px', width: '100%', boxSizing: 'border-box',
    fontFamily: 'Satoshi, sans-serif', fontSize: 14, color: '#F1F5F9', outline: 'none',
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9000,
        background: 'rgba(8,17,32,0.92)', backdropFilter: 'blur(10px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        onClick={e => e.stopPropagation()}
        style={{
          background: 'linear-gradient(145deg, #102A43, #0c1a2e)',
          border: '1px solid rgba(56,189,248,0.15)',
          borderRadius: 20, padding: 36, width: '100%', maxWidth: 480,
          position: 'relative',
        }}
      >
        <button onClick={onClose} style={{
          position: 'absolute', top: 16, right: 16, background: 'rgba(56,189,248,0.08)',
          border: '1px solid rgba(56,189,248,0.15)', borderRadius: '50%',
          width: 32, height: 32, color: '#94A3B8', cursor: 'pointer', fontSize: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>✕</button>

        {status === 'success' ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>🎉</div>
            <h3 style={{ fontFamily: 'Clash Display, sans-serif', fontSize: 28, color: '#2EC27E', letterSpacing: 1, marginBottom: 12 }}>
              We Got You!
            </h3>
            <p style={{ fontFamily: 'Satoshi, sans-serif', fontSize: 15, color: '#94A3B8', lineHeight: 1.7, marginBottom: 24 }}>
              Thanks for expressing interest in <strong style={{ color: '#F1F5F9' }}>{trip.name}</strong>. Arpit will reach out personally when the next trip is announced.
            </p>
            <button onClick={onClose} className="btn-cta" style={{ width: '100%', justifyContent: 'center' }}>Done</button>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 24 }}>
              <span className="badge badge-accent" style={{ marginBottom: 12 }}>I'm Interested</span>
              <h3 style={{ fontFamily: 'Clash Display, sans-serif', fontSize: 26, color: '#F1F5F9', letterSpacing: 1, marginBottom: 8 }}>
                {trip.name}
              </h3>
              <p style={{ fontFamily: 'Satoshi, sans-serif', fontSize: 14, color: '#94A3B8', lineHeight: 1.6 }}>
                Can't make it this time? Leave your info and we'll personally notify you for future trips. 🏔️
              </p>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <label style={{ fontFamily: 'Satoshi, sans-serif', fontSize: 11, color: '#94A3B8', letterSpacing: 1.5, textTransform: 'uppercase' }}>Your Name *</label>
                  <input style={inp} required placeholder="Rahul Sharma" value={form.name} onChange={e => set('name', e.target.value)} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <label style={{ fontFamily: 'Satoshi, sans-serif', fontSize: 11, color: '#94A3B8', letterSpacing: 1.5, textTransform: 'uppercase' }}>Phone *</label>
                  <input style={inp} required type="tel" placeholder="9876543210" value={form.phone} onChange={e => set('phone', e.target.value)} />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <label style={{ fontFamily: 'Satoshi, sans-serif', fontSize: 11, color: '#94A3B8', letterSpacing: 1.5, textTransform: 'uppercase' }}>Your City</label>
                <input style={inp} placeholder="Aurangabad, Pune..." value={form.city} onChange={e => set('city', e.target.value)} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <label style={{ fontFamily: 'Satoshi, sans-serif', fontSize: 11, color: '#94A3B8', letterSpacing: 1.5, textTransform: 'uppercase' }}>Message (optional)</label>
                <textarea style={{ ...inp, resize: 'vertical', minHeight: 80 }}
                  placeholder="e.g. Interested but can't join this date. Please notify me next time!"
                  value={form.message} onChange={e => set('message', e.target.value)} />
              </div>
              {status === 'duplicate' && (
                <div style={{ background: 'rgba(251,133,0,0.1)', border: '1px solid rgba(251,133,0,0.3)', borderRadius: 8, padding: '10px 14px', fontFamily: 'Satoshi, sans-serif', fontSize: 13, color: '#FB8500' }}>
                  You've already expressed interest in this trip. We have your details! 📝
                </div>
              )}
              {status === 'error' && (
                <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '10px 14px', fontFamily: 'Satoshi, sans-serif', fontSize: 13, color: '#f87171' }}>
                  Something went wrong. Please WhatsApp us directly.
                </div>
              )}
              <button type="submit" disabled={status === 'loading'} className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}>
                {status === 'loading' ? 'Sending...' : "🙋 Yes, I'm Interested!"}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </motion.div>
  )
}

// ─── YouTube ID extractor ────────────────────────────────────────────────────
const getYouTubeId = (url) => {
  if (!url) return null
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/)
  return match ? match[1] : null
}

// ─── TripDetail Page ─────────────────────────────────────────────────────────
const TripDetail = () => {
  const { tripId } = useParams()
  const [trip, setTrip] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [activePhoto, setActivePhoto] = useState(null)
  const [showInterested, setShowInterested] = useState(false)

  useEffect(() => {
    getTripById(tripId).then(data => {
      if (!data) {
        const fallback = defaultTrips.find(t => t.id === tripId)
        if (fallback) {
          setTrip({
            id: fallback.id,
            name: fallback.titleLine1 + ' ' + (fallback.titleLine2 || ''),
            destination: fallback.titleLine2 || 'Maharashtra',
            duration: fallback.duration,
            distance: fallback.distance,
            difficulty: fallback.difficulty,
            type: fallback.tag?.replace(/[^a-zA-Z &]/g, '').trim() || 'Adventure',
            heroImage: fallback.img,
            earlyBirdPrice: parseInt(fallback.price?.replace(/[^\d]/g, '') || 1499),
            regularPrice: fallback.originalPrice ? parseInt(fallback.originalPrice.replace(/[^\d]/g, '') || 1999) : null,
            status: 'open',
            desc: fallback.desc,
            photos: [fallback.img],
            itinerary: [
              { day: 1, title: 'Road Trip Departure & Base Camp Arrival', description: 'Early morning pickup. Scenic drive through Western Ghats with roadside breakfast. Reach base, explore viewpoints, campfire evening & music.' },
              { day: 2, title: 'Sunrise Exploration & Return', description: 'Sunrise trail, local breakfast, sightseeing, group memories & evening journey back.' },
            ],
            thingsToPack: [
              'Trekking or comfortable walking shoes',
              'Warm hoodie / jacket for night',
              '2L reusable water bottle',
              'Valid government ID & personal medicine'
            ],
            thingsToAvoid: [
              'No littering / single-use plastics on trail',
              'No alcohol / intoxicating substances during transit'
            ],
          })
        } else {
          setNotFound(true)
        }
      } else {
        setTrip(data)
      }
      setLoading(false)
    }).catch(() => { setNotFound(true); setLoading(false) })
  }, [tripId])

  if (loading) return (
    <div style={{ background: '#081120', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: 'Clash Display, sans-serif', fontSize: 32, color: '#2EC27E', letterSpacing: 4 }}>LOADING…</div>
    </div>
  )

  if (notFound) return (
    <div style={{ background: '#081120', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
      <div style={{ fontSize: 48 }}>🏔️</div>
      <div style={{ fontFamily: 'Clash Display, sans-serif', fontSize: 36, color: '#F1F5F9', letterSpacing: 2 }}>Trip Not Found</div>
      <Link to="/" className="btn-outline"><span>← Back to Home</span></Link>
    </div>
  )

  const ytId = getYouTubeId(trip.ytLink)
  const diffColor = { Easy: '#2EC27E', Moderate: '#FB8500', Hard: '#ef4444' }
  const photos = Array.isArray(trip.photos) ? trip.photos : []
  const itinerary = Array.isArray(trip.itinerary) ? trip.itinerary : []
  const thingsToPack = Array.isArray(trip.thingsToPack) ? trip.thingsToPack : []
  const thingsToAvoid = Array.isArray(trip.thingsToAvoid) ? trip.thingsToAvoid : []

  return (
    <>
      <Helmet>
        <title>{trip.name} — TripGang</title>
        <meta name="description" content={`Join the ${trip.name} trek in ${trip.destination}. ${trip.duration} | ₹${trip.earlyBirdPrice?.toLocaleString()} early bird.`} />
      </Helmet>

      <div style={{ background: '#081120', minHeight: '100vh' }}>
        <Navbar />

        {/* ── HERO BANNER ── */}
        <div style={{ position: 'relative', height: '65vh', minHeight: 400, overflow: 'hidden' }}>
          {trip.heroImage ? (
            <img src={trip.heroImage} alt={trip.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #102A43, #0c1a2e)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 80 }}>🏔️</div>
          )}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, rgba(8,17,32,0.3) 0%, rgba(8,17,32,0.85) 100%)',
          }} />
          {/* Hero text */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 'clamp(24px,5vw,60px)' }}>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
              <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'Satoshi, sans-serif', fontSize: 11, fontWeight: 700, padding: '4px 14px', borderRadius: 100, background: diffColor[trip.difficulty] || '#2EC27E', color: trip.difficulty === 'Hard' ? '#fff' : '#041a10' }}>{trip.difficulty}</span>
                <span className="badge badge-info">{trip.type}</span>
                {trip.status === 'full' && <span className="badge badge-cta">FULL</span>}
              </div>
              <h1 style={{ fontFamily: 'Clash Display, sans-serif', fontSize: 'clamp(36px, 6vw, 80px)', color: '#F1F5F9', lineHeight: 1, letterSpacing: 1, marginBottom: 12 }}>
                {trip.name}
              </h1>
              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                {[
                  { icon: '📍', text: trip.destination },
                  { icon: '🗓️', text: trip.date?.toDate ? new Date(trip.date.toDate()).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '' },
                  { icon: '🕐', text: trip.duration },
                  { icon: '📏', text: trip.distance },
                ].filter(m => m.text).map(({ icon, text }) => (
                  <span key={text} style={{ fontFamily: 'Satoshi, sans-serif', fontSize: 14, color: 'rgba(241,245,249,0.8)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    {icon} {text}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── MAIN CONTENT ── */}
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(32px, 5vw, 60px) 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 48, alignItems: 'start' }} className="td-grid">

            {/* LEFT — content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 56 }}>

              {/* ── TRIP PHOTOS ── */}
              {photos.length > 0 && (
                <motion.section initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
                  <h2 style={{ fontFamily: 'Clash Display, sans-serif', fontSize: 'clamp(28px, 4vw, 44px)', color: '#F1F5F9', letterSpacing: 1, marginBottom: 24 }}>
                    TRIP <span style={{ color: '#38BDF8' }}>PHOTOS</span>
                  </h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
                    {photos.map((url, i) => (
                      <motion.div
                        key={i} whileHover={{ scale: 1.03 }} transition={{ duration: 0.3 }}
                        onClick={() => setActivePhoto(url)}
                        style={{ borderRadius: 12, overflow: 'hidden', cursor: 'pointer', aspectRatio: '4/3' }}
                      >
                        <img src={url} alt={`Trip photo ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} loading="lazy" />
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              )}

              {/* ── YOUTUBE REFERENCE ── */}
              {ytId && (
                <motion.section initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.8 }}>
                  <h2 style={{ fontFamily: 'Clash Display, sans-serif', fontSize: 'clamp(28px, 4vw, 44px)', color: '#F1F5F9', letterSpacing: 1, marginBottom: 8 }}>
                    DESTINATION <span style={{ color: '#2EC27E' }}>PREVIEW</span>
                  </h2>
                  <p style={{ fontFamily: 'Satoshi, sans-serif', fontSize: 14, color: '#94A3B8', marginBottom: 20 }}>
                    Watch this before your trip for a feel of the destination.
                  </p>
                  <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(56,189,248,0.12)', aspectRatio: '16/9' }}>
                    <iframe
                      src={`https://www.youtube.com/embed/${ytId}`}
                      title="Destination Preview"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                    />
                  </div>
                </motion.section>
              )}

              {/* ── ITINERARY ── */}
              {itinerary.length > 0 && (
                <motion.section initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.8 }}>
                  <h2 style={{ fontFamily: 'Clash Display, sans-serif', fontSize: 'clamp(28px, 4vw, 44px)', color: '#F1F5F9', letterSpacing: 1, marginBottom: 28 }}>
                    FULL <span style={{ color: '#2EC27E' }}>ITINERARY</span>
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                    {itinerary.map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ delay: i * 0.08, duration: 0.6 }}
                        style={{ display: 'flex', gap: 20, position: 'relative', paddingBottom: i < itinerary.length - 1 ? 32 : 0 }}
                      >
                        {/* Timeline line */}
                        {i < itinerary.length - 1 && (
                          <div style={{ position: 'absolute', left: 19, top: 40, bottom: 0, width: 2, background: 'rgba(46,194,126,0.15)' }} />
                        )}
                        {/* Day circle */}
                        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(46,194,126,0.1)', border: '1px solid rgba(46,194,126,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <span style={{ fontFamily: 'Clash Display, sans-serif', fontSize: 14, color: '#2EC27E' }}>
                            {item.day || i + 1}
                          </span>
                        </div>
                        <div style={{ paddingTop: 8 }}>
                          {item.title && (
                            <div style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 700, fontSize: 16, color: '#F1F5F9', marginBottom: 6 }}>
                              {item.title}
                            </div>
                          )}
                          <p style={{ fontFamily: 'Satoshi, sans-serif', fontSize: 14, color: '#94A3B8', lineHeight: 1.7 }}>
                            {item.description || item}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              )}

              {/* ── THINGS TO PACK & AVOID ── */}
              {(thingsToPack.length > 0 || thingsToAvoid.length > 0) && (
                <motion.section initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.8 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: thingsToPack.length > 0 && thingsToAvoid.length > 0 ? '1fr 1fr' : '1fr', gap: 24 }} className="pack-grid">
                    {thingsToPack.length > 0 && (
                      <div style={{ background: 'rgba(46,194,126,0.04)', border: '1px solid rgba(46,194,126,0.12)', borderRadius: 16, padding: 24 }}>
                        <h3 style={{ fontFamily: 'Clash Display, sans-serif', fontSize: 26, color: '#2EC27E', letterSpacing: 1, marginBottom: 20 }}>
                          ✅ THINGS TO PACK
                        </h3>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                          {thingsToPack.map((item, i) => (
                            <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                              <span style={{ color: '#2EC27E', fontSize: 14, marginTop: 2, flexShrink: 0 }}>✓</span>
                              <span style={{ fontFamily: 'Satoshi, sans-serif', fontSize: 14, color: '#94A3B8', lineHeight: 1.5 }}>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {thingsToAvoid.length > 0 && (
                      <div style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.12)', borderRadius: 16, padding: 24 }}>
                        <h3 style={{ fontFamily: 'Clash Display, sans-serif', fontSize: 26, color: '#ef4444', letterSpacing: 1, marginBottom: 20 }}>
                          ❌ THINGS TO AVOID
                        </h3>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                          {thingsToAvoid.map((item, i) => (
                            <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                              <span style={{ color: '#ef4444', fontSize: 14, marginTop: 2, flexShrink: 0 }}>✗</span>
                              <span style={{ fontFamily: 'Satoshi, sans-serif', fontSize: 14, color: '#94A3B8', lineHeight: 1.5 }}>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </motion.section>
              )}
            </div>

            {/* RIGHT — sticky booking card */}
            <div>
              <div style={{
                position: 'sticky', top: 90,
                background: 'linear-gradient(145deg, #102A43, #0c1a2e)',
                border: '1px solid rgba(56,189,248,0.15)',
                borderRadius: 20, padding: 28,
                display: 'flex', flexDirection: 'column', gap: 16,
              }}>
                {/* Price */}
                <div>
                  {trip.earlyBirdPrice && (
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontFamily: 'Satoshi, sans-serif', fontSize: 32, fontWeight: 700, color: '#2EC27E' }}>
                        ₹{trip.earlyBirdPrice.toLocaleString()}
                      </span>
                      {trip.regularPrice > trip.earlyBirdPrice && (
                        <span style={{ fontFamily: 'Satoshi, sans-serif', fontSize: 16, color: '#475569', textDecoration: 'line-through' }}>
                          ₹{trip.regularPrice?.toLocaleString()}
                        </span>
                      )}
                    </div>
                  )}
                  <span className="badge badge-cta" style={{ fontSize: 10 }}>Early Bird Price</span>
                </div>

                <div style={{ height: 1, background: 'rgba(56,189,248,0.08)' }} />

                {/* Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { icon: '📍', label: 'Destination', val: trip.destination },
                    { icon: '🗓️', label: 'Date', val: trip.date?.toDate ? new Date(trip.date.toDate()).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '' },
                    { icon: '🕐', label: 'Duration', val: trip.duration },
                    { icon: '📏', label: 'Distance', val: trip.distance },
                    { icon: '🎯', label: 'Difficulty', val: trip.difficulty },
                    { icon: '💺', label: 'Seats Left', val: `${Math.max(0, (trip.maxSeats || 0) - (trip.seatsBooked || 0))} / ${trip.maxSeats}` },
                  ].filter(r => r.val).map(({ icon, label, val }) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span style={{ fontFamily: 'Satoshi, sans-serif', fontSize: 12, color: '#475569' }}>{icon} {label}</span>
                      <span style={{ fontFamily: 'Satoshi, sans-serif', fontSize: 12, fontWeight: 600, color: '#94A3B8', textAlign: 'right', maxWidth: '55%' }}>{val}</span>
                    </div>
                  ))}
                </div>

                <div style={{ height: 1, background: 'rgba(56,189,248,0.08)' }} />

                {/* Seat progress bar */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontFamily: 'Satoshi, sans-serif', fontSize: 11, color: '#475569' }}>Booking progress</span>
                    <span style={{ fontFamily: 'Satoshi, sans-serif', fontSize: 11, fontWeight: 700, color: '#2EC27E' }}>
                      {trip.seatsBooked}/{trip.maxSeats}
                    </span>
                  </div>
                  <div className="seat-bar">
                    <div className="seat-bar-fill" style={{ width: `${Math.min(100, ((trip.seatsBooked || 0) / (trip.maxSeats || 1)) * 100)}%` }} />
                  </div>
                </div>

                {/* CTAs */}
                <a
                  href={`https://wa.me/917038276535?text=Hi%20Arpit!%20I%20want%20to%20book%20${encodeURIComponent(trip.name)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="btn-cta"
                  style={{ width: '100%', justifyContent: 'center', fontSize: 15 }}
                >
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.5-.173-.001-.371-.001-.57-.001-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                  Book on WhatsApp
                </a>
                <button
                  onClick={() => setShowInterested(true)}
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center', fontSize: 14 }}
                >
                  🙋 I'm Interested (can't join now)
                </button>

                <Link to="/#trips" style={{ fontFamily: 'Satoshi, sans-serif', fontSize: 13, color: '#475569', textAlign: 'center', textDecoration: 'none', marginTop: 4 }}
                  onMouseEnter={e => e.target.style.color = '#38BDF8'}
                  onMouseLeave={e => e.target.style.color = '#475569'}
                >
                  ← View all trips
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── PHOTO LIGHTBOX ── */}
        <AnimatePresence>
          {activePhoto && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setActivePhoto(null)}
              style={{
                position: 'fixed', inset: 0, zIndex: 9900,
                background: 'rgba(8,17,32,0.95)', backdropFilter: 'blur(12px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
              }}
            >
              <motion.img
                initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}
                src={activePhoto} alt="Full size"
                style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: 16, objectFit: 'contain' }}
                onClick={e => e.stopPropagation()}
              />
              <button onClick={() => setActivePhoto(null)} style={{
                position: 'fixed', top: 20, right: 20, background: 'rgba(56,189,248,0.1)',
                border: '1px solid rgba(56,189,248,0.2)', borderRadius: '50%', width: 44, height: 44,
                color: '#F1F5F9', cursor: 'pointer', fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>✕</button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── I'm Interested Modal ── */}
        <AnimatePresence>
          {showInterested && <InterestedModal trip={trip} onClose={() => setShowInterested(false)} />}
        </AnimatePresence>

        <style>{`
          @media (max-width: 900px) {
            .td-grid { grid-template-columns: 1fr !important; }
            .td-grid > div:last-child > div { position: static !important; }
          }
          @media (max-width: 600px) {
            .pack-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </div>
    </>
  )
}

export default TripDetail




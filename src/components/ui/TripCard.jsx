import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import useCountdown from '../../hooks/useCountdown'
import { submitLead } from '../../lib/firestore'

const difficultyColor = {
  Easy:     '#2EC27E',  // Monsoon Green
  Moderate: '#FB8500',  // Sunset Orange
  Hard:     '#ef4444',  // Red
}

// ─── Countdown Timer ───────────────────────────────────────────────────────────
const CountdownTimer = ({ deadline, earlyPrice, regularPrice }) => {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(deadline)

  if (isExpired) return (
    <div style={{ marginBottom: 16 }}>
      <span style={{
        fontFamily: 'Satoshi, sans-serif',
        fontSize: 28, fontWeight: 700, color: '#F1F5F9',
      }}>₹{regularPrice?.toLocaleString()}</span>
    </div>
  )

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 10 }}>
        <span style={{
          fontFamily: 'Satoshi, sans-serif',
          fontSize: 28, fontWeight: 700, color: '#2EC27E',
        }}>
          ₹{earlyPrice?.toLocaleString()}
        </span>
        <span style={{
          fontFamily: 'Satoshi, sans-serif',
          fontSize: 16, color: '#475569',
          textDecoration: 'line-through',
        }}>
          ₹{regularPrice?.toLocaleString()}
        </span>
        <span style={{
          fontSize: 10, fontWeight: 700, color: '#1a0800',
          background: '#FB8500',
          padding: '2px 8px', borderRadius: 4, letterSpacing: 1,
        }}>EARLY BIRD</span>
      </div>

      {/* Countdown timer */}
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        {[
          { v: days, l: 'D' }, { v: hours, l: 'H' },
          { v: minutes, l: 'M' }, { v: seconds, l: 'S' },
        ].map(({ v, l }, i) => (
          <div key={l} style={{ display: 'flex', alignItems: 'center', gap: i < 3 ? 6 : 0 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 20, color: '#F1F5F9',
                background: '#0A0B0E',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 6, padding: '2px 8px', minWidth: 34, lineHeight: 1.5,
              }}>
                {String(v).padStart(2, '0')}
              </div>
              <div style={{
                fontFamily: 'Satoshi, sans-serif',
                fontSize: 9, color: '#94A3B8', letterSpacing: 1, marginTop: 2,
              }}>{l}</div>
            </div>
            {i < 3 && <span style={{ color: '#2EC27E', fontSize: 16, fontWeight: 700, marginBottom: 14 }}>:</span>}
          </div>
        ))}
        <span style={{
          fontFamily: 'Satoshi, sans-serif', fontSize: 10,
          color: '#FB8500', marginLeft: 4, fontWeight: 600,
        }}>
          early bird
        </span>
      </div>
    </div>
  )
}

// ─── I'm Interested Modal ───────────────────────────────────────────────────────
const InterestedModal = ({ trip, onClose }) => {
  const [form, setForm] = useState({ name: '', phone: '', city: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | loading | success | error | duplicate

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    try {
      await submitLead({
        name: form.name,
        phone: form.phone,
        city: form.city,
        message: form.message,
        tripId: trip.id,
        tripName: trip.name,
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
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 9000,
          background: 'rgba(8,17,32,0.88)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 20, backdropFilter: 'blur(10px)',
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
          {/* Close */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: 16, right: 16,
              background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.15)',
              borderRadius: '50%', width: 32, height: 32,
              color: '#94A3B8', cursor: 'pointer', fontSize: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >✕</button>

          {status === 'success' ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: 52, marginBottom: 16 }}>🎉</div>
              <h3 style={{ fontFamily: 'Clash Display, sans-serif', fontSize: 28, color: '#2EC27E', letterSpacing: 1, marginBottom: 12 }}>
                We Got You!
              </h3>
              <p style={{ fontFamily: 'Satoshi, sans-serif', fontSize: 15, color: '#94A3B8', lineHeight: 1.7, marginBottom: 24 }}>
                Thanks for expressing interest in <strong style={{ color: '#F1F5F9' }}>{trip.name}</strong>. Arpit will reach out personally when the next trip is announced.
              </p>
              <button onClick={onClose} className="btn-cta" style={{ width: '100%', justifyContent: 'center' }}>
                Done
              </button>
            </div>
          ) : (
            <>
              {/* Header */}
              <div style={{ marginBottom: 24 }}>
                <span className="badge badge-accent" style={{ marginBottom: 12 }}>I'm Interested</span>
                <h3 style={{ fontFamily: 'Clash Display, sans-serif', fontSize: 26, color: '#F1F5F9', letterSpacing: 1, marginBottom: 8 }}>
                  {trip.name}
                </h3>
                <p style={{ fontFamily: 'Satoshi, sans-serif', fontSize: 14, color: '#94A3B8', lineHeight: 1.6 }}>
                  Can't make it this time? No worries — leave your info and we'll personally notify you for the next one. 🏔️
                </p>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    <label style={{ fontFamily: 'Satoshi, sans-serif', fontSize: 11, color: '#94A3B8', letterSpacing: 1.5, textTransform: 'uppercase' }}>Your Name *</label>
                    <input
                      style={inp} required
                      placeholder="Rahul Sharma"
                      value={form.name} onChange={e => set('name', e.target.value)}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    <label style={{ fontFamily: 'Satoshi, sans-serif', fontSize: 11, color: '#94A3B8', letterSpacing: 1.5, textTransform: 'uppercase' }}>Phone *</label>
                    <input
                      style={inp} required type="tel"
                      placeholder="9876543210"
                      value={form.phone} onChange={e => set('phone', e.target.value)}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <label style={{ fontFamily: 'Satoshi, sans-serif', fontSize: 11, color: '#94A3B8', letterSpacing: 1.5, textTransform: 'uppercase' }}>Your City</label>
                  <input
                    style={inp}
                    placeholder="Aurangabad, Pune..."
                    value={form.city} onChange={e => set('city', e.target.value)}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <label style={{ fontFamily: 'Satoshi, sans-serif', fontSize: 11, color: '#94A3B8', letterSpacing: 1.5, textTransform: 'uppercase' }}>Message (optional)</label>
                  <textarea
                    style={{ ...inp, resize: 'vertical', minHeight: 80 }}
                    placeholder="e.g. I'm interested but can't join this date. Please let me know for future trips!"
                    value={form.message} onChange={e => set('message', e.target.value)}
                  />
                </div>

                {status === 'duplicate' && (
                  <div style={{ background: 'rgba(251,133,0,0.1)', border: '1px solid rgba(251,133,0,0.3)', borderRadius: 8, padding: '10px 14px', fontFamily: 'Satoshi, sans-serif', fontSize: 13, color: '#FB8500' }}>
                    You've already expressed interest in this trip. We have your details! 📝
                  </div>
                )}
                {status === 'error' && (
                  <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '10px 14px', fontFamily: 'Satoshi, sans-serif', fontSize: 13, color: '#f87171' }}>
                    Something went wrong. Please try again or WhatsApp us directly.
                  </div>
                )}

                <button
                  id="interested-submit"
                  type="submit"
                  disabled={status === 'loading'}
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}
                >
                  {status === 'loading' ? 'Sending...' : '🙋 Yes, I\'m Interested!'}
                </button>
              </form>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// ─── Trip Card ─────────────────────────────────────────────────────────────────
const TripCard = ({ trip, index }) => {
  const seatsLeft = (trip.maxSeats || 0) - (trip.seatsBooked || 0)
  const seatPct = Math.min(100, ((trip.seatsBooked || 0) / (trip.maxSeats || 1)) * 100)
  const isFull = trip.status === 'full' || seatsLeft <= 0
  const isCritical = seatPct >= 80
  const [showInterested, setShowInterested] = useState(false)

  return (
    <>
      <motion.div
        whileHover={!isFull ? { y: -6, boxShadow: '0 20px 48px rgba(0,0,0,0.5), 0 0 24px rgba(46,194,126,0.1)' } : {}}
        style={{
          background: 'rgba(18, 21, 28, 0.75)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 20, overflow: 'hidden',
          filter: isFull ? 'grayscale(0.6)' : 'none',
          backdropFilter: 'blur(16px)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
          display: 'flex', flexDirection: 'column',
        }}
        onHoverStart={e => {
          if (!isFull) {
            e.target.closest?.('[data-card]')?.style &&
            (e.target.closest('[data-card]').style.borderColor = 'rgba(46,194,126,0.3)')
          }
        }}
      >
        {/* Hero image */}
        <div style={{
          height: 200,
          background: 'linear-gradient(135deg, #102A43 0%, #1B3B5A 100%)',
          position: 'relative', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden',
        }}>
          {trip.heroImage ? (
            <motion.img
              src={trip.heroImage} alt={trip.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              loading="lazy"
              whileHover={{ scale: 1.06 }}
              transition={{ duration: 0.5 }}
            />
          ) : (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 48 }}>🏔️</div>
              <div style={{
                fontFamily: 'Satoshi, sans-serif',
                fontSize: 12, color: '#475569', marginTop: 8,
              }}>Photo coming soon</div>
            </div>
          )}

          {/* Badges */}
          <div style={{ position: 'absolute', top: 14, left: 14, display: 'flex', gap: 8 }}>
            <span style={{
              fontFamily: 'Satoshi, sans-serif', fontSize: 10, fontWeight: 700,
              padding: '4px 12px', borderRadius: 100, letterSpacing: 0.5,
              background: difficultyColor[trip.difficulty] || '#2EC27E',
              color: trip.difficulty === 'Hard' ? '#fff' : '#041a10',
            }}>
              {trip.difficulty}
            </span>
            <span style={{
              fontFamily: 'Satoshi, sans-serif', fontSize: 10, fontWeight: 600,
              padding: '4px 12px', borderRadius: 100,
              background: 'rgba(8,17,32,0.85)', color: '#94A3B8',
              border: '1px solid rgba(56,189,248,0.12)',
            }}>
              {trip.type}
            </span>
          </div>

          {isFull && (
            <div style={{
              position: 'absolute', inset: 0,
              background: 'rgba(8,17,32,0.75)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{
                fontFamily: 'Clash Display, sans-serif', fontSize: 32,
                color: '#F1F5F9', letterSpacing: 4,
                border: '2px solid rgba(241,245,249,0.6)', padding: '4px 20px',
              }}>FULL</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: 24, flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Date */}
          <div style={{
            fontFamily: 'Satoshi, sans-serif', fontSize: 11,
            color: '#38BDF8', fontWeight: 600,
            letterSpacing: 2, textTransform: 'uppercase',
          }}>
            {trip.date?.toDate
              ? new Date(trip.date.toDate()).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
              : ''}
          </div>

          <h3 style={{
            fontFamily: 'Satoshi, sans-serif', fontSize: 20,
            fontWeight: 700, color: '#F1F5F9', lineHeight: 1.3,
          }}>
            {trip.name}
          </h3>

          {/* Meta pills */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {[
              { icon: '📍', text: trip.destination },
              { icon: '🕐', text: trip.duration },
              { icon: '📏', text: trip.distance },
            ].filter(m => m.text).map(({ icon, text }) => (
              <span key={text} style={{
                fontFamily: 'Satoshi, sans-serif', fontSize: 12, color: '#94A3B8',
                display: 'flex', alignItems: 'center', gap: 4,
              }}>
                {icon} {text}
              </span>
            ))}
          </div>

          {/* Price + countdown */}
          <CountdownTimer
            deadline={trip.earlyBirdDeadline}
            earlyPrice={trip.earlyBirdPrice}
            regularPrice={trip.regularPrice}
          />

          {/* Seat bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{
                fontFamily: 'Satoshi, sans-serif', fontSize: 11, color: '#475569',
              }}>Seats left</span>
              <span style={{
                fontFamily: 'Satoshi, sans-serif', fontSize: 11, fontWeight: 700,
                color: isCritical ? '#ef4444' : '#2EC27E',
              }}>
                {seatsLeft} / {trip.maxSeats}
              </span>
            </div>
            <div className="seat-bar">
              <div className={`seat-bar-fill ${isCritical ? 'critical' : ''}`} style={{ width: `${seatPct}%` }} />
            </div>
          </div>

          {/* CTA buttons */}
          <div style={{ marginTop: 'auto', paddingTop: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {isFull ? (
              <div style={{ display: 'flex', gap: 8 }}>
                <Link
                  to={`/trip/${trip.id}`}
                  className="btn-outline"
                  style={{ flex: 1, justifyContent: 'center', fontSize: 13, padding: '10px 12px' }}
                >
                  <span>View Details</span>
                </Link>
                <button
                  onClick={() => setShowInterested(true)}
                  className="btn-primary"
                  style={{ flex: 1, fontSize: 13, padding: '10px 12px', justifyContent: 'center' }}
                >
                  🙋 I'm Interested
                </button>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Link
                    to={`/trip/${trip.id}`}
                    className="btn-outline"
                    style={{ flex: 1, justifyContent: 'center', fontSize: 13, padding: '10px 12px' }}
                  >
                    <span>View Details</span>
                  </Link>
                  <a
                    href={`https://wa.me/917038276535?text=Hi%20Arpit!%20I%20want%20to%20book%20${encodeURIComponent(trip.name)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="btn-cta"
                    style={{ flex: 1, justifyContent: 'center', fontSize: 13, padding: '10px 12px' }}
                  >
                    Book Now
                  </a>
                </div>
                <button
                  onClick={() => setShowInterested(true)}
                  style={{
                    width: '100%', background: 'rgba(46,194,126,0.07)',
                    border: '1px solid rgba(46,194,126,0.2)',
                    borderRadius: 8, padding: '9px', color: '#2EC27E',
                    fontFamily: 'Satoshi, sans-serif', fontSize: 13, fontWeight: 600,
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(46,194,126,0.15)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(46,194,126,0.07)' }}
                >
                  🙋 I'm Interested (but can't come)
                </button>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* I'm Interested Modal */}
      {showInterested && (
        <InterestedModal trip={trip} onClose={() => setShowInterested(false)} />
      )}
    </>
  )
}

export default TripCard




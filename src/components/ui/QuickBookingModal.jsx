import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { submitLead } from '../../lib/firestore'

const FEATURED_BATCHES = [
  {
    id: 'harishchandragad',
    title: 'Harishchandragad Cliff Camp',
    subtitle: 'Konkan Kada · 1,424m Summit · Sunrise Hike',
    price: '₹1,699',
    badge: '🔥 4 Spots Left',
    date: 'This Saturday',
  },
  {
    id: 'gokarna-roadtrip',
    title: 'Gokarna & Coastal Road Trip',
    subtitle: 'Beach Camps · Cafe Hopping · Cliff Treks',
    price: '₹6,499',
    badge: '⚡ Early Bird',
    date: 'Next Weekend',
  },
  {
    id: 'sandhan-valley',
    title: 'Sandhan Valley Descent',
    subtitle: 'The Valley of Shadows · Rappelling · Campfire',
    price: '₹1,899',
    badge: '🌿 Popular',
    date: 'Upcoming Batch',
  },
  {
    id: 'pawna-camp',
    title: 'Pawna Lakeside Camp & Stargazing',
    subtitle: 'Acoustic Guitar · Barbecue · Lake Kayak',
    price: '₹1,499',
    badge: '⛺ Beginner Friendly',
    date: 'Every Sat-Sun',
  },
]

export default function QuickBookingModal({ isOpen, onClose, defaultTripTitle = null }) {
  const [selectedBatch, setSelectedBatch] = useState(FEATURED_BATCHES[0].id)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'success' | 'error' | 'duplicate'

  useEffect(() => {
    if (defaultTripTitle) {
      const match = FEATURED_BATCHES.find(b =>
        b.title.toLowerCase().includes(defaultTripTitle.toLowerCase())
      )
      if (match) setSelectedBatch(match.id)
    }
  }, [defaultTripTitle])

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKey)
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKey)
    }
  }, [isOpen, onClose])

  const currentTrip = FEATURED_BATCHES.find(b => b.id === selectedBatch) || FEATURED_BATCHES[0]

  const handleWhatsAppBooking = (actionType = 'book') => {
    const text = actionType === 'hold'
      ? `Hi Arpit! I want to lock a spot for ₹499 for the ${currentTrip.title} (${currentTrip.date}). Please share payment details.`
      : `Hi Arpit! I want to book the ${currentTrip.title} (${currentTrip.price}, ${currentTrip.date}). How do we get started?`
    window.open(`https://wa.me/917038276535?text=${encodeURIComponent(text)}`, '_blank')
  }

  const handleLeadSubmit = async (e) => {
    e.preventDefault()
    if (!phone || phone.length < 10) return
    setStatus('loading')
    try {
      await submitLead({
        name: name || 'Explorer',
        phone,
        tripId: currentTrip.id,
        tripName: currentTrip.title,
        message: `Quick Booking Modal Lead for ${currentTrip.title} (${currentTrip.price})`,
      })
      setStatus('success')
    } catch (err) {
      if (err.message === 'DUPLICATE') setStatus('duplicate')
      else setStatus('error')
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            background: 'rgba(5, 7, 10, 0.88)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            boxSizing: 'border-box',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 580,
              maxHeight: '90vh',
              overflowY: 'auto',
              background: '#101218',
              borderRadius: 24,
              border: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(46, 194, 126, 0.12)',
              padding: '28px',
              position: 'relative',
              boxSizing: 'border-box',
            }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                top: 20,
                right: 20,
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#94A3B8',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#F8FAFC'
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#94A3B8'
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'
              }}
              aria-label="Close"
            >
              ✕
            </button>

            {/* Header */}
            <div style={{ marginBottom: 20 }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                padding: '4px 12px',
                borderRadius: 100,
                background: 'rgba(46, 194, 126, 0.1)',
                border: '1px solid rgba(46, 194, 126, 0.3)',
                marginBottom: 10,
              }}>
                <span style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: '#2EC27E',
                  boxShadow: '0 0 8px #2EC27E',
                }} />
                <span style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#2EC27E',
                  letterSpacing: 1.5,
                  textTransform: 'uppercase',
                }}>
                  Instant Spot Reservation
                </span>
              </div>
              <h3 style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: 'clamp(24px, 4vw, 30px)',
                color: '#F8FAFC',
                margin: '0 0 6px 0',
                letterSpacing: 0.5,
              }}>
                LOCK IN YOUR ADVENTURE
              </h3>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 13.5,
                color: '#94A3B8',
                margin: 0,
                lineHeight: 1.5,
              }}>
                Select an upcoming batch below. Book instantly via WhatsApp or lock your spot with a flexible ₹499 hold.
              </p>
            </div>

            {/* Batch Selector Cards */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              marginBottom: 22,
            }}>
              {FEATURED_BATCHES.map((batch) => {
                const isSelected = batch.id === selectedBatch
                return (
                  <div
                    key={batch.id}
                    onClick={() => setSelectedBatch(batch.id)}
                    style={{
                      padding: '12px 16px',
                      borderRadius: 14,
                      background: isSelected ? 'rgba(46, 194, 126, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                      border: isSelected ? '1.5px solid #2EC27E' : '1px solid rgba(255, 255, 255, 0.08)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s ease',
                      boxShadow: isSelected ? '0 0 20px rgba(46, 194, 126, 0.15)' : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{
                          fontFamily: 'Space Grotesk, sans-serif',
                          fontSize: 14,
                          fontWeight: 700,
                          color: isSelected ? '#F8FAFC' : '#E2E8F0',
                        }}>
                          {batch.title}
                        </span>
                        <span style={{
                          fontFamily: 'Space Grotesk, sans-serif',
                          fontSize: 10,
                          padding: '2px 7px',
                          borderRadius: 6,
                          background: isSelected ? 'rgba(46, 194, 126, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                          color: isSelected ? '#2EC27E' : '#94A3B8',
                          fontWeight: 600,
                        }}>
                          {batch.badge}
                        </span>
                      </div>
                      <span style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: 12,
                        color: '#94A3B8',
                      }}>
                        {batch.subtitle} · <span style={{ color: '#CBD5E1' }}>{batch.date}</span>
                      </span>
                    </div>

                    <div style={{ textAlign: 'right', flexShrink: 0, paddingLeft: 12 }}>
                      <div style={{
                        fontFamily: 'Outfit, sans-serif',
                        fontSize: 18,
                        fontWeight: 700,
                        color: isSelected ? '#2EC27E' : '#F8FAFC',
                      }}>
                        {batch.price}
                      </div>
                      <span style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: 11,
                        color: '#64748B',
                      }}>
                        all-inclusive
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Direct Booking Actions */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 12,
              marginBottom: 20,
            }}>
              <button
                onClick={() => handleWhatsAppBooking('book')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '13px 20px',
                  borderRadius: 12,
                  background: '#2EC27E',
                  color: '#07160E',
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 700,
                  fontSize: 14,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 18px rgba(46, 194, 126, 0.35)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)'
                  e.currentTarget.style.boxShadow = '0 6px 24px rgba(46, 194, 126, 0.5)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 18px rgba(46, 194, 126, 0.35)'
                }}
              >
                <span>Book on WhatsApp</span>
                <span>→</span>
              </button>

              <button
                onClick={() => handleWhatsAppBooking('hold')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '13px 20px',
                  borderRadius: 12,
                  background: 'rgba(251, 133, 0, 0.12)',
                  color: '#FB8500',
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 700,
                  fontSize: 14,
                  border: '1.5px solid rgba(251, 133, 0, 0.4)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(251, 133, 0, 0.22)'
                  e.currentTarget.style.borderColor = '#FB8500'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(251, 133, 0, 0.12)'
                  e.currentTarget.style.borderColor = 'rgba(251, 133, 0, 0.4)'
                }}
              >
                <span>Lock Spot for ₹499 🛡️</span>
              </button>
            </div>

            {/* Quick Callback / Lead Capture */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 16,
              padding: '16px',
            }}>
              <div style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: 12,
                fontWeight: 600,
                color: '#CBD5E1',
                marginBottom: 10,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}>
                <span>Prefer a direct callback from Arpit?</span>
              </div>

              {status === 'success' ? (
                <div style={{
                  padding: '10px 14px',
                  borderRadius: 10,
                  background: 'rgba(46, 194, 126, 0.15)',
                  border: '1px solid rgba(46, 194, 126, 0.3)',
                  color: '#2EC27E',
                  fontSize: 13,
                  fontFamily: 'Inter, sans-serif',
                  textAlign: 'center',
                }}>
                  ✓ Got it! We'll reach out to your WhatsApp shortly with batch details.
                </div>
              ) : status === 'duplicate' ? (
                <div style={{
                  padding: '10px 14px',
                  borderRadius: 10,
                  background: 'rgba(251, 133, 0, 0.15)',
                  border: '1px solid rgba(251, 133, 0, 0.3)',
                  color: '#FB8500',
                  fontSize: 13,
                  fontFamily: 'Inter, sans-serif',
                  textAlign: 'center',
                }}>
                  We already have your request! We will ping you on WhatsApp soon.
                </div>
              ) : (
                <form onSubmit={handleLeadSubmit} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      flex: '1 1 140px',
                      background: 'rgba(10, 11, 14, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: 10,
                      padding: '9px 12px',
                      color: '#F8FAFC',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 13,
                      outline: 'none',
                    }}
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Phone / WhatsApp Number *"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{
                      flex: '1 1 180px',
                      background: 'rgba(10, 11, 14, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: 10,
                      padding: '9px 12px',
                      color: '#F8FAFC',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 13,
                      outline: 'none',
                    }}
                  />
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    style={{
                      padding: '9px 16px',
                      borderRadius: 10,
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#F8FAFC',
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    {status === 'loading' ? 'Saving...' : 'Call Me Back'}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

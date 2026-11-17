import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  getGallery,
  getFeaturedGallery,
  setHomeSlotPhoto,
  clearHomeSlotPhoto,
  addGalleryItem,
  deleteGalleryItem,
} from '../../lib/firestore'

// Curated high-res trip presets available with 1-click (Road trips, camping, getaways & treks)
const PRESETS = [
  { name: 'Harishchandragad Camp', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000&q=80' },
  { name: 'Gokarna Coastal Drive', url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1000&q=80' },
  { name: 'Pawna Lake Camping', url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1000&q=80' },
  { name: 'Hampi Backpacking', url: 'https://images.unsplash.com/photo-1600100397608-f010f421a150?w=1000&q=80' },
  { name: 'Aadrai Rainforest Trail', url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1000&q=80' },
  { name: 'Western Ghats Road Trip', url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1000&q=80' },
]

const SLOT_LABELS = {
  1: 'Slot 1 · Top Left',
  2: 'Slot 2 · Top Center',
  3: 'Slot 3 · Top Right',
  4: 'Slot 4 · Bottom Left',
  5: 'Slot 5 · Bottom Center',
  6: 'Slot 6 · Bottom Right',
}

// Client-side canvas image compressor (resizes to max 1280px, converts to crisp WebP/JPEG under 200KB)
const compressFileToDataUrl = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height
        const maxDim = 1280

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width)
            width = maxDim
          } else {
            width = Math.round((width * maxDim) / height)
            height = maxDim
          }
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        const compressed = canvas.toDataURL('image/jpeg', 0.85)
        resolve(compressed)
      }
      img.onerror = reject
      img.src = e.target.result
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const GalleryTab = () => {
  const [slots, setSlots] = useState({ 1: null, 2: null, 3: null, 4: null, 5: null, 6: null })
  const [allPhotos, setAllPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeSlotModal, setActiveSlotModal] = useState(null) // slot number 1-6 or null
  const [modalForm, setModalForm] = useState({ url: '', tripName: '', preview: '' })
  const [savingSlot, setSavingSlot] = useState(false)
  const [archiveUrl, setArchiveUrl] = useState('')
  const [archiveTrip, setArchiveTrip] = useState('')
  const [addingArchive, setAddingArchive] = useState(false)
  const fileInputRef = useRef(null)

  const loadData = async () => {
    setLoading(true)
    try {
      const featured = await getFeaturedGallery()
      const all = await getGallery()
      setAllPhotos(all)

      const newSlots = { 1: null, 2: null, 3: null, 4: null, 5: null, 6: null }

      // Map featured items into their respective slots (1 through 6)
      featured.forEach((item, index) => {
        const slotIdx = item.slot || item.featuredOrder || (index + 1)
        if (slotIdx >= 1 && slotIdx <= 6) {
          newSlots[slotIdx] = item
        }
      })

      // Default with presets for slots not yet customized
      for (let i = 1; i <= 6; i++) {
        if (!newSlots[i] || !newSlots[i].url) {
          newSlots[i] = {
            id: `preset-${i}`,
            isPreset: true,
            slot: i,
            url: PRESETS[i - 1].url,
            tripName: PRESETS[i - 1].name,
          }
        }
      }

      setSlots(newSlots)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  // Open modal to configure a specific slot
  const openSlotModal = (slotNumber) => {
    const current = slots[slotNumber]
    setModalForm({
      url: current?.url || '',
      tripName: current?.tripName || '',
      preview: current?.url || '',
    })
    setActiveSlotModal(slotNumber)
  }

  // Handle local file upload with instant canvas compression
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const dataUrl = await compressFileToDataUrl(file)
      setModalForm((prev) => ({
        ...prev,
        url: dataUrl,
        preview: dataUrl,
      }))
    } catch (err) {
      alert('Could not process this image file. Please try another image.')
    }
  }

  // Save the configured slot
  const handleSaveSlot = async () => {
    if (!modalForm.url) {
      alert('Please select or upload a photo first.')
      return
    }
    setSavingSlot(true)
    try {
      await setHomeSlotPhoto(activeSlotModal, {
        url: modalForm.url,
        tripName: modalForm.tripName.trim() || `Trek Photo ${activeSlotModal}`,
        alt: modalForm.tripName.trim() || 'TripGang Trek',
      })
      await loadData()
      setActiveSlotModal(null)
    } catch (err) {
      alert('Error saving photo: ' + err.message)
    }
    setSavingSlot(false)
  }

  // Clear slot photo
  const handleClearSlot = async (slotNumber) => {
    if (!confirm(`Reset ${SLOT_LABELS[slotNumber]} to default preset?`)) return
    try {
      await clearHomeSlotPhoto(slotNumber)
      await loadData()
    } catch (err) {
      alert('Error clearing slot: ' + err.message)
    }
  }

  // Swap two slots
  const handleSwapSlots = async (slotA, slotB) => {
    if (slotB < 1 || slotB > 6) return
    const photoA = slots[slotA]
    const photoB = slots[slotB]
    if (!photoA || !photoB) return

    try {
      await setHomeSlotPhoto(slotA, {
        url: photoB.url,
        tripName: photoB.tripName,
        alt: photoB.tripName,
      })
      await setHomeSlotPhoto(slotB, {
        url: photoA.url,
        tripName: photoA.tripName,
        alt: photoA.tripName,
      })
      await loadData()
    } catch (err) {
      alert('Error swapping slots: ' + err.message)
    }
  }

  // Add a general photo to the archive
  const handleAddArchive = async (e) => {
    e.preventDefault()
    if (!archiveUrl) return
    setAddingArchive(true)
    try {
      await addGalleryItem({
        url: archiveUrl,
        tripName: archiveTrip.trim() || 'General',
        alt: archiveTrip.trim() || 'Gallery photo',
      })
      setArchiveUrl('')
      setArchiveTrip('')
      await loadData()
    } catch (err) {
      alert('Error adding photo: ' + err.message)
    }
    setAddingArchive(false)
  }

  return (
    <div style={{ color: '#F8FAFC', paddingBottom: 60 }}>
      {/* ── Top Header ── */}
      <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontFamily: 'Clash Display, sans-serif', fontSize: 32, letterSpacing: 2, margin: 0, color: '#F8FAFC' }}>
            GALLERY <span style={{ color: '#2EC27E' }}>MANAGER</span>
          </h2>
          <p style={{ fontFamily: 'Satoshi, sans-serif', fontSize: 14, color: '#94A3B8', marginTop: 4 }}>
            Exact 1:1 visual replica of the home page gallery. Click any slot to choose which image goes exactly where.
          </p>
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'rgba(46,194,126,0.1)', border: '1px solid rgba(46,194,126,0.25)',
          padding: '8px 16px', borderRadius: 10,
        }}>
          <span style={{ width: 8, height: 8, background: '#2EC27E', borderRadius: '50%', boxShadow: '0 0 10px #2EC27E' }} />
          <span style={{ fontFamily: 'Satoshi, sans-serif', fontSize: 13, fontWeight: 600, color: '#2EC27E' }}>
            Live Sync with Main Website
          </span>
        </div>
      </div>

      {/* ── SECTION 1: EXACT 1:1 HOME GALLERY REPLICA (6 SLOTS) ── */}
      <div style={{
        background: 'rgba(18, 21, 28, 0.7)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 20,
        padding: '24px 28px',
        marginBottom: 36,
        backdropFilter: 'blur(16px)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h3 style={{ fontFamily: 'Satoshi, sans-serif', fontSize: 16, fontWeight: 700, margin: 0, color: '#F1F5F9' }}>
              🖼️ Home Page Gallery Grid (3 × 2 Layout)
            </h3>
            <span style={{ fontSize: 12, color: '#94A3B8', fontFamily: 'Satoshi, sans-serif' }}>
              Click on any box to replace photo, change caption, or use the arrows to swap positions.
            </span>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={loadData}
              style={{
                background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: 8, padding: '7px 14px', color: '#F1F5F9',
                fontFamily: 'Satoshi, sans-serif', fontSize: 12, cursor: 'pointer',
              }}
            >
              🔄 Refresh Grid
            </button>
          </div>
        </div>

        {/* 6-Slot Grid Replica */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 18,
        }}>
          {[1, 2, 3, 4, 5, 6].map((slotNum) => {
            const photo = slots[slotNum]
            const isCustom = photo && !photo.isPreset && photo.url

            return (
              <div
                key={slotNum}
                style={{
                  borderRadius: 16,
                  overflow: 'hidden',
                  background: 'rgba(10, 11, 14, 0.85)',
                  border: isCustom ? '2px solid rgba(46,194,126,0.6)' : '1px solid rgba(255,255,255,0.12)',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  boxShadow: isCustom ? '0 8px 24px rgba(46,194,126,0.15)' : 'none',
                  transition: 'all 0.25s ease',
                }}
              >
                {/* Slot Position Header Bar */}
                <div style={{
                  padding: '8px 12px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <span style={{
                    fontFamily: 'Satoshi, sans-serif',
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                    color: isCustom ? '#2EC27E' : '#94A3B8',
                  }}>
                    {SLOT_LABELS[slotNum]}
                  </span>

                  {/* Reorder Arrows */}
                  <div style={{ display: 'flex', gap: 4 }}>
                    {slotNum > 1 && (
                      <button
                        title="Move Left"
                        onClick={() => handleSwapSlots(slotNum, slotNum - 1)}
                        style={{
                          background: 'rgba(255, 255, 255, 0.08)', border: 'none',
                          borderRadius: 4, width: 22, height: 22, color: '#F1F5F9',
                          cursor: 'pointer', fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        ◀
                      </button>
                    )}
                    {slotNum < 6 && (
                      <button
                        title="Move Right"
                        onClick={() => handleSwapSlots(slotNum, slotNum + 1)}
                        style={{
                          background: 'rgba(255, 255, 255, 0.08)', border: 'none',
                          borderRadius: 4, width: 22, height: 22, color: '#F1F5F9',
                          cursor: 'pointer', fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        ▶
                      </button>
                    )}
                  </div>
                </div>

                {/* Image Visual Preview */}
                <div
                  onClick={() => openSlotModal(slotNum)}
                  style={{
                    height: 180,
                    position: 'relative',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    background: '#07080B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {photo?.url ? (
                    <>
                      <img
                        src={photo.url}
                        alt={photo.tripName}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(to top, rgba(10,11,14,0.92) 0%, transparent 60%)',
                      }} />

                      {/* Caption on Image */}
                      <div style={{
                        position: 'absolute', bottom: 10, left: 12, right: 12,
                        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
                      }}>
                        <span style={{
                          fontFamily: 'Satoshi, sans-serif',
                          fontSize: 13, fontWeight: 700, color: '#F8FAFC',
                          textShadow: '0 2px 8px rgba(0,0,0,0.8)',
                        }}>
                          {photo.tripName}
                        </span>

                        <span style={{
                          fontSize: 10,
                          background: isCustom ? '#2EC27E' : 'rgba(255,255,255,0.2)',
                          color: isCustom ? '#041a10' : '#F1F5F9',
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: 4,
                        }}>
                          {isCustom ? 'CUSTOM' : 'PRESET'}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div style={{ textAlign: 'center', padding: 20 }}>
                      <span style={{ fontSize: 28, display: 'block', marginBottom: 6 }}>📷</span>
                      <span style={{ fontFamily: 'Satoshi, sans-serif', fontSize: 12, color: '#64748B' }}>
                        Click to Assign Photo
                      </span>
                    </div>
                  )}

                  {/* Hover Overlay Hint */}
                  <div
                    style={{
                      position: 'absolute', inset: 0,
                      background: 'rgba(10,11,14,0.6)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      opacity: 0, transition: 'opacity 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '0'}
                  >
                    <span style={{
                      background: '#2EC27E', color: '#07160E',
                      padding: '8px 16px', borderRadius: 8,
                      fontFamily: 'Satoshi, sans-serif', fontSize: 12, fontWeight: 700,
                    }}>
                      ✏️ Edit Slot {slotNum}
                    </span>
                  </div>
                </div>

                {/* Bottom Actions Bar */}
                <div style={{
                  padding: '8px 12px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                }}>
                  <button
                    onClick={() => openSlotModal(slotNum)}
                    style={{
                      background: 'transparent', border: 'none',
                      color: '#2EC27E', fontFamily: 'Satoshi, sans-serif',
                      fontSize: 12, fontWeight: 600, cursor: 'pointer', padding: 0,
                    }}
                  >
                    📷 Change Photo
                  </button>

                  {isCustom && (
                    <button
                      onClick={() => handleClearSlot(slotNum)}
                      title="Reset to default preset"
                      style={{
                        background: 'transparent', border: 'none',
                        color: '#f87171', fontFamily: 'Satoshi, sans-serif',
                        fontSize: 11, cursor: 'pointer', padding: 0,
                      }}
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── SECTION 2: ARCHIVE & GENERAL PHOTOS ── */}
      <div style={{
        background: 'rgba(18, 21, 28, 0.7)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 20,
        padding: '24px 28px',
        backdropFilter: 'blur(16px)',
      }}>
        <h3 style={{ fontFamily: 'Satoshi, sans-serif', fontSize: 16, fontWeight: 700, margin: '0 0 16px 0', color: '#F1F5F9' }}>
          🗂️ All Photos Library (/gallery page archive)
        </h3>

        {/* Quick Add Form */}
        <form onSubmit={handleAddArchive} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: 10, alignItems: 'end', marginBottom: 24 }}>
          <div>
            <label style={{ fontFamily: 'Satoshi, sans-serif', fontSize: 10, color: '#94A3B8', letterSpacing: 1.5, textTransform: 'uppercase', display: 'block', marginBottom: 5 }}>
              Direct Image URL
            </label>
            <input
              value={archiveUrl}
              onChange={e => setArchiveUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              required
              style={{
                background: '#0A0B0E', border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 8, padding: '10px 12px', width: '100%', boxSizing: 'border-box',
                fontFamily: 'Satoshi, sans-serif', fontSize: 13, color: '#F1F5F9', outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ fontFamily: 'Satoshi, sans-serif', fontSize: 10, color: '#94A3B8', letterSpacing: 1.5, textTransform: 'uppercase', display: 'block', marginBottom: 5 }}>
              Trip Name
            </label>
            <input
              value={archiveTrip}
              onChange={e => setArchiveTrip(e.target.value)}
              placeholder="e.g. Harishchandragad"
              style={{
                background: '#0A0B0E', border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 8, padding: '10px 12px', width: '100%', boxSizing: 'border-box',
                fontFamily: 'Satoshi, sans-serif', fontSize: 13, color: '#F1F5F9', outline: 'none',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={addingArchive}
            style={{
              background: '#2EC27E', border: 'none', borderRadius: 8,
              padding: '10px 22px', height: 42, color: '#041a10',
              fontFamily: 'Satoshi, sans-serif', fontSize: 13, fontWeight: 700,
              cursor: addingArchive ? 'not-allowed' : 'pointer',
            }}
          >
            {addingArchive ? 'Adding...' : '+ Add to Archive'}
          </button>
        </form>

        {/* Library Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
          {allPhotos.map((photo) => (
            <div
              key={photo.id}
              style={{
                background: 'rgba(10, 11, 14, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 12,
                overflow: 'hidden',
              }}
            >
              <div style={{ height: 120, position: 'relative' }}>
                <img src={photo.url} alt={photo.tripName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{
                  position: 'absolute', bottom: 4, left: 8, right: 8,
                  fontFamily: 'Satoshi, sans-serif', fontSize: 11, fontWeight: 700,
                  color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,0.8)',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {photo.tripName}
                </div>
              </div>

              {/* Assign to Slot Dropdown */}
              <div style={{ padding: '8px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                <select
                  defaultValue=""
                  onChange={async (e) => {
                    const slotNum = parseInt(e.target.value, 10)
                    if (slotNum >= 1 && slotNum <= 6) {
                      await setHomeSlotPhoto(slotNum, {
                        url: photo.url,
                        tripName: photo.tripName,
                        alt: photo.alt || photo.tripName,
                      })
                      await loadData()
                      e.target.value = ""
                    }
                  }}
                  style={{
                    background: '#0A0B0E', border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 6, color: '#2EC27E', fontFamily: 'Satoshi, sans-serif',
                    fontSize: 11, padding: '4px 6px', outline: 'none', cursor: 'pointer', flex: 1,
                  }}
                >
                  <option value="" disabled>Set as Slot...</option>
                  {[1, 2, 3, 4, 5, 6].map(n => (
                    <option key={n} value={n}>Slot {n}</option>
                  ))}
                </select>

                <button
                  onClick={async () => {
                    if (confirm('Delete photo from library?')) {
                      await deleteGalleryItem(photo.id)
                      await loadData()
                    }
                  }}
                  style={{
                    background: 'transparent', border: 'none', color: '#f87171',
                    fontSize: 12, cursor: 'pointer', padding: 2,
                  }}
                  title="Delete from archive"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── MODAL: ASSIGN PHOTO TO SPECIFIC SLOT ── */}
      <AnimatePresence>
        {activeSlotModal !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveSlotModal(null)}
            style={{
              position: 'fixed', inset: 0, zIndex: 9999,
              background: 'rgba(5, 6, 8, 0.85)', backdropFilter: 'blur(16px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 20,
            }}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              style={{
                width: '100%', maxWidth: 540,
                background: '#0F1218',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: 20, padding: 28,
                boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                  <h3 style={{ fontFamily: 'Clash Display, sans-serif', fontSize: 24, margin: 0, color: '#F8FAFC', letterSpacing: 1 }}>
                    CONFIGURE <span style={{ color: '#2EC27E' }}>{SLOT_LABELS[activeSlotModal]}</span>
                  </h3>
                  <span style={{ fontFamily: 'Satoshi, sans-serif', fontSize: 12, color: '#94A3B8' }}>
                    Choose the photo that will appear in this exact home position.
                  </span>
                </div>
                <button
                  onClick={() => setActiveSlotModal(null)}
                  style={{ background: 'none', border: 'none', color: '#94A3B8', fontSize: 20, cursor: 'pointer' }}
                >
                  ✕
                </button>
              </div>

              {/* Preview Box */}
              <div style={{
                height: 180, borderRadius: 12, overflow: 'hidden',
                background: '#07080B', border: '1px solid rgba(255,255,255,0.08)',
                marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative',
              }}>
                {modalForm.preview ? (
                  <img src={modalForm.preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontFamily: 'Satoshi, sans-serif', fontSize: 13, color: '#64748B' }}>
                    No Photo Selected
                  </span>
                )}
              </div>

              {/* Upload Directly from Computer */}
              <div style={{ marginBottom: 16 }}>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    width: '100%', padding: '12px',
                    background: 'rgba(46, 194, 126, 0.12)',
                    border: '1.5px dashed rgba(46, 194, 126, 0.4)',
                    borderRadius: 10, color: '#2EC27E',
                    fontFamily: 'Satoshi, sans-serif', fontSize: 13, fontWeight: 700,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  }}
                >
                  <span>📁 Upload Image File (From Computer / Phone)</span>
                </button>
              </div>

              {/* OR Paste URL */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontFamily: 'Satoshi, sans-serif', fontSize: 11, color: '#94A3B8', letterSpacing: 1, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                  Or Paste Direct Image Link
                </label>
                <input
                  value={modalForm.url}
                  onChange={e => setModalForm(f => ({ ...f, url: e.target.value, preview: e.target.value }))}
                  placeholder="https://images.unsplash.com/..."
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    background: '#07080B', border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 8, padding: '10px 12px', color: '#F1F5F9',
                    fontFamily: 'Satoshi, sans-serif', fontSize: 13, outline: 'none',
                  }}
                />
              </div>

              {/* Trip Name / Caption */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontFamily: 'Satoshi, sans-serif', fontSize: 11, color: '#94A3B8', letterSpacing: 1, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                  Trip Name / Caption (Shown on Card)
                </label>
                <input
                  value={modalForm.tripName}
                  onChange={e => setModalForm(f => ({ ...f, tripName: e.target.value }))}
                  placeholder="e.g. Harishchandragad Trek"
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    background: '#07080B', border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 8, padding: '10px 12px', color: '#F1F5F9',
                    fontFamily: 'Satoshi, sans-serif', fontSize: 13, outline: 'none',
                  }}
                />
              </div>

              {/* Quick Pick Presets */}
              <div style={{ marginBottom: 24 }}>
                <span style={{ fontFamily: 'Satoshi, sans-serif', fontSize: 11, color: '#64748B', display: 'block', marginBottom: 8 }}>
                  Or quick pick from authentic trek presets:
                </span>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {PRESETS.map((p) => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => setModalForm({ url: p.url, tripName: p.name, preview: p.url })}
                      style={{
                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 6, padding: '4px 10px', color: '#CBD5E1',
                        fontFamily: 'Satoshi, sans-serif', fontSize: 11, cursor: 'pointer',
                      }}
                    >
                      {p.name.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setActiveSlotModal(null)}
                  style={{
                    background: 'transparent', border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: 8, padding: '10px 20px', color: '#94A3B8',
                    fontFamily: 'Satoshi, sans-serif', fontSize: 13, cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={savingSlot}
                  onClick={handleSaveSlot}
                  style={{
                    background: '#2EC27E', border: 'none',
                    borderRadius: 8, padding: '10px 24px', color: '#041a10',
                    fontFamily: 'Satoshi, sans-serif', fontSize: 13, fontWeight: 700,
                    cursor: savingSlot ? 'not-allowed' : 'pointer',
                  }}
                >
                  {savingSlot ? 'Saving...' : `✓ Save to Slot ${activeSlotModal}`}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default GalleryTab




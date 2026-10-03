import { useState, useEffect } from 'react'
import { getGallery, addGalleryItem, updateGalleryItem, deleteGalleryItem } from '../../lib/firestore'

const inp = {
  background: '#081120', border: '1px solid rgba(56,189,248,0.15)',
  borderRadius: 8, padding: '10px 12px', width: '100%', boxSizing: 'border-box',
  fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, color: '#F1F5F9', outline: 'none',
}

const GalleryTab = () => {
  const [photos, setPhotos] = useState([])
  const [grouped, setGrouped] = useState({})
  const [tripOrder, setTripOrder] = useState([])
  const [filterTrip, setFilterTrip] = useState('All')
  const [url, setUrl] = useState('')
  const [tripName, setTripName] = useState('')
  const [existingTrips, setExistingTrips] = useState([])
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState({})  // { [id]: true } for per-photo save state

  const load = async () => {
    const data = await getGallery()
    setPhotos(data)
    const groups = {}
    const order = []
    const trips = new Set()
    data.forEach(p => {
      const t = p.tripName || 'General'
      trips.add(t)
      if (!groups[t]) { groups[t] = []; order.push(t) }
      groups[t].push(p)
    })
    // Sort each group: featured first by featuredOrder, then the rest
    Object.keys(groups).forEach(t => {
      groups[t].sort((a, b) => {
        if (a.featured && !b.featured) return -1
        if (!a.featured && b.featured) return 1
        return (a.featuredOrder || 999) - (b.featuredOrder || 999)
      })
    })
    setGrouped(groups)
    setTripOrder(order)
    setExistingTrips([...trips])
  }

  useEffect(() => { load() }, [])

  const add = async (e) => {
    e.preventDefault()
    if (!url.startsWith('http')) { setError('Paste a valid image URL (must start with http)'); return }
    setAdding(true); setError('')
    await addGalleryItem({
      url,
      tripName: tripName.trim() || 'General',
      alt: tripName.trim() || 'Gallery photo',
    })
    setUrl(''); setAdding(false); load()
  }

  const del = async (id) => {
    if (!confirm('Remove this photo?')) return
    await deleteGalleryItem(id); load()
  }

  const toggleFeatured = async (photo) => {
    setSaving(s => ({ ...s, [photo.id]: true }))
    await updateGalleryItem(photo.id, { featured: !photo.featured })
    setSaving(s => ({ ...s, [photo.id]: false }))
    load()
  }

  const setOrder = async (photo, val) => {
    const num = parseInt(val, 10)
    if (isNaN(num)) return
    setSaving(s => ({ ...s, [photo.id]: true }))
    await updateGalleryItem(photo.id, { featuredOrder: num })
    setSaving(s => ({ ...s, [photo.id]: false }))
    load()
  }

  const displayedTrips = filterTrip === 'All' ? tripOrder : [filterTrip]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 28, color: '#F1F5F9', letterSpacing: 1 }}>GALLERY</h2>
        <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 12, color: '#475569' }}>
          {photos.length} photo{photos.length !== 1 ? 's' : ''} · {photos.filter(p => p.featured).length} featured on home
        </span>
      </div>

      {/* ── ADD PHOTO FORM ── */}
      <div style={{ background: '#102A43', border: '1px solid rgba(56,189,248,0.12)', borderRadius: 16, padding: 20, marginBottom: 20 }}>
        <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 14, fontWeight: 700, color: '#F1F5F9', marginBottom: 16, letterSpacing: 0.5 }}>
          + Add New Photo
        </h3>
        <form onSubmit={add} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: 10, alignItems: 'end' }}>
          <div>
            <label style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 10, color: '#94A3B8', letterSpacing: 2, textTransform: 'uppercase', display: 'block', marginBottom: 5 }}>
              Image URL *
            </label>
            <input value={url} onChange={e => setUrl(e.target.value)} required placeholder="https://i.ibb.co/..." style={inp} />
          </div>
          <div>
            <label style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 10, color: '#94A3B8', letterSpacing: 2, textTransform: 'uppercase', display: 'block', marginBottom: 5 }}>
              Trip Name
            </label>
            {/* Datalist for autocomplete from existing trips */}
            <input
              list="trip-names-list"
              value={tripName} onChange={e => setTripName(e.target.value)}
              placeholder="e.g. Adrai Trek"
              style={inp}
            />
            <datalist id="trip-names-list">
              {existingTrips.map(t => <option key={t} value={t} />)}
            </datalist>
          </div>
          <button type="submit" disabled={adding} style={{
            background: '#2EC27E', border: 'none', borderRadius: 8,
            padding: '10px 22px', cursor: adding ? 'not-allowed' : 'pointer',
            fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, fontWeight: 700,
            color: '#041a10', whiteSpace: 'nowrap', height: 42,
          }}>
            {adding ? 'Adding…' : '+ Add'}
          </button>
        </form>
        {error && <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 12, color: '#f87171', marginTop: 8 }}>{error}</p>}

        {/* How to get URL tip */}
        <div style={{
          background: 'rgba(56,189,248,0.04)', border: '1px solid rgba(56,189,248,0.08)',
          borderRadius: 8, padding: '10px 14px', marginTop: 14,
          fontFamily: 'Space Grotesk, sans-serif', fontSize: 12, color: '#94A3B8',
        }}>
          💡 Upload to <a href="https://imgbb.com" target="_blank" rel="noopener noreferrer" style={{ color: '#38BDF8' }}>imgbb.com</a> → click image → copy <strong style={{ color: '#F1F5F9' }}>Direct link</strong> → paste above.
        </div>
      </div>

      {/* ── HOW FEATURED WORKS ── */}
      <div style={{
        background: 'rgba(46,194,126,0.04)', border: '1px solid rgba(46,194,126,0.12)',
        borderRadius: 12, padding: '12px 16px', marginBottom: 24,
        fontFamily: 'Space Grotesk, sans-serif', fontSize: 12, color: '#94A3B8', lineHeight: 1.7,
      }}>
        <strong style={{ color: '#2EC27E' }}>⭐ Home Page Control:</strong> Click the star on any photo to feature it on the home gallery.
        Set the <strong style={{ color: '#F1F5F9' }}>order number</strong> (1 = first, 2 = second...) to control where it appears.
        Non-featured photos are only visible in the full <strong style={{ color: '#38BDF8' }}>/gallery</strong> page.
      </div>

      {/* ── TRIP FILTER ── */}
      {tripOrder.length > 1 && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          {['All', ...tripOrder].map(t => (
            <button key={t} onClick={() => setFilterTrip(t)} style={{
              fontFamily: 'Space Grotesk, sans-serif', fontSize: 12, fontWeight: 600,
              padding: '6px 16px', borderRadius: 100, cursor: 'pointer',
              background: filterTrip === t ? '#2EC27E' : '#102A43',
              color: filterTrip === t ? '#041a10' : '#94A3B8',
              border: filterTrip === t ? 'none' : '1px solid rgba(56,189,248,0.1)',
              transition: 'all 0.2s',
            }}>{t}</button>
          ))}
        </div>
      )}

      {/* ── PHOTO GRID by Trip ── */}
      {photos.length === 0 ? (
        <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 14, color: '#475569', textAlign: 'center', padding: 40 }}>
          No photos yet. Add your first one above!
        </p>
      ) : (
        displayedTrips.map(trip => grouped[trip] && (
          <div key={trip} style={{ marginBottom: 40 }}>
            {/* Trip group header */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14,
              paddingBottom: 12, borderBottom: '1px solid rgba(56,189,248,0.07)',
            }}>
              <div style={{ width: 3, height: 24, borderRadius: 2, background: 'linear-gradient(to bottom, #2EC27E, #38BDF8)', flexShrink: 0 }} />
              <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 20, color: '#F1F5F9', letterSpacing: 1 }}>{trip}</span>
              <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, color: '#475569' }}>
                {grouped[trip].length} photos · {grouped[trip].filter(p => p.featured).length} featured
              </span>
            </div>

            {/* Photo cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
              {grouped[trip].map(photo => (
                <div key={photo.id} style={{
                  borderRadius: 12, overflow: 'hidden',
                  background: '#102A43',
                  border: `1px solid ${photo.featured ? 'rgba(46,194,126,0.3)' : 'rgba(56,189,248,0.08)'}`,
                  transition: 'border-color 0.2s',
                  position: 'relative',
                }}>
                  {/* Featured badge */}
                  {photo.featured && (
                    <div style={{
                      position: 'absolute', top: 8, left: 8, zIndex: 2,
                      background: 'rgba(46,194,126,0.9)', borderRadius: 6,
                      padding: '2px 8px', fontFamily: 'Space Grotesk, sans-serif',
                      fontSize: 10, fontWeight: 700, color: '#041a10', letterSpacing: 1,
                    }}>⭐ FEATURED</div>
                  )}

                  {/* Image */}
                  <div style={{ aspectRatio: '4/3', overflow: 'hidden' }}>
                    <img
                      src={photo.url} alt={photo.alt}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      loading="lazy"
                      onError={e => { e.target.parentElement.style.background = '#081120' }}
                    />
                  </div>

                  {/* Controls */}
                  <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {/* Feature toggle + order */}
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      {/* Star / feature toggle */}
                      <button
                        onClick={() => toggleFeatured(photo)}
                        disabled={saving[photo.id]}
                        title={photo.featured ? 'Remove from home page' : 'Add to home page'}
                        style={{
                          background: photo.featured ? 'rgba(46,194,126,0.12)' : 'rgba(56,189,248,0.06)',
                          border: `1px solid ${photo.featured ? 'rgba(46,194,126,0.3)' : 'rgba(56,189,248,0.12)'}`,
                          borderRadius: 7, padding: '6px 10px',
                          color: photo.featured ? '#2EC27E' : '#475569',
                          cursor: 'pointer', fontSize: 14, transition: 'all 0.2s',
                          flexShrink: 0,
                        }}
                      >
                        {saving[photo.id] ? '…' : photo.featured ? '⭐' : '☆'}
                      </button>

                      {/* Order input — only visible when featured */}
                      {photo.featured && (
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 5 }}>
                          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 10, color: '#475569', flexShrink: 0 }}>Pos:</span>
                          <input
                            type="number" min="1" max="99"
                            defaultValue={photo.featuredOrder === 999 ? '' : photo.featuredOrder}
                            onBlur={e => setOrder(photo, e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && setOrder(photo, e.target.value)}
                            placeholder="#"
                            style={{
                              ...inp,
                              padding: '4px 8px', fontSize: 12,
                              width: '100%', textAlign: 'center',
                            }}
                          />
                        </div>
                      )}

                      {!photo.featured && (
                        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, color: '#475569', flex: 1 }}>
                          Click ☆ to feature
                        </span>
                      )}
                    </div>

                    {/* Delete */}
                    <button onClick={() => del(photo.id)} style={{
                      width: '100%', background: 'rgba(239,68,68,0.06)',
                      border: '1px solid rgba(239,68,68,0.15)',
                      borderRadius: 7, padding: '6px',
                      color: '#f87171', fontFamily: 'Space Grotesk, sans-serif',
                      fontSize: 11, cursor: 'pointer', transition: 'all 0.2s',
                    }}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default GalleryTab

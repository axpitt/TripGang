import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getTrips, addTrip, updateTrip, deleteTrip } from '../../lib/firestore'
import { Timestamp } from 'firebase/firestore'

const DIFFICULTY = ['Easy', 'Moderate', 'Hard']
const STATUS = ['open', 'full', 'cancelled']
const TYPE = ['Trek', 'Camping', 'Road Trip', 'Waterfall', 'Night Trek']

const EMPTY = {
  name: '', destination: '', duration: '', distance: '',
  difficulty: 'Moderate', type: 'Trek', status: 'open',
  regularPrice: '', earlyBirdPrice: '', maxSeats: 30, seatsBooked: 0,
  heroImage: '', date: '', earlyBirdDeadline: '',
  photos: [],
  itinerary: [],
  thingsToPack: [],
  thingsToAvoid: [],
  ytLink: '',
}

// ─── Pre-filled Trek Templates ────────────────────────────────────────────────
const TREK_TEMPLATES = [
  {
    _templateId: 'harishchandragad',
    _emoji: '🏔️',
    _tagline: 'Konkan Kada · Kedareshwar Cave · Taramati Peak',
    _badge: 'Moderate',
    _badgeColor: '#FB8500',
    name: 'Harishchandragad Fort Trek',
    destination: 'Ahmednagar, Maharashtra',
    duration: '2 Days 1 Night',
    distance: '14-16 km',
    difficulty: 'Moderate',
    type: 'Trek',
    status: 'open',
    regularPrice: 1999,
    earlyBirdPrice: 1699,
    maxSeats: 30,
    seatsBooked: 0,
    heroImage: '',
    date: '',
    earlyBirdDeadline: '',
    photos: [],
    ytLink: '',
    itinerary: [
      {
        day: 1,
        title: 'Ascent to the Ancient Fort',
        description: 'Pre-dawn departure from Pune/Mumbai. Arrive at Pachnai/Khireshwar base village by morning. Freshen up, have breakfast, then begin the ascent guided by our team. Explore the 6th-century Harishchandreshwar Temple with intricate carvings, the mystical Kedareshwar Cave (Shivling submerged in icy waist-deep water), and the ancient Saptatirtha Pushkarni lake. Afternoon rest on the fort plateau. Walk to iconic Konkan Kada — a 1,000ft+ overhanging concave cliff. Witness the legendary Brocken Spectre optical illusion if conditions allow. Sunset from Konkan Kada — one of the most breathtaking views in Maharashtra. Night camping at fort plateau under the stars.',
      },
      {
        day: 2,
        title: 'Sunrise from Taramati Peak & Descent',
        description: 'Wake up before sunrise and hike to Taramati Peak (1,424m) — the 6th highest point in Maharashtra. Watch a breathtaking 360° panoramic sunrise over the entire Sahyadri range. Return to camp for breakfast. Final exploration of fort ramparts and Nageshwar Temple ruins. Begin descent to base village, enjoy a hearty lunch at the village, and depart for Pune/Mumbai arriving by evening.',
      },
    ],
    thingsToPack: [
      'Sturdy trekking shoes with deep grip (rocky & slippery terrain)',
      'Trekking backpack (30–40L) with rain cover',
      'Water bottles — minimum 2–3 liters',
      'Headlamp/torch with extra batteries (for Taramati sunrise & caves)',
      'Warm jacket or fleece layer (fort nights are cold, Oct–Feb)',
      'Rain poncho or waterproof jacket',
      'Energy snacks — dry fruits, nuts, chocolates, energy bars',
      'First aid kit with personal medicines and blister pads',
      'Trekking pole (helpful for steep descents)',
      'Power bank (no network or electricity at the fort)',
      'Sunscreen SPF 50+ and sunglasses',
      'Aadhaar card or valid ID proof',
      'Sleeping bag (if self-camping)',
      'Offline maps downloaded before departure',
    ],
    thingsToAvoid: [
      'Never approach Konkan Kada edge alone — 1,000ft vertical drop with no railing',
      'Do not trek solo — always go in groups or with a local guide',
      'Avoid sandals or casual footwear — rocky terrain demands proper grip shoes',
      'No littering — Harishchandragad is a protected ecologically sensitive heritage site',
      'Avoid trekking in heavy continuous monsoon rain — rocks flood and become dangerous',
      'Do NOT attempt Nalichi Vaat (Pipe Route) without a professional guide and technical gear',
      'Avoid loud music near the temple — active religious site respected by pilgrims',
      'Avoid weekends on Pachnai route if you prefer peace — it gets very crowded',
    ],
  },
  {
    _templateId: 'aadrai',
    _emoji: '🌿',
    _tagline: 'Kalu Waterfall · Dark Forest · Nageshwar Temple',
    _badge: 'Easy',
    _badgeColor: '#2EC27E',
    name: 'Aadrai Jungle Trek',
    destination: 'Malshej Ghat, Ahmednagar, Maharashtra',
    duration: '1 Day',
    distance: '12-14 km',
    difficulty: 'Easy',
    type: 'Trek',
    status: 'open',
    regularPrice: 999,
    earlyBirdPrice: 799,
    maxSeats: 30,
    seatsBooked: 0,
    heroImage: '',
    date: '',
    earlyBirdDeadline: '',
    photos: [],
    ytLink: '',
    itinerary: [
      {
        day: 1,
        title: 'Into the Dark Forest — Kalu Waterfall & Ancient Caves',
        description: 'Overnight travel from Mumbai/Pune arriving at Khireshwar base village in the early hours. Rest briefly and enjoy local morning tea and breakfast. Trek begins from the Khireshwar trailhead into the dense Aadrai rainforest — a canopy so thick that sunlight barely touches the forest floor, creating an otherworldly atmosphere. Cross multiple seasonal streams and stream crossings. Explore the ancient Rajwada Caves along the trail. Reach the spectacular viewpoint of Kalu Waterfall (~1,200ft multi-tiered cascade) and Aadrai Waterfall. Visit the Sri Kshetra Nageshwar Temple — an ancient stone-carved Shiva shrine on the trail. Enjoy snacks and photography at the viewpoints. Return trek through the jungle. Reach base village for late lunch and depart for home, arriving by evening.',
      },
    ],
    thingsToPack: [
      'Sturdy trekking shoes with excellent grip — non-negotiable for slippery monsoon trails',
      'Rain poncho or raincoat that covers backpack (umbrellas are useless in jungle)',
      'Quick-dry synthetic clothing — long pants + full-sleeve shirt (avoid cotton and jeans)',
      'Extra set of clothes packed in a waterproof zip-lock bag',
      '2–3 liters of water per person',
      'Energy snacks — nuts, dry fruits, energy bars',
      'Personal first-aid kit with bandages, antiseptic, and basic medicines',
      'Leech socks or salt packets (leeches are very common in monsoon forest)',
      'Headlamp or torch (for early morning pre-dawn trek start)',
      'Waterproof backpack or backpack rain cover',
      'Valid ID proof (original + photocopy)',
      'Sufficient cash — no ATMs near Khireshwar village',
    ],
    thingsToAvoid: [
      'Do not wear shorts — long pants protect against leeches, insects, and thorny undergrowth',
      'Avoid cotton clothing and jeans — they become heavy and uncomfortable when wet',
      'Never go near waterfall edges — extremely slippery and dangerous during monsoon',
      'Do not attempt to cross fast-flowing or flooded streams — flash flooding is a real risk',
      'Never trek without a guide — dense forest with no marked trails; fog can disorient even experienced trekkers',
      'No littering or single-use plastic — strict Leave No Trace ethic in the forest zone',
      'No smoking or tobacco inside the forest zone',
      'Do not carry heavy valuables or jewelry — risk of damage from water crossings and falls',
      'Avoid umbrellas — dangerous in forest winds and obstructs path visibility',
    ],
  },
]

// ─── Template Picker Banner (shown only when adding a new trip) ───────────────
const TemplatePicker = ({ onSelect }) => (
  <div style={{
    marginBottom: 24, padding: 16,
    background: 'rgba(46,194,126,0.04)',
    border: '1px solid rgba(46,194,126,0.15)',
    borderRadius: 12,
  }}>
    <p style={{
      fontFamily: 'Space Grotesk, sans-serif', fontSize: 11,
      color: '#2EC27E', letterSpacing: 1.5, textTransform: 'uppercase',
      marginBottom: 10,
    }}>⚡ Quick Templates — Click to Auto-fill</p>
    <div style={{ display: 'flex', gap: 10 }}>
      {TREK_TEMPLATES.map(t => (
        <button
          key={t._templateId}
          type="button"
          onClick={() => onSelect(t)}
          style={{
            flex: 1, textAlign: 'left', cursor: 'pointer',
            background: 'rgba(8,17,32,0.6)',
            border: '1px solid rgba(56,189,248,0.15)',
            borderRadius: 10, padding: '12px 14px',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.border = '1px solid rgba(46,194,126,0.4)'
            e.currentTarget.style.background = 'rgba(46,194,126,0.08)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.border = '1px solid rgba(56,189,248,0.15)'
            e.currentTarget.style.background = 'rgba(8,17,32,0.6)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 20 }}>{t._emoji}</span>
            <span style={{
              fontFamily: 'Space Grotesk, sans-serif', fontSize: 13,
              fontWeight: 700, color: '#F1F5F9',
            }}>{t.name}</span>
            <span style={{
              marginLeft: 'auto',
              fontFamily: 'Space Grotesk, sans-serif', fontSize: 10, fontWeight: 700,
              background: t._badgeColor, color: '#041a10',
              padding: '2px 8px', borderRadius: 100,
            }}>{t._badge}</span>
          </div>
          <p style={{
            fontFamily: 'Inter, sans-serif', fontSize: 11,
            color: '#475569', margin: 0,
          }}>{t._tagline}</p>
        </button>
      ))}
    </div>
  </div>
)

const Field = ({ label, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
    <label style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, color: '#94A3B8', letterSpacing: 1.5, textTransform: 'uppercase' }}>{label}</label>
    {children}
  </div>
)

const inp = {
  background: '#081120', border: '1px solid rgba(56,189,248,0.15)',
  borderRadius: 8, padding: '9px 12px', width: '100%', boxSizing: 'border-box',
  fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, color: '#F1F5F9', outline: 'none',
}

// ─── List editor: add/remove strings ─────────────────────────────────────────
const ListEditor = ({ label, items, onChange, placeholder }) => {
  const [draft, setDraft] = useState('')

  const add = () => {
    if (!draft.trim()) return
    onChange([...items, draft.trim()])
    setDraft('')
  }

  const remove = (i) => onChange(items.filter((_, idx) => idx !== i))

  return (
    <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <label style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, color: '#94A3B8', letterSpacing: 1.5, textTransform: 'uppercase' }}>{label}</label>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          style={{ ...inp, flex: 1 }}
          placeholder={placeholder}
          value={draft} onChange={e => setDraft(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())}
        />
        <button type="button" onClick={add} style={{
          background: 'rgba(46,194,126,0.12)', border: '1px solid rgba(46,194,126,0.2)',
          borderRadius: 8, padding: '9px 16px', color: '#2EC27E',
          fontFamily: 'Space Grotesk, sans-serif', fontSize: 12, cursor: 'pointer', flexShrink: 0,
        }}>+ Add</button>
      </div>
      {items.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
          {items.map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.12)',
              borderRadius: 6, padding: '4px 10px',
              fontFamily: 'Space Grotesk, sans-serif', fontSize: 12, color: '#94A3B8',
              maxWidth: '100%',
            }}>
              <span style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item}</span>
              <button type="button" onClick={() => remove(i)} style={{
                background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: 12, padding: 0, lineHeight: 1, flexShrink: 0,
              }}>✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Itinerary editor: add day+title+description objects ─────────────────────
const ItineraryEditor = ({ items, onChange }) => {
  const [draft, setDraft] = useState({ day: '', title: '', description: '' })

  const add = () => {
    if (!draft.description.trim()) return
    onChange([...items, { ...draft, day: draft.day || items.length + 1 }])
    setDraft({ day: '', title: '', description: '' })
  }

  const remove = (i) => onChange(items.filter((_, idx) => idx !== i))

  return (
    <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <label style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, color: '#94A3B8', letterSpacing: 1.5, textTransform: 'uppercase' }}>Full Itinerary (Day by Day)</label>
      <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 2fr', gap: 8, alignItems: 'end' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 10, color: '#475569' }}>Day #</label>
          <input style={inp} placeholder="1" type="number" value={draft.day} onChange={e => setDraft(d => ({ ...d, day: e.target.value }))} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 10, color: '#475569' }}>Title</label>
          <input style={inp} placeholder="Arrival & base camp" value={draft.title} onChange={e => setDraft(d => ({ ...d, title: e.target.value }))} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 10, color: '#475569' }}>Description</label>
          <div style={{ display: 'flex', gap: 6 }}>
            <input style={{ ...inp, flex: 1 }} placeholder="What happens this day..." value={draft.description} onChange={e => setDraft(d => ({ ...d, description: e.target.value }))} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())} />
            <button type="button" onClick={add} style={{ background: 'rgba(46,194,126,0.12)', border: '1px solid rgba(46,194,126,0.2)', borderRadius: 8, padding: '9px 12px', color: '#2EC27E', fontFamily: 'Space Grotesk, sans-serif', fontSize: 12, cursor: 'pointer', flexShrink: 0 }}>+</button>
          </div>
        </div>
      </div>
      {items.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
          {items.map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', background: 'rgba(56,189,248,0.04)', border: '1px solid rgba(56,189,248,0.08)', borderRadius: 8, padding: '8px 12px' }}>
              <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 14, color: '#2EC27E', minWidth: 40 }}>DAY {item.day}</div>
              <div style={{ flex: 1 }}>
                {item.title && <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 12, fontWeight: 600, color: '#F1F5F9', marginBottom: 2 }}>{item.title}</div>}
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#94A3B8' }}>{item.description}</div>
              </div>
              <button type="button" onClick={() => remove(i)} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: 14, padding: 0 }}>✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Trip Modal ───────────────────────────────────────────────────────────────
const TripModal = ({ trip, onSave, onClose }) => {
  const [form, setForm] = useState(trip ? {
    ...EMPTY,
    ...trip,
    date: trip.date?.toDate ? trip.date.toDate().toISOString().slice(0, 10) : '',
    earlyBirdDeadline: trip.earlyBirdDeadline?.toDate ? trip.earlyBirdDeadline.toDate().toISOString().slice(0, 10) : '',
    photos: Array.isArray(trip.photos) ? trip.photos : [],
    itinerary: Array.isArray(trip.itinerary) ? trip.itinerary : [],
    thingsToPack: Array.isArray(trip.thingsToPack) ? trip.thingsToPack : [],
    thingsToAvoid: Array.isArray(trip.thingsToAvoid) ? trip.thingsToAvoid : [],
    ytLink: trip.ytLink || '',
  } : { ...EMPTY })
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('basic') // basic | media | details

  const applyTemplate = (t) => {
    const { _templateId, _emoji, _tagline, _badge, _badgeColor, ...data } = t
    setForm(f => ({ ...f, ...data }))
    setActiveTab('basic')
  }

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    const data = {
      ...form,
      regularPrice: Number(form.regularPrice),
      earlyBirdPrice: Number(form.earlyBirdPrice),
      maxSeats: Number(form.maxSeats),
      seatsBooked: Number(form.seatsBooked),
      date: form.date ? Timestamp.fromDate(new Date(form.date)) : null,
      earlyBirdDeadline: form.earlyBirdDeadline ? Timestamp.fromDate(new Date(form.earlyBirdDeadline)) : null,
    }
    if (trip?.id) await updateTrip(trip.id, data)
    else await addTrip(data)
    setSaving(false)
    onSave()
  }

  const tabStyle = (t) => ({
    background: activeTab === t ? 'rgba(46,194,126,0.12)' : 'transparent',
    border: activeTab === t ? '1px solid rgba(46,194,126,0.25)' : '1px solid transparent',
    borderRadius: 7, padding: '7px 16px',
    fontFamily: 'Space Grotesk, sans-serif', fontSize: 12, fontWeight: 600,
    color: activeTab === t ? '#2EC27E' : '#475569', cursor: 'pointer',
    transition: 'all 0.2s',
  })

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(8,17,32,0.92)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, backdropFilter: 'blur(8px)',
    }} onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: '#102A43', border: '1px solid rgba(56,189,248,0.15)',
          borderRadius: 16, padding: 28, width: '100%', maxWidth: 720,
          maxHeight: '90vh', overflowY: 'auto',
        }}
      >
        <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 24, color: '#F1F5F9', marginBottom: 20, letterSpacing: 1 }}>
          {trip ? 'Edit Trip' : 'Add New Trip'}
        </h3>

        {/* Template picker — only shown when creating a new trip */}
        {!trip && <TemplatePicker onSelect={applyTemplate} />}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, borderBottom: '1px solid rgba(56,189,248,0.08)', paddingBottom: 16 }}>
          <button type="button" style={tabStyle('basic')} onClick={() => setActiveTab('basic')}>Basic Info</button>
          <button type="button" style={tabStyle('media')} onClick={() => setActiveTab('media')}>Photos & Video</button>
          <button type="button" style={tabStyle('details')} onClick={() => setActiveTab('details')}>Itinerary & Packing</button>
        </div>

        <form onSubmit={submit}>
          {/* ── BASIC INFO TAB ── */}
          {activeTab === 'basic' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Field label="Trip Name"><input style={inp} value={form.name} onChange={e => set('name', e.target.value)} required /></Field>
              <Field label="Destination"><input style={inp} value={form.destination} onChange={e => set('destination', e.target.value)} /></Field>
              <Field label="Trip Date"><input style={inp} type="date" value={form.date} onChange={e => set('date', e.target.value)} required /></Field>
              <Field label="Early Bird Deadline"><input style={inp} type="date" value={form.earlyBirdDeadline} onChange={e => set('earlyBirdDeadline', e.target.value)} /></Field>
              <Field label="Duration"><input style={inp} placeholder="2 Days 1 Night" value={form.duration} onChange={e => set('duration', e.target.value)} /></Field>
              <Field label="Distance"><input style={inp} placeholder="12 km" value={form.distance} onChange={e => set('distance', e.target.value)} /></Field>
              <Field label="Regular Price (₹)"><input style={inp} type="number" value={form.regularPrice} onChange={e => set('regularPrice', e.target.value)} /></Field>
              <Field label="Early Bird Price (₹)"><input style={inp} type="number" value={form.earlyBirdPrice} onChange={e => set('earlyBirdPrice', e.target.value)} /></Field>
              <Field label="Max Seats"><input style={inp} type="number" value={form.maxSeats} onChange={e => set('maxSeats', e.target.value)} /></Field>
              <Field label="Seats Booked"><input style={inp} type="number" value={form.seatsBooked} onChange={e => set('seatsBooked', e.target.value)} /></Field>
              <Field label="Difficulty">
                <select style={inp} value={form.difficulty} onChange={e => set('difficulty', e.target.value)}>
                  {DIFFICULTY.map(d => <option key={d}>{d}</option>)}
                </select>
              </Field>
              <Field label="Type">
                <select style={inp} value={form.type} onChange={e => set('type', e.target.value)}>
                  {TYPE.map(t => <option key={t}>{t}</option>)}
                </select>
              </Field>
              <Field label="Status">
                <select style={inp} value={form.status} onChange={e => set('status', e.target.value)}>
                  {STATUS.map(s => <option key={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="Hero Image URL"><input style={inp} placeholder="https://..." value={form.heroImage} onChange={e => set('heroImage', e.target.value)} /></Field>
            </div>
          )}

          {/* ── MEDIA TAB ── */}
          {activeTab === 'media' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <Field label="YouTube Preview Link (optional)">
                <input style={inp} placeholder="https://youtube.com/watch?v=..." value={form.ytLink} onChange={e => set('ytLink', e.target.value)} />
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#475569', marginTop: 4 }}>
                  This will be shown as an embedded video on the trip page for destination reference.
                </span>
              </Field>
              <ListEditor
                label="Trip Photo URLs (gallery)"
                items={form.photos}
                onChange={v => set('photos', v)}
                placeholder="https://... paste image URL"
              />
              {/* Photo preview */}
              {form.photos.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 8 }}>
                  {form.photos.map((url, i) => (
                    <div key={i} style={{ borderRadius: 8, overflow: 'hidden', aspectRatio: '1' }}>
                      <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── ITINERARY & PACKING TAB ── */}
          {activeTab === 'details' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <ItineraryEditor items={form.itinerary} onChange={v => set('itinerary', v)} />
              <div style={{ height: 1, background: 'rgba(56,189,248,0.08)' }} />
              <ListEditor
                label="Things to Pack ✅"
                items={form.thingsToPack}
                onChange={v => set('thingsToPack', v)}
                placeholder="e.g. Rain jacket, trekking shoes, water bottle..."
              />
              <div style={{ height: 1, background: 'rgba(56,189,248,0.08)' }} />
              <ListEditor
                label="Things to Avoid ❌"
                items={form.thingsToAvoid}
                onChange={v => set('thingsToAvoid', v)}
                placeholder="e.g. Heels, heavy luggage, alcohol..."
              />
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(56,189,248,0.08)' }}>
            <button type="button" onClick={onClose} style={{
              background: 'transparent', border: '1px solid rgba(56,189,248,0.2)',
              borderRadius: 8, padding: '10px 20px', color: '#94A3B8',
              fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, cursor: 'pointer',
            }}>Cancel</button>
            <button type="submit" disabled={saving} style={{
              background: '#2EC27E', border: 'none', borderRadius: 8,
              padding: '10px 24px', color: '#041a10',
              fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, fontWeight: 700, cursor: 'pointer',
            }}>{saving ? 'Saving…' : 'Save Trip'}</button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

// ─── Trips Tab ────────────────────────────────────────────────────────────────
const TripsTab = () => {
  const [trips, setTrips] = useState([])
  const [modal, setModal] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = async () => { setLoading(true); setTrips(await getTrips()); setLoading(false) }
  useEffect(() => { load() }, [])

  const del = async (id) => {
    if (!confirm('Delete this trip?')) return
    await deleteTrip(id); load()
  }

  const diffColor = { Easy: '#2EC27E', Moderate: '#FB8500', Hard: '#ef4444' }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 28, color: '#F1F5F9', letterSpacing: 1 }}>TRIPS</h2>
        <button onClick={() => setModal('add')} style={{
          background: '#2EC27E', border: 'none', borderRadius: 8, padding: '10px 20px',
          fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, fontWeight: 700,
          color: '#041a10', cursor: 'pointer',
        }}>+ Add Trip</button>
      </div>

      {loading ? <p style={{ color: '#475569', fontFamily: 'Space Grotesk, sans-serif' }}>Loading…</p> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {trips.map(trip => (
            <div key={trip.id} style={{
              background: '#102A43', border: '1px solid rgba(27,59,90,0.9)',
              borderRadius: 14, overflow: 'hidden',
            }}>
              {trip.heroImage && <img src={trip.heroImage} alt="" style={{ width: '100%', height: 130, objectFit: 'cover' }} />}
              {!trip.heroImage && <div style={{ height: 130, background: '#081120', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>🏔️</div>}
              <div style={{ padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 15, fontWeight: 700, color: '#F1F5F9' }}>{trip.name}</h3>
                  <span style={{
                    fontFamily: 'Space Grotesk, sans-serif', fontSize: 10, fontWeight: 700,
                    background: diffColor[trip.difficulty] || '#2EC27E', color: '#041a10',
                    padding: '2px 8px', borderRadius: 100,
                  }}>{trip.difficulty}</span>
                </div>
                <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 12, color: '#475569', marginBottom: 4 }}>
                  📍 {trip.destination} · {trip.duration}
                </p>
                <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, color: '#2EC27E', fontWeight: 700, marginBottom: 4 }}>
                  ₹{trip.earlyBirdPrice?.toLocaleString()} <span style={{ color: '#475569', fontWeight: 400, fontSize: 12 }}>/ ₹{trip.regularPrice?.toLocaleString()}</span>
                </p>
                {/* Quick summary of new fields */}
                <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, color: '#475569', marginBottom: 12 }}>
                  📸 {trip.photos?.length || 0} photos · 🗓 {trip.itinerary?.length || 0} days ·{' '}
                  <span style={{ color: trip.status === 'open' ? '#2EC27E' : '#ef4444' }}>{trip.status}</span>
                </p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => setModal(trip)} style={{
                    flex: 1, background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.15)',
                    borderRadius: 7, padding: '8px', color: '#38BDF8',
                    fontFamily: 'Space Grotesk, sans-serif', fontSize: 12, cursor: 'pointer',
                  }}>Edit</button>
                  <button onClick={() => del(trip.id)} style={{
                    flex: 1, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)',
                    borderRadius: 7, padding: '8px', color: '#f87171',
                    fontFamily: 'Space Grotesk, sans-serif', fontSize: 12, cursor: 'pointer',
                  }}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {modal && (
          <TripModal
            trip={modal === 'add' ? null : modal}
            onSave={() => { setModal(null); load() }}
            onClose={() => setModal(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default TripsTab

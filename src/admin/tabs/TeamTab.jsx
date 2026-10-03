import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { getTeam, addTeamMember, updateTeamMember, deleteTeamMember } from '../../lib/firestore'

const ROLES = ['Founder & Trip Organizer', 'Co-Organizer', 'Female Coordinator', 'Social Media Manager', 'Guide', 'Volunteer']

const inp = {
  background: '#081120', border: '1px solid rgba(56,189,248,0.15)',
  borderRadius: 8, padding: '9px 12px', width: '100%', boxSizing: 'border-box',
  fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, color: '#F1F5F9', outline: 'none',
}

const EMPTY = { name: '', role: '', bio: '', phone: '', photo: '', order: 99 }

const MemberModal = ({ member, onSave, onClose }) => {
  const [form, setForm] = useState(member || { ...EMPTY })
  const [saving, setSaving] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const submit = async (e) => {
    e.preventDefault(); setSaving(true)
    const data = { ...form, order: Number(form.order) }
    if (member?.id) await updateTeamMember(member.id, data)
    else await addTeamMember(data)
    setSaving(false); onSave()
  }

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
          borderRadius: 16, padding: 28, width: '100%', maxWidth: 480,
        }}
      >
        <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 24, color: '#F1F5F9', marginBottom: 20, letterSpacing: 1 }}>
          {member ? 'Edit Member' : 'Add Member'}
        </h3>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
          {[
            { label: 'Full Name', key: 'name', type: 'text', required: true },
            { label: 'Phone', key: 'phone', type: 'tel' },
            { label: 'Photo URL', key: 'photo', type: 'url', placeholder: 'https://...' },
            { label: 'Display Order', key: 'order', type: 'number' },
          ].map(({ label, key, type, required, placeholder }) => (
            <div key={key}>
              <label style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, color: '#94A3B8', letterSpacing: 1.5, textTransform: 'uppercase', display: 'block', marginBottom: 5 }}>{label}</label>
              <input style={inp} type={type} value={form[key]} required={required} placeholder={placeholder}
                onChange={e => set(key, e.target.value)} />
            </div>
          ))}
          <div>
            <label style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, color: '#94A3B8', letterSpacing: 1.5, textTransform: 'uppercase', display: 'block', marginBottom: 5 }}>Role</label>
            <select style={inp} value={form.role} onChange={e => set('role', e.target.value)}>
              <option value="">Select role…</option>
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              <option value="custom">Custom…</option>
            </select>
          </div>
          <div>
            <label style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, color: '#94A3B8', letterSpacing: 1.5, textTransform: 'uppercase', display: 'block', marginBottom: 5 }}>Bio</label>
            <textarea style={{ ...inp, resize: 'vertical', minHeight: 80 }} value={form.bio} onChange={e => set('bio', e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <button type="button" onClick={onClose} style={{
              background: 'transparent', border: '1px solid rgba(56,189,248,0.2)',
              borderRadius: 8, padding: '9px 18px', color: '#94A3B8',
              fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, cursor: 'pointer',
            }}>Cancel</button>
            <button type="submit" disabled={saving} style={{
              background: '#2EC27E', border: 'none', borderRadius: 8,
              padding: '9px 22px', color: '#041a10',
              fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, fontWeight: 700, cursor: 'pointer',
            }}>{saving ? 'Saving…' : 'Save'}</button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

const ACCENT = ['#2EC27E', '#38BDF8', '#FB8500', '#2EC27E']

const TeamTab = () => {
  const [team, setTeam] = useState([])
  const [modal, setModal] = useState(null)

  const load = async () => setTeam(await getTeam())
  useEffect(() => { load() }, [])

  const del = async (id) => {
    if (!confirm('Remove member?')) return
    await deleteTeamMember(id); load()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 28, color: '#F1F5F9', letterSpacing: 1 }}>TEAM</h2>
        <button onClick={() => setModal('add')} style={{
          background: '#2EC27E', border: 'none', borderRadius: 8, padding: '10px 20px',
          fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, fontWeight: 700, color: '#041a10', cursor: 'pointer',
        }}>+ Add Member</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
        {[...team].sort((a, b) => (a.order || 0) - (b.order || 0)).map((m, i) => {
          const initials = m.name.split(' ').map(n => n[0]).join('').slice(0, 2)
          const accent = ACCENT[i % ACCENT.length]
          return (
            <div key={m.id} style={{
              background: '#102A43', border: '1px solid rgba(27,59,90,0.9)',
              borderRadius: 14, padding: 18,
            }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%', border: `2px solid ${accent}`,
                  background: m.photo ? 'transparent' : `${accent}18`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden',
                }}>
                  {m.photo
                    ? <img src={m.photo} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 18, color: accent }}>{initials}</span>}
                </div>
                <div>
                  <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 14, fontWeight: 700, color: '#F1F5F9' }}>{m.name}</p>
                  <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 10, color: accent, letterSpacing: 1, textTransform: 'uppercase' }}>{m.role}</p>
                </div>
              </div>
              {m.bio && <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#475569', lineHeight: 1.6, marginBottom: 12 }}>{m.bio.slice(0, 80)}{m.bio.length > 80 ? '…' : ''}</p>}
              {m.phone && <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, color: '#25d366', marginBottom: 12 }}>📱 {m.phone}</p>}
              <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 10, color: '#1B3B5A', marginBottom: 12 }}>Order: {m.order}</p>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setModal(m)} style={{
                  flex: 1, background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.15)',
                  borderRadius: 7, padding: '7px', color: '#38BDF8',
                  fontFamily: 'Space Grotesk, sans-serif', fontSize: 12, cursor: 'pointer',
                }}>Edit</button>
                <button onClick={() => del(m.id)} style={{
                  flex: 1, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)',
                  borderRadius: 7, padding: '7px', color: '#f87171',
                  fontFamily: 'Space Grotesk, sans-serif', fontSize: 12, cursor: 'pointer',
                }}>Delete</button>
              </div>
            </div>
          )
        })}
      </div>

      <AnimatePresence>
        {modal && (
          <MemberModal
            member={modal === 'add' ? null : modal}
            onSave={() => { setModal(null); load() }}
            onClose={() => setModal(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default TeamTab

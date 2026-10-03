import { useState, useEffect } from 'react'
import { getLeads, updateLead } from '../../lib/firestore'

const LeadsTab = () => {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all | contacted | pending

  const load = async () => {
    setLoading(true)
    setLeads(await getLeads())
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const toggleContacted = async (lead) => {
    await updateLead(lead.id, { contacted: !lead.contacted })
    setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, contacted: !l.contacted } : l))
  }

  const filtered = leads.filter(l => {
    if (filter === 'contacted') return l.contacted
    if (filter === 'pending') return !l.contacted
    return true
  })

  const fmtDate = (ts) => {
    if (!ts?.toDate) return '—'
    return ts.toDate().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 28, color: '#F1F5F9', letterSpacing: 1 }}>LEADS</h2>
          <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 12, color: '#475569', marginTop: 2 }}>
            {leads.length} total · {leads.filter(l => !l.contacted).length} pending
          </p>
        </div>
        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 6 }}>
          {['all', 'pending', 'contacted'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, fontWeight: 600,
              padding: '7px 14px', borderRadius: 100, cursor: 'pointer',
              textTransform: 'capitalize', letterSpacing: 0.5,
              background: filter === f ? '#2EC27E' : '#102A43',
              color: filter === f ? '#041a10' : '#94A3B8',
              border: filter === f ? 'none' : '1px solid rgba(56,189,248,0.1)',
              transition: 'all 0.2s',
            }}>{f}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <p style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#475569', textAlign: 'center', padding: 40 }}>Loading…</p>
      ) : filtered.length === 0 ? (
        <p style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#475569', textAlign: 'center', padding: 40 }}>No leads found.</p>
      ) : (
        <>
          {/* Desktop table */}
          <div className="leads-table-wrap" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Name', 'Phone', 'Trip', 'Received', 'Contacted'].map(h => (
                    <th key={h} style={{
                      fontFamily: 'Space Grotesk, sans-serif', fontSize: 10, color: '#475569',
                      letterSpacing: 2, textTransform: 'uppercase', textAlign: 'left',
                      padding: '10px 14px', borderBottom: '1px solid rgba(27,59,90,0.8)',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((lead, i) => (
                  <tr key={lead.id} style={{
                    background: i % 2 === 0 ? 'transparent' : 'rgba(16,42,67,0.3)',
                    transition: 'background 0.15s',
                  }}>
                    <td style={{ padding: '12px 14px' }}>
                      <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, fontWeight: 600, color: '#F1F5F9' }}>{lead.name || '—'}</p>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <a href={`https://wa.me/91${lead.phone}`} target="_blank" rel="noopener noreferrer"
                        style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, color: '#25d366', textDecoration: 'none' }}>
                        {lead.phone || '—'}
                      </a>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 12, color: '#38BDF8' }}>{lead.tripName || lead.tripId || '—'}</p>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, color: '#475569' }}>{fmtDate(lead.createdAt)}</p>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <button onClick={() => toggleContacted(lead)} style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        background: lead.contacted ? 'rgba(46,194,126,0.12)' : 'rgba(251,133,0,0.1)',
                        border: `1px solid ${lead.contacted ? 'rgba(46,194,126,0.3)' : 'rgba(251,133,0,0.25)'}`,
                        borderRadius: 100, padding: '5px 12px', cursor: 'pointer',
                        fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, fontWeight: 600,
                        color: lead.contacted ? '#2EC27E' : '#FB8500',
                        transition: 'all 0.2s',
                      }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
                        {lead.contacted ? 'Done' : 'Pending'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="leads-mobile-cards" style={{ display: 'none', flexDirection: 'column', gap: 10 }}>
            {filtered.map(lead => (
              <div key={lead.id} style={{
                background: '#102A43', border: '1px solid rgba(27,59,90,0.9)',
                borderRadius: 12, padding: 16,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div>
                    <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 14, fontWeight: 700, color: '#F1F5F9' }}>{lead.name || '—'}</p>
                    <a href={`https://wa.me/91${lead.phone}`} target="_blank" rel="noopener noreferrer"
                      style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 12, color: '#25d366', textDecoration: 'none' }}>
                      {lead.phone}
                    </a>
                  </div>
                  <button onClick={() => toggleContacted(lead)} style={{
                    background: lead.contacted ? 'rgba(46,194,126,0.12)' : 'rgba(251,133,0,0.1)',
                    border: `1px solid ${lead.contacted ? 'rgba(46,194,126,0.3)' : 'rgba(251,133,0,0.25)'}`,
                    borderRadius: 100, padding: '5px 12px', cursor: 'pointer',
                    fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, fontWeight: 600,
                    color: lead.contacted ? '#2EC27E' : '#FB8500',
                  }}>
                    {lead.contacted ? '✓ Done' : '○ Pending'}
                  </button>
                </div>
                <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, color: '#38BDF8' }}>{lead.tripName || lead.tripId}</p>
                <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 10, color: '#475569', marginTop: 4 }}>{fmtDate(lead.createdAt)}</p>
              </div>
            ))}
          </div>
        </>
      )}

      <style>{`
        @media (max-width: 640px) {
          .leads-table-wrap { display: none !important; }
          .leads-mobile-cards { display: flex !important; }
        }
      `}</style>
    </div>
  )
}

export default LeadsTab

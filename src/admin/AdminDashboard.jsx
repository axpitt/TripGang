import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAdminAuth } from './useAdminAuth'
import TripsTab from './tabs/TripsTab'
import GalleryTab from './tabs/GalleryTab'
import TeamTab from './tabs/TeamTab'
import LeadsTab from './tabs/LeadsTab'
import logoImg from '../assets/logo.png'

const TABS = [
  { id: 'trips',   label: 'Trips',   icon: '🏔️' },
  { id: 'gallery', label: 'Gallery', icon: '📸' },
  { id: 'team',    label: 'Team',    icon: '👥' },
  { id: 'leads',   label: 'Leads',   icon: '📋' },
]

const AdminDashboard = () => {
  const { user, signOut } = useAdminAuth()
  const [active, setActive] = useState('trips')
  const [menuOpen, setMenuOpen] = useState(false)

  const tabMap = { trips: <TripsTab />, gallery: <GalleryTab />, team: <TeamTab />, leads: <LeadsTab /> }

  return (
    <div style={{
      minHeight: '100vh', background: '#081120',
      display: 'flex', flexDirection: 'column',
      fontFamily: 'Satoshi, sans-serif',
    }}>

      {/* ── Top Bar ────────────────────────────────────────────── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(8,17,32,0.95)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(56,189,248,0.08)',
        padding: '0 28px', height: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img
            src={logoImg}
            alt="TripGang Logo"
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              objectFit: 'cover',
              border: '1.5px solid rgba(46,194,126,0.5)',
            }}
          />
          <div style={{ fontFamily: 'Clash Display, sans-serif', fontSize: 24, letterSpacing: 3, lineHeight: 1 }}>
            <span style={{ color: '#F1F5F9' }}>TRIP</span>
            <span style={{ color: '#2EC27E' }}>GANG</span>
            <span style={{ fontFamily: 'Satoshi, sans-serif', fontSize: 10, color: '#475569', letterSpacing: 2, marginLeft: 10, textTransform: 'uppercase', verticalAlign: 'middle' }}>Admin</span>
          </div>
        </div>

        {/* Desktop tabs */}
        <nav className="admin-nav-desktop" style={{ display: 'flex', gap: 4 }}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActive(tab.id)} style={{
              background: active === tab.id ? 'rgba(46,194,126,0.12)' : 'transparent',
              border: active === tab.id ? '1px solid rgba(46,194,126,0.25)' : '1px solid transparent',
              borderRadius: 8, padding: '7px 16px', cursor: 'pointer',
              fontFamily: 'Satoshi, sans-serif', fontSize: 13, fontWeight: active === tab.id ? 700 : 400,
              color: active === tab.id ? '#2EC27E' : '#94A3B8',
              transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <span>{tab.icon}</span>{tab.label}
            </button>
          ))}
        </nav>

        {/* Right — user + signout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 11, color: '#475569', display: 'none' }} className="admin-email">{user?.email}</span>
          <button onClick={signOut} style={{
            background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: 8, padding: '7px 14px', cursor: 'pointer',
            fontFamily: 'Satoshi, sans-serif', fontSize: 12, color: '#f87171',
            transition: 'all 0.2s',
          }}>Sign Out</button>
          {/* Mobile menu button */}
          <button onClick={() => setMenuOpen(o => !o)} className="admin-menu-btn" style={{
            display: 'none', background: 'none', border: 'none',
            color: '#94A3B8', fontSize: 22, cursor: 'pointer', padding: 4,
          }}>☰</button>
        </div>
      </header>

      {/* Mobile dropdown nav */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
            style={{
              background: '#102A43', borderBottom: '1px solid rgba(56,189,248,0.08)',
              overflow: 'hidden',
            }}
          >
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => { setActive(tab.id); setMenuOpen(false) }} style={{
                display: 'flex', width: '100%', alignItems: 'center', gap: 10,
                background: active === tab.id ? 'rgba(46,194,126,0.1)' : 'transparent',
                border: 'none', padding: '14px 24px', cursor: 'pointer',
                fontFamily: 'Satoshi, sans-serif', fontSize: 14,
                color: active === tab.id ? '#2EC27E' : '#94A3B8',
                borderLeft: active === tab.id ? '3px solid #2EC27E' : '3px solid transparent',
              }}>
                <span>{tab.icon}</span>{tab.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Content ───────────────────────────────────────── */}
      <main style={{ flex: 1, padding: '32px 28px', maxWidth: 1200, width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            {tabMap[active]}
          </motion.div>
        </AnimatePresence>
      </main>

      <style>{`
        @media (max-width: 768px) {
          .admin-nav-desktop { display: none !important; }
          .admin-menu-btn { display: block !important; }
          .admin-email { display: block !important; }
        }
        @media (min-width: 769px) {
          .admin-email { display: block !important; }
        }
      `}</style>
    </div>
  )
}

export default AdminDashboard




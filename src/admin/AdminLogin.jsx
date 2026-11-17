import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAdminAuth } from './useAdminAuth'
import logoImg from '../assets/logo.png'

const AdminLogin = () => {
  const { signIn, error } = useAdminAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await signIn(email, password)
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#081120',
      backgroundImage: 'radial-gradient(ellipse at 30% 20%, rgba(46,194,126,0.07) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(56,189,248,0.07) 0%, transparent 50%)',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: '100%', maxWidth: 420,
          background: 'rgba(16,42,67,0.9)',
          border: '1px solid rgba(56,189,248,0.12)',
          borderRadius: 20, padding: '48px 40px',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.4)',
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <img
            src={logoImg}
            alt="TripGang Logo"
            style={{
              width: 68,
              height: 68,
              borderRadius: '50%',
              objectFit: 'cover',
              margin: '0 auto 14px',
              display: 'block',
              border: '2px solid rgba(46,194,126,0.5)',
              boxShadow: '0 0 24px rgba(46,194,126,0.25)',
            }}
          />
          <div style={{
            fontFamily: 'Clash Display, sans-serif', fontSize: 36, letterSpacing: 4, marginBottom: 6,
          }}>
            <span style={{ color: '#F1F5F9' }}>TRIP</span>
            <span style={{ color: '#2EC27E' }}>GANG</span>
          </div>
          <p style={{
            fontFamily: 'Satoshi, sans-serif', fontSize: 11,
            color: '#475569', letterSpacing: 3, textTransform: 'uppercase',
          }}>Admin Portal</p>
        </div>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Email */}
          <div>
            <label style={{ fontFamily: 'Satoshi, sans-serif', fontSize: 11, color: '#94A3B8', letterSpacing: 1.5, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
              Email
            </label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              required autoComplete="username"
              placeholder="admin@tripgang.in"
              style={{
                width: '100%', boxSizing: 'border-box',
                background: '#081120', border: '1px solid rgba(56,189,248,0.15)',
                borderRadius: 10, padding: '12px 16px',
                fontFamily: 'Satoshi, sans-serif', fontSize: 14, color: '#F1F5F9',
                outline: 'none', transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(56,189,248,0.5)'}
              onBlur={e => e.target.style.borderColor = 'rgba(56,189,248,0.15)'}
            />
          </div>

          {/* Password */}
          <div>
            <label style={{ fontFamily: 'Satoshi, sans-serif', fontSize: 11, color: '#94A3B8', letterSpacing: 1.5, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPw ? 'text' : 'password'} value={password}
                onChange={e => setPassword(e.target.value)}
                required autoComplete="current-password"
                placeholder="••••••••"
                style={{
                  width: '100%', boxSizing: 'border-box',
                  background: '#081120', border: '1px solid rgba(56,189,248,0.15)',
                  borderRadius: 10, padding: '12px 44px 12px 16px',
                  fontFamily: 'Satoshi, sans-serif', fontSize: 14, color: '#F1F5F9',
                  outline: 'none', transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(56,189,248,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(56,189,248,0.15)'}
              />
              <button type="button" onClick={() => setShowPw(p => !p)} style={{
                position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#475569', fontSize: 16, padding: 0, lineHeight: 1,
              }}>
                {showPw ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
              borderRadius: 8, padding: '10px 14px',
              fontFamily: 'Satoshi, sans-serif', fontSize: 13, color: '#f87171',
            }}>
              {error}
            </div>
          )}

          {/* Submit */}
          <motion.button
            type="submit" disabled={loading}
            whileHover={!loading ? { scale: 1.02 } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
            style={{
              marginTop: 8,
              background: loading ? '#1B3B5A' : 'linear-gradient(135deg, #2EC27E 0%, #22a76b 100%)',
              border: 'none', borderRadius: 10,
              padding: '14px', cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'Satoshi, sans-serif', fontSize: 14, fontWeight: 700,
              color: loading ? '#475569' : '#041a10',
              letterSpacing: 0.5, transition: 'background 0.3s',
            }}
          >
            {loading ? 'Signing in…' : 'Sign In →'}
          </motion.button>
        </form>

        <p style={{
          fontFamily: 'Satoshi, sans-serif', fontSize: 11,
          color: '#1B3B5A', textAlign: 'center', marginTop: 24, letterSpacing: 0.5,
        }}>
          Authorized personnel only
        </p>
      </motion.div>
    </div>
  )
}

export default AdminLogin




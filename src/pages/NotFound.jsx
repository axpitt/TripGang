import { Link } from 'react-router-dom'

const NotFound = () => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: 24,
    textAlign: 'center',
    padding: 24
  }}>
    <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(60px,10vw,120px)', color: '#a8ff3e', lineHeight: 1 }}>404</h1>
    <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 24, color: 'white' }}>Looks like you got lost in the jungle...</h2>
    <p style={{ color: '#a0a0a0', maxWidth: 400 }}>The trail you're looking for doesn't exist. Let's get you back to base camp.</p>
    <Link to="/" style={{ color: '#0a0a0a', background: '#a8ff3e', padding: '12px 28px', borderRadius: 8, fontFamily: 'Space Grotesk', fontWeight: 700, textDecoration: 'none' }}>
      Back to Base Camp
    </Link>
  </div>
)
export default NotFound

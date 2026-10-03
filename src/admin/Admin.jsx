import { useAdminAuth } from './useAdminAuth'
import AdminLogin from './AdminLogin'
import AdminDashboard from './AdminDashboard'

const Admin = () => {
  const { user } = useAdminAuth()

  // Still checking auth state
  if (user === undefined) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#081120',
      }}>
        <div style={{
          fontFamily: 'Bebas Neue, sans-serif', fontSize: 32,
          color: '#2EC27E', letterSpacing: 4,
          animation: 'pulse 1.5s ease-in-out infinite',
        }}>
          TRIPGANG
        </div>
        <style>{`
          @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        `}</style>
      </div>
    )
  }

  // Not logged in → show login
  if (!user) return <AdminLogin />

  // Authenticated → show dashboard
  return <AdminDashboard />
}

export default Admin

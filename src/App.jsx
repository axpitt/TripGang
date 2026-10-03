import { Routes, Route, useLocation } from 'react-router-dom'
import { lazy, Suspense } from 'react'

// Public pages
const Home = lazy(() => import('./pages/Home'))
const TripDetail = lazy(() => import('./pages/TripDetail'))
const GalleryPage = lazy(() => import('./pages/GalleryPage'))
const CancellationPolicy = lazy(() => import('./pages/CancellationPolicy'))
const NotFound = lazy(() => import('./pages/NotFound'))

// Admin — lazy loaded, NOT bundled with public pages
const Admin = lazy(() => import('./admin/Admin'))

// Floating WhatsApp button
import WhatsAppFAB from './components/ui/WhatsAppFAB'

const WHATSAPP = '917038276535'

function App() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/gang-admin')

  return (
    <>
      <Suspense fallback={
        <div className="preloader">
          <div style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: '48px',
            color: '#2EC27E',
            letterSpacing: '4px',
            animation: 'pulse 1.5s ease-in-out infinite'
          }}>
            TRIPGANG
          </div>
        </div>
      }>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/trip/:tripId" element={<TripDetail />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/cancellation-policy" element={<CancellationPolicy />} />
          <Route path="/gang-admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      {/* Hide WhatsApp FAB on admin pages */}
      {!isAdmin && <WhatsAppFAB phone={WHATSAPP} />}
    </>
  )
}

export default App

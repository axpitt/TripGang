import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import preloaderVideo from '../../assets/preloader.mp4'

const Preloader = ({ onComplete }) => {
  const [phase, setPhase] = useState('loading') // 'loading' | 'exit'
  const [isMuted, setIsMuted] = useState(true)
  const [progress, setProgress] = useState(0)
  const videoRef = useRef(null)
  const completedRef = useRef(false)

  const handleFinish = () => {
    if (completedRef.current) return
    completedRef.current = true
    setPhase('exit')
    setTimeout(() => {
      onComplete?.()
    }, 800)
  }

  // Auto-play attempt on mount
  useEffect(() => {
    const video = videoRef.current
    if (video) {
      video.play().catch(() => {
        // Autoplay may be restricted by browser until interaction
      })
    }

    // Safety fallback: if video stalls or takes longer than 11s, complete
    const fallbackTimer = setTimeout(() => {
      handleFinish()
    }, 11000)

    return () => clearTimeout(fallbackTimer)
  }, [])

  const handleTimeUpdate = () => {
    const video = videoRef.current
    if (video && video.duration) {
      setProgress((video.currentTime / video.duration) * 100)
    }
  }

  const toggleSound = () => {
    const next = !isMuted
    setIsMuted(next)
    if (videoRef.current) {
      videoRef.current.muted = next
    }
  }

  return (
    <AnimatePresence>
      {phase === 'loading' && (
        <motion.div
          key="video-preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04, filter: 'blur(4px)' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'radial-gradient(circle at center, #FFFFFF 20%, #ECECEC 65%, #DFDFE2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            overflow: 'hidden',
          }}
        >
          {/* Main Preloader Video — Fullscreen Cover */}
          <div style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            overflow: 'hidden',
          }}>
            <video
              ref={videoRef}
              src={preloaderVideo || '/preloader.mp4'}
              autoPlay
              muted={isMuted}
              playsInline
              preload="auto"
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleFinish}
              onError={handleFinish}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                display: 'block',
              }}
            />
          </div>

          {/* Top Controls: Sound & Skip */}
          <div style={{
            position: 'absolute',
            top: 24,
            right: 28,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            zIndex: 10,
          }}>
            <button
              onClick={toggleSound}
              title={isMuted ? 'Unmute sound' : 'Mute sound'}
              style={{
                background: 'rgba(0, 0, 0, 0.08)',
                border: '1px solid rgba(0, 0, 0, 0.12)',
                borderRadius: 20,
                padding: '6px 14px',
                cursor: 'pointer',
                fontFamily: 'Satoshi, sans-serif',
                fontSize: 12,
                color: '#1e293b',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                backdropFilter: 'blur(8px)',
                transition: 'all 0.2s',
              }}
            >
              <span>{isMuted ? '🔇' : '🔊'}</span>
              <span>{isMuted ? 'Sound Off' : 'Sound On'}</span>
            </button>

            <button
              onClick={handleFinish}
              style={{
                background: '#081120',
                border: 'none',
                borderRadius: 20,
                padding: '7px 18px',
                cursor: 'pointer',
                fontFamily: 'Satoshi, sans-serif',
                fontSize: 12,
                fontWeight: 600,
                color: '#F1F5F9',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                transition: 'all 0.2s',
              }}
            >
              <span>Skip</span>
              <span style={{ color: '#2EC27E' }}>➔</span>
            </button>
          </div>

          {/* Bottom Progress Bar */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 3,
            background: 'rgba(0, 0, 0, 0.06)',
            zIndex: 10,
          }}>
            <div style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #2EC27E, #38BDF8)',
              transition: 'width 0.1s linear',
            }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Preloader




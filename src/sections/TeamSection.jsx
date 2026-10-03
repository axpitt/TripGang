import { useEffect, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { getTeam } from '../lib/firestore'

const FALLBACK_TEAM = [
  { id: '1', name: 'Arpit Japulkar', role: 'Founder & Trip Organizer', phone: '7038276535', photo: '', bio: "The guy who looked at 30 muddy college friends and thought this should be a company. Arpit plans every trek from the ground up, handles registrations, and makes sure everyone gets home with a story worth telling.", order: 1 },
  { id: '2', name: 'Bablu Ade', role: 'Co-Organizer', phone: '9022397476', photo: '', bio: "The one who keeps everything running on ground. Bablu handles logistics, coordinates with local guides, and makes sure the tempo traveller leaves on time.", order: 2 },
  { id: '3', name: 'Samiksha More', role: 'Female Coordinator', phone: '', photo: '', bio: "Samiksha ensures every female participant feels safe, comfortable, and included. She is the reason TripGang is a space for everyone.", order: 3 },
  { id: '4', name: 'Prathmesh Kadam', role: 'Social Media Manager', phone: '', photo: '', bio: "The person behind the camera and the captions. Prathmesh captures every moment and makes sure your trek ends up on your explore page.", order: 4 },
]

// Monsoon Trek palette avatar accent colors
const avatarColors = ['#2EC27E', '#38BDF8', '#FB8500', '#2EC27E']

const MemberCard = ({ member, index }) => {
  const initials = member.name.split(' ').map(n => n[0]).join('').slice(0, 2)
  const accentColor = avatarColors[index % avatarColors.length]

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ delay: index * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8, boxShadow: `0 20px 48px rgba(56,189,248,0.12)` }}
      style={{
        background: '#102A43',
        border: '1px solid rgba(27,59,90,0.8)',
        borderRadius: 20, padding: 28,
        display: 'flex', flexDirection: 'column', gap: 16,
        transition: 'border-color 0.3s',
        cursor: 'default',
      }}
    >
      {/* Avatar row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
          border: `2px solid ${accentColor}`,
          background: member.photo ? 'transparent' : `${accentColor}18`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {member.photo ? (
            <img src={member.photo} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 22, color: accentColor }}>
              {initials}
            </span>
          )}
        </div>
        <div>
          <h3 style={{
            fontFamily: 'Space Grotesk, sans-serif', fontSize: 18,
            fontWeight: 700, color: '#F1F5F9', marginBottom: 4,
          }}>
            {member.name}
          </h3>
          <p style={{
            fontFamily: 'Space Grotesk, sans-serif', fontSize: 11,
            color: accentColor, fontWeight: 600, letterSpacing: 1.5,
            textTransform: 'uppercase',
          }}>
            {member.role}
          </p>
        </div>
      </div>

      {/* Bio */}
      <p style={{
        fontFamily: 'Inter, sans-serif', fontSize: 14,
        color: '#94A3B8', lineHeight: 1.75, flexGrow: 1,
      }}>
        {member.bio}
      </p>

      {/* WhatsApp contact */}
      {member.phone && (
        <a
          href={`https://wa.me/91${member.phone}?text=Hi%20${member.name.split(' ')[0]}!%20I%20found%20you%20on%20TripGang.`}
          target="_blank" rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, fontWeight: 600,
            color: '#25d366', textDecoration: 'none',
            padding: '8px 16px', borderRadius: 8,
            background: 'rgba(37,211,102,0.07)',
            border: '1px solid rgba(37,211,102,0.15)',
            transition: 'all 0.2s', width: 'fit-content',
          }}
        >
          <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.5-.173-.001-.371-.001-.57-.001-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
          </svg>
          Chat on WhatsApp
        </a>
      )}
    </motion.div>
  )
}

const TeamSection = () => {
  const [team, setTeam] = useState(FALLBACK_TEAM)
  const headRef = useRef(null)
  const inView = useInView(headRef, { once: true, amount: 0.1 })

  useEffect(() => {
    getTeam().then(data => {
      if (data.length > 0) setTeam(data)
    }).catch(() => {})
  }, [])

  return (
    <section
      id="team"
      style={{
        padding: 'clamp(80px, 10vw, 120px) 24px',
        background: '#0c1a2e',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 50% 100%, rgba(56,189,248,0.05) 0%, transparent 60%)',
      }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Section heading with ghost text */}
        <div ref={headRef} style={{ textAlign: 'center', marginBottom: 64, position: 'relative', overflow: 'hidden' }}>
          {/* Ghost watermark */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 0.06 } : {}}
            transition={{ duration: 1.2 }}
            style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: 'clamp(80px, 16vw, 200px)',
              color: '#F1F5F9',
              position: 'absolute', top: '-0.25em', left: '50%',
              transform: 'translateX(-50%)',
              whiteSpace: 'nowrap',
              pointerEvents: 'none', userSelect: 'none',
              letterSpacing: '0.08em', lineHeight: 1,
            }}
          >GANG</motion.span>

          <motion.p
            className="section-eyebrow"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            style={{ position: 'relative', zIndex: 2 }}
          >
            The People Behind It
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: 'clamp(42px, 6vw, 84px)',
              lineHeight: 1, color: '#F1F5F9', letterSpacing: 1,
              position: 'relative', zIndex: 2,
            }}
          >
            MEET <span style={{ color: '#2EC27E' }}>THE GANG</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.28, duration: 0.6 }}
            style={{
              fontFamily: 'Inter, sans-serif', fontSize: 16,
              color: '#94A3B8', marginTop: 16,
              maxWidth: 480, margin: '16px auto 0',
              lineHeight: 1.7, position: 'relative', zIndex: 2,
            }}
          >
            Not a corporate team. Just a group of passionate adventurers who love the mountains and people.
          </motion.p>
        </div>

        {/* Team cards grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 20,
        }}>
          {[...team]
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map((member, i) => (
              <MemberCard key={member.id} member={member} index={i} />
            ))}
        </div>
      </div>
    </section>
  )
}

export default TeamSection

import { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/**
 * PerspectiveTiltCard
 * 3D Holographic Perspective Tilt Card with Specular Emerald Glare,
 * Laser Conic Orbit Border Beam, and Scarcity Urgency Beacon.
 *
 * Compatible with React 19, Tailwind CSS v4, and Framer Motion 12.
 */
export function PerspectiveTiltCard({
  trip = {
    id: 'harishchandragad-2026',
    name: 'Harishchandragad Konkan Kada',
    tag: 'Monsoon Special',
    duration: '2D • 1N',
    elevation: '1,424m',
    difficulty: 'Moderate',
    price: '₹1,699',
    originalPrice: '₹2,199',
    seatsLeft: 3,
    maxSeats: 18,
    desc: 'Breathtaking cliff drop, misty Sahyadri winds, cloud ocean inversion, and legendary midnight campfire jam.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
    featured: true,
  },
  onBookClick,
  onExploreClick,
}) {
  const cardRef = useRef(null);
  const [isTouchDevice, setIsTouchDevice] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(pointer: coarse)').matches : false
  );

  // Motion values for normalized cursor coordinates (-0.5 to 0.5)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Snappy spring physics for smooth, non-oscillating cursor tracking
  const springConfig = { damping: 22, stiffness: 280, mass: 0.1 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), springConfig);

  // Specular emerald glare reflection position (0% to 100%)
  const glareX = useSpring(useTransform(mouseX, [-0.5, 0.5], [0, 100]), springConfig);
  const glareY = useSpring(useTransform(mouseY, [-0.5, 0.5], [0, 100]), springConfig);
  const glareOpacity = useSpring(0, { damping: 25, stiffness: 200 });

  // Listen for pointer media changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(pointer: coarse)');
    const updateTouch = (e) => setIsTouchDevice(e.matches);
    mediaQuery.addEventListener?.('change', updateTouch);
    return () => mediaQuery.removeEventListener?.('change', updateTouch);
  }, []);

  const handleMouseMove = (e) => {
    if (isTouchDevice || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseEnter = () => {
    if (isTouchDevice) return;
    glareOpacity.set(0.85);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    glareOpacity.set(0);
  };

  const isCriticalSeats = trip.seatsLeft <= 4;
  const bookedPercentage = Math.min(100, Math.round(((trip.maxSeats - trip.seatsLeft) / trip.maxSeats) * 100));

  return (
    <div style={{ perspective: 1000 }} className="w-full max-w-sm mx-auto select-none">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX: isTouchDevice ? 0 : rotateX,
          rotateY: isTouchDevice ? 0 : rotateY,
          transformStyle: 'preserve-3d',
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="relative rounded-2xl bg-[#101218]/90 backdrop-blur-xl border border-white/10 p-5 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.7)] group transition-shadow hover:shadow-[0_25px_60px_rgba(46,194,126,0.2)]"
      >
        {/* Conic Laser Orbit Border Beam (Active on Featured Trips) */}
        {trip.featured && (
          <div className="absolute inset-0 rounded-2xl pointer-events-none p-[1.5px] overflow-hidden">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 3.5, ease: 'linear' }}
              className="absolute -inset-[100%] origin-center bg-[conic-gradient(from_0deg,transparent_0deg,transparent_270deg,rgba(46,194,126,0.2)_300deg,rgba(46,194,126,0.9)_340deg,rgba(255,255,255,0.95)_355deg,transparent_360deg)]"
            />
            <div className="absolute inset-[1.5px] rounded-2xl bg-[#101218]/95" />
          </div>
        )}

        {/* Specular Emerald Glare Layer */}
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-2xl mix-blend-overlay z-20 transition-opacity"
          style={{
            opacity: glareOpacity,
            background: useTransform(
              [glareX, glareY],
              ([gx, gy]) =>
                `radial-gradient(circle at ${gx}% ${gy}%, rgba(46,194,126,0.45) 0%, rgba(255,255,255,0.15) 30%, transparent 70%)`
            ),
          }}
        />

        {/* Card Background Ambient Spotlight */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#2EC27E]/10 rounded-full blur-2xl pointer-events-none" />

        {/* 3D Elevated Content Stack */}
        <div style={{ transform: 'translateZ(36px)' }} className="relative z-10 flex flex-col h-full pointer-events-none">
          {/* Header Row: Vibe Tag & Urgency Radar */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-[11px] font-heading font-bold px-2.5 py-1 rounded-full bg-[#2EC27E]/15 text-[#2EC27E] border border-[#2EC27E]/30 uppercase tracking-wider shadow-[0_0_10px_rgba(46,194,126,0.2)]">
              {trip.tag}
            </span>

            {/* Scarcity Urgency Beacon */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0A0B0E]/80 border border-white/10 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    isCriticalSeats ? 'bg-[#ef4444]' : 'bg-[#2EC27E]'
                  }`}
                />
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    isCriticalSeats ? 'bg-[#ef4444] shadow-[0_0_8px_#ef4444]' : 'bg-[#2EC27E] shadow-[0_0_8px_#2EC27E]'
                  }`}
                />
              </span>
              <span className="text-[10px] font-mono font-bold text-white tracking-tight">
                {trip.seatsLeft} SPOTS LEFT
              </span>
            </div>
          </div>

          {/* Hero Trip Image with Parallax Depth */}
          <div className="relative w-full h-44 rounded-xl overflow-hidden mb-4 border border-white/8 group-hover:border-[#2EC27E]/30 transition-colors">
            <img
              src={trip.image}
              alt={trip.name}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#101218] via-transparent to-transparent opacity-80" />

            <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-[#F1F5F9] z-10">
              <span className="bg-[#0A0B0E]/70 px-2 py-0.5 rounded backdrop-blur-sm border border-white/10">
                ⏳ {trip.duration}
              </span>
              <span className="bg-[#0A0B0E]/70 px-2 py-0.5 rounded backdrop-blur-sm border border-white/10">
                ⛰️ {trip.elevation}
              </span>
            </div>
          </div>

          {/* Trip Title & Description */}
          <div className="mb-4">
            <h3 className="text-lg font-heading font-bold text-[#F8FAFC] tracking-tight group-hover:text-[#2EC27E] transition-colors leading-snug mb-1.5">
              {trip.name}
            </h3>
            <p className="text-xs text-[#94A3B8] font-body line-clamp-2 leading-relaxed">
              {trip.desc}
            </p>
          </div>

          {/* Seat Filling Progress Track */}
          <div className="mb-4">
            <div className="flex justify-between items-center text-[10px] font-mono text-[#64748B] mb-1">
              <span>SQUAD CAPACITY</span>
              <span className={isCriticalSeats ? 'text-[#ef4444] font-bold' : 'text-[#2EC27E] font-bold'}>
                {bookedPercentage}% FULL
              </span>
            </div>
            <div className="w-full h-1.5 bg-white/8 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${bookedPercentage}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className={`h-full rounded-full ${
                  isCriticalSeats
                    ? 'bg-gradient-to-r from-[#ef4444] to-[#f97316]'
                    : 'bg-gradient-to-r from-[#2EC27E] to-[#38BDF8]'
                }`}
              />
            </div>
          </div>

          {/* Footer: Price & Action CTA */}
          <div className="mt-auto pt-3 border-t border-white/8 flex items-center justify-between pointer-events-auto">
            <div>
              <span className="text-[10px] text-[#64748B] font-mono block line-through">
                {trip.originalPrice}
              </span>
              <span className="text-xl font-heading font-extrabold text-[#2EC27E] tracking-tight">
                {trip.price}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onExploreClick}
                className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-heading font-semibold hover:bg-white/10 transition-colors cursor-pointer"
              >
                Details
              </button>
              <button
                type="button"
                onClick={onBookClick}
                className="px-4 py-1.5 rounded-lg bg-[#2EC27E] text-[#0A0B0E] text-xs font-heading font-extrabold tracking-wide hover:bg-[#35d68a] transition-all shadow-[0_4px_16px_rgba(46,194,126,0.3)] hover:shadow-[0_6px_20px_rgba(46,194,126,0.5)] cursor-pointer"
              >
                Lock Seat
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

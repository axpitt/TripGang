import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * SquadChemistryRadar
 * Anonymized Cohort Vibe Radar, Demographic Breakdown,
 * and Verified Female Coordinator Trust Seal (featuring Samiksha More).
 *
 * Compatible with React 19, Tailwind CSS v4, and Framer Motion 12.
 */
export function SquadChemistryRadar({
  tripName = 'Harishchandragad Monsoon Expedition',
  totalSeats = 20,
  bookedSeats = 14,
  femaleSpots = 8,
  coordinator = {
    name: 'Samiksha More',
    role: 'Female Safety Lead & Wilderness First Responder',
    phone: '7038276535',
    verified: true,
    badges: ['Certified WFR', 'Sahyadri Veteran', 'Zero-Tolerance Policy Lead'],
  },
}) {
  const [activeTab, setActiveTab] = useState('radar'); // 'radar' | 'trust'
  const [selectedVibe, setSelectedVibe] = useState(null);

  const [vibes, setVibes] = useState([
    { id: 'stargazer', label: 'Stargazer', icon: '🌌', count: 11, desc: 'Loves late night constellations & astrophotography' },
    { id: 'lens', label: 'Lens Addict', icon: '📸', count: 9, desc: 'Carrying gimbal & 35mm primes for misty Sahyadri reels' },
    { id: 'campfire', label: 'Campfire Jammer', icon: '🎸', count: 8, desc: 'Acoustic guitar chords & soulful indie retro playlist' },
    { id: 'solo', label: 'Solo Adventurer', icon: '🎒', count: 12, desc: 'First-time solo traveler making new lifelong friends' },
    { id: 'chai', label: 'Chai Enthusiast', icon: '☕', count: 14, desc: 'Stops at every hillside tapri for hot pitla-bhakri & cutting chai' },
  ]);

  const handleVibeClick = (id) => {
    setSelectedVibe(selectedVibe === id ? null : id);
    setVibes((prev) =>
      prev.map((v) => (v.id === id ? { ...v, count: v.count + 1 } : v))
    );
  };

  const percentageBooked = Math.round((bookedSeats / totalSeats) * 100);

  return (
    <div className="w-full max-w-md mx-auto rounded-2xl bg-[#101218]/90 border border-white/10 backdrop-blur-xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
      {/* Top Header & Tab Pill Switcher */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/8">
        <div>
          <span className="text-[10px] font-mono text-[#2EC27E] uppercase tracking-wider block">
            PRE-TRIP TRANSPARENCY
          </span>
          <h3 className="text-base font-heading font-bold text-white tracking-tight">
            Squad Chemistry & Trust
          </h3>
        </div>

        <div className="flex p-0.5 rounded-lg bg-white/5 border border-white/8 text-[11px] font-heading font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('radar')}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
              activeTab === 'radar'
                ? 'bg-[#2EC27E] text-[#0A0B0E] font-bold shadow-sm'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            Vibe Radar
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('trust')}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
              activeTab === 'trust'
                ? 'bg-[#2EC27E] text-[#0A0B0E] font-bold shadow-sm'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            🛡️ Safety Seal
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'radar' ? (
          <motion.div
            key="radar-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            {/* Quick Cohort Overview Stats */}
            <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center">
              <div>
                <span className="text-[10px] font-mono text-[#64748B] block">GENDER RATIO</span>
                <span className="text-xs font-heading font-bold text-[#38BDF8]">
                  57% F • 43% M
                </span>
              </div>
              <div className="border-x border-white/5">
                <span className="text-[10px] font-mono text-[#64748B] block">SOLO TRAVELERS</span>
                <span className="text-xs font-heading font-bold text-[#2EC27E]">
                  64% Solo
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#64748B] block">MEDIAN AGE</span>
                <span className="text-xs font-heading font-bold text-[#FB8500]">
                  22–28 yrs
                </span>
              </div>
            </div>

            {/* Circular Radar Radial Visual */}
            <div className="flex items-center gap-4 p-3 rounded-xl bg-gradient-to-r from-[#2EC27E]/10 via-transparent to-transparent border border-[#2EC27E]/20">
              <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-white/10"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <motion.path
                    className="text-[#2EC27E]"
                    strokeDasharray={`${percentageBooked}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    initial={{ strokeDasharray: '0, 100' }}
                    animate={{ strokeDasharray: `${percentageBooked}, 100` }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                  />
                </svg>
                <span className="absolute text-xs font-heading font-bold text-white">
                  {percentageBooked}%
                </span>
              </div>

              <div>
                <h4 className="text-xs font-heading font-bold text-white mb-0.5">
                  {bookedSeats} Adventurers Confirmed
                </h4>
                <p className="text-[11px] text-[#94A3B8] font-body leading-tight">
                  High social chemistry score. Intimate squad size guaranteed.
                </p>
              </div>
            </div>

            {/* Anonymized Vibe Tag Cloud */}
            <div>
              <span className="text-[10px] font-mono text-[#94A3B8] block mb-2 uppercase">
                Squad Personality Tags (Tap to Upvote):
              </span>
              <div className="flex flex-wrap gap-2">
                {vibes.map((v) => {
                  const isSelected = selectedVibe === v.id;
                  return (
                    <motion.button
                      key={v.id}
                      type="button"
                      onClick={() => handleVibeClick(v.id)}
                      whileTap={{ scale: 0.94 }}
                      whileHover={{ scale: 1.04 }}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-heading transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-[#2EC27E]/20 text-[#2EC27E] border-[#2EC27E]/50 shadow-[0_0_12px_rgba(46,194,126,0.3)]'
                          : 'bg-white/5 text-[#94A3B8] border-white/8 hover:text-white hover:border-white/20'
                      }`}
                    >
                      <span>{v.icon}</span>
                      <span>{v.label}</span>
                      <span className="text-[10px] font-mono px-1 rounded bg-black/40 text-white/70">
                        {v.count}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Vibe Description Tooltip */}
              <AnimatePresence>
                {selectedVibe && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2.5 p-2 rounded-lg bg-black/40 border border-white/5 text-[11px] text-[#2EC27E] font-body"
                  >
                    💡 {vibes.find((v) => v.id === selectedVibe)?.desc}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="trust-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            {/* Female Lead Spotlight */}
            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-white/[0.03] border border-[#2EC27E]/30 relative overflow-hidden">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#2EC27E] to-[#38BDF8] p-0.5 shrink-0">
                <div className="w-full h-full rounded-full bg-[#101218] flex items-center justify-center text-lg">
                  👩🏽‍🌾
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-heading font-bold text-white">
                    {coordinator.name}
                  </h4>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#2EC27E]/20 text-[#2EC27E] font-mono font-bold border border-[#2EC27E]/40">
                    VERIFIED LEAD
                  </span>
                </div>
                <p className="text-[11px] text-[#94A3B8] font-body leading-tight">
                  {coordinator.role}
                </p>
              </div>
            </div>

            {/* Safety Protocol Guarantees */}
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2 p-2 rounded-lg bg-white/[0.02]">
                <span className="text-[#2EC27E] font-bold">✓</span>
                <p className="text-[#94A3B8] font-body leading-relaxed">
                  <strong className="text-white font-heading">Separate Sanitized Washroom Halts:</strong> Pre-vetted hygienic halts along Mumbai-Pune highway & base villages.
                </p>
              </div>

              <div className="flex items-start gap-2 p-2 rounded-lg bg-white/[0.02]">
                <span className="text-[#2EC27E] font-bold">✓</span>
                <p className="text-[#94A3B8] font-body leading-relaxed">
                  <strong className="text-white font-heading">Female Tent Partner Allocation:</strong> Solo women are matched exclusively with verified female companions.
                </p>
              </div>

              <div className="flex items-start gap-2 p-2 rounded-lg bg-white/[0.02]">
                <span className="text-[#2EC27E] font-bold">✓</span>
                <p className="text-[#94A3B8] font-body leading-relaxed">
                  <strong className="text-white font-heading">Zero-Alcohol & Safe Space Contract:</strong> Strict sober environment enforced on trail and campfire.
                </p>
              </div>
            </div>

            {/* Direct Coordinator Inquiry CTA */}
            <div className="pt-2 flex items-center justify-between border-t border-white/8">
              <span className="text-[11px] text-[#64748B] font-mono">
                {femaleSpots} Solo Women Confirmed
              </span>
              <a
                href={`https://wa.me/91${coordinator.phone}?text=Hi%20Samiksha,%20I'm%20inquiring%20about%20female%20safety%20for%20the%20${encodeURIComponent(tripName)}.`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-[#25D366]/15 border border-[#25D366]/30 text-[#25D366] text-xs font-heading font-bold hover:bg-[#25D366] hover:text-[#0A0B0E] transition-colors"
              >
                Chat with Samiksha
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

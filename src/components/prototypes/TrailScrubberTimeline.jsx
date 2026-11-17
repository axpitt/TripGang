import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * TrailScrubberTimeline
 * Interactive SVG Trail Scrubber with Dynamic Elevation Profile,
 * Checkpoint Nodes, and Expandable Daily Field Logs.
 *
 * Compatible with React 19, Tailwind CSS v4, and Framer Motion 12.
 */
export function TrailScrubberTimeline({
  stages = [
    {
      day: '01',
      title: 'Pune / Mumbai Pickups & Ghat Ride',
      elevation: '580m',
      difficulty: 'Easy Transit',
      time: '06:00 AM - 12:30 PM',
      desc: 'Scenic highway breakfast, curated road trip playlist, winding Sahyadri ghat roads, and chai tapri halts.',
      highlights: ['Highway Vada Pav Halt', 'Curated Spotify Jam', 'Base Village Assembly'],
    },
    {
      day: '02',
      title: 'Basecamp Trek & Konkan Kada Sunset',
      elevation: '1,424m',
      difficulty: 'Moderate Climb',
      time: '01:30 PM - 07:00 PM',
      desc: 'Rock steps, misty mountain winds, cliff edge panorama, brocken spectre phenomenon, and tent pitching on the ridge.',
      highlights: ['Rock Patch Scramble', 'Konkan Kada Sunset View', 'Ridge Tent Pitching'],
    },
    {
      day: '03',
      title: 'Campfire Stories & Acoustic Jam',
      elevation: '1,420m',
      difficulty: 'Camp Night',
      time: '08:00 PM - 01:00 AM',
      desc: 'Warm barbecue, acoustic campfire jam, unscripted detour voting, and unpolluted stargazing under Sahyadri skies.',
      highlights: ['Acoustic Bonfire Jam', 'Democratic Detour Vote', 'Astrophotography'],
    },
    {
      day: '04',
      title: 'Taramati Peak Sunrise & Return',
      elevation: '1,429m',
      difficulty: 'Morning Trek',
      time: '05:30 AM - 05:00 PM',
      desc: 'Golden hour at highest summit point, traditional Maharashtrian breakfast, temple exploration, and return ride.',
      highlights: ['360° Cloud Inversion', 'Harishcheshwar Temple', 'Village Pitla Bhakri'],
    },
  ],
}) {
  const [activeStage, setActiveStage] = useState(1); // 0-indexed or active step
  const [expandedDay, setExpandedDay] = useState(1);

  const totalStages = stages.length;
  const progressRatio = activeStage / (totalStages - 1);

  return (
    <div className="w-full max-w-2xl mx-auto rounded-2xl bg-[#101218]/90 border border-white/10 backdrop-blur-xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
      {/* Header with Elevation Eyebrow */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/8">
        <div>
          <span className="text-[10px] font-mono text-[#2EC27E] uppercase tracking-widest block">
            ELEVATION PROFILE & TIMELINE
          </span>
          <h3 className="text-xl font-heading font-bold text-white tracking-tight">
            Expedition Trail Scrubber
          </h3>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#94A3B8]">
          <span>STAGE</span>
          <span className="px-2 py-0.5 rounded bg-[#2EC27E]/15 border border-[#2EC27E]/30 text-[#2EC27E] font-bold">
            {activeStage + 1} / {totalStages}
          </span>
        </div>
      </div>

      {/* SVG Elevation Contour Scrubber Track */}
      <div className="relative mb-8 px-4">
        {/* SVG Interactive Elevation Path */}
        <div className="relative h-20 w-full mb-3">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 400 80" preserveAspectRatio="none">
            <defs>
              <linearGradient id="trailGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#2EC27E" />
                <stop offset="50%" stopColor="#38BDF8" />
                <stop offset="100%" stopColor="#FB8500" />
              </linearGradient>
            </defs>

            {/* Inactive Elevation Contour */}
            <path
              d="M 10,65 Q 100,50 140,25 T 260,30 T 390,15"
              fill="none"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Active Drawing Contour Path */}
            <motion.path
              d="M 10,65 Q 100,50 140,25 T 260,30 T 390,15"
              fill="none"
              stroke="url(#trailGradient)"
              strokeWidth="3.5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: progressRatio }}
              transition={{ type: 'spring', stiffness: 120, damping: 18 }}
            />
          </svg>
        </div>

        {/* Step Checkpoint Buttons along Timeline */}
        <div className="flex items-center justify-between relative">
          {stages.map((stage, idx) => {
            const isCompleted = idx <= activeStage;
            const isCurrent = idx === activeStage;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setActiveStage(idx);
                  setExpandedDay(idx);
                }}
                className="flex flex-col items-center group cursor-pointer focus:outline-none"
              >
                {/* Node Dot with Animated Radar Rings */}
                <div className="relative flex items-center justify-center w-7 h-7 mb-1.5">
                  {isCurrent && (
                    <motion.span
                      layoutId="nodeGlow"
                      className="absolute inset-0 rounded-full bg-[#2EC27E]/30 animate-ping duration-1000"
                    />
                  )}
                  <div
                    className={`w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${
                      isCompleted
                        ? 'bg-[#0A0B0E] border-[#2EC27E] shadow-[0_0_12px_rgba(46,194,126,0.6)]'
                        : 'bg-[#151821] border-white/20'
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full transition-colors ${
                        isCompleted ? 'bg-[#2EC27E]' : 'bg-transparent'
                      }`}
                    />
                  </div>
                </div>

                {/* Day & Elevation Pill */}
                <span
                  className={`text-[11px] font-mono font-bold transition-colors ${
                    isCurrent ? 'text-[#2EC27E]' : isCompleted ? 'text-white' : 'text-[#64748B]'
                  }`}
                >
                  D{stage.day}
                </span>
                <span className="text-[10px] text-[#64748B] font-mono hidden sm:inline">
                  {stage.elevation}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Accordion Daily Field Logs */}
      <div className="space-y-3">
        {stages.map((stage, idx) => {
          const isOpen = expandedDay === idx;
          const isSelected = activeStage === idx;

          return (
            <div
              key={idx}
              className={`rounded-xl border transition-all overflow-hidden ${
                isSelected
                  ? 'bg-white/[0.04] border-[#2EC27E]/30'
                  : 'bg-white/[0.01] border-white/5 hover:border-white/10'
              }`}
            >
              {/* Accordion Bar Header */}
              <button
                type="button"
                onClick={() => {
                  setExpandedDay(isOpen ? null : idx);
                  setActiveStage(idx);
                }}
                className="w-full p-4 flex items-center justify-between text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-8 h-8 rounded-lg font-mono text-xs font-bold flex items-center justify-center border transition-colors ${
                      isSelected
                        ? 'bg-[#2EC27E]/20 text-[#2EC27E] border-[#2EC27E]/40'
                        : 'bg-white/5 text-[#94A3B8] border-white/10'
                    }`}
                  >
                    D{stage.day}
                  </span>

                  <div>
                    <h4 className="text-sm font-heading font-bold text-white mb-0.5">
                      {stage.title}
                    </h4>
                    <span className="text-[11px] text-[#64748B] font-mono">
                      {stage.elevation} • {stage.time}
                    </span>
                  </div>
                </div>

                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                  className="text-xs text-[#2EC27E] ml-2"
                >
                  ▼
                </motion.span>
              </button>

              {/* Expandable Content Area */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30, opacity: { duration: 0.18 } }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-1 text-xs text-[#94A3B8] font-body leading-relaxed border-t border-white/5">
                      <p className="mb-3">{stage.desc}</p>

                      <div className="flex flex-wrap gap-1.5">
                        {stage.highlights.map((h, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 rounded-md bg-white/5 border border-white/8 text-[11px] text-white font-mono"
                          >
                            ✓ {h}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

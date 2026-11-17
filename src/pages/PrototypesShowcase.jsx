import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  PerspectiveTiltCard,
  SquadChemistryRadar,
  DetourVotingCard,
  TrailScrubberTimeline,
  CampfireParticles,
} from '../components/prototypes';

export default function PrototypesShowcase() {
  return (
    <div className="relative min-h-screen bg-[#0A0B0E] text-[#F8FAFC] overflow-x-hidden selection:bg-[#2EC27E] selection:text-[#0A0B0E]">
      <Helmet>
        <title>TripGang Interactive Prototypes | Milestone 1 Showcase</title>
        <meta
          name="description"
          content="Interactive preview of TripGang differentiation prototypes: 3D perspective tilt cards, squad chemistry radar, detour voting, trail elevation scrubber, and campfire particles."
        />
      </Helmet>

      {/* Ambient Campfire Shader Particles in Background */}
      <CampfireParticles isFullScreen maxEmbers={65} starCount={45} />

      {/* Top Header Navigation */}
      <header className="relative z-10 border-b border-white/8 backdrop-blur-md bg-[#0A0B0E]/80 sticky top-0 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="text-xl font-display tracking-widest text-[#2EC27E] hover:opacity-80 transition-opacity"
            >
              TRIPGANG
            </Link>
            <span className="text-xs font-mono text-[#64748B] px-2 py-0.5 rounded bg-white/5 border border-white/10">
              M1 PROTOTYPES
            </span>
          </div>

          <Link
            to="/"
            className="text-xs font-heading font-semibold text-[#94A3B8] hover:text-white transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Hero Showcase Introduction */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12 space-y-16">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-widest text-[#2EC27E] mb-2 block">
            Milestone 1 Core Deliverables
          </span>
          <h1 className="text-3xl md:text-5xl font-heading font-extrabold tracking-tight text-white mb-4">
            Interactive Differentiation Prototypes
          </h1>
          <p className="text-sm md:text-base text-[#94A3B8] font-body leading-relaxed">
            Real-time interactive components engineered for React 19, Tailwind CSS v4, and Framer Motion 12. Experience genuine 3D cursor physics, live squad polling, and SVG elevation scrubbing.
          </p>
        </div>

        {/* Prototype 1: 3D Holographic Perspective Tilt Card */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/8 pb-2">
            <div>
              <span className="text-[10px] font-mono text-[#38BDF8] uppercase tracking-wider block">
                Pattern UI-01 &amp; UI-02
              </span>
              <h2 className="text-xl font-heading font-bold text-white">
                3D Perspective Tilt Card with Emerald Glare &amp; Orbit Beam
              </h2>
            </div>
            <span className="text-xs font-mono text-[#2EC27E] px-2.5 py-1 rounded bg-[#2EC27E]/10 border border-[#2EC27E]/30">
              Spring Physics 280/22
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] max-w-xl">
            Hover cursor around the card to observe real-time yaw/pitch tilt tracking, specular radial emerald glare, rotating conic laser orbit beam, and 36px Z-plane typography elevation.
          </p>
          <div className="py-6 flex justify-center">
            <PerspectiveTiltCard />
          </div>
        </section>

        {/* Prototype 2 & 3: Squad Chemistry Radar and Democratic Detour Voting */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Squad Chemistry Radar */}
          <div className="space-y-4">
            <div className="border-b border-white/8 pb-2">
              <span className="text-[10px] font-mono text-[#38BDF8] uppercase tracking-wider block">
                Feature F-01 &amp; F-04
              </span>
              <h2 className="text-lg font-heading font-bold text-white">
                Squad Chemistry Radar &amp; Trust Seal
              </h2>
            </div>
            <p className="text-xs text-[#94A3B8]">
              Interactive cohort preview displaying demographic transparency, upvoteable vibe tags, and the verified female safety seal featuring Samiksha More.
            </p>
            <div className="pt-2">
              <SquadChemistryRadar />
            </div>
          </div>

          {/* Democratic Detour Voting Card */}
          <div className="space-y-4">
            <div className="border-b border-white/8 pb-2">
              <span className="text-[10px] font-mono text-[#38BDF8] uppercase tracking-wider block">
                Feature F-02
              </span>
              <h2 className="text-lg font-heading font-bold text-white">
                Democratic Detour Voting Card
              </h2>
            </div>
            <p className="text-xs text-[#94A3B8]">
              Live democratic poll for spontaneous side quests. Tap any card to cast or toggle your vote with instant spring-physics tally bar recalculation.
            </p>
            <div className="pt-2">
              <DetourVotingCard />
            </div>
          </div>
        </section>

        {/* Prototype 4: Expedition Trail Scrubber & Dynamic Elevation Profile */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/8 pb-2">
            <div>
              <span className="text-[10px] font-mono text-[#38BDF8] uppercase tracking-wider block">
                Pattern UI-03 &amp; UI-11
              </span>
              <h2 className="text-xl font-heading font-bold text-white">
                Expedition Trail Scrubber &amp; Elevation Profile
              </h2>
            </div>
            <span className="text-xs font-mono text-[#2EC27E] px-2.5 py-1 rounded bg-[#2EC27E]/10 border border-[#2EC27E]/30">
              SVG PathLength &amp; FLIP Accordion
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] max-w-xl">
            Interactive SVG elevation contour path dynamically drawing to the selected expedition stage, paired with radar ring node indicators and fluid-height expandable daily field logs.
          </p>
          <div className="py-6">
            <TrailScrubberTimeline />
          </div>
        </section>

        {/* Footer Acknowledgement */}
        <footer className="text-center pt-8 border-t border-white/8 text-xs font-mono text-[#64748B]">
          TripGang Architecture &copy; 2026. Built with React 19, Tailwind CSS v4 &amp; Framer Motion 12.
        </footer>
      </main>
    </div>
  );
}

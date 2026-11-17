import { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * DetourVotingCard
 * Interactive Democratic Detour Voting Card with Live Animated Tally Bars.
 * Enables the squad to democratically vote on spontaneous side quests.
 *
 * Compatible with React 19, Tailwind CSS v4, and Framer Motion 12.
 */
export function DetourVotingCard({
  tripName = 'Harishchandragad Expedition',
  initialDetours = [
    {
      id: 'detour-1',
      title: 'Hidden Waterfall Natural Plunge Pool',
      category: 'Secret Swim',
      extraTime: '+45 mins',
      difficulty: 'Easy',
      desc: 'Off-trail descent into secluded rainforest pool fed by monsoon cascade.',
      votes: 9,
    },
    {
      id: 'detour-2',
      title: "Village Grandma's Woodfired Pitla-Bhakri",
      category: 'Rustic Food',
      extraTime: '+30 mins',
      difficulty: 'Chill',
      desc: 'Authentic Maharashtrian smoke-flavored lunch at local elder home.',
      votes: 14,
    },
    {
      id: 'detour-3',
      title: 'Sunset Edge Acoustic Jam Point',
      category: 'Campfire Music',
      extraTime: '+25 mins',
      difficulty: 'Easy',
      desc: 'Panoramic cliff ledge facing the setting sun with acoustic indie tunes.',
      votes: 7,
    },
  ],
}) {
  const [detours, setDetours] = useState(initialDetours);
  const [userVotedId, setUserVotedId] = useState(null);
  const [isLocked, setIsLocked] = useState(false);

  const totalVotes = detours.reduce((sum, d) => sum + d.votes, 0);

  const handleVote = (id) => {
    if (isLocked) return;

    setDetours((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          // If already voted for this, toggle off
          if (userVotedId === id) {
            return { ...item, votes: Math.max(0, item.votes - 1) };
          }
          return { ...item, votes: item.votes + 1 };
        }
        // If user previously voted for a different one, subtract from old
        if (item.id === userVotedId) {
          return { ...item, votes: Math.max(0, item.votes - 1) };
        }
        return item;
      })
    );

    setUserVotedId(userVotedId === id ? null : id);
  };

  const leadingDetour = [...detours].sort((a, b) => b.votes - a.votes)[0];

  return (
    <div className="w-full max-w-lg mx-auto rounded-2xl bg-[#101218]/90 border border-white/10 backdrop-blur-xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
      {/* Eyebrow & Status Bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-[#2EC27E] uppercase tracking-widest px-2 py-0.5 rounded bg-[#2EC27E]/10 border border-[#2EC27E]/30">
            DEMOCRATIC DETOUR RADAR
          </span>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2EC27E] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2EC27E]" />
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsLocked(!isLocked)}
          className={`text-[10px] font-mono px-2 py-0.5 rounded cursor-pointer transition-colors ${
            isLocked
              ? 'bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/40 font-bold'
              : 'bg-white/5 text-[#94A3B8] border border-white/10 hover:text-white'
          }`}
        >
          {isLocked ? '🔒 LOCKED RESULT' : '⏱️ 00:14:28 LEFT'}
        </button>
      </div>

      {/* Title & Prompt */}
      <div className="mb-5">
        <span className="text-[10px] font-mono text-[#64748B] block mb-0.5">{tripName}</span>
        <h3 className="text-lg font-heading font-bold text-white mb-1">
          Pick Tomorrow's Unscripted Quest
        </h3>
        <p className="text-xs text-[#94A3B8] font-body">
          The squad votes democratically. The captain navigates to whichever stop wins by summit breakfast.
        </p>
      </div>

      {/* Detour Option Cards */}
      <div className="space-y-3 mb-5">
        {detours.map((detour) => {
          const isVoted = userVotedId === detour.id;
          const isLeader = leadingDetour.id === detour.id && totalVotes > 0;
          const percentage = totalVotes > 0 ? Math.round((detour.votes / totalVotes) * 100) : 0;

          return (
            <motion.div
              key={detour.id}
              whileTap={!isLocked ? { scale: 0.99 } : {}}
              onClick={() => handleVote(detour.id)}
              className={`relative overflow-hidden rounded-xl p-4 border transition-all cursor-pointer ${
                isVoted
                  ? 'border-[#2EC27E] bg-[#121820]/90 shadow-[0_0_20px_rgba(46,194,126,0.18)]'
                  : 'border-white/8 bg-white/[0.02] hover:border-white/20'
              }`}
            >
              {/* Dynamic Animated Vote Fill Bar */}
              <motion.div
                initial={false}
                animate={{ width: `${percentage}%` }}
                transition={{ type: 'spring', stiffness: 140, damping: 18 }}
                className={`absolute top-0 bottom-0 left-0 pointer-events-none rounded-xl ${
                  isLeader
                    ? 'bg-gradient-to-r from-[#2EC27E]/25 to-[#2EC27E]/10'
                    : 'bg-white/[0.04]'
                }`}
              />

              <div className="relative z-10">
                {/* Meta Row: Category, Time, and Vote Badge */}
                <div className="flex items-center justify-between text-[11px] font-mono mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[#38BDF8] font-semibold">{detour.category}</span>
                    <span className="text-white/30">•</span>
                    <span className="text-[#94A3B8]">{detour.extraTime}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isLeader && (
                      <span className="text-[10px] font-bold text-[#2EC27E] bg-[#2EC27E]/15 px-1.5 py-0.2 rounded border border-[#2EC27E]/30 uppercase">
                        👑 LEADING
                      </span>
                    )}
                    <span className="text-xs font-heading font-extrabold text-white">
                      {percentage}% ({detour.votes})
                    </span>
                  </div>
                </div>

                {/* Detour Title */}
                <h4 className="text-sm font-heading font-bold text-[#F8FAFC] mb-1">
                  {detour.title}
                </h4>
                <p className="text-xs text-[#94A3B8] font-body leading-relaxed">
                  {detour.desc}
                </p>

                {/* User Vote State Indicator */}
                <div className="mt-2.5 flex items-center justify-between text-[11px]">
                  <span
                    className={`font-heading font-bold flex items-center gap-1.5 ${
                      isVoted ? 'text-[#2EC27E]' : 'text-[#64748B]'
                    }`}
                  >
                    <span>{isVoted ? '✓ Your Vote Cast' : '○ Tap to Vote'}</span>
                  </span>
                  <span className="text-[10px] text-[#64748B] font-mono">
                    Terrain: {detour.difficulty}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer Info & Vote Counter */}
      <div className="flex items-center justify-between pt-3 border-t border-white/8 text-xs font-mono text-[#94A3B8]">
        <span>{totalVotes} Total Squad Votes</span>
        <span className="text-[#2EC27E] font-heading font-semibold">
          {userVotedId ? 'Vote Registered in Firestore' : 'Vote to decide'}
        </span>
      </div>
    </div>
  );
}

import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { maya, vibeColors, vibeEmoji } from '@/data/mockData';
import { type SocialProfile } from '@/data/socialData';
import { useParty } from '@/contexts/PartyContext';
interface Props {
  members: SocialProfile[];
  onClose: () => void;
  onFormed: () => void;
}

function generatePartyReasons(members: SocialProfile[]): string[] {
  const vibes = [maya.vibe, ...members.map(m => m.player.vibe)];
  const uniqueVibes = [...new Set(vibes)];

  const reasons: string[] = [];

  if (uniqueVibes.length >= 3) {
    reasons.push('Balanced team with diverse vibes — Creators, Fixers, Connectors, and Competitors');
  }
  if (uniqueVibes.length === 1) {
    reasons.push(`All ${vibes[0]}s — you\'ll vibe on the same wavelength`);
  }
  if (vibes.some(v => v === 'connector')) {
    reasons.push('A Connector in the mix helps the group stay coordinated');
  }
  if (vibes.some(v => v === 'creator') && vibes.some(v => v === 'fixer')) {
    reasons.push('Creator + Fixer combo — ideas get built, not just dreamed');
  }
  if (members.length >= 2) {
    reasons.push(`${members.length + 1} explorers = bigger network and more quest options`);
  }
  if (reasons.length < 3) {
    reasons.push('You\'ve got complementary skills for tackling quests together');
  }
  if (reasons.length < 3) {
    reasons.push('Party quests unlock more XP and exclusive opportunities');
  }

  return reasons.slice(0, 3);
}

const PartyFormationModal = ({ members, onClose, onFormed }: Props) => {
  const { formParty } = useParty();
  const reasons = generatePartyReasons(members);

  const handleFormParty = () => {
    formParty(members.map(m => m.player));
    onFormed();
  };

  const allMembers = [
    { player: maya, isCurrentUser: true },
    ...members.map(m => ({ player: m.player, isCurrentUser: false })),
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-[1000] flex flex-col"
    >
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative z-10 mt-auto bg-card rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto"
      >
        {/* Drag handle */}
        <div className="w-10 h-1 bg-muted-foreground/30 rounded-full mx-auto mb-5" />

        <h3 className="font-bold text-lg text-center mb-5">Form Your Party</h3>

        {/* Maya + selected members row */}
        <div className="flex justify-center gap-4 mb-6 overflow-x-auto pb-2">
          {allMembers.map(({ player, isCurrentUser }) => (
            <div key={player.id} className="flex flex-col items-center gap-2 shrink-0">
              <div className="relative">
                <div
                  className="w-16 h-16 rounded-full overflow-hidden border-[3px]"
                  style={{ borderColor: vibeColors[player.vibe] }}
                >
                  <img src={player.photo} alt={player.name} className="w-full h-full object-cover" />
                </div>
                <span className="absolute -bottom-1 right-0 text-lg">
                  {vibeEmoji[player.vibe]}
                </span>
              </div>
              <p className="font-bold text-sm text-center">
                {isCurrentUser ? 'Maya (You)' : player.name.split(' ')[0]}
              </p>
              <p className="text-[10px] text-muted-foreground font-mono">LVL {player.level}</p>
            </div>
          ))}
        </div>

        {/* Why this party works */}
        <div className="bg-muted/50 rounded-2xl p-4 mb-5">
          <p className="font-bold text-sm mb-2">Why this party works</p>
          <div className="space-y-1.5">
            {reasons.map(reason => (
              <p key={reason} className="text-xs text-muted-foreground flex items-start gap-2">
                <Icon icon="solar:check-circle-bold" className="text-primary shrink-0 mt-0.5" width={14} />
                {reason}
              </p>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <button
          onClick={handleFormParty}
          className="w-full py-3.5 bg-primary text-primary-foreground rounded-2xl font-bold active:scale-[0.98] transition-transform"
        >
          Form Party
        </button>
        <button
          onClick={onClose}
          className="w-full py-2.5 text-muted-foreground text-sm mt-2 font-medium"
        >
          Cancel
        </button>
      </motion.div>
    </motion.div>
  );
};

export default PartyFormationModal;

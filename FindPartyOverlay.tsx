import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { maya, jordan, aisha, vibeColors, vibeEmoji } from '@/data/mockData';
import { useParty } from '@/contexts/PartyContext';

interface Props {
  onClose: () => void;
  onPartyFormed: () => void;
}

const FindPartyOverlay = ({ onClose, onPartyFormed }: Props) => {
  const { formParty } = useParty();
  const [phase, setPhase] = useState<'searching' | 'found'>('searching');

  useEffect(() => {
    const timer = setTimeout(() => setPhase('found'), 3500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-x-0 top-0 z-[1000] flex flex-col"
      style={{ bottom: 'calc(5rem + env(safe-area-inset-bottom, 0px))' }}
    >
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />

      {phase === 'searching' && (
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center">
          {/* Radar rings */}
          <div className="relative w-[200px] h-[200px] flex items-center justify-center">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className="radar-ring absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ animationDelay: `${i * 0.7}s` }}
              />
            ))}
            <div className="w-16 h-16 rounded-full overflow-hidden border-3" style={{ borderColor: vibeColors[maya.vibe] }}>
              <img src={maya.photo} alt="You" className="w-full h-full object-cover" />
            </div>
          </div>
          <p className="mt-8 font-bold text-lg">Finding your crew...</p>
          <p className="text-muted-foreground text-sm mt-1">Looking for explorers who vibe with you</p>
        </div>
      )}

      {phase === 'found' && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative z-10 mt-auto bg-card rounded-t-3xl p-6 max-h-[75vh] overflow-y-auto"
        >
          <div className="w-10 h-1 bg-muted-foreground/30 rounded-full mx-auto mb-4" />
          <h3 className="font-bold text-lg text-center mb-5">Crew Found! 🎉</h3>

          {/* Crew members */}
          <div className="flex justify-center gap-4 mb-6">
            {[maya, jordan, aisha].map(p => (
              <div key={p.id} className="flex flex-col items-center gap-2">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-3" style={{ borderColor: vibeColors[p.vibe] }}>
                    <img src={p.photo} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="absolute -bottom-1 right-0 text-lg">{vibeEmoji[p.vibe]}</span>
                </div>
                <p className="font-bold text-sm">{p.id === 'maya' ? 'Maya (You)' : p.name.split(' ')[0]}</p>
                <p className="text-[10px] text-muted-foreground font-mono">LVL {p.level} • {p.borough}</p>
                <span className="w-2 h-2 rounded-full bg-accent" />
              </div>
            ))}
          </div>

          {/* Why this crew works */}
          <div className="bg-muted/50 rounded-xl p-4 mb-5">
            <p className="font-medium text-sm mb-2">Why this crew works</p>
            <div className="space-y-1.5">
              {['You all hate repetitive work', 'Creative + Technical + Social = balanced team', '3 boroughs = bigger network'].map(reason => (
                <p key={reason} className="text-xs text-muted-foreground flex items-start gap-2">
                  <Icon icon="solar:check-circle-bold" className="text-accent shrink-0 mt-0.5" width={14} />
                  {reason}
                </p>
              ))}
            </div>
          </div>

          {/* Quick chat */}
          <div className="bg-muted/30 rounded-xl p-3 mb-5 space-y-2">
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 border" style={{ borderColor: vibeColors[jordan.vibe] }}>
                <img src={jordan.photo} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="bg-muted rounded-lg px-3 py-1.5">
                <p className="text-xs font-medium">Jordan</p>
                <p className="text-xs text-muted-foreground">Hey! First time exploring?</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 border" style={{ borderColor: vibeColors[aisha.vibe] }}>
                <img src={aisha.photo} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="bg-muted rounded-lg px-3 py-1.5">
                <p className="text-xs font-medium">Aisha</p>
                <p className="text-xs text-muted-foreground">Same here, excited!</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => { formParty([jordan, aisha]); onPartyFormed(); }}
            className="w-full py-3.5 bg-primary text-primary-foreground rounded-full font-bold active:scale-95 transition-transform"
          >
            Let's Explore
          </button>
          <button onClick={onClose} className="w-full py-2 text-muted-foreground text-sm mt-2">
            Leave Party
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default FindPartyOverlay;

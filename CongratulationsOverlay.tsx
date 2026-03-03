import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

interface SimulationResult {
  leadershipStyle: 'aggressive' | 'cautious' | 'strategic';
  xpEarned: number;
  badge: string;
  skills: string[];
}

interface Props {
  result: SimulationResult;
  orgName: string;
  onDismiss: () => void;
}

const confettiEmojis = ['🎉', '⭐', '🏆', '✨', '🎯', '💎'];

function FloatingEmoji({ emoji, delay }: { emoji: string; delay: number }) {
  const x = Math.random() * 300 - 150;
  return (
    <motion.span
      className="absolute text-xl pointer-events-none"
      initial={{ opacity: 0, y: 0, x: 0, scale: 0.5 }}
      animate={{ opacity: [0, 1, 1, 0], y: -120, x, scale: [0.5, 1.2, 1, 0.8] }}
      transition={{ duration: 2, delay, ease: 'easeOut' }}
    >
      {emoji}
    </motion.span>
  );
}

const CongratulationsOverlay = ({ result, orgName, onDismiss }: Props) => {
  const [showDetails, setShowDetails] = useState(false);
  const [xpCounter, setXpCounter] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setShowDetails(true), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const target = result.xpEarned;
    const step = Math.ceil(target / 30);
    const interval = setInterval(() => {
      setXpCounter(prev => {
        if (prev + step >= target) {
          clearInterval(interval);
          return target;
        }
        return prev + step;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [result.xpEarned]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-[1100] flex flex-col items-center justify-center"
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onDismiss} />

      <motion.div
        initial={{ scale: 0.8, y: 40, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 200 }}
        className="relative w-[90%] max-w-sm mx-auto bento-card-strong p-6 overflow-visible"
      >
        {/* Confetti */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 flex items-center justify-center">
          {confettiEmojis.map((e, i) => (
            <FloatingEmoji key={i} emoji={e} delay={i * 0.15} />
          ))}
        </div>

        {/* Badge */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', delay: 0.2, stiffness: 200 }}
          className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-xl mb-4"
        >
          <Icon icon="solar:shield-check-bold" className="text-white" width={40} />
        </motion.div>

        <h2 className="text-xl font-extrabold text-center">Mission Complete!</h2>
        <p className="text-sm text-muted-foreground text-center mt-1">{orgName}</p>

        {/* XP Counter */}
        <motion.div
          className="text-center mt-4"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-3xl font-extrabold text-amber-500">+{xpCounter} XP</p>
        </motion.div>

        {/* Leadership Style */}
        <div className="flex justify-center mt-3">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary/10 text-primary capitalize">
            {result.leadershipStyle} Leader
          </span>
        </div>

        {showDetails && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 space-y-3"
          >
            {/* Badge unlocked */}
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/50">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
                <Icon icon="solar:shield-check-bold" className="text-white" width={16} />
              </div>
              <div>
                <p className="text-xs font-bold">Badge Unlocked</p>
                <p className="text-[10px] text-muted-foreground">{result.badge}</p>
              </div>
            </div>

            {/* Skills */}
            <div className="p-2.5 rounded-xl bg-white/50">
              <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1.5">Skills Practiced</p>
              <div className="flex flex-wrap gap-1">
                {result.skills.map(s => (
                  <span key={s} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Unlocked activities teaser */}
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200/50">
              <p className="text-[10px] font-bold text-amber-700 flex items-center gap-1">
                <Icon icon="solar:lock-unlocked-bold" width={12} />
                New Activities Unlocked
              </p>
              <p className="text-[10px] text-amber-600 mt-0.5">
                Design Sprint Workshop and related opportunities are now available!
              </p>
            </div>
          </motion.div>
        )}

        <button
          onClick={onDismiss}
          className="w-full mt-5 btn-premium py-3 font-bold text-sm active:scale-95"
        >
          Continue Exploring
        </button>
      </motion.div>
    </motion.div>
  );
};

export default CongratulationsOverlay;

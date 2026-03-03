import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

interface Props {
  onStart: () => void;
}

const SplashScreen = ({ onStart }: Props) => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowButton(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 mesh-bg flex flex-col items-center z-50"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex-1" />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex flex-col items-center gap-6 relative z-10"
      >
        <div className="w-20 h-20 rounded-2xl bg-white/60 backdrop-blur-sm flex items-center justify-center shadow-lg">
          <Icon icon="solar:compass-bold-duotone" className="text-primary" width={48} />
        </div>

        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight">
            <span className="gradient-text">FutureQuest</span>
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Your career adventure starts here
          </p>
        </div>

        <div className="w-48 h-1 bg-white/30 rounded-full overflow-hidden mt-4">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(135deg, hsl(228 80% 70%), hsl(270 60% 70%))' }}
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>

      <div className="flex-1" />

      <div className={`mb-20 transition-opacity duration-500 ${showButton ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <button
          onClick={onStart}
          className="btn-premium px-10 py-3.5 font-bold text-base active:scale-95"
        >
          Tap to Start
        </button>
      </div>
    </motion.div>
  );
};

export default SplashScreen;

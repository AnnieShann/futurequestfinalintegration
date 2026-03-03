import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { nearbyNotifications } from '@/data/mockData';

const NearbyToasts = () => {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [dismissed, setDismissed] = useState<Set<number>>(new Set());

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    nearbyNotifications.forEach((_, i) => {
      timers.push(setTimeout(() => {
        if (!dismissed.has(i)) setActiveIndex(i);
      }, 6000 + i * 10000));

      timers.push(setTimeout(() => {
        setActiveIndex(prev => (prev === i ? -1 : prev));
      }, 11000 + i * 10000));
    });

    return () => timers.forEach(clearTimeout);
  }, [dismissed]);

  const dismiss = (i: number) => {
    setDismissed(prev => new Set(prev).add(i));
    setActiveIndex(-1);
  };

  const notification = activeIndex >= 0 ? nearbyNotifications[activeIndex] : null;

  return (
    <div className="absolute left-4 right-4 z-[800]" style={{ top: 'calc(7rem + env(safe-area-inset-top, 0px))' }}>
      <AnimatePresence>
        {notification && (
          <motion.div
            key={notification.id}
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="bg-background/92 backdrop-blur-md rounded-2xl px-4 py-3.5 flex items-center gap-3 border border-border shadow-xl"
          >
            <span className="text-xl">{notification.icon}</span>
            <p className="flex-1 text-sm font-medium">{notification.text}</p>
            <button
              onClick={() => dismiss(activeIndex)}
              className="text-muted-foreground text-sm shrink-0 active:scale-90 transition-transform px-1"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NearbyToasts;

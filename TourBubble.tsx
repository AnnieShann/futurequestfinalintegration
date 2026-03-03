import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TourStepIndicator from './TourStepIndicator';
import novaAvatar from '@/assets/avatar-nova.png';

export type StepType = 'welcome' | 'action' | 'explanation';

export interface TourStepConfig {
  title: string;
  body: string;
  primaryLabel?: string;
  showSkip: boolean;
  position: 'center' | 'below-target' | 'above-target';
  type: StepType;
  /** visual progress — maps multiple internal steps to a user-facing dot */
  dotIndex: number;
}

/** 6 user-visible progress dots (welcome + 5 features) */
export const VISIBLE_DOTS = 6;

interface TourBubbleProps {
  config: TourStepConfig;
  currentStep: number;
  targetRect: DOMRect | null;
  onPrimary: () => void;
  onSkip: () => void;
}

const VIEWPORT_PADDING = 8;

const TourBubble = ({
  config,
  currentStep,
  targetRect,
  onPrimary,
  onSkip,
}: TourBubbleProps) => {
  const bubbleRef = useRef<HTMLDivElement>(null);
  const [clampedStyle, setClampedStyle] = useState<React.CSSProperties>(
    () => getBubbleStyle(config.position, targetRect),
  );

  useEffect(() => {
    const baseStyle = getBubbleStyle(config.position, targetRect);
    setClampedStyle(baseStyle);

    const rafId = requestAnimationFrame(() => {
      const el = bubbleRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const adjusted = { ...baseStyle };

      if (config.position === 'center' || !targetRect) {
        adjusted.top = Math.max(VIEWPORT_PADDING, (vh - rect.height) / 2);
      } else if (config.position === 'below-target') {
        const top = typeof baseStyle.top === 'number' ? baseStyle.top : 0;
        if (top + rect.height > vh - VIEWPORT_PADDING) {
          adjusted.top = Math.max(VIEWPORT_PADDING, vh - rect.height - VIEWPORT_PADDING);
        }
      } else {
        const bottomVal = typeof baseStyle.bottom === 'number' ? baseStyle.bottom : 0;
        if (bottomVal + rect.height > vh - VIEWPORT_PADDING) {
          adjusted.bottom = Math.max(VIEWPORT_PADDING, vh - rect.height - VIEWPORT_PADDING);
        }
      }

      setClampedStyle(adjusted);
    });

    return () => cancelAnimationFrame(rafId);
  }, [config.position, targetRect]);

  return (
    <motion.div
      ref={bubbleRef}
      className="fixed z-[1150] left-2 right-2 mx-auto max-w-[300px]"
      style={clampedStyle}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.25 }}
      role="dialog"
      aria-label={`Tour step ${currentStep}: ${config.title}`}
    >
      <TourStepIndicator currentStep={config.dotIndex} totalSteps={VISIBLE_DOTS} />

      <div className="mt-2 bg-card border border-primary/30 rounded-2xl shadow-xl p-4">
        <div className="flex items-start gap-3">
          <img
            src={novaAvatar}
            alt="Nova"
            className="w-8 h-8 rounded-full shrink-0 object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm text-foreground leading-tight">
              {config.title}
            </p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              {config.body}
            </p>
          </div>
        </div>

        {/* Action steps have no button — user must interact with the real UI */}
        {config.type === 'action' && (
          <div className="mt-3 flex items-center justify-between">
            {config.showSkip ? (
              <button
                onClick={onSkip}
                className="text-muted-foreground text-xs py-2 px-1 min-h-[44px] flex items-center active:scale-95 transition-transform"
                aria-label="Skip the guided tour"
              >
                Skip tour
              </button>
            ) : <div />}
            <span className="text-xs text-primary/70 font-medium animate-pulse">
              👆 Try it!
            </span>
          </div>
        )}

        {/* Welcome and explanation steps have action buttons */}
        {(config.type === 'welcome' || config.type === 'explanation') && config.primaryLabel && (
          <div className="mt-3 flex items-center justify-between">
            {config.showSkip ? (
              <button
                onClick={onSkip}
                className="text-muted-foreground text-xs py-2 px-1 min-h-[44px] flex items-center active:scale-95 transition-transform"
                aria-label="Skip the guided tour"
              >
                Skip tour
              </button>
            ) : <div />}
            <button
              onClick={onPrimary}
              className="btn-premium px-5 py-2 text-xs font-bold active:scale-95 transition-transform"
            >
              {config.primaryLabel}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

function getBubbleStyle(
  position: TourStepConfig['position'],
  targetRect: DOMRect | null,
): React.CSSProperties {
  const margin = 12;

  if (position === 'center' || !targetRect) {
    return {};
  }

  if (position === 'below-target') {
    return { top: targetRect.bottom + margin };
  }

  // above-target
  return { bottom: window.innerHeight - targetRect.top + margin };
}

export default TourBubble;

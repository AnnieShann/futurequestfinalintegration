import { useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import TourOverlay, { type Cutout } from './TourOverlay';
import TourBubble, { type TourStepConfig } from './TourBubble';
import { useTourState } from './useTourState';
import { useToast } from '@/hooks/use-toast';
import { quests, organizations, maya } from '@/data/mockData';
import type { GameMapHandle } from '@/components/map/GameMap';

type AppView = 'map' | 'social';

interface GuidedTourProps {
  onComplete: () => void;
  onSetActiveView: (view: AppView) => void;
  gameMapRef: React.RefObject<GameMapHandle | null>;
}

// ─── Step definitions ───────────────────────────────────────────────
//  1  welcome      — intro bubble, "Let's go!"
//  2  action       — "Tap your avatar!"
//  3  explanation  — inside profile, explains stats
//  4  action       — "Tap 'Quests' to filter!"
//  5  explanation  — filter applied, explains vibes
//  6  action       — "Tap the quest marker!"
//  7  action       — OrgPreviewCard open, "Swipe up!"
//  8  explanation  — OrgDetailSheet open, explains details
//  9  action       — "Tap Social!"
// 10  explanation  — Social hub open, "Finish tour!"

const STEP_CONFIGS: Record<number, TourStepConfig> = {
  1: {
    title: 'Welcome to your NYC map!',
    body: '🗺️ This is your world. Quest markers, partner orgs, and mentors all live here. Let\'s take a quick look around — by doing it for real.',
    primaryLabel: "Let's go!",
    showSkip: false,
    position: 'center',
    type: 'welcome',
    dotIndex: 1,
  },
  2: {
    title: 'Tap your avatar!',
    body: 'See that profile pic in the top-left? That\'s you. Tap it to open your profile.',
    showSkip: true,
    position: 'below-target',
    type: 'action',
    dotIndex: 2,
  },
  3: {
    title: 'This is your HQ',
    body: 'Your stats, level, badges, and Future9 radar all live here. Check back as you earn XP and level up!',
    primaryLabel: 'Got it!',
    showSkip: true,
    position: 'center',
    type: 'explanation',
    dotIndex: 2,
  },
  4: {
    title: "Tap 'Quests' to filter!",
    body: 'See those filter chips? Tap the "Quests" one to see only career experiences on the map.',
    showSkip: true,
    position: 'below-target',
    type: 'action',
    dotIndex: 3,
  },
  5: {
    title: 'Filtered to Quests!',
    body: 'Now you\'re only seeing quest markers. You can filter by Hangouts, Partners, Mentors, or People too. Each has a different vibe!',
    primaryLabel: 'Got it!',
    showSkip: true,
    position: 'below-target',
    type: 'explanation',
    dotIndex: 3,
  },
  6: {
    title: 'Tap the quest marker!',
    body: 'See that ❗ marker? That\'s a real quest waiting for you. Tap it to find out more.',
    showSkip: true,
    position: 'above-target',
    type: 'action',
    dotIndex: 4,
  },
  7: {
    title: 'Nice find!',
    body: 'This card gives you the quick scoop — what it is, when, and how good a vibe match it is. Swipe up or tap to see full details!',
    showSkip: true,
    position: 'above-target',
    type: 'action',
    dotIndex: 4,
  },
  8: {
    title: 'The full picture',
    body: "Here's everything — what you'll do, who you'll meet, and how much XP you'll earn. When you're ready, accept the quest!",
    primaryLabel: 'Got it!',
    showSkip: true,
    position: 'center',
    type: 'explanation',
    dotIndex: 4,
  },
  9: {
    title: 'Tap the Social tab!',
    body: 'One last thing — see that Social button at the bottom? Tap it!',
    showSkip: true,
    position: 'above-target',
    type: 'action',
    dotIndex: 5,
  },
  10: {
    title: 'Your crew lives here',
    body: 'Find a party, chat with peers, and grow your network. Everything social is one tap away.',
    primaryLabel: 'Finish tour!',
    showSkip: false,
    position: 'center',
    type: 'explanation',
    dotIndex: 6,
  },
};

function getFirstUnlockedQuest() {
  return quests.find(q => !q.locked);
}

function getTargetSelector(step: number): string | null {
  switch (step) {
    case 2: return '[data-tour="avatar"]';
    case 4: return '[data-tour="filter-quests"]';
    case 5: return '[data-tour="filter-bar"]';
    case 6: return '[data-tour="quest-marker"]';
    case 7: return '[data-tour="org-preview"]';
    case 9: return '[data-tour="social-tab"]';
    default: return null;
  }
}

function rectToCutout(rect: DOMRect, padding = 8): Cutout {
  return {
    x: rect.x - padding,
    y: rect.y - padding,
    w: rect.width + padding * 2,
    h: rect.height + padding * 2,
    rx: 12,
  };
}

function circleCutout(rect: DOMRect, padding = 6): Cutout {
  const size = Math.max(rect.width, rect.height) + padding * 2;
  return {
    x: rect.x + rect.width / 2 - size / 2,
    y: rect.y + rect.height / 2 - size / 2,
    w: size,
    h: size,
    rx: size / 2,
  };
}

const GuidedTour = ({
  onComplete,
  onSetActiveView,
  gameMapRef,
}: GuidedTourProps) => {
  const { toast } = useToast();

  const getMap = useCallback(() => gameMapRef.current?.getMap() ?? null, [gameMapRef]);
  const handle = useCallback(() => gameMapRef.current, [gameMapRef]);

  const restoreMapInteraction = useCallback(() => {
    const map = getMap();
    if (!map) return;
    map.dragging.enable();
    map.scrollWheelZoom.enable();
    map.doubleClickZoom.enable();
    map.touchZoom.enable();
  }, [getMap]);

  const cleanup = useCallback(() => {
    restoreMapInteraction();
    handle()?.setActiveFilter('All');
    handle()?.setOverlay('none');
    onSetActiveView('map');
  }, [restoreMapInteraction, handle, onSetActiveView]);

  const tour = useTourState(() => {
    cleanup();
    onComplete();
    toast({ title: "You're ready! Go explore your city. ✨", duration: 3000 });
  });

  const [cutout, setCutout] = useState<Cutout | null>(null);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [mapFlying, setMapFlying] = useState(false);
  const rafRef = useRef<number>(0);
  const peekTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const measureTarget = useCallback((step: number) => {
    const selector = getTargetSelector(step);
    if (!selector) {
      setCutout(null);
      setTargetRect(null);
      return;
    }
    const el = document.querySelector(selector);
    if (!el) {
      setCutout(null);
      setTargetRect(null);
      return;
    }
    const rect = el.getBoundingClientRect();
    setTargetRect(rect);
    setCutout(step === 2 ? circleCutout(rect) : rectToCutout(rect));
  }, []);

  // Re-measure target on animation frame (skip while map is mid-flight)
  useEffect(() => {
    if (!tour.isActive || mapFlying) return;
    const tick = () => {
      measureTarget(tour.step);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [tour.step, tour.isActive, mapFlying, measureTarget]);

  // Step-specific side effects
  useEffect(() => {
    if (!tour.isActive) return;

    switch (tour.step) {
      case 1: {
        const map = getMap();
        if (map) {
          setMapFlying(true);
          map.once('moveend', () => setMapFlying(false));
          map.flyTo(maya.location, 13, { duration: 1.2 });
        }
        break;
      }
      case 6: {
        const quest = getFirstUnlockedQuest();
        const map = getMap();
        if (quest && map) {
          setMapFlying(true);
          setCutout(null);
          setTargetRect(null);
          map.dragging.disable();
          map.scrollWheelZoom.disable();
          map.doubleClickZoom.disable();
          map.touchZoom.disable();
          map.once('moveend', () => {
            setTimeout(() => setMapFlying(false), 400);
          });
          map.flyTo(quest.location, 16, { duration: 1.2 });
        }
        break;
      }
    }
  }, [tour.step, tour.isActive, getMap]);

  // Track quest marker position on map move (step 6, after fly completes)
  useEffect(() => {
    const map = getMap();
    if (!map || tour.step !== 6 || mapFlying) return;

    const onMove = () => measureTarget(6);
    map.on('move', onMove);
    map.on('zoom', onMove);

    return () => {
      map.off('move', onMove);
      map.off('zoom', onMove);
    };
  }, [tour.step, getMap, mapFlying, measureTarget]);

  // Handle user tapping the real highlighted element (action steps)
  const handleCutoutClick = useCallback(() => {
    const config = STEP_CONFIGS[tour.step];
    if (!config || config.type !== 'action') return;

    switch (tour.step) {
      case 2: {
        handle()?.setOverlay('profile');
        tour.next();
        break;
      }
      case 4: {
        handle()?.setActiveFilter('Quests');
        tour.next();
        break;
      }
      case 6: {
        restoreMapInteraction();
        const quest = getFirstUnlockedQuest();
        if (quest) {
          handle()?.selectOrg(quest.id);
        }
        tour.next();
        break;
      }
      case 7: {
        handle()?.setOverlay('orgDetail');
        tour.next();
        break;
      }
      case 9: {
        onSetActiveView('social');
        tour.next();
        break;
      }
    }
  }, [tour, handle, restoreMapInteraction, onSetActiveView]);

  // Handle primary button on explanation/welcome steps
  const handlePrimary = useCallback(() => {
    switch (tour.step) {
      case 1:
        tour.next();
        break;
      case 3:
        handle()?.setOverlay('none');
        tour.next();
        break;
      case 5:
        tour.next();
        break;
      case 8:
        handle()?.setOverlay('none');
        handle()?.setActiveFilter('All');
        tour.next();
        break;
      case 10:
        onSetActiveView('map');
        tour.complete();
        break;
      default:
        tour.next();
    }
  }, [tour, handle, onSetActiveView]);

  const handleSkip = useCallback(() => {
    if (peekTimerRef.current) clearTimeout(peekTimerRef.current);
    cancelAnimationFrame(rafRef.current);
    cleanup();
    tour.skip();
  }, [tour, cleanup]);

  if (!tour.isActive) return null;

  const config = STEP_CONFIGS[tour.step];
  if (!config) return null;

  const isActionStep = config.type === 'action';

  return (
    <AnimatePresence mode="wait">
      <div key={tour.step}>
        <TourOverlay cutout={cutout} />

        {cutout && isActionStep && (
          <div
            className="fixed z-[1110] cursor-pointer"
            style={{
              left: cutout.x,
              top: cutout.y,
              width: cutout.w,
              height: cutout.h,
              borderRadius: cutout.rx,
            }}
            onClick={handleCutoutClick}
          />
        )}

        <TourBubble
          config={config}
          currentStep={tour.step}
          targetRect={targetRect}
          onPrimary={handlePrimary}
          onSkip={handleSkip}
        />
      </div>
    </AnimatePresence>
  );
};

export default GuidedTour;

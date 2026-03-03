import { useState, useCallback, useRef } from 'react';

const TOUR_KEY = 'futurequest_tour_completed';
const TOTAL_STEPS = 10;
const DEBOUNCE_MS = 400;

export interface TourState {
  step: number;
  totalSteps: number;
  isActive: boolean;
  next: () => void;
  goTo: (step: number) => void;
  skip: () => void;
  complete: () => void;
}

export function shouldShowTour(): boolean {
  return !localStorage.getItem(TOUR_KEY);
}

export function useTourState(onComplete: () => void): TourState {
  const [step, setStep] = useState(1);
  const [isActive, setIsActive] = useState(true);
  const lockRef = useRef(false);

  const finish = useCallback(() => {
    setIsActive(false);
    localStorage.setItem(TOUR_KEY, 'true');
    onComplete();
  }, [onComplete]);

  const next = useCallback(() => {
    if (lockRef.current) return;
    lockRef.current = true;
    setTimeout(() => { lockRef.current = false; }, DEBOUNCE_MS);

    setStep(prev => {
      if (prev >= TOTAL_STEPS) {
        finish();
        return prev;
      }
      return prev + 1;
    });
  }, [finish]);

  const goTo = useCallback((target: number) => {
    if (lockRef.current) return;
    lockRef.current = true;
    setTimeout(() => { lockRef.current = false; }, DEBOUNCE_MS);
    setStep(target);
  }, []);

  const skip = useCallback(() => {
    finish();
  }, [finish]);

  return { step, totalSteps: TOTAL_STEPS, isActive, next, goTo, skip, complete: finish };
}

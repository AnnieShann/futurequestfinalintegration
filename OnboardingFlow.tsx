import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import {
  passionCategories,
  deriveVibeFromPassions,
  vibeColors,
  vibeEmoji,
  vibeStatements,
  vibeOptions,
  type Vibe,
} from '@/data/mockData';

interface Props {
  onComplete: (data: { passions: string[]; vibe: Vibe; name: string; profilePhoto?: string }) => void;
}

type Step = 'welcome' | 'intro' | 'info' | 'vibecheck' | 'profile';

const STEPS: Step[] = ['welcome', 'intro', 'info', 'vibecheck', 'profile'];
const grades = ['9th', '10th', '11th', '12th'];

function useKeyboardAwareHeight() {
  const [bottomPad, setBottomPad] = useState(0);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    const onResize = () => {
      const keyboardHeight = window.innerHeight - vv.height;
      setBottomPad(keyboardHeight > 50 ? keyboardHeight : 0);
    };

    vv.addEventListener('resize', onResize);
    return () => vv.removeEventListener('resize', onResize);
  }, []);

  return bottomPad;
}

const OnboardingFlow = ({ onComplete }: Props) => {
  const [step, setStep] = useState<Step>('welcome');
  const [name, setName] = useState('');
  const [zip, setZip] = useState('');
  const [grade, setGrade] = useState('');
  const [selectedPassions, setSelectedPassions] = useState<string[]>([]);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const cameraRef = useRef<HTMLVideoElement>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const keyboardPad = useKeyboardAwareHeight();

  const handleInputFocus = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    setTimeout(() => {
      e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
  }, []);

  const stepIndex = STEPS.indexOf(step);
  const derivedVibe = selectedPassions.length >= 2 ? deriveVibeFromPassions(selectedPassions) : null;

  const togglePassion = (id: string) => {
    if (selectedPassions.includes(id)) {
      setSelectedPassions(selectedPassions.filter(x => x !== id));
    } else if (selectedPassions.length < 4) {
      setSelectedPassions([...selectedPassions, id]);
    }
  };

  const cropToSquareDataUrl = (source: HTMLVideoElement | HTMLImageElement) => {
    const canvas = document.createElement('canvas');
    const size = 256;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    const w = source instanceof HTMLVideoElement ? source.videoWidth : source.width;
    const h = source instanceof HTMLVideoElement ? source.videoHeight : source.height;
    const min = Math.min(w, h);
    ctx.drawImage(source, (w - min) / 2, (h - min) / 2, min, min, 0, 0, size, size);
    return canvas.toDataURL('image/jpeg', 0.85);
  };

  const stopCamera = () => {
    cameraStreamRef.current?.getTracks().forEach(t => t.stop());
    cameraStreamRef.current = null;
    setCameraActive(false);
  };

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 512 }, height: { ideal: 512 } },
        audio: false,
      });
      cameraStreamRef.current = stream;
      setCameraActive(true);
      requestAnimationFrame(() => {
        if (cameraRef.current) {
          cameraRef.current.srcObject = stream;
          cameraRef.current.play();
        }
      });
    } catch {
      setCameraError('Camera not available');
      fileInputRef.current?.click();
    }
  };

  const capturePhoto = () => {
    if (!cameraRef.current) return;
    setProfilePhoto(cropToSquareDataUrl(cameraRef.current));
    stopCamera();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => setProfilePhoto(cropToSquareDataUrl(img));
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 mesh-bg flex flex-col overflow-hidden">
      {step !== 'welcome' && (
        <div className="px-6 pt-4 pb-2 flex gap-1.5">
          {STEPS.slice(1).map((_, i) => (
            <div key={i} className="flex-1 h-1 rounded-full bg-white/30 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, hsl(228 80% 70%), hsl(270 60% 70%))',
                  width: i < stepIndex ? '100%' : '0%',
                }}
              />
            </div>
          ))}
        </div>
      )}

      {step === 'welcome' && (
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <div className="w-20 h-20 rounded-full bg-white/60 backdrop-blur-sm flex items-center justify-center mb-6 shadow-lg">
            <Icon icon="solar:compass-bold-duotone" className="text-primary" width={44} />
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight mb-3">
            <span className="gradient-text">FutureQuest</span>
          </h1>

          <p className="text-muted-foreground text-base max-w-[280px] leading-relaxed mb-2">
            Discover careers around NYC like a multiplayer game.
          </p>
          <p className="text-muted-foreground/70 text-sm max-w-[260px]">
            This isn't a quiz. It's your edge in NYC.
          </p>

          <button
            onClick={() => setStep('intro')}
            className="mt-10 btn-premium px-10 py-4 text-base font-semibold flex items-center gap-2 active:scale-95"
          >
            Get Started
            <Icon icon="solar:arrow-right-linear" width={18} />
          </button>
        </div>
      )}

      {step === 'intro' && (
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <motion.div
            className="relative rounded-full overflow-hidden shadow-[0_8px_40px_hsl(228_80%_70%/0.25)] border-4 border-white/60 mb-6"
            style={{ width: 200, height: 200 }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <video
              ref={videoRef}
              src="/videos/assessment-avatar.mp4"
              playsInline
              preload="auto"
              onCanPlay={() => setVideoReady(true)}
              onEnded={() => { setVideoEnded(true); setVideoPlaying(false); }}
              className="w-full h-full object-cover object-center"
            />
            {!videoPlaying && !videoEnded && (
              <button
                onClick={() => {
                  const v = videoRef.current;
                  if (v) { v.currentTime = 0; v.muted = false; v.volume = 1; v.play(); setVideoPlaying(true); }
                }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm"
              >
                <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center mb-2">
                  <Icon icon="solar:play-bold" className="w-7 h-7 text-white" />
                </div>
                <span className="text-white text-sm font-semibold">Tap to play</span>
                <span className="text-white/60 text-[10px] mt-0.5">Meet Nova, your AI guide</span>
              </button>
            )}
            {videoEnded && (
              <button
                onClick={() => {
                  const v = videoRef.current;
                  if (v) { v.currentTime = 0; v.play(); setVideoPlaying(true); setVideoEnded(false); }
                }}
                className="absolute bottom-2 right-2 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm flex items-center gap-1 border border-white/20"
              >
                <Icon icon="solar:restart-bold" className="w-3.5 h-3.5 text-white" />
                <span className="text-[10px] text-white font-medium">Replay</span>
              </button>
            )}
          </motion.div>

          <AnimatePresence>
            {videoPlaying && (
              <motion.div
                className="bento-card-strong px-5 py-4 text-center max-w-xs mb-6"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              >
                <p className="text-foreground/90 font-medium text-sm leading-relaxed">
                  Hi, I'm Nova — your AI career assistant.
                </p>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Listen to the intro, then let's explore your passions.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {!videoPlaying && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              {!videoReady && (
                <div className="bento-card-strong px-5 py-4 text-center max-w-xs mb-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Icon icon="solar:star-bold" className="w-5 h-5 text-primary" />
                    <p className="text-foreground/90 font-bold text-sm">Meet Nova</p>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Your AI career guide. Nova will help you discover your strengths and find opportunities across NYC.
                  </p>
                </div>
              )}
            </motion.div>
          )}

          <button
            onClick={() => setStep('info')}
            className={`btn-premium px-10 py-4 text-base font-semibold flex items-center gap-2 active:scale-95 ${videoPlaying && !videoEnded ? 'opacity-50' : ''}`}
          >
            {videoEnded ? 'Continue' : 'Skip Intro'}
            <Icon icon="solar:arrow-right-linear" width={18} />
          </button>
        </div>
      )}

      {step === 'info' && (
        <div
          className="flex-1 flex flex-col px-6 pt-6 overflow-y-auto"
          style={{ paddingBottom: keyboardPad > 0 ? keyboardPad + 24 : 24, scrollPaddingBottom: 80 }}
        >
          <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider mb-1">Step 1 of 3</p>
          <h2 className="text-2xl font-bold mb-1">Let's get started</h2>
          <p className="text-muted-foreground text-sm mb-6">Tell us a bit about you.</p>

          <div className="bento-card-strong p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-1.5">First name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                onFocus={handleInputFocus}
                placeholder="Your first name"
                className="w-full h-12 rounded-2xl px-4 text-sm bg-white/60 border border-border outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-1.5">ZIP code</label>
              <input
                type="text"
                value={zip}
                onChange={e => setZip(e.target.value)}
                onFocus={handleInputFocus}
                placeholder="e.g. 10001"
                maxLength={5}
                inputMode="numeric"
                className="w-full h-12 rounded-2xl px-4 text-sm bg-white/60 border border-border outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-1.5">Grade</label>
              <select
                value={grade}
                onChange={e => setGrade(e.target.value)}
                onFocus={handleInputFocus}
                className="w-full h-12 rounded-2xl px-4 text-sm bg-white/60 border border-border outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all appearance-none"
              >
                <option value="">Select grade</option>
                {grades.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex-1 min-h-4" />
          <button
            disabled={!name.trim() || !zip.trim() || !grade}
            onClick={() => setStep('vibecheck')}
            className="mt-6 w-full btn-premium py-4 text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-30 disabled:pointer-events-none active:scale-95 shrink-0"
          >
            Continue <Icon icon="solar:arrow-right-linear" width={16} />
          </button>
        </div>
      )}

      {step === 'vibecheck' && (
        <div className="flex-1 flex flex-col px-6 pt-4 pb-6 overflow-y-auto">
          <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider mb-1">Step 2 of 3</p>
          <h2 className="text-2xl font-bold mb-1">Vibe Check</h2>
          <p className="text-muted-foreground text-sm mb-5">Pick 2-4 passions that feel most like you</p>

          <div className="grid grid-cols-3 gap-2.5">
            {passionCategories.map(cat => {
              const selected = selectedPassions.includes(cat.id);
              return (
                <motion.button
                  key={cat.id}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => togglePassion(cat.id)}
                  className={`relative flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-colors ${
                    selected
                      ? 'border-transparent shadow-md'
                      : 'border-transparent bg-white/40 backdrop-blur-sm'
                  }`}
                  style={selected ? {
                    background: `${cat.color}20`,
                    borderColor: cat.color,
                    boxShadow: `0 4px 16px ${cat.color}30`,
                  } : {}}
                >
                  <span className="text-2xl">{cat.emoji}</span>
                  <span className="text-xs font-semibold text-center leading-tight">{cat.label}</span>
                  {selected && (
                    <div
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-white"
                      style={{ background: cat.color }}
                    >
                      <Icon icon="solar:check-read-linear" width={12} />
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>

          {derivedVibe && (
            <div className="mt-4 p-3 rounded-2xl bg-white/50 backdrop-blur-sm border border-white/60 text-center">
              <p className="text-xs text-muted-foreground">Your vibe is emerging...</p>
              <p className="font-bold mt-0.5" style={{ color: vibeColors[derivedVibe] }}>
                {vibeEmoji[derivedVibe]} {vibeOptions.find(v => v.vibe === derivedVibe)?.title}
              </p>
            </div>
          )}

          <div className="flex gap-3 mt-4">
            <button
              onClick={() => setStep('info')}
              className="px-6 py-3.5 bg-white/50 backdrop-blur-sm text-foreground rounded-full font-medium active:scale-95 transition-transform"
            >
              Back
            </button>
            <button
              disabled={selectedPassions.length < 2}
              onClick={() => setStep('profile')}
              className="flex-1 btn-premium py-3.5 font-semibold disabled:opacity-30 disabled:pointer-events-none active:scale-95"
            >
              Continue ({selectedPassions.length}/4)
            </button>
          </div>
        </div>
      )}

      {step === 'profile' && derivedVibe && (
        <div className="flex-1 flex flex-col items-center px-6 pt-6 pb-6 overflow-y-auto">
          <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider mb-4">Step 3 of 3</p>
          <h2 className="text-2xl font-bold mb-1">You're all set!</h2>
          <p className="text-muted-foreground text-sm mb-5">Add a profile pic so your party can find you</p>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {cameraActive ? (
            <div className="relative mb-5">
              <div
                className="w-40 h-40 rounded-full overflow-hidden border-4 shadow-lg"
                style={{ borderColor: vibeColors[derivedVibe] }}
              >
                <video
                  ref={cameraRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover mirror"
                  style={{ transform: 'scaleX(-1)' }}
                />
              </div>
              <div className="flex justify-center gap-3 mt-4">
                <button
                  onClick={stopCamera}
                  className="w-10 h-10 rounded-full bg-white/60 backdrop-blur-sm flex items-center justify-center border border-border active:scale-90 transition-transform"
                >
                  <Icon icon="solar:close-circle-bold" width={22} className="text-muted-foreground" />
                </button>
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={capturePhoto}
                  className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
                  style={{ background: vibeColors[derivedVibe] }}
                >
                  <div className="w-12 h-12 rounded-full border-[3px] border-white" />
                </motion.button>
                <button
                  onClick={() => { stopCamera(); fileInputRef.current?.click(); }}
                  className="w-10 h-10 rounded-full bg-white/60 backdrop-blur-sm flex items-center justify-center border border-border active:scale-90 transition-transform"
                >
                  <Icon icon="solar:gallery-bold" width={20} className="text-muted-foreground" />
                </button>
              </div>
            </div>
          ) : (
            <motion.button
              whileTap={{ scale: 0.93 }}
              onClick={profilePhoto ? startCamera : startCamera}
              className="relative mb-5 group"
            >
              <div
                className="w-28 h-28 rounded-full overflow-hidden border-4 shadow-lg transition-shadow group-active:shadow-xl"
                style={{ borderColor: vibeColors[derivedVibe] }}
              >
                {profilePhoto ? (
                  <img src={profilePhoto} alt="Your photo" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-muted to-muted/60 flex flex-col items-center justify-center gap-1">
                    <Icon icon="solar:camera-bold" width={28} className="text-muted-foreground" />
                    <span className="text-[10px] font-medium text-muted-foreground">Take photo</span>
                  </div>
                )}
              </div>
              <span className="absolute -bottom-1 -right-1 text-xl">
                {vibeEmoji[derivedVibe]}
              </span>
              {profilePhoto && (
                <div className="absolute -top-1 -left-1 w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center border border-border">
                  <Icon icon="solar:camera-bold" width={14} className="text-muted-foreground" />
                </div>
              )}
            </motion.button>
          )}
          {cameraError && !cameraActive && (
            <p className="text-[10px] text-muted-foreground -mt-3 mb-2">{cameraError} — pick from gallery instead</p>
          )}

          <div className="bento-card-strong px-6 py-5 w-full max-w-sm text-center mb-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Your vibe</p>
            <p className="text-xl font-bold" style={{ color: vibeColors[derivedVibe] }}>
              {vibeEmoji[derivedVibe]} {vibeOptions.find(v => v.vibe === derivedVibe)?.title}
            </p>
            <p className="text-sm text-muted-foreground mt-1.5 italic">
              "{vibeStatements[derivedVibe]}"
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5 justify-center mb-4">
            {selectedPassions.map(id => {
              const cat = passionCategories.find(c => c.id === id)!;
              return (
                <span
                  key={id}
                  className="text-xs font-medium px-3 py-1 rounded-full"
                  style={{ background: `${cat.color}20`, color: cat.color }}
                >
                  {cat.emoji} {cat.label}
                </span>
              );
            })}
          </div>

          <div className="p-4 rounded-2xl bg-white/40 backdrop-blur-sm border border-white/50 w-full max-w-sm">
            <p className="text-xs text-muted-foreground uppercase tracking-wider text-center mb-3">How others see you</p>
            <div className="flex items-center gap-3 justify-center">
              <div
                className="w-10 h-10 rounded-full overflow-hidden border-2"
                style={{ borderColor: vibeColors[derivedVibe] }}
              >
                {profilePhoto ? (
                  <img src={profilePhoto} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <Icon icon="solar:user-bold" width={18} className="text-muted-foreground" />
                  </div>
                )}
              </div>
              <div>
                <p className="font-bold text-sm">{name || 'You'} {vibeEmoji[derivedVibe]}</p>
                <p className="text-xs text-muted-foreground">LVL 1 &bull; {zip ? `ZIP ${zip}` : 'NYC'}</p>
              </div>
            </div>
          </div>

          <div className="flex-1" />

          <div className="flex gap-3 w-full mt-6">
            <button
              onClick={() => setStep('vibecheck')}
              className="px-6 py-3.5 bg-white/50 backdrop-blur-sm text-foreground rounded-full font-medium active:scale-95 transition-transform"
            >
              Back
            </button>
            <button
              onClick={() => onComplete({ passions: selectedPassions, vibe: derivedVibe, name, profilePhoto: profilePhoto || undefined })}
              className="flex-1 btn-premium py-3.5 font-bold text-base active:scale-95"
            >
              Explore the Map
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnboardingFlow;

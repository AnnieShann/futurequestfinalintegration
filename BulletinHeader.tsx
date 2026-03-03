import { Icon } from '@iconify/react';

interface Props {
  orgName: string;
  noteCount: number;
  mode: 'foryou' | 'all';
  onModeChange: (mode: 'foryou' | 'all') => void;
  onClose: () => void;
}

export default function BulletinHeader({
  orgName,
  noteCount,
  mode,
  onModeChange,
  onClose,
}: Props) {
  return (
    <div className="sticky top-0 z-10 px-4 pt-4 pb-3 bg-[#C4956A] border-b border-[#8B6914]/30">
      <div className="flex justify-center mb-3">
        <div className="w-12 h-1.5 bg-white/30 rounded-full" />
      </div>

      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-bold text-lg text-white drop-shadow-sm">
            Community Board
          </h3>
          <p className="text-xs text-white/70 mt-0.5">
            {orgName} · {noteCount} tip{noteCount !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center active:scale-90 transition-transform"
        >
          <Icon icon="solar:close-circle-bold" width={20} className="text-white" />
        </button>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-1 bg-black/15 rounded-full p-0.5">
        <button
          onClick={() => onModeChange('foryou')}
          className={`flex-1 text-xs font-bold py-1.5 rounded-full transition-all ${
            mode === 'foryou'
              ? 'bg-white text-[#8B6914] shadow-sm'
              : 'text-white/80'
          }`}
        >
          ✨ For You
        </button>
        <button
          onClick={() => onModeChange('all')}
          className={`flex-1 text-xs font-bold py-1.5 rounded-full transition-all ${
            mode === 'all'
              ? 'bg-white text-[#8B6914] shadow-sm'
              : 'text-white/80'
          }`}
        >
          All Tips
        </button>
      </div>
    </div>
  );
}

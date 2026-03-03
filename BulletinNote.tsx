import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import {
  type BulletinNote as BulletinNoteType,
  postItColors,
  categoryLabels,
} from '@/data/bulletinData';
import { vibeColors, vibeEmoji, maya } from '@/data/mockData';
import { isVibeMatch } from '@/hooks/useBulletinPersonalization';

interface Props {
  note: BulletinNoteType;
  index: number;
  isHighlighted: boolean;
  onLike: (noteId: string) => void;
}

const roleLabels: Record<string, { emoji: string; label: string }> = {
  mentor: { emoji: '🎓', label: 'Mentor' },
  employer: { emoji: '🏢', label: 'Employer' },
  staff: { emoji: '📋', label: 'Staff' },
};

export default function BulletinNoteCard({ note, index, isHighlighted, onLike }: Props) {
  const bg = postItColors[note.color];
  const isAuthority = note.authorRole !== 'student';
  const liked = note.likedByIds.includes(maya.id);
  const vibeMatch = isVibeMatch(note, maya);

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, type: 'spring', damping: 20, stiffness: 260 }}
      className="break-inside-avoid mb-3 relative"
      style={{ transform: `rotate(${note.rotation}deg)` }}
    >
      <div
        className={`relative rounded-sm px-3.5 pt-5 pb-3 shadow-[2px_3px_6px_rgba(0,0,0,0.15)] ${
          note.pinned ? 'ring-2 ring-amber-300/50' : ''
        } ${isHighlighted ? 'ring-2' : ''}`}
        style={{
          backgroundColor: bg,
          ...(isHighlighted ? { ringColor: vibeColors[maya.vibe] + '60' } : {}),
          ...(isAuthority ? { borderLeft: `3px solid ${vibeColors[note.authorVibe]}` } : {}),
        }}
      >
        {/* Pin */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-base select-none">
          📌
        </div>

        {/* Authority badge */}
        {isAuthority && roleLabels[note.authorRole] && (
          <span className="absolute top-1 right-1.5 text-[9px] font-bold bg-white/60 backdrop-blur-sm px-1.5 py-0.5 rounded">
            {roleLabels[note.authorRole].emoji} {roleLabels[note.authorRole].label}
          </span>
        )}

        {/* Vibe-match tag */}
        {vibeMatch && (
          <div
            className="text-[9px] font-bold px-2 py-0.5 rounded-full mb-2 inline-block"
            style={{
              backgroundColor: vibeColors[maya.vibe] + '20',
              color: vibeColors[maya.vibe],
            }}
          >
            {vibeEmoji[maya.vibe]} For {maya.vibe.charAt(0).toUpperCase() + maya.vibe.slice(1)}s
          </div>
        )}

        {/* Body */}
        <p className="text-sm text-gray-800 leading-relaxed">{note.body}</p>

        {/* Link */}
        {note.linkUrl && (
          <a
            href={note.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 underline mt-1.5 block truncate"
            onClick={(e) => e.stopPropagation()}
          >
            🔗 {note.linkLabel || note.linkUrl}
          </a>
        )}

        {/* Footer: author + likes */}
        <div className="flex items-center justify-between mt-2.5 gap-2">
          <span className="text-[10px] text-gray-500 truncate">
            — {note.authorName} {vibeEmoji[note.authorVibe]} Lv.{note.authorRole === 'student' ? '?' : '∞'}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLike(note.id);
            }}
            className={`flex items-center gap-0.5 text-[10px] shrink-0 transition-transform active:scale-125 ${
              liked ? 'text-rose-500' : 'text-gray-400'
            }`}
          >
            <Icon
              icon={liked ? 'solar:heart-bold' : 'solar:heart-linear'}
              width={13}
            />
            {note.likes > 0 && <span>{note.likes}</span>}
          </button>
        </div>

        {/* Sticker */}
        {note.sticker && (
          <span className="absolute bottom-1.5 right-2 text-lg opacity-30 select-none">
            {note.sticker}
          </span>
        )}
      </div>
    </motion.div>
  );
}

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import {
  type PostItColor,
  type NoteCategory,
  postItColors,
  categoryLabels,
} from '@/data/bulletinData';
import { vibeEmoji, type Vibe } from '@/data/mockData';

const COLORS: PostItColor[] = ['yellow', 'pink', 'blue', 'green', 'orange', 'purple'];
const CATEGORIES: NoteCategory[] = [
  'prep-tip', 'logistics', 'social-proof', 'vibe-specific', 'resource', 'insider', 'encouragement',
];
const VIBES: Vibe[] = ['creator', 'fixer', 'connector', 'competitor'];
const STICKERS = ['⭐', '🔥', '💡', '🎯', '🤩', '👟', '🧠', '🚇'];
const MAX_CHARS = 280;

interface Props {
  onSubmit: (
    body: string,
    category: NoteCategory,
    color: PostItColor,
    opts?: { linkUrl?: string; linkLabel?: string; targetVibes?: string[]; sticker?: string },
  ) => void;
  onClose: () => void;
}

export default function BulletinComposeSheet({ onSubmit, onClose }: Props) {
  const [body, setBody] = useState('');
  const [category, setCategory] = useState<NoteCategory>('prep-tip');
  const [color, setColor] = useState<PostItColor>('yellow');
  const [showLink, setShowLink] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkLabel, setLinkLabel] = useState('');
  const [targetVibes, setTargetVibes] = useState<Vibe[]>([]);
  const [sticker, setSticker] = useState<string | undefined>();

  const canSubmit = body.trim().length > 0 && body.length <= MAX_CHARS;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit(body.trim(), category, color, {
      linkUrl: linkUrl || undefined,
      linkLabel: linkLabel || undefined,
      targetVibes: targetVibes.length > 0 ? targetVibes : undefined,
      sticker,
    });
    onClose();
  };

  const toggleVibe = (v: Vibe) => {
    setTargetVibes((prev) =>
      prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v],
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-20 flex items-end"
    >
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="relative w-full bg-card rounded-t-2xl max-h-[80vh] overflow-y-auto"
      >
        <div className="p-4">
          <div className="flex justify-center mb-3">
            <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
          </div>

          <h4 className="font-bold text-base mb-3">Add a tip ✏️</h4>

          {/* Post-it preview */}
          <div
            className="rounded-sm p-3.5 mb-4 shadow-[2px_3px_6px_rgba(0,0,0,0.12)]"
            style={{ backgroundColor: postItColors[color], transform: 'rotate(-1deg)' }}
          >
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value.slice(0, MAX_CHARS))}
              placeholder="Share a tip for other students..."
              className="w-full bg-transparent text-sm text-gray-800 placeholder:text-gray-400 resize-none outline-none min-h-[80px]"
              rows={3}
            />
            <div className="flex justify-between items-center mt-1">
              <span className={`text-[10px] ${body.length > MAX_CHARS - 20 ? 'text-red-500' : 'text-gray-400'}`}>
                {body.length}/{MAX_CHARS}
              </span>
              {sticker && (
                <span className="text-lg opacity-50">{sticker}</span>
              )}
            </div>
          </div>

          {/* Color picker */}
          <div className="mb-4">
            <p className="text-xs font-medium text-muted-foreground mb-2">Color</p>
            <div className="flex gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full border-2 transition-transform ${
                    color === c ? 'scale-110 border-foreground' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: postItColors[c] }}
                />
              ))}
            </div>
          </div>

          {/* Category chips */}
          <div className="mb-4">
            <p className="text-xs font-medium text-muted-foreground mb-2">Category</p>
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`shrink-0 text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                    category === cat
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {categoryLabels[cat].emoji} {categoryLabels[cat].label}
                </button>
              ))}
            </div>
          </div>

          {/* Link toggle */}
          <div className="mb-4">
            {!showLink ? (
              <button
                onClick={() => setShowLink(true)}
                className="text-xs text-primary font-medium flex items-center gap-1"
              >
                <Icon icon="solar:link-bold" width={14} />
                Add a link
              </button>
            ) : (
              <div className="space-y-2">
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full text-sm px-3 py-2 bg-muted rounded-lg border border-border outline-none focus:ring-2 focus:ring-primary/40"
                />
                <input
                  type="text"
                  value={linkLabel}
                  onChange={(e) => setLinkLabel(e.target.value)}
                  placeholder="Link label (optional)"
                  className="w-full text-sm px-3 py-2 bg-muted rounded-lg border border-border outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            )}
          </div>

          {/* Vibe targeting */}
          <div className="mb-4">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              Who is this for? <span className="text-muted-foreground/50">(optional)</span>
            </p>
            <div className="flex gap-2">
              {VIBES.map((v) => (
                <button
                  key={v}
                  onClick={() => toggleVibe(v)}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                    targetVibes.includes(v)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {vibeEmoji[v]} {v.charAt(0).toUpperCase() + v.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Sticker picker */}
          <div className="mb-5">
            <p className="text-xs font-medium text-muted-foreground mb-2">Sticker</p>
            <div className="flex gap-2">
              {STICKERS.map((s) => (
                <button
                  key={s}
                  onClick={() => setSticker(sticker === s ? undefined : s)}
                  className={`w-8 h-8 text-lg rounded-lg flex items-center justify-center transition-transform ${
                    sticker === s ? 'bg-muted scale-110 ring-2 ring-primary' : 'bg-muted/50'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="w-full py-3 bg-primary text-primary-foreground rounded-full font-bold text-base active:scale-95 transition-transform disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Post It!
          </button>
          <button
            onClick={onClose}
            className="w-full py-2 text-muted-foreground text-sm mt-1"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

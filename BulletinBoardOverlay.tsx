import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { type Organization, maya } from '@/data/mockData';
import { useBulletinNotes } from '@/hooks/useBulletinNotes';
import { isVibeMatch } from '@/hooks/useBulletinPersonalization';
import BulletinHeader from './BulletinHeader';
import BulletinNoteCard from './BulletinNote';
import BulletinComposeSheet from './BulletinComposeSheet';

interface Props {
  org: Organization;
  onClose: () => void;
}

export default function BulletinBoardOverlay({ org, onClose }: Props) {
  const { notes, noteCount, mode, setMode, addNote, toggleLike } =
    useBulletinNotes(org.id);
  const [showCompose, setShowCompose] = useState(false);

  const pinnedNotes = notes.filter((n) => n.pinned);
  const regularNotes = notes.filter((n) => !n.pinned);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-[1100] flex flex-col items-center justify-end pb-20"
    >
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="relative w-full max-w-md rounded-t-3xl overflow-hidden max-h-[88vh] flex flex-col"
      >
        {/* Cork board background */}
        <div
          className="flex-1 flex flex-col overflow-hidden"
          style={{
            backgroundColor: '#C4956A',
            backgroundImage: `
              url("data:image/svg+xml,%3Csvg width='4' height='4' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='4' height='4' fill='%23C4956A'/%3E%3Ccircle cx='2' cy='2' r='0.8' fill='%23B8864F' opacity='0.3'/%3E%3C/svg%3E"),
              linear-gradient(135deg, rgba(0,0,0,0.03) 25%, transparent 25%),
              linear-gradient(225deg, rgba(0,0,0,0.03) 25%, transparent 25%)
            `,
            backgroundSize: '4px 4px, 8px 8px, 8px 8px',
            boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.2)',
            borderTop: '4px solid #8B6914',
          }}
        >
          <BulletinHeader
            orgName={org.name}
            noteCount={noteCount}
            mode={mode}
            onModeChange={setMode}
            onClose={onClose}
          />

          {/* Notes area */}
          <div className="flex-1 overflow-y-auto px-3 pt-4 pb-24">
            {notes.length === 0 ? (
              <div className="text-center text-white/60 text-sm pt-16">
                <span className="text-3xl block mb-3">📌</span>
                No tips yet — be the first to leave one!
              </div>
            ) : (
              <>
                {/* Pinned section */}
                {pinnedNotes.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-px flex-1 border-t border-dashed border-white/30" />
                      <span className="text-[10px] font-bold text-white/60 uppercase tracking-wider">
                        📌 Pinned
                      </span>
                      <div className="h-px flex-1 border-t border-dashed border-white/30" />
                    </div>
                    <div className="columns-2 gap-3">
                      {pinnedNotes.map((note, i) => (
                        <BulletinNoteCard
                          key={note.id}
                          note={note}
                          index={i}
                          isHighlighted={mode === 'foryou' && isVibeMatch(note, maya)}
                          onLike={toggleLike}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Regular notes */}
                <div className="columns-2 gap-3">
                  {regularNotes.map((note, i) => (
                    <BulletinNoteCard
                      key={note.id}
                      note={note}
                      index={i + pinnedNotes.length}
                      isHighlighted={mode === 'foryou' && isVibeMatch(note, maya)}
                      onLike={toggleLike}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Decorative doodles */}
          <div className="absolute top-20 left-2 text-white/10 text-2xl select-none pointer-events-none rotate-12">
            ✦
          </div>
          <div className="absolute top-32 right-3 text-white/10 text-xl select-none pointer-events-none -rotate-6">
            ☆
          </div>
          <div className="absolute bottom-28 left-4 text-white/8 text-2xl select-none pointer-events-none rotate-45">
            →
          </div>

          {/* Washi tape decorative strip */}
          <div
            className="absolute top-14 -left-2 w-20 h-4 opacity-20 pointer-events-none select-none"
            style={{
              background: 'repeating-linear-gradient(45deg, transparent, transparent 3px, #fff 3px, #fff 6px)',
              transform: 'rotate(-15deg)',
              borderRadius: '2px',
            }}
          />
        </div>

        {/* FAB: Add a tip */}
        <button
          onClick={() => setShowCompose(true)}
          className="absolute bottom-6 right-4 z-10 flex items-center gap-2 py-2.5 px-5 bg-primary text-primary-foreground rounded-full font-bold text-sm shadow-lg active:scale-95 transition-transform animate-bounce-subtle"
        >
          <Icon icon="solar:pen-bold" width={16} />
          Add a tip
        </button>

        {/* Compose overlay */}
        <AnimatePresence>
          {showCompose && (
            <BulletinComposeSheet
              onSubmit={addNote}
              onClose={() => setShowCompose(false)}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

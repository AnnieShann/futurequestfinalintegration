import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { type Organization, vibeColors, vibeEmoji } from '@/data/mockData';
import { getNoteCount } from '@/data/bulletinData';

const TYPE_LABELS: Record<string, string> = {
  quest: 'Quest',
  internship: 'Internship',
  mentorship: 'Mentorship',
  hangout: 'Hangout',
  partner: 'Partner',
};

interface OrgPreviewCardProps {
  org: Organization;
  onExpand: () => void;
  onClose: () => void;
  onOpenBoard: () => void;
}

const OrgPreviewCard = ({ org, onExpand, onClose, onOpenBoard }: OrgPreviewCardProps) => {
  const color = vibeColors[org.vibe];
  const isPartner = org.type === 'partner';
  const dateNotTbd = org.date && org.date !== 'TBD';
  const tipCount = getNoteCount(org.id);

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.3}
      onDragEnd={(_e, info) => {
        if (info.offset.y < -50 || info.velocity.y < -200) {
          onExpand();
        } else if (info.offset.y > 50 || info.velocity.y > 200) {
          onClose();
        }
      }}
      onClick={onExpand}
      data-tour="org-preview"
      className="fixed left-3 right-3 z-[950] cursor-pointer"
      style={{ bottom: 'calc(90px + env(safe-area-inset-bottom, 0px))' }}
    >
      <div className="bg-card rounded-2xl border border-border shadow-xl">
        <div className="flex items-center gap-3 p-3">
          {org.thumbnail ? (
            <img
              src={org.thumbnail}
              alt=""
              className="w-20 h-20 rounded-xl object-cover shrink-0"
            />
          ) : (
            <div className="w-20 h-20 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
              <span className="text-3xl">{isPartner ? (org.isSchoolPartner ? '🏫' : '🤝') : '📍'}</span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base truncate">{org.name}</h3>
              {org.locked && <span className="shrink-0">🔒</span>}
            </div>
            <p className="text-sm text-muted-foreground truncate mt-0.5">{org.oneLiner}</p>
            {org.locked ? null : (
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                {isPartner ? (
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                    {org.isSchoolPartner ? '🏫 School Partner' : '🤝 Partner'}
                  </span>
                ) : (
                  <>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                      {TYPE_LABELS[org.type] || org.type}
                    </span>
                    <span
                      className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                      style={{ background: `${color}20`, color }}
                    >
                      {vibeEmoji[org.vibe]} {org.vibe.charAt(0).toUpperCase() + org.vibe.slice(1)}
                    </span>
                  </>
                )}
                {org.matchPercent > 0 && (
                  <span className="text-xs font-bold" style={{ color }}>
                    {org.matchPercent}% match
                  </span>
                )}
                {dateNotTbd && (
                  <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                    <Icon icon="solar:calendar-bold" width={12} />
                    {org.date}
                  </span>
                )}
                {org.xp > 0 && (
                  <span className="text-[10px] font-mono font-bold text-xp-gold">
                    +{org.xp} XP
                  </span>
                )}
                {tipCount > 0 && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onOpenBoard(); }}
                    className="text-[10px] flex items-center gap-0.5 text-amber-700 dark:text-amber-400 font-medium"
                  >
                    📌 {tipCount} tip{tipCount !== 1 ? 's' : ''}
                  </button>
                )}
              </div>
            )}
          </div>
          <Icon
            icon="solar:alt-arrow-up-linear"
            width={20}
            className="text-muted-foreground shrink-0"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default OrgPreviewCard;

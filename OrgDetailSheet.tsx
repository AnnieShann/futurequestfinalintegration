import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import {
  type Organization,
  vibeColors,
  vibeEmoji,
  jordan,
  aisha,
  maya,
  getOrgActivities,
  type OrgActivity,
  type Vibe,
} from '@/data/mockData';
import { getNotesForOrg } from '@/data/bulletinData';
import { sortNotesForYou } from '@/hooks/useBulletinPersonalization';

const FRNYC_LABELS: Record<Vibe, string> = {
  creator: 'Career-Connected',
  fixer: 'Work-Based Learning',
  connector: 'Personalized Pathways',
  competitor: 'Financial Literacy',
};

interface OrgDetailSheetProps {
  org: Organization;
  onClose: () => void;
  onAccept: () => void;
  partyFormed: boolean;
  onOpenBoard: () => void;
  questAccepted?: boolean;
  onStartSimulation?: () => void;
}

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function CollapsibleSection({ title, children, defaultOpen = false }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between font-bold text-sm py-2"
      >
        {title}
        <Icon
          icon="solar:alt-arrow-down-linear"
          width={18}
          className={`text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-1 pb-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProgressionBar({ org, questAccepted }: { org: Organization; questAccepted: boolean }) {
  const activities = useMemo(() => getOrgActivities(org.id, org.xp), [org.id, org.xp]);
  const [tappedIdx, setTappedIdx] = useState<number | null>(null);
  const color = vibeColors[org.vibe];
  const unlockCount = activities.filter(a => a.unlocked).length;
  const completedCount = activities.filter(a => a.completed).length;

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <p className="font-bold text-sm">Your Journey Here</p>
        <span className="text-[10px] text-muted-foreground">{completedCount}/{activities.length} completed</span>
      </div>

      {/* Segmented bar */}
      <div className="flex gap-1 mb-2">
        {activities.map((act, i) => (
          <button
            key={act.id}
            className="flex-1 relative group"
            onClick={() => setTappedIdx(tappedIdx === i ? null : i)}
          >
            <div
              className={`h-2.5 rounded-full transition-all ${
                act.completed
                  ? ''
                  : act.unlocked
                    ? 'animate-pulse'
                    : ''
              }`}
              style={{
                background: act.completed
                  ? color
                  : act.unlocked
                    ? `${color}60`
                    : 'hsl(var(--muted))',
                boxShadow: act.unlocked && !act.completed ? `0 0 8px ${color}40` : 'none',
              }}
            />
          </button>
        ))}
      </div>

      {/* Activity list */}
      <div className="space-y-1.5">
        {activities.map((act, i) => (
          <button
            key={act.id}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all ${
              act.unlocked
                ? 'bg-white/60'
                : 'bg-muted/40 opacity-60'
            } ${tappedIdx === i ? 'ring-2 ring-primary/30' : ''}`}
            onClick={() => setTappedIdx(tappedIdx === i ? null : i)}
          >
            <span className={`text-base ${!act.unlocked ? 'grayscale' : ''}`}>
              {act.unlocked ? act.icon : '🔒'}
            </span>
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-semibold truncate ${!act.unlocked ? 'text-muted-foreground' : ''}`}>
                {act.label}
              </p>
              {tappedIdx === i && !act.unlocked && (
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {act.requiresParty && '👥 '}
                  {act.requiresLevel && `LVL ${act.requiresLevel} · `}
                  {act.unlockHint}
                </p>
              )}
            </div>
            <span className="text-[10px] font-bold text-amber-500 shrink-0">+{act.xp} XP</span>
            {act.completed && <Icon icon="solar:check-circle-bold" className="text-emerald-500 shrink-0" width={16} />}
          </button>
        ))}
      </div>
    </div>
  );
}

const OrgDetailSheet = ({ org, onClose, onAccept, partyFormed, onOpenBoard, questAccepted, onStartSimulation }: OrgDetailSheetProps) => {
  const color = vibeColors[org.vibe];
  const isHangout = org.type === 'hangout';
  const isPartner = org.type === 'partner';
  const dateNotTbd = org.date && org.date !== 'TBD';

  const boardNotes = useMemo(() => getNotesForOrg(org.id), [org.id]);
  const topNotes = useMemo(
    () => sortNotesForYou(boardNotes, maya).slice(0, 2),
    [boardNotes],
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-[1000] flex flex-col items-center justify-end"
      style={{ paddingBottom: 'calc(5rem + env(safe-area-inset-bottom, 0px))' }}
    >
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="relative w-full max-w-md bg-card rounded-t-3xl overflow-y-auto max-h-[85vh]"
        style={{ maxHeight: '85dvh' }}
      >
        {!isHangout && (
          <div className="relative w-full aspect-[16/9] overflow-hidden">
            <img src={org.thumbnail} alt={org.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
            <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
              <span
                className="text-sm font-semibold px-3 py-1 rounded-lg backdrop-blur-sm"
                style={{ background: `${color}cc`, color: 'white' }}
              >
                {vibeEmoji[org.vibe]} {FRNYC_LABELS[org.vibe]}
              </span>
              {org.xp > 0 && (
                <span className="text-sm font-mono font-bold px-3 py-1 rounded-lg bg-black/60 text-xp-gold backdrop-blur-sm">
                  +{org.xp} XP
                </span>
              )}
            </div>
          </div>
        )}

        {isHangout && (
          <div className="relative w-full aspect-[2/1] overflow-hidden">
            <img src={org.thumbnail} alt={org.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
            <div className="absolute bottom-3 left-4">
              <span
                className="text-sm font-semibold px-3 py-1 rounded-lg backdrop-blur-sm"
                style={{ background: `${color}cc`, color: 'white' }}
              >
                {vibeEmoji[org.vibe]} {FRNYC_LABELS[org.vibe]}
              </span>
            </div>
          </div>
        )}

        {isPartner && org.thumbnail && (
          <div className="relative w-full aspect-[2/1] overflow-hidden">
            <img src={org.thumbnail} alt={org.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
            <div className="absolute bottom-3 left-4 flex items-center gap-2">
              <span className="text-sm font-semibold px-3 py-1 rounded-lg backdrop-blur-sm bg-emerald-500/90 text-white">
                {org.isSchoolPartner ? '🏫 School Partner' : '🤝 Community Partner'}
              </span>
            </div>
          </div>
        )}

        {isPartner && !org.thumbnail && (
          <div className="relative w-full py-8 bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center">
            <span className="text-4xl">{org.isSchoolPartner ? '🏫' : '🤝'}</span>
          </div>
        )}

        <div className="flex justify-center pt-3 pb-1">
          <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full" />
        </div>

        <div className="px-5 pb-28">
          <h3 className="font-bold text-xl mt-2">{org.name}</h3>
          {isPartner ? (
            <p className="text-muted-foreground text-sm mt-1">{org.description}</p>
          ) : (
            <p className="text-muted-foreground text-sm mt-1">{org.oneLiner}</p>
          )}
          {org.address && (
            <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1.5">
              <Icon icon="solar:map-point-bold" width={16} />
              {org.address}
            </p>
          )}

          {isPartner && org.tags && org.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {org.tags.map((tag) => (
                <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {isPartner && (
            <div className="mt-3 space-y-2">
              {org.website && (
                <a
                  href={org.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary flex items-center gap-1.5 hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Icon icon="solar:global-bold" width={16} />
                  {org.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                </a>
              )}
              {org.hours && (
                <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <Icon icon="solar:clock-circle-bold" width={16} className="shrink-0" />
                  {org.hours}
                </p>
              )}
              {org.phone && (
                <a
                  href={`tel:${org.phone}`}
                  className="text-sm text-muted-foreground flex items-center gap-1.5 hover:text-primary"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Icon icon="solar:phone-bold" width={16} />
                  {org.phone}
                </a>
              )}
              {org.email && (
                <a
                  href={`mailto:${org.email}`}
                  className="text-sm text-muted-foreground flex items-center gap-1.5 hover:text-primary"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Icon icon="solar:letter-bold" width={16} />
                  {org.email.toLowerCase()}
                </a>
              )}
            </div>
          )}

          <div className="mt-3 flex items-center gap-2 flex-wrap">
            {org.matchPercent > 0 && (
              <span
                className="text-xs font-bold px-3 py-1 rounded-full"
                style={{ background: `${color}20`, color }}
              >
                {org.matchPercent}% match
              </span>
            )}
            {org.transitTime && (
              <span className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground flex items-center gap-1">
                <Icon icon="solar:bus-bold" width={14} />
                {org.transitTime}
              </span>
            )}
            {dateNotTbd && (
              <span className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground flex items-center gap-1">
                <Icon icon="solar:calendar-bold" width={14} />
                {org.date}
                {org.time && ` • ${org.time}`}
              </span>
            )}
          </div>

          {org.whyYoullLove.length > 0 && (
            <CollapsibleSection title="Why this matches you">
              <div className="space-y-2">
                {org.whyYoullLove.map((reason, i) => (
                  <p key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <Icon icon="solar:check-circle-bold" className="text-accent shrink-0 mt-0.5" width={16} />
                    {reason}
                  </p>
                ))}
              </div>
            </CollapsibleSection>
          )}

          {org.whatYoullDo.length > 0 && (
            <CollapsibleSection title="What you'll do">
              <div className="space-y-2">
                {org.whatYoullDo.map((task, i) => (
                  <p key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded shrink-0">{i + 1}</span>
                    {task}
                  </p>
                ))}
              </div>
            </CollapsibleSection>
          )}

          {org.skills && org.skills.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              <span className="text-xs font-bold text-muted-foreground mr-1">Skills:</span>
              {org.skills.map((skill) => (
                <span key={skill} className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">
                  {skill}
                </span>
              ))}
            </div>
          )}

          <CollapsibleSection title={`📌 Community Board${boardNotes.length > 0 ? ` (${boardNotes.length})` : ''}`}>
            <div className="space-y-2">
              {boardNotes.length > 0 ? (
                <>
                  {topNotes.map((note) => (
                    <p key={note.id} className="text-sm text-muted-foreground truncate italic">
                      "{note.body}"
                    </p>
                  ))}
                  <button
                    onClick={onOpenBoard}
                    className="text-sm text-primary font-medium mt-1 flex items-center gap-1"
                  >
                    View all {boardNotes.length} tips
                    <Icon icon="solar:arrow-right-linear" width={14} />
                  </button>
                </>
              ) : (
                <div className="text-center py-3">
                  <p className="text-xs text-muted-foreground italic">No tips yet — be the first to share!</p>
                  <button
                    onClick={onOpenBoard}
                    className="text-xs text-primary font-medium mt-2 flex items-center gap-1 mx-auto"
                  >
                    <Icon icon="solar:pen-new-square-bold" width={14} />
                    Open Board
                  </button>
                </div>
              )}
            </div>
          </CollapsibleSection>

          {/* Progression Bar */}
          {!isPartner && !isHangout && <ProgressionBar org={org} questAccepted={!!questAccepted} />}

          {partyFormed && (
            <div className="mt-4">
              <p className="font-bold text-sm mb-2.5">Your Crew</p>
              <div className="space-y-2.5">
                {[jordan, aisha].map((p) => (
                  <div key={p.id} className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full overflow-hidden border-2"
                      style={{ borderColor: vibeColors[p.vibe] }}
                    >
                      <img src={p.photo} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {p.name.split(' ')[0]} {vibeEmoji[p.vibe]}
                      </p>
                      <p className="text-xs text-accent">✓ I'm in!</p>
                    </div>
                  </div>
                ))}
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full overflow-hidden border-2"
                    style={{ borderColor: vibeColors[maya.vibe] }}
                  >
                    <img src={maya.photo} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      Maya (You) {vibeEmoji[maya.vibe]}
                    </p>
                    <p className="text-xs text-muted-foreground">Waiting for you...</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-5">
            {org.hasSimulation && onStartSimulation ? (
              <div className="space-y-2">
                <button
                  onClick={onStartSimulation}
                  className="w-full btn-premium py-3.5 font-bold text-base flex items-center justify-center gap-2 active:scale-95"
                >
                  <span>🌊</span> Start Simulation
                </button>
                {isPartner && org.website && (
                  <a
                    href={org.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-2.5 bg-white/50 border border-border text-foreground rounded-full font-medium text-sm text-center active:scale-95 transition-transform"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Visit Website
                  </a>
                )}
                {!isPartner && (
                  <button
                    onClick={onAccept}
                    className="w-full py-2.5 bg-white/50 border border-border text-foreground rounded-full font-medium text-sm active:scale-95 transition-transform"
                  >
                    Accept Quest Instead
                  </button>
                )}
              </div>
            ) : !org.locked && questAccepted ? (
              <button
                onClick={onClose}
                className="w-full py-3.5 bg-accent text-accent-foreground rounded-full font-bold text-base active:scale-95 transition-transform"
              >
                ▶ Continue Quest
              </button>
            ) : isPartner && org.website ? (
              <a
                href={org.website}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3.5 bg-emerald-500 text-white rounded-full font-bold text-base text-center active:scale-95 transition-transform"
                onClick={(e) => e.stopPropagation()}
              >
                Visit Website
              </a>
            ) : !org.locked ? (
              <button
                onClick={onAccept}
                className="w-full py-3.5 bg-primary text-primary-foreground rounded-full font-bold text-base active:scale-95 transition-transform"
              >
                Accept Quest
              </button>
            ) : (
              <button
                disabled
                className="w-full py-3.5 rounded-full font-bold text-base bg-muted text-muted-foreground cursor-not-allowed"
              >
                Level {org.levelRequired} Required
              </button>
            )}
            <button onClick={onClose} className="w-full py-2 text-muted-foreground text-sm mt-2">
              {isPartner ? 'Close' : 'Maybe Later'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OrgDetailSheet;

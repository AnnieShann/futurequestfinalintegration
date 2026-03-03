import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import {
  maya, vibeColors, vibeEmoji, vibeOptions, vibeStatements,
  passionCategories, deriveVibeFromPassions,
  jordan, aisha, marcus,
} from '@/data/mockData';

interface Badge {
  id: string;
  label: string;
  icon: string;
  color: string;
  category: string;
  earned: boolean;
}

const badgeCategories = [
  { id: 'milestones', label: 'Milestones', emoji: '⭐' },
  { id: 'cyber', label: 'Cybersecurity', emoji: '🛡️' },
  { id: 'creative', label: 'Creative Arts', emoji: '🎨' },
  { id: 'tech', label: 'Technology', emoji: '💻' },
  { id: 'community', label: 'Community', emoji: '🤝' },
];

const badges: Badge[] = [
  { id: 'first-steps', label: 'First Steps', icon: '👣', color: '#8B9CF7', category: 'milestones', earned: true },
  { id: 'squad-up', label: 'Squad Up', icon: '👥', color: '#7DD3A8', category: 'milestones', earned: true },
  { id: 'explorer-1', label: 'NYC Explorer', icon: '🗽', color: '#7BC4E8', category: 'milestones', earned: false },
  { id: 'cross-borough', label: 'Cross-Borough', icon: '🌉', color: '#F7D87C', category: 'milestones', earned: false },

  { id: 'ir-leader', label: 'Incident Response Leader', icon: '🛡️', color: '#6C8CFF', category: 'cyber', earned: false },
  { id: 'threat-hunter', label: 'Threat Hunter', icon: '🔍', color: '#22D3EE', category: 'cyber', earned: false },
  { id: 'cipher-master', label: 'Cipher Master', icon: '🔐', color: '#E879F9', category: 'cyber', earned: false },

  { id: 'creative-spark', label: 'Creative Spark', icon: '✨', color: '#E8927C', category: 'creative', earned: false },
  { id: 'pitch-pro', label: 'Pitch Pro', icon: '🎯', color: '#D4A0E8', category: 'creative', earned: false },
  { id: 'design-eye', label: 'Design Eye', icon: '👁️', color: '#F78B8B', category: 'creative', earned: false },

  { id: 'code-ninja', label: 'Code Ninja', icon: '⚡', color: '#7CE8D4', category: 'tech', earned: false },
  { id: 'maker', label: 'Master Maker', icon: '🔨', color: '#F7A87C', category: 'tech', earned: false },
  { id: 'data-wizard', label: 'Data Wizard', icon: '📊', color: '#8BD4F7', category: 'tech', earned: false },

  { id: 'mentor-connect', label: 'Mentor Connect', icon: '🧑‍🏫', color: '#34D399', category: 'community', earned: false },
  { id: 'team-player', label: 'Team Player', icon: '🏅', color: '#C48BF7', category: 'community', earned: false },
  { id: 'good-neighbor', label: 'Good Neighbor', icon: '🏘️', color: '#7CF7A8', category: 'community', earned: false },
];

const experienceHistory = [
  { id: 'e1', label: 'Formed first party', icon: '👥', org: 'FutureQuest', date: 'Today', xp: 50 },
  { id: 'e2', label: 'Onboarding Complete', icon: '🎓', org: 'FutureQuest', date: 'Today', xp: 25 },
];

interface Props {
  onClose: () => void;
}

interface CompetencyInfo {
  label: string;
  full: string;
  desc: string;
  tip: string;
}

const FUTURE9: CompetencyInfo[] = [
  { label: 'Community', full: 'Build Community', desc: 'Nurture relationships and connections to build diverse, inclusive communities.', tip: 'Join group quests and connect with peers to grow this.' },
  { label: 'Solutions', full: 'Design Solutions', desc: 'Identify challenges and opportunities, then design ways to address them.', tip: 'Complete simulation decision points to improve.' },
  { label: 'Inquiry', full: 'Engage in Inquiry', desc: 'Pursue answers to meaningful questions through research.', tip: 'Investigate evidence in simulations and ask questions at org visits.' },
  { label: 'Express', full: 'Express Ideas', desc: 'Develop and communicate ideas with purpose and clarity.', tip: 'Participate in pitch sessions and share on community boards.' },
  { label: 'Purpose', full: 'Learn with Purpose', desc: 'Lead your own learning while collaborating with and contributing to others.', tip: 'Accept quests aligned with your vibe and complete challenges.' },
  { label: 'Conflict', full: 'Navigate Conflict', desc: 'Process feelings, attune to others, and contribute to constructive resolution.', tip: 'Make tough calls in simulations and practice stakeholder communication.' },
  { label: 'Read World', full: 'Read the World', desc: 'Engage with diverse ideas and media to understand and critically examine the world.', tip: 'Visit different orgs across NYC to broaden your perspective.' },
  { label: 'Quantitative', full: 'Reason Quantitatively', desc: 'Reason through and communicate mathematical problems.', tip: 'Analyze data and metrics in simulation outcomes.' },
  { label: 'Well-Being', full: 'Sustain Well-Being', desc: 'Develop practices to support well-being and foster cultural awareness.', tip: 'Balance your quest load and explore diverse communities.' },
];

function RadarChart({ competencies, values, color, size, onTapLabel }: {
  competencies: CompetencyInfo[]; values: number[]; color: string; size: number;
  onTapLabel: (index: number) => void;
}) {
  const pad = 40;
  const full = size + pad * 2;
  const cx = full / 2;
  const cy = full / 2;
  const r = size * 0.36;
  const n = competencies.length;
  const angleStep = (2 * Math.PI) / n;

  const point = (i: number, scale: number) => ({
    x: cx + r * scale * Math.sin(i * angleStep),
    y: cy - r * scale * Math.cos(i * angleStep),
  });

  const gridLevels = [0.25, 0.5, 0.75, 1];

  const dataPath = values
    .map((v, i) => { const p = point(i, v); return `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`; })
    .join(' ') + 'Z';

  return (
    <svg width="100%" height="auto" viewBox={`0 0 ${full} ${full}`} style={{ maxWidth: full }}>
      {gridLevels.map(level => (
        <polygon
          key={level}
          points={Array.from({ length: n }, (_, i) => { const p = point(i, level); return `${p.x},${p.y}`; }).join(' ')}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth={0.5}
        />
      ))}
      {Array.from({ length: n }, (_, i) => {
        const p = point(i, 1);
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="hsl(var(--border))" strokeWidth={0.5} />;
      })}
      <polygon points={dataPath.replace(/[MLZ]/g, ' ').trim()} fill={`${color}25`} stroke={color} strokeWidth={2} />
      {values.map((v, i) => {
        const p = point(i, v);
        return <circle key={i} cx={p.x} cy={p.y} r={3} fill={color} />;
      })}
      {competencies.map((comp, i) => {
        const p = point(i, 1.28);
        return (
          <text
            key={i}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-primary cursor-pointer"
            style={{ fontSize: 8, fontWeight: 600 }}
            onClick={() => onTapLabel(i)}
          >
            {comp.label}
          </text>
        );
      })}
    </svg>
  );
}

const ProfilePanel = ({ onClose }: Props) => {
  const [editingVibe, setEditingVibe] = useState(false);
  const [editPassions, setEditPassions] = useState<string[]>(maya.passions ?? []);
  const [currentVibe, setCurrentVibe] = useState(maya.vibe);

  const color = vibeColors[currentVibe];
  const vibeInfo = vibeOptions.find(v => v.vibe === currentVibe)!;
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null);

  const editDerivedVibe = editPassions.length >= 2 ? deriveVibeFromPassions(editPassions) : null;

  const toggleEditPassion = (id: string) => {
    if (editPassions.includes(id)) {
      setEditPassions(editPassions.filter(x => x !== id));
    } else if (editPassions.length < 4) {
      setEditPassions([...editPassions, id]);
    }
  };

  const saveVibeEdit = () => {
    if (!editDerivedVibe) return;
    maya.vibe = editDerivedVibe;
    maya.statement = vibeStatements[editDerivedVibe];
    maya.passions = editPassions;
    setCurrentVibe(editDerivedVibe);
    setEditingVibe(false);
  };

  const cancelVibeEdit = () => {
    setEditPassions(maya.passions ?? []);
    setEditingVibe(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-x-0 top-0 z-[1000] flex flex-col"
      style={{ bottom: 'calc(5rem + env(safe-area-inset-bottom, 0px))' }}
    >
      <div className="h-16" onClick={onClose} />

      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="flex-1 bg-card rounded-t-3xl overflow-y-auto"
      >
        <div className="p-6">
          <div className="w-10 h-1 bg-muted-foreground/30 rounded-full mx-auto mb-6" />

          {/* Profile header */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 mb-3" style={{ borderColor: color }}>
              <img src={maya.photo} alt="Maya" className="w-full h-full object-cover" />
            </div>
            <h3 className="font-bold text-xl">{maya.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm font-medium px-3 py-1 rounded-full" style={{ background: `${color}20`, color }}>
                {vibeEmoji[currentVibe]} {vibeInfo.title}
              </span>
              <button
                onClick={() => setEditingVibe(true)}
                className="text-[11px] font-medium text-primary hover:underline active:scale-95 transition-transform"
              >
                Edit
              </button>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <span className="font-mono font-bold text-xs bg-muted px-2 py-0.5 rounded-md">LVL {maya.level}</span>
              <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${(maya.xp / maya.maxXp) * 100}%` }} />
              </div>
              <span className="text-[10px] text-muted-foreground font-mono">{maya.xp}/{maya.maxXp} XP</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{maya.borough}, NYC</p>
          </div>

          {/* Vibe editor */}
          <AnimatePresence>
            {editingVibe && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mb-5"
              >
                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
                  <p className="text-xs font-bold mb-1">Update Your Vibe</p>
                  <p className="text-[10px] text-muted-foreground mb-3">Pick 2-4 passions that feel most like you</p>

                  <div className="grid grid-cols-3 gap-2">
                    {passionCategories.map(cat => {
                      const selected = editPassions.includes(cat.id);
                      return (
                        <motion.button
                          key={cat.id}
                          whileTap={{ scale: 0.93 }}
                          onClick={() => toggleEditPassion(cat.id)}
                          className={`relative flex flex-col items-center gap-1 p-2.5 rounded-xl border-2 transition-colors ${
                            selected
                              ? 'border-transparent shadow-sm'
                              : 'border-transparent bg-white/40'
                          }`}
                          style={selected ? {
                            background: `${cat.color}20`,
                            borderColor: cat.color,
                          } : {}}
                        >
                          <span className="text-lg">{cat.emoji}</span>
                          <span className="text-[10px] font-semibold text-center leading-tight">{cat.label}</span>
                          {selected && (
                            <div
                              className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-white"
                              style={{ background: cat.color }}
                            >
                              <Icon icon="solar:check-read-linear" width={10} />
                            </div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>

                  {editDerivedVibe && (
                    <div className="mt-3 p-2 rounded-xl bg-white/50 text-center">
                      <p className="text-[10px] text-muted-foreground">Your new vibe</p>
                      <p className="font-bold text-sm" style={{ color: vibeColors[editDerivedVibe] }}>
                        {vibeEmoji[editDerivedVibe]} {vibeOptions.find(v => v.vibe === editDerivedVibe)?.title}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={cancelVibeEdit}
                      className="flex-1 py-2 bg-muted text-foreground rounded-full text-xs font-medium active:scale-95 transition-transform"
                    >
                      Cancel
                    </button>
                    <button
                      disabled={editPassions.length < 2}
                      onClick={saveVibeEdit}
                      className="flex-1 py-2 btn-premium rounded-full text-xs font-semibold disabled:opacity-30 disabled:pointer-events-none active:scale-95"
                    >
                      Save ({editPassions.length}/4)
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stats */}
          <div className="flex justify-around py-4 border-y border-border mb-5">
            {[
              { label: 'Quests', value: maya.questsCompleted },
              { label: 'Connections', value: 3 },
              { label: 'Badges', value: 2 },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className="font-mono font-bold text-lg">{s.value}</p>
                <p className="text-[10px] text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>

          {/* About */}
          <div className="bg-muted/50 rounded-xl p-4 mb-5">
            <p className="font-bold text-sm mb-3">About You</p>
            <div className="space-y-2 text-xs">
              <div className="flex gap-2">
                <span className="text-muted-foreground w-14 shrink-0">Loves</span>
                <span>Creating • Problem-solving</span>
              </div>
              <div className="flex gap-2">
                <span className="text-muted-foreground w-14 shrink-0">Avoids</span>
                <span>Repetition • Being micromanaged</span>
              </div>
              <div className="flex gap-2">
                <span className="text-muted-foreground w-14 shrink-0">Vibe</span>
                <span style={{ color }}>"{vibeInfo.desc}"</span>
              </div>
            </div>
          </div>

          {/* Future9 Competency Radar */}
          <div className="mb-5">
            <p className="font-bold text-sm mb-1">Future9 Competencies</p>
            <p className="text-[10px] text-muted-foreground mb-2">reDesign Future9 Framework · <span className="text-primary">Tap a label to learn more</span></p>
            <div className="flex justify-center">
              <RadarChart
                competencies={FUTURE9}
                values={[0.7, 0.5, 0.6, 0.8, 0.55, 0.4, 0.65, 0.45, 0.6]}
                color={color}
                size={220}
                onTapLabel={(i) => setActiveTooltip(activeTooltip === i ? null : i)}
              />
            </div>
            <AnimatePresence>
              {activeTooltip !== null && (
                <motion.div
                  key={activeTooltip}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="mt-2 rounded-xl border border-primary/20 bg-primary/5 p-3"
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-bold" style={{ color }}>{FUTURE9[activeTooltip].full}</p>
                    <button onClick={() => setActiveTooltip(null)} className="text-muted-foreground">
                      <Icon icon="solar:close-circle-linear" width={16} />
                    </button>
                  </div>
                  <p className="text-[11px] text-foreground/70 leading-relaxed mb-1.5">{FUTURE9[activeTooltip].desc}</p>
                  <div className="flex items-start gap-1.5">
                    <Icon icon="solar:lightbulb-bolt-bold" width={14} className="text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-muted-foreground">{FUTURE9[activeTooltip].tip}</p>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${[0.7, 0.5, 0.6, 0.8, 0.55, 0.4, 0.65, 0.45, 0.6][activeTooltip] * 100}%`, background: color }} />
                    </div>
                    <span className="text-[10px] font-mono font-bold" style={{ color }}>{Math.round([0.7, 0.5, 0.6, 0.8, 0.55, 0.4, 0.65, 0.45, 0.6][activeTooltip] * 100)}%</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Good fits */}
          <div className="mb-5">
            <p className="font-bold text-sm mb-2">Good Fits For You</p>
            <div className="flex flex-wrap gap-1.5">
              {['Creative Agencies', 'Game Studios', 'Maker Spaces', 'Architecture', 'Design'].map(tag => (
                <span key={tag} className="text-[10px] bg-muted px-2.5 py-1 rounded-full text-muted-foreground">{tag}</span>
              ))}
            </div>
          </div>

          {/* Badges Collection */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-3">
              <p className="font-bold text-sm">Badges</p>
              <span className="text-[10px] text-muted-foreground">
                {badges.filter(b => b.earned).length}/{badges.length} collected
              </span>
            </div>

            {badgeCategories.map(cat => {
              const catBadges = badges.filter(b => b.category === cat.id);
              if (catBadges.length === 0) return null;
              return (
                <div key={cat.id} className="mb-3">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <span>{cat.emoji}</span> {cat.label}
                  </p>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {catBadges.map(badge => (
                      <div
                        key={badge.id}
                        className={`flex flex-col items-center gap-1 shrink-0 ${!badge.earned ? 'opacity-35 grayscale' : ''}`}
                      >
                        <div
                          className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm"
                          style={{
                            background: badge.earned
                              ? `linear-gradient(135deg, ${badge.color}30, ${badge.color}10)`
                              : 'hsl(var(--muted))',
                            border: badge.earned ? `2px solid ${badge.color}60` : '2px solid transparent',
                          }}
                        >
                          {badge.earned ? (
                            <span className="text-2xl">{badge.icon}</span>
                          ) : (
                            <Icon icon="solar:lock-bold" width={20} className="text-muted-foreground" />
                          )}
                        </div>
                        <span className="text-[9px] text-center w-16 leading-tight font-medium">
                          {badge.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Experience History */}
          <div className="mb-5">
            <p className="font-bold text-sm mb-2">Experience History</p>
            <div className="space-y-2">
              {experienceHistory.map(exp => (
                <div key={exp.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/50">
                  <span className="text-lg">{exp.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate">{exp.label}</p>
                    <p className="text-[10px] text-muted-foreground">{exp.org} &bull; {exp.date}</p>
                  </div>
                  <span className="text-[10px] font-bold text-amber-500 shrink-0">+{exp.xp} XP</span>
                </div>
              ))}
              <p className="text-[10px] text-muted-foreground text-center italic pt-1">
                Complete more quests and simulations to build your history!
              </p>
            </div>
          </div>

          {/* Network */}
          <div className="mb-5">
            <p className="font-bold text-sm mb-2">Your Network</p>
            <div className="flex items-center gap-2">
              {[jordan, aisha, marcus].map(p => (
                <div key={p.id} className="w-9 h-9 rounded-full overflow-hidden border-2" style={{ borderColor: vibeColors[p.vibe] }}>
                  <img src={p.photo} alt={p.name} className="w-full h-full object-cover" />
                </div>
              ))}
              <span className="text-xs text-muted-foreground ml-1">3 connections</span>
            </div>
          </div>

          <button onClick={onClose} className="w-full py-3 bg-muted text-foreground rounded-full font-medium active:scale-95 transition-all mb-8">
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProfilePanel;

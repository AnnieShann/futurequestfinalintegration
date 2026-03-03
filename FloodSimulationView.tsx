import { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

import avatarMayor from '@/assets/avatar-mayor.png';
import avatarRosa from '@/assets/avatar-rosa.png';
import avatarBennett from '@/assets/avatar-bennett.png';
import avatarAisha from '@/assets/avatar-aisha-npc.png';
import avatarCalvin from '@/assets/avatar-calvin.png';
import floodTownBg from '@/assets/flood-town-bg.jpg';

interface SimulationResult {
  leadershipStyle: 'aggressive' | 'cautious' | 'strategic';
  xpEarned: number;
  badge: string;
  skills: string[];
}

interface Props {
  onComplete: (result: SimulationResult) => void;
  onExit: () => void;
}

type FundingChoice = 'school-waterfront' | 'waterfront-drainage' | 'school-grants';

type SimStep =
  | 'briefing'
  | 'walking'
  | 'riskmap'
  | 'math1'
  | 'resilience-report'
  | 'resilience-question'
  | 'community-intro'
  | 'community-choose'
  | 'community-response'
  | 'math2'
  | 'allocation'
  | 'combined-projection'
  | 'combined-question'
  | 'consequence'
  | 'consequence-reactions'
  | 'reflection-mayor'
  | 'reflection-choose'
  | 'outcome';

const CHARACTERS = {
  mayor: { name: 'Mayor Thompson', role: 'Mayor of Harbor Point', color: '#6C8CFF', emoji: '🏛️', avatar: avatarMayor },
  rosa: { name: 'Rosa', role: 'Restaurant Owner', color: '#F59E0B', emoji: '👩‍🍳', avatar: avatarRosa },
  bennett: { name: 'Mr. Bennett', role: 'Retired Teacher', color: '#8B5CF6', emoji: '👨‍🏫', avatar: avatarBennett },
  aisha: { name: 'Aisha', role: 'High School Senior', color: '#EC4899', emoji: '👩‍🎓', avatar: avatarAisha },
  calvin: { name: 'Calvin', role: 'City Engineer', color: '#22D3EE', emoji: '👷', avatar: avatarCalvin },
};

const BRIEFING_LINES = [
  "Thank you for coming.",
  "I've lived here 40 years. I've never seen water like that.",
  "We received a $5 million state climate resilience grant.",
  "But engineering estimates say full coastal protection would cost $12 million.",
  "We can't protect everything. You'll help us decide where we begin.",
];

const ENCOUNTERS = [
  { character: CHARACTERS.rosa, lines: ["My family's restaurant flooded twice this year.", "We can rebuild again… but I don't know if we can survive another season.", "If the waterfront floods again, that's it for us."] },
  { character: CHARACTERS.bennett, lines: ["The elementary school took on three feet of water.", "My granddaughter goes there.", "If that building floods again, families will leave this town."] },
  { character: CHARACTERS.aisha, lines: ["I want to study environmental engineering.", "But if this town keeps flooding, there won't be much left to come back to."] },
];

const ZONES = [
  { id: 'waterfront', name: 'Waterfront Business District', risk: 'High', cost: '$4M', color: '#EF4444', desc: 'Critical economic zone — restaurants, shops, marina. Generates 35% of annual tax revenue.' },
  { id: 'residential', name: 'Residential Neighborhood', risk: 'Medium-High', cost: '$6M', color: '#F59E0B', desc: '300 homes damaged. Aging drainage infrastructure. Families at risk of displacement.' },
  { id: 'school', name: 'Elementary School Area', risk: 'High', cost: '$3M', color: '#8B5CF6', desc: '600 students affected. Gym collapsed. Classes held in temporary church space.' },
];

const ALLOCATION_OPTIONS: { id: FundingChoice; label: string; breakdown: string; color: string; pros: string; cons: string }[] = [
  { id: 'school-waterfront', label: 'Option A', breakdown: 'Fully Protect School ($3M) + Partial Waterfront ($2M)', color: '#8B5CF6', pros: 'Protects children immediately', cons: 'Businesses still vulnerable' },
  { id: 'waterfront-drainage', label: 'Option B', breakdown: 'Fully Protect Waterfront ($4M) + Small Drainage Upgrade ($1M)', color: '#F59E0B', pros: 'Protects jobs and tax base', cons: 'School remains high risk' },
  { id: 'school-grants', label: 'Option C', breakdown: 'Protect School ($3M) + Emergency Household Grants ($2M)', color: '#EC4899', pros: 'Helps families directly', cons: 'No major structural solution' },
];

const CONSEQUENCES: Record<FundingChoice, { title: string; desc: string; reactions: { character: typeof CHARACTERS.rosa; text: string }[] }> = {
  'school-waterfront': {
    title: 'School Protected + Partial Waterfront',
    desc: 'The school floodwall is built. 600 students return to a safe building. The waterfront gets partial reinforcement — some businesses are protected, but the marina remains vulnerable.',
    reactions: [
      { character: CHARACTERS.bennett, text: "You kept our children safe." },
      { character: CHARACTERS.rosa, text: "I understand the choice… but my business is still exposed. What happens next storm?" },
      { character: CHARACTERS.calvin, text: "Structurally sound decision. The school wall will last 50 years. The partial waterfront work buys time, not certainty." },
    ],
  },
  'waterfront-drainage': {
    title: 'Waterfront Protected + Small Drainage',
    desc: 'The full waterfront barrier goes up. 120 jobs secured. $3.5M in annual revenue protected. The neighborhood gets a modest drainage upgrade — better than nothing, but not transformative.',
    reactions: [
      { character: CHARACTERS.rosa, text: "You saved our businesses." },
      { character: CHARACTERS.aisha, text: "So the school just… stays broken? We're still in a church basement." },
      { character: CHARACTERS.calvin, text: "Economically, this was the rational choice. The revenue preservation alone justifies it. But the school situation weighs heavy." },
    ],
  },
  'school-grants': {
    title: 'School Protected + Household Grants',
    desc: 'The school floodwall is complete. 600 students are safe. Emergency grants help families repair flood damage. But the waterfront — the town\'s economic engine — is completely unprotected.',
    reactions: [
      { character: CHARACTERS.bennett, text: "The grant won't cover everything, but it means I don't lose my home. Thank you." },
      { character: CHARACTERS.aisha, text: "The school is safe! And families are getting help. This feels right." },
      { character: CHARACTERS.calvin, text: "The human impact is addressed. But without waterfront protection, we risk losing $3.5M annually. Future risk remains." },
    ],
  },
};

const SKILLS = [
  'Proportional Reasoning', 'Percent Calculation', 'Cost Comparison',
  'Reading for Inference', 'Weighing Quantitative vs Human Impact', 'Ethical Decision-Making',
];

const REFLECTION_OPTIONS = [
  'Economic stability', 'Protecting children', 'Community fairness', 'Long-term sustainability',
];

function CharacterBubble({ char, size = 'md' }: { char: typeof CHARACTERS.rosa; size?: 'sm' | 'md' | 'lg' }) {
  const dim = size === 'lg' ? 'w-16 h-16' : size === 'md' ? 'w-12 h-12' : 'w-9 h-9';
  return (
    <div
      className={`${dim} rounded-xl overflow-hidden shrink-0`}
      style={{ border: `2px solid ${char.color}60`, boxShadow: `0 0 12px ${char.color}20` }}
    >
      <img src={char.avatar} alt={char.name} className="w-full h-full object-cover" />
    </div>
  );
}

const FloodSimulationView = ({ onComplete, onExit }: Props) => {
  const [step, setStep] = useState<SimStep>('briefing');
  const [briefingIdx, setBriefingIdx] = useState(0);
  const [encounterIdx, setEncounterIdx] = useState(0);
  const [lineIdx, setLineIdx] = useState(0);
  const [math1Answer, setMath1Answer] = useState<string | null>(null);
  const [math2Answer, setMath2Answer] = useState<string | null>(null);
  const [readingAnswer, setReadingAnswer] = useState<string | null>(null);
  const [combinedAnswer, setCombinedAnswer] = useState<string | null>(null);
  const [communityChoice, setCommunityChoice] = useState<string | null>(null);
  const [fundingChoice, setFundingChoice] = useState<FundingChoice | null>(null);
  const [reactionIdx, setReactionIdx] = useState(0);
  const [reflectionChoice, setReflectionChoice] = useState<string | null>(null);
  const [mathScore, setMathScore] = useState(0);

      const glassPanel = 'bg-white/70 backdrop-blur-md border border-white/30 rounded-2xl shadow-lg';

  const advanceBriefing = () => {
    if (briefingIdx < BRIEFING_LINES.length - 1) {
      setBriefingIdx(briefingIdx + 1);
    } else {
      setStep('walking');
    }
  };

  const advanceEncounter = () => {
    const current = ENCOUNTERS[encounterIdx];
    if (lineIdx < current.lines.length - 1) {
      setLineIdx(lineIdx + 1);
    } else if (encounterIdx < ENCOUNTERS.length - 1) {
      setEncounterIdx(encounterIdx + 1);
      setLineIdx(0);
    } else {
      setStep('riskmap');
    }
  };

  const deriveResult = (): SimulationResult => {
    let style: 'aggressive' | 'cautious' | 'strategic' = 'strategic';
    if (fundingChoice === 'waterfront-drainage') style = 'aggressive';
    else if (fundingChoice === 'school-grants') style = 'cautious';
    return {
      leadershipStyle: style,
      xpEarned: 400,
      badge: '🌊 Climate Resilience Planner',
      skills: SKILLS,
    };
  };

  const renderHeader = (icon: string, title: string, subtitle: string) => (
    <div className={`${glassPanel} px-4 py-2 flex items-center gap-2 mx-auto w-fit mb-4`}>
      <span className="text-base">{icon}</span>
      <span className="text-sm font-bold text-foreground/80">{title}</span>
      <span className="text-xs text-muted-foreground">{subtitle}</span>
    </div>
  );

  const renderBtn = (label: string, onClick: () => void, gradient = 'from-blue-500 to-cyan-500') => (
    <button
      onClick={onClick}
      className={`px-5 py-2.5 rounded-xl bg-gradient-to-r ${gradient} text-white text-sm font-semibold flex items-center gap-2 shadow-md active:scale-95 transition-transform`}
    >
      {label} <Icon icon="solar:arrow-right-bold" className="w-4 h-4" />
    </button>
  );

  return (
      <div className="fixed inset-0 z-[100] flex flex-col bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-100" style={{ backgroundImage: `url(${floodTownBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}><div className="absolute inset-0 bg-gradient-to-b from-white/80 via-blue-50/85 to-indigo-100/90" />
      {/* Exit */}
      <button onClick={onExit} className="absolute right-3 z-50 w-8 h-8 rounded-full bg-white/60 backdrop-blur flex items-center justify-center" style={{ top: 'calc(0.75rem + env(safe-area-inset-top, 0px))' }}>
        <Icon icon="solar:close-circle-bold" className="w-5 h-5 text-foreground/60" />
      </button>

      <div className="relative z-10 flex-1 overflow-y-auto px-4 pt-4 pb-20">
        {/* ─── BRIEFING ─── */}
        {step === 'briefing' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-full">
            {renderHeader('🌧️', 'After the Flood', 'Climate Resilience Simulation')}

            <div className="grid grid-cols-2 gap-2 mb-4">
              {[
                { label: 'Homes Damaged', value: '300', color: 'text-red-500' },
                { label: 'Grant Available', value: '$5M', color: 'text-emerald-500' },
                { label: 'Full Protection', value: '$12M', color: 'text-amber-500' },
                { label: 'Budget Gap', value: '$7M', color: 'text-red-500' },
              ].map(s => (
                <div key={s.label} className={`${glassPanel} px-3 py-2`}>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.label}</p>
                  <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>

            <div className={`${glassPanel} p-4 flex gap-3 flex-1`}>
              <CharacterBubble char={CHARACTERS.mayor} size="lg" />
              <div className="flex-1">
                <p className="text-sm font-bold" style={{ color: CHARACTERS.mayor.color }}>{CHARACTERS.mayor.name}</p>
                <p className="text-xs text-muted-foreground mb-2">{CHARACTERS.mayor.role}</p>
                <p className="text-sm text-foreground/70 leading-relaxed mb-3">"{BRIEFING_LINES[briefingIdx]}"</p>
                <div className="flex gap-1 mb-3">
                  {BRIEFING_LINES.map((_, i) => (
                    <div key={i} className={`w-2 h-2 rounded-full ${i <= briefingIdx ? 'bg-blue-400' : 'bg-foreground/10'}`} />
                  ))}
                </div>
                {renderBtn(briefingIdx < BRIEFING_LINES.length - 1 ? 'Continue' : 'Walk the Town', advanceBriefing)}
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── WALKING TOWN ─── */}
        {step === 'walking' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-3">
            {renderHeader('❤️', 'Walking the Town', 'Meet the People of Harbor Point')}

            <div className={`${glassPanel} p-3`}>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2 font-semibold">Encounters</p>
              {ENCOUNTERS.map((enc, i) => (
                <div key={enc.character.name} className={`flex items-center gap-2 p-2 rounded-xl mb-1 transition-all ${i === encounterIdx ? 'bg-primary/10 border border-primary/20' : 'opacity-40'}`}>
                  <CharacterBubble char={enc.character} size="sm" />
                  <div>
                    <p className="text-xs font-bold" style={{ color: i === encounterIdx ? enc.character.color : undefined }}>{enc.character.name}</p>
                    <p className="text-[10px] text-muted-foreground">{enc.character.role}</p>
                  </div>
                  {i < encounterIdx && <div className="w-2 h-2 rounded-full bg-emerald-400 ml-auto" />}
                </div>
              ))}
            </div>

            <div className={`${glassPanel} p-4 flex gap-3`}>
              <CharacterBubble char={ENCOUNTERS[encounterIdx].character} size="lg" />
              <div className="flex-1">
                <p className="text-sm font-bold" style={{ color: ENCOUNTERS[encounterIdx].character.color }}>{ENCOUNTERS[encounterIdx].character.name}</p>
                <p className="text-sm text-foreground/70 leading-relaxed my-2">"{ENCOUNTERS[encounterIdx].lines[lineIdx]}"</p>
                <div className="flex gap-1 mb-3">
                  {ENCOUNTERS[encounterIdx].lines.map((_, i) => (
                    <div key={i} className={`w-2 h-2 rounded-full`} style={{ background: i <= lineIdx ? ENCOUNTERS[encounterIdx].character.color : 'rgba(0,0,0,0.1)' }} />
                  ))}
                </div>
                {renderBtn(
                  encounterIdx === ENCOUNTERS.length - 1 && lineIdx === ENCOUNTERS[encounterIdx].lines.length - 1
                    ? 'View Flood Risk Map' : 'Continue',
                  advanceEncounter
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── RISK MAP ─── */}
        {step === 'riskmap' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-3">
            {renderHeader('🗺️', 'Flood Risk Map', 'Engineer Assessment')}

            {ZONES.map(zone => (
              <div key={zone.id} className={`${glassPanel} p-3`}>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 rounded-full" style={{ background: zone.color }} />
                  <span className="text-xs font-bold text-foreground/80">{zone.name}</span>
                </div>
                <div className="flex gap-2 mb-1">
                  <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: zone.color + '20', color: zone.color }}>Risk: {zone.risk}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-foreground/5 text-muted-foreground">{zone.cost}</span>
                </div>
                <p className="text-xs text-muted-foreground">{zone.desc}</p>
              </div>
            ))}

            <div className={`${glassPanel} p-4 flex gap-3`}>
              <CharacterBubble char={CHARACTERS.calvin} size="lg" />
              <div className="flex-1">
                <p className="text-sm font-bold" style={{ color: CHARACTERS.calvin.color }}>{CHARACTERS.calvin.name}</p>
                <p className="text-xs text-foreground/60 mt-1">"To fully protect each zone — explore them, then let's talk numbers."</p>
                <div className="flex items-center gap-3 mt-2 mb-3">
                  <span className="text-xs text-emerald-500 font-bold">💰 $5M Budget</span>
                  <span className="text-[10px] text-muted-foreground">Total needed: $13M</span>
                </div>
                {renderBtn('Math Moment', () => setStep('math1'))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── MATH MOMENT #1 ─── */}
        {step === 'math1' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-3">
            {renderHeader('🧮', 'Math Moment #1', 'Budget Analysis')}

            <div className={`${glassPanel} p-4 flex gap-3`}>
              <CharacterBubble char={CHARACTERS.mayor} size="lg" />
              <div className="flex-1">
                <p className="text-sm font-bold" style={{ color: CHARACTERS.mayor.color }}>{CHARACTERS.mayor.name}</p>
                <p className="text-sm text-foreground/70 mt-2 leading-relaxed">"If we protected the school and the waterfront, how much funding would we still need?"</p>
                <p className="text-xs text-muted-foreground mt-1">School: $3M + Waterfront: $4M = $7M | Budget: $5M</p>
              </div>
            </div>

            <div className="space-y-2">
              {[
                { id: 'a', label: "We'd be $2 million short.", correct: true },
                { id: 'b', label: "We'd have enough.", correct: false },
                { id: 'c', label: "We'd be $1 million short.", correct: false },
              ].map(opt => (
                <button key={opt.id} onClick={() => {
                  if (!math1Answer) {
                    setMath1Answer(opt.id);
                    if (opt.correct) setMathScore(s => s + 1);
                  }
                }}
                  className={`w-full text-left rounded-xl p-4 border transition-all ${math1Answer === opt.id
                    ? opt.correct ? 'border-emerald-500/50 bg-emerald-50' : 'border-red-500/50 bg-red-50'
                    : math1Answer ? 'opacity-40 border-foreground/5' : `${glassPanel}`}`}>
                  <span className="text-sm font-medium text-foreground/70">{opt.label}</span>
                </button>
              ))}
            </div>

            {math1Answer && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`${glassPanel} p-3`}>
                <div className="flex items-center gap-2 mb-2">
                  <CharacterBubble char={CHARACTERS.calvin} size="sm" />
                  <p className={`text-sm ${math1Answer === 'a' ? 'text-emerald-500' : 'text-red-500'}`}>
                    {math1Answer === 'a' ? '"Right. We\'d still need outside funding."' : '"Check that again — the combined cost exceeds the grant."'}
                  </p>
                </div>
                {renderBtn('Resilience Report', () => setStep('resilience-report'))}
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ─── RESILIENCE REPORT ─── */}
        {step === 'resilience-report' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-3">
            {renderHeader('📋', 'Resilience Report', 'Reading Moment')}

            <div className={`${glassPanel} p-4`}>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3 font-semibold">Report Summary</p>
              {[
                "Flood modeling indicates a 40% probability of another 100-year storm event within the next 15 years.",
                "Protecting the school reduces displacement risk for 600 students.",
                "Protecting the waterfront safeguards 120 jobs and 35% of annual municipal tax revenue.",
              ].map((bullet, i) => (
                <div key={i} className="rounded-xl p-3 border border-foreground/5 bg-foreground/[0.02] mb-2">
                  <p className="text-sm text-foreground/60 leading-relaxed">{bullet}</p>
                </div>
              ))}
            </div>

            <div className={`${glassPanel} p-3 flex gap-3`}>
              <CharacterBubble char={CHARACTERS.calvin} size="md" />
              <div className="flex-1">
                <p className="text-xs text-foreground/60">"Study it carefully — the Mayor will have a question."</p>
                <div className="mt-2">
                  {renderBtn("Mayor's Question", () => setStep('resilience-question'), 'from-emerald-500 to-cyan-500')}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── RESILIENCE QUESTION ─── */}
        {step === 'resilience-question' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-3">
            {renderHeader('📋', 'Reading Comprehension', 'Mayor\'s Question')}

            <div className={`${glassPanel} p-4 flex gap-3`}>
              <CharacterBubble char={CHARACTERS.mayor} size="lg" />
              <div className="flex-1">
                <p className="text-sm font-bold" style={{ color: CHARACTERS.mayor.color }}>{CHARACTERS.mayor.name}</p>
                <p className="text-sm text-foreground/70 mt-2 italic">"Based on that… what's at greatest long-term risk if we do nothing?"</p>
              </div>
            </div>

            <div className="space-y-2">
              {[
                { id: 'a', label: 'Student displacement', correct: false },
                { id: 'b', label: 'Loss of tax base', correct: true },
                { id: 'c', label: 'Storm probability', correct: false },
              ].map(opt => (
                <button key={opt.id} onClick={() => {
                  if (!readingAnswer) setReadingAnswer(opt.id);
                }}
                  className={`w-full text-left rounded-xl p-4 border transition-all ${readingAnswer === opt.id
                    ? opt.correct ? 'border-emerald-500/50 bg-emerald-50' : 'border-red-500/50 bg-red-50'
                    : readingAnswer ? 'opacity-40 border-foreground/5' : `${glassPanel}`}`}>
                  <span className="text-sm font-medium text-foreground/70">{opt.label}</span>
                </button>
              ))}
            </div>

            {readingAnswer && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`${glassPanel} p-3`}>
                <p className={`text-sm mb-2 ${readingAnswer === 'b' ? 'text-emerald-500' : 'text-red-500'}`}>
                  {readingAnswer === 'b' ? '"Yes. If revenue drops, we can\'t fund future protections."' : '"Think again — the report highlights which loss creates a cascading financial crisis."'}
                </p>
                {renderBtn('Community Meeting', () => setStep('community-intro'))}
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ─── COMMUNITY MEETING INTRO ─── */}
        {step === 'community-intro' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-3">
            {renderHeader('👥', 'Community Meeting', 'Town Gymnasium')}

            <div className={`${glassPanel} p-4`}>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3 font-semibold">Voices overlap in the gymnasium:</p>
              {[
                { speaker: CHARACTERS.rosa, text: "They should protect homes first!" },
                { speaker: CHARACTERS.bennett, text: "Businesses pay taxes!" },
                { speaker: CHARACTERS.aisha, text: "The school is non-negotiable!" },
              ].map((v, i) => (
                <motion.div key={i} className="flex items-center gap-3 mb-3"
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.3 }}>
                  <CharacterBubble char={v.speaker} size="sm" />
                  <p className="text-sm text-foreground/70 italic">"{v.text}"</p>
                </motion.div>
              ))}
              <div className="flex justify-end mt-3">
                {renderBtn('Choose Who to Respond To', () => setStep('community-choose'))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── COMMUNITY CHOOSE ─── */}
        {step === 'community-choose' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-3">
            {renderHeader('💬', 'Your Response', 'Who do you respond to first?')}
            <p className="text-xs text-muted-foreground text-center">Your first response signals your priorities.</p>

            {[
              { id: 'rosa', label: 'Speak to Rosa', desc: 'Address economic concerns', character: CHARACTERS.rosa },
              { id: 'bennett', label: 'Speak to Mr. Bennett', desc: 'Address the school and families', character: CHARACTERS.bennett },
            ].map(opt => (
              <button key={opt.id} onClick={() => setCommunityChoice(opt.id)}
                className={`w-full text-left rounded-xl p-4 border transition-all flex items-center gap-3 ${communityChoice === opt.id ? 'border-amber-500/50 bg-amber-50' : `${glassPanel}`}`}>
                <CharacterBubble char={opt.character} size="sm" />
                <div>
                  <span className="text-sm font-bold text-foreground/70">{opt.label}</span>
                  <p className="text-xs text-muted-foreground">{opt.desc}</p>
                </div>
              </button>
            ))}

            {communityChoice && (
              <div className="flex justify-end">
                {renderBtn('Respond', () => setStep('community-response'), 'from-amber-500 to-orange-500')}
              </div>
            )}
          </motion.div>
        )}

        {/* ─── COMMUNITY RESPONSE ─── */}
        {step === 'community-response' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-3">
            {renderHeader('💬', 'Response', '')}
            {(() => {
              const responses: Record<string, { speaker: typeof CHARACTERS.rosa; text: string }> = {
                rosa: { speaker: CHARACTERS.rosa, text: "If businesses close, jobs disappear. That affects everyone." },
                bennett: { speaker: CHARACTERS.bennett, text: "The school is the heart of this town." },
              };
              const r = responses[communityChoice || 'rosa'];
              return (
                <div className={`${glassPanel} p-4 flex gap-3`}>
                  <CharacterBubble char={r.speaker} size="lg" />
                  <div className="flex-1">
                    <p className="text-sm font-bold" style={{ color: r.speaker.color }}>{r.speaker.name}</p>
                    <p className="text-sm text-foreground/70 mt-2 leading-relaxed">"{r.text}"</p>
                    <div className="mt-3">
                      {renderBtn('Math Moment #2', () => setStep('math2'))}
                    </div>
                  </div>
                </div>
              );
            })()}
          </motion.div>
        )}

        {/* ─── MATH MOMENT #2 ─── */}
        {step === 'math2' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-3">
            {renderHeader('🧮', 'Math Moment #2', 'Comparative Reasoning')}

            <div className={`${glassPanel} p-4 flex gap-3`}>
              <CharacterBubble char={CHARACTERS.calvin} size="lg" />
              <div className="flex-1">
                <p className="text-sm font-bold" style={{ color: CHARACTERS.calvin.color }}>{CHARACTERS.calvin.name}</p>
                <p className="text-sm text-foreground/70 mt-2">"If the waterfront generates 35% of our tax revenue, and annual city revenue is $10 million…"</p>
                <p className="text-sm text-foreground/70 mt-1">"How much revenue does that district represent?"</p>
                <div className="flex gap-2 mt-2">
                  <span className="text-[10px] px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 font-bold">Revenue: $10M</span>
                  <span className="text-[10px] px-2 py-1 rounded-lg bg-cyan-500/10 text-cyan-600 font-bold">Waterfront: 35%</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {[
                { id: 'a', label: '$3.5 million', correct: true },
                { id: 'b', label: '$350,000', correct: false },
                { id: 'c', label: '$5 million', correct: false },
              ].map(opt => (
                <button key={opt.id} onClick={() => {
                  if (!math2Answer) {
                    setMath2Answer(opt.id);
                    if (opt.correct) setMathScore(s => s + 1);
                  }
                }}
                  className={`w-full text-left rounded-xl p-4 border transition-all ${math2Answer === opt.id
                    ? opt.correct ? 'border-emerald-500/50 bg-emerald-50' : 'border-red-500/50 bg-red-50'
                    : math2Answer ? 'opacity-40 border-foreground/5' : `${glassPanel}`}`}>
                  <span className="text-sm font-medium text-foreground/70">{opt.label}</span>
                </button>
              ))}
            </div>

            {math2Answer && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`${glassPanel} p-3`}>
                <div className="flex items-center gap-2 mb-2">
                  <CharacterBubble char={CHARACTERS.calvin} size="sm" />
                  <p className={`text-sm ${math2Answer === 'a' ? 'text-emerald-500' : 'text-red-500'}`}>
                    {math2Answer === 'a' ? '"That\'s not small. Losing that would ripple outward."' : '"Check that again — 35% of $10 million is $3.5 million."'}
                  </p>
                </div>
                {renderBtn('Funding Decision', () => setStep('allocation'), 'from-amber-500 to-orange-500')}
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ─── ALLOCATION ─── */}
        {step === 'allocation' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-3">
            {renderHeader('💰', 'Final Allocation', 'Budget: $5M')}

            <div className={`${glassPanel} p-4 flex gap-3`}>
              <CharacterBubble char={CHARACTERS.mayor} size="lg" />
              <div className="flex-1">
                <p className="text-sm font-bold" style={{ color: CHARACTERS.mayor.color }}>{CHARACTERS.mayor.name}</p>
                <p className="text-sm text-foreground/60 mt-1">"It's time. Where does the $5 million go? There's no wrong answer — only tradeoffs."</p>
              </div>
            </div>

            {ALLOCATION_OPTIONS.map(opt => (
              <button key={opt.id} onClick={() => setFundingChoice(opt.id)}
                className={`w-full text-left rounded-xl p-4 border transition-all ${fundingChoice === opt.id ? 'ring-2' : ''} ${glassPanel}`}
                style={fundingChoice === opt.id ? { borderColor: opt.color + '60', boxShadow: `0 0 15px ${opt.color}20` } : undefined}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: opt.color }} />
                  <span className="text-sm font-bold text-foreground/80">{opt.label}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{opt.breakdown}</p>
                <p className="text-xs text-emerald-500">+ {opt.pros}</p>
                <p className="text-xs text-red-500">− {opt.cons}</p>
              </button>
            ))}

            {fundingChoice && (
              <div className="flex justify-center">
                {renderBtn('Confirm Allocation', () => setStep('combined-projection'))}
              </div>
            )}
          </motion.div>
        )}

        {/* ─── COMBINED REASONING - PROJECTION ─── */}
        {step === 'combined-projection' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-3">
            {renderHeader('🧠', 'Combined Reasoning', 'Math + Reading')}

            <div className="grid grid-cols-2 gap-2">
              <div className={`${glassPanel} p-3`}>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Waterfront Projection</p>
                <p className="text-xl font-bold text-amber-500">$3.5M</p>
                <p className="text-[10px] text-muted-foreground">Annual revenue lost if unprotected</p>
              </div>
              <div className={`${glassPanel} p-3`}>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">School Projection</p>
                <p className="text-xl font-bold text-purple-500">$1.2M</p>
                <p className="text-[10px] text-muted-foreground">One-time relocation cost</p>
              </div>
            </div>

            <div className={`${glassPanel} p-4 flex gap-3`}>
              <CharacterBubble char={CHARACTERS.calvin} size="md" />
              <div className="flex-1">
                <p className="text-xs text-foreground/60">"If another storm hits and the waterfront is unprotected, estimated revenue loss = $3.5M annually. School relocation cost = $1.2M one-time."</p>
                <div className="mt-2">
                  {renderBtn("Mayor's Final Question", () => setStep('combined-question'), 'from-purple-500 to-blue-500')}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── COMBINED QUESTION ─── */}
        {step === 'combined-question' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-3">
            {renderHeader('🧠', 'Final Question', 'Combined Reasoning')}

            <div className={`${glassPanel} p-4 flex gap-3`}>
              <CharacterBubble char={CHARACTERS.mayor} size="lg" />
              <div className="flex-1">
                <p className="text-sm font-bold" style={{ color: CHARACTERS.mayor.color }}>{CHARACTERS.mayor.name}</p>
                <p className="text-sm text-foreground/70 mt-2">"Given these projections, which outcome has the greatest long-term financial impact?"</p>
              </div>
            </div>

            <div className="space-y-2">
              {[
                { id: 'a', label: 'School relocation ($1.2M one-time)', correct: false },
                { id: 'b', label: 'Waterfront revenue loss ($3.5M annually)', correct: true },
                { id: 'c', label: 'Storm probability increase', correct: false },
              ].map(opt => (
                <button key={opt.id} onClick={() => {
                  if (!combinedAnswer) {
                    setCombinedAnswer(opt.id);
                    if (opt.correct) setMathScore(s => s + 1);
                  }
                }}
                  className={`w-full text-left rounded-xl p-4 border transition-all ${combinedAnswer === opt.id
                    ? opt.correct ? 'border-emerald-500/50 bg-emerald-50' : 'border-red-500/50 bg-red-50'
                    : combinedAnswer ? 'opacity-40 border-foreground/5' : `${glassPanel}`}`}>
                  <span className="text-sm font-medium text-foreground/70">{opt.label}</span>
                </button>
              ))}
            </div>

            {combinedAnswer && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`${glassPanel} p-3`}>
                <p className={`text-sm mb-2 ${combinedAnswer === 'b' ? 'text-emerald-500' : 'text-red-500'}`}>
                  {combinedAnswer === 'b'
                    ? 'Correct. $3.5M annually far exceeds the one-time $1.2M. Over 2 years, unprotected waterfront losses exceed $7M.'
                    : 'Not quite. The waterfront loss is $3.5M per year — recurring. Annual losses compound and far exceed one-time costs.'}
                </p>
                {renderBtn('See Consequences', () => { setReactionIdx(0); setStep('consequence'); }, 'from-purple-500 to-blue-500')}
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ─── CONSEQUENCE ─── */}
        {step === 'consequence' && fundingChoice && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-3">
            {renderHeader('👁️', 'Consequence', '')}

            <div className={`${glassPanel} p-4`}>
              <h2 className="text-lg font-bold text-foreground/80 mb-2">{CONSEQUENCES[fundingChoice].title}</h2>
              <p className="text-sm text-foreground/50 leading-relaxed">{CONSEQUENCES[fundingChoice].desc}</p>
              <div className="flex justify-end mt-3">
                {renderBtn('See Reactions', () => { setReactionIdx(0); setStep('consequence-reactions'); })}
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── CONSEQUENCE REACTIONS ─── */}
        {step === 'consequence-reactions' && fundingChoice && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-3">
            {renderHeader('💬', 'Reactions', '')}

            {(() => {
              const reactions = CONSEQUENCES[fundingChoice].reactions;
              const r = reactions[reactionIdx];
              return (
                <div className={`${glassPanel} p-4 flex gap-3`}>
                  <CharacterBubble char={r.character} size="lg" />
                  <div className="flex-1">
                    <p className="text-sm font-bold" style={{ color: r.character.color }}>{r.character.name}</p>
                    <p className="text-sm text-foreground/70 mt-2 leading-relaxed">"{r.text}"</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex gap-1">
                        {reactions.map((_, i) => (
                          <div key={i} className={`w-2 h-2 rounded-full ${i <= reactionIdx ? 'bg-blue-400' : 'bg-foreground/10'}`} />
                        ))}
                      </div>
                      {renderBtn(
                        reactionIdx < reactions.length - 1 ? 'Next' : 'Reflection',
                        () => {
                          if (reactionIdx < reactions.length - 1) {
                            setReactionIdx(reactionIdx + 1);
                          } else {
                            setStep('reflection-mayor');
                          }
                        }
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}
          </motion.div>
        )}

        {/* ─── REFLECTION - MAYOR CLOSING ─── */}
        {step === 'reflection-mayor' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-3">
            {renderHeader('🏛️', 'Reflection', '')}

            <div className={`${glassPanel} p-4 flex gap-3`}>
              <CharacterBubble char={CHARACTERS.mayor} size="lg" />
              <div className="flex-1">
                <p className="text-sm font-bold" style={{ color: CHARACTERS.mayor.color }}>{CHARACTERS.mayor.name}</p>
                <p className="text-base text-foreground/70 mt-2 leading-relaxed">"There was no perfect answer."</p>
                <p className="text-base text-foreground/70 mt-1 leading-relaxed">"Resilience planning is choosing where to be brave first."</p>
                <div className="mt-3">
                  {renderBtn('Reflect', () => setStep('reflection-choose'))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── REFLECTION CHOICE ─── */}
        {step === 'reflection-choose' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-3">
            {renderHeader('💭', 'What mattered most?', '')}
            <p className="text-xs text-muted-foreground text-center">There's no wrong answer — this is about understanding yourself.</p>

            {REFLECTION_OPTIONS.map(opt => (
              <button key={opt} onClick={() => setReflectionChoice(opt)}
                className={`w-full text-left rounded-xl p-4 border transition-all ${reflectionChoice === opt ? 'border-primary/50 bg-primary/10' : `${glassPanel}`}`}>
                <span className="text-sm font-medium text-foreground/70">{opt}</span>
              </button>
            ))}

            {reflectionChoice && (
              <div className="flex justify-center">
                {renderBtn('See Results', () => setStep('outcome'))}
              </div>
            )}
          </motion.div>
        )}

        {/* ─── OUTCOME ─── */}
        {step === 'outcome' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">
            <div className="text-center">
              <motion.div
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-3 shadow-lg"
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}>
                <span className="text-3xl">🏆</span>
              </motion.div>
              <h1 className="text-2xl font-bold mb-1">After the Flood — Complete!</h1>
              <p className="text-xs text-muted-foreground">
                Allocation: <span className="font-bold text-primary capitalize">{fundingChoice?.replace(/-/g, ' ')}</span>
              </p>
            </div>

            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-4 text-center border border-primary/20">
              <p className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">+400 XP</p>
              <p className="text-xs text-muted-foreground">Experience earned from After the Flood</p>
            </div>

            <div className={`${glassPanel} p-4`}>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3 font-semibold">Performance Metrics</p>
              {[
                { label: 'Proportional Reasoning', score: 88, color: 'from-blue-500 to-cyan-500' },
                { label: 'Reading Comprehension', score: 85, color: 'from-purple-500 to-pink-500' },
                { label: 'Cost-Benefit Analysis', score: 90, color: 'from-amber-400 to-orange-500' },
                { label: 'Ethical Reasoning', score: 82, color: 'from-emerald-400 to-teal-500' },
              ].map((m, i) => (
                <div key={m.label} className="mb-3">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-foreground/60">{m.label}</span>
                    <span className="text-xs font-bold text-foreground/80">{m.score}/100</span>
                  </div>
                  <div className="h-2 rounded-full bg-foreground/5 overflow-hidden">
                    <motion.div className={`h-full rounded-full bg-gradient-to-r ${m.color}`}
                      initial={{ width: '0%' }} animate={{ width: `${m.score}%` }} transition={{ duration: 1, delay: 0.3 + i * 0.15 }} />
                  </div>
                </div>
              ))}
            </div>

            <div className={`${glassPanel} p-4`}>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3 font-semibold">Skills Practiced</p>
              <div className="flex flex-wrap gap-1.5">
                {SKILLS.map(s => (
                  <span key={s} className="px-2.5 py-1 rounded-full text-[10px] bg-primary/10 border border-primary/15 text-primary font-medium">+ {s}</span>
                ))}
              </div>
            </div>

            <div className={`${glassPanel} p-4`}>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3 font-semibold">Badge Earned</p>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-lg">🌊</div>
                <div>
                  <p className="text-sm font-semibold text-foreground/80">Climate Resilience Planner</p>
                  <p className="text-[10px] text-muted-foreground">Led Harbor Point through crisis allocation</p>
                </div>
              </div>
            </div>

            <div className={`${glassPanel} p-4`}>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 font-semibold">AI Feedback</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {fundingChoice === 'school-waterfront'
                  ? 'You balanced compassion with pragmatism — protecting the most vulnerable while partially guarding the economic engine. This shows values-driven leadership with awareness of tradeoffs.'
                  : fundingChoice === 'waterfront-drainage'
                  ? 'You prioritized long-term economic stability. Protecting $3.5M in annual revenue was the analytically strongest move, though it came at a human cost. Strong quantitative reasoning.'
                  : 'You chose the most compassionate path — protecting children and families first. While the waterfront risk remains, your decision reflects deep empathy and ethical reasoning.'}
              </p>
            </div>

            <button
              onClick={() => onComplete(deriveResult())}
              className="w-full py-3.5 rounded-xl btn-premium font-semibold text-sm flex items-center justify-center gap-2"
            >
              Back to Map <Icon icon="solar:arrow-right-bold" className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FloodSimulationView;

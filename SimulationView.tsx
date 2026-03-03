import { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

import avatarAlexSupervisor from '@/assets/avatar-alex-supervisor.png';

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

type LeadershipStyle = 'aggressive' | 'cautious' | 'strategic';

type SimStep =
  | 'briefing'
  | 'team'
  | 'decision1'
  | 'escalation'
  | 'evidence'
  | 'decision2'
  | 'outcome';

const NPCS = {
  alex: { name: 'Alex', role: 'Supervisor', color: '#6C8CFF', emoji: '🧑‍💼', avatar: avatarAlexSupervisor },
  jack: { name: 'Jack', role: 'Cyber Engineer', color: '#22D3EE', emoji: '👨‍💻', avatar: null as string | null },
  lily: { name: 'Lily', role: 'Threat Analyst', color: '#34D399', emoji: '🔍', avatar: null as string | null },
  emma: { name: 'Emma', role: 'Project Mgr', color: '#E879F9', emoji: '📋', avatar: null as string | null },
  mike: { name: 'Mike', role: 'IR Specialist', color: '#FF4D4D', emoji: '🛡️', avatar: null as string | null },
};

const BRIEFING_LINES = [
  "Welcome to Cyber Defense HQ. I'm Alex, your supervisor.",
  "You've just stepped into the role of Incident Response Team Lead.",
  "We've detected unusual outbound data traffic from a secure internal server. It could be nothing… or it could be the early stages of a breach.",
  "You'll need to gather intel, speak with your team, and decide how we respond.",
  "Your leadership shapes what happens next.",
];

const TEAM_DATA = [
  {
    npc: NPCS.jack,
    intro: "I've been monitoring server logs for the past two hours. Every 10 minutes, there's an outbound data transfer to an unfamiliar IP address. It's consistent. Automated. That's what worries me.",
  },
  {
    npc: NPCS.lily,
    intro: "I ran the IP through threat intelligence feeds. It partially matches infrastructure used by a ransomware group called AegisFox. They specialize in silent data extraction before deploying encryption payloads.",
  },
  {
    npc: NPCS.emma,
    intro: "My priority is process integrity. If this is a breach, documentation matters. If we act without preserving logs, we lose evidence.",
  },
  {
    npc: NPCS.mike,
    intro: "I handle containment. I can block traffic, isolate the server, or route everything through monitoring. But I need your direction.",
  },
];

const NETWORK_LOGS = [
  { time: '14:00:12', msg: 'Outbound 10.2MB → 185.*.*.42', level: 'warn' },
  { time: '14:10:15', msg: 'Outbound 18.7MB → 185.*.*.42', level: 'warn' },
  { time: '14:20:08', msg: 'Outbound 27.1MB → 185.*.*.42', level: 'critical' },
  { time: '14:30:11', msg: 'Encrypted TLS 1.3 — no cert match', level: 'critical' },
  { time: '14:40:03', msg: 'DNS query → aegis-c2.darknet', level: 'critical' },
];

interface DecisionOption {
  id: string;
  label: string;
  description: string;
  risk: string;
  style: LeadershipStyle;
  reaction: string;
  escalation: string;
}

const DECISION1_OPTIONS: DecisionOption[] = [
  {
    id: 'block',
    label: 'Block IP Immediately',
    description: 'Aggressive — stops data loss but alerts the attacker',
    risk: 'High',
    style: 'aggressive',
    reaction: 'Jack: "Fast move. I\'ll execute." Emma: "Make sure logs are preserved."',
    escalation: 'Transfers stopped. But two internal tools are malfunctioning. You may have blocked legitimate traffic.',
  },
  {
    id: 'monitor',
    label: 'Continue Monitoring',
    description: 'Cautious — gather more intel, but data keeps leaving',
    risk: 'Medium',
    style: 'cautious',
    reaction: 'Jack: "We\'re giving them time." Lily: "But more data means stronger evidence."',
    escalation: 'Data transfers continued. You captured a full encrypted payload at 10:20 AM. This could confirm attacker behavior.',
  },
  {
    id: 'segment',
    label: 'Segment Server & Monitor',
    description: 'Strategic — isolate without alerting, controlled observation',
    risk: 'Low',
    style: 'strategic',
    reaction: 'Mike: "Balanced approach. Isolating now." Emma: "Good — minimal disruption, preserved logs."',
    escalation: 'No further data left the server. Logs are fully preserved. Contained without disruption.',
  },
];

const DECISION2_OPTIONS: DecisionOption[] = [
  {
    id: 'forensic',
    label: 'Full Forensic Scan',
    description: 'Thorough analysis — exposure continues during scan',
    risk: 'Medium',
    style: 'cautious',
    reaction: 'Jack: "That\'s thorough. It\'ll take time."',
    escalation: '',
  },
  {
    id: 'lockdown',
    label: 'Partial System Lockdown',
    description: 'Fast containment — service disruption possible',
    risk: 'Low',
    style: 'aggressive',
    reaction: 'Jack: "Fast and aggressive."',
    escalation: '',
  },
  {
    id: 'monitor2',
    label: 'Continue Monitoring IP Cluster',
    description: 'More data collection — breach could continue',
    risk: 'High',
    style: 'strategic',
    reaction: 'Lily: "We\'ll gather stronger attribution."',
    escalation: '',
  },
];

const PACKET_DATA = [
  { time: '14:00', mb: 10, pct: 33 },
  { time: '14:10', mb: 15, pct: 50 },
  { time: '14:20', mb: 22, pct: 73 },
  { time: '14:30', mb: 27, pct: 90 },
  { time: '14:40', mb: 30, pct: 100 },
];

const SKILLS_EARNED = ['Risk Assessment', 'Evidence-Based Decision Making', 'Data Interpretation', 'Strategic Communication'];

const riskColor = (risk: string) =>
  risk === 'High' ? 'text-red-500' : risk === 'Medium' ? 'text-amber-500' : 'text-emerald-500';

function NpcBubble({ npc, text }: { npc: typeof NPCS.alex; text: string }) {
  return (
    <div className="flex gap-3 items-start">
      {npc.avatar ? (
        <div className="w-10 h-10 rounded-full overflow-hidden shrink-0" style={{ border: `2px solid ${npc.color}60` }}>
          <img src={npc.avatar} alt={npc.name} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0"
          style={{ background: `${npc.color}20` }}
        >
          {npc.emoji}
        </div>
      )}
      <div className="flex-1">
        <p className="text-xs font-bold" style={{ color: npc.color }}>{npc.name} — {npc.role}</p>
        <p className="text-sm text-foreground/80 mt-0.5 leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

const SimulationView = ({ onComplete, onExit }: Props) => {
  const [simStep, setSimStep] = useState<SimStep>('briefing');
  const [briefingLine, setBriefingLine] = useState(0);
  const [teamIndex, setTeamIndex] = useState(0);
  const [decision1, setDecision1] = useState<DecisionOption | null>(null);
  const [decision2, setDecision2] = useState<DecisionOption | null>(null);
  const [leadership, setLeadership] = useState<LeadershipStyle | null>(null);
  const [showReaction, setShowReaction] = useState(false);

  const handleDecision1 = (opt: DecisionOption) => {
    setDecision1(opt);
    setLeadership(opt.style);
    setShowReaction(true);
  };

  const handleDecision2 = (opt: DecisionOption) => {
    setDecision2(opt);
    setShowReaction(true);
  };

  const stepProgress = {
    briefing: 1, team: 2, decision1: 3, escalation: 4, evidence: 5, decision2: 6, outcome: 7,
  };

  return (
    <div className="fixed inset-0 z-[60] mesh-bg flex flex-col overflow-hidden">
      {/* Top bar */}
      <div className="px-4 pb-2 flex items-center gap-3" style={{ paddingTop: 'calc(0.75rem + env(safe-area-inset-top, 0px))' }}>
        <button onClick={onExit} className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center">
          <Icon icon="solar:arrow-left-linear" width={18} />
        </button>
        <div className="flex-1">
          <p className="text-xs font-bold text-primary">Operation Silent Breach</p>
          <p className="text-[10px] text-muted-foreground">Incident Response Team Lead</p>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-red-100 text-red-600">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[10px] font-bold">ALERT ACTIVE</span>
        </div>
      </div>

      {/* Progress */}
      <div className="px-4 flex gap-1">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex-1 h-1 rounded-full bg-white/30 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                background: 'linear-gradient(135deg, hsl(228 80% 70%), hsl(270 60% 70%))',
                width: i < stepProgress[simStep] ? '100%' : '0%',
              }}
            />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-24">
        {simStep === 'briefing' && (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <span className="text-3xl">🛡️</span>
              <h2 className="text-xl font-bold mt-2">Mission Briefing</h2>
              <p className="text-xs text-muted-foreground">Cyber Defense HQ</p>
            </div>

            <div className="space-y-3">
              {BRIEFING_LINES.slice(0, briefingLine + 1).map((line, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                  <NpcBubble npc={NPCS.alex} text={line} />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {simStep === 'team' && (
          <div className="space-y-4">
            <div className="text-center mb-2">
              <h2 className="text-lg font-bold">Meet the Team</h2>
              <p className="text-xs text-muted-foreground">Tap each team member to hear their report</p>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              {TEAM_DATA.map((member, i) => (
                <button
                  key={i}
                  onClick={() => setTeamIndex(i)}
                  className={`p-3 rounded-2xl text-center transition-all ${
                    teamIndex === i
                      ? 'bg-white shadow-md border-2'
                      : 'bg-white/40 border-2 border-transparent'
                  }`}
                  style={teamIndex === i ? { borderColor: member.npc.color } : {}}
                >
                  <span className="text-xl">{member.npc.emoji}</span>
                  <p className="text-xs font-bold mt-1">{member.npc.name}</p>
                  <p className="text-[10px] text-muted-foreground">{member.npc.role}</p>
                </button>
              ))}
            </div>

            <motion.div key={teamIndex} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
              <NpcBubble npc={TEAM_DATA[teamIndex].npc} text={TEAM_DATA[teamIndex].intro} />
            </motion.div>

            <div className="bento-card-strong p-3 mt-3">
              <p className="text-[10px] font-bold text-red-500 uppercase mb-2">Network Logs</p>
              <div className="space-y-1">
                {NETWORK_LOGS.map((log, i) => (
                  <div key={i} className={`flex items-center gap-2 text-[11px] font-mono ${
                    log.level === 'critical' ? 'text-red-600' : 'text-amber-600'
                  }`}>
                    <span className="text-muted-foreground/60">{log.time}</span>
                    <span>{log.msg}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {simStep === 'decision1' && (
          <div className="space-y-4">
            <NpcBubble npc={NPCS.alex} text="You've heard your team. What's your call?" />
            <p className="text-xs text-muted-foreground text-center">Choose your containment strategy</p>

            <div className="space-y-2.5">
              {DECISION1_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => handleDecision1(opt)}
                  disabled={!!decision1}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                    decision1?.id === opt.id
                      ? 'bg-white shadow-md border-primary'
                      : decision1
                        ? 'opacity-40 border-transparent bg-white/30'
                        : 'bg-white/50 border-transparent hover:bg-white/70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-bold text-sm">{opt.label}</p>
                    <span className={`text-[10px] font-bold ${riskColor(opt.risk)}`}>
                      {opt.risk} Risk
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{opt.description}</p>
                </button>
              ))}
            </div>

            {decision1 && showReaction && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bento-card-strong p-4">
                <p className="text-[10px] font-bold text-primary uppercase mb-2">Team Reaction</p>
                <p className="text-sm text-foreground/80">{decision1.reaction}</p>
                <div className="mt-2 flex items-center gap-1.5">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
                    {decision1.style} Leadership
                  </span>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {simStep === 'escalation' && decision1 && (
          <div className="space-y-4">
            <div className="text-center mb-2">
              <span className="text-2xl">⚡</span>
              <h2 className="text-lg font-bold mt-1">Escalation Outcome</h2>
            </div>
            <NpcBubble npc={NPCS.alex} text={decision1.escalation} />
            <NpcBubble npc={NPCS.alex} text="Let's review the evidence before we decide next steps." />
          </div>
        )}

        {simStep === 'evidence' && (
          <div className="space-y-4">
            <div className="text-center mb-2">
              <h2 className="text-lg font-bold">Evidence Review</h2>
              <p className="text-xs text-muted-foreground">Threat report & packet analysis</p>
            </div>

            <div className="bento-card-strong p-4">
              <p className="text-[10px] font-bold text-primary uppercase mb-2">Threat Report — AegisFox</p>
              <p className="text-xs text-foreground/80 leading-relaxed">
                AegisFox used encrypted outbound packets every 20 minutes. Target IP cluster: 185.4.72.xxx.
                Exfiltration preceded ransomware deployment.
              </p>
              <div className="flex gap-4 mt-3">
                <div>
                  <p className="text-[10px] text-muted-foreground">INTERVAL</p>
                  <p className="text-xs font-bold">Every 20 min</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">IP CLUSTER</p>
                  <p className="text-xs font-bold">185.4.72.xxx</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">SEQUENCE</p>
                  <p className="text-xs font-bold">Exfil → Ransom</p>
                </div>
              </div>
            </div>

            <div className="bento-card-strong p-4">
              <p className="text-[10px] font-bold text-red-500 uppercase mb-3">Packet Timing — Escalating Pattern</p>
              <div className="space-y-2">
                {PACKET_DATA.map((d, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground w-10 font-mono">{d.time}</span>
                    <div className="flex-1 h-3 rounded-full bg-white/40 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: d.pct > 70 ? '#ef4444' : d.pct > 40 ? '#f59e0b' : '#22d3ee' }}
                        initial={{ width: 0 }}
                        animate={{ width: `${d.pct}%` }}
                        transition={{ delay: i * 0.15, duration: 0.4 }}
                      />
                    </div>
                    <span className="text-[10px] font-bold w-10 text-right">{d.mb}MB</span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-red-500 mt-2 font-bold text-center">⚠ Escalating pattern detected</p>
            </div>

            <NpcBubble npc={NPCS.lily} text="Our suspicious IP falls within that range." />
            <NpcBubble npc={NPCS.jack} text="And the timing is close. Ours is every 10 minutes." />
          </div>
        )}

        {simStep === 'decision2' && (
          <div className="space-y-4">
            <NpcBubble npc={NPCS.alex} text="Do we escalate?" />
            <p className="text-xs text-muted-foreground text-center">Decision Point 2: Next Steps</p>

            <div className="space-y-2.5">
              {DECISION2_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => handleDecision2(opt)}
                  disabled={!!decision2}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                    decision2?.id === opt.id
                      ? 'bg-white shadow-md border-primary'
                      : decision2
                        ? 'opacity-40 border-transparent bg-white/30'
                        : 'bg-white/50 border-transparent hover:bg-white/70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-bold text-sm">{opt.label}</p>
                    <span className={`text-[10px] font-bold ${riskColor(opt.risk)}`}>
                      {opt.risk} Risk
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{opt.description}</p>
                </button>
              ))}
            </div>

            {decision2 && showReaction && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bento-card-strong p-4">
                <p className="text-[10px] font-bold text-primary uppercase mb-2">Team Reaction</p>
                <p className="text-sm text-foreground/80">{decision2.reaction}</p>
              </motion.div>
            )}
          </div>
        )}

        {simStep === 'outcome' && leadership && (
          <div className="space-y-5">
            <div className="text-center">
              <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring' }}>
                <span className="text-5xl">🛡️</span>
              </motion.div>
              <h2 className="text-xl font-bold mt-3">Operation Complete!</h2>
              <p className="text-sm text-muted-foreground">Leadership Style: <span className="font-bold capitalize text-primary">{leadership}</span></p>
            </div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center py-4"
            >
              <p className="text-4xl font-extrabold text-amber-500">+250 XP</p>
              <p className="text-xs text-muted-foreground mt-1">Experience earned from Operation Silent Breach</p>
            </motion.div>

            <div className="bento-card-strong p-4 text-center">
              <p className="text-[10px] font-bold text-primary uppercase mb-2">Badge Unlocked</p>
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                <Icon icon="solar:shield-check-bold" className="text-white" width={32} />
              </div>
              <p className="font-bold mt-2">Incident Response Leader</p>
              <p className="text-xs text-muted-foreground">Led team through Operation Silent Breach</p>
            </div>

            <div className="bento-card-strong p-4">
              <p className="text-[10px] font-bold text-primary uppercase mb-3">Skills Practiced</p>
              <div className="flex flex-wrap gap-1.5">
                {SKILLS_EARNED.map(skill => (
                  <span key={skill} className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom action */}
      <div className="absolute bottom-0 left-0 right-0 px-4 pt-3 bg-gradient-to-t from-background via-background/90 to-transparent" style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))' }}>
        {simStep === 'briefing' && (
          <button
            onClick={() => {
              if (briefingLine < BRIEFING_LINES.length - 1) {
                setBriefingLine(briefingLine + 1);
              } else {
                setSimStep('team');
              }
            }}
            className="w-full btn-premium py-3.5 font-semibold text-sm"
          >
            {briefingLine < BRIEFING_LINES.length - 1 ? 'Continue' : 'Enter HQ'}
          </button>
        )}

        {simStep === 'team' && (
          <button onClick={() => setSimStep('decision1')} className="w-full btn-premium py-3.5 font-semibold text-sm">
            Proceed to Decision
          </button>
        )}

        {simStep === 'decision1' && decision1 && (
          <button
            onClick={() => { setShowReaction(false); setSimStep('escalation'); }}
            className="w-full btn-premium py-3.5 font-semibold text-sm"
          >
            See What Happens
          </button>
        )}

        {simStep === 'escalation' && (
          <button onClick={() => setSimStep('evidence')} className="w-full btn-premium py-3.5 font-semibold text-sm">
            Review Evidence
          </button>
        )}

        {simStep === 'evidence' && (
          <button onClick={() => setSimStep('decision2')} className="w-full btn-premium py-3.5 font-semibold text-sm">
            Proceed to Decision
          </button>
        )}

        {simStep === 'decision2' && decision2 && (
          <button
            onClick={() => { setShowReaction(false); setSimStep('outcome'); }}
            className="w-full btn-premium py-3.5 font-semibold text-sm"
          >
            View Results
          </button>
        )}

        {simStep === 'outcome' && leadership && (
          <button
            onClick={() => onComplete({
              leadershipStyle: leadership,
              xpEarned: 250,
              badge: 'Incident Response Leader',
              skills: SKILLS_EARNED,
            })}
            className="w-full btn-premium py-3.5 font-bold text-sm"
          >
            Return to Map
          </button>
        )}
      </div>
    </div>
  );
};

export default SimulationView;

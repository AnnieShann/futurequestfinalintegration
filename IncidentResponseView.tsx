import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';

import avatarAlexSupervisor from '@/assets/avatar-alex-supervisor.png';
import avatarAlyssa from '@/assets/avatar-alyssa.png';
import avatarJavier from '@/assets/avatar-javier.png';
import avatarMia from '@/assets/avatar-mia.png';
import avatarOlivia from '@/assets/avatar-olivia.png';
import avatarSophie from '@/assets/avatar-sophie.png';
import cyberHqBg from '@/assets/cyber-hq-bg.jpg';

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

type Phase = 'role-select' | 'hub' | 'room-task' | 'outcome';

const ROLES = [
  { id: 'soc', title: 'SOC Analyst', name: 'Alex Chen', avatar: avatarAlexSupervisor, color: '#6C8CFF', icon: 'solar:shield-bold' },
  { id: 'coord', title: 'Incident Coordinator', name: 'Alyssa Williams', avatar: avatarAlyssa, color: '#9C6BFF', icon: 'solar:station-bold' },
  { id: 'comms', title: 'Communications Lead', name: 'Javier Martinez', avatar: avatarJavier, color: '#E879F9', icon: 'solar:chat-round-bold' },
  { id: 'threat', title: 'Threat Analyst', name: 'Mia Johnson', avatar: avatarMia, color: '#34D399', icon: 'solar:magnifer-bold' },
];

const TEAM = [
  { name: 'Olivia Park', title: 'Security Engineer', avatar: avatarOlivia },
  { name: 'Sophie Laurent', title: 'Risk Analyst', avatar: avatarSophie },
  { name: 'Marcus Reid', title: 'Network Ops', avatar: avatarOlivia },
];

const EVIDENCE = [
  { id: 1, title: 'Unusual Login', desc: 'Multiple failed logins from 192.168.4.102', type: 'critical' as const, icon: 'solar:danger-triangle-bold' },
  { id: 2, title: 'Phishing Email', desc: "Suspicious from 'IT-Support@c0mpany.net'", type: 'warning' as const, icon: 'solar:letter-bold' },
  { id: 3, title: 'Login Anomaly', desc: 'Unrecognized device at 2:34 AM', type: 'info' as const, icon: 'solar:graph-up-bold' },
];

const DECISIONS = [
  { id: 'a', text: 'Disable account & notify employee immediately', style: 'aggressive' as const },
  { id: 'b', text: 'Monitor activity silently to gather intelligence', style: 'cautious' as const },
  { id: 'c', text: 'Escalate to senior management first', style: 'strategic' as const },
];

const CHAT_MESSAGES = [
  { name: 'Priya', avatar: avatarMia, msg: 'Phishing domain identified — spoofing IT support.', time: '2m' },
  { name: 'Sam', avatar: avatarOlivia, msg: '3 employees clicked the link. Credentials may be compromised.', time: '1m' },
];

const ROOMS = [
  { id: 'alerts', title: 'Alerts Room', color: '#FF4D4D', icon: 'solar:alarm-bold', status: 'locked' },
  { id: 'email', title: 'Email Analysis', color: '#6C8CFF', icon: 'solar:letter-bold', status: 'active' },
  { id: 'decision', title: 'Decision Room', color: '#22D3EE', icon: 'solar:widget-bold', status: 'locked' },
  { id: 'comms', title: 'Client Comms', color: '#E879F9', icon: 'solar:chat-round-bold', status: 'locked' },
];

const METRICS = [
  { label: 'Threat Detection', score: 92, color: '#6C8CFF' },
  { label: 'Decision Making', score: 85, color: '#9C6BFF' },
  { label: 'Team Communication', score: 78, color: '#E879F9' },
  { label: 'Time Management', score: 88, color: '#34D399' },
];

const SKILLS = ['Incident Response', 'Phishing Detection', 'Crisis Communication', 'Data Analysis', 'Team Coordination'];

const BADGES = [
  { title: 'First Responder', desc: 'Completed first simulation', icon: 'solar:shield-star-bold', color: '#6C8CFF' },
  { title: 'Quick Thinker', desc: 'Made decisions under 2 min', icon: 'solar:bolt-bold', color: '#F59E0B' },
  { title: 'Team Player', desc: 'Coordinated with all teammates', icon: 'solar:users-group-rounded-bold', color: '#34D399' },
];

const typeColors = { critical: '#FF4D4D', warning: '#F59E0B', info: '#6C8CFF' };

const IncidentResponseView = ({ onComplete, onExit }: Props) => {
  const [phase, setPhase] = useState<Phase>('role-select');
  const [selectedRole, setSelectedRole] = useState('soc');
  const [selectedDecision, setSelectedDecision] = useState('a');
  const [expandedEvidence, setExpandedEvidence] = useState<number | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [localChat, setLocalChat] = useState(CHAT_MESSAGES);

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    setLocalChat(prev => [...prev, { name: 'You', avatar: ROLES.find(r => r.id === selectedRole)?.avatar || avatarAlexSupervisor, msg: chatInput, time: 'now' }]);
    setChatInput('');
  };

  const handleSubmitDecision = () => {
    const style = DECISIONS.find(d => d.id === selectedDecision)?.style || 'strategic';
    setPhase('outcome');
    setTimeout(() => {}, 0);
  };

  const handleFinish = () => {
    const style = DECISIONS.find(d => d.id === selectedDecision)?.style || 'strategic';
    onComplete({
      leadershipStyle: style,
      xpEarned: 250,
      badge: 'First Responder',
      skills: SKILLS,
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col">
      <div className="absolute inset-0" style={{ backgroundImage: `url(${cyberHqBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a]/90 via-[#0f172a]/85 to-[#0f172a]/95" />

      <button
        onClick={onExit}
        className="absolute right-3 z-50 w-8 h-8 rounded-full bg-white/10 backdrop-blur flex items-center justify-center"
        style={{ top: 'calc(0.75rem + env(safe-area-inset-top, 0px))' }}
      >
        <Icon icon="solar:close-circle-bold" className="w-5 h-5 text-white/60" />
      </button>

      <div className="relative z-10 flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {phase === 'role-select' && <RoleSelectPhase key="role" selectedRole={selectedRole} onSelectRole={setSelectedRole} onStart={() => setPhase('hub')} />}
          {phase === 'hub' && <HubPhase key="hub" selectedRole={selectedRole} onEnterRoom={() => setPhase('room-task')} />}
          {phase === 'room-task' && (
            <RoomTaskPhase
              key="task"
              selectedDecision={selectedDecision}
              onSelectDecision={setSelectedDecision}
              expandedEvidence={expandedEvidence}
              onExpandEvidence={setExpandedEvidence}
              chatMessages={localChat}
              chatInput={chatInput}
              onChatInput={setChatInput}
              onSendChat={handleSendChat}
              onSubmit={handleSubmitDecision}
            />
          )}
          {phase === 'outcome' && <OutcomePhase key="outcome" onFinish={handleFinish} />}
        </AnimatePresence>
      </div>
    </div>
  );
};

function RoleSelectPhase({ selectedRole, onSelectRole, onStart }: { selectedRole: string; onSelectRole: (id: string) => void; onStart: () => void }) {
  return (
    <motion.div className="px-4 pt-12 pb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <h1 className="text-xl font-bold text-white mb-1">Choose Your Role</h1>
      <p className="text-xs text-white/50 mb-5">Select your character for the Cybersecurity Incident Response</p>

      <div className="grid grid-cols-2 gap-3 mb-5">
        {ROLES.map(role => {
          const isSel = selectedRole === role.id;
          return (
            <motion.button
              key={role.id}
              onClick={() => onSelectRole(role.id)}
              className={`rounded-2xl overflow-hidden text-left transition-all ${isSel ? 'ring-2 ring-[#6C8CFF] shadow-[0_0_20px_rgba(108,140,255,0.3)]' : 'ring-1 ring-white/10'}`}
              whileTap={{ scale: 0.97 }}
            >
              <div className="aspect-square relative overflow-hidden bg-black/20">
                <img src={role.avatar} alt={role.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                {isSel && (
                  <motion.div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#6C8CFF] flex items-center justify-center" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <Icon icon="solar:check-circle-bold" className="w-4 h-4 text-white" />
                  </motion.div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-2.5">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: `${role.color}30` }}>
                      <Icon icon={role.icon} className="w-3 h-3" style={{ color: role.color }} />
                    </div>
                    <span className="text-[10px] font-bold text-white/80">{role.title}</span>
                  </div>
                  <p className="text-[9px] text-white/50 pl-6">{role.name}</p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="rounded-2xl bg-white/5 border border-white/10 p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Icon icon="solar:shield-warning-bold" className="w-4 h-4 text-[#9C6BFF]" />
          <p className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Mission Brief</p>
        </div>
        <p className="text-xs text-white/60 leading-relaxed mb-2">
          A phishing attack has been detected targeting employees with access to client financial data.
          Your team must identify the scope, contain the breach, and communicate with affected stakeholders — all within 20 minutes.
        </p>
        <p className="text-[10px] text-white/30 italic">Your choices will be reflected in your Skill Passport.</p>
      </div>

      <div className="rounded-2xl bg-white/5 border border-white/10 p-4 mb-5">
        <p className="text-[10px] text-white/40 uppercase tracking-wider font-semibold mb-3">Your Team</p>
        <div className="space-y-2">
          {TEAM.map(tm => (
            <div key={tm.name} className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5 border border-white/8">
              <img src={tm.avatar} alt={tm.name} className="w-8 h-8 rounded-full object-cover" />
              <div>
                <p className="text-xs font-medium text-white/70">{tm.name}</p>
                <p className="text-[10px] text-white/40">{tm.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button onClick={onStart} className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#6C8CFF] to-[#9C6BFF] text-white font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform">
        Start Simulation <Icon icon="solar:arrow-right-linear" className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

function HubPhase({ selectedRole, onEnterRoom }: { selectedRole: string; onEnterRoom: () => void }) {
  return (
    <motion.div className="px-4 pt-12 pb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-white">Cyber Defense HQ</h2>
          <p className="text-[10px] text-white/40">Select a room to investigate</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
          <Icon icon="solar:clock-circle-bold" className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-mono text-xs font-bold text-amber-400">18:30</span>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-5 px-2 py-2 rounded-xl bg-white/5 border border-white/8">
        <Icon icon="solar:users-group-rounded-bold" className="w-3.5 h-3.5 text-white/30" />
        {ROLES.map(role => (
          <div key={role.id} className={`flex items-center gap-1.5 px-2 py-1 rounded-lg ${selectedRole === role.id ? 'bg-white/10 border border-white/15' : ''}`}>
            <img src={role.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
            {selectedRole === role.id && <span className="text-[9px] text-white/60 font-medium">{role.title}</span>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        {ROOMS.map(room => {
          const isActive = room.status === 'active';
          return (
            <motion.button
              key={room.id}
              onClick={() => isActive && onEnterRoom()}
              className={`rounded-2xl p-4 text-left border transition-all ${isActive ? 'border-[#6C8CFF]/40 bg-[#6C8CFF]/10 shadow-[0_0_20px_rgba(108,140,255,0.15)]' : 'border-white/8 bg-white/3 opacity-50'}`}
              whileTap={isActive ? { scale: 0.97 } : {}}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${room.color}20` }}>
                <Icon icon={room.icon} className="w-5 h-5" style={{ color: room.color }} />
              </div>
              <p className="text-xs font-bold text-white/80 mb-0.5">{room.title}</p>
              {isActive ? (
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#6C8CFF] animate-pulse" />
                  <span className="text-[9px] text-[#6C8CFF] font-bold uppercase">Active</span>
                </div>
              ) : (
                <span className="text-[9px] text-white/30">Locked</span>
              )}
            </motion.button>
          );
        })}
      </div>

      <button onClick={onEnterRoom} className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#6C8CFF] to-[#9C6BFF] text-white font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform">
        <Icon icon="solar:login-2-bold" className="w-4 h-4" /> Enter Email Analysis
      </button>
    </motion.div>
  );
}

function RoomTaskPhase({
  selectedDecision, onSelectDecision, expandedEvidence, onExpandEvidence,
  chatMessages, chatInput, onChatInput, onSendChat, onSubmit,
}: {
  selectedDecision: string; onSelectDecision: (id: string) => void;
  expandedEvidence: number | null; onExpandEvidence: (id: number | null) => void;
  chatMessages: typeof CHAT_MESSAGES; chatInput: string; onChatInput: (v: string) => void;
  onSendChat: () => void; onSubmit: () => void;
}) {
  return (
    <motion.div className="px-4 pt-12 pb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6C8CFF] to-[#9C6BFF] flex items-center justify-center">
            <Icon icon="solar:letter-bold" className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Email Analysis Room</h2>
            <p className="text-[9px] text-white/30">Incident Response</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="font-mono text-[10px] text-amber-400 font-bold">14:27</span>
        </div>
      </div>

      {/* Evidence Section */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-3 mb-4">
        <div className="flex items-center gap-1.5 mb-2">
          <div className="w-2 h-2 rounded-full bg-[#6C8CFF] animate-pulse" />
          <p className="text-[9px] text-white/40 uppercase tracking-widest font-semibold">Evidence</p>
        </div>
        <div className="space-y-2">
          {EVIDENCE.map(ev => {
            const isExpanded = expandedEvidence === ev.id;
            return (
              <motion.button
                key={ev.id}
                onClick={() => onExpandEvidence(isExpanded ? null : ev.id)}
                className={`w-full rounded-xl p-3 border text-left transition-all ${isExpanded ? 'border-[#6C8CFF]/30 bg-[#6C8CFF]/5' : 'border-white/5 bg-white/[0.02]'}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon icon={ev.icon} className="w-3.5 h-3.5" style={{ color: typeColors[ev.type] }} />
                  <span className="text-[8px] uppercase tracking-wider font-bold" style={{ color: typeColors[ev.type] }}>{ev.type}</span>
                </div>
                <h4 className="text-[11px] font-semibold text-white/75 mb-0.5">{ev.title}</h4>
                <p className="text-[10px] text-white/30 leading-snug">{ev.desc}</p>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Phishing Email Preview */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-3 mb-4">
        <p className="text-[9px] text-white/40 uppercase tracking-widest font-semibold mb-2">Phishing Email</p>
        <div className="font-mono text-[10px] leading-relaxed space-y-0.5">
          <p className="text-white/30">From: <span className="text-amber-400">IT-Support@c0mpany.net</span></p>
          <p className="text-white/30">Subject: <span className="text-white/60">Urgent: Password Reset Required</span></p>
          <p className="text-white/35 mt-1">Your password has expired. Click <span className="text-red-400 underline">here</span> to reset immediately...</p>
        </div>
      </div>

      {/* Team Chat */}
      <div className="rounded-2xl bg-white/5 border border-white/10 mb-4 overflow-hidden">
        <div className="px-3 py-2 border-b border-white/8 flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <p className="text-[9px] text-white/40 uppercase tracking-widest font-semibold">Team Chat</p>
          <span className="text-[8px] text-emerald-400/60 ml-auto">LIVE</span>
        </div>
        <div className="p-3 space-y-2.5 max-h-[140px] overflow-y-auto">
          {chatMessages.map((msg, i) => (
            <div key={i} className="flex gap-2">
              <img src={msg.avatar} alt="" className="w-6 h-6 rounded-full object-cover mt-0.5 ring-1 ring-white/15" />
              <div className="flex-1">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[10px] font-semibold text-white/55">{msg.name}</span>
                  <span className="text-[8px] text-white/20">{msg.time}</span>
                </div>
                <div className="rounded-lg rounded-tl-sm px-2.5 py-1.5 bg-white/[0.03] border border-white/[0.05]">
                  <p className="text-[10px] text-white/50 leading-relaxed">{msg.msg}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-2 border-t border-white/8 flex gap-1.5">
          <input
            type="text"
            value={chatInput}
            onChange={e => onChatInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && onSendChat()}
            placeholder="Message..."
            className="flex-1 px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[11px] text-white/50 placeholder:text-white/20 focus:outline-none focus:border-[#6C8CFF]/40"
          />
          <button onClick={onSendChat} className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#6C8CFF] to-[#9C6BFF] flex items-center justify-center">
            <Icon icon="solar:plain-bold" className="w-3 h-3 text-white" />
          </button>
        </div>
      </div>

      {/* Decision Options */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-3 mb-4">
        <p className="text-[9px] text-white/40 uppercase tracking-widest font-semibold mb-2">Your Decision</p>
        <div className="space-y-2">
          {DECISIONS.map(d => (
            <button
              key={d.id}
              onClick={() => onSelectDecision(d.id)}
              className={`w-full rounded-xl px-3 py-2.5 text-left border flex items-center gap-2 transition-all ${
                selectedDecision === d.id ? 'border-[#6C8CFF]/30 bg-[#6C8CFF]/[0.06] text-white/80' : 'border-white/5 bg-white/[0.01] text-white/40'
              }`}
            >
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                selectedDecision === d.id ? 'border-[#6C8CFF] bg-[#6C8CFF]' : 'border-white/20'
              }`}>
                {selectedDecision === d.id && <Icon icon="solar:check-circle-bold" className="w-3 h-3 text-white" />}
              </div>
              <span className="text-[11px]">{d.text}</span>
            </button>
          ))}
        </div>
      </div>

      <button onClick={onSubmit} className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#6C8CFF] to-[#9C6BFF] text-white font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform">
        Submit Decision <Icon icon="solar:arrow-right-linear" className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

function OutcomePhase({ onFinish }: { onFinish: () => void }) {
  return (
    <motion.div className="px-4 pt-12 pb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="text-center mb-6">
        <motion.div
          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#6C8CFF] to-[#9C6BFF] flex items-center justify-center mx-auto mb-4"
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}
          style={{ boxShadow: '0 0 40px rgba(108,140,255,0.4)' }}
        >
          <Icon icon="solar:cup-star-bold" className="w-8 h-8 text-white" />
        </motion.div>
        <h1 className="text-xl font-bold text-white mb-1">Simulation Complete!</h1>
        <p className="text-xs text-white/50">Cybersecurity Incident Response</p>
      </div>

      {/* Performance Metrics */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-4 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Icon icon="solar:target-bold" className="w-4 h-4 text-[#6C8CFF]" />
          <p className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Performance Metrics</p>
        </div>
        <div className="space-y-3">
          {METRICS.map((m, i) => (
            <motion.div key={m.label} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-white/60 font-medium">{m.label}</span>
                <span className="text-xs font-bold text-white/80">{m.score}/100</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                <motion.div className="h-full rounded-full" style={{ background: m.color }} initial={{ width: '0%' }} animate={{ width: `${m.score}%` }} transition={{ duration: 1, delay: 0.5 + i * 0.15 }} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* AI Feedback */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Icon icon="solar:bolt-bold" className="w-4 h-4 text-amber-500" />
          <p className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">AI Feedback</p>
        </div>
        <p className="text-xs text-white/50 leading-relaxed">
          Strong performance in threat detection — you identified the phishing email quickly.
          Consider taking more time on stakeholder communication; rushing decisions under pressure can lead to incomplete responses.
          Your collaboration with the team was above average.
        </p>
      </div>

      {/* Skills Added */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Icon icon="solar:medal-ribbons-star-bold" className="w-4 h-4 text-[#9C6BFF]" />
          <p className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Skills Added to Passport</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {SKILLS.map((s, i) => (
            <motion.span
              key={s}
              className="px-2.5 py-1 rounded-full text-[10px] bg-[#6C8CFF]/10 border border-[#6C8CFF]/20 text-[#6C8CFF] font-medium"
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 + i * 0.08 }}
            >
              + {s}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Badges */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-4 mb-4">
        <p className="text-[10px] text-white/40 uppercase tracking-wider font-semibold mb-3">Badges Earned</p>
        <div className="space-y-2">
          {BADGES.map((b, i) => (
            <motion.div
              key={b.title}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/8"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + i * 0.12 }}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${b.color}20` }}>
                <Icon icon={b.icon} className="w-5 h-5" style={{ color: b.color }} />
              </div>
              <div>
                <p className="text-xs font-semibold text-white/80">{b.title}</p>
                <p className="text-[10px] text-white/40">{b.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Readiness Level */}
      <div className="rounded-2xl bg-gradient-to-br from-[#6C8CFF]/10 to-[#9C6BFF]/10 border border-[#6C8CFF]/20 p-4 mb-5">
        <div className="flex items-center gap-2 mb-2">
          <Icon icon="solar:graph-up-bold" className="w-4 h-4 text-[#6C8CFF]" />
          <p className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Readiness Level</p>
        </div>
        <div className="flex items-end gap-2 mb-1">
          <span className="text-2xl font-bold text-[#6C8CFF]">Level 2</span>
          <span className="text-xs text-white/50 mb-0.5">→ Explorer</span>
        </div>
        <p className="text-[10px] text-white/40">Real Opportunities are now unlocked!</p>
      </div>

      <button onClick={onFinish} className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#6C8CFF] to-[#9C6BFF] text-white font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform">
        Go to Real Opportunities <Icon icon="solar:arrow-right-linear" className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

export default IncidentResponseView;

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { npcCharacters, npcMessages, vibeColors, type Player } from '@/data/mockData';

interface Props {
  npcId: string;
  onClose: () => void;
}

const NpcChatOverlay = ({ npcId, onClose }: Props) => {
  const [reply, setReply] = useState('');
  const [replies, setReplies] = useState<string[]>([]);

  const npc = npcCharacters.find(n => n.id === npcId);
  const messages = npcMessages[npcId] || [];
  if (!npc) return null;

  const color = vibeColors[npc.vibe];

  const handleSend = () => {
    if (!reply.trim()) return;
    setReplies(prev => [...prev, reply.trim()]);
    setReply('');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-x-0 top-0 z-[1000] flex flex-col"
      style={{ bottom: 'calc(5rem + env(safe-area-inset-bottom, 0px))' }}
    >
      <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="bg-card rounded-t-3xl max-h-[70vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
          <div className="w-12 h-12 rounded-full overflow-hidden border-3 shrink-0" style={{ borderColor: color }}>
            <img src={npc.photo} alt={npc.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base">{npc.name}</h3>
            <p className="text-xs text-muted-foreground">{npc.npcRole} • {npc.statement?.split('•')[1]?.trim()}</p>
          </div>
          <button onClick={onClose} className="p-2 text-muted-foreground active:scale-90 transition-transform">
            <Icon icon="solar:close-circle-bold" width={24} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 shrink-0" style={{ borderColor: color }}>
                <img src={npc.photo} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[80%]">
                <p className="text-sm">{msg.text}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{msg.time}</p>
              </div>
            </div>
          ))}
          {replies.map((r, i) => (
            <div key={`r-${i}`} className="flex justify-end">
              <div className="rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[80%] text-sm text-white" style={{ background: color }}>
                {r}
              </div>
            </div>
          ))}
        </div>

        {/* Quick replies + input */}
        <div className="p-4 border-t border-border space-y-3">
          {replies.length === 0 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {['Tell me more!', 'When can I visit?', "I'm interested 🙋"].map(q => (
                <button
                  key={q}
                  onClick={() => setReplies([q])}
                  className="shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border border-border bg-muted hover:bg-muted/80 active:scale-95 transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <input
              value={reply}
              onChange={e => setReply(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              className="flex-1 bg-muted rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={handleSend}
              className="w-10 h-10 rounded-xl flex items-center justify-center active:scale-90 transition-transform"
              style={{ background: color }}
            >
              <Icon icon="solar:plain-bold" width={18} className="text-white" />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default NpcChatOverlay;

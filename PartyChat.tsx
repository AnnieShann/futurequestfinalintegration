import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { maya, vibeColors } from '@/data/mockData';
import { useParty } from '@/contexts/PartyContext';

const PartyChat = () => {
  const { partyMembers, chatMessages, sendMessage } = useParty();
  const [expanded, setExpanded] = useState(false);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input.trim(), maya);
    setInput('');
  };

  return (
    <div className="absolute left-4 z-[800]" style={{ bottom: 'calc(6rem + env(safe-area-inset-bottom, 0px))' }}>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-2 w-[calc(100vw-2rem)] max-w-80 bg-background/92 backdrop-blur-md rounded-2xl border border-border overflow-hidden shadow-xl"
          >
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <span className="text-sm font-bold">Party Chat</span>
              <button onClick={() => setExpanded(false)} className="text-muted-foreground">
                <Icon icon="solar:minimize-bold" width={18} />
              </button>
            </div>
            <div className="p-4 space-y-3.5 max-h-52 overflow-y-auto">
              {chatMessages.map((msg, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border-2" style={{ borderColor: vibeColors[msg.from.vibe] }}>
                    <img src={msg.from.photo} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">{msg.from.name.split(' ')[0]}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-border flex gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Say something..."
                className="flex-1 bg-muted rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button onClick={handleSend} className="shrink-0 w-10 h-10 rounded-xl bg-primary flex items-center justify-center active:scale-90 transition-transform">
                <Icon icon="solar:plain-bold" width={18} className="text-primary-foreground" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!expanded && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={() => setExpanded(true)}
          className="flex items-center gap-2 bg-background/92 backdrop-blur-md rounded-full px-4 py-2.5 border border-border active:scale-95 transition-transform shadow-lg"
        >
          <div className="flex -space-x-2">
            {partyMembers.map(p => (
              <div key={p.id} className="w-7 h-7 rounded-full overflow-hidden border-2 border-background">
                <img src={p.photo} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <span className="text-sm font-medium">Party ({partyMembers.length + 1})</span>
          <Icon icon="solar:chat-round-dots-bold" width={18} className="text-primary" />
        </motion.button>
      )}
    </div>
  );
};

export default PartyChat;

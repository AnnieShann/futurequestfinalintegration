import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { maya, vibeColors, vibeEmoji } from '@/data/mockData';
import {
  getConversations,
  getProfileById,
  type Conversation,
  type DirectMessage,
} from '@/data/socialData';
import { useParty } from '@/contexts/PartyContext';

const MessagesTab = () => {
  const { isPartyFormed, partyMembers, chatMessages, sendMessage } = useParty();
  const conversations = getConversations();

  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [partyChatExpanded, setPartyChatExpanded] = useState(false);
  const [localMessages, setLocalMessages] = useState<Record<string, DirectMessage[]>>(() => {
    const init: Record<string, DirectMessage[]> = {};
    conversations.forEach((c) => {
      init[c.participantId] = c.messages;
    });
    return init;
  });

  const getMessagesFor = (participantId: string): DirectMessage[] =>
    localMessages[participantId] ?? conversations.find((c) => c.participantId === participantId)?.messages ?? [];

  const getLastMessage = (participantId: string): DirectMessage | undefined => {
    const msgs = getMessagesFor(participantId);
    return msgs[msgs.length - 1];
  };

  const getUnreadCount = (participantId: string): number =>
    conversations.find((c) => c.participantId === participantId)?.unreadCount ?? 0;

  const handleSendMessage = () => {
    const text = messageInput.trim();
    if (!text || !activeConversation) return;

    const newMsg: DirectMessage = {
      id: 'local-' + Date.now(),
      fromId: 'maya',
      text,
      time: 'Just now',
      read: true,
    };

    setLocalMessages((prev) => ({
      ...prev,
      [activeConversation]: [...(prev[activeConversation] ?? []), newMsg],
    }));
    setMessageInput('');
  };

  const handleSendPartyMessage = () => {
    const text = messageInput.trim();
    if (!text) return;
    sendMessage(text, maya);
    setMessageInput('');
  };

  // --- Chat view (expanded conversation) ---
  if (activeConversation) {
    const profile = getProfileById(activeConversation);
    const player = profile?.player;
    const messages = getMessagesFor(activeConversation);

    if (!player) return null;

    const color = vibeColors[player.vibe];

    return (
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 bg-card border-b border-border shrink-0">
          <button
            onClick={() => setActiveConversation(null)}
            className="p-2 -ml-2 rounded-full hover:bg-muted active:scale-95 transition-all"
          >
            <Icon icon="solar:arrow-left-outline" width={22} />
          </button>
          <div
            className="w-12 h-12 rounded-full overflow-hidden border-2 shrink-0"
            style={{ borderColor: color }}
          >
            <img src={player.photo} alt={player.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm truncate">{player.name}</p>
            <p className="text-[10px] text-muted-foreground">
              {player.isNpc ? player.npcRole : `${vibeEmoji[player.vibe]} ${player.vibe}`}
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          <AnimatePresence initial={false}>
            {messages.map((msg) => {
              const isMaya = msg.fromId === 'maya';
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${isMaya ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2.5 rounded-2xl ${
                      isMaya ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-[10px] mt-1 ${isMaya ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                      {msg.time}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Input */}
        <div className="px-4 py-3 bg-card border-t border-border flex gap-2 shrink-0">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2.5 rounded-2xl bg-muted border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <button
            onClick={handleSendMessage}
            disabled={!messageInput.trim()}
            className="p-2.5 rounded-2xl bg-primary text-primary-foreground disabled:opacity-50 active:scale-95 transition-all"
          >
            <Icon icon="solar:plain-bold" width={20} />
          </button>
        </div>
      </div>
    );
  }

  // --- Conversation list view ---
  return (
    <div className="px-4 py-4 space-y-4">
      {/* Party Chat Entry */}
      {isPartyFormed && (
        <motion.div
          layout
          className="bg-card rounded-2xl border border-border overflow-hidden"
        >
          <button
            onClick={() => setPartyChatExpanded((p) => !p)}
            className="w-full p-4 flex items-center gap-3 text-left active:bg-muted/50 transition-colors"
          >
            <div className="flex -space-x-2">
              {partyMembers.slice(0, 3).map((m, i) => (
                <div
                  key={m.id}
                  className="w-10 h-10 rounded-full overflow-hidden border-2 border-card"
                  style={{ zIndex: 3 - i, marginLeft: i > 0 ? -8 : 0 }}
                >
                  <img src={m.photo} alt={m.name} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm">Party Chat</p>
              <p className="text-xs text-muted-foreground truncate">
                {chatMessages.length > 0
                  ? chatMessages[chatMessages.length - 1].text
                  : 'No messages yet'}
              </p>
            </div>
            <Icon
              icon={partyChatExpanded ? 'solar:alt-arrow-up-outline' : 'solar:alt-arrow-down-outline'}
              width={18}
              className="text-muted-foreground shrink-0"
            />
          </button>

          <AnimatePresence>
            {partyChatExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="border-t border-border"
              >
                <div className="max-h-48 overflow-y-auto p-3 space-y-2">
                  {chatMessages.map((msg, i) => {
                    const isMaya = msg.from.id === 'maya';
                    return (
                      <div
                        key={i}
                        className={`flex ${isMaya ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm ${
                            isMaya ? 'bg-primary text-primary-foreground' : 'bg-muted'
                          }`}
                        >
                          {msg.text}
                          <span className={`block text-[10px] ${isMaya ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                            {msg.time}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="p-3 flex gap-2 border-t border-border">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendPartyMessage()}
                    placeholder="Message party..."
                    className="flex-1 px-3 py-2 rounded-xl bg-muted border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <button
                    onClick={handleSendPartyMessage}
                    disabled={!messageInput.trim()}
                    className="p-2 rounded-xl bg-primary text-primary-foreground disabled:opacity-50 active:scale-95 transition-all"
                  >
                    <Icon icon="solar:plain-bold" width={18} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Messages header */}
      <h2 className="font-bold text-sm text-foreground">Messages</h2>

      {/* Conversation list */}
      <div className="flex flex-col gap-2">
        {conversations.map((conv) => {
          const profile = getProfileById(conv.participantId);
          const player = profile?.player;
          const lastMsg = getLastMessage(conv.participantId);
          const unread = getUnreadCount(conv.participantId);

          if (!player) return null;

          const color = vibeColors[player.vibe];

          return (
            <button
              key={conv.participantId}
              onClick={() => setActiveConversation(conv.participantId)}
              className="flex items-center gap-3 p-3 bg-card rounded-2xl border border-border text-left w-full active:scale-[0.99] transition-transform hover:bg-muted/30"
            >
              <div className="relative shrink-0">
                <div
                  className="w-12 h-12 rounded-full overflow-hidden border-2"
                  style={{ borderColor: color }}
                >
                  <img src={player.photo} alt={player.name} className="w-full h-full object-cover" />
                </div>
                {unread > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-primary text-primary-foreground text-[10px] font-bold rounded-full px-1">
                    {unread > 99 ? '99+' : unread}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate">{player.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {lastMsg?.text ?? 'No messages yet'}
                </p>
              </div>
              <p className="text-[10px] text-muted-foreground shrink-0">
                {lastMsg?.time ?? ''}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MessagesTab;

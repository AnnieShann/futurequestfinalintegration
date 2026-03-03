import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { type Player, jordan, aisha, chatMessages as initialChatMessages } from '@/data/mockData';

interface ChatMessage {
  from: Player;
  text: string;
  time: string;
}

interface PartyContextValue {
  partyMembers: Player[];
  isPartyFormed: boolean;
  chatMessages: ChatMessage[];
  formParty: (members: Player[]) => void;
  disbandParty: () => void;
  sendMessage: (text: string, from: Player) => void;
}

const PartyContext = createContext<PartyContextValue | null>(null);

export function PartyProvider({ children }: { children: ReactNode }) {
  // TODO: Replace with Supabase real-time subscription for party state
  const [members, setMembers] = useState<Player[]>([]);
  const [formed, setFormed] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(initialChatMessages);

  const formParty = useCallback((newMembers: Player[]) => {
    setMembers(newMembers);
    setFormed(true);
  }, []);

  const disbandParty = useCallback(() => {
    setMembers([]);
    setFormed(false);
  }, []);

  const sendMessage = useCallback((text: string, from: Player) => {
    setMessages(prev => [...prev, { from, text, time: 'Just now' }]);
  }, []);

  return (
    <PartyContext.Provider value={{
      partyMembers: members,
      isPartyFormed: formed,
      chatMessages: messages,
      formParty,
      disbandParty,
      sendMessage,
    }}>
      {children}
    </PartyContext.Provider>
  );
}

export function useParty() {
  const ctx = useContext(PartyContext);
  if (!ctx) throw new Error('useParty must be used within PartyProvider');
  return ctx;
}

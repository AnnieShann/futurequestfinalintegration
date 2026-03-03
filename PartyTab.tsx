import { useState } from 'react';
import { Icon } from '@iconify/react';
import { maya, vibeColors, vibeEmoji, quests } from '@/data/mockData';
import { useParty } from '@/contexts/PartyContext';
import { getConnectedProfiles, getProfileById } from '@/data/socialData';
import { Button } from '@/components/ui/button';

interface PartyTabProps {
  onFindParty?: () => void;
  onBrowseMembers?: () => void;
}

const PartyTab = ({ onFindParty, onBrowseMembers }: PartyTabProps) => {
  const { isPartyFormed, partyMembers, chatMessages, sendMessage, disbandParty } = useParty();
  const [chatInput, setChatInput] = useState('');

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    sendMessage(chatInput.trim(), maya);
    setChatInput('');
  };

  // Collect shared quest IDs from party member profiles
  const sharedQuestIds = new Set<string>();
  for (const member of partyMembers) {
    const profile = getProfileById(member.id);
    if (profile?.sharedQuestIds) {
      profile.sharedQuestIds.forEach(id => sharedQuestIds.add(id));
    }
  }
  const sharedQuests = quests.filter(q => sharedQuestIds.has(q.id));

  const allMembers = [maya, ...partyMembers];

  if (!isPartyFormed) {
    return (
      <div className="px-4 py-8 flex flex-col items-center justify-center min-h-[280px]">
        <div className="flex flex-col items-center gap-4 text-center">
          <Icon
            icon="solar:users-group-rounded-bold-duotone"
            className="text-muted-foreground/50"
            width={64}
            height={64}
          />
          <div className="space-y-1">
            <h2 className="font-bold text-xl">No Party Yet</h2>
            <p className="text-sm text-muted-foreground max-w-[260px]">
              Form a party to explore quests together and build your network!
            </p>
          </div>
          <div className="w-full max-w-[280px] space-y-3 pt-2">
            <Button
              onClick={onFindParty}
              className="w-full"
              size="lg"
            >
              Find Party
            </Button>
            <Button
              onClick={onBrowseMembers}
              variant="secondary"
              className="w-full bg-muted text-muted-foreground hover:bg-muted/80"
              size="lg"
            >
              Browse Members
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 space-y-4">
      {/* Party header - Maya + party members */}
      <div className="bg-card rounded-2xl border border-border p-4">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {allMembers.map(member => (
            <div key={member.id} className="flex flex-col items-center gap-2 shrink-0">
              <div className="relative">
                <div
                  className="w-16 h-16 rounded-full overflow-hidden border-[3px]"
                  style={{ borderColor: vibeColors[member.vibe] }}
                >
                  <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <span className="absolute -bottom-1 right-0 text-lg">
                  {vibeEmoji[member.vibe]}
                </span>
              </div>
              <p className="font-bold text-sm text-center">
                {member.id === 'maya' ? 'Maya (You)' : member.name.split(' ')[0]}
              </p>
              <span className="text-[10px] text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded">
                LVL {member.level}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Party Chat */}
      <div className="bg-card rounded-2xl border border-border p-4 space-y-3">
        <h3 className="font-bold text-sm">Party Chat</h3>
        <div className="space-y-3 max-h-40 overflow-y-auto">
          {chatMessages.map((msg, i) => (
            <div key={i} className="flex items-start gap-3">
              <div
                className="w-8 h-8 rounded-full overflow-hidden shrink-0 border-2"
                style={{ borderColor: vibeColors[msg.from.vibe] }}
              >
                <img src={msg.from.photo} alt="" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-xs font-bold">{msg.from.name.split(' ')[0]}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{msg.text}</p>
                <p className="text-[10px] text-muted-foreground/70 mt-0.5">{msg.time}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2 pt-1">
          <input
            value={chatInput}
            onChange={e => setChatInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
            placeholder="Say something..."
            className="flex-1 bg-muted rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={handleSendMessage}
            className="shrink-0 w-10 h-10 rounded-xl bg-primary flex items-center justify-center active:scale-90 transition-transform"
          >
            <Icon icon="solar:plain-bold" width={18} className="text-primary-foreground" />
          </button>
        </div>
      </div>

      {/* Shared Quests */}
      {sharedQuests.length > 0 && (
        <div className="bg-card rounded-2xl border border-border p-4 space-y-3">
          <h3 className="font-bold text-sm">Shared Quests</h3>
          <div className="space-y-3">
            {sharedQuests.map(quest => (
              <div
                key={quest.id}
                className="flex gap-3 p-3 bg-muted/50 rounded-xl"
              >
                <img
                  src={quest.thumbnail}
                  alt=""
                  className="w-16 h-16 rounded-lg object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{quest.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{quest.subtitle}</p>
                  <p className="text-[10px] text-primary font-mono mt-1">+{quest.xp} XP</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Leave Party */}
      <Button
        onClick={disbandParty}
        variant="outline"
        className="w-full bg-muted/50 text-muted-foreground hover:bg-destructive/20 hover:text-destructive border-border"
      >
        Leave Party
      </Button>
    </div>
  );
};

export default PartyTab;

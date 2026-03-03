import { useState } from 'react';
import { Icon } from '@iconify/react';
import { maya, vibeColors } from '@/data/mockData';
import PartyTab from './PartyTab';
import DiscoverTab from './DiscoverTab';
import NetworkTab from './NetworkTab';
import MessagesTab from './MessagesTab';
import { conversations } from '@/data/socialData';

type SocialTab = 'party' | 'discover' | 'network' | 'messages';

const tabs: { id: SocialTab; label: string; icon: string }[] = [
  { id: 'party', label: 'Party', icon: 'solar:users-group-rounded-bold' },
  { id: 'discover', label: 'Discover', icon: 'solar:compass-bold' },
  { id: 'network', label: 'Network', icon: 'solar:link-round-bold' },
  { id: 'messages', label: 'Messages', icon: 'solar:chat-round-dots-bold' },
];

const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

const SocialHub = () => {
  const [activeTab, setActiveTab] = useState<SocialTab>('discover');

  return (
    <div className="fixed inset-0 bg-background flex flex-col">
      {/* Header */}
      <div className="px-4 pb-2 flex items-center gap-3" style={{ background: 'linear-gradient(to bottom, hsl(220 10% 16% / 0.92), hsl(220 10% 16% / 0.6), transparent)', paddingTop: 'calc(1rem + env(safe-area-inset-top, 0px))' }}>
        <div className="w-10 h-10 rounded-full overflow-hidden border-[2.5px]" style={{ borderColor: vibeColors[maya.vibe] }}>
          <img src={maya.photo} alt="You" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <h1 className="font-bold text-lg">Social Hub</h1>
          <p className="text-xs text-muted-foreground">Connect with fellow explorers</p>
        </div>
        <button className="relative active:scale-90 transition-transform">
          <Icon icon="solar:bell-bold-duotone" className="text-foreground" width={24} />
          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-primary rounded-full border-2 border-background" />
        </button>
      </div>

      {/* Tab bar */}
      <div className="px-4 pt-2 pb-1 flex gap-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 min-h-[44px] rounded-xl text-xs font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted'
            }`}
          >
            <Icon icon={tab.icon} width={16} />
            {tab.label}
            {tab.id === 'messages' && totalUnread > 0 && (
              <span className="min-w-[16px] h-4 flex items-center justify-center bg-destructive rounded-full px-1">
                <span className="text-[9px] font-bold text-white">{totalUnread}</span>
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto pb-24">
        {activeTab === 'party' && (
          <PartyTab
            onFindParty={() => setActiveTab('discover')}
            onBrowseMembers={() => setActiveTab('discover')}
          />
        )}
        {activeTab === 'discover' && <DiscoverTab />}
        {activeTab === 'network' && <NetworkTab />}
        {activeTab === 'messages' && <MessagesTab />}
      </div>
    </div>
  );
};

export default SocialHub;

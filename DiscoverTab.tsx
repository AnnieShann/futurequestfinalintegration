import { useState } from 'react';
import { Icon } from '@iconify/react';
import UserCard from './UserCard';
import { getDiscoverableProfiles, type SocialProfile } from '@/data/socialData';
import PartyFormationModal from './PartyFormationModal';

const filters: { id: 'all' | 'peers' | 'mentors' | 'nearby'; label: string }[] = [
  { id: 'all', label: '👥 All' },
  { id: 'peers', label: '🎓 Peers' },
  { id: 'mentors', label: '🏆 Mentors' },
  { id: 'nearby', label: '📍 Nearby' },
];

const DiscoverTab = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'peers' | 'mentors' | 'nearby'>('all');
  const [showPartyModal, setShowPartyModal] = useState(false);
  const [selectedForParty, setSelectedForParty] = useState<SocialProfile[]>([]);

  const profiles = getDiscoverableProfiles(activeFilter);

  const handleConnect = (profile: SocialProfile) => {
    setSelectedForParty(prev => {
      if (prev.some(p => p.player.id === profile.player.id)) return prev;
      if (prev.length >= 3) return prev;
      return [...prev, profile];
    });
  };

  const handleFormParty = () => {
    setShowPartyModal(true);
  };

  const handlePartyFormed = () => {
    setShowPartyModal(false);
    setSelectedForParty([]);
  };

  return (
    <div className="px-4 py-4 space-y-4">
      {/* Filter buttons */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
        {filters.map(f => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeFilter === f.id ? 'bg-primary text-primary-foreground' : 'bg-muted/50 text-muted-foreground'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Form a Party button */}
      {selectedForParty.length > 0 && (
        <button
          onClick={handleFormParty}
          className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
        >
          <Icon icon="solar:users-group-rounded-bold" width={20} />
          Form a Party ({selectedForParty.length})
        </button>
      )}

      {/* Profile list */}
      <div className="flex flex-col gap-3">
        {profiles.map(p => (
          <UserCard key={p.player.id} profile={p} onConnect={handleConnect} />
        ))}
      </div>

      {showPartyModal && (
        <PartyFormationModal
          members={selectedForParty}
          onClose={() => setShowPartyModal(false)}
          onFormed={handlePartyFormed}
        />
      )}
    </div>
  );
};

export default DiscoverTab;

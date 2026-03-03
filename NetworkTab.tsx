import { Icon } from '@iconify/react';
import { vibeColors, vibeEmoji, quests } from '@/data/mockData';
import {
  getConnectedProfiles,
  communityInsights,
  type SocialProfile,
} from '@/data/socialData';

const NetworkTab = () => {
  const connectedProfiles = getConnectedProfiles();

  // Collect shared quest IDs from connected profiles and count how many connections share each
  const questConnectionCount: Record<string, number> = {};
  for (const profile of connectedProfiles) {
    for (const questId of profile.sharedQuestIds) {
      questConnectionCount[questId] = (questConnectionCount[questId] ?? 0) + 1;
    }
  }
  const sharedQuestsWithCount = Object.entries(questConnectionCount)
    .map(([questId, count]) => {
      const quest = quests.find(q => q.id === questId);
      return quest ? { quest, connectionCount: count } : null;
    })
    .filter((x): x is { quest: (typeof quests)[0]; connectionCount: number } => x !== null)
    .sort((a, b) => b.connectionCount - a.connectionCount);

  return (
    <div className="px-4 py-4 space-y-6">
      {/* Section 1: Your Connections */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-sm">Your Connections</h3>
          <span className="text-xs font-medium bg-muted px-2 py-0.5 rounded-full">
            {connectedProfiles.length}
          </span>
        </div>
        <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide -mx-4 px-4">
          {connectedProfiles.map(profile => (
            <ConnectionCard key={profile.player.id} profile={profile} />
          ))}
        </div>
      </section>

      {/* Section 2: Shared Quests */}
      <section>
        <h3 className="font-bold text-sm mb-3">Shared Quests 🔥</h3>
        <div className="space-y-3">
          {sharedQuestsWithCount.map(({ quest, connectionCount }) => (
            <div
              key={quest.id}
              className="flex gap-3 p-3 bg-card rounded-2xl border border-border"
            >
              <img
                src={quest.thumbnail}
                alt=""
                className="w-20 h-20 rounded-xl object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{quest.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">+{quest.xp} XP</p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {connectionCount} connection{connectionCount !== 1 ? 's' : ''} interested
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3: Community Insights */}
      <section>
        <h3 className="font-bold text-sm mb-3 flex items-center gap-1.5">
          <Icon icon="solar:star-bold" width={16} className="text-primary" />
          Community Insights
        </h3>
        <div className="space-y-2">
          {communityInsights.map(insight => (
            <div
              key={insight.id}
              className="flex items-start gap-3 p-3 bg-card rounded-2xl border border-border"
            >
              <span className="text-xl shrink-0">{insight.icon}</span>
              <div>
                <p className="font-medium text-sm">{insight.text}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{insight.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

interface ConnectionCardProps {
  profile: SocialProfile;
}

const ConnectionCard = ({ profile }: ConnectionCardProps) => {
  const { player } = profile;
  const color = vibeColors[player.vibe];

  return (
    <div className="flex flex-col items-center gap-2 shrink-0 p-3 bg-card rounded-2xl border border-border min-w-[100px]">
      <div className="relative">
        <div
          className="w-12 h-12 rounded-full overflow-hidden border-2"
          style={{ borderColor: color }}
        >
          <img src={player.photo} alt={player.name} className="w-full h-full object-cover" />
        </div>
        {profile.isOnline && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
        )}
      </div>
      <p className="font-medium text-xs text-center truncate w-full">{player.name.split(' ')[0]}</p>
      <span className="text-[10px] text-muted-foreground font-mono">LVL {player.level}</span>
    </div>
  );
};

export default NetworkTab;

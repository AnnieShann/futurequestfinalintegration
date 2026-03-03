import { Icon } from '@iconify/react';
import { maya, vibeColors } from '@/data/mockData';

interface Props {
  onAvatarClick: () => void;
}

const TopBar = ({ onAvatarClick }: Props) => {
  return (
    <div className="absolute top-0 left-0 right-0 z-[900] px-4 pb-3 flex items-center gap-3" style={{ background: 'linear-gradient(to bottom, hsl(220 10% 16% / 0.92), hsl(220 10% 16% / 0.6), transparent)', paddingTop: 'calc(1rem + env(safe-area-inset-top, 0px))' }}>
      {/* Avatar */}
      <button onClick={onAvatarClick} data-tour="avatar" className="shrink-0 active:scale-90 transition-transform">
        <div className="w-11 h-11 rounded-full overflow-hidden border-[2.5px]" style={{ borderColor: vibeColors[maya.vibe] }}>
          <img src={maya.photo} alt="You" className="w-full h-full object-cover" />
        </div>
      </button>

      {/* Level + XP */}
      <div className="flex-1 flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-sm bg-muted px-2.5 py-1 rounded-lg">LVL {maya.level}</span>
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${(maya.xp / maya.maxXp) * 100}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground font-mono">{maya.xp}/{maya.maxXp}</span>
        </div>
      </div>

      {/* Notification */}
      <button className="relative active:scale-90 transition-transform">
        <Icon icon="solar:bell-bold-duotone" className="text-foreground" width={26} />
        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-primary rounded-full border-2 border-background" />
      </button>
    </div>
  );
};

export default TopBar;

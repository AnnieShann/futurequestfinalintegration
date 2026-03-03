import { Icon } from '@iconify/react';
import { useParty } from '@/contexts/PartyContext';
import { vibeColors } from '@/data/mockData';
import { conversations } from '@/data/socialData';

type AppView = 'map' | 'social';

interface Props {
  activeView: AppView;
  onViewChange: (view: AppView) => void;
}

const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

const MainNavBar = ({ activeView, onViewChange }: Props) => {
  const { partyMembers, isPartyFormed } = useParty();

  return (
    <div className="absolute bottom-0 left-0 right-0 z-[900] px-2 pt-3 bg-background/92 backdrop-blur-sm border-t border-border" style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))' }}>
      <div className="flex items-center justify-around">
        <button
          onClick={() => onViewChange('map')}
          className="flex flex-col items-center gap-1 px-4 py-1 active:scale-90 transition-transform"
        >
          <Icon
            icon="solar:map-point-bold-duotone"
            width={26}
            className={activeView === 'map' ? 'text-primary' : 'text-muted-foreground'}
          />
          <span className={`text-[10px] font-medium ${activeView === 'map' ? 'text-primary' : 'text-muted-foreground'}`}>
            Map
          </span>
        </button>

        <button
          onClick={() => onViewChange('social')}
          data-tour="social-tab"
          className="relative flex flex-col items-center gap-1 px-4 py-1 active:scale-90 transition-transform"
        >
          <Icon
            icon="solar:users-group-rounded-bold-duotone"
            width={26}
            className={activeView === 'social' ? 'text-primary' : 'text-muted-foreground'}
          />
          <span className={`text-[10px] font-medium ${activeView === 'social' ? 'text-primary' : 'text-muted-foreground'}`}>
            Social
          </span>
          {totalUnread > 0 && (
            <span className="absolute -top-0.5 right-2 min-w-[16px] h-4 flex items-center justify-center bg-primary rounded-full px-1">
              <span className="text-[9px] font-bold text-primary-foreground">{totalUnread}</span>
            </span>
          )}
        </button>

        {isPartyFormed && (
          <div className="flex flex-col items-center gap-1 px-3 py-1">
            <div className="flex -space-x-1.5">
              {partyMembers.slice(0, 3).map(p => (
                <div
                  key={p.id}
                  className="w-6 h-6 rounded-full overflow-hidden border-2 border-background"
                  style={{ outline: `1.5px solid ${vibeColors[p.vibe]}` }}
                >
                  <img src={p.photo} alt={p.name} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <span className="text-[9px] text-accent font-medium">Party</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainNavBar;

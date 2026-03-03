import { useState } from 'react';
import { Icon } from '@iconify/react';
import { vibeColors, vibeEmoji } from '@/data/mockData';
import { type SocialProfile, type ConnectionStatus } from '@/data/socialData';

interface Props {
  profile: SocialProfile;
  onConnect?: (profile: SocialProfile) => void;
  compact?: boolean;
}

const statusConfig: Record<ConnectionStatus, { label: string; icon: string; className: string }> = {
  connected: { label: 'Connected', icon: 'solar:check-circle-bold', className: 'bg-accent/20 text-accent border-accent/30' },
  pending_sent: { label: 'Pending', icon: 'solar:clock-circle-bold', className: 'bg-muted text-muted-foreground border-border' },
  pending_received: { label: 'Accept', icon: 'solar:add-circle-bold', className: 'bg-primary text-primary-foreground border-primary' },
  none: { label: 'Connect', icon: 'solar:add-circle-bold', className: 'bg-primary text-primary-foreground border-primary' },
};

const UserCard = ({ profile, onConnect, compact }: Props) => {
  const [status, setStatus] = useState<ConnectionStatus>(profile.connectionStatus);
  const { player } = profile;
  const color = vibeColors[player.vibe];
  const config = statusConfig[status];

  const handleAction = () => {
    if (status === 'none') {
      setStatus('pending_sent');
      onConnect?.(profile);
    } else if (status === 'pending_received') {
      setStatus('connected');
      onConnect?.(profile);
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border">
        <div className="relative shrink-0">
          <div className="w-11 h-11 rounded-full overflow-hidden border-2" style={{ borderColor: color }}>
            <img src={player.photo} alt={player.name} className="w-full h-full object-cover" />
          </div>
          {profile.isOnline && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-accent rounded-full border-2 border-card" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-bold text-sm truncate">{player.name}</p>
            <span className="text-xs">{vibeEmoji[player.vibe]}</span>
          </div>
          <p className="text-[10px] text-muted-foreground font-mono">LVL {player.level} • {player.borough}</p>
        </div>
        <button
          onClick={handleAction}
          disabled={status === 'connected' || status === 'pending_sent'}
          className={`shrink-0 px-3 py-1.5 rounded-full text-[10px] font-bold flex items-center gap-1 border transition-all active:scale-95 disabled:opacity-70 ${config.className}`}
        >
          <Icon icon={config.icon} width={12} />
          {config.label}
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 bg-card rounded-2xl border border-border space-y-3">
      <div className="flex items-start gap-3">
        <div className="relative shrink-0">
          <div className="w-14 h-14 rounded-full overflow-hidden border-[2.5px]" style={{ borderColor: color }}>
            <img src={player.photo} alt={player.name} className="w-full h-full object-cover" />
          </div>
          {profile.isOnline && (
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-accent rounded-full border-2 border-card" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-bold text-base">{player.name}</p>
            {profile.badges.map(badge => (
              <span key={badge} className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-primary/20 text-primary uppercase tracking-wide">
                {badge}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="font-mono font-bold text-[10px] bg-muted px-1.5 py-0.5 rounded">LVL {player.level}</span>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: `${color}20`, color }}>
              {vibeEmoji[player.vibe]} {player.vibe.charAt(0).toUpperCase() + player.vibe.slice(1)}
            </span>
          </div>
          {profile.school && (
            <p className="text-[11px] text-muted-foreground mt-1">📍 {profile.school} • {player.borough}</p>
          )}
          {!profile.school && profile.role === 'mentor' && (
            <p className="text-[11px] text-muted-foreground mt-1">{player.statement}</p>
          )}
        </div>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">{profile.bio}</p>

      <div className="flex flex-wrap gap-1.5">
        {profile.interests.map(interest => (
          <span key={interest} className="text-[10px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
            {interest}
          </span>
        ))}
      </div>

      {profile.mutualConnections > 0 && (
        <p className="text-[10px] text-muted-foreground flex items-center gap-1">
          <Icon icon="solar:users-group-rounded-bold" width={12} />
          {profile.mutualConnections} mutual connection{profile.mutualConnections > 1 ? 's' : ''}
        </p>
      )}

      <div className="flex gap-2 pt-1">
        <button
          onClick={handleAction}
          disabled={status === 'connected' || status === 'pending_sent'}
          className={`flex-1 py-2.5 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 border transition-all active:scale-95 disabled:opacity-70 ${config.className}`}
        >
          <Icon icon={config.icon} width={14} />
          {config.label}
        </button>
        <button className="px-4 py-2.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border active:scale-95 transition-all">
          View Profile
        </button>
      </div>
    </div>
  );
};

export default UserCard;

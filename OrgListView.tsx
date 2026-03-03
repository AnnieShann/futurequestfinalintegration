import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { type Organization, vibeColors, vibeEmoji } from '@/data/mockData';

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

interface OrgListViewProps {
  organizations: Organization[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectOrg: (org: Organization) => void;
  onClose: () => void;
}

export default function OrgListView({
  organizations,
  searchQuery,
  onSearchChange,
  onSelectOrg,
  onClose,
}: OrgListViewProps) {
  const filtered = organizations.filter((org) => {
    const q = searchQuery.toLowerCase();
    return (
      org.name.toLowerCase().includes(q) ||
      org.oneLiner.toLowerCase().includes(q) ||
      org.address.toLowerCase().includes(q) ||
      (org.tags && org.tags.some(t => t.toLowerCase().includes(q)))
    );
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-x-0 top-0 z-[950] bg-background flex flex-col"
      style={{ bottom: 'calc(5rem + env(safe-area-inset-bottom, 0px))' }}
    >
      <div className="flex items-center gap-2 px-4 pt-4 pb-2">
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center shrink-0"
        >
          <Icon icon="solar:arrow-left-linear" width={20} />
        </button>
        <h2 className="text-lg font-bold flex-1">Explore</h2>
      </div>

      <div className="px-4 pb-3">
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Icon icon="solar:magnifer-linear" width={18} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search organizations..."
            className="w-full pl-10 pr-4 py-3 bg-card rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center text-muted-foreground text-sm pt-12">
            No organizations found
          </div>
        ) : (
          filtered.map((org) => {
            const color = vibeColors[org.vibe];
            return (
              <button
                key={org.id}
                onClick={() => onSelectOrg(org)}
                className="w-full flex items-center gap-3 p-3 bg-card rounded-2xl border border-border text-left hover:bg-card/80 transition-colors"
              >
                {org.thumbnail ? (
                  <img
                    src={org.thumbnail}
                    alt=""
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <span className="text-2xl">{org.type === 'partner' ? (org.isSchoolPartner ? '🏫' : '🤝') : '📍'}</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm truncate">{org.name}</h3>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {org.oneLiner}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    {org.type === 'partner' ? (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                        {org.isSchoolPartner ? '🏫 School Partner' : '🤝 Partner'}
                      </span>
                    ) : (
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{ background: `${color}20`, color }}
                      >
                        {vibeEmoji[org.vibe]} {capitalize(org.vibe)}
                      </span>
                    )}
                    {org.matchPercent > 0 && (
                      <span className="text-xs font-bold" style={{ color }}>
                        {org.matchPercent}%
                      </span>
                    )}
                    {org.transitTime && (
                      <span className="text-xs text-muted-foreground truncate">
                        {org.transitTime}
                      </span>
                    )}
                  </div>
                </div>
                <Icon
                  icon="solar:alt-arrow-right-linear"
                  width={18}
                  className="text-muted-foreground shrink-0"
                />
              </button>
            );
          })
        )}
      </div>
    </motion.div>
  );
}

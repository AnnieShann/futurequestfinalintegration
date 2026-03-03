import { Icon } from '@iconify/react';

const FILTER_CHIPS = ['All', 'Quests', 'Partners', 'Hangouts', 'Mentors', 'People'] as const;

export interface FilterBarProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  showListView: boolean;
  onToggleListView: () => void;
}

export default function FilterBar({
  activeFilter,
  onFilterChange,
  showListView,
  onToggleListView,
}: FilterBarProps) {
  return (
    <div className="absolute left-0 right-0 z-[850] px-3 py-2" data-tour="filter-bar" style={{ top: 'calc(4rem + env(safe-area-inset-top, 0px))' }}>
      <div className="flex items-center gap-2">
        <div className="flex gap-2 overflow-x-auto flex-1 scrollbar-hide">
          {FILTER_CHIPS.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => onFilterChange(chip)}
              {...(chip === 'Quests' ? { 'data-tour': 'filter-quests' } : {})}
              className={`px-4 py-1.5 min-h-[44px] flex items-center rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeFilter === chip
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card/80 text-muted-foreground backdrop-blur-sm border border-border'
              }`}
            >
              {chip}
            </button>
          ))}
        </div>
        <div className="w-px h-6 bg-border shrink-0" />
        <button
          type="button"
          onClick={onToggleListView}
          className="shrink-0 w-11 h-11 rounded-full bg-card/80 backdrop-blur-sm border border-border flex items-center justify-center active:scale-90 transition-transform"
        >
          <Icon
            icon={showListView ? 'solar:map-bold-duotone' : 'solar:list-bold-duotone'}
            className="w-5 h-5"
          />
        </button>
      </div>
    </div>
  );
}

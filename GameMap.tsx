import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { createPortal } from 'react-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import {
  maya, otherPlayers, extraPlayers, quests, vibeColors, npcCharacters, mapPOIs,
  organizations, partnerOrgs, type Quest, type MapPOI, type Organization, type PartnerOrg,
} from '@/data/mockData';
import { fetchWalkingRoute } from '@/lib/routing';
import { useParty } from '@/contexts/PartyContext';
import TopBar from './TopBar';
import FilterBar from './FilterBar';
import FindPartyOverlay from './FindPartyOverlay';
import OrgPreviewCard from './OrgPreviewCard';
import OrgDetailSheet from './OrgDetailSheet';
import ProfilePanel from './ProfilePanel';
import NearbyToasts from './NearbyToasts';
import PartyChat from './PartyChat';
import NpcChatOverlay from './NpcChatOverlay';
import OrgListView from './OrgListView';
import BulletinBoardOverlay from '../bulletin/BulletinBoardOverlay';

const createPlayerIcon = (photo: string, color: string, size = 56, label?: string) => {
  const labelHtml = label
    ? `<div class="player-marker-label">${label}</div>`
    : '';
  return L.divIcon({
    className: 'player-marker',
    html: `<div style="position:relative;display:flex;flex-direction:column;align-items:center">
      <div class="player-marker-inner" style="--ring-color:${color};width:${size}px;height:${size}px;border-color:${color};box-shadow:0 0 16px ${color}60">
        <img src="${photo}" alt="" />
      </div>
      <div class="player-marker-pulse" style="--ring-color:${color};border-color:${color}"></div>
      ${labelHtml}
    </div>`,
    iconSize: [size, size + (label ? 20 : 0)],
    iconAnchor: [size / 2, size / 2],
  });
};

const createNpcIcon = (photo: string, color: string, role: string) => {
  const size = 44;
  return L.divIcon({
    className: 'player-marker npc-marker',
    html: `<div style="position:relative;display:flex;flex-direction:column;align-items:center">
      <div class="npc-marker-inner" style="--ring-color:${color};width:${size}px;height:${size}px;border-color:${color}">
        <img src="${photo}" alt="" />
      </div>
      <div class="npc-marker-role">${role}</div>
    </div>`,
    iconSize: [size, size + 18],
    iconAnchor: [size / 2, size / 2],
  });
};

const createPoiIcon = (poi: MapPOI) => {
  const color = vibeColors[poi.vibe];
  const size = 44;
  return L.divIcon({
    className: 'poi-marker',
    html: `<div class="poi-marker-card" style="--poi-color:${color}">
      <div class="poi-marker-thumb" style="background-image:url('${poi.thumbnail}')">
        ${!poi.unlocked ? '<div class="poi-marker-locked">🔒</div>' : ''}
      </div>
      <div class="poi-marker-label ${poi.unlocked ? 'poi-unlocked' : 'poi-locked'}" style="${poi.unlocked ? `border-color:${color}40` : ''}">${poi.icon} ${poi.name.split(' ').slice(0, 2).join(' ')}</div>
    </div>`,
    iconSize: [size + 20, size + 24],
    iconAnchor: [(size + 20) / 2, size + 24],
  });
};

const createQuestIcon = (quest: Quest, status: 'available' | 'accepted' | 'locked', attendeeCount = 0) => {
  const color = vibeColors[quest.vibe];
  const markerW = 72;
  const thumbH = 52;

  const attendeeHtml = attendeeCount > 0
    ? `<div class="quest-marker-attendees">
        ${Array.from({ length: Math.min(attendeeCount, 3) }).map((_, i) => {
          const vibes = ['#FF6B4A', '#3B82F6', '#FBBF24', '#EC4899'];
          return `<div class="quest-attendee-dot" style="background:${vibes[i % vibes.length]}"></div>`;
        }).join('')}
        ${attendeeCount > 3 ? `<span class="quest-attendee-count">+${attendeeCount - 3}</span>` : ''}
      </div>`
    : '';

  if (quest.locked) {
    return L.divIcon({
      className: 'quest-marker quest-locked',
      html: `<div class="quest-marker-card quest-marker-locked" style="width:${markerW}px">
        <div class="quest-marker-thumb" style="background-image:url('${quest.thumbnail}');height:${thumbH}px">
          <div class="quest-marker-lock">🔒</div>
        </div>
        <div class="quest-marker-badge quest-marker-badge-locked">LVL ${quest.levelRequired}</div>
      </div>`,
      iconSize: [markerW, thumbH + 22],
      iconAnchor: [markerW / 2, thumbH + 22],
    });
  }

  if (status === 'accepted') {
    return L.divIcon({
      className: 'quest-marker',
      html: `<div class="quest-marker-card" style="--quest-color:${color};width:${markerW}px">
        <div class="quest-marker-thumb" style="background-image:url('${quest.thumbnail}');height:${thumbH}px">
          <div class="quest-marker-icon quest-marker-icon-ongoing">❕</div>
        </div>
        <div class="quest-marker-badge" style="background:${color}">GOING</div>
        ${attendeeHtml}
      </div>`,
      iconSize: [markerW, thumbH + 30],
      iconAnchor: [markerW / 2, thumbH + 30],
    });
  }

  return L.divIcon({
    className: 'quest-marker',
    html: `<div class="quest-marker-card" style="--quest-color:${color};width:${markerW}px">
      <div class="quest-marker-thumb" style="background-image:url('${quest.thumbnail}');height:${thumbH}px">
        <div class="quest-marker-icon quest-marker-icon-new">❗</div>
      </div>
      <div class="quest-marker-badge" style="background:${color}">Quest!</div>
      <div class="quest-marker-pulse-ring" style="--quest-color:${color}"></div>
      ${attendeeHtml}
    </div>`,
    iconSize: [markerW, thumbH + 30],
    iconAnchor: [markerW / 2, thumbH + 30],
  });
};

const createPartnerIcon = (partner: PartnerOrg, hasSim = false) => {
  const hasThumbnail = !!partner.thumbnail;
  const icon = hasSim ? '🌊' : partner.isSchoolPartner ? '🏫' : '🤝';
  const color = hasSim ? '#6C8CFF' : '#10b981';
  const size = 44;
  const simBadge = hasSim ? `<div class="partner-marker-sim-badge">▶</div>` : '';

  if (hasThumbnail) {
    return L.divIcon({
      className: 'partner-marker',
      html: `<div class="partner-marker-card" style="--partner-color:${color}">
        <div class="partner-marker-thumb" style="background-image:url('${partner.thumbnail}')">
          <div class="partner-marker-icon-badge">${icon}</div>
        </div>
        <div class="partner-marker-label">${partner.name.split(' ').slice(0, 2).join(' ')}</div>
        ${simBadge}
      </div>`,
      iconSize: [size + 20, size + 24],
      iconAnchor: [(size + 20) / 2, size + 24],
    });
  }

  return L.divIcon({
    className: `partner-marker${hasSim ? ' partner-marker--sim' : ''}`,
    html: `<div class="partner-marker-card partner-marker-card--no-img" style="--partner-color:${color}">
      <div class="partner-marker-emoji">${icon}</div>
      <div class="partner-marker-label">${partner.name.split(' ').slice(0, 2).join(' ')}</div>
      ${simBadge}
    </div>`,
    iconSize: [size + 20, size + 24],
    iconAnchor: [(size + 20) / 2, size + 24],
  });
};

type Overlay = 'none' | 'findParty' | 'orgPreview' | 'orgDetail' | 'profile' | 'npcChat' | 'bulletinBoard';

const allPlayers = [...otherPlayers, ...extraPlayers];

export interface GameMapHandle {
  getMap: () => L.Map | null;
  setActiveFilter: (filter: string) => void;
  setOverlay: (overlay: string) => void;
  selectOrg: (orgId: string) => void;
}

interface GameMapProps {
  onStartSimulation?: (orgId: string) => void;
}

const GameMap = forwardRef<GameMapHandle, GameMapProps>(({ onStartSimulation }, ref) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const playerMarkersRef = useRef<L.Marker[]>([]);
  const npcMarkersRef = useRef<L.Marker[]>([]);
  const questMarkersRef = useRef<L.Marker[]>([]);
  const orgClusterRef = useRef<L.MarkerClusterGroup | null>(null);
  const orgMarkersRef = useRef<L.Marker[]>([]);
  const routeLineRef = useRef<L.Polyline | null>(null);

  const { isPartyFormed, formParty } = useParty();

  const [overlay, setOverlay] = useState<Overlay>('none');
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [selectedNpcId, setSelectedNpcId] = useState<string | null>(null);
  const [questAccepted, setQuestAccepted] = useState<string | null>(null);
  const [xpFloat, setXpFloat] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [showListView, setShowListView] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useImperativeHandle(ref, () => ({
    getMap: () => mapRef.current,
    setActiveFilter: (filter: string) => setActiveFilter(filter),
    setOverlay: (o: string) => setOverlay(o as Overlay),
    selectOrg: (orgId: string) => {
      const org = organizations.find(o => o.id === orgId);
      if (org) {
        setSelectedOrg(org);
        setOverlay('orgPreview');
      }
    },
  }));

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: maya.location,
      zoom: 12,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png').addTo(map);

    L.marker(maya.location, { icon: createPlayerIcon(maya.photo, vibeColors[maya.vibe], 64, 'You') }).addTo(map);

    allPlayers.forEach(p => {
      const marker = L.marker(p.location, {
        icon: createPlayerIcon(p.photo, vibeColors[p.vibe], 48, p.name.split(' ')[0]),
      }).addTo(map);
      playerMarkersRef.current.push(marker);
    });

    npcCharacters.forEach(npc => {
      const marker = L.marker(npc.location, {
        icon: createNpcIcon(npc.photo, vibeColors[npc.vibe], npc.npcRole || 'NPC'),
      }).addTo(map);
      marker.on('click', () => {
        setSelectedNpcId(npc.id);
        setOverlay('npcChat');
      });
      npcMarkersRef.current.push(marker);
    });

    // Clustered org markers (quests + POIs)
    const orgClusterGroup = (L as any).markerClusterGroup({
      maxClusterRadius: 50,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      iconCreateFunction: (cluster: any) => {
        const count = cluster.getChildCount();
        return L.divIcon({
          html: `<div class="org-cluster-icon">${count}</div>`,
          className: 'org-cluster',
          iconSize: [40, 40] as [number, number],
        });
      },
    });

    mapPOIs.forEach(poi => {
      const marker = L.marker(poi.location, { icon: createPoiIcon(poi) });
      marker.on('click', () => {
        const org = organizations.find(o => o.id === poi.id);
        if (org) {
          setSelectedOrg(org);
          setOverlay('orgPreview');
        }
      });
      (marker as any)._orgType = 'hangout';
      orgClusterGroup.addLayer(marker);
      orgMarkersRef.current.push(marker);
    });

    let firstUnlockedTagged = false;
    quests.forEach(q => {
      const org = organizations.find(o => o.id === q.id);
      const attendeeCount = org?.attendees.length || 0;
      const status = q.locked ? 'locked' : 'available';
      const marker = L.marker(q.location, { icon: createQuestIcon(q, status as any, attendeeCount) });
      marker.on('click', () => {
        if (org) {
          setSelectedOrg(org);
          setOverlay('orgPreview');
        }
      });
      if (!q.locked && !firstUnlockedTagged) {
        marker.on('add', () => {
          const el = marker.getElement();
          if (el) el.setAttribute('data-tour', 'quest-marker');
        });
        firstUnlockedTagged = true;
      }
      (marker as any)._orgType = 'quest';
      (marker as any)._questId = q.id;
      questMarkersRef.current.push(marker);
      orgClusterGroup.addLayer(marker);
      orgMarkersRef.current.push(marker);
    });

    partnerOrgs.forEach(p => {
      const org = organizations.find(o => o.id === p.id);
      const hasSim = !!org?.hasSimulation;
      const marker = L.marker(p.location, { icon: createPartnerIcon(p, hasSim) });
      marker.on('click', () => {
        const org = organizations.find(o => o.id === p.id);
        if (org) {
          setSelectedOrg(org);
          setOverlay('orgPreview');
        }
      });
      (marker as any)._orgType = 'partner';
      (marker as any)._hasSim = hasSim;
      orgClusterGroup.addLayer(marker);
      orgMarkersRef.current.push(marker);
    });

    orgClusterGroup.addTo(map);
    orgClusterRef.current = orgClusterGroup;
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Subtle idle drift for players — constrained to ~50m from origin, NPCs stay fixed
  useEffect(() => {
    const origins = allPlayers.map(p => [...p.location] as [number, number]);
    const maxDriftLat = 0.00045; // ~50m

    const driftInterval = setInterval(() => {
      playerMarkersRef.current.forEach((marker, i) => {
        if (Math.random() > 0.3) return; // most ticks, don't move
        const origin = origins[i];
        const pos = marker.getLatLng();
        const newLat = pos.lat + (Math.random() - 0.5) * 0.0003;
        const newLng = pos.lng + (Math.random() - 0.5) * 0.0003;
        const clampedLat = Math.max(origin[0] - maxDriftLat, Math.min(origin[0] + maxDriftLat, newLat));
        const clampedLng = Math.max(origin[1] - maxDriftLat, Math.min(origin[1] + maxDriftLat, newLng));
        marker.setLatLng([clampedLat, clampedLng]);
      });
    }, 4000);

    return () => clearInterval(driftInterval);
  }, []);

  // Update quest markers and route line
  useEffect(() => {
    if (!mapRef.current) return;

    quests.forEach((q, i) => {
      const marker = questMarkersRef.current[i];
      if (!marker) return;
      const org = organizations.find(o => o.id === q.id);
      const attendeeCount = org?.attendees.length || 0;
      const status = q.locked ? 'locked' : questAccepted === q.id ? 'accepted' : 'available';
      marker.setIcon(createQuestIcon(q, status as any, attendeeCount));
    });

    if (routeLineRef.current) {
      routeLineRef.current.remove();
      routeLineRef.current = null;
    }
    if (questAccepted) {
      const q = quests.find(x => x.id === questAccepted);
      if (q) {
        const drawRoute = async () => {
          const result = await fetchWalkingRoute(maya.location, q.location);
          if (result && mapRef.current) {
            routeLineRef.current = L.polyline(result.coordinates, {
              color: vibeColors[q.vibe],
              weight: 4,
              dashArray: '10,8',
              opacity: 0.8,
            }).addTo(mapRef.current);
            mapRef.current.fitBounds(routeLineRef.current.getBounds(), { padding: [50, 50] });
          } else if (mapRef.current) {
            routeLineRef.current = L.polyline([maya.location, q.location], {
              color: vibeColors[q.vibe],
              weight: 3,
              dashArray: '8,8',
              opacity: 0.7,
            }).addTo(mapRef.current);
          }
        };
        drawRoute();
      }
    }
  }, [questAccepted]);

  useEffect(() => {
    if (!orgClusterRef.current) return;
    const cluster = orgClusterRef.current;
    orgMarkersRef.current.forEach((layer: any) => {
      const orgType = layer._orgType;
      const hasSim = layer._hasSim;
      let visible = true;
      if (activeFilter === 'Quests') visible = orgType === 'quest' || hasSim;
      else if (activeFilter === 'Partners') visible = orgType === 'partner';
      else if (activeFilter === 'Hangouts') visible = orgType === 'hangout';
      else if (activeFilter === 'Mentors') visible = false;
      else if (activeFilter === 'People') visible = false;

      if (visible) {
        if (!cluster.hasLayer(layer)) cluster.addLayer(layer);
      } else {
        if (cluster.hasLayer(layer)) cluster.removeLayer(layer);
      }
    });

    const showPlayers = activeFilter === 'All' || activeFilter === 'People';
    playerMarkersRef.current.forEach(marker => {
      if (showPlayers) {
        if (!mapRef.current?.hasLayer(marker)) marker.addTo(mapRef.current!);
      } else {
        marker.remove();
      }
    });

    const showNpcs = activeFilter === 'All' || activeFilter === 'Mentors';
    npcMarkersRef.current.forEach(marker => {
      if (showNpcs) {
        if (!mapRef.current?.hasLayer(marker)) marker.addTo(mapRef.current!);
      } else {
        marker.remove();
      }
    });
  }, [activeFilter]);

  const handleAcceptQuest = () => {
    if (selectedOrg) {
      setQuestAccepted(selectedOrg.id);
      setXpFloat(true);
      setTimeout(() => setXpFloat(false), 1500);
      setOverlay('none');
      setSelectedOrg(null);
    }
  };

  const handleRecenter = () => {
    mapRef.current?.flyTo(maya.location, 14);
  };

  return (
    <div className="fixed inset-0">
      <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />

      {xpFloat && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1000] animate-float-up">
          <span className="text-xp-gold font-mono font-bold text-3xl drop-shadow-lg">+XP</span>
        </div>
      )}

      <TopBar onAvatarClick={() => setOverlay('profile')} />
      <FilterBar
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        showListView={showListView}
        onToggleListView={() => setShowListView(v => !v)}
      />
      <NearbyToasts />
      {isPartyFormed && <PartyChat />}

      {/* Floating Find Party button (when no party) */}
      {!isPartyFormed && (
        <button
          onClick={() => setOverlay('findParty')}
          className="absolute left-1/2 -translate-x-1/2 z-[850] py-3 px-8 bg-primary text-primary-foreground rounded-full font-bold text-sm flex items-center gap-2 active:scale-95 transition-transform shadow-lg"
          style={{ bottom: 'calc(5rem + env(safe-area-inset-bottom, 0px))' }}
        >
          <Icon icon="solar:users-group-rounded-bold" width={20} />
          Find Party
        </button>
      )}

      <button
        onClick={handleRecenter}
        className="fixed right-4 z-[850] w-12 h-12 rounded-full bg-card border border-border shadow-lg flex items-center justify-center active:scale-90 transition-transform"
        style={{ bottom: 'calc(6rem + env(safe-area-inset-bottom, 0px))' }}
      >
        <Icon icon="solar:target-bold" width={22} className="text-foreground" />
      </button>

      {document.getElementById('overlay-root') && createPortal(
        <AnimatePresence>
          {showListView && (
            <OrgListView
              organizations={organizations}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSelectOrg={(org) => {
                setShowListView(false);
                setSelectedOrg(org);
                setOverlay('orgPreview');
                mapRef.current?.flyTo(org.location, 15);
              }}
              onClose={() => setShowListView(false)}
            />
          )}
          {overlay === 'findParty' && (
            <FindPartyOverlay
              onClose={() => setOverlay('none')}
              onPartyFormed={() => { setOverlay('none'); }}
            />
          )}
          {overlay === 'orgPreview' && selectedOrg && (
            <OrgPreviewCard
              org={selectedOrg}
              onExpand={() => setOverlay('orgDetail')}
              onClose={() => { setOverlay('none'); setSelectedOrg(null); }}
              onOpenBoard={() => setOverlay('bulletinBoard')}
            />
          )}
          {overlay === 'orgDetail' && selectedOrg && (
            <OrgDetailSheet
              org={selectedOrg}
              onClose={() => setOverlay('orgPreview')}
              onAccept={handleAcceptQuest}
              partyFormed={isPartyFormed}
              onOpenBoard={() => setOverlay('bulletinBoard')}
              questAccepted={questAccepted === selectedOrg.id}
              onStartSimulation={selectedOrg.hasSimulation && onStartSimulation
                ? () => onStartSimulation(selectedOrg.id)
                : undefined}
            />
          )}
          {overlay === 'bulletinBoard' && selectedOrg && (
            <BulletinBoardOverlay
              org={selectedOrg}
              onClose={() => setOverlay('orgDetail')}
            />
          )}
          {overlay === 'profile' && (
            <ProfilePanel onClose={() => setOverlay('none')} />
          )}
          {overlay === 'npcChat' && selectedNpcId && (
            <NpcChatOverlay
              npcId={selectedNpcId}
              onClose={() => { setOverlay('none'); setSelectedNpcId(null); }}
            />
          )}
        </AnimatePresence>,
        document.getElementById('overlay-root')!
      )}
    </div>
  );
});

GameMap.displayName = 'GameMap';

export default GameMap;

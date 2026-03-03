import { type Vibe, type OrgType } from './mockData';

export type NoteAuthorRole = 'student' | 'mentor' | 'employer' | 'staff';

export type NoteCategory =
  | 'prep-tip'
  | 'logistics'
  | 'social-proof'
  | 'vibe-specific'
  | 'resource'
  | 'insider'
  | 'encouragement';

export type PostItColor = 'yellow' | 'pink' | 'blue' | 'green' | 'orange' | 'purple';

export const postItColors: Record<PostItColor, string> = {
  yellow: '#FEF3C7',
  pink: '#FCE7F3',
  blue: '#DBEAFE',
  green: '#D1FAE5',
  orange: '#FFEDD5',
  purple: '#EDE9FE',
};

export const categoryLabels: Record<NoteCategory, { emoji: string; label: string }> = {
  'prep-tip': { emoji: '🎒', label: 'Prep Tip' },
  logistics: { emoji: '🚇', label: 'Logistics' },
  'social-proof': { emoji: '💪', label: 'Social Proof' },
  'vibe-specific': { emoji: '🎯', label: 'Vibe-Specific' },
  resource: { emoji: '🔗', label: 'Resource' },
  insider: { emoji: '🤫', label: 'Insider' },
  encouragement: { emoji: '💛', label: 'Encouragement' },
};

export interface BulletinNote {
  id: string;
  orgId: string;
  orgType: OrgType;

  authorId: string;
  authorName: string;
  authorRole: NoteAuthorRole;
  authorVibe: Vibe;
  authorAvatar?: string;

  body: string;
  category: NoteCategory;
  linkUrl?: string;
  linkLabel?: string;

  targetVibes: Vibe[];
  targetMinLevel?: number;
  targetMaxLevel?: number;

  createdAt: string;
  pinned: boolean;
  likes: number;
  likedByIds: string[];

  color: PostItColor;
  rotation: number;
  sticker?: string;
}

export const mockBulletinNotes: BulletinNote[] = [
  // ── Droga5 ──
  {
    id: 'bn-d5-1',
    orgId: 'droga5',
    orgType: 'quest',
    authorId: 'jordan',
    authorName: 'Jordan W.',
    authorRole: 'student',
    authorVibe: 'fixer',
    body: "They showed us the brainstorm room and it's WILD. Whiteboards everywhere. If you're a Fixer, pay attention to how they structure the chaos — there's a method to it.",
    category: 'vibe-specific',
    targetVibes: ['fixer'],
    createdAt: '2026-02-20T14:30:00Z',
    pinned: false,
    likes: 11,
    likedByIds: ['aisha', 'player-5', 'player-6', 'player-7', 'player-8', 'player-9', 'player-10', 'player-11', 'player-12', 'player-13', 'player-14'],
    color: 'blue',
    rotation: -2.1,
    sticker: '🧠',
  },
  {
    id: 'bn-d5-2',
    orgId: 'droga5',
    orgType: 'quest',
    authorId: 'player-5',
    authorName: 'Zara L.',
    authorRole: 'student',
    authorVibe: 'creator',
    body: 'Take this free Google UX course before you go — it helped me actually understand what the designers were talking about.',
    category: 'resource',
    linkUrl: 'https://www.coursera.org/professional-certificates/google-ux-design',
    linkLabel: 'Google UX Design (Coursera)',
    targetVibes: ['creator'],
    createdAt: '2026-02-18T10:15:00Z',
    pinned: false,
    likes: 8,
    likedByIds: ['jordan', 'aisha', 'player-6', 'player-9', 'player-10', 'player-11', 'player-13', 'player-14'],
    color: 'yellow',
    rotation: 1.5,
  },
  {
    id: 'bn-d5-3',
    orgId: 'droga5',
    orgType: 'quest',
    authorId: 'marcus',
    authorName: 'Marcus T.',
    authorRole: 'mentor',
    authorVibe: 'creator',
    body: "We love students who ask questions about our process. Don't be shy — the best creatives are the curious ones. Come ready to challenge us!",
    category: 'encouragement',
    targetVibes: [],
    createdAt: '2026-02-15T09:00:00Z',
    pinned: true,
    likes: 22,
    likedByIds: [],
    color: 'yellow',
    rotation: 0.3,
    sticker: '⭐',
  },
  {
    id: 'bn-d5-4',
    orgId: 'droga5',
    orgType: 'quest',
    authorId: 'aisha',
    authorName: 'Aisha P.',
    authorRole: 'student',
    authorVibe: 'connector',
    body: 'The 4 train to Wall St is faster than the 5 — saves about 10 min from the Bronx. Also the Fulton St exit is closer to the building.',
    category: 'logistics',
    targetVibes: [],
    createdAt: '2026-02-21T08:45:00Z',
    pinned: false,
    likes: 15,
    likedByIds: [],
    color: 'green',
    rotation: -1.8,
    sticker: '🚇',
  },

  // ── New Lab ──
  {
    id: 'bn-nl-1',
    orgId: 'newlab',
    orgType: 'quest',
    authorId: 'player-6',
    authorName: 'Kai R.',
    authorRole: 'student',
    authorVibe: 'fixer',
    body: "Bring a notebook — they don't provide supplies and you'll want to sketch ideas during the prototyping demo. Trust me.",
    category: 'logistics',
    targetVibes: [],
    createdAt: '2026-02-19T16:00:00Z',
    pinned: false,
    likes: 9,
    likedByIds: [],
    color: 'orange',
    rotation: 2.3,
  },
  {
    id: 'bn-nl-2',
    orgId: 'newlab',
    orgType: 'quest',
    authorId: 'npc-sara',
    authorName: 'Sara Kim',
    authorRole: 'employer',
    authorVibe: 'fixer',
    body: "If you're a Fixer type, head straight to the prototyping station — we set it up with extra tools this month. Creators: the laser cutter demos start at 2pm sharp.",
    category: 'vibe-specific',
    targetVibes: ['fixer', 'creator'],
    createdAt: '2026-02-17T11:00:00Z',
    pinned: true,
    likes: 18,
    likedByIds: [],
    color: 'blue',
    rotation: -0.5,
    sticker: '🔧',
  },
  {
    id: 'bn-nl-3',
    orgId: 'newlab',
    orgType: 'quest',
    authorId: 'player-14',
    authorName: 'Jin P.',
    authorRole: 'student',
    authorVibe: 'fixer',
    body: "I was SO nervous going alone but the engineers there are incredibly chill. One of them let me use the metal CNC. Best day of my life fr",
    category: 'social-proof',
    targetVibes: [],
    createdAt: '2026-02-22T19:30:00Z',
    pinned: false,
    likes: 14,
    likedByIds: [],
    color: 'pink',
    rotation: 1.1,
    sticker: '🤩',
  },

  // ── Mt. Sinai ──
  {
    id: 'bn-si-1',
    orgId: 'sinai',
    orgType: 'quest',
    authorId: 'aisha',
    authorName: 'Aisha P.',
    authorRole: 'student',
    authorVibe: 'connector',
    body: "Ask Dr. Hayes about the summer research program — she doesn't advertise it but it's amazing for Connectors who want healthcare experience.",
    category: 'insider',
    targetVibes: ['connector'],
    createdAt: '2026-02-23T12:00:00Z',
    pinned: false,
    likes: 7,
    likedByIds: [],
    color: 'purple',
    rotation: -2.8,
    sticker: '🤫',
  },
  {
    id: 'bn-si-2',
    orgId: 'sinai',
    orgType: 'quest',
    authorId: 'npc-hayes',
    authorName: 'Dr. Nia Hayes',
    authorRole: 'mentor',
    authorVibe: 'connector',
    body: "Wear comfortable shoes! We walk a LOT. Also — the cafeteria has surprisingly good empanadas. Treat yourselves after. 😄",
    category: 'logistics',
    targetVibes: [],
    createdAt: '2026-02-16T08:00:00Z',
    pinned: true,
    likes: 20,
    likedByIds: [],
    color: 'green',
    rotation: 0.7,
    sticker: '👟',
  },
  {
    id: 'bn-si-3',
    orgId: 'sinai',
    orgType: 'quest',
    authorId: 'player-7',
    authorName: 'Priya S.',
    authorRole: 'student',
    authorVibe: 'connector',
    body: "Even if medicine isn't your thing, this is worth it. I want to be a teacher and I still learned so much about connecting with people going through hard times.",
    category: 'social-proof',
    targetVibes: [],
    createdAt: '2026-02-24T17:15:00Z',
    pinned: false,
    likes: 12,
    likedByIds: [],
    color: 'yellow',
    rotation: 1.9,
  },
  // ── Google ──
  {
    id: 'bn-g-1',
    orgId: 'google',
    orgType: 'quest',
    authorId: 'player-8',
    authorName: 'Damian R.',
    authorRole: 'student',
    authorVibe: 'fixer',
    body: "The cybersecurity simulation blew my mind. I had no idea how much math and critical thinking goes into protecting systems. Definitely doing more of these.",
    category: 'social-proof',
    targetVibes: ['fixer', 'competitor'],
    createdAt: '2026-02-26T10:30:00Z',
    pinned: true,
    likes: 18,
    likedByIds: [],
    color: 'blue',
    rotation: -1.5,
  },
  {
    id: 'bn-g-2',
    orgId: 'google',
    orgType: 'quest',
    authorId: 'mentor-3',
    authorName: 'Sarah K.',
    authorRole: 'mentor',
    authorVibe: 'fixer',
    body: "Pro tip: pay attention during the evidence collection phase. The choices you make there affect your final score more than you think!",
    category: 'insider',
    targetVibes: [],
    createdAt: '2026-02-26T14:00:00Z',
    pinned: false,
    likes: 9,
    likedByIds: [],
    color: 'green',
    rotation: 2.1,
  },
  {
    id: 'bn-g-3',
    orgId: 'google',
    orgType: 'quest',
    authorId: 'player-9',
    authorName: 'Kenji M.',
    authorRole: 'student',
    authorVibe: 'competitor',
    body: "I got the Strategic Commander badge on my first try. Anyone beat 280 XP? Challenge me 💪",
    category: 'encouragement',
    targetVibes: ['competitor'],
    createdAt: '2026-02-27T09:00:00Z',
    pinned: false,
    likes: 14,
    likedByIds: [],
    color: 'pink',
    rotation: -0.8,
  },
  // ── Billion Oyster Project ──
  {
    id: 'bn-bo-1',
    orgId: 'billion-oyster',
    orgType: 'partner',
    authorId: 'player-10',
    authorName: 'Aaliyah J.',
    authorRole: 'student',
    authorVibe: 'connector',
    body: "The After the Flood simulation is incredible. You actually have to make budget decisions for a whole town. It made me think about urban planning as a career.",
    category: 'social-proof',
    targetVibes: ['connector', 'fixer'],
    createdAt: '2026-02-27T11:00:00Z',
    pinned: true,
    likes: 21,
    likedByIds: [],
    color: 'blue',
    rotation: 1.2,
  },
  {
    id: 'bn-bo-2',
    orgId: 'billion-oyster',
    orgType: 'partner',
    authorId: 'mentor-4',
    authorName: 'Dr. Chen',
    authorRole: 'mentor',
    authorVibe: 'fixer',
    body: "Great place to learn about environmental resilience. The real oyster reef restoration work they do in NY Harbor is amazing — try to visit in person too!",
    category: 'insider',
    targetVibes: [],
    createdAt: '2026-02-27T15:30:00Z',
    pinned: false,
    likes: 7,
    likedByIds: [],
    color: 'green',
    rotation: -1.8,
  },
];

export function getNotesForOrg(orgId: string): BulletinNote[] {
  return mockBulletinNotes.filter((n) => n.orgId === orgId);
}

export function getNoteCount(orgId: string): number {
  return mockBulletinNotes.filter((n) => n.orgId === orgId).length;
}

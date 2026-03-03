import {
  type Player, type Vibe, maya, jordan, aisha, deshawn, extraPlayers,
  vibeColors, vibeEmoji, npcCharacters, quests,
} from './mockData';

// --- Social profile extensions ---

export type ConnectionStatus = 'connected' | 'pending_sent' | 'pending_received' | 'none';
export type UserRole = 'peer' | 'mentor';

export interface SocialProfile {
  player: Player;
  school?: string;
  interests: string[];
  badges: string[];
  role: UserRole;
  connectionStatus: ConnectionStatus;
  isOnline: boolean;
  sharedQuestIds: string[];
  mutualConnections: number;
  bio: string;
}

export const socialProfiles: SocialProfile[] = [
  {
    player: jordan,
    school: 'Bronx Science',
    interests: ['Robotics', 'Engineering', '3D Printing'],
    badges: [],
    role: 'peer',
    connectionStatus: 'connected',
    isOnline: true,
    sharedQuestIds: ['droga5', 'newlab'],
    mutualConnections: 2,
    bio: 'Building stuff since day one. Looking for a maker space crew.',
  },
  {
    player: aisha,
    school: 'Brooklyn Tech',
    interests: ['Community organizing', 'Healthcare', 'Public speaking'],
    badges: [],
    role: 'peer',
    connectionStatus: 'connected',
    isOnline: true,
    sharedQuestIds: ['sinai'],
    mutualConnections: 1,
    bio: 'Want to connect people who need help with people who can give it.',
  },
  {
    player: deshawn,
    school: 'Harlem Renaissance HS',
    interests: ['Finance', 'Basketball', 'Startups'],
    badges: [],
    role: 'peer',
    connectionStatus: 'connected',
    isOnline: false,
    sharedQuestIds: ['trading'],
    mutualConnections: 1,
    bio: 'Future hedge fund manager. Or NBA player. We\'ll see.',
  },
  {
    player: extraPlayers[0], // Zara Lin
    school: 'Stuyvesant',
    interests: ['Graphic design', 'Photography', 'Anime'],
    badges: [],
    role: 'peer',
    connectionStatus: 'pending_received',
    isOnline: true,
    sharedQuestIds: ['moma'],
    mutualConnections: 1,
    bio: 'Designing everything I can get my hands on.',
  },
  {
    player: extraPlayers[1], // Kai Rodriguez
    school: 'Aviation HS',
    interests: ['Coding', 'Drones', 'Skateboarding'],
    badges: [],
    role: 'peer',
    connectionStatus: 'none',
    isOnline: false,
    sharedQuestIds: ['newlab', 'google'],
    mutualConnections: 0,
    bio: 'Code by day, skate by night. Building my first app.',
  },
  {
    player: extraPlayers[2], // Priya Sharma
    school: 'Beacon School',
    interests: ['Volunteering', 'Music', 'Writing'],
    badges: [],
    role: 'peer',
    connectionStatus: 'none',
    isOnline: true,
    sharedQuestIds: ['sinai', 'foodbank'],
    mutualConnections: 2,
    bio: 'Introvert who\'s trying to put herself out there.',
  },
  {
    player: extraPlayers[3], // Tyler Washington
    school: 'George Washington HS',
    interests: ['Track & Field', 'Business', 'Gaming'],
    badges: [],
    role: 'peer',
    connectionStatus: 'none',
    isOnline: true,
    sharedQuestIds: ['trading'],
    mutualConnections: 0,
    bio: 'Competitive about literally everything.',
  },
  {
    player: extraPlayers[4], // Luna Chen
    school: 'LaGuardia Arts',
    interests: ['Film', 'Animation', 'Storytelling'],
    badges: [],
    role: 'peer',
    connectionStatus: 'pending_sent',
    isOnline: false,
    sharedQuestIds: ['droga5', 'moma'],
    mutualConnections: 1,
    bio: 'Aspiring filmmaker. Every frame tells a story.',
  },
  {
    player: extraPlayers[5], // Marcus Jr.
    school: 'Midwood HS',
    interests: ['Electrical engineering', 'Chess', 'Cooking'],
    badges: [],
    role: 'peer',
    connectionStatus: 'none',
    isOnline: false,
    sharedQuestIds: ['newlab'],
    mutualConnections: 0,
    bio: 'I fix things that other people think are broken.',
  },
  {
    player: extraPlayers[6], // Nia Brooks
    school: 'Eleanor Roosevelt HS',
    interests: ['Psychology', 'Dance', 'Social media'],
    badges: [],
    role: 'peer',
    connectionStatus: 'none',
    isOnline: true,
    sharedQuestIds: ['sinai', 'foodbank'],
    mutualConnections: 1,
    bio: 'Future therapist. Also a really good dancer.',
  },
  // Mentors (from NPC characters, re-mapped as social profiles)
  {
    player: npcCharacters[0], // Marcus Thompson
    school: undefined,
    interests: ['Advertising', 'Brand strategy', 'Mentoring youth'],
    badges: ['MENTOR', 'CREATIVE LEAD'],
    role: 'mentor',
    connectionStatus: 'connected',
    isOnline: true,
    sharedQuestIds: ['droga5'],
    mutualConnections: 0,
    bio: 'Creative Director at Droga5. Started where you are now.',
  },
  {
    player: npcCharacters[1], // Sara Kim
    school: undefined,
    interests: ['Hardware prototyping', 'STEM education', 'Sustainability'],
    badges: ['MENTOR', 'ENGINEER'],
    role: 'mentor',
    connectionStatus: 'none',
    isOnline: true,
    sharedQuestIds: ['newlab'],
    mutualConnections: 0,
    bio: 'Lead Engineer at New Lab. I build things that matter.',
  },
  {
    player: npcCharacters[2], // Dr. Nia Hayes
    school: undefined,
    interests: ['Volunteer coordination', 'Public health', 'Community outreach'],
    badges: ['MENTOR', 'CAREER COACH'],
    role: 'mentor',
    connectionStatus: 'none',
    isOnline: false,
    sharedQuestIds: ['sinai'],
    mutualConnections: 0,
    bio: 'Volunteer Coordinator at Mt Sinai. Healthcare changes lives.',
  },
];

// --- Direct messages ---

export interface DirectMessage {
  id: string;
  fromId: string;
  text: string;
  time: string;
  read: boolean;
}

export interface Conversation {
  participantId: string;
  messages: DirectMessage[];
  unreadCount: number;
}

export const conversations: Conversation[] = [
  {
    participantId: 'jordan',
    unreadCount: 1,
    messages: [
      { id: 'dm1', fromId: 'jordan', text: 'Yo Maya! You going to New Lab this weekend?', time: '2h ago', read: true },
      { id: 'dm2', fromId: 'maya', text: 'Thinking about it! Is it hard to get to from the Bronx?', time: '1h ago', read: true },
      { id: 'dm3', fromId: 'jordan', text: 'Nah, B67 bus straight there. I can show you around — I\'ve been twice already', time: '45m ago', read: false },
    ],
  },
  {
    participantId: 'aisha',
    unreadCount: 0,
    messages: [
      { id: 'dm4', fromId: 'aisha', text: 'Hey! So excited we matched in a party 🎉', time: '1d ago', read: true },
      { id: 'dm5', fromId: 'maya', text: 'Me too! What quests are you looking at?', time: '1d ago', read: true },
      { id: 'dm6', fromId: 'aisha', text: 'The hospital volunteer one looks amazing. I want to be a doctor someday!', time: '23h ago', read: true },
    ],
  },
  {
    participantId: 'marcus',
    unreadCount: 2,
    messages: [
      { id: 'dm7', fromId: 'marcus', text: 'Hey Maya! Saw your Creator profile — you\'d fit right in at Droga5.', time: '3h ago', read: true },
      { id: 'dm8', fromId: 'marcus', text: 'We have a pitch session Thursday. Watching one live changed my whole career path.', time: '2h ago', read: false },
      { id: 'dm9', fromId: 'marcus', text: 'No pressure, but I think you\'d love it. LMK!', time: '1h ago', read: false },
    ],
  },
];

// --- Community insights ---

export interface CommunityInsight {
  id: string;
  icon: string;
  text: string;
  detail: string;
}

export const communityInsights: CommunityInsight[] = [
  { id: 'ci1', icon: '🔥', text: 'New Lab is trending', detail: '12 students signed up this week' },
  { id: 'ci2', icon: '⚡', text: 'New mentor joined: Sara Kim', detail: 'Lead Engineer at New Lab — Fixer vibe' },
  { id: 'ci3', icon: '🎯', text: 'Your vibe match is high with Zara Lin', detail: '94% compatibility — both Creators in NYC' },
  { id: 'ci4', icon: '👥', text: '3 students near you are online', detail: 'Priya, Tyler, and Nia are exploring right now' },
];

// --- Helper functions ---

// TODO: Replace with Supabase query — fetch social profiles for discover/network tabs
export function getConnectedProfiles(): SocialProfile[] {
  return socialProfiles.filter(p => p.connectionStatus === 'connected');
}

// TODO: Replace with Supabase query — fetch all discoverable profiles
export function getDiscoverableProfiles(filter: 'all' | 'peers' | 'mentors' | 'nearby'): SocialProfile[] {
  switch (filter) {
    case 'peers':
      return socialProfiles.filter(p => p.role === 'peer');
    case 'mentors':
      return socialProfiles.filter(p => p.role === 'mentor');
    case 'nearby':
      return socialProfiles.filter(p => p.isOnline && p.role === 'peer');
    default:
      return socialProfiles;
  }
}

// TODO: Replace with Supabase query — fetch conversations for current user
export function getConversations(): Conversation[] {
  return conversations;
}

export function getProfileById(playerId: string): SocialProfile | undefined {
  return socialProfiles.find(p => p.player.id === playerId);
}

export function getSharedQuests(profile: SocialProfile) {
  return quests.filter(q => profile.sharedQuestIds.includes(q.id));
}

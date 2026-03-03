import mayaPhoto from '@/assets/maya.jpg';
import jordanPhoto from '@/assets/jordan.jpg';
import aishaPhoto from '@/assets/aisha.jpg';
import deshawnPhoto from '@/assets/deshawn.jpg';
import marcusPhoto from '@/assets/marcus.jpg';
import questDroga5 from '@/assets/quest-droga5.jpg';
import questNewlab from '@/assets/quest-newlab.jpg';
import questSinai from '@/assets/quest-sinai.jpg';
import questGamestudio from '@/assets/quest-gamestudio.jpg';
import questTrading from '@/assets/quest-trading.jpg';

export type Vibe = 'creator' | 'fixer' | 'connector' | 'competitor';

export const vibeColors: Record<Vibe, string> = {
  creator: '#FF6B4A',
  fixer: '#3B82F6',
  connector: '#FBBF24',
  competitor: '#EC4899',
};

export const vibeEmoji: Record<Vibe, string> = {
  creator: '🎨',
  fixer: '🔧',
  connector: '💫',
  competitor: '⚡',
};

export const vibeStatements: Record<Vibe, string> = {
  creator: 'I make things that didn\'t exist before',
  fixer: 'I figure out how things work',
  connector: 'I bring people together',
  competitor: 'I push to be the best',
};

export interface Player {
  id: string;
  name: string;
  level: number;
  xp: number;
  maxXp: number;
  coins: number;
  vibe: Vibe;
  photo: string;
  location: [number, number];
  borough: string;
  questsCompleted: number;
  statement: string;
  passions?: string[];
  isNpc?: boolean;
  npcRole?: string;
}

export const maya: Player = {
  id: 'maya', name: 'Maya Chen', level: 1, xp: 50, maxXp: 200, coins: 250,
  vibe: 'creator', photo: mayaPhoto, location: [40.8448, -73.8648],
  borough: 'The Bronx', questsCompleted: 0, statement: vibeStatements.creator,
};

export const jordan: Player = {
  id: 'jordan', name: 'Jordan Williams', level: 3, xp: 120, maxXp: 300, coins: 480,
  vibe: 'fixer', photo: jordanPhoto, location: [40.6782, -73.9442],
  borough: 'Brooklyn', questsCompleted: 5, statement: vibeStatements.fixer,
};

export const aisha: Player = {
  id: 'aisha', name: 'Aisha Patel', level: 2, xp: 80, maxXp: 250, coins: 310,
  vibe: 'connector', photo: aishaPhoto, location: [40.7282, -73.7949],
  borough: 'Queens', questsCompleted: 2, statement: vibeStatements.connector,
};

export const deshawn: Player = {
  id: 'deshawn', name: 'DeShawn', level: 5, xp: 180, maxXp: 400, coins: 720,
  vibe: 'competitor', photo: deshawnPhoto, location: [40.8116, -73.9465],
  borough: 'Harlem', questsCompleted: 8, statement: vibeStatements.competitor,
};

export const marcus: Player = {
  id: 'marcus', name: 'Marcus Thompson', level: 99, xp: 0, maxXp: 1, coins: 0,
  vibe: 'creator', photo: marcusPhoto, location: [40.7064, -74.0094],
  borough: 'Manhattan', questsCompleted: 100, statement: 'Creative Director • Droga5',
  isNpc: true, npcRole: 'Mentor',
};

// NPC mentors/employers that roam the map
export const npcCharacters: Player[] = [
  {
    id: 'marcus', name: 'Marcus Thompson', level: 99, xp: 0, maxXp: 1, coins: 0,
    vibe: 'creator', photo: marcusPhoto, location: [40.7064, -74.0094],
    borough: 'Manhattan', questsCompleted: 100, statement: 'Creative Director • Droga5',
    isNpc: true, npcRole: 'Creative Director',
  },
  {
    id: 'npc-sara', name: 'Sara Kim', level: 50, xp: 0, maxXp: 1, coins: 0,
    vibe: 'fixer', photo: aishaPhoto, location: [40.6950, -73.9800],
    borough: 'Brooklyn', questsCompleted: 40, statement: 'Lead Engineer • New Lab',
    isNpc: true, npcRole: 'Lead Engineer',
  },
  {
    id: 'npc-hayes', name: 'Dr. Nia Hayes', level: 60, xp: 0, maxXp: 1, coins: 0,
    vibe: 'connector', photo: jordanPhoto, location: [40.7850, -73.9580],
    borough: 'Upper East Side', questsCompleted: 50, statement: 'Volunteer Coordinator • Mt Sinai',
    isNpc: true, npcRole: 'Volunteer Lead',
  },
];

export const otherPlayers = [jordan, aisha, deshawn];

export const extraPlayers: Player[] = [
  { id: 'player-5', name: 'Zara Lin', level: 2, xp: 60, maxXp: 250, coins: 200, vibe: 'creator', photo: aishaPhoto, location: [40.7580, -73.9855], borough: 'Midtown', questsCompleted: 1, statement: vibeStatements.creator },
  { id: 'player-6', name: 'Kai Rodriguez', level: 4, xp: 150, maxXp: 350, coins: 520, vibe: 'fixer', photo: deshawnPhoto, location: [40.6892, -73.9857], borough: 'Downtown Brooklyn', questsCompleted: 6, statement: vibeStatements.fixer },
  { id: 'player-7', name: 'Priya Sharma', level: 1, xp: 30, maxXp: 200, coins: 100, vibe: 'connector', photo: mayaPhoto, location: [40.7484, -73.9856], borough: 'Murray Hill', questsCompleted: 0, statement: vibeStatements.connector },
  { id: 'player-8', name: 'Tyler Washington', level: 3, xp: 100, maxXp: 300, coins: 380, vibe: 'competitor', photo: jordanPhoto, location: [40.8176, -73.9509], borough: 'Washington Heights', questsCompleted: 4, statement: vibeStatements.competitor },
  { id: 'player-9', name: 'Luna Chen', level: 5, xp: 200, maxXp: 450, coins: 650, vibe: 'creator', photo: marcusPhoto, location: [40.7282, -73.7949], borough: 'Flushing', questsCompleted: 7, statement: vibeStatements.creator },
  { id: 'player-10', name: 'Marcus Jr.', level: 2, xp: 70, maxXp: 250, coins: 220, vibe: 'fixer', photo: jordanPhoto, location: [40.6501, -73.9496], borough: 'Flatbush', questsCompleted: 2, statement: vibeStatements.fixer },
  { id: 'player-11', name: 'Nia Brooks', level: 3, xp: 110, maxXp: 300, coins: 400, vibe: 'connector', photo: aishaPhoto, location: [40.7681, -73.9819], borough: 'Upper West Side', questsCompleted: 3, statement: vibeStatements.connector },
  { id: 'player-12', name: 'Diego Morales', level: 1, xp: 20, maxXp: 200, coins: 80, vibe: 'competitor', photo: deshawnPhoto, location: [40.8448, -73.9132], borough: 'Soundview', questsCompleted: 0, statement: vibeStatements.competitor },
  { id: 'player-13', name: 'Amara Okafor', level: 4, xp: 160, maxXp: 350, coins: 540, vibe: 'creator', photo: mayaPhoto, location: [40.7061, -73.9969], borough: 'Tribeca', questsCompleted: 5, statement: vibeStatements.creator },
  { id: 'player-14', name: 'Jin Park', level: 6, xp: 250, maxXp: 500, coins: 800, vibe: 'fixer', photo: marcusPhoto, location: [40.7506, -73.9971], borough: 'Hudson Yards', questsCompleted: 9, statement: vibeStatements.fixer },
];

export const partyMembers = [jordan, aisha];

export type QuestStatus = 'available' | 'accepted' | 'locked';

export interface Quest {
  id: string;
  title: string;
  subtitle: string;
  location: [number, number];
  address: string;
  vibe: Vibe;
  xp: number;
  reward: string;
  matchPercent: number;
  date: string;
  time: string;
  transit: string;
  partyRequired: boolean;
  locked: boolean;
  levelRequired?: number;
  whyYoullLove: string[];
  whatYoullDo: string[];
  thumbnail: string;
}

export const quests: Quest[] = [
  {
    id: 'droga5', title: 'Droga5',
    subtitle: 'Go behind the scenes to see how wild ideas become real ad campaigns',
    location: [40.7064, -74.0094], address: '120 Wall Street, Manhattan',
    vibe: 'creator', xp: 150, reward: 'Creative Director badge',
    matchPercent: 94, date: 'Sat, Feb 15', time: '10am - 1pm',
    transit: '4/5 train to Wall St — 25 min from The Bronx',
    partyRequired: true, locked: false, thumbnail: questDroga5,
    whyYoullLove: ['You love creating things', 'You love solving puzzles', 'No repetitive work — every project is different', 'Creative teams don\'t micromanage'],
    whatYoullDo: ['Tour the creative floors', 'Meet copywriters, art directors, strategists', 'Watch a real pitch session', 'Hear origin stories (spoiler: weird paths welcome)'],
  },
  {
    id: 'newlab', title: 'New Lab',
    subtitle: 'Build something real with your hands alongside engineers and artists',
    location: [40.7001, -73.9695], address: 'Brooklyn Navy Yard, Bldg 128',
    vibe: 'fixer', xp: 100, reward: 'Tool belt accessory',
    matchPercent: 87, date: 'Sun, Feb 16', time: '1pm - 4pm',
    transit: 'B67 bus — 35 min from The Bronx',
    partyRequired: false, locked: true, levelRequired: 3, thumbnail: questNewlab,
    whyYoullLove: ['Hands-on making', 'Creative + technical combo', 'Work at your own pace'],
    whatYoullDo: ['Use 3D printers and laser cutters', 'Prototype an invention', 'Meet resident engineers'],
  },
  {
    id: 'sinai', title: 'Mount Sinai Hospital',
    subtitle: 'Volunteer and see healthcare careers up close',
    location: [40.7900, -73.9526], address: '1 Gustave L. Levy Pl, Upper East Side',
    vibe: 'connector', xp: 150, reward: 'Healer badge',
    matchPercent: 72, date: 'Sat, Feb 22', time: '9am - 12pm',
    transit: '6 train to 96th — 20 min',
    partyRequired: false, locked: true, levelRequired: 2, thumbnail: questSinai,
    whyYoullLove: ['Meet amazing people', 'See real impact', 'Team environment'],
    whatYoullDo: ['Shadow nurses and docs', 'Help in patient rec room', 'Tour the ER'],
  },
  {
    id: 'gamestudio', title: 'Rockstar Games NYC',
    subtitle: 'Spend a day shadowing game designers at a real studio',
    location: [40.7549, -73.9840], address: '622 Broadway, Manhattan',
    vibe: 'creator', xp: 500, reward: 'Game Dev badge', matchPercent: 98,
    date: 'TBD', time: 'TBD', transit: '', partyRequired: true,
    locked: true, levelRequired: 10, thumbnail: questGamestudio,
    whyYoullLove: [], whatYoullDo: [],
  },
  {
    id: 'trading', title: 'New York Stock Exchange',
    subtitle: 'See the intensity of financial markets up close',
    location: [40.7074, -74.0113], address: '11 Wall Street, Financial District',
    vibe: 'competitor', xp: 400, reward: 'Wall Street badge', matchPercent: 65,
    date: 'TBD', time: 'TBD', transit: '', partyRequired: true,
    locked: true, levelRequired: 15, thumbnail: questTrading,
    whyYoullLove: [], whatYoullDo: [],
  },
  // Additional POI quests for more map life
  {
    id: 'google', title: 'Google NYC',
    subtitle: 'Tour the campus and meet engineers, designers, and PMs',
    location: [40.7414, -74.0019], address: '111 8th Ave, Chelsea',
    vibe: 'fixer', xp: 200, reward: 'Tech Explorer badge', matchPercent: 88,
    date: 'Fri, Feb 21', time: '2pm - 5pm', transit: '1 train to 14th — 30 min',
    partyRequired: false, locked: false, thumbnail: questNewlab,
    whyYoullLove: ['See how tech works at scale', 'Meet real engineers', 'Free snacks 😄'],
    whatYoullDo: ['Tour the campus', 'Watch a design sprint', 'Q&A with Googlers'],
  },
  {
    id: 'moma', title: 'MoMA',
    subtitle: 'Go backstage at one of the world\'s greatest museums',
    location: [40.7614, -73.9776], address: '11 W 53rd St, Midtown',
    vibe: 'creator', xp: 120, reward: 'Art Curator badge', matchPercent: 91,
    date: 'Sun, Mar 1', time: '11am - 2pm', transit: 'E/M to 5th Ave — 25 min',
    partyRequired: false, locked: true, levelRequired: 4, thumbnail: questDroga5,
    whyYoullLove: ['World-class art all around', 'Meet curators & restorers', 'See art nobody else sees'],
    whatYoullDo: ['Tour restoration labs', 'Meet exhibition designers', 'See upcoming exhibits first'],
  },
  {
    id: 'foodbank', title: 'City Harvest',
    subtitle: 'Help feed your neighbors and learn about food justice',
    location: [40.8090, -73.9450], address: '150 52nd St, Harlem',
    vibe: 'connector', xp: 130, reward: 'Community Hero badge', matchPercent: 78,
    date: 'Sat, Mar 8', time: '9am - 12pm', transit: '2/3 to 125th — 15 min',
    partyRequired: false, locked: true, levelRequired: 3, thumbnail: questSinai,
    whyYoullLove: ['Direct community impact', 'Work with amazing volunteers', 'Learn about food systems'],
    whatYoullDo: ['Prep meals for 200+ people', 'Meet community organizers', 'Tour the food bank'],
  },
];

// "Third Places" — hangout spots the student can visit or unlock as bases
export interface MapPOI {
  id: string;
  name: string;
  description: string;
  location: [number, number];
  icon: string;
  vibe: Vibe;
  unlocked: boolean;
  thumbnail: string;
}

export const mapPOIs: MapPOI[] = [
  { id: 'wework1', name: 'The Hive Co-working', description: 'Your unlocked base in Chelsea — study, create, & meet other players here', location: [40.7425, -73.9885], icon: '🏠', vibe: 'fixer', unlocked: true, thumbnail: questNewlab },
  { id: 'park1', name: 'Central Park Meetup Spot', description: 'Party meetup point — rally your squad before quests uptown', location: [40.7829, -73.9654], icon: '📍', vibe: 'connector', unlocked: true, thumbnail: questSinai },
  { id: 'library', name: 'NYPL Study Hall', description: 'Quiet focus zone — bonus XP for completing skill challenges here', location: [40.7532, -73.9822], icon: '📖', vibe: 'creator', unlocked: true, thumbnail: questDroga5 },
  { id: 'stadium', name: 'Yankee Stadium Arena', description: 'Locked arena — reach Level 5 to unlock competitive challenges', location: [40.8296, -73.9262], icon: '🔒', vibe: 'competitor', unlocked: false, thumbnail: questTrading },
  { id: 'hub', name: 'Brooklyn Tech Hub', description: 'Maker space & tech lab — 3D printers, code stations, and mentors on-site', location: [40.7395, -73.9903], icon: '⚙️', vibe: 'fixer', unlocked: true, thumbnail: questNewlab },
  { id: 'gallery', name: 'SoHo Street Art Lab', description: 'Locked creative studio — complete 3 Creator quests to unlock', location: [40.7190, -73.9973], icon: '🔒', vibe: 'creator', unlocked: false, thumbnail: questDroga5 },
];

// Unified organization type for the card system and marker system
export type OrgType = 'quest' | 'internship' | 'mentorship' | 'hangout' | 'partner';

export interface Organization {
  id: string;
  name: string;
  type: OrgType;
  oneLiner: string;
  description: string;
  location: [number, number];
  address: string;
  vibe: Vibe;
  thumbnail: string;
  matchPercent: number;
  xp: number;
  transitTime: string;
  date?: string;
  time?: string;
  skills: string[];
  whyYoullLove: string[];
  whatYoullDo: string[];
  locked: boolean;
  levelRequired?: number;
  attendees: string[];
  icon?: string;
  // Partner-specific fields
  website?: string;
  hours?: string;
  phone?: string;
  email?: string;
  tags?: string[];
  isSchoolPartner?: boolean;
  activelyHiring?: boolean;
  hasSimulation?: boolean;
  simulationId?: string;
}

const questSkills: Record<string, string[]> = {
  droga5: ['Creative Strategy', 'Storytelling', 'Teamwork'],
  newlab: ['3D Printing', 'Prototyping', 'Problem Solving'],
  sinai: ['Patient Care', 'Communication', 'Empathy'],
  gamestudio: ['Game Design', 'Programming', 'Visual Design'],
  trading: ['Data Analysis', 'Decision Making', 'Risk Assessment'],
  google: ['UX Design', 'Engineering', 'Product Thinking'],
  moma: ['Art Curation', 'Visual Literacy', 'Cultural Awareness'],
  foodbank: ['Community Organizing', 'Food Systems', 'Leadership'],
};

const questAttendees: Record<string, string[]> = {
  droga5: ['jordan', 'player-5'],
  newlab: ['player-6', 'player-10', 'player-14'],
  sinai: ['aisha', 'player-7'],
  google: ['player-8', 'player-9', 'player-11'],
};

export interface PartnerOrg {
  id: string;
  name: string;
  description: string;
  location: [number, number];
  address: string;
  website: string;
  hours: string;
  thumbnail: string;
  phone: string;
  email: string;
  tags: string[];
  isSchoolPartner: boolean;
  activelyHiring: boolean;
}

export const partnerOrgs: PartnerOrg[] = [
  {
    id: 'good-shepherd',
    name: 'Good Shepherd Services',
    description: 'Good Shepherd Services operates over 90 programs which help more than 30,000 youth and family members in struggling neighborhoods throughout New York City. GSS offers programs such as after school and summer camps, education programs, college and career programs, youth justice programs, and more.',
    location: [40.7448, -73.9934],
    address: '305 7th Avenue, 9th Floor, New York, NY 10001',
    website: 'https://goodshepherds.org/',
    hours: 'Differ based on program',
    thumbnail: 'https://goodshepherds.org/wp-content/uploads/2016/03/0142-1-1440x310.jpg',
    phone: '212 243 7070',
    email: '',
    tags: ['School Partnership', 'Non-Profit Org', 'Volunteer Opportunities', 'Internships and Job Training'],
    isSchoolPartner: true,
    activelyHiring: false,
  },
  {
    id: 'asase-yaa',
    name: 'Asase Yaa Cultural Arts Foundation',
    description: 'Asase Yaa is a non-profit cultural arts organization in Brooklyn that offers and fuses education, African history, arts, dance, drum/percussion and live performance training to children and adults.',
    location: [40.6858, -73.9782],
    address: '80 Hanson Place, Suite 204, Brooklyn, NY 11217',
    website: 'https://www.asaseyaaent.org/',
    hours: 'Differ based on program',
    thumbnail: 'https://www.asaseyaaent.org/wp-content/uploads/2018/11/AsaseYaa-Logo-e1541622642842.png',
    phone: '(646) 468-0710',
    email: 'INFO@ASASEYAAENT.ORG',
    tags: ['School Partnership', 'Non-Profit Org', 'Museums and Cultural Institutions'],
    isSchoolPartner: true,
    activelyHiring: false,
  },
  {
    id: 'cas-prep',
    name: 'CAS Prep',
    description: 'CAS Prep offers a range of exciting programs designed to help high school students succeed. From academic tutoring in subjects like math, science, and English to college preparation workshops, we provide the support you need to excel in school and beyond.',
    location: [40.6838, -73.9362],
    address: '574 Madison St, Brooklyn, NY 11216',
    website: 'https://www.casprep.org/',
    hours: 'Differ based on program',
    thumbnail: 'https://images.squarespace-cdn.com/content/v1/59dbc7c2cf81e0c47e15482d/1509981485774-SEFF87258WRO7RY3PZKE/_50A4240.jpg?format=2500w',
    phone: '(646) 982-8166',
    email: '',
    tags: ['School Partnership', 'Non-Profit Org'],
    isSchoolPartner: true,
    activelyHiring: false,
  },
  {
    id: 'usdan',
    name: 'Usdan Summer Camps for the Arts',
    description: 'Usdan is a unique arts summer camp in the NYC area that brings together the rigor of artistic practice and the playfulness of a classic summer camp.',
    location: [40.7712, -73.3715],
    address: '185 Colonial Springs Road, Wheatley Heights, NY',
    website: 'https://www.usdan.org/programs',
    hours: '',
    thumbnail: 'https://www.usdan.org/sites/default/files/styles/header_image_16x9__1280x720_/public/hero_image/2019_day1_1540-copy_0.jpg?itok=-MTyDUY1',
    phone: '',
    email: '',
    tags: ['School Partnership', 'Non-Profit Org', 'Volunteer Opportunities', 'Parks and Outdoor Spaces'],
    isSchoolPartner: true,
    activelyHiring: false,
  },
  {
    id: 'bbg',
    name: 'Brooklyn Botanic Gardens',
    description: 'Brooklyn Botanic Garden (BBG) is a vibrant urban garden located in the heart of Brooklyn, New York. BBG features over 50 gardens and collections, welcoming nearly a million visitors each year.',
    location: [40.6694, -73.9625],
    address: '990 Washington Ave, Brooklyn, NY 11225',
    website: 'https://www.bbg.org',
    hours: 'Winter: 10 AM–4:30 PM · Spring/Summer/Fall: 10 AM–6 PM · Closed Mondays',
    thumbnail: 'https://assets.simpleviewinc.com/simpleview/image/upload/c_fill,h_334,q_75,w_579/v1/crm/newyorkstate/brooklynbotanicgarden_taggeryanceyiv_9877_0e54d36f-f030-c3e1-4b0f882ab20cdf99.jpg',
    phone: '',
    email: '',
    tags: ['Parks and Outdoor Spaces'],
    isSchoolPartner: true,
    activelyHiring: false,
  },
  {
    id: 'weeksville',
    name: 'Weeksville Heritage Center',
    description: 'Weeksville Heritage Center (WHC) is a significant cultural institution in Brooklyn dedicated to preserving the history of one of America\'s first free Black communities. WHC engages over 25,000 visitors annually.',
    location: [40.6735, -73.9217],
    address: '158 Buffalo Ave, Brooklyn, NY 11213',
    website: 'https://www.weeksvillesociety.org',
    hours: 'Wed–Fri: 10 AM–5 PM · Sat: 10 AM–4 PM · Closed Sun–Tue',
    thumbnail: 'https://images.squarespace-cdn.com/content/v1/5747476e59827e0923564c9f/1464900523612-14GI0HXQ1CW1CRYPIMJH/image-asset.jpeg',
    phone: '',
    email: '',
    tags: ['Museums and Cultural Institutions'],
    isSchoolPartner: true,
    activelyHiring: false,
  },
  {
    id: 'bcm',
    name: 'Brooklyn Children\'s Museum',
    description: 'Brooklyn Children\'s Museum (BCM) is the world\'s first children\'s museum. BCM offers over 30 exhibits and programs that engage and inspire over 250,000 children and families annually.',
    location: [40.6716, -73.9257],
    address: '145 Brooklyn Ave, Brooklyn, NY 11213',
    website: 'https://www.brooklynkids.org',
    hours: 'Wed–Sun: 10 AM–5 PM · Closed Mon–Tue',
    thumbnail: 'https://assets.simpleviewinc.com/simpleview/image/upload/q_75/v1/crm/newyorkstate/brooklynchildrensmuseum_julienneschaer_001_0fdfcb52-f4c0-2cb9-2ac96c765fb0a685.jpg',
    phone: '',
    email: '',
    tags: ['Museums and Cultural Institutions'],
    isSchoolPartner: true,
    activelyHiring: false,
  },
  {
    id: 'restoration-plaza',
    name: 'Restoration Plaza',
    description: 'Restoration, also known as Bedford Stuyvesant Restoration Corporation, is a pioneering community development organization impacting over 50,000 residents annually with economic development, affordable housing, arts and culture, and health and wellness programs.',
    location: [40.6810, -73.9384],
    address: '1368 Fulton St, Brooklyn, NY 11216',
    website: 'https://www.restorationplaza.org',
    hours: 'Mon–Fri: 9 AM–5 PM',
    thumbnail: 'https://restorationplaza.org/wp-content/uploads/2021/06/rstpl_CS01_2.jpg',
    phone: '',
    email: '',
    tags: ['Non-Profit Org', 'School Partnership', 'Volunteer Opportunities', 'Internships and Job Training', 'Community Colleges and Adult Education Programs'],
    isSchoolPartner: true,
    activelyHiring: false,
  },
  {
    id: 'tcah',
    name: 'The Campaign Against Hunger',
    description: 'The Campaign Against Hunger (TCAH) reaches over 300,000 individuals annually with food pantries, urban farms, nutrition education, workforce development, and community outreach initiatives.',
    location: [40.6785, -73.9134],
    address: '2010 Fulton St, Brooklyn, NY 11233',
    website: 'https://www.tcahnyc.org',
    hours: 'Mon–Fri: 9 AM–5 PM',
    thumbnail: 'https://www.tcahnyc.org/wp-content/uploads/2024/03/tcah_staff_shot2.jpg',
    phone: '',
    email: '',
    tags: ['School Partnership', 'Non-Profit Org', 'Parks and Outdoor Spaces'],
    isSchoolPartner: true,
    activelyHiring: false,
  },
  {
    id: 'neighbors-in-action',
    name: 'Neighbors in Action',
    description: 'Neighbors in Action is a community-based organization in Brooklyn dedicated to reducing violence and promoting community healing through violence interruption, youth development, and community building.',
    location: [40.6693, -73.9420],
    address: '256 Kingston Ave, Brooklyn, NY 11213',
    website: 'https://www.neighborsinaction.org',
    hours: 'Mon–Fri: 10 AM–6 PM',
    thumbnail: '/partners/neighbors-in-action.jpg',
    phone: '',
    email: '',
    tags: ['Non-Profit Org', 'Volunteer Opportunities', 'Internships and Job Training', 'Libraries and Community Centers'],
    isSchoolPartner: true,
    activelyHiring: false,
  },
  {
    id: 'ny-sun-works',
    name: 'NY Sun Works',
    description: 'NY Sun Works is a nonprofit focused on sustainability education through urban agriculture, implementing hydroponic science labs in schools and reaching thousands of students annually.',
    location: [40.7753, -73.9797],
    address: '157 Columbus Ave, Room 525, New York, NY 10023',
    website: 'https://www.nysunworks.org',
    hours: 'Mon–Fri: 9 AM–5 PM',
    thumbnail: '/partners/ny-sun-works.jpg',
    phone: '',
    email: '',
    tags: ['Non-Profit Org', 'School Partnership', 'Internships and Job Training'],
    isSchoolPartner: true,
    activelyHiring: false,
  },
  {
    id: 'save-our-streets',
    name: 'Save Our Streets',
    description: 'Save Our Streets (SOS) is an anti-violence program under the Center for Court Innovation, working with communities affected by gun violence through outreach, conflict mediation, and community mobilization.',
    location: [40.6693, -73.9420],
    address: '256 Kingston Ave, Brooklyn, NY 11213',
    website: 'https://www.courtinnovation.org/programs/save-our-streets',
    hours: 'Mon–Fri: 10 AM–6 PM',
    thumbnail: '/partners/save-our-streets.jpg',
    phone: '',
    email: '',
    tags: ['Non-Profit Org', 'Volunteer Opportunities', 'Internships and Job Training', 'Libraries and Community Centers'],
    isSchoolPartner: true,
    activelyHiring: false,
  },
  {
    id: 'billion-oyster',
    name: 'Billion Oyster Project',
    description: 'The Billion Oyster Project is dedicated to restoring oyster reefs to New York Harbor, engaging thousands of students and volunteers annually through hands-on restoration, education, and stewardship activities.',
    location: [40.6892, -74.0166],
    address: "Governors Island, New York, NY 10004",
    website: 'https://www.billionoysterproject.org',
    hours: 'Mon–Fri: 9 AM–5 PM',
    thumbnail: '/partners/billion-oyster.jpg',
    phone: '',
    email: '',
    tags: ['Non-Profit Org', 'Volunteer Opportunities', 'Internships and Job Training', 'Parks and Outdoor Spaces', 'School Partnership'],
    isSchoolPartner: true,
    activelyHiring: false,
  },
  {
    id: 'publicolor',
    name: 'Publicolor',
    description: 'Publicolor uses design-based programs to engage at-risk students and transform public spaces, serving thousands of students each year through academic support, mentoring, and community service.',
    location: [40.7507, -73.9872],
    address: '20 W 36th St, 3rd Floor, New York, NY 10018',
    website: 'https://www.publicolor.org',
    hours: 'Mon–Fri: 9 AM–5 PM',
    thumbnail: '/partners/publicolor.jpg',
    phone: '',
    email: '',
    tags: ['Non-Profit Org', 'School Partnership', 'Volunteer Opportunities', 'Internships and Job Training'],
    isSchoolPartner: true,
    activelyHiring: false,
  },
  {
    id: 'bed-stuy-cpp',
    name: 'Bed Stuy Community Partnership Program',
    description: 'The Bed-Stuy Community Partnership Program fosters collaboration and support among local residents through youth development, family support, and neighborhood improvement projects.',
    location: [40.6814, -73.9500],
    address: '1669 Bedford Ave, Brooklyn, NY 11225',
    website: 'https://www.courtinnovation.org/programs/bed-stuy-community-partnership',
    hours: 'Mon–Fri: 9 AM–5 PM',
    thumbnail: '/partners/bed-stuy-cpp.jpg',
    phone: '',
    email: '',
    tags: ['Non-Profit Org', 'Volunteer Opportunities', 'Libraries and Community Centers'],
    isSchoolPartner: true,
    activelyHiring: false,
  },
  {
    id: 'nyrp',
    name: 'New York Restoration Project',
    description: 'NYRP transforms open spaces in underserved communities throughout NYC, managing park restorations, community gardens, and tree plantings benefiting tens of thousands of residents annually.',
    location: [40.7490, -73.9930],
    address: '254 W 31st St, 10th Floor, New York, NY 10001',
    website: 'https://www.nyrp.org',
    hours: 'Mon–Fri: 9 AM–5 PM',
    thumbnail: '/partners/nyrp.jpg',
    phone: '',
    email: '',
    tags: ['Non-Profit Org', 'Parks and Outdoor Spaces', 'Volunteer Opportunities', 'Internships and Job Training'],
    isSchoolPartner: true,
    activelyHiring: false,
  },
  {
    id: 'teak',
    name: 'TEAK Fellowship',
    description: 'TEAK Fellowship provides academic and personal support to talented, low-income students through comprehensive programs including academic enrichment, leadership training, and college preparation.',
    location: [40.7486, -73.9912],
    address: '132 W 31st St, 3rd Floor, New York, NY 10001',
    website: 'https://www.teakfellowship.org',
    hours: 'Mon–Fri: 9 AM–6 PM',
    thumbnail: '/partners/teak.jpg',
    phone: '',
    email: '',
    tags: ['Non-Profit Org', 'School Partnership', 'Internships and Job Training', 'Community Colleges and Adult Education Programs'],
    isSchoolPartner: true,
    activelyHiring: false,
  },
  {
    id: 'oliver-scholars',
    name: 'Oliver Scholars',
    description: 'Oliver Scholars prepares high-achieving Black and Latino students for success at top independent schools and prestigious colleges through intensive academic enrichment, mentoring, and leadership development.',
    location: [40.7065, -74.0054],
    address: '80 Maiden Ln, Suite 706, New York, NY 10038',
    website: 'https://www.oliverscholars.org',
    hours: 'Mon–Fri: 9 AM–5 PM',
    thumbnail: '/partners/oliver-scholars.jpg',
    phone: '',
    email: '',
    tags: ['Non-Profit Org', 'School Partnership', 'Internships and Job Training'],
    isSchoolPartner: true,
    activelyHiring: false,
  },
  {
    id: 'bhgh',
    name: 'Boys Hope Girls Hope',
    description: 'Boys Hope Girls Hope helps academically capable and motivated young people overcome barriers through residential and community-based programs providing academic support, mentoring, and life skills development.',
    location: [40.6869, -73.9851],
    address: '184 Baltic St, Brooklyn, NY 11201',
    website: 'https://www.bhghny.org',
    hours: 'Mon–Fri: 9 AM–5 PM',
    thumbnail: '/partners/bhgh.jpg',
    phone: '',
    email: '',
    tags: ['Non-Profit Org', 'School Partnership', 'Volunteer Opportunities', 'Internships and Job Training'],
    isSchoolPartner: true,
    activelyHiring: false,
  },
  {
    id: 'nyc-outward-bound',
    name: 'NYC Outward Bound',
    description: 'NYC Outward Bound Schools uses the Outward Bound approach to inspire students through a network of public schools emphasizing character development, academic achievement, and leadership.',
    location: [40.7505, -73.9231],
    address: '29-46 Northern Blvd, Long Island City, NY 11101',
    website: 'https://www.nycoutwardbound.org',
    hours: 'Mon–Fri: 9 AM–5 PM',
    thumbnail: '/partners/nyc-outward-bound.jpg',
    phone: '',
    email: '',
    tags: ['Non-Profit Org', 'School Partnership', 'Volunteer Opportunities', 'Internships and Job Training'],
    isSchoolPartner: true,
    activelyHiring: false,
  },
  {
    id: 'divas-social-justice',
    name: 'Divas for Social Justice',
    description: 'Divas for Social Justice empowers young women and marginalized communities through technology and the arts, including digital literacy, media production, and social justice advocacy programs.',
    location: [40.6845, -73.9790],
    address: '540 Atlantic Ave, Brooklyn, NY 11217',
    website: 'https://www.divasforsocialjustice.org',
    hours: 'Mon–Fri: 9 AM–5 PM',
    thumbnail: '/partners/divas-social-justice.jpg',
    phone: '',
    email: '',
    tags: ['Non-Profit Org', 'Technology and Maker Spaces', 'Volunteer Opportunities', 'Internships and Job Training', 'Libraries and Community Centers'],
    isSchoolPartner: false,
    activelyHiring: false,
  },
  {
    id: 'craftsman-ave',
    name: 'Craftsman Ave',
    description: 'Craftsman Ave teaches hands-on skills like knife making, woodworking, welding, leather-working, and stained glass in 4-hour workshops taught by experienced Brooklyn-based makers.',
    location: [40.6735, -73.9894],
    address: '117B 11th St, Brooklyn, NY 11215',
    website: 'https://www.craftsmanave.com',
    hours: 'Varies based on scheduled workshops',
    thumbnail: '/partners/craftsman-ave.jpg',
    phone: '',
    email: '',
    tags: ['Technology and Maker Spaces', 'Internships and Job Training'],
    isSchoolPartner: false,
    activelyHiring: false,
  },
  {
    id: 'cb14',
    name: 'Brooklyn Community Board 14',
    description: 'Community Board 14 represents Flatbush, Midwood and a small part of Kensington, with members selected from active, involved community members.',
    location: [40.6267, -73.9625],
    address: '810 E 16th St, Brooklyn, NY 11230',
    website: 'https://www.cb14brooklyn.com',
    hours: 'Mon–Fri: 9 AM–5 PM',
    thumbnail: '/partners/cb14.jpg',
    phone: '',
    email: '',
    tags: ['Libraries and Community Centers', 'Volunteer Opportunities'],
    isSchoolPartner: false,
    activelyHiring: false,
  },
  {
    id: 'bam',
    name: 'BAM',
    description: 'BAM (Brooklyn Academy of Music) is a multi-arts center. For more than 150 years, BAM has been the home for adventurous artists, audiences, and ideas with programming in theater, dance, music, opera, film, and more.',
    location: [40.6862, -73.9784],
    address: '30 Lafayette Ave, Brooklyn, NY 11217',
    website: 'https://www.bam.org',
    hours: 'Mon–Sun: Hours vary based on events',
    thumbnail: '/partners/bam.jpg',
    phone: '',
    email: '',
    tags: ['Museums and Cultural Institutions', 'Volunteer Opportunities', 'Internships and Job Training'],
    isSchoolPartner: false,
    activelyHiring: false,
  },
  {
    id: 'bam-education',
    name: 'BAM Education',
    description: 'BAM Education connects learning with creativity, engaging imagination by encouraging self-expression through programs for students, teachers, and audiences of all ages.',
    location: [40.6862, -73.9767],
    address: '321 Ashland Pl, Brooklyn, NY 11217',
    website: 'https://www.bam.org/education',
    hours: 'Mon–Fri: 9 AM–6 PM',
    thumbnail: '/partners/bam-education.jpg',
    phone: '',
    email: '',
    tags: ['Museums and Cultural Institutions', 'School Partnership', 'Internships and Job Training'],
    isSchoolPartner: false,
    activelyHiring: false,
  },
  {
    id: 'audre-lorde',
    name: 'The Audre Lorde Project',
    description: 'The Audre Lorde Project is a community organizing center dedicated to supporting LGBTQ+ people of color through advocacy, leadership development, and support groups.',
    location: [40.7432, -73.9933],
    address: '147 W 24th St, 3rd Floor, New York, NY 10011',
    website: 'https://www.alp.org',
    hours: 'Mon–Fri: 10 AM–6 PM',
    thumbnail: '/partners/audre-lorde.jpg',
    phone: '',
    email: '',
    tags: ['Non-Profit Org', 'Volunteer Opportunities', 'Libraries and Community Centers'],
    isSchoolPartner: false,
    activelyHiring: false,
  },
  {
    id: 'bcpc',
    name: 'Brooklyn Community Pride Center',
    description: 'Brooklyn Community Pride Center provides support and services to the LGBTQ+ community including youth and elder services, health and wellness programs, social support groups, and advocacy.',
    location: [40.6810, -73.9384],
    address: '1360 Fulton St, Ground Floor, Brooklyn, NY 11216',
    website: 'https://www.lgbtbrooklyn.org',
    hours: 'Mon–Fri: 9 AM–6 PM',
    thumbnail: '/partners/bcpc.jpg',
    phone: '',
    email: '',
    tags: ['Non-Profit Org', 'Volunteer Opportunities', 'Libraries and Community Centers'],
    isSchoolPartner: false,
    activelyHiring: false,
  },
  {
    id: 'callen-lorde',
    name: 'Callen-Lorde Community Health Center',
    description: 'Callen-Lorde is a leading healthcare provider specializing in LGBTQ+ and community-based health services, serving over 18,000 patients annually with comprehensive medical, dental, behavioral health services.',
    location: [40.7418, -74.0013],
    address: '356 W 18th St, New York, NY 10011',
    website: 'https://www.callen-lorde.org',
    hours: 'Mon–Fri: 8:15 AM–8 PM · Sat: 9 AM–3 PM',
    thumbnail: '/partners/callen-lorde.jpg',
    phone: '',
    email: '',
    tags: ['Non-Profit Org', 'Volunteer Opportunities', 'Internships and Job Training'],
    isSchoolPartner: false,
    activelyHiring: false,
  },
  {
    id: 'housing-works',
    name: 'Housing Works',
    description: 'Housing Works is dedicated to ending the dual crises of homelessness and AIDS, impacting over 30,000 individuals annually with housing, healthcare, advocacy, and social enterprise initiatives.',
    location: [40.6926, -73.9860],
    address: '57 Willoughby St, Brooklyn, NY 11201',
    website: 'https://www.housingworks.org',
    hours: 'Mon–Fri: 9 AM–6 PM · Sat: 10 AM–6 PM',
    thumbnail: '/partners/housing-works.jpg',
    phone: '',
    email: '',
    tags: ['Non-Profit Org', 'Volunteer Opportunities', 'Internships and Job Training'],
    isSchoolPartner: false,
    activelyHiring: false,
  },
  {
    id: 'make-the-road',
    name: 'Make the Road',
    description: 'Make the Road New York supports over 23,000 immigrant and working-class individuals annually with legal and health services, educational programs, and community organizing.',
    location: [40.7041, -73.9166],
    address: '301 Grove St, Brooklyn, NY 11237',
    website: 'https://www.maketheroadny.org',
    hours: 'Mon–Fri: 9 AM–6 PM',
    thumbnail: '/partners/make-the-road.jpg',
    phone: '',
    email: '',
    tags: ['Non-Profit Org', 'Volunteer Opportunities', 'Internships and Job Training', 'Community Colleges and Adult Education Programs'],
    isSchoolPartner: false,
    activelyHiring: false,
  },
  {
    id: 'mixteca',
    name: 'Mixteca Organization',
    description: 'Mixteca Organization supports the well-being of the Latino immigrant community through comprehensive health services, educational workshops, cultural events, and social support.',
    location: [40.6701, -73.9887],
    address: '245 23rd St, 2nd Floor, Brooklyn, NY 11215',
    website: 'https://www.mixteca.org',
    hours: 'Mon–Fri: 10 AM–6 PM',
    thumbnail: '/partners/mixteca.jpg',
    phone: '',
    email: '',
    tags: ['Non-Profit Org', 'Volunteer Opportunities', 'Libraries and Community Centers', 'Community Colleges and Adult Education Programs'],
    isSchoolPartner: false,
    activelyHiring: false,
  },
  {
    id: 'neighbors-together',
    name: 'Neighbors Together',
    description: 'Neighbors Together combats hunger and poverty in Brooklyn, assisting over 10,000 individuals annually through a community café, social services, and advocacy initiatives.',
    location: [40.6785, -73.9109],
    address: '2094 Fulton St, Brooklyn, NY 11233',
    website: 'https://www.neighborstogether.org',
    hours: 'Mon–Fri: 9 AM–5 PM',
    thumbnail: '/partners/neighbors-together.jpg',
    phone: '',
    email: '',
    tags: ['Non-Profit Org', 'Volunteer Opportunities', 'Libraries and Community Centers', 'Community Colleges and Adult Education Programs'],
    isSchoolPartner: false,
    activelyHiring: false,
  },
  {
    id: 'ucc',
    name: 'United Community Centers',
    description: 'United Community Centers enhances the quality of life for East New York residents through youth and senior services, educational programs, community gardening, and advocacy efforts.',
    location: [40.6622, -73.8839],
    address: '613 New Lots Ave, Brooklyn, NY 11207',
    website: 'https://www.ucceny.org',
    hours: 'Mon–Fri: 9 AM–5 PM',
    thumbnail: '/partners/ucc.jpg',
    phone: '',
    email: '',
    tags: ['Non-Profit Org', 'Volunteer Opportunities', 'Libraries and Community Centers', 'Parks and Outdoor Spaces'],
    isSchoolPartner: false,
    activelyHiring: false,
  },
];

export const organizations: Organization[] = [
  // Quests mapped to Organization
  ...quests.map((q): Organization => ({
    id: q.id,
    name: q.title,
    type: 'quest',
    oneLiner: q.subtitle,
    description: q.subtitle,
    location: q.location,
    address: q.address,
    vibe: q.vibe,
    thumbnail: q.thumbnail,
    matchPercent: q.matchPercent,
    xp: q.xp,
    transitTime: q.transit,
    date: q.date,
    time: q.time,
    skills: questSkills[q.id] || [],
    whyYoullLove: q.whyYoullLove,
    whatYoullDo: q.whatYoullDo,
    locked: q.locked,
    levelRequired: q.levelRequired,
    attendees: questAttendees[q.id] || [],
    ...(q.id === 'google' ? { hasSimulation: true, simulationId: 'silent-breach' } : {}),
    ...(q.id === 'droga5' ? { hasSimulation: true, simulationId: 'incident-response' } : {}),
  })),
  // POIs mapped to Organization
  ...mapPOIs.map((poi): Organization => ({
    id: poi.id,
    name: poi.name,
    type: 'hangout',
    oneLiner: poi.description,
    description: poi.description,
    location: poi.location,
    address: '',
    vibe: poi.vibe,
    thumbnail: poi.thumbnail,
    matchPercent: 0,
    xp: 0,
    transitTime: '',
    skills: [],
    whyYoullLove: [],
    whatYoullDo: [],
    locked: !poi.unlocked,
    attendees: [],
    icon: poi.icon,
  })),
  // Partners mapped to Organization
  ...partnerOrgs.map((p): Organization => ({
    id: p.id,
    name: p.name,
    type: 'partner',
    oneLiner: p.description.slice(0, 120) + (p.description.length > 120 ? '...' : ''),
    description: p.description,
    location: p.location,
    address: p.address,
    vibe: 'connector',
    thumbnail: p.thumbnail,
    matchPercent: 0,
    xp: 0,
    transitTime: '',
    skills: [],
    whyYoullLove: [],
    whatYoullDo: [],
    locked: false,
    attendees: [],
    icon: p.isSchoolPartner ? '🏫' : '🤝',
    website: p.website,
    hours: p.hours,
    phone: p.phone,
    email: p.email,
    tags: p.tags,
    isSchoolPartner: p.isSchoolPartner,
    activelyHiring: p.activelyHiring,
    ...(p.id === 'billion-oyster' ? { hasSimulation: true, simulationId: 'after-the-flood' } : {}),
  })),
];

export const loveActivities = [
  { id: 'making', emoji: '🛠️', label: 'Making things with my hands' },
  { id: 'puzzles', emoji: '🧩', label: 'Solving puzzles & figuring stuff out' },
  { id: 'helping', emoji: '💛', label: 'Helping people feel better' },
  { id: 'creating', emoji: '🎨', label: 'Creating art, music, or stories' },
  { id: 'leading', emoji: '👑', label: 'Leading the squad' },
  { id: 'winning', emoji: '🏆', label: 'Winning competitions' },
  { id: 'learning', emoji: '⚙️', label: 'Learning how things work' },
  { id: 'outside', emoji: '🌿', label: 'Being outside, staying active' },
  { id: 'talking', emoji: '💬', label: 'Talking to new people' },
  { id: 'alone', emoji: '🎧', label: 'Working alone in my zone' },
];

export const hateActivities = [
  { id: 'sitting', emoji: '🪑', label: 'Sitting still for hours' },
  { id: 'repetitive', emoji: '🔁', label: 'Doing the same thing over and over' },
  { id: 'told', emoji: '📋', label: 'Being told exactly what to do' },
  { id: 'numbers', emoji: '🔢', label: 'Working with numbers all day' },
  { id: 'speaking', emoji: '🎤', label: 'Public speaking' },
  { id: 'alone', emoji: '🏝️', label: 'Working alone with no one to talk to' },
  { id: 'messy', emoji: '🌪️', label: 'Messy or chaotic environments' },
  { id: 'strict', emoji: '📏', label: 'Super strict rules' },
];

export interface PassionCategory {
  id: string;
  label: string;
  emoji: string;
  color: string;
  vibeMapping: Vibe;
}

export const passionCategories: PassionCategory[] = [
  { id: 'maker', label: 'Maker', emoji: '🔨', color: '#E8927C', vibeMapping: 'creator' },
  { id: 'biohacker', label: 'Bio-Hacker', emoji: '🧬', color: '#7DD3A8', vibeMapping: 'fixer' },
  { id: 'architect', label: 'Architect', emoji: '🏗️', color: '#8B9CF7', vibeMapping: 'fixer' },
  { id: 'explorer', label: 'Explorer', emoji: '🧭', color: '#7BC4E8', vibeMapping: 'connector' },
  { id: 'artist', label: 'Artist', emoji: '🎨', color: '#D4A0E8', vibeMapping: 'creator' },
  { id: 'thinker', label: 'Thinker', emoji: '💡', color: '#F7D87C', vibeMapping: 'fixer' },
  { id: 'coder', label: 'Coder', emoji: '💻', color: '#7CE8D4', vibeMapping: 'fixer' },
  { id: 'gamer', label: 'Gamer', emoji: '🎮', color: '#F78B8B', vibeMapping: 'competitor' },
  { id: 'globalist', label: 'Globalist', emoji: '🌍', color: '#8BD4F7', vibeMapping: 'connector' },
  { id: 'musician', label: 'Musician', emoji: '🎵', color: '#C48BF7', vibeMapping: 'creator' },
  { id: 'guardian', label: 'Guardian', emoji: '🛡️', color: '#7CF7A8', vibeMapping: 'connector' },
  { id: 'innovator', label: 'Innovator', emoji: '🚀', color: '#F7A87C', vibeMapping: 'competitor' },
];

export function deriveVibeFromPassions(selectedIds: string[]): Vibe {
  const scores: Record<Vibe, number> = { creator: 0, fixer: 0, connector: 0, competitor: 0 };
  for (const id of selectedIds) {
    const cat = passionCategories.find(c => c.id === id);
    if (cat) scores[cat.vibeMapping]++;
  }
  const sorted = (Object.entries(scores) as [Vibe, number][]).sort((a, b) => b[1] - a[1]);
  return sorted[0][0];
}

export const vibeOptions = [
  { vibe: 'creator' as Vibe, title: 'The Creator', desc: 'I make things that didn\'t exist before', emoji: '🎨' },
  { vibe: 'fixer' as Vibe, title: 'The Fixer', desc: 'I solve problems others give up on', emoji: '🔧' },
  { vibe: 'connector' as Vibe, title: 'The Connector', desc: 'I bring people together', emoji: '💫' },
  { vibe: 'competitor' as Vibe, title: 'The Competitor', desc: 'I play to win', emoji: '⚡' },
];

export const chatMessages = [
  { from: jordan, text: 'Anyone near New Lab?', time: '2m ago' },
  { from: aisha, text: "I'm heading to Manhattan later", time: '1m ago' },
];

// NPC conversation starters — messages they send to players
export interface NpcMessage {
  from: string; // npc id
  text: string;
  time: string;
}

export const npcMessages: Record<string, NpcMessage[]> = {
  marcus: [
    { from: 'marcus', text: "Hey Maya! Saw your profile — your Creator vibe is exactly what we look for. Want to shadow our team at Droga5?", time: '10m ago' },
    { from: 'marcus', text: "We've got a pitch session Thursday. Watching one live changed my career path at your age.", time: '5m ago' },
  ],
  'npc-sara': [
    { from: 'npc-sara', text: "Hi Maya! I run the maker lab at Brooklyn Navy Yard. Your Fixer friends would love it here too 🔧", time: '15m ago' },
    { from: 'npc-sara', text: "We just got new 3D printers — come prototype something this weekend!", time: '8m ago' },
  ],
  'npc-hayes': [
    { from: 'npc-hayes', text: "Maya, the volunteer program at Mt Sinai is looking for Connectors like you. Interested?", time: '20m ago' },
    { from: 'npc-hayes', text: "Even if medicine isn't your thing, seeing how hospitals work is eye-opening. No pressure!", time: '12m ago' },
  ],
};

export const nearbyNotifications = [
  { id: 'n1', icon: '🎨', text: 'Droga5 is 0.3 mi away — matches your vibe!', type: 'opportunity' as const },
  { id: 'n2', icon: '👋', text: 'Jordan is nearby — invite to party?', type: 'person' as const },
  { id: 'n3', icon: '⚡', text: 'New quest unlocked at New Lab', type: 'quest' as const },
];

// --- Org Activity Progression ---

export interface OrgActivity {
  id: string;
  label: string;
  type: 'simulation' | 'visit' | 'workshop' | 'mentorship' | 'challenge';
  icon: string;
  xp: number;
  unlocked: boolean;
  completed: boolean;
  unlockHint: string;
  requiresParty?: boolean;
  requiresLevel?: number;
}

const defaultActivities: Record<string, OrgActivity[]> = {
  google: [
    { id: 'g-sim', label: 'Cyber Defense Simulation', type: 'simulation', icon: '🛡️', xp: 250, unlocked: true, completed: false, unlockHint: '' },
    { id: 'g-visit', label: 'Office Tour', type: 'visit', icon: '🏢', xp: 150, unlocked: true, completed: false, unlockHint: '' },
    { id: 'g-workshop', label: 'Design Sprint Workshop', type: 'workshop', icon: '🎨', xp: 200, unlocked: false, completed: false, unlockHint: 'Complete the simulation first', requiresLevel: 2 },
    { id: 'g-mentor', label: '1:1 with a Googler', type: 'mentorship', icon: '🧑‍💻', xp: 300, unlocked: false, completed: false, unlockHint: 'Reach Level 3', requiresLevel: 3 },
    { id: 'g-challenge', label: 'Hackathon Challenge', type: 'challenge', icon: '🏆', xp: 500, unlocked: false, completed: false, unlockHint: 'Requires a party of 3+', requiresParty: true },
  ],
  droga5: [
    { id: 'd-visit', label: 'Creative Floor Tour', type: 'visit', icon: '🏢', xp: 150, unlocked: true, completed: false, unlockHint: '' },
    { id: 'd-workshop', label: 'Pitch Session', type: 'workshop', icon: '💡', xp: 200, unlocked: true, completed: false, unlockHint: '' },
    { id: 'd-mentor', label: 'Meet Art Directors', type: 'mentorship', icon: '🎭', xp: 250, unlocked: false, completed: false, unlockHint: 'Complete the tour first' },
    { id: 'd-challenge', label: 'Campaign Challenge', type: 'challenge', icon: '🏆', xp: 400, unlocked: false, completed: false, unlockHint: 'Requires a party', requiresParty: true },
  ],
  newlab: [
    { id: 'n-visit', label: 'New Lab Tour', type: 'visit', icon: '🏭', xp: 120, unlocked: true, completed: false, unlockHint: '' },
    { id: 'n-workshop', label: '3D Printing Workshop', type: 'workshop', icon: '🖨️', xp: 200, unlocked: true, completed: false, unlockHint: '' },
    { id: 'n-mentor', label: 'Engineer Shadowing', type: 'mentorship', icon: '⚙️', xp: 300, unlocked: false, completed: false, unlockHint: 'Reach Level 2', requiresLevel: 2 },
    { id: 'n-challenge', label: 'Build Competition', type: 'challenge', icon: '🏆', xp: 500, unlocked: false, completed: false, unlockHint: 'Requires a party of 2+', requiresParty: true },
  ],
};

const genericActivities = (orgId: string, xpBase: number): OrgActivity[] => [
  { id: `${orgId}-visit`, label: 'Site Visit', type: 'visit', icon: '🏢', xp: xpBase, unlocked: true, completed: false, unlockHint: '' },
  { id: `${orgId}-workshop`, label: 'Workshop', type: 'workshop', icon: '💡', xp: Math.round(xpBase * 1.5), unlocked: false, completed: false, unlockHint: 'Complete the visit first' },
  { id: `${orgId}-mentor`, label: 'Mentorship Session', type: 'mentorship', icon: '🧑‍💼', xp: Math.round(xpBase * 2), unlocked: false, completed: false, unlockHint: 'Reach Level 3', requiresLevel: 3 },
];

export function getOrgActivities(orgId: string, xpBase = 100): OrgActivity[] {
  return defaultActivities[orgId] || genericActivities(orgId, xpBase);
}

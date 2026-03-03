import { type BulletinNote } from '@/data/bulletinData';
import { type Player } from '@/data/mockData';

export function scoreNote(note: BulletinNote, viewer: Player): number {
  let score = 0.5;

  if (note.targetVibes.length > 0 && note.targetVibes.includes(viewer.vibe)) {
    score += 0.25;
  }

  if (note.authorVibe === viewer.vibe) {
    score += 0.05;
  }

  const inRange =
    (!note.targetMinLevel || viewer.level >= note.targetMinLevel) &&
    (!note.targetMaxLevel || viewer.level <= note.targetMaxLevel);
  score += inRange ? 0.1 : -0.3;

  const ageDays =
    (Date.now() - new Date(note.createdAt).getTime()) / 86_400_000;
  score += Math.max(0, 0.1 * (1 - ageDays / 30));

  score += Math.min(0.1, 0.1 * (Math.log2(note.likes + 1) / 5));

  if (note.pinned) score += 0.15;

  if (note.authorRole === 'mentor' || note.authorRole === 'employer') {
    score += 0.05;
  }

  return Math.min(1.0, Math.max(0, score));
}

export function sortNotesForYou(
  notes: BulletinNote[],
  viewer: Player,
): BulletinNote[] {
  const visible = notes.filter(
    (n) => !n.targetMinLevel || viewer.level >= n.targetMinLevel,
  );

  const pinned = visible.filter((n) => n.pinned);
  const rest = visible.filter((n) => !n.pinned);

  rest.sort((a, b) => scoreNote(b, viewer) - scoreNote(a, viewer));

  return [...pinned, ...rest];
}

export function sortNotesAll(notes: BulletinNote[]): BulletinNote[] {
  const pinned = notes.filter((n) => n.pinned);
  const rest = notes
    .filter((n) => !n.pinned)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  return [...pinned, ...rest];
}

export function isVibeMatch(note: BulletinNote, viewer: Player): boolean {
  return note.targetVibes.length > 0 && note.targetVibes.includes(viewer.vibe);
}

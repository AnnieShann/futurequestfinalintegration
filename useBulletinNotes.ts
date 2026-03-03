import { useState, useMemo, useCallback } from 'react';
import {
  type BulletinNote,
  type PostItColor,
  type NoteCategory,
  getNotesForOrg,
  getNoteCount,
} from '@/data/bulletinData';
import { maya } from '@/data/mockData';
import { sortNotesForYou, sortNotesAll } from './useBulletinPersonalization';

const POST_IT_COLORS: PostItColor[] = [
  'yellow', 'pink', 'blue', 'green', 'orange', 'purple',
];

function randomRotation(): number {
  return Math.round((Math.random() * 6 - 3) * 10) / 10;
}

export function useBulletinNotes(orgId: string) {
  const [localNotes, setLocalNotes] = useState<BulletinNote[]>([]);
  const [mode, setMode] = useState<'foryou' | 'all'>('foryou');

  const baseNotes = useMemo(() => getNotesForOrg(orgId), [orgId]);
  const allNotes = useMemo(
    () => [...baseNotes, ...localNotes],
    [baseNotes, localNotes],
  );

  const sortedNotes = useMemo(() => {
    if (mode === 'foryou') return sortNotesForYou(allNotes, maya);
    return sortNotesAll(allNotes);
  }, [allNotes, mode]);

  const noteCount = useMemo(
    () => getNoteCount(orgId) + localNotes.length,
    [orgId, localNotes],
  );

  const addNote = useCallback(
    (body: string, category: NoteCategory, color: PostItColor, opts?: {
      linkUrl?: string;
      linkLabel?: string;
      targetVibes?: string[];
      sticker?: string;
    }) => {
      const note: BulletinNote = {
        id: `local-${Date.now()}`,
        orgId,
        orgType: 'quest',
        authorId: maya.id,
        authorName: maya.name.split(' ')[0] + ' ' + maya.name.split(' ')[1]?.[0] + '.',
        authorRole: 'student',
        authorVibe: maya.vibe,
        body,
        category,
        linkUrl: opts?.linkUrl,
        linkLabel: opts?.linkLabel,
        targetVibes: (opts?.targetVibes || []) as BulletinNote['targetVibes'],
        createdAt: new Date().toISOString(),
        pinned: false,
        likes: 0,
        likedByIds: [],
        color,
        rotation: randomRotation(),
        sticker: opts?.sticker,
      };
      setLocalNotes((prev) => [note, ...prev]);
    },
    [orgId],
  );

  const toggleLike = useCallback((noteId: string) => {
    setLocalNotes((prev) =>
      prev.map((n) => {
        if (n.id !== noteId) return n;
        const liked = n.likedByIds.includes(maya.id);
        return {
          ...n,
          likes: liked ? n.likes - 1 : n.likes + 1,
          likedByIds: liked
            ? n.likedByIds.filter((id) => id !== maya.id)
            : [...n.likedByIds, maya.id],
        };
      }),
    );
  }, []);

  return {
    notes: sortedNotes,
    noteCount,
    mode,
    setMode,
    addNote,
    toggleLike,
    POST_IT_COLORS,
  };
}

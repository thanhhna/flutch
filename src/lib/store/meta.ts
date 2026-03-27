import { writable, get } from 'svelte/store';
import type { AppMeta } from '$lib/srs/types';
import { DEFAULT_META } from '$lib/srs/types';

const STORAGE_KEY = 'dutch_srs_meta';

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function loadMeta(): AppMeta {
  if (typeof localStorage === 'undefined') return { ...DEFAULT_META };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_META };
    return { ...DEFAULT_META, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_META };
  }
}

function saveMeta(meta: AppMeta) {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(meta));
  } catch (e) {
    console.warn('localStorage full, could not save meta', e);
  }
}

function createMetaStore() {
  const { subscribe, update, set } = writable<AppMeta>(loadMeta());

  return {
    subscribe,

    /** Call when the app loads to update streak */
    checkStreak() {
      update(meta => {
        const t = today();
        if (meta.lastStudyDate === t) return meta;
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yStr = yesterday.toISOString().slice(0, 10);
        const streak = meta.lastStudyDate === yStr ? meta.streak : 0;
        const next = { ...meta, streak };
        saveMeta(next);
        return next;
      });
    },

    recordSession(reviewCount: number, newCount: number) {
      update(meta => {
        const t = today();
        const wasToday = meta.lastStudyDate === t;
        const streak = wasToday ? meta.streak : meta.streak + 1;
        const dailyNewCards = {
          ...meta.dailyNewCards,
          [t]: (meta.dailyNewCards[t] ?? 0) + newCount,
        };
        const reviewHistory = {
          ...meta.reviewHistory,
          [t]: (meta.reviewHistory[t] ?? 0) + reviewCount,
        };
        const next = {
          ...meta,
          streak,
          lastStudyDate: t,
          totalReviews: meta.totalReviews + reviewCount,
          dailyNewCards,
          reviewHistory,
        };
        saveMeta(next);
        return next;
      });
    },

    countNewCardsTodayFor(cardId: string): number {
      // tracked at session level; expose meta for daily budget check
      const meta = get({ subscribe });
      const t = today();
      return meta.dailyNewCards[t] ?? 0;
    },

    setNewCardsPerSession(n: number) {
      update(meta => {
        const next = { ...meta, newCardsPerSession: n };
        saveMeta(next);
        return next;
      });
    },

    setDisabledCardTypes(types: AppMeta['disabledCardTypes']) {
      update(meta => {
        const next = { ...meta, disabledCardTypes: types };
        saveMeta(next);
        return next;
      });
    },

    reset() {
      const fresh = { ...DEFAULT_META };
      saveMeta(fresh);
      set(fresh);
    },

    reload() {
      set(loadMeta());
    },
  };
}

export const metaStore = createMetaStore();

/** Returns today's date string "YYYY-MM-DD" */
export function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

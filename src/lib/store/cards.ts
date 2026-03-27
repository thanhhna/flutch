import { writable } from 'svelte/store';
import type { CardsStore, CardSchedule } from '$lib/srs/types';

const STORAGE_KEY = 'dutch_srs_cards';

function loadCards(): CardsStore {
  if (typeof localStorage === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveCards(store: CardsStore) {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (e) {
    console.warn('localStorage full, could not save cards', e);
  }
}

function createCardsStore() {
  const { subscribe, update, set } = writable<CardsStore>(loadCards());

  return {
    subscribe,
    updateCard(id: string, schedule: CardSchedule) {
      update(store => {
        const next = { ...store, [id]: schedule };
        saveCards(next);
        return next;
      });
    },
    reset() {
      const empty: CardsStore = {};
      saveCards(empty);
      set(empty);
    },
    exportJSON(): string {
      let current: CardsStore = {};
      const unsub = subscribe(s => { current = s; });
      unsub();
      return JSON.stringify(current, null, 2);
    },
    importJSON(json: string) {
      try {
        const data = JSON.parse(json) as CardsStore;
        saveCards(data);
        set(data);
      } catch {
        throw new Error('Invalid JSON');
      }
    },
    reload() {
      set(loadCards());
    },
  };
}

export const cardsStore = createCardsStore();

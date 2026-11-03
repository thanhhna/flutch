import { writable } from "svelte/store";
import type { WritingStore } from "$lib/writing/types";

const STORAGE_KEY = "dutch_writing";

function loadWriting(): WritingStore {
  if (typeof localStorage === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveWriting(store: WritingStore) {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (e) {
    console.warn("localStorage full, could not save writing", e);
  }
}

function createWritingStore() {
  const { subscribe, update, set } = writable<WritingStore>(loadWriting());

  return {
    subscribe,
    record(id: string, text: string, covered: number, ready: boolean) {
      update((store) => {
        const prev = store[id];
        const next = {
          ...store,
          [id]: {
            attempts: (prev?.attempts ?? 0) + 1,
            best: Math.max(prev?.best ?? 0, covered),
            last: text,
            lastDate: new Date().toISOString().slice(0, 10),
            ready: (prev?.ready ?? false) || ready,
          },
        };
        saveWriting(next);
        return next;
      });
    },
    reset() {
      saveWriting({});
      set({});
    },
    reload() {
      set(loadWriting());
    },
  };
}

export const writingStore = createWritingStore();

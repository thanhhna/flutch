// ─── Vocabulary entry types ───────────────────────────────────────────────────

export interface NounEntry {
  id: string;
  category: 'noun';
  article: 'de' | 'het';
  dutch: string;
  english: string;
}

export interface VerbEntry {
  id: string;
  category: 'verb';
  dutch: string;
  infinitive: string;
  presentPerfect: string;
  pastSingular: string;
  pastPlural: string;
  english: string;
}

export interface AdjectiveEntry {
  id: string;
  category: 'adjective';
  dutch: string;
  english: string;
}

export interface PrepositionEntry {
  id: string;
  category: 'preposition';
  dutch: string;
  english: string;
  group: string; // place | direction | time
}

export type VocabEntry = NounEntry | VerbEntry | AdjectiveEntry | PrepositionEntry;

export interface Vocabulary {
  nouns: NounEntry[];
  verbs: VerbEntry[];
  adjectives: AdjectiveEntry[];
  prepositions: PrepositionEntry[];
}

// ─── Card types ───────────────────────────────────────────────────────────────

export type CardType =
  | 'noun:nl_en'
  | 'noun:en_nl'
  | 'noun:article'
  | 'verb:inf_en'
  | 'adj:nl_en'
  | 'adj:en_nl'
  | 'prep:nl_en';

export interface Card {
  id: string;           // e.g. "noun_aardappel:nl_en"
  vocabId: string;      // e.g. "noun_aardappel"
  type: CardType;
  entry: VocabEntry;
}

// ─── SRS scheduling ───────────────────────────────────────────────────────────

export interface CardSchedule {
  repetitions: number;   // SM-2 rep count; 0 = unseen/failed
  easeFactor: number;    // starts 2.5, min 1.3
  interval: number;      // days until next review (0 during learning)
  nextReview: number;    // Unix ms timestamp
  lapses: number;        // times rated Again after first graduation
  learningStep: number;  // 0 = graduated, 1 = 1-min step, 2 = 10-min step
  lastReviewed: number;  // Unix ms timestamp
}

// Record<cardId, CardSchedule>; absent = unseen/new
export type CardsStore = Record<string, CardSchedule>;

// ─── App metadata ─────────────────────────────────────────────────────────────

export interface AppMeta {
  version: number;
  streak: number;
  lastStudyDate: string;                    // "YYYY-MM-DD"
  totalReviews: number;
  newCardsPerSession: number;               // default 20
  dailyNewCards: Record<string, number>;    // date → count introduced today (stats only)
  reviewHistory: Record<string, number>;    // date → total reviews that day
  disabledCardTypes: CardType[];
}

export const DEFAULT_META: AppMeta = {
  version: 1,
  streak: 0,
  lastStudyDate: '',
  totalReviews: 0,
  newCardsPerSession: 20,
  dailyNewCards: {},
  reviewHistory: {},
  disabledCardTypes: [],
};

// ─── Rating ───────────────────────────────────────────────────────────────────

export type Rating = 1 | 2 | 3 | 4; // Again | Hard | Good | Easy

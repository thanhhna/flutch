import type { Card, CardType, Vocabulary, VocabEntry, NounEntry, VerbEntry, AdjectiveEntry, PrepositionEntry } from '$lib/srs/types';

export function generateCards(vocab: Vocabulary): Card[] {
  const cards: Card[] = [];

  for (const noun of vocab.nouns) {
    cards.push(card(`${noun.id}:nl_en`, noun.id, 'noun:nl_en', noun));
    cards.push(card(`${noun.id}:en_nl`, noun.id, 'noun:en_nl', noun));
    cards.push(card(`${noun.id}:article`, noun.id, 'noun:article', noun));
  }

  for (const verb of vocab.verbs) {
    cards.push(card(`${verb.id}:inf_en`, verb.id, 'verb:inf_en', verb));
  }

  for (const adj of vocab.adjectives) {
    cards.push(card(`${adj.id}:nl_en`, adj.id, 'adj:nl_en', adj));
    cards.push(card(`${adj.id}:en_nl`, adj.id, 'adj:en_nl', adj));
  }

  for (const prep of vocab.prepositions) {
    cards.push(card(`${prep.id}:nl_en`, prep.id, 'prep:nl_en', prep));
  }

  return cards;
}

function card(id: string, vocabId: string, type: CardType, entry: VocabEntry): Card {
  return { id, vocabId, type, entry };
}

/** Returns a stable ordered list of all card IDs — order determines intro sequence */
export function getAllCardIds(cards: Card[]): string[] {
  return cards.map(c => c.id);
}

/**
 * Returns the correct answer string for a card.
 * Used to build multiple-choice options.
 * Returns null for card types that use self-rating (noun:article).
 */
export function getCardAnswer(card: Card): string | null {
  const e = card.entry;
  switch (card.type) {
    case 'noun:nl_en':  return (e as NounEntry).english;
    case 'noun:en_nl':  return `${(e as NounEntry).article} ${(e as NounEntry).dutch}`;
    case 'verb:inf_en': return (e as VerbEntry).english;
    case 'adj:nl_en':   return (e as AdjectiveEntry).english;
    case 'adj:en_nl':   return (e as AdjectiveEntry).dutch;
    case 'prep:nl_en':  return (e as PrepositionEntry).english;
    // noun:article uses de/het buttons instead of MC:
    case 'noun:article':
      return null;
    default:
      return null;
  }
}

/**
 * Returns `count` distractor answer strings for a card.
 * Distractors are drawn from the same card-type pool, shuffled, deduplicated.
 */
export function getDistractors(card: Card, allCards: Card[], count = 3): string[] {
  const correctAnswer = getCardAnswer(card);
  if (correctAnswer === null) return [];

  const pool = allCards.filter(c =>
    c.type === card.type &&
    c.entry.id !== card.entry.id
  );

  // Shuffle deterministically based on correct answer + pool length to avoid
  // complete re-randomisation on every render (stable within a session)
  const shuffled = shuffleArray(pool, correctAnswer);

  const distractors: string[] = [];
  const seen = new Set([correctAnswer.toLowerCase()]);

  for (const c of shuffled) {
    if (distractors.length >= count) break;
    const ans = getCardAnswer(c);
    if (!ans) continue;
    const key = ans.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    distractors.push(ans);
  }

  return distractors;
}

/** Fisher-Yates shuffle seeded by a string (for stable-per-card options) */
function shuffleArray<T>(arr: T[], seed: string): T[] {
  const copy = [...arr];
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  }
  for (let i = copy.length - 1; i > 0; i--) {
    h = (Math.imul(h, 1664525) + 1013904223) | 0;
    const j = Math.abs(h) % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Returns 4 shuffled options (correct + distractors) for a multiple-choice card.
 * Returns null for card types that don't use MC (noun:article).
 */
export function getOptions(card: Card, allCards: Card[]): string[] | null {
  const correct = getCardAnswer(card);
  if (correct === null) return null;

  const distractors = getDistractors(card, allCards, 3);
  const options = [correct, ...distractors];

  // Shuffle options so correct isn't always first
  return shuffleArray(options, correct + card.id);
}

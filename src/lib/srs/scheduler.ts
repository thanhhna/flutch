/**
 * Builds the session card queue.
 *
 * Priority:
 * 1. Cards currently in learning steps that are due (nextReview <= now)
 * 2. Graduated cards due for review (nextReview <= now), most-overdue first
 * 3. New cards (up to daily budget)
 *
 * Returns an array of card IDs in session order (learning interleaved with new).
 */

import type { Card, CardsStore, AppMeta } from '$lib/srs/types';

const MAX_REVIEWS_PER_SESSION = 80;

export function buildSessionQueue(
  allCards: Card[],
  cardSchedules: CardsStore,
  meta: AppMeta,
  now: number
): string[] {
  const disabledSet = new Set(meta.disabledCardTypes);
  const eligible = allCards.filter(c => !disabledSet.has(c.type));

  const learningDue: string[] = [];
  const reviewDue: { id: string; overdue: number }[] = [];
  const newCards: string[] = [];

  for (const card of eligible) {
    const sched = cardSchedules[card.id];
    if (!sched) {
      newCards.push(card.id);
      continue;
    }
    if (sched.learningStep > 0) {
      if (sched.nextReview <= now) {
        learningDue.push(card.id);
      }
      continue;
    }
    if (sched.nextReview <= now) {
      reviewDue.push({ id: card.id, overdue: now - sched.nextReview });
    }
  }

  // Sort reviews most-overdue first
  reviewDue.sort((a, b) => b.overdue - a.overdue);

  const reviews = reviewDue.slice(0, MAX_REVIEWS_PER_SESSION).map(r => r.id);

  // New cards budget: per-session limit, no daily tracking
  const newBatch = shuffle(newCards).slice(0, meta.newCardsPerSession);

  // Interleave: learning first, then reviews + new cards mixed
  return [...learningDue, ...interleave(reviews, newBatch)];
}

/** Mix new cards evenly into the review queue so they're not all at the start */
function interleave(reviews: string[], newCards: string[]): string[] {
  if (newCards.length === 0) return reviews;
  if (reviews.length === 0) return newCards;

  const result: string[] = [];
  const step = Math.max(1, Math.floor(reviews.length / (newCards.length + 1)));
  let ri = 0;
  let ni = 0;

  while (ri < reviews.length || ni < newCards.length) {
    // Add a batch of reviews
    const reviewsThisRound = Math.min(step, reviews.length - ri);
    for (let i = 0; i < reviewsThisRound; i++) {
      result.push(reviews[ri++]);
    }
    // Add one new card
    if (ni < newCards.length) {
      result.push(newCards[ni++]);
    }
  }

  return result;
}

/** Counts for dashboard display */
export interface DueCounts {
  learning: number;
  review: number;
  newAvailable: number;
  newBudget: number;
}

export function getDueCounts(
  allCards: Card[],
  cardSchedules: CardsStore,
  meta: AppMeta,
  now: number
): DueCounts {
  const disabledSet = new Set(meta.disabledCardTypes);
  const eligible = allCards.filter(c => !disabledSet.has(c.type));

  let learning = 0;
  let review = 0;
  let newAvailable = 0;

  for (const card of eligible) {
    const sched = cardSchedules[card.id];
    if (!sched) { newAvailable++; continue; }
    if (sched.learningStep > 0) { if (sched.nextReview <= now) learning++; continue; }
    if (sched.nextReview <= now) review++;
  }

  const newBudget = meta.newCardsPerSession;

  return { learning, review, newAvailable, newBudget: Math.min(newAvailable, newBudget) };
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Category-level progress (% cards with interval >= 21 days) */
export function getCategoryProgress(
  allCards: Card[],
  cardSchedules: CardsStore
): Record<string, { known: number; total: number }> {
  const result: Record<string, { known: number; total: number }> = {};

  for (const card of allCards) {
    const cat = card.entry.category;
    if (!result[cat]) result[cat] = { known: 0, total: 0 };
    result[cat].total++;
    const sched = cardSchedules[card.id];
    if (sched && sched.learningStep === 0 && sched.interval >= 21) {
      result[cat].known++;
    }
  }

  return result;
}

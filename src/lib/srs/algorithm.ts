// Pure SM-2 algorithm — no side effects, fully unit-testable

import type { CardSchedule, Rating } from './types';

const MIN_EASE = 1.3;
const INITIAL_EASE = 2.5;

// Learning step intervals in milliseconds
export const LEARNING_STEPS_MS = [1 * 60 * 1000, 10 * 60 * 1000]; // 1 min, 10 min

export function newSchedule(): CardSchedule {
  return {
    repetitions: 0,
    easeFactor: INITIAL_EASE,
    interval: 0,
    nextReview: 0,
    lapses: 0,
    learningStep: 1, // starts in learning phase, step 1 (1-min)
    lastReviewed: 0,
  };
}

/**
 * Apply a rating to a card schedule and return the updated schedule.
 * now: current time in Unix ms
 */
export function applyRating(schedule: CardSchedule, rating: Rating, now: number): CardSchedule {
  const s = { ...schedule, lastReviewed: now };
  const pass = rating >= 3;

  // ── Learning phase ────────────────────────────────────────────────────────
  if (s.learningStep > 0) {
    if (!pass) {
      // Restart learning steps
      s.learningStep = 1;
      s.nextReview = now + LEARNING_STEPS_MS[0];
      return s;
    }
    // Advance learning step
    if (s.learningStep < 2) {
      s.learningStep = 2;
      s.nextReview = now + LEARNING_STEPS_MS[1];
      return s;
    }
    // Completed both learning steps → graduate
    s.learningStep = 0;
    s.interval = 1;
    s.repetitions = 1;
    s.nextReview = now + daysToMs(1);
    return s;
  }

  // ── Graduated (day-scale) phase ───────────────────────────────────────────
  if (!pass) {
    // Lapse
    s.lapses += 1;
    s.repetitions = 0;
    s.interval = 1;
    s.learningStep = 1; // re-enter learning
    s.nextReview = now + LEARNING_STEPS_MS[0];
    return s;
  }

  // Pass — update ease factor
  s.easeFactor = Math.max(
    MIN_EASE,
    s.easeFactor + 0.1 - (4 - rating) * (0.08 + (4 - rating) * 0.02)
  );

  // Update interval
  if (s.repetitions === 0) {
    s.interval = 1;
  } else if (s.repetitions === 1) {
    s.interval = 6;
  } else {
    s.interval = Math.round(s.interval * s.easeFactor);
  }
  s.repetitions += 1;
  s.nextReview = now + daysToMs(s.interval);

  return s;
}

export function isDue(schedule: CardSchedule | undefined, now: number): boolean {
  if (!schedule) return false;
  return schedule.nextReview <= now;
}

export function isInLearning(schedule: CardSchedule | undefined): boolean {
  return !!schedule && schedule.learningStep > 0;
}

export function isKnown(schedule: CardSchedule | undefined): boolean {
  return !!schedule && schedule.learningStep === 0 && schedule.interval >= 21;
}

function daysToMs(days: number): number {
  return days * 24 * 60 * 60 * 1000;
}

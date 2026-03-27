import { writable, get } from 'svelte/store';
import type { Rating } from '$lib/srs/types';
import { applyRating, newSchedule } from '$lib/srs/algorithm';
import { cardsStore } from './cards';
import { metaStore } from './meta';

// 'answered'   = MC option was chosen, showing correct/wrong feedback before advancing
// 'revealed'   = verb:conj self-reveal phase (show conjugation, then yes/no)
// 'goal_done'  = daily goal reached; user can continue with more words or go home
export type SessionPhase = 'idle' | 'front' | 'answered' | 'revealed' | 'goal_done' | 'summary';

export interface SessionState {
  phase: SessionPhase;
  queue: string[];
  currentIndex: number;
  goalTotal: number;    // size of initial queue — hitting this triggers goal_done
  totalCards: number;   // may grow if re-shows are added
  cardId: string | null;
  reviewedCount: number;
  newCount: number;
  againCount: number;
  selectedOption: string | null;
  correctAnswer: string | null;
  wasCorrect: boolean | null;
  goalBatch: number;    // 1 = first goal, 2+ = subsequent batches
  isExtra: boolean;     // true = extra session beyond daily goal (no "goal complete" messaging)
}

function initial(): SessionState {
  return {
    phase: 'idle',
    queue: [],
    currentIndex: 0,
    goalTotal: 0,
    totalCards: 0,
    cardId: null,
    reviewedCount: 0,
    newCount: 0,
    againCount: 0,
    selectedOption: null,
    correctAnswer: null,
    wasCorrect: null,
    goalBatch: 0,
    isExtra: false,
  };
}

function createSessionStore() {
  const { subscribe, update, set } = writable<SessionState>(initial());

  function advanceCard(s: SessionState, rating: Rating): SessionState {
    if (!s.cardId) return s;

    const schedules = get(cardsStore);
    const existing = schedules[s.cardId];
    const isNew = !existing;

    const schedule = applyRating(existing ?? newSchedule(), rating, Date.now());
    cardsStore.updateCard(s.cardId, schedule);

    let nextQueue = s.queue.slice(1);

    // Re-queue learning-step cards if they're due within this session window
    if (schedule.learningStep > 0) {
      const withinSession = schedule.nextReview - Date.now() < 35 * 60 * 1000;
      if (withinSession) {
        nextQueue = [...nextQueue, s.cardId!];
      }
    }

    const nextCardId = nextQueue[0] ?? null;
    const newIndex = s.currentIndex + 1;
    const goalMet = newIndex >= s.goalTotal;
    const queueEmpty = nextCardId === null;

    let phase: SessionPhase;
    if (queueEmpty) {
      phase = 'summary';
    } else if (goalMet) {
      phase = 'goal_done';
    } else {
      phase = 'front';
    }

    // When the daily goal is met, graduate any leftover learning-step cards
    // in the queue to interval=1 day so they don't show as immediately due
    // on the home screen the moment the user leaves.
    if (goalMet && !queueEmpty) {
      const tomorrow = Date.now() + 24 * 60 * 60 * 1000;
      const currentSchedules = get(cardsStore);
      for (const id of nextQueue) {
        const sched = currentSchedules[id];
        if (sched && sched.learningStep > 0) {
          cardsStore.updateCard(id, {
            ...sched,
            learningStep: 0,
            interval: 1,
            nextReview: tomorrow,
          });
        }
      }
    }

    const next: SessionState = {
      ...s,
      phase,
      queue: nextQueue,
      cardId: nextCardId,
      currentIndex: newIndex,
      reviewedCount: s.reviewedCount + 1,
      newCount: s.newCount + (isNew ? 1 : 0),
      againCount: s.againCount + (rating === 1 ? 1 : 0),
      selectedOption: null,
      correctAnswer: null,
      wasCorrect: null,
      goalBatch: phase === 'goal_done' ? s.goalBatch + 1 : s.goalBatch,
    };

    if (phase === 'goal_done' || phase === 'summary') {
      metaStore.recordSession(next.reviewedCount, next.newCount);
    }

    return next;
  }

  return {
    subscribe,

    start(queue: string[], isExtra = false) {
      set({
        ...initial(),
        phase: 'front',
        queue: [...queue],
        goalTotal: queue.length,
        totalCards: queue.length,
        cardId: queue[0] ?? null,
        isExtra,
      });
    },

    /** Called when user picks a MC option. Transitions to 'answered' phase. */
    selectOption(chosenAnswer: string, correctAnswer: string) {
      const wasCorrect = chosenAnswer === correctAnswer;
      update(s => ({
        ...s,
        phase: 'answered',
        selectedOption: chosenAnswer,
        correctAnswer,
        wasCorrect,
      }));
    },

    /** Called after seeing MC feedback — applies rating and moves to next card. */
    confirmAnswer() {
      update(s => {
        const rating: Rating = s.wasCorrect ? 3 : 1;
        return advanceCard(s, rating);
      });
    },

    /** For verb:conj / noun:article: reveal the answer first */
    revealAnswer() {
      update(s => ({ ...s, phase: 'revealed' }));
    },

    /** For verb:conj / noun:article: user says whether they knew it */
    selfRate(knew: boolean) {
      update(s => advanceCard(s, knew ? 3 : 1));
    },

    /** Continue from goal_done: extend with more new cards */
    continueSession(additionalQueue: string[]) {
      update(s => ({
        ...s,
        phase: additionalQueue.length > 0 ? 'front' : 'summary',
        queue: additionalQueue,
        goalTotal: s.currentIndex + additionalQueue.length,
        totalCards: s.totalCards + additionalQueue.length,
        cardId: additionalQueue[0] ?? null,
      }));
    },

    pause() {
      update(s => {
        if (s.reviewedCount > 0) {
          metaStore.recordSession(s.reviewedCount, s.newCount);
        }
        return { ...s, phase: 'idle' };
      });
    },

    reset() {
      set(initial());
    },
  };
}

export const sessionStore = createSessionStore();

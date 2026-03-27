<script lang="ts">
  import { onMount, tick } from "svelte";
  import { goto } from "$app/navigation";
  import { get } from "svelte/store";
  import vocabulary from "$lib/data/vocabulary.json";
  import { cardsStore } from "$lib/store/cards";
  import { metaStore } from "$lib/store/meta";
  import ProgressBar from "$lib/components/ProgressBar.svelte";
  import type {
    NounEntry,
    VerbEntry,
    AdjectiveEntry,
    PrepositionEntry,
    Vocabulary,
    CardSchedule,
  } from "$lib/srs/types";

  type TestItem = {
    prompt: string; // English shown to user
    expected: string; // normalized correct Dutch answer
    displayAnswer: string; // correct answer shown on reveal
    cardId: string; // card to mark known on correct
    needsArticle: boolean;
    category: string;
  };

  function shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function isKnown(
    cardId: string,
    schedules: Record<string, CardSchedule>,
  ): boolean {
    const s = schedules[cardId];
    return !!s && s.learningStep === 0 && s.interval >= 21;
  }

  function buildItems(limit: number): TestItem[] {
    const vocab = vocabulary as unknown as Vocabulary;
    const schedules = get(cardsStore);
    const items: TestItem[] = [];

    for (const e of vocab.nouns) {
      const cardId = `noun_${e.dutch}:en_nl`;
      if (isKnown(cardId, schedules)) continue;
      items.push({
        prompt: e.english,
        expected: `${e.article} ${e.dutch}`.toLowerCase(),
        displayAnswer: `${e.article} ${e.dutch}`,
        cardId,
        needsArticle: true,
        category: "noun",
      });
    }
    for (const e of vocab.verbs) {
      const cardId = `verb_${e.dutch}:inf_en`;
      if (isKnown(cardId, schedules)) continue;
      items.push({
        prompt: e.english,
        expected: e.dutch.toLowerCase(),
        displayAnswer: e.dutch,
        cardId,
        needsArticle: false,
        category: "verb",
      });
    }
    for (const e of vocab.adjectives) {
      const cardId = `adj_${e.dutch}:en_nl`;
      if (isKnown(cardId, schedules)) continue;
      items.push({
        prompt: e.english,
        expected: e.dutch.toLowerCase(),
        displayAnswer: e.dutch,
        cardId,
        needsArticle: false,
        category: "adjective",
      });
    }
    for (const e of vocab.prepositions) {
      const cardId = `prep_${e.dutch}:nl_en`;
      if (isKnown(cardId, schedules)) continue;
      items.push({
        prompt: e.english,
        expected: e.dutch.toLowerCase(),
        displayAnswer: e.dutch,
        cardId,
        needsArticle: false,
        category: "preposition",
      });
    }

    return shuffle(items).slice(0, limit);
  }

  type Phase = "front" | "answered" | "summary";

  let phase = $state<Phase>("front");
  let items = $state<TestItem[]>([]);
  let sessionItems: TestItem[] = [];
  let currentIndex = $state(0);
  let userInput = $state("");
  let wasCorrect = $state<boolean | null>(null);
  let correctCount = $state(0);

  let current = $derived(items[currentIndex]);

  let inputEl: HTMLInputElement;

  onMount(() => {
    const meta = get(metaStore);
    items = buildItems(meta.newCardsPerSession);
    if (items.length === 0) {
      goto("/");
      return;
    }
    sessionItems = [...items];
    focusInput();
  });

  async function focusInput() {
    await tick();
    inputEl?.focus();
  }

  function normalize(s: string) {
    return s.trim().toLowerCase().replace(/\s+/g, " ");
  }

  function submit() {
    if (phase !== "front" || !current || !userInput.trim()) return;
    const correct = normalize(userInput) === normalize(current.expected);
    wasCorrect = correct;
    phase = "answered";

    if (correct) {
      correctCount++;
      const schedules = get(cardsStore);
      const existing = schedules[current.cardId];
      if (!existing || existing.interval < 21) {
        const known: CardSchedule = {
          interval: 21,
          easeFactor: 2.5,
          repetitions: 5,
          learningStep: 0,
          nextReview: Date.now() + 21 * 24 * 60 * 60 * 1000,
          lapses: existing?.lapses ?? 0,
          lastReviewed: Date.now(),
        };
        cardsStore.updateCard(current.cardId, known);
      }
    }
  }

  function next() {
    if (currentIndex + 1 >= items.length) {
      phase = "summary";
    } else {
      currentIndex++;
      userInput = "";
      wasCorrect = null;
      phase = "front";
      focusInput();
    }
  }

  function newTest() {
    const meta = get(metaStore);
    const next = buildItems(meta.newCardsPerSession);
    if (next.length === 0) { goto("/"); return; }
    items = next;
    sessionItems = [...next];
    currentIndex = 0;
    userInput = "";
    wasCorrect = null;
    correctCount = 0;
    phase = "front";
    focusInput();
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      goto("/");
      return;
    }
    if (phase === "front" && e.key === "1") {
      e.preventDefault();
      next();
    } else if (phase === "front" && e.key === "Enter") {
      e.preventDefault();
      submit();
    } else if (phase === "answered" && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      next();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="test-page">
  {#if phase === "summary"}
    <div class="summary">
      <div class="summary-icon">
        {correctCount === items.length ? "🏆" : "📝"}
      </div>
      <h1>Test complete!</h1>
      <p class="summary-sub">{correctCount} / {items.length} correct</p>

      <div class="summary-stats">
        <div class="stat">
          <span class="stat-num correct">{correctCount}</span>
          <span class="stat-label">Correct</span>
        </div>
        <div class="stat">
          <span class="stat-num wrong">{items.length - correctCount}</span>
          <span class="stat-label">Wrong</span>
        </div>
      </div>

      <div class="summary-actions">
        <button class="primary-btn" onclick={newTest}>New Test</button>
        <button class="secondary-btn" onclick={() => goto("/")}
          >Back to Home</button
        >
      </div>
    </div>
  {:else if current}
    <div class="session-header">
      <a href="/" class="back-link">← Exit</a>
      <div class="progress-wrap">
        <ProgressBar current={currentIndex} total={items.length} />
      </div>
      <span class="badge">{current.category}</span>
    </div>

    <div class="card-area">
      <div
        class="card"
        class:correct={phase === "answered" && wasCorrect === true}
        class:wrong={phase === "answered" && wasCorrect === false}
      >
        <div class="prompt">
          <span class="english">{current.prompt}</span>
          {#if current.needsArticle}
            <span class="hint">include the article (de / het)</span>
          {/if}
        </div>

        <div class="input-row">
          <input
            bind:this={inputEl}
            bind:value={userInput}
            class="answer-input"
            class:input-correct={phase === "answered" && wasCorrect === true}
            class:input-wrong={phase === "answered" && wasCorrect === false}
            placeholder={current.needsArticle ? "de/het …" : "Answer…"}
            disabled={phase === "answered"}
            autocomplete="off"
            autocorrect="off"
            autocapitalize="off"
            spellcheck="false"
          />
          {#if phase === "front"}
            <button class="submit-btn" onclick={submit} disabled={!userInput.trim()}>Check</button>
          {/if}
        </div>

        {#if phase === "front"}
          <button class="skip-btn" onclick={next}>Skip (press 1)</button>
        {:else}
          <div
            class="feedback"
            class:correct={wasCorrect === true}
            class:wrong={wasCorrect === false}
          >
            {#if wasCorrect}
              <span class="verdict">✓ Correct!</span>
            {:else}
              <span class="verdict">✗ Wrong</span>
              <span class="correct-answer">Answer: <strong>{current.displayAnswer}</strong></span>
            {/if}
          </div>

          <button class="next-btn" onclick={next}>
            {currentIndex + 1 >= items.length ? "See results" : "Next →"}
          </button>
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
  .test-page {
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
    gap: 1.5rem;
    background: var(--color-bg);
  }

  .session-header {
    width: 100%;
    max-width: 560px;
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .back-link {
    text-decoration: none;
    color: var(--color-muted);
    font-size: 0.9rem;
    white-space: nowrap;
    transition: color 0.15s;
  }
  .back-link:hover {
    color: var(--color-text);
  }

  .progress-wrap {
    flex: 1;
    padding-top: 1.5rem;
  }

  .badge {
    font-size: 0.7rem;
    font-weight: 600;
    color: var(--color-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    white-space: nowrap;
  }

  .card-area {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  }

  .card {
    width: 100%;
    max-width: 560px;
    background: var(--color-surface);
    border-radius: 20px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 2.5rem 2rem 2rem;
    border: 2px solid transparent;
    transition:
      border-color 0.2s,
      box-shadow 0.2s;
  }

  .card.correct {
    border-color: var(--color-good);
    box-shadow: 0 4px 24px rgba(34, 197, 94, 0.15);
  }
  .card.wrong {
    border-color: var(--color-again);
    box-shadow: 0 4px 24px rgba(239, 68, 68, 0.15);
  }

  .prompt {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    text-align: center;
  }

  .english {
    font-size: 2.4rem;
    font-weight: 700;
    color: var(--color-text);
  }

  .hint {
    font-size: 0.8rem;
    color: var(--color-muted);
  }

  .input-row {
    display: flex;
    gap: 0.75rem;
  }

  .answer-input {
    flex: 1;
    padding: 0.85rem 1rem;
    font-size: 1.1rem;
    font-family: inherit;
    border: 2px solid var(--color-border);
    border-radius: 12px;
    background: var(--color-bg);
    color: var(--color-text);
    outline: none;
    transition: border-color 0.15s;
  }

  .answer-input:focus {
    border-color: var(--color-accent);
  }
  .answer-input.input-correct {
    border-color: var(--color-good);
    background: #f0fdf4;
  }
  .answer-input.input-wrong {
    border-color: var(--color-again);
    background: #fef2f2;
  }

  .submit-btn {
    padding: 0.85rem 1.25rem;
    border: none;
    border-radius: 12px;
    background: var(--color-accent);
    color: white;
    font-size: 1rem;
    font-weight: 600;
    font-family: inherit;
    cursor: pointer;
    transition: opacity 0.15s;
    white-space: nowrap;
  }

  .submit-btn:disabled {
    opacity: 0.4;
    cursor: default;
  }
  .submit-btn:not(:disabled):hover {
    opacity: 0.88;
  }

  .feedback {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.35rem;
    padding: 0.75rem 1rem;
    border-radius: 12px;
    text-align: center;
  }

  .feedback.correct {
    background: #f0fdf4;
  }
  .feedback.wrong {
    background: #fef2f2;
  }

  .verdict {
    font-size: 1.1rem;
    font-weight: 700;
  }

  .feedback.correct .verdict {
    color: var(--color-good);
  }
  .feedback.wrong .verdict {
    color: var(--color-again);
  }

  .correct-answer {
    font-size: 1rem;
    color: var(--color-text);
  }

  .skip-btn {
    padding: 0.5rem 1rem;
    border: 1px solid var(--color-border);
    border-radius: 10px;
    background: transparent;
    color: var(--color-muted);
    font-size: 0.85rem;
    font-family: inherit;
    cursor: pointer;
    align-self: center;
    transition: color 0.15s, border-color 0.15s;
  }

  .skip-btn:hover { color: var(--color-text); border-color: var(--color-text); }

  .next-btn {
    padding: 0.85rem;
    border: none;
    border-radius: 12px;
    background: var(--color-accent);
    color: white;
    font-size: 1rem;
    font-weight: 600;
    font-family: inherit;
    cursor: pointer;
    transition: opacity 0.15s;
  }

  .next-btn:hover {
    opacity: 0.88;
  }

  /* Summary */
  .summary {
    margin: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    text-align: center;
    max-width: 400px;
    width: 100%;
    padding: 1rem;
  }

  .summary-icon {
    font-size: 4rem;
  }
  .summary h1 {
    font-size: 2rem;
    margin: 0;
  }
  .summary-sub {
    margin: 0;
    color: var(--color-muted);
    font-size: 1.1rem;
  }

  .summary-stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    width: 100%;
  }

  .stat {
    background: var(--color-surface);
    border-radius: 16px;
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .stat-num {
    font-size: 2.5rem;
    font-weight: 700;
  }

  .stat-num.correct {
    color: var(--color-good);
  }
  .stat-num.wrong {
    color: var(--color-again);
  }

  .stat-label {
    font-size: 0.85rem;
    color: var(--color-muted);
    font-weight: 500;
  }

  .summary-actions {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    width: 100%;
  }

  .primary-btn {
    background: var(--color-accent);
    color: white;
    border: none;
    border-radius: 12px;
    padding: 1rem;
    font-size: 1.05rem;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    width: 100%;
    transition: opacity 0.15s;
  }

  .primary-btn:hover {
    opacity: 0.88;
  }

  .secondary-btn {
    background: var(--color-surface);
    color: var(--color-text);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    padding: 1rem;
    font-size: 1.05rem;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    width: 100%;
    transition: background 0.15s;
  }

  .secondary-btn:hover {
    background: var(--color-surface-alt);
  }
</style>

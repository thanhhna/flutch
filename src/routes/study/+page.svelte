<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { get } from "svelte/store";
  import vocabulary from "$lib/data/vocabulary.json";
  import {
    generateCards,
    getCardAnswer,
    getOptions,
  } from "$lib/cards/cardTypes";
  import { buildSessionQueue } from "$lib/srs/scheduler";
  import { cardsStore } from "$lib/store/cards";
  import { metaStore } from "$lib/store/meta";
  import { sessionStore } from "$lib/store/session";
  import ProgressBar from "$lib/components/ProgressBar.svelte";
  import NounCard from "$lib/cards/NounCard.svelte";
  import VerbCard from "$lib/cards/VerbCard.svelte";
  import AdjCard from "$lib/cards/AdjCard.svelte";
  import PrepCard from "$lib/cards/PrepCard.svelte";
  import type { Card } from "$lib/srs/types";

  const allCards = generateCards(vocabulary as any);
  const cardMap = new Map<string, Card>(allCards.map((c) => [c.id, c]));

  let session = $derived($sessionStore);
  let currentCard = $derived(
    session.cardId ? cardMap.get(session.cardId) : undefined,
  );
  let currentSchedule = $derived(
    session.cardId ? $cardsStore[session.cardId] : undefined,
  );

  let currentOptions = $derived(
    currentCard ? getOptions(currentCard, allCards) : null,
  );
  let currentAnswer = $derived(currentCard ? getCardAnswer(currentCard) : null);

  let cardPhase = $derived((): "front" | "answered" | "revealed" => {
    if (session.phase === "answered") return "answered";
    if (session.phase === "revealed") return "revealed";
    return "front";
  });

  // How many more new vocab entries are available after daily goal
  let moreNewCards = $derived(
    allCards.filter((c) => !$cardsStore[c.id]).length,
  );

  onMount(() => {
    metaStore.checkStreak();
    if ($sessionStore.phase === "idle") startSession();
  });

  function startSession() {
    const schedules = get(cardsStore);
    const meta = get(metaStore);
    const queue = buildSessionQueue(allCards, schedules, meta, Date.now());
    if (queue.length === 0) {
      goto("/");
      return;
    }
    sessionStore.start(queue);
  }

  function continueWithMore() {
    const schedules = get(cardsStore);
    const meta = get(metaStore);
    const unseen = allCards.filter((c) => !schedules[c.id]).map((c) => c.id);
    const shuffled = unseen
      .sort(() => Math.random() - 0.5)
      .slice(0, meta.newCardsPerSession);
    if (shuffled.length === 0) {
      finishAndGoHome();
      return;
    }
    sessionStore.continueSession(shuffled);
  }

  function handleOptionSelect(chosen: string) {
    if (!currentAnswer) return;
    sessionStore.selectOption(chosen, currentAnswer);
  }

  function handleReveal() {
    sessionStore.revealAnswer();
  }

  function handleSelfRate(knew: boolean) {
    sessionStore.selfRate(knew);
  }

  function handleKeydown(e: KeyboardEvent) {
    if (session.phase === "front" && (e.key === " " || e.key === "Enter")) {
      if (!currentOptions) {
        e.preventDefault();
        handleReveal();
      }
    } else if (session.phase === "answered") {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        sessionStore.confirmAnswer();
      }
    } else if (e.key === "Escape") {
      sessionStore.pause();
      goto("/");
    }
  }

  function finishAndGoHome() {
    sessionStore.reset();
    goto("/");
  }

  // Shared stats block used by both goal_done and summary screens
  function statBlock(num: number, label: string, accent = false) {
    return { num, label, accent };
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="study-page">
  {#if session.phase === "idle"}
    <div class="loading">Loading session…</div>
  {:else if session.phase === "goal_done" || session.phase === "summary"}
    {@const isFinal = session.phase === "summary"}
    {@const isDailyGoal = !session.isExtra && session.goalBatch === 1}
    <div class="summary">
      <div class="summary-icon">
        {isFinal ? "🏆" : isDailyGoal ? "🎉" : "💪"}
      </div>
      <h1>
        {isFinal
          ? "All done!"
          : isDailyGoal
            ? "Today's goal complete!"
            : `+${session.goalTotal} more done!`}
      </h1>
      <p class="summary-sub">
        {isFinal
          ? "You finished every card in the queue."
          : isDailyGoal
            ? `You reviewed ${session.reviewedCount} cards. Great work!`
            : `${session.reviewedCount} cards total — keep it up!`}
      </p>

      <div class="summary-actions">
        {#if !isFinal && moreNewCards > 0}
          <button class="continue-btn" onclick={continueWithMore}>
            Keep going ({moreNewCards} words left)
          </button>
        {/if}
        <button class="home-btn" onclick={finishAndGoHome}>Back to Home</button>
      </div>
    </div>
  {:else if currentCard}
    <div class="session-header">
      <a href="/" class="back-link" onclick={() => sessionStore.pause()}
        >← Pause</a
      >
      <div class="progress-wrap">
        <ProgressBar current={session.currentIndex} total={session.goalTotal} />
      </div>
      <span class="card-type-badge"
        >{currentCard.type.replace(":", " ").replace("_", "→")}</span
      >
    </div>

    <div class="card-area">
      <div
        class="card"
        class:answered={session.phase === "answered" ||
          session.phase === "revealed"}
        class:correct={session.wasCorrect === true}
        class:wrong={session.wasCorrect === false}
      >
        {#if currentCard.entry.category === "noun"}
          <NounCard
            entry={currentCard.entry as any}
            type={currentCard.type}
            phase={cardPhase()}
            schedule={currentSchedule}
            options={currentOptions ?? undefined}
            selectedOption={session.selectedOption}
            correctAnswer={session.correctAnswer}
            onselect={handleOptionSelect}
            onreveal={handleReveal}
            onselfrate={handleSelfRate}
            onwrongarticle={() => sessionStore.selectOption("wrong", "correct")}
          />
        {:else if currentCard.entry.category === "verb"}
          <VerbCard
            entry={currentCard.entry as any}
            type={currentCard.type}
            phase={cardPhase()}
            schedule={currentSchedule}
            options={currentOptions ?? undefined}
            selectedOption={session.selectedOption}
            correctAnswer={session.correctAnswer}
            onselect={handleOptionSelect}
            onreveal={handleReveal}
            onselfrate={handleSelfRate}
          />
        {:else if currentCard.entry.category === "adjective"}
          <AdjCard
            entry={currentCard.entry as any}
            type={currentCard.type}
            phase={cardPhase()}
            schedule={currentSchedule}
            options={currentOptions ?? undefined}
            selectedOption={session.selectedOption}
            correctAnswer={session.correctAnswer}
            onselect={handleOptionSelect}
          />
        {:else if currentCard.entry.category === "preposition"}
          <PrepCard
            entry={currentCard.entry as any}
            type={currentCard.type}
            phase={cardPhase()}
            schedule={currentSchedule}
            options={currentOptions ?? undefined}
            selectedOption={session.selectedOption}
            correctAnswer={session.correctAnswer}
            onselect={handleOptionSelect}
          />
        {/if}

        <button
          class="next-btn"
          class:visible={session.phase === "answered"}
          onclick={() => sessionStore.confirmAnswer()}
          aria-label="Next card"
          tabindex={session.phase === "answered" ? 0 : -1}>Next →</button
        >
      </div>
    </div>
  {/if}
</div>

<style>
  .study-page {
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
    gap: 1.5rem;
    background: var(--color-bg);
  }

  .loading {
    margin: auto;
    color: var(--color-muted);
  }

  .session-header {
    width: 100%;
    max-width: 600px;
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

  .card-type-badge {
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
    position: relative;
    width: 100%;
    max-width: 560px;
    background: var(--color-surface);
    border-radius: 20px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
    min-height: 280px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: center;
    transition:
      box-shadow 0.2s,
      border-color 0.2s;
    border: 2px solid transparent;
  }

  .card.answered.correct {
    border-color: var(--color-good);
    box-shadow: 0 4px 24px rgba(34, 197, 94, 0.15);
  }
  .card.answered.wrong {
    border-color: var(--color-again);
    box-shadow: 0 4px 24px rgba(239, 68, 68, 0.15);
  }

  .next-btn {
    margin: 0 1.5rem 1.5rem;
    padding: 0.85rem;
    border-radius: 12px;
    border: none;
    background: var(--color-accent);
    color: white;
    font-size: 1rem;
    font-weight: 600;
    font-family: inherit;
    cursor: pointer;
    opacity: 0;
    pointer-events: none;
    transition:
      opacity 0.15s,
      background 0.15s;
  }

  .next-btn.visible {
    opacity: 1;
    pointer-events: auto;
  }

  .next-btn:hover {
    background: #4f46e5;
  }

  /* Summary / Goal done screen */
  .summary {
    margin: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    text-align: center;
    max-width: 480px;
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
    font-size: 1rem;
  }

  .summary-stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
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
    color: var(--color-accent);
  }

  .stat-num.correct {
    color: var(--color-good);
  }
  .stat-num.xp {
    color: #f59e0b;
  }

  .stat-label {
    font-size: 0.85rem;
    color: var(--color-muted);
    font-weight: 500;
  }

  .streak-celebrate {
    font-size: 1.5rem;
    font-weight: 700;
    color: #f97316;
  }

  .summary-actions {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    width: 100%;
  }

  .continue-btn {
    background: var(--color-accent);
    color: white;
    border: none;
    border-radius: 12px;
    padding: 1rem 2rem;
    font-size: 1.05rem;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.15s;
    font-family: inherit;
    width: 100%;
  }

  .continue-btn:hover {
    opacity: 0.88;
  }

  .home-btn {
    background: var(--color-surface);
    color: var(--color-text);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    padding: 1rem 2rem;
    font-size: 1.05rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s;
    font-family: inherit;
    width: 100%;
  }

  .home-btn:hover {
    background: var(--color-surface-alt);
  }
</style>

<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { get } from "svelte/store";
  import vocabulary from "$lib/data/vocabulary.json";
  import { generateCards } from "$lib/cards/cardTypes";
  import { getDueCounts, getCategoryProgress } from "$lib/srs/scheduler";
  import { cardsStore } from "$lib/store/cards";
  import { metaStore } from "$lib/store/meta";
  import { sessionStore } from "$lib/store/session";
  import CategoryRings from "$lib/components/CategoryRings.svelte";

  const allCards = generateCards(vocabulary as any);

  let now = $state(Date.now());

  let dueCounts = $derived(
    getDueCounts(allCards, $cardsStore, $metaStore, now),
  );
  let categoryProgress = $derived(getCategoryProgress(allCards, $cardsStore));

  // Learning-step re-shows are internal session mechanics — don't show them on the
  // dashboard. The session builder picks them up automatically when a session starts.
  let hasStarted = $derived($metaStore.lastStudyDate !== "");
  // Before first session: include new cards in due count as an invitation to start
  // After that: only reviews count as "due"; new cards are extras via Keep learning
  let totalDue = $derived(
    dueCounts.review + (hasStarted ? 0 : dueCounts.newBudget),
  );
  let hasSession = $derived(totalDue > 0);
  let extraAvailable = $derived(dueCounts.newAvailable);

  let knownCount = $derived(
    Object.values(categoryProgress).reduce((sum, d) => sum + d.known, 0),
  );
  let cardsLeft = $derived(allCards.length - knownCount);

  const CATEGORY_COLORS: Record<string, string> = {
    noun: "#6366f1",
    verb: "#f59e0b",
    adjective: "#10b981",
    preposition: "#ec4899",
  };

  let rings = $derived(
    Object.entries(categoryProgress).map(([cat, data]) => ({
      label: cat,
      known: data.known,
      total: data.total,
      color: CATEGORY_COLORS[cat] ?? "#94a3b8",
    })),
  );

  onMount(() => {
    cardsStore.reload();
    metaStore.reload();
    metaStore.checkStreak();
    sessionStore.reset();
    const timer = setInterval(() => {
      now = Date.now();
    }, 60_000);
    return () => clearInterval(timer);
  });

  function startStudy() {
    goto("/study");
  }

  function startExtra() {
    const schedules = get(cardsStore);
    const meta = get(metaStore);
    const unseen = allCards
      .filter((c) => !schedules[c.id])
      .map((c) => c.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, meta.newCardsPerSession);
    if (unseen.length === 0) return;
    sessionStore.start(unseen, true);
    goto("/study");
  }

  // Settings state
  let showSettings = $state(false);
  let newCardsPerSessionInput = $state($metaStore.newCardsPerSession);

  function saveSettings() {
    metaStore.setNewCardsPerSession(newCardsPerSessionInput);
    showSettings = false;
    now = Date.now();
  }

  function resetAll() {
    if (confirm("Reset ALL progress? This cannot be undone.")) {
      cardsStore.reset();
      metaStore.reset();
      now = Date.now();
    }
  }

  let exportData = $state("");
  function doExport() {
    const cardsJson = cardsStore.exportJSON();
    const metaJson = JSON.stringify(get(metaStore), null, 2);
    exportData = JSON.stringify(
      { cards: JSON.parse(cardsJson), meta: JSON.parse(metaJson) },
      null,
      2,
    );
  }

  function doImport() {
    const text = prompt("Paste your exported JSON here:");
    if (!text) return;
    try {
      const data = JSON.parse(text);
      if (data.cards) cardsStore.importJSON(JSON.stringify(data.cards));
      now = Date.now();
      alert("Import successful!");
    } catch {
      alert("Invalid JSON. Import failed.");
    }
  }
</script>

<div class="home">
  <!-- Navbar -->
  <nav class="navbar">
    <div class="nav-brand">
      <span class="flag">🇳🇱</span>
      <span class="brand-name">Flutch</span>
    </div>
    <div class="nav-right">
      <a href="/test" class="nav-link">Test</a>
      <a href="/stats" class="nav-link">Stats</a>
      <button class="nav-link" onclick={() => (showSettings = !showSettings)}
        >Settings</button
      >
    </div>
  </nav>

  <main class="main">
    <!-- Hero section -->
    <div class="hero">
      <h1 class="hero-title">Ready to learn?</h1>
      <p class="hero-sub">
        {#if hasSession}
          You have <strong>{totalDue}</strong> card{totalDue === 1 ? "" : "s"} due
          for review
        {:else if extraAvailable > 0}
          {hasStarted
            ? "You've completed today goal — keep learning!"
            : "Start your first session!"}
        {:else}
          All caught up!
        {/if}
      </p>

      <div class="due-breakdown">
        {#if dueCounts.review > 0}
          <span class="due-pill review">{dueCounts.review} review</span>
        {/if}
      </div>

      {#if hasSession}
        <button class="start-btn" onclick={startStudy}>Start Session</button>
      {:else if extraAvailable > 0}
        <button class="start-btn" onclick={startExtra}>Keep learning</button>
      {:else}
        <button class="start-btn" disabled>All caught up!</button>
      {/if}
    </div>

    <!-- Category rings -->
    <section class="section">
      <h2 class="section-title">Progress by category</h2>
      <CategoryRings categories={rings} />
      <p class="ring-note">
        Cards with interval ≥ 21 days are counted as "known"
      </p>
    </section>

    <!-- Stats strip -->
    <section class="stats-strip">
      <div class="strip-stat">
        <span class="strip-num">{cardsLeft.toLocaleString()}</span>
        <span class="strip-label">Cards left to learn</span>
      </div>
    </section>
  </main>

  <!-- Settings panel -->
  {#if showSettings}
    <div
      class="settings-overlay"
      onclick={() => (showSettings = false)}
      role="none"
    ></div>
    <aside class="settings-panel">
      <h3>Settings</h3>

      <label class="setting-row">
        <span>New cards per session</span>
        <input
          type="range"
          min="5"
          max="50"
          step="5"
          bind:value={newCardsPerSessionInput}
        />
        <span class="range-val">{newCardsPerSessionInput}</span>
      </label>

      <button class="setting-btn accent" onclick={saveSettings}
        >Save settings</button
      >
      <hr />
      <button class="setting-btn" onclick={doExport}>Export progress</button>
      {#if exportData}
        <textarea class="export-area" readonly value={exportData} rows="6"
        ></textarea>
      {/if}
      <button class="setting-btn" onclick={doImport}>Import progress</button>
      <hr />
      <button class="setting-btn danger" onclick={resetAll}
        >Reset all progress</button
      >
    </aside>
  {/if}
</div>

<style>
  .home {
    min-height: 100dvh;
    background: var(--color-bg);
    display: flex;
    flex-direction: column;
  }

  .navbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.5rem;
    background: var(--color-surface);
    border-bottom: 1px solid var(--color-border);
  }

  .nav-brand {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .flag {
    font-size: 1.4rem;
  }

  .brand-name {
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--color-text);
  }

  .nav-right {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .nav-link {
    font-size: 0.9rem;
    color: var(--color-muted);
    text-decoration: none;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 0.9rem;
    font-family: inherit;
    padding: 0;
    transition: color 0.15s;
  }

  .nav-link:hover {
    color: var(--color-text);
  }

  .main {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2.5rem;
    padding: 2rem 1.5rem;
    max-width: 640px;
    margin: 0 auto;
    width: 100%;
  }

  .hero {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    text-align: center;
  }

  .hero-title {
    font-size: 2.5rem;
    font-weight: 800;
    margin: 0;
  }

  .hero-sub {
    font-size: 1.1rem;
    color: var(--color-muted);
    margin: 0;
  }

  .due-breakdown {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .due-pill {
    font-size: 0.8rem;
    font-weight: 600;
    padding: 4px 12px;
    border-radius: 20px;
  }

  .due-pill.review {
    background: #dbeafe;
    color: #1e40af;
  }

  .start-btn {
    background: var(--color-accent);
    color: white;
    border: none;
    border-radius: 14px;
    padding: 1.1rem 3rem;
    font-size: 1.2rem;
    font-weight: 700;
    cursor: pointer;
    transition:
      opacity 0.15s,
      transform 0.1s;
    margin-top: 0.5rem;
  }

  .start-btn:hover:not(:disabled) {
    opacity: 0.88;
    transform: translateY(-2px);
  }
  .start-btn:disabled {
    opacity: 0.45;
    cursor: default;
  }

  .section {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .section-title {
    font-size: 1rem;
    font-weight: 700;
    color: var(--color-muted);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin: 0;
    align-self: flex-start;
  }

  .ring-note {
    font-size: 0.75rem;
    color: var(--color-muted);
    margin: 0;
  }

  .stats-strip {
    display: flex;
    gap: 1rem;
    width: 100%;
  }

  .strip-stat {
    flex: 1;
    background: var(--color-surface);
    border-radius: 14px;
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    text-align: center;
  }

  .strip-num {
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--color-text);
  }

  .strip-label {
    font-size: 0.75rem;
    color: var(--color-muted);
    font-weight: 500;
  }

  .settings-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: 10;
  }

  .settings-panel {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: min(360px, 90vw);
    background: var(--color-surface);
    padding: 2rem 1.5rem;
    z-index: 11;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    box-shadow: -4px 0 24px rgba(0, 0, 0, 0.1);
  }

  .settings-panel h3 {
    margin: 0;
    font-size: 1.3rem;
  }

  .setting-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.9rem;
  }

  .setting-row input[type="range"] {
    flex: 1;
  }

  .range-val {
    font-weight: 700;
    min-width: 2rem;
    text-align: right;
  }

  .setting-btn {
    padding: 0.75rem 1rem;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    font-size: 0.95rem;
    font-weight: 600;
    background: var(--color-surface-alt);
    color: var(--color-text);
    transition: opacity 0.15s;
    font-family: inherit;
  }

  .setting-btn:hover {
    opacity: 0.8;
  }
  .setting-btn.accent {
    background: var(--color-accent);
    color: white;
  }
  .setting-btn.danger {
    background: #fee2e2;
    color: #991b1b;
  }

  hr {
    border: none;
    border-top: 1px solid var(--color-border);
    margin: 0;
  }

  .export-area {
    width: 100%;
    font-family: monospace;
    font-size: 0.75rem;
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: 0.75rem;
    resize: vertical;
    color: var(--color-muted);
    box-sizing: border-box;
  }
</style>

<script lang="ts">
  import { onMount } from 'svelte';
  import vocabulary from '$lib/data/vocabulary.json';
  import { generateCards } from '$lib/cards/cardTypes';
  import { getCategoryProgress } from '$lib/srs/scheduler';
  import { cardsStore } from '$lib/store/cards';
  import { metaStore } from '$lib/store/meta';
  import Heatmap from '$lib/components/Heatmap.svelte';

  const allCards = generateCards(vocabulary as any);

  let categoryProgress = $derived(getCategoryProgress(allCards, $cardsStore));

  // Compute due-interval distribution for histogram
  let intervalBuckets = $derived.by(() => {
    const schedules = $cardsStore;
    const buckets = { '<1d': 0, '1-7d': 0, '1-4w': 0, '1-3m': 0, '3m+': 0, learning: 0 };
    for (const s of Object.values(schedules)) {
      if (s.learningStep > 0) { buckets.learning++; continue; }
      if (s.interval < 1) buckets['<1d']++;
      else if (s.interval <= 7) buckets['1-7d']++;
      else if (s.interval <= 28) buckets['1-4w']++;
      else if (s.interval <= 90) buckets['1-3m']++;
      else buckets['3m+']++;
    }
    return buckets;
  });

  let maxBucket = $derived(Math.max(...Object.values(intervalBuckets), 1));

  const CATEGORY_COLORS: Record<string, string> = {
    noun: '#6366f1',
    verb: '#f59e0b',
    adjective: '#10b981',
    preposition: '#ec4899',
  };

  onMount(() => {
    metaStore.checkStreak();
  });
</script>

<div class="stats-page">
  <nav class="navbar">
    <a href="/" class="back-link">← Home</a>
    <h1 class="page-title">Statistics</h1>
  </nav>

  <main class="main">
    <!-- Heatmap -->
    <section class="section">
      <h2 class="section-title">Review activity (90 days)</h2>
      <Heatmap reviewHistory={$metaStore.reviewHistory} />
    </section>

    <!-- Summary numbers -->
    <section class="grid-3">
      <div class="stat-card">
        <span class="stat-big">{$metaStore.totalReviews.toLocaleString()}</span>
        <span class="stat-label">Total reviews</span>
      </div>
    </section>

    <!-- Category breakdown -->
    <section class="section">
      <h2 class="section-title">Category breakdown</h2>
      <div class="category-table">
        {#each Object.entries(categoryProgress) as [cat, data]}
          {@const pct = data.total > 0 ? (data.known / data.total * 100).toFixed(0) : '0'}
          <div class="cat-row">
            <span class="cat-name" style="color: {CATEGORY_COLORS[cat] ?? '#94a3b8'}">{cat}</span>
            <div class="cat-bar-wrap">
              <div class="cat-bar" style="width: {pct}%; background: {CATEGORY_COLORS[cat] ?? '#94a3b8'}"></div>
            </div>
            <span class="cat-nums">{data.known}/{data.total}</span>
            <span class="cat-pct">{pct}%</span>
          </div>
        {/each}
      </div>
    </section>

    <!-- Interval histogram -->
    <section class="section">
      <h2 class="section-title">Card maturity distribution</h2>
      <div class="histogram">
        {#each Object.entries(intervalBuckets) as [label, count]}
          <div class="hist-col">
            <span class="hist-count">{count}</span>
            <div class="hist-bar-wrap">
              <div class="hist-bar" style="height: {(count / maxBucket) * 100}%"></div>
            </div>
            <span class="hist-label">{label}</span>
          </div>
        {/each}
      </div>
    </section>
  </main>
</div>

<style>
  .stats-page {
    min-height: 100dvh;
    background: var(--color-bg);
    display: flex;
    flex-direction: column;
  }

  .navbar {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.5rem;
    background: var(--color-surface);
    border-bottom: 1px solid var(--color-border);
  }

  .back-link {
    text-decoration: none;
    color: var(--color-muted);
    font-size: 0.9rem;
    transition: color 0.15s;
  }

  .back-link:hover { color: var(--color-text); }

  .page-title {
    font-size: 1.2rem;
    font-weight: 700;
    margin: 0;
  }

  .main {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
    padding: 2rem 1.5rem;
    max-width: 700px;
    margin: 0 auto;
    width: 100%;
  }

  .section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .section-title {
    font-size: 1rem;
    font-weight: 700;
    color: var(--color-muted);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin: 0;
  }

  .grid-3 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }

  .stat-card {
    background: var(--color-surface);
    border-radius: 14px;
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    text-align: center;
  }

  .stat-big {
    font-size: 2rem;
    font-weight: 700;
    color: var(--color-text);
  }

  .stat-label {
    font-size: 0.78rem;
    color: var(--color-muted);
    font-weight: 500;
  }

  /* Category table */
  .category-table {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .cat-row {
    display: grid;
    grid-template-columns: 100px 1fr 70px 44px;
    align-items: center;
    gap: 0.75rem;
  }

  .cat-name {
    font-weight: 600;
    font-size: 0.9rem;
    text-transform: capitalize;
  }

  .cat-bar-wrap {
    height: 10px;
    background: var(--color-surface-alt);
    border-radius: 5px;
    overflow: hidden;
  }

  .cat-bar {
    height: 100%;
    border-radius: 5px;
    transition: width 0.6s ease;
  }

  .cat-nums {
    font-size: 0.8rem;
    color: var(--color-muted);
    text-align: right;
  }

  .cat-pct {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--color-text);
    text-align: right;
  }

  /* Histogram */
  .histogram {
    display: flex;
    align-items: flex-end;
    gap: 0.75rem;
    height: 140px;
  }

  .hist-col {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    height: 100%;
  }

  .hist-count {
    font-size: 0.72rem;
    color: var(--color-muted);
  }

  .hist-bar-wrap {
    flex: 1;
    width: 100%;
    display: flex;
    align-items: flex-end;
  }

  .hist-bar {
    width: 100%;
    background: var(--color-accent);
    border-radius: 4px 4px 0 0;
    min-height: 4px;
    transition: height 0.4s ease;
    opacity: 0.75;
  }

  .hist-label {
    font-size: 0.7rem;
    color: var(--color-muted);
    white-space: nowrap;
  }
</style>

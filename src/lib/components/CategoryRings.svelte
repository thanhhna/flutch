<script lang="ts">
  interface CategoryData {
    label: string;
    known: number;
    total: number;
    color: string;
  }
  interface Props {
    categories: CategoryData[];
  }
  let { categories }: Props = $props();

  const R = 36;
  const CIRC = 2 * Math.PI * R;

  function strokeDash(known: number, total: number) {
    const pct = total > 0 ? known / total : 0;
    return `${pct * CIRC} ${CIRC}`;
  }
</script>

<div class="rings">
  {#each categories as cat}
    <div class="ring-item">
      <svg width="88" height="88" viewBox="0 0 88 88">
        <circle cx="44" cy="44" r={R} fill="none" stroke="var(--color-surface-alt)" stroke-width="8" />
        <circle
          cx="44" cy="44" r={R}
          fill="none"
          stroke={cat.color}
          stroke-width="8"
          stroke-dasharray={strokeDash(cat.known, cat.total)}
          stroke-dashoffset={CIRC * 0.25}
          stroke-linecap="round"
          transform="rotate(-90 44 44)"
          style="transition: stroke-dasharray 0.6s ease"
        />
        <text x="44" y="40" text-anchor="middle" font-size="13" font-weight="700" fill="var(--color-text)">{cat.known}</text>
        <text x="44" y="54" text-anchor="middle" font-size="10" fill="var(--color-muted)">/{cat.total}</text>
      </svg>
      <span class="ring-label">{cat.label}</span>
    </div>
  {/each}
</div>

<style>
  .rings {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
    justify-content: center;
  }
  .ring-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.4rem;
  }
  .ring-label {
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--color-muted);
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
</style>

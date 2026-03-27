<script lang="ts">
  interface Props {
    reviewHistory: Record<string, number>;
  }
  let { reviewHistory }: Props = $props();

  const DAYS = 91;

  interface Cell {
    date: string;
    count: number;
    level: number; // 0-4 for color intensity
  }

  let cells = $derived.by((): Cell[] => {
    const today = new Date();
    const result: Cell[] = [];
    for (let i = DAYS - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const date = d.toISOString().slice(0, 10);
      const count = reviewHistory[date] ?? 0;
      const level = count === 0 ? 0 : count < 20 ? 1 : count < 50 ? 2 : count < 100 ? 3 : 4;
      result.push({ date, count, level });
    }
    return result;
  });

  // Group into weeks (columns of 7)
  let weeks = $derived.by(() => {
    const w: Cell[][] = [];
    for (let i = 0; i < cells.length; i += 7) {
      w.push(cells.slice(i, i + 7));
    }
    return w;
  });
</script>

<div class="heatmap-wrap">
  <div class="heatmap">
    {#each weeks as week}
      <div class="week">
        {#each week as cell}
          <div
            class="cell level-{cell.level}"
            title="{cell.date}: {cell.count} reviews"
          ></div>
        {/each}
      </div>
    {/each}
  </div>
  <div class="legend">
    <span>Less</span>
    {#each [0,1,2,3,4] as l}
      <div class="cell level-{l}"></div>
    {/each}
    <span>More</span>
  </div>
</div>

<style>
  .heatmap-wrap { display: flex; flex-direction: column; gap: 0.5rem; align-items: flex-start; }
  .heatmap { display: flex; gap: 3px; }
  .week { display: flex; flex-direction: column; gap: 3px; }
  .cell {
    width: 12px;
    height: 12px;
    border-radius: 2px;
    background: var(--color-surface-alt);
  }
  .level-0 { background: var(--color-surface-alt); }
  .level-1 { background: #bbf7d0; }
  .level-2 { background: #4ade80; }
  .level-3 { background: #16a34a; }
  .level-4 { background: #14532d; }
  .legend {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 0.7rem;
    color: var(--color-muted);
  }
  .legend .cell { width: 12px; height: 12px; }
</style>

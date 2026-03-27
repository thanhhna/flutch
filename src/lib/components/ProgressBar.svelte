<script lang="ts">
  interface Props {
    current: number;
    total: number;
  }
  let { current, total }: Props = $props();
  let pct = $derived(total > 0 ? Math.min(100, (current / total) * 100) : 0);
</script>

<div class="progress-wrap">
  <div class="progress-bar" style="width: {pct}%"></div>
  <span class="progress-label">{current}/{total}</span>
</div>

<style>
  .progress-wrap {
    position: relative;
    height: 8px;
    background: var(--color-surface-alt);
    border-radius: 4px;
    overflow: visible;
  }
  .progress-bar {
    height: 100%;
    background: var(--color-accent);
    border-radius: 4px;
    transition: width 0.3s ease;
  }
  .progress-label {
    position: absolute;
    right: 0;
    top: -1.5rem;
    font-size: 0.75rem;
    color: var(--color-muted);
  }
</style>

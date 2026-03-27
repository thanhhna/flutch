<script lang="ts">
  import type { Rating } from '$lib/srs/types';

  interface Props {
    onrate: (r: Rating) => void;
  }
  let { onrate }: Props = $props();
</script>

<svelte:window
  onkeydown={(e) => {
    if (e.key === '1') onrate(1);
    else if (e.key === '2') onrate(2);
    else if (e.key === '3') onrate(3);
    else if (e.key === '4') onrate(4);
  }}
/>

<div class="rating-bar">
  <button class="btn again" onclick={() => onrate(1)}>
    <span class="label">Again</span>
    <span class="key">1</span>
  </button>
  <button class="btn hard" onclick={() => onrate(2)}>
    <span class="label">Hard</span>
    <span class="key">2</span>
  </button>
  <button class="btn good" onclick={() => onrate(3)}>
    <span class="label">Good</span>
    <span class="key">3</span>
  </button>
  <button class="btn easy" onclick={() => onrate(4)}>
    <span class="label">Easy</span>
    <span class="key">4</span>
  </button>
</div>

<style>
  .rating-bar {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    font-weight: 600;
    font-size: 1rem;
    min-width: 90px;
    transition: transform 0.1s, opacity 0.1s;
    color: white;
  }

  .btn:hover { opacity: 0.88; transform: translateY(-1px); }
  .btn:active { transform: translateY(0); }

  .key {
    font-size: 0.7rem;
    opacity: 0.7;
    font-weight: 400;
  }

  .again { background: var(--color-again); }
  .hard  { background: var(--color-hard); }
  .good  { background: var(--color-good); }
  .easy  { background: var(--color-easy); }
</style>

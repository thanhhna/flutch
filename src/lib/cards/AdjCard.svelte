<script lang="ts">
  import type { AdjectiveEntry, CardSchedule } from '$lib/srs/types';
  import { speakDutch } from '$lib/utils/speech';

  interface Props {
    entry: AdjectiveEntry;
    type: string;
    phase: 'front' | 'answered' | 'revealed';
    schedule?: CardSchedule;
    options?: string[];
    selectedOption?: string | null;
    correctAnswer?: string | null;
    onselect?: (answer: string) => void;
  }
  let { entry, type, phase, schedule, options, selectedOption, correctAnswer, onselect }: Props = $props();

  const isTricky = $derived((schedule?.lapses ?? 0) >= 3);

  function optionClass(opt: string) {
    if (phase !== 'answered') return '';
    if (opt === correctAnswer) return 'correct';
    if (opt === selectedOption) return 'wrong';
    return 'dimmed';
  }
</script>

<div class="card-inner">
  {#if isTricky && phase !== 'front'}
    <span class="badge tricky">Tricky</span>
  {/if}

  <div class="prompt">
    <span class="label-sm">adjective / adverb</span>
    {#if type === 'adj:nl_en'}
      <span class="word">{entry.dutch}</span>
      <button class="speak-btn" onclick={() => speakDutch(entry.dutch)} aria-label="Pronounce">🔊</button>
    {:else}
      <span class="word en">{entry.english}</span>
    {/if}
  </div>

  {#if options}
    <div class="options" class:revealed={phase === 'answered'}>
      {#each options as opt}
        <button
          class="option {optionClass(opt)}"
          disabled={phase === 'answered'}
          onclick={() => onselect?.(opt)}
        >{opt}</button>
      {/each}
    </div>
  {/if}
</div>

<style>
  .card-inner {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.75rem;
    padding: 2.5rem 2rem 2rem;
    width: 100%;
  }

  .prompt {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.4rem;
  }

  .label-sm {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--color-muted);
    font-weight: 600;
  }

  .word {
    font-size: 2.8rem;
    font-weight: 700;
    color: var(--color-text);
    text-align: center;
  }

  .word.en { font-size: 2.2rem; }

  .options {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
    width: 100%;
  }

  .option {
    padding: 0.85rem 1rem;
    border: 2px solid var(--color-border);
    border-radius: 12px;
    background: var(--color-surface);
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    text-align: center;
    transition: border-color 0.15s, background 0.15s, transform 0.1s;
    color: var(--color-text);
    font-family: inherit;
  }

  .option:hover:not(:disabled) {
    border-color: var(--color-accent);
    background: #eef2ff;
    transform: translateY(-1px);
  }

  .option:disabled { cursor: default; }
  .option.correct { border-color: var(--color-good);  background: #f0fdf4; color: #14532d; }
  .option.wrong   { border-color: var(--color-again); background: #fef2f2; color: #7f1d1d; }
  .option.dimmed  { opacity: 0.4; }

  .speak-btn {
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0.2rem 0.4rem;
    border-radius: 6px;
    line-height: 1;
    transition: opacity 0.15s;
  }
  .speak-btn:hover { opacity: 0.7; }

  .badge {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    padding: 3px 8px;
    border-radius: 20px;
  }

  .tricky { background: #fef3c7; color: #92400e; }
</style>

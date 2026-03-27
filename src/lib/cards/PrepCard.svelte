<script lang="ts">
  import type { PrepositionEntry, CardSchedule } from '$lib/srs/types';
  import { speakDutch } from '$lib/utils/speech';

  interface Props {
    entry: PrepositionEntry;
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

  const groupLabel: Record<string, string> = { place: 'PLACE', direction: 'DIRECTION', time: 'TIME', general: 'GENERAL' };
  const groupColor: Record<string, string> = { place: '#6366f1', direction: '#f59e0b', time: '#10b981', general: '#94a3b8' };

  function optionClass(opt: string) {
    if (phase !== 'answered') return '';
    if (opt === correctAnswer) return 'correct';
    if (opt === selectedOption) return 'wrong';
    return 'dimmed';
  }

  const examples: Record<string, string[]> = {
    in:    ['Ik woon in Amsterdam.', 'Het boek ligt in de tas.', 'In de winter is het koud.'],
    uit:   ['Hij komt uit Nederland.', 'Ze stapt uit de auto.'],
    op:    ['Het staat op de tafel.', 'Op maandag ga ik werken.'],
    boven: ['De lamp hangt boven de tafel.'],
    onder: ['De kat zit onder de stoel.'],
    voor:  ['Hij staat voor de deur.'],
    achter:['De tuin is achter het huis.'],
    naast: ['De bank staat naast de tv.'],
    naar:  ['Ik ga naar school.', 'Zij rijdt naar Amsterdam.'],
    om:    ['Om half negen begint de les.'],
  };

  const exList = $derived(phase === 'answered' ? (examples[entry.dutch] ?? []) : []);
</script>

<div class="card-inner">
  {#if isTricky && phase !== 'front'}
    <span class="badge tricky">Tricky</span>
  {/if}

  <span class="group-badge" style="background: {groupColor[entry.group] ?? '#94a3b8'}20; color: {groupColor[entry.group] ?? '#94a3b8'}; border: 1px solid {groupColor[entry.group] ?? '#94a3b8'}40">
    {groupLabel[entry.group] ?? entry.group.toUpperCase()}
  </span>

  <div class="prompt">
    <span class="word">{entry.dutch}</span>
    <button class="speak-btn" onclick={() => speakDutch(entry.dutch)} aria-label="Pronounce">🔊</button>
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

  {#if phase === 'answered' && exList.length > 0}
    <ul class="examples">
      {#each exList as ex}
        <li>{@html ex.replace(entry.dutch, `<strong>${entry.dutch}</strong>`)}</li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .card-inner {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.25rem;
    padding: 2.5rem 2rem 2rem;
    width: 100%;
  }

  .group-badge {
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    padding: 4px 12px;
    border-radius: 20px;
  }

  .prompt {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .word {
    font-size: 3rem;
    font-weight: 700;
    color: var(--color-text);
  }

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

  .examples {
    list-style: none;
    padding: 0;
    margin: 0;
    background: var(--color-surface-alt);
    border-radius: 12px;
    padding: 1rem 1.25rem;
    width: 100%;
  }

  .examples li {
    font-size: 0.9rem;
    color: var(--color-muted);
    padding: 0.3rem 0;
    border-bottom: 1px solid var(--color-border);
  }

  .examples li:last-child { border-bottom: none; }
  .examples :global(strong) { color: var(--color-text); }

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

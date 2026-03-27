<script lang="ts">
  import type { NounEntry, CardSchedule } from '$lib/srs/types';
  import { speakDutch } from '$lib/utils/speech';

  interface Props {
    entry: NounEntry;
    type: string;
    phase: 'front' | 'answered' | 'revealed';
    schedule?: CardSchedule;
    // MC props
    options?: string[];
    selectedOption?: string | null;
    correctAnswer?: string | null;
    onselect?: (answer: string) => void;
    // self-reveal (article)
    onreveal?: () => void;
    onselfrate?: (knew: boolean) => void;
    onwrongarticle?: () => void;  // wrong article → show result + Next button
  }
  let { entry, type, phase, schedule, options, selectedOption, correctAnswer, onselect, onreveal, onselfrate, onwrongarticle }: Props = $props();

  const isTricky = $derived((schedule?.lapses ?? 0) >= 3);

  function optionClass(opt: string) {
    if (phase !== 'answered') return '';
    if (opt === correctAnswer) return 'correct';
    if (opt === selectedOption) return 'wrong';
    return 'dimmed';
  }

  // noun:article — track button press before reveal
  let articleGuess: 'de' | 'het' | null = $state(null);
  $effect(() => { entry; articleGuess = null; });

  function guessArticle(a: 'de' | 'het') {
    articleGuess = a;
    if (a === entry.article) {
      onreveal?.();          // correct → revealed phase → self-rate buttons
    } else {
      onwrongarticle?.();    // wrong → answered phase → show result + Next button
    }
  }

  const articleColor = $derived(isTricky
    ? entry.article === 'de' ? 'var(--color-de)' : 'var(--color-het)'
    : 'transparent'
  );
</script>

<div class="card-inner" style="--article-color: {articleColor}">
  {#if isTricky && phase !== 'front'}
    <span class="badge tricky">Tricky</span>
  {/if}

  {#if type === 'noun:nl_en'}
    <div class="prompt">
      <span class="article">{entry.article}</span>
      <span class="word">{entry.dutch}</span>
      <button class="speak-btn" onclick={() => speakDutch(`${entry.article} ${entry.dutch}`)} aria-label="Pronounce">🔊</button>
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

  {:else if type === 'noun:en_nl'}
    <div class="prompt">
      <span class="word en">{entry.english}</span>
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

  {:else if type === 'noun:article'}
    <div class="prompt">
      {#if isTricky}
        <div class="article-hint" style="background: {articleColor}; opacity: 0.15; border-radius: 8px; padding: 4px 12px; font-size: 0.75rem; color: var(--color-muted)">
          Hint: {entry.article === 'de' ? 'blue = de' : 'orange = het'}
        </div>
      {/if}
      <span class="word">{entry.dutch}</span>
      <span class="english-hint">{entry.english}</span>
      <button class="speak-btn" onclick={() => speakDutch(entry.dutch)} aria-label="Pronounce">🔊</button>
    </div>
    {#if phase === 'front'}
      <div class="article-btns">
        <button class="art-btn de" onclick={() => guessArticle('de')}>de</button>
        <button class="art-btn het" onclick={() => guessArticle('het')}>het</button>
      </div>
    {:else}
      <!-- revealed (correct) or answered (wrong) -->
      <div class="article-result" class:correct={articleGuess === entry.article} class:wrong={articleGuess !== null && articleGuess !== entry.article}>
        <span class="answer">{entry.article} {entry.dutch}</span>
        {#if articleGuess !== null}
          <span class="verdict">{articleGuess === entry.article ? '✓ Correct' : `✗ You guessed ${articleGuess}`}</span>
        {/if}
      </div>
      {#if phase === 'revealed'}
        <div class="self-rate-btns">
          <button class="sr-btn knew" onclick={() => onselfrate?.(true)}>I knew it ✓</button>
          <button class="sr-btn didnt" onclick={() => onselfrate?.(false)}>I didn't ✗</button>
        </div>
      {/if}
    {/if}
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
    text-align: center;
  }

  .article {
    font-size: 1.3rem;
    color: var(--color-muted);
    font-weight: 500;
  }

  .word {
    font-size: 2.8rem;
    font-weight: 700;
    color: var(--color-text);
  }

  .english-hint {
    font-size: 1rem;
    color: var(--color-muted);
    font-weight: 400;
  }

  .word.en { font-size: 2.2rem; }

  /* Multiple choice options */
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

  .option.correct {
    border-color: var(--color-good);
    background: #f0fdf4;
    color: #14532d;
  }

  .option.wrong {
    border-color: var(--color-again);
    background: #fef2f2;
    color: #7f1d1d;
  }

  .option.dimmed {
    opacity: 0.4;
  }

  /* noun:article */
  .article-btns {
    display: flex;
    gap: 1rem;
  }

  .art-btn {
    padding: 1rem 2.5rem;
    font-size: 1.4rem;
    font-weight: 700;
    border: 2px solid transparent;
    border-radius: 12px;
    cursor: pointer;
    transition: transform 0.1s;
    font-family: inherit;
  }

  .art-btn:hover { transform: translateY(-2px); }
  .art-btn.de  { background: var(--color-de);  color: white; }
  .art-btn.het { background: var(--color-het); color: white; }

  .article-result {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.4rem;
  }

  .answer {
    font-size: 1.9rem;
    font-weight: 700;
    color: var(--color-text);
  }

  .verdict { font-size: 1rem; font-weight: 600; }
  .article-result.correct .verdict { color: var(--color-good); }
  .article-result.wrong   .verdict { color: var(--color-again); }

  .self-rate-btns {
    display: flex;
    gap: 0.75rem;
  }

  .sr-btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 10px;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    transition: opacity 0.15s;
  }

  .sr-btn:hover { opacity: 0.85; }
  .sr-btn.knew  { background: #dcfce7; color: #14532d; }
  .sr-btn.didnt { background: #fee2e2; color: #7f1d1d; }

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

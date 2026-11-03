<script lang="ts">
  import { onMount } from "svelte";
  import { writingTasks } from "$lib/writing/tasks";
  import { formTasks } from "$lib/writing/forms";
  import { checkWriting, countWords } from "$lib/writing/checker";
  import { checkForm } from "$lib/writing/formChecker";
  import { writingStore } from "$lib/store/writing";
  import type {
    CheckResult,
    FormCheckResult,
    FormTask,
    WritingTask,
  } from "$lib/writing/types";

  type Phase = "list" | "write" | "result";

  let phase = $state<Phase>("list");
  let task = $state<WritingTask | null>(null);
  let text = $state("");
  let result = $state<CheckResult | null>(null);
  let formTask = $state<FormTask | null>(null);
  let values = $state<Record<string, string>>({});
  let formResult = $state<FormCheckResult | null>(null);
  let showEnglish = $state(false);
  let showPhrases = $state(true);

  let wordCount = $derived(countWords(text));
  let totalCount = writingTasks.length + formTasks.length;
  let doneCount = $derived(
    [...writingTasks, ...formTasks].filter((t) => $writingStore[t.id]?.ready)
      .length,
  );

  onMount(() => {
    writingStore.reload();
  });

  function open(t: WritingTask) {
    task = t;
    formTask = null;
    text = "";
    result = null;
    phase = "write";
  }

  function openForm(t: FormTask) {
    formTask = t;
    task = null;
    values = {};
    formResult = null;
    phase = "write";
  }

  function randomTask() {
    const all = [...writingTasks, ...formTasks];
    const pending = all.filter((t) => !$writingStore[t.id]?.ready);
    const pool = pending.length > 0 ? pending : all;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    if ("fields" in pick) openForm(pick);
    else open(pick);
  }

  function nextTask() {
    if (formTask) {
      const index = formTasks.findIndex((t) => t.id === formTask?.id);
      openForm(formTasks[(index + 1) % formTasks.length]);
      return;
    }
    if (!task) return;
    const index = writingTasks.findIndex((t) => t.id === task?.id);
    open(writingTasks[(index + 1) % writingTasks.length]);
  }

  function submitForm() {
    if (!formTask) return;
    formResult = checkForm(formTask, values);
    writingStore.record(
      formTask.id,
      JSON.stringify(values),
      formResult.correctCount,
      formResult.ready,
    );
    phase = "result";
  }

  function submit() {
    if (!task || !text.trim()) return;
    result = checkWriting(task, text);
    writingStore.record(
      task.id,
      text,
      result.coveredCount,
      result.ready,
    );
    phase = "result";
  }

  function editAgain() {
    phase = "write";
  }

  function backToList() {
    phase = "list";
    task = null;
    formTask = null;
  }

  function rangeClass(r: CheckResult) {
    return r.wordsOk ? "ok" : "bad";
  }
</script>

<div class="page">
  <nav class="navbar">
    <a href="/" class="nav-brand">
      <span class="flag">🇳🇱</span>
      <span class="brand-name">Flutch</span>
    </a>
    <div class="nav-right">
      {#if phase !== "list"}
        <button class="nav-link" onclick={backToList}>All tasks</button>
      {/if}
      <a href="/" class="nav-link">Home</a>
    </div>
  </nav>

  <main class="main">
    {#if phase === "list"}
      <header class="head">
        <h1>Schrijven A2</h1>
        <p class="sub">
          Inburgering writing practice. Cover every point, use the right
          register, keep to the word range.
        </p>
        <p class="progress">{doneCount} / {totalCount} ready</p>
        <button class="primary" onclick={randomTask}>Random task</button>
      </header>

      <h2 class="group-title">Formulieren (forms)</h2>
      <ul class="task-list">
        {#each formTasks as f (f.id)}
          {@const s = $writingStore[f.id]}
          <li>
            <button class="task-row" onclick={() => openForm(f)}>
              <span class="task-main">
                <span class="task-title">{f.title}</span>
                <span class="task-meta">
                  <span class="badge form">form</span>
                  <span class="badge">{f.fields.length} fields</span>
                </span>
              </span>
              <span class="task-status">
                {#if s?.ready}
                  <span class="chip ok">Ready</span>
                {:else if s}
                  <span class="chip">{s.best}/{f.fields.length} correct</span>
                {:else}
                  <span class="chip muted">New</span>
                {/if}
              </span>
            </button>
          </li>
        {/each}
      </ul>

      <h2 class="group-title">Teksten (writing)</h2>
      <ul class="task-list">
        {#each writingTasks as t (t.id)}
          {@const s = $writingStore[t.id]}
          <li>
            <button class="task-row" onclick={() => open(t)}>
              <span class="task-main">
                <span class="task-title">{t.title}</span>
                <span class="task-meta">
                  <span class="badge">{t.kind}</span>
                  <span class="badge {t.register}">{t.register}</span>
                  <span class="badge">{t.minWords}-{t.maxWords} words</span>
                </span>
              </span>
              <span class="task-status">
                {#if s?.ready}
                  <span class="chip ok">Ready</span>
                {:else if s}
                  <span class="chip">{s.best}/{t.points.length} points</span>
                {:else}
                  <span class="chip muted">New</span>
                {/if}
              </span>
            </button>
          </li>
        {/each}
      </ul>
    {:else if formTask}
      <section class="card">
        <div class="card-head">
          <h2>{formTask.title}</h2>
          <span class="badge form">form</span>
        </div>
        <p class="situation">{formTask.situation}</p>
        {#if showEnglish}
          <p class="situation-en">{formTask.situationEn}</p>
        {/if}
        <button class="link" onclick={() => (showEnglish = !showEnglish)}>
          {showEnglish ? "Hide English" : "Show English"}
        </button>
        <blockquote class="source">{formTask.source}</blockquote>
      </section>

      <section class="card form">
        <h3>{formTask.formTitle}</h3>
        {#each formTask.fields as f (f.id)}
          {@const r = formResult?.fields.find((x) => x.field.id === f.id)}
          <div
            class="field"
            class:ok={phase === "result" && r?.correct}
            class:bad={phase === "result" && r && !r.correct}
          >
            <label for={f.id}>{f.label}</label>
            {#if f.kind === "choice"}
              <select
                id={f.id}
                bind:value={values[f.id]}
                disabled={phase === "result"}
              >
                <option value="" disabled selected>Kies...</option>
                {#each f.options ?? [] as o}
                  <option value={o}>{o}</option>
                {/each}
              </select>
            {:else if f.kind === "sentence"}
              <textarea
                id={f.id}
                rows="2"
                bind:value={values[f.id]}
                disabled={phase === "result"}
                spellcheck="false"
              ></textarea>
            {:else}
              <input
                id={f.id}
                type="text"
                bind:value={values[f.id]}
                placeholder={f.placeholder ?? ""}
                disabled={phase === "result"}
                spellcheck="false"
                autocomplete="off"
              />
            {/if}
            {#if phase === "result" && r && !r.correct}
              <p class="field-msg">
                {#if r.message}{r.message}{/if}
                <span class="expected">Expected: {f.answer}</span>
              </p>
            {/if}
          </div>
        {/each}

        {#if phase === "write"}
          <button class="primary" onclick={submitForm}>Check</button>
        {/if}
      </section>

      {#if phase === "result" && formResult}
        <section class="card">
          <div class="verdict {formResult.ready ? 'ok' : 'bad'}">
            {#if formResult.ready}
              Goed gedaan! Every field is correct.
            {:else}
              {formResult.correctCount} / {formResult.fields.length} correct.
              Check the red fields.
            {/if}
          </div>
        </section>
        <div class="actions">
          <button class="secondary" onclick={editAgain}>Edit my answers</button>
          <button class="primary" onclick={nextTask}>Next form</button>
        </div>
      {/if}
    {:else if task}
      <section class="card">
        <div class="card-head">
          <h2>{task.title}</h2>
          <span class="badge {task.register}">{task.register}</span>
        </div>
        <p class="situation">{task.situation}</p>
        {#if showEnglish}
          <p class="situation-en">{task.situationEn}</p>
        {/if}
        <button class="link" onclick={() => (showEnglish = !showEnglish)}>
          {showEnglish ? "Hide English" : "Show English"}
        </button>

        <p class="to">Aan: <strong>{task.recipient}</strong></p>

        <h3>Write about:</h3>
        <ul class="points">
          {#each task.points as p (p.id)}
            {@const hit = result?.points.find((x) => x.point.id === p.id)}
            <li class:covered={phase === "result" && hit?.covered}
              class:missed={phase === "result" && hit && !hit.covered}>
              <span class="point-mark">
                {#if phase !== "result"}•{:else if hit?.covered}✓{:else}✗{/if}
              </span>
              <span class="point-text">
                {p.nl}
                {#if showEnglish}<em>{p.en}</em>{/if}
              </span>
            </li>
          {/each}
        </ul>
      </section>

      {#if phase === "write"}
        <section class="card">
          <textarea
            bind:value={text}
            rows="10"
            placeholder="Schrijf hier je tekst..."
            spellcheck="false"
            autocapitalize="sentences"
          ></textarea>
          <div class="counter">
            <span class:bad={wordCount > task.maxWords}>
              {wordCount} words
            </span>
            <span class="range">
              target {task.minWords}-{task.maxWords}
            </span>
          </div>
          <button class="primary" onclick={submit} disabled={!text.trim()}>
            Check
          </button>
        </section>

        <section class="card">
          <button class="link" onclick={() => (showPhrases = !showPhrases)}>
            {showPhrases ? "Hide phrase bank" : "Show phrase bank"}
          </button>
          {#if showPhrases}
            <ul class="phrases">
              {#each task.phrases as ph}
                <li><span class="nl">{ph.nl}</span><span class="en">{ph.en}</span></li>
              {/each}
            </ul>
          {/if}
        </section>
      {:else if result}
        <section class="card">
          <div class="verdict {result.ready ? 'ok' : 'bad'}">
            {#if result.ready}
              Goed gedaan! This would pass the checks.
            {:else}
              Not there yet. Fix the items below and try again.
            {/if}
          </div>

          <ul class="checks">
            <li class={result.coveredCount === task.points.length ? "ok" : "bad"}>
              Points covered: {result.coveredCount} / {task.points.length}
            </li>
            <li class={rangeClass(result)}>
              Length: {result.wordCount} words
              {#if result.tooShort}(too short, min {task.minWords}){/if}
              {#if result.tooLong}(too long, max {task.maxWords}){/if}
            </li>
            <li class={result.hasGreeting ? "ok" : "bad"}>Greeting</li>
            <li class={result.hasClosing ? "ok" : "bad"}>Closing</li>
          </ul>

          {#if result.issues.length > 0}
            <h3>Hints</h3>
            <ul class="issues">
              {#each result.issues as issue}
                <li>{issue}</li>
              {/each}
            </ul>
          {/if}

          <p class="note">
            The checker looks for key words and common mistakes. It cannot
            judge everything. Compare with the model answer below.
          </p>
        </section>

        <section class="card">
          <h3>Your text</h3>
          <pre class="text">{text}</pre>
          <h3>Model answer</h3>
          <pre class="text model">{task.model}</pre>
        </section>

        <div class="actions">
          <button class="secondary" onclick={editAgain}>Edit my text</button>
          <button class="primary" onclick={nextTask}>Next task</button>
        </div>
      {/if}
    {/if}
  </main>
</div>

<style>
  .page {
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
    text-decoration: none;
    color: var(--color-text);
  }

  .flag {
    font-size: 1.4rem;
  }

  .brand-name {
    font-size: 1.2rem;
    font-weight: 700;
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
    padding: 0;
  }

  .nav-link:hover {
    color: var(--color-text);
  }

  .main {
    flex: 1;
    width: 100%;
    max-width: 680px;
    margin: 0 auto;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .head {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    text-align: center;
  }

  .group-title {
    margin: 0.5rem 0 0;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--color-muted);
  }

  .badge.form {
    background: #ede9fe;
    color: #5b21b6;
  }

  .source {
    margin: 0;
    padding: 0.85rem 1rem;
    border-left: 4px solid var(--color-accent);
    background: var(--color-bg);
    border-radius: 0 10px 10px 0;
    line-height: 1.6;
  }

  .card.form {
    gap: 1rem;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  .field label {
    font-size: 0.85rem;
    font-weight: 600;
  }

  .field input,
  .field select,
  .field textarea {
    width: 100%;
    border: 1px solid var(--color-border);
    border-radius: 10px;
    padding: 0.7rem 0.85rem;
    font-size: 1rem;
    background: var(--color-bg);
    color: var(--color-text);
  }

  .field input:focus,
  .field select:focus,
  .field textarea:focus {
    outline: 2px solid var(--color-accent);
    outline-offset: 0;
  }

  .field.ok input,
  .field.ok select,
  .field.ok textarea {
    border-color: #22c55e;
    background: #f0fdf4;
  }

  .field.bad input,
  .field.bad select,
  .field.bad textarea {
    border-color: #ef4444;
    background: #fef2f2;
  }

  .field-msg {
    margin: 0;
    font-size: 0.85rem;
    color: #991b1b;
  }

  .field-msg .expected {
    display: block;
    font-weight: 700;
  }

  .head h1 {
    margin: 0;
    font-size: 2rem;
    font-weight: 800;
  }

  .sub {
    margin: 0;
    color: var(--color-muted);
  }

  .progress {
    margin: 0;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--color-muted);
  }

  .task-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }

  .task-row {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    text-align: left;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    padding: 0.9rem 1rem;
    cursor: pointer;
    transition: border-color 0.15s;
  }

  .task-row:hover {
    border-color: var(--color-accent);
  }

  .task-main {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  .task-title {
    font-weight: 700;
    color: var(--color-text);
  }

  .task-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
  }

  .badge {
    font-size: 0.7rem;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 20px;
    background: var(--color-surface-alt);
    color: var(--color-muted);
  }

  .badge.formal {
    background: #dbeafe;
    color: #1e40af;
  }

  .badge.informal {
    background: #fef3c7;
    color: #92400e;
  }

  .chip {
    font-size: 0.75rem;
    font-weight: 700;
    padding: 4px 10px;
    border-radius: 20px;
    background: #fef3c7;
    color: #92400e;
    white-space: nowrap;
  }

  .chip.ok {
    background: #dcfce7;
    color: #166534;
  }

  .chip.muted {
    background: var(--color-surface-alt);
    color: var(--color-muted);
  }

  .card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 14px;
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .card-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
  }

  .card h2 {
    margin: 0;
    font-size: 1.25rem;
  }

  .card h3 {
    margin: 0.25rem 0 0;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--color-muted);
  }

  .situation {
    margin: 0;
    font-size: 1.05rem;
  }

  .situation-en {
    margin: 0;
    color: var(--color-muted);
    font-style: italic;
  }

  .to {
    margin: 0;
    font-size: 0.9rem;
    color: var(--color-muted);
  }

  .points {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .points li {
    display: flex;
    gap: 0.6rem;
    align-items: baseline;
  }

  .points li.covered {
    color: #166534;
  }

  .points li.missed {
    color: #991b1b;
  }

  .point-mark {
    font-weight: 700;
    width: 1rem;
    text-align: center;
  }

  .point-text em {
    display: block;
    font-size: 0.85rem;
    color: var(--color-muted);
  }

  textarea {
    width: 100%;
    resize: vertical;
    border: 1px solid var(--color-border);
    border-radius: 10px;
    padding: 0.85rem;
    font-size: 1rem;
    line-height: 1.5;
    background: var(--color-bg);
    color: var(--color-text);
  }

  textarea:focus {
    outline: 2px solid var(--color-accent);
    outline-offset: 0;
  }

  .counter {
    display: flex;
    justify-content: space-between;
    font-size: 0.85rem;
    font-weight: 600;
  }

  .counter .range {
    color: var(--color-muted);
    font-weight: 500;
  }

  .counter .bad {
    color: var(--color-again);
  }

  .primary,
  .secondary {
    border: none;
    border-radius: 12px;
    padding: 0.85rem 1.5rem;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    transition: opacity 0.15s;
  }

  .primary {
    background: var(--color-accent);
    color: white;
  }

  .secondary {
    background: var(--color-surface-alt);
    color: var(--color-text);
  }

  .primary:hover:not(:disabled),
  .secondary:hover {
    opacity: 0.88;
  }

  .primary:disabled {
    opacity: 0.45;
    cursor: default;
  }

  .link {
    align-self: flex-start;
    background: none;
    border: none;
    padding: 0;
    color: var(--color-accent);
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
  }

  .phrases {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .phrases li {
    display: flex;
    flex-direction: column;
  }

  .phrases .nl {
    font-weight: 600;
  }

  .phrases .en {
    font-size: 0.85rem;
    color: var(--color-muted);
  }

  .verdict {
    padding: 0.85rem 1rem;
    border-radius: 10px;
    font-weight: 700;
  }

  .verdict.ok {
    background: #dcfce7;
    color: #166534;
  }

  .verdict.bad {
    background: #fee2e2;
    color: #991b1b;
  }

  .checks,
  .issues {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  .checks li::before {
    display: inline-block;
    width: 1.25rem;
    font-weight: 700;
  }

  .checks li.ok {
    color: #166534;
  }

  .checks li.ok::before {
    content: "✓";
  }

  .checks li.bad {
    color: #991b1b;
  }

  .checks li.bad::before {
    content: "✗";
  }

  .issues li {
    padding-left: 0.25rem;
    color: var(--color-text);
  }

  .note {
    margin: 0;
    font-size: 0.8rem;
    color: var(--color-muted);
  }

  .text {
    margin: 0;
    white-space: pre-wrap;
    font-family: inherit;
    font-size: 1rem;
    line-height: 1.55;
    padding: 0.85rem;
    border-radius: 10px;
    background: var(--color-bg);
  }

  .text.model {
    background: #f0fdf4;
  }

  .actions {
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;
    flex-wrap: wrap;
  }
</style>

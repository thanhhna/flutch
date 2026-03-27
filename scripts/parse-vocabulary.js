#!/usr/bin/env node
// Parses the 4 Dutch vocabulary markdown files and writes src/data/vocabulary.json

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '../src/lib/data');
const SRC_DIR = join(__dirname, '../resources');

function makeId(str) {
  return str.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
}

function parsePipeTable(content, skipCols = 1) {
  const lines = content.split('\n');
  // Skip header (index 0) and separator (index 1)
  return lines.slice(2).filter(l => l.trim() && l.includes('|')).map(line => {
    const cells = line.split('|').map(c => c.trim()).filter((_, i) => i > 0);
    return cells;
  }).filter(cells => cells.length >= skipCols && cells[0]);
}

function parseNouns(content) {
  const rows = parsePipeTable(content);
  return rows.map(([article, dutch, english]) => ({
    id: `noun_${makeId(dutch)}`,
    category: 'noun',
    article: article?.trim() || '',
    dutch: dutch?.trim() || '',
    english: english?.trim() || '',
  })).filter(e => e.dutch && e.english && e.article);
}

function parseVerbs(content) {
  const rows = parsePipeTable(content);
  return rows.map(([infinitive, presentPerfect, pastSingular, pastPlural, english]) => ({
    id: `verb_${makeId(infinitive)}`,
    category: 'verb',
    dutch: infinitive?.trim() || '',
    infinitive: infinitive?.trim() || '',
    presentPerfect: presentPerfect?.trim() || '',
    pastSingular: pastSingular?.trim() || '',
    pastPlural: pastPlural?.trim() || '',
    english: english?.trim() || '',
  })).filter(e => e.dutch && e.english);
}

function parseAdjAdv(content) {
  const rows = parsePipeTable(content);
  return rows.map(([dutch, english]) => ({
    id: `adj_${makeId(dutch)}`,
    category: 'adjective',
    dutch: dutch?.trim() || '',
    english: english?.trim() || '',
  })).filter(e => e.dutch && e.english);
}

function parsePrepositions(content) {
  const lines = content.split('\n');
  const entries = [];
  let currentGroup = 'general';
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith('## ')) {
      currentGroup = trimmed.slice(3).trim();
      continue;
    }
    if (trimmed.startsWith('#')) continue;
    // Lines like "in in" or "naar towards" — first word is Dutch, rest is English
    const spaceIdx = trimmed.indexOf(' ');
    if (spaceIdx === -1) continue;
    const dutch = trimmed.slice(0, spaceIdx).trim();
    const english = trimmed.slice(spaceIdx + 1).trim();
    if (!dutch || !english) continue;
    entries.push({
      id: `prep_${makeId(dutch)}_${makeId(currentGroup)}`,
      category: 'preposition',
      dutch,
      english,
      group: currentGroup,
    });
  }
  return entries;
}

try {
  const nouns = parseNouns(readFileSync(join(SRC_DIR, 'noun.md'), 'utf-8'));
  const verbs = parseVerbs(readFileSync(join(SRC_DIR, 'verb.md'), 'utf-8'));
  const adjAdv = parseAdjAdv(readFileSync(join(SRC_DIR, 'adj-adv.md'), 'utf-8'));
  const preps = parsePrepositions(readFileSync(join(SRC_DIR, 'preposition.md'), 'utf-8'));

  const vocabulary = { nouns, verbs, adjectives: adjAdv, prepositions: preps };

  mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(join(DATA_DIR, 'vocabulary.json'), JSON.stringify(vocabulary, null, 2));

  console.log('Parsed vocabulary:');
  console.log(`  Nouns:       ${nouns.length}`);
  console.log(`  Verbs:       ${verbs.length}`);
  console.log(`  Adjectives:  ${adjAdv.length}`);
  console.log(`  Prepositions:${preps.length}`);
  console.log(`  Total:       ${nouns.length + verbs.length + adjAdv.length + preps.length}`);
  console.log('Written to src/lib/data/vocabulary.json');
} catch (err) {
  console.error('Parse failed:', err.message);
  process.exit(1);
}

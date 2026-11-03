import type { CheckResult, WritingTask } from "./types";

const GREETING = /^\s*(beste|hallo|hoi|dag|geachte|lieve|hi)\b/i;
const CLOSING =
  /(groet|groeten|groetjes|tot ziens|tot snel|tot dan|tot zaterdag|tot morgen|liefs|alvast bedankt|bij voorbaat dank)/i;
const INFORMAL_MARKERS = /\b(je|jij|jou|jouw|hoi|groetjes|liefs)\b/i;
const FORMAL_MARKERS = /\b(u|uw)\b/i;

const SENTENCE_START = "(?:^|[.!?]\\s+|\\n)";
const SUBJECT = "(?:ik|jij|je|u|hij|zij|ze|wij|we|het)";

type Rule = {
  re: RegExp;
  message: string;
};

const GRAMMAR_RULES: Rule[] = [
  {
    re: new RegExp(
      `${SENTENCE_START}(?:morgen|gisteren|vandaag|daarna|dan|nu|vanavond|vanmorgen|misschien|helaas|later|eerst)\\s+${SUBJECT}\\s+(?:ben|bent|is|heb|hebt|heeft|kan|kunt|moet|moeten|wil|wilt|ga|gaat|kom|komt|werk|werkt|woon|woont|zie|ziet|bel|belt)\\b`,
      "i",
    ),
    message:
      "After a time word the verb comes second: 'Morgen kom ik', not 'Morgen ik kom'.",
  },
  {
    re: /\bik\s+(heeft|is|bent|zijn|hebben)\b/i,
    message: "Check the verb after 'ik': 'ik heb', 'ik ben', 'ik ga'.",
  },
  {
    re: /\b(hij|zij|ze|het)\s+(ben|bent|heb|hebt)\b/i,
    message: "Check the verb after 'hij/zij/het': 'hij heeft', 'zij is'.",
  },
  {
    re: /\b(jij|je|u)\s+(ben|heb)\b/i,
    message: "Check the verb after 'jij/u': 'je hebt', 'je bent', 'u heeft'.",
  },
  {
    re: /\b(wij|we)\s+(is|ben|bent|heb|heeft)\b/i,
    message: "Check the verb after 'wij/we': 'we hebben', 'we zijn'.",
  },
  {
    re: /\bik\s+(wil|moet|kan|ga)\s+\w+\s+(wil|moet|kan|ga)\b/i,
    message: "Two modal verbs in a row look wrong. Rephrase the sentence.",
  },
];

export function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function lines(text: string) {
  return text
    .split(/\n/)
    .map((l) => l.trim())
    .filter(Boolean);
}

export function checkWriting(task: WritingTask, text: string): CheckResult {
  const wordCount = countWords(text);
  const tooShort = wordCount < task.minWords;
  const tooLong = wordCount > task.maxWords;
  const nonEmpty = lines(text);

  const hasGreeting = GREETING.test(text);
  const tail = nonEmpty.slice(-3).join(" ");
  const hasClosing = CLOSING.test(tail);

  const points = task.points.map((point) => ({
    point,
    covered: new RegExp(point.pattern, "i").test(text),
  }));
  const coveredCount = points.filter((p) => p.covered).length;

  const issues: string[] = [];

  if (!hasGreeting) {
    issues.push(
      task.register === "formal"
        ? "Start with a greeting: 'Geachte heer/mevrouw,' or 'Beste ...,'."
        : "Start with a greeting: 'Hoi ...,' or 'Beste ...,'.",
    );
  }
  if (!hasClosing) {
    issues.push(
      task.register === "formal"
        ? "End with a closing: 'Met vriendelijke groet,' and your name."
        : "End with a closing: 'Groetjes,' or 'Tot snel,' and your name.",
    );
  }

  if (task.register === "formal" && INFORMAL_MARKERS.test(text)) {
    issues.push(
      "This is formal: use 'u/uw' and avoid 'je/jij/hoi/groetjes'.",
    );
  }
  if (task.register === "informal" && FORMAL_MARKERS.test(text)) {
    issues.push("This is informal: use 'je/jij' instead of 'u/uw'.");
  }

  if (nonEmpty.some((l) => /^[a-zà-ÿ]/.test(l))) {
    issues.push("Start every line with a capital letter.");
  }
  if (/[.!?]\s+[a-zà-ÿ]/.test(text)) {
    issues.push("Start every sentence with a capital letter.");
  }

  const punctuation = (text.match(/[.!?]/g) ?? []).length;
  if (wordCount >= 20 && punctuation < Math.floor(wordCount / 20)) {
    issues.push("Use full stops. Write shorter sentences.");
  }

  for (const rule of GRAMMAR_RULES) {
    if (rule.re.test(text)) issues.push(rule.message);
  }

  const ready =
    coveredCount === task.points.length &&
    hasGreeting &&
    hasClosing &&
    !tooShort &&
    !tooLong &&
    issues.length === 0;

  return {
    wordCount,
    wordsOk: !tooShort && !tooLong,
    tooShort,
    tooLong,
    hasGreeting,
    hasClosing,
    points,
    coveredCount,
    issues,
    ready,
  };
}

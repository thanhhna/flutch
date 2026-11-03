export type Register = "formal" | "informal";
export type TaskKind = "email" | "note" | "message";

export type TaskPoint = {
  id: string;
  nl: string;
  en: string;
  pattern: string;
};

export type Phrase = {
  nl: string;
  en: string;
};

export type WritingTask = {
  id: string;
  title: string;
  kind: TaskKind;
  register: Register;
  situation: string;
  situationEn: string;
  recipient: string;
  points: TaskPoint[];
  minWords: number;
  maxWords: number;
  phrases: Phrase[];
  model: string;
};

export type PointResult = {
  point: TaskPoint;
  covered: boolean;
};

export type CheckResult = {
  wordCount: number;
  wordsOk: boolean;
  tooShort: boolean;
  tooLong: boolean;
  hasGreeting: boolean;
  hasClosing: boolean;
  points: PointResult[];
  coveredCount: number;
  issues: string[];
  ready: boolean;
};

export type WritingAttempt = {
  attempts: number;
  best: number;
  last: string;
  lastDate: string;
  ready: boolean;
};

export type WritingStore = Record<string, WritingAttempt>;

export type FieldKind =
  | "text"
  | "date"
  | "postcode"
  | "phone"
  | "email"
  | "iban"
  | "number"
  | "choice"
  | "sentence";

export type FormField = {
  id: string;
  label: string;
  kind: FieldKind;
  answer: string;
  accept?: string[];
  options?: string[];
  placeholder?: string;
  pattern?: string;
};

export type FormTask = {
  id: string;
  title: string;
  formTitle: string;
  situation: string;
  situationEn: string;
  source: string;
  fields: FormField[];
};

export type FormFieldResult = {
  field: FormField;
  value: string;
  correct: boolean;
  message: string;
};

export type FormCheckResult = {
  fields: FormFieldResult[];
  correctCount: number;
  ready: boolean;
};

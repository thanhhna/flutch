import type {
  FormCheckResult,
  FormField,
  FormFieldResult,
  FormTask,
} from "./types";

const MONTHS: Record<string, number> = {
  januari: 1,
  februari: 2,
  maart: 3,
  april: 4,
  mei: 5,
  juni: 6,
  juli: 7,
  augustus: 8,
  september: 9,
  oktober: 10,
  november: 11,
  december: 12,
};

function squash(s: string) {
  return s.trim().replace(/\s+/g, " ");
}

export function normalizeDate(s: string) {
  const m = squash(s)
    .toLowerCase()
    .match(/^(\d{1,2})[-/. ]([a-z]+|\d{1,2})[-/. ](\d{4})$/);
  if (!m) return "";
  const month = /^\d+$/.test(m[2]) ? Number(m[2]) : MONTHS[m[2]];
  if (!month || month > 12) return "";
  const day = Number(m[1]);
  if (day < 1 || day > 31) return "";
  return `${day}-${month}-${m[3]}`;
}

function result(
  field: FormField,
  value: string,
  correct: boolean,
  message = "",
): FormFieldResult {
  return { field, value, correct, message };
}

function checkField(field: FormField, raw: string): FormFieldResult {
  const value = raw ?? "";
  const clean = squash(value);
  if (!clean) return result(field, value, false, "Not filled in.");

  switch (field.kind) {
    case "date": {
      const got = normalizeDate(clean);
      if (!got) {
        return result(
          field,
          value,
          false,
          "Write the date like 14-03-1990 or 14 maart 1990.",
        );
      }
      return result(field, value, field.open || got === normalizeDate(field.answer));
    }
    case "postcode": {
      if (!/^\d{4} ?[A-Z]{2}$/.test(clean)) {
        return result(
          field,
          value,
          false,
          "Postcode format: 4 digits and 2 capital letters, like 3511 AB.",
        );
      }
      const same =
        clean.replace(" ", "") === field.answer.replace(" ", "");
      return result(field, value, field.open || same);
    }
    case "phone": {
      if (field.open) {
        const ok = /^(?:0|\+31|0031)\d{9}$/.test(clean.replace(/[\s-]/g, ""));
        return result(
          field,
          value,
          ok,
          ok ? "" : "Write a Dutch phone number, like 06 12345678.",
        );
      }
      const same =
        clean.replace(/[^\d]/g, "") === field.answer.replace(/[^\d]/g, "");
      return result(field, value, same);
    }
    case "email": {
      if (!/^\S+@\S+\.\S+$/.test(clean)) {
        return result(field, value, false, "This is not an e-mail address.");
      }
      return result(
        field,
        value,
        field.open || clean.toLowerCase() === field.answer,
      );
    }
    case "iban": {
      const same =
        clean.replace(/\s/g, "").toUpperCase() ===
        field.answer.replace(/\s/g, "");
      return result(field, value, same);
    }
    case "number":
      return result(field, value, clean.replace(/\s/g, "") === field.answer);
    case "choice":
      return result(
        field,
        value,
        field.open
          ? (field.options ?? []).includes(clean)
          : clean === field.answer,
      );
    case "sentence": {
      const words = clean.split(" ").length;
      if (words < 3) {
        return result(field, value, false, "Write a full sentence.");
      }
      if (!/^[A-ZÀ-Þ]/.test(clean)) {
        return result(field, value, false, "Start with a capital letter.");
      }
      if (!/[.!?]$/.test(clean)) {
        return result(field, value, false, "End the sentence with a full stop.");
      }
      const ok = new RegExp(field.pattern ?? ".", "i").test(clean);
      return result(
        field,
        value,
        ok,
        ok ? "" : "The sentence does not match the information in the text.",
      );
    }
    default: {
      if (field.open) {
        const ok = /^[A-ZÀ-Þ0-9]/.test(clean);
        return result(field, value, ok, ok ? "" : "Start with a capital letter.");
      }
      const accepted = [field.answer, ...(field.accept ?? [])];
      if (accepted.includes(clean)) return result(field, value, true);
      const lower = accepted.some((a) => a.toLowerCase() === clean.toLowerCase());
      return result(
        field,
        value,
        false,
        lower ? "Check the capital letters." : "",
      );
    }
  }
}

export function checkForm(
  task: FormTask,
  values: Record<string, string>,
): FormCheckResult {
  const fields = task.fields.map((f) => checkField(f, values[f.id] ?? ""));
  const correctCount = fields.filter((f) => f.correct).length;
  return {
    fields,
    correctCount,
    ready: correctCount === fields.length,
  };
}

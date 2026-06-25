type TimestampValue =
  | string
  | { _seconds: number; _nanoseconds?: number }
  | null
  | undefined;

export function parseActivityDate(value: TimestampValue): Date | null {
  if (!value) {
    return null;
  }

  if (typeof value === "string") {
    const date = new Date(value);

    return Number.isNaN(date.getTime()) ? null : date;
  }

  if (typeof value === "object" && "_seconds" in value) {
    return new Date(value._seconds * 1000);
  }

  return null;
}

export function toActivityIso(value: TimestampValue): string | null {
  const date = parseActivityDate(value);

  return date ? date.toISOString() : null;
}

export function formatHistoricoDate(value: TimestampValue) {
  const date = parseActivityDate(value);

  if (!date) {
    return "—";
  }

  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

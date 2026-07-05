/** Normaliza valor monetário BR para envio ao backend (ex.: "1.250,50"). */
export function normalizeInvoiceValueInput(value: string): string {
  return value.trim();
}

export function parseInvoiceValue(value: string): number | null {
  const normalized = value
    .trim()
    .replace(/\s/g, "")
    .replace(/\.(?=\d{3}(\D|$))/g, "")
    .replace(",", ".");

  const parsed = Number(normalized);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}

export function isValidInvoiceValueInput(value: string): boolean {
  return parseInvoiceValue(value) !== null;
}

const STORAGE_KEY = "postoapp-remembered-email";

export function getRememberedEmail(): string {
  if (typeof window === "undefined") return "";
  try {
    return localStorage.getItem(STORAGE_KEY)?.trim() ?? "";
  } catch {
    return "";
  }
}

export function rememberEmail(email: string): void {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return;

  try {
    localStorage.setItem(STORAGE_KEY, normalized);
  } catch {
    // ignore quota / private mode
  }
}

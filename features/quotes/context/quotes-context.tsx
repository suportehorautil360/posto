"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { QuoteFormState } from "../types/quote";

const QUOTES_STORAGE_KEY = "postoapp-quotes-by-order";

type QuotesContextValue = {
  getQuote: (serviceOrderId: string) => QuoteFormState | null;
  saveQuote: (serviceOrderId: string, form: QuoteFormState) => void;
};

const QuotesContext = createContext<QuotesContextValue | null>(null);

function readStoredQuotes(): Record<string, QuoteFormState> {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = sessionStorage.getItem(QUOTES_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, QuoteFormState>) : {};
  } catch {
    return {};
  }
}

function writeStoredQuotes(quotes: Record<string, QuoteFormState>) {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.setItem(QUOTES_STORAGE_KEY, JSON.stringify(quotes));
}

export function QuotesProvider({ children }: { children: ReactNode }) {
  const [quotesByOrderId, setQuotesByOrderId] = useState<
    Record<string, QuoteFormState>
  >({});

  useEffect(() => {
    setQuotesByOrderId(readStoredQuotes());
  }, []);

  const getQuote = useCallback(
    (serviceOrderId: string) => quotesByOrderId[serviceOrderId] ?? null,
    [quotesByOrderId]
  );

  const saveQuote = useCallback(
    (serviceOrderId: string, form: QuoteFormState) => {
      setQuotesByOrderId((current) => {
        const next = {
          ...current,
          [serviceOrderId]: structuredClone(form),
        };

        writeStoredQuotes(next);
        return next;
      });
    },
    []
  );

  const value = useMemo(
    () => ({
      getQuote,
      saveQuote,
    }),
    [getQuote, saveQuote]
  );

  return (
    <QuotesContext.Provider value={value}>{children}</QuotesContext.Provider>
  );
}

export function useQuotes() {
  const context = useContext(QuotesContext);

  if (!context) {
    throw new Error("useQuotes must be used within QuotesProvider");
  }

  return context;
}

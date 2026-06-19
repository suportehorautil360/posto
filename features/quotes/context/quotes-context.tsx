"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { QuoteFormState } from "../types/quote";

type QuotesContextValue = {
  getQuote: (serviceOrderId: string) => QuoteFormState | null;
  saveQuote: (serviceOrderId: string, form: QuoteFormState) => void;
};

const QuotesContext = createContext<QuotesContextValue | null>(null);

export function QuotesProvider({ children }: { children: ReactNode }) {
  const [quotesByOrderId, setQuotesByOrderId] = useState<
    Record<string, QuoteFormState>
  >({});

  const getQuote = useCallback(
    (serviceOrderId: string) => quotesByOrderId[serviceOrderId] ?? null,
    [quotesByOrderId]
  );

  const saveQuote = useCallback(
    (serviceOrderId: string, form: QuoteFormState) => {
      setQuotesByOrderId((current) => ({
        ...current,
        [serviceOrderId]: structuredClone(form),
      }));
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

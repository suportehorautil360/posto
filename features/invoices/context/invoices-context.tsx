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
import { getNotasFiscaisOficina } from "../api/get-notas-fiscais-oficina";
import type { Invoice } from "../types/invoice";

type InvoicesContextValue = {
  invoices: Invoice[];
  isLoading: boolean;
  error: string | null;
  addInvoice: (invoice: Invoice) => void;
  refreshInvoices: () => Promise<void>;
};

const InvoicesContext = createContext<InvoicesContextValue | null>(null);

type InvoicesProviderProps = {
  oficinaId?: string;
  children: ReactNode;
};

export function InvoicesProvider({ oficinaId, children }: InvoicesProviderProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshInvoices = useCallback(async () => {
    if (!oficinaId) {
      setInvoices([]);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await getNotasFiscaisOficina(oficinaId);
      setInvoices(data);
    } catch (loadError) {
      setInvoices([]);
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Não foi possível carregar as notas fiscais."
      );
    } finally {
      setIsLoading(false);
    }
  }, [oficinaId]);

  useEffect(() => {
    void refreshInvoices();
  }, [refreshInvoices]);

  const addInvoice = useCallback((invoice: Invoice) => {
    setInvoices((current) => {
      const exists = current.some((item) => item.id === invoice.id);
      if (exists) {
        return current.map((item) =>
          item.id === invoice.id ? invoice : item
        );
      }

      return [invoice, ...current];
    });
  }, []);

  const value = useMemo(
    () => ({
      invoices,
      isLoading,
      error,
      addInvoice,
      refreshInvoices,
    }),
    [addInvoice, error, invoices, isLoading, refreshInvoices]
  );

  return (
    <InvoicesContext.Provider value={value}>{children}</InvoicesContext.Provider>
  );
}

export function useInvoices() {
  const context = useContext(InvoicesContext);

  if (!context) {
    throw new Error("useInvoices deve ser usado dentro de InvoicesProvider.");
  }

  return context;
}

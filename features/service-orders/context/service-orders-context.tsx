"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useOficinaStore } from "@/features/auth/store/oficina-store";
import { buildServiceOrderFromQuote } from "@/features/quotes/lib/map-quote-to-order";
import type { QuoteFormState } from "@/features/quotes/types/quote";
import { getSolicitacoesOficina } from "../api/get-solicitacoes-oficina";
import { mergeServiceOrders } from "../lib/merge-orders";
import { mapSolicitacoesToServiceOrders } from "../lib/map-solicitacao-to-order";
import type { ServiceOrder } from "../types/service-order";

type ServiceOrdersContextValue = {
  orders: ServiceOrder[];
  isLoading: boolean;
  error: string | null;
  refreshOrders: () => Promise<void>;
  getOrderById: (id: string) => ServiceOrder | undefined;
  updateOrder: (id: string, updates: Partial<ServiceOrder>) => void;
  createOrderFromQuote: (
    form: QuoteFormState,
    grandTotal: number
  ) => ServiceOrder;
};

const ServiceOrdersContext = createContext<ServiceOrdersContextValue | null>(
  null
);

export function ServiceOrdersProvider({ children }: { children: ReactNode }) {
  const oficina = useOficinaStore((state) => state.oficina);
  const oficinaId = oficina?.id;
  const [apiOrders, setApiOrders] = useState<ServiceOrder[]>([]);
  const [localOrders, setLocalOrders] = useState<ServiceOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const orders = mergeServiceOrders(apiOrders, localOrders);

  const refreshOrders = useCallback(async () => {
    if (!oficinaId) {
      setApiOrders([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const solicitacoes = await getSolicitacoesOficina(oficinaId);
      const mapContext = oficina
        ? {
            oficinaId: oficina.id,
            oficinaName: oficina.nomeFantasia || oficina.nome,
          }
        : undefined;

      setApiOrders(mapSolicitacoesToServiceOrders(solicitacoes, mapContext));
    } catch (loadError) {
      setApiOrders([]);
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Não foi possível carregar as OS da oficina."
      );
    } finally {
      setIsLoading(false);
    }
  }, [oficinaId, oficina]);

  useEffect(() => {
    void refreshOrders();
  }, [refreshOrders]);

  function getOrderById(id: string) {
    return orders.find((order) => order.id === id);
  }

  function updateOrder(id: string, updates: Partial<ServiceOrder>) {
    const updater = (current: ServiceOrder[]) =>
      current.map((order) =>
        order.id === id ? { ...order, ...updates } : order
      );

    setLocalOrders((current) =>
      current.some((order) => order.id === id) ? updater(current) : current
    );

    setApiOrders((current) =>
      current.some((order) => order.id === id) ? updater(current) : current
    );
  }

  function createOrderFromQuote(form: QuoteFormState, grandTotal: number) {
    const order = buildServiceOrderFromQuote(form, grandTotal, orders);
    setLocalOrders((current) => [order, ...current]);
    return order;
  }

  return (
    <ServiceOrdersContext.Provider
      value={{
        orders,
        isLoading,
        error,
        refreshOrders,
        getOrderById,
        updateOrder,
        createOrderFromQuote,
      }}
    >
      {children}
    </ServiceOrdersContext.Provider>
  );
}

export function useServiceOrders() {
  const context = useContext(ServiceOrdersContext);

  if (!context) {
    throw new Error(
      "useServiceOrders must be used within ServiceOrdersProvider"
    );
  }

  return context;
}

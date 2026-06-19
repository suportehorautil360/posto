"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { initialServiceOrders } from "../data/service-orders";
import { buildServiceOrderFromQuote } from "@/features/quotes/lib/map-quote-to-order";
import type { QuoteFormState } from "@/features/quotes/types/quote";
import type { ServiceOrder } from "../types/service-order";

type ServiceOrdersContextValue = {
  orders: ServiceOrder[];
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
  const [orders, setOrders] = useState<ServiceOrder[]>(initialServiceOrders);

  function getOrderById(id: string) {
    return orders.find((order) => order.id === id);
  }

  function updateOrder(id: string, updates: Partial<ServiceOrder>) {
    setOrders((current) =>
      current.map((order) =>
        order.id === id ? { ...order, ...updates } : order
      )
    );
  }

  function createOrderFromQuote(form: QuoteFormState, grandTotal: number) {
    const order = buildServiceOrderFromQuote(form, grandTotal, orders);
    setOrders((current) => [order, ...current]);
    return order;
  }

  return (
    <ServiceOrdersContext.Provider
      value={{
        orders,
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

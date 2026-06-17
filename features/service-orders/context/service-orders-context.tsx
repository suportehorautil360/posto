"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { initialServiceOrders } from "../data/service-orders";
import {
  mapCreateFormToServiceOrder,
  type CreateOrderFormPayload,
} from "../lib/map-create-order";
import type { ServiceOrder } from "../types/service-order";

type ServiceOrdersContextValue = {
  orders: ServiceOrder[];
  addOrder: (payload: CreateOrderFormPayload) => ServiceOrder;
};

const ServiceOrdersContext = createContext<ServiceOrdersContextValue | null>(
  null
);

export function ServiceOrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<ServiceOrder[]>(initialServiceOrders);

  function addOrder(payload: CreateOrderFormPayload) {
    const order = mapCreateFormToServiceOrder(payload);
    setOrders((current) => [order, ...current]);
    return order;
  }

  return (
    <ServiceOrdersContext.Provider value={{ orders, addOrder }}>
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

"use client";

import type { ReactNode } from "react";
import { ServiceOrdersProvider } from "@/features/service-orders/context/service-orders-context";

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return <ServiceOrdersProvider>{children}</ServiceOrdersProvider>;
}

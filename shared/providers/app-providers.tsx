"use client";

import type { ReactNode } from "react";
import { QuotesProvider } from "@/features/quotes/context/quotes-context";
import { ServiceOrdersProvider } from "@/features/service-orders/context/service-orders-context";

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ServiceOrdersProvider>
      <QuotesProvider>{children}</QuotesProvider>
    </ServiceOrdersProvider>
  );
}

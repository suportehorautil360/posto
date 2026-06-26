"use client";

import { useOficinaStore } from "@/features/auth/store/oficina-store";
import { InvoicesProvider } from "../context/invoices-context";
import { InvoicesPage } from "./invoices-page";

export function InvoicesPageShell() {
  const oficina = useOficinaStore((state) => state.oficina);

  return (
    <InvoicesProvider oficinaId={oficina?.id}>
      <InvoicesPage />
    </InvoicesProvider>
  );
}

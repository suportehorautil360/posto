"use client";

import { useOficinaStore } from "@/features/auth/store/oficina-store";
import { SupportProvider } from "../context/support-context";
import { SupportPage } from "./support-page";

export function SupportPageShell() {
  const oficina = useOficinaStore((state) => state.oficina);

  return (
    <SupportProvider oficinaId={oficina?.id}>
      <SupportPage />
    </SupportProvider>
  );
}

"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useOficinaStore } from "@/features/auth/store/oficina-store";

export function PrintStoreHydration({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const finishHydration = () => setIsReady(true);

    if (useOficinaStore.persist.hasHydrated()) {
      finishHydration();
      return;
    }

    const unsubscribe = useOficinaStore.persist.onFinishHydration(finishHydration);
    useOficinaStore.persist.rehydrate();

    return unsubscribe;
  }, []);

  if (!isReady) {
    return null;
  }

  return children;
}

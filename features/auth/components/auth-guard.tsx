"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useOficinaStore } from "../store/oficina-store";

type AuthGuardProps = {
  children: React.ReactNode;
};

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const oficina = useOficinaStore((state) => state.oficina);
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

  useEffect(() => {
    if (!isReady) return;

    if (!oficina) {
      router.replace("/login");
    }
  }, [isReady, oficina, router]);

  if (!isReady || !oficina) {
    return null;
  }

  return children;
}

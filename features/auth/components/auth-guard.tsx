"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/auth-store";
import { useOficinaStore } from "../store/oficina-store";

type AuthGuardProps = {
  children: React.ReactNode;
};

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const oficina = useOficinaStore((state) => state.oficina);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const finishHydration = () => setIsReady(true);

    const authHydrated = useAuthStore.persist.hasHydrated();
    const oficinaHydrated = useOficinaStore.persist.hasHydrated();

    if (authHydrated && oficinaHydrated) {
      finishHydration();
      return;
    }

    const unsubAuth = useAuthStore.persist.onFinishHydration(() => {
      if (useOficinaStore.persist.hasHydrated()) {
        finishHydration();
      }
    });

    const unsubOficina = useOficinaStore.persist.onFinishHydration(() => {
      if (useAuthStore.persist.hasHydrated()) {
        finishHydration();
      }
    });

    useAuthStore.persist.rehydrate();
    useOficinaStore.persist.rehydrate();

    return () => {
      unsubAuth();
      unsubOficina();
    };
  }, []);

  useEffect(() => {
    if (!isReady) return;

    if (!token || !oficina) {
      router.replace("/login");
    }
  }, [isReady, token, oficina, router]);

  if (!isReady || !token || !oficina) {
    return null;
  }

  return children;
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "../store/auth-store";
import { useOficinaStore } from "../store/oficina-store";
import { ChangePasswordModal } from "./change-password-modal";

type AuthGuardProps = {
  children: React.ReactNode;
};

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const oficina = useOficinaStore((state) => state.oficina);
  const [isReady, setIsReady] = useState(false);

  const mustChangePassword = Boolean(user?.mustChangePassword);

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

  return (
    <>
      <div
        className={cn(
          "min-h-full transition-[filter]",
          mustChangePassword && "pointer-events-none select-none blur-[6px]",
        )}
      >
        {children}
      </div>
      <ChangePasswordModal open={mustChangePassword} />
    </>
  );
}

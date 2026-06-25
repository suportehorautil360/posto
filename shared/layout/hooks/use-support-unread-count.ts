"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useOficinaStore } from "@/features/auth/store/oficina-store";
import { getSupportSummary } from "@/features/support/api/get-support-summary";

export function useSupportUnreadCount() {
  const oficinaId = useOficinaStore((state) => state.oficina?.id);
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);

  const refresh = useCallback(async () => {
    if (!oficinaId) {
      setUnreadCount(0);
      return;
    }

    try {
      const summary = await getSupportSummary(oficinaId);
      setUnreadCount(summary.unreadCount);
    } catch {
      setUnreadCount(0);
    }
  }, [oficinaId]);

  useEffect(() => {
    void refresh();
  }, [refresh, pathname]);

  return unreadCount;
}

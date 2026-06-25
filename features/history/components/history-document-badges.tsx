"use client";

import { cn } from "@/lib/utils";
import { historyPageConfig } from "../config/page";
import type { HistoricoActivityKind } from "../types/historico";

const badgeStyles: Record<HistoricoActivityKind, string> = {
  orcamento: "border-sky-200 bg-sky-50 text-sky-700",
  che: "border-violet-200 bg-violet-50 text-violet-700",
  chd: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

type HistoryDocumentBadgesProps = {
  kinds: HistoricoActivityKind[];
  className?: string;
};

export function HistoryDocumentBadges({
  kinds,
  className,
}: HistoryDocumentBadgesProps) {
  if (kinds.length === 0) {
    return <span className="text-sm text-zinc-400">—</span>;
  }

  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {kinds.map((kind) => (
        <span
          key={kind}
          className={cn(
            "inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold",
            badgeStyles[kind]
          )}
        >
          {historyPageConfig.documentLabels[kind]}
        </span>
      ))}
    </div>
  );
}

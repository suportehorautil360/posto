"use client";

import { ClipboardList } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { chePageConfig } from "../config/page";
import { getCheAutoNumber } from "../lib/form-defaults";

export function CheHeader({ orderCode }: { orderCode?: string }) {
  const autoNumber = getCheAutoNumber();

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-brand-navy/10 text-brand-navy">
            <ClipboardList className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-brand-navy">
              {chePageConfig.title}
            </h1>
            {orderCode ? (
              <p className="mt-1 text-sm text-zinc-500">
                Atendimento da {orderCode}
              </p>
            ) : null}
          </div>
        </div>
        <p className="text-xs text-zinc-500">
          {chePageConfig.meta.endpoint} · {chePageConfig.meta.contentType} · Número
          auto: {autoNumber}
        </p>
      </div>

      <Badge
        variant="outline"
        className="w-fit border-amber-200 bg-amber-50 text-amber-700"
      >
        {chePageConfig.prototypeBadge}
      </Badge>
    </div>
  );
}

"use client";

import { FileCheck2 } from "lucide-react";
import { chdPageConfig } from "../config/page";
import { getChdAutoNumber } from "../lib/form-defaults";

export function ChdHeader() {
  const autoNumber = getChdAutoNumber();

  return (
    <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-brand-navy/10 text-brand-navy">
            <FileCheck2 className="size-5" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-navy">
            {chdPageConfig.title}
          </h1>
        </div>
        <p className="text-xs text-zinc-500">
          {chdPageConfig.meta.endpoint} · {chdPageConfig.meta.contentType} · Número
          auto: {autoNumber}
        </p>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, CircleX, Trophy, XCircle } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { resultadoPageConfig } from "../config/resultado";
import type { ServiceOrder } from "../types/service-order";
import type { ServiceOrderOutcome } from "../types/order-resultado";
import { PregaoOrderDetailsDialog } from "./pregao-order-details-dialog";

function formatCurrency(value: number | null) {
  if (value === null) return "—";

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

const outcomeStyles: Record<
  ServiceOrderOutcome,
  {
    banner: string;
    icon: typeof Trophy;
    iconClass: string;
  }
> = {
  won: {
    banner: "border-emerald-200 bg-emerald-50 text-emerald-800",
    icon: Trophy,
    iconClass: "text-emerald-600",
  },
  lost: {
    banner: "border-zinc-200 bg-zinc-50 text-zinc-700",
    icon: CircleX,
    iconClass: "text-zinc-500",
  },
  rejected: {
    banner: "border-red-200 bg-red-50 text-red-700",
    icon: XCircle,
    iconClass: "text-red-500",
  },
};

type ResultadoCardProps = {
  order: ServiceOrder;
};

export function ResultadoCard({ order }: ResultadoCardProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const resultado = order.resultado;

  if (!resultado) return null;

  const copy = resultadoPageConfig.outcomes[resultado.outcome];
  const styles = outcomeStyles[resultado.outcome];
  const Icon = styles.icon;

  return (
    <article className="overflow-hidden rounded-xl border border-zinc-200/80 bg-white shadow-sm">
      <header className="bg-brand-navy px-5 py-4 text-white">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-base font-semibold">
              {order.code} · {order.client}
            </h3>
            <p className="mt-1 truncate text-sm text-white/80">
              {order.machine}
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-8 shrink-0 border-white/25 bg-white/10 text-white hover:bg-white/20 hover:text-white"
            onClick={() => setDetailsOpen(true)}
          >
            {resultadoPageConfig.viewDetails}
          </Button>
        </div>
      </header>

      <PregaoOrderDetailsDialog
        order={order}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />

      <div
        className={cn(
          "flex items-start gap-3 border-b border-zinc-100 px-5 py-4",
          styles.banner
        )}
      >
        <Icon className={cn("mt-0.5 size-5 shrink-0", styles.iconClass)} />
        <div>
          <p className="font-semibold">{copy.title}</p>
          <p className="mt-1 text-sm opacity-90">{copy.description}</p>
        </div>
      </div>

      <div className="grid gap-4 px-5 py-4 sm:grid-cols-3">
        <ResultadoMetric
          label={resultadoPageConfig.fields.yourBid}
          value={formatCurrency(resultado.yourBidValue)}
        />
        <ResultadoMetric
          label={resultadoPageConfig.fields.approvedValue}
          value={formatCurrency(resultado.approvedValue)}
          highlight={resultado.outcome === "won"}
        />
        <ResultadoMetric
          label={resultadoPageConfig.fields.approvedAt}
          value={resultado.approvedAt ?? "—"}
        />
      </div>

      {resultado.outcome === "won" ? (
        <footer className="border-t border-zinc-100 bg-zinc-50/70 px-5 py-4">
          <Link
            href={`/che/novo?orderId=${order.id}`}
            className={cn(
              buttonVariants(),
              "h-10 w-full bg-brand-orange text-white hover:bg-brand-orange-hover sm:w-auto"
            )}
          >
            <CheckCircle2 className="size-4" />
            {resultadoPageConfig.outcomes.won.action}
          </Link>
        </footer>
      ) : null}
    </article>
  );
}

function ResultadoMetric({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-lg border border-zinc-200/80 bg-zinc-50/70 px-4 py-3">
      <p className="text-[11px] font-semibold tracking-wide text-zinc-500 uppercase">
        {label}
      </p>
      <p
        className={cn(
          "mt-1 text-sm font-semibold",
          highlight ? "text-emerald-700" : "text-zinc-800"
        )}
      >
        {value}
      </p>
    </div>
  );
}

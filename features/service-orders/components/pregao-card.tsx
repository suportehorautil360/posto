"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { pregaoPageConfig } from "../config/pregao";
import { getPregaoBidDisplayName } from "../lib/anonymize-pregao-bids";
import {
  canEditQuoteForOrder,
  getQuoteEditUrl,
} from "../lib/order-quote-action";
import { getPregaoSummary } from "../lib/pregao-summary";
import type { PregaoBid } from "../types/pregao-bid";
import type { ServiceOrder } from "../types/service-order";
import { PregaoOrderDetailsDialog } from "./pregao-order-details-dialog";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function formatLeadTime(days: number | null) {
  if (days === null) return null;

  return `${days} ${pregaoPageConfig.daysSuffix}`;
}

type PregaoCardProps = {
  order: ServiceOrder;
};

export function PregaoCard({ order }: PregaoCardProps) {
  const bids = order.pregaoBids ?? [];
  const [detailsOpen, setDetailsOpen] = useState(false);
  const summary = useMemo(() => getPregaoSummary(bids), [bids]);
  const canEditQuote = canEditQuoteForOrder(order);

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
            {pregaoPageConfig.viewDetails}
          </Button>
        </div>
      </header>

      <PregaoOrderDetailsDialog
        order={order}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />

      <div className="hidden border-b border-zinc-100 bg-zinc-50/60 px-5 py-2.5 text-[11px] font-semibold tracking-wide text-zinc-500 uppercase sm:grid sm:grid-cols-[minmax(0,1.4fr)_88px_minmax(140px,1fr)]">
        <span>{pregaoPageConfig.participantLabel}</span>
        <span>{pregaoPageConfig.leadTimeLabel}</span>
        <span className="text-right">{pregaoPageConfig.valueLabel}</span>
      </div>

      <div className="divide-y divide-zinc-100">
        {(() => {
          let competitorIndex = 0;

          return bids.map((bid) => {
            const rowCompetitorIndex = bid.isCurrentUser
              ? 0
              : ++competitorIndex;

            return (
              <PregaoBidRow
                key={bid.id}
                bid={bid}
                competitorIndex={rowCompetitorIndex}
                isLowest={summary.lowestBidId === bid.id}
                editQuoteHref={
                  bid.isCurrentUser && canEditQuote
                    ? getQuoteEditUrl(order)
                    : undefined
                }
              />
            );
          });
        })()}
      </div>

      <footer className="space-y-1 border-t border-zinc-100 bg-zinc-50/70 px-5 py-4 text-sm">
        {summary.spread !== null && summary.spread > 0 ? (
          <p className="text-emerald-700">
            💰 {pregaoPageConfig.diffLabel}{" "}
            <span className="font-semibold">
              {formatCurrency(summary.spread)}
            </span>
          </p>
        ) : null}

        {summary.isUserLowest ? (
          <p className="font-medium text-emerald-700">
            {pregaoPageConfig.tiedLowest}
          </p>
        ) : null}

        {summary.aboveLowest !== null && summary.aboveLowest > 0 ? (
          <p className="font-medium text-red-600">
            {pregaoPageConfig.aboveLowest(formatCurrency(summary.aboveLowest))}
          </p>
        ) : null}
      </footer>
    </article>
  );
}

function PregaoBidRow({
  bid,
  competitorIndex,
  isLowest,
  editQuoteHref,
}: {
  bid: PregaoBid;
  competitorIndex: number;
  isLowest: boolean;
  editQuoteHref?: string;
}) {
  const leadTime = formatLeadTime(bid.leadTimeDays);
  const displayName = getPregaoBidDisplayName(bid, competitorIndex);
  const showLowestBadge = isLowest && bid.status === "submitted";

  return (
    <div
      className={cn(
        "grid gap-3 px-5 py-4 sm:grid-cols-[minmax(0,1.4fr)_88px_minmax(140px,1fr)] sm:items-center",
        bid.isCurrentUser && "bg-amber-50/80",
        !bid.isCurrentUser && isLowest && "bg-emerald-50/70"
      )}
    >
      <div className="flex min-w-0 items-center gap-2">
        <span className="truncate font-medium text-zinc-800">
          {displayName}
        </span>
        {bid.isCurrentUser ? (
          <Badge className="h-5 rounded-md border-0 bg-brand-orange px-1.5 text-[10px] font-bold tracking-wide text-white uppercase">
            {pregaoPageConfig.badges.you}
          </Badge>
        ) : null}
        {showLowestBadge ? (
          <Badge
            className={cn(
              "h-5 rounded-md border-0 px-1.5 text-[10px] font-bold tracking-wide text-white uppercase",
              bid.isCurrentUser ? "bg-emerald-600" : "bg-emerald-600"
            )}
          >
            {pregaoPageConfig.badges.lowest}
          </Badge>
        ) : null}
      </div>

      <p className="text-sm text-zinc-500">
        {leadTime ? (
          <>
            <span className="sr-only">{pregaoPageConfig.leadTimeLabel}: </span>
            {leadTime}
          </>
        ) : null}
      </p>

      <div className="flex items-center justify-end gap-2">
        {bid.status === "submitted" && bid.value !== null ? (
          <>
            <span
              className={cn(
                "text-base font-semibold",
                isLowest ? "text-emerald-700" : "text-zinc-800"
              )}
            >
              {formatCurrency(bid.value)}
            </span>
            {editQuoteHref ? (
              <Link
                href={editQuoteHref}
                className={cn(
                  buttonVariants({ variant: "outline", size: "icon-sm" }),
                  "size-8 shrink-0 border-zinc-200 bg-white text-brand-navy hover:bg-zinc-50"
                )}
                aria-label={pregaoPageConfig.editQuote}
                title={pregaoPageConfig.editQuote}
              >
                <Pencil className="size-4" />
              </Link>
            ) : null}
          </>
        ) : (
          <span className="text-sm text-zinc-400 italic">
            {pregaoPageConfig.waiting}
          </span>
        )}
      </div>
    </div>
  );
}

"use client";

import {
  CalendarDays,
  FileText,
  Gauge,
  Hash,
  Layers3,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { pregaoPageConfig } from "../config/pregao";
import type { ServiceOrder } from "../types/service-order";

type PregaoOrderDetailsDialogProps = {
  order: ServiceOrder;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type MetaItem = {
  label: string;
  value: string;
  icon: typeof CalendarDays;
};

function formatOrderMeasurement(order: ServiceOrder): string | undefined {
  const km = order.currentKm?.trim() || order.km?.trim();
  if (km) return `${km} km`;

  const hourMeter = order.hourMeter?.trim();
  if (hourMeter) return `${hourMeter} h`;

  const horimetro = order.horimetro?.trim();
  if (horimetro) return horimetro;

  return undefined;
}

function MetaCard({ label, value, icon: Icon }: MetaItem) {
  return (
    <div className="rounded-lg border border-zinc-200/80 bg-zinc-50/80 px-4 py-3">
      <div className="mb-2 flex items-center gap-2 text-zinc-500">
        <Icon className="size-3.5 shrink-0" />
        <span className="text-[11px] font-semibold tracking-wide uppercase">
          {label}
        </span>
      </div>
      <p className="text-sm leading-snug font-medium text-zinc-800">{value}</p>
    </div>
  );
}

export function PregaoOrderDetailsDialog({
  order,
  open,
  onOpenChange,
}: PregaoOrderDetailsDialogProps) {
  const measurement = formatOrderMeasurement(order);
  const chassis = order.chassisPrefix?.trim();

  const metaItems: MetaItem[] = [
    {
      label: pregaoPageConfig.fields.openedAt,
      value: order.openedAt,
      icon: CalendarDays,
    },
    ...(order.linha?.trim()
      ? [
          {
            label: pregaoPageConfig.fields.linha,
            value: order.linha,
            icon: Layers3,
          } satisfies MetaItem,
        ]
      : []),
    {
      label: pregaoPageConfig.fields.machine,
      value: order.machine,
      icon: Truck,
    },
    ...(chassis
      ? [
          {
            label: pregaoPageConfig.fields.chassis,
            value: chassis,
            icon: Hash,
          } satisfies MetaItem,
        ]
      : []),
    ...(measurement
      ? [
          {
            label: pregaoPageConfig.fields.measurement,
            value: measurement,
            icon: Gauge,
          } satisfies MetaItem,
        ]
      : []),
  ];

  const hasRelato = Boolean(order.relato?.trim());

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "gap-0 overflow-hidden p-0 sm:max-w-3xl",
          "ring-zinc-200/80"
        )}
      >
        <div className="bg-brand-navy px-6 py-5 text-white">
          <DialogHeader className="gap-1 text-left">
            <p className="text-xs font-semibold tracking-[0.14em] text-white/60 uppercase">
              {pregaoPageConfig.detailsTitle}
            </p>
            <DialogTitle className="text-xl font-semibold text-white">
              {order.code} · {order.client}
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className="space-y-5 px-6 py-5 lg:space-y-0">
          <div
            className={cn(
              "grid gap-5",
              hasRelato
                ? "lg:grid-cols-[240px_minmax(0,1fr)] lg:items-start"
                : "sm:grid-cols-2 lg:grid-cols-3"
            )}
          >
            <div className="space-y-3">
              {metaItems.map((item) => (
                <MetaCard key={item.label} {...item} />
              ))}
            </div>

            {hasRelato ? (
              <section className="flex min-h-0 flex-col space-y-3 lg:min-h-[220px]">
                <div className="flex items-center gap-2 text-zinc-500">
                  <FileText className="size-4 shrink-0" />
                  <h3 className="text-xs font-semibold tracking-wide uppercase">
                    {pregaoPageConfig.fields.relato}
                  </h3>
                </div>
                <div className="min-h-[180px] flex-1 overflow-y-auto rounded-xl border border-zinc-200/80 bg-zinc-50/50 px-4 py-4 lg:max-h-72">
                  <p className="text-sm leading-7 whitespace-pre-wrap text-zinc-700">
                    {order.relato}
                  </p>
                </div>
              </section>
            ) : null}
          </div>

          {!hasRelato ? (
            <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50/50 px-4 py-8 text-center text-sm text-zinc-500">
              {pregaoPageConfig.noDescription}
            </div>
          ) : null}
        </div>

        <DialogFooter className="mx-0 mb-0 border-t border-zinc-200/80 bg-zinc-50/60 px-6 py-4 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            className="min-w-28 border-zinc-200 bg-white"
            onClick={() => onOpenChange(false)}
          >
            {pregaoPageConfig.close}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

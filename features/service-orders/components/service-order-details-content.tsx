"use client";

import {
  CalendarDays,
  CalendarRange,
  FileText,
  Gauge,
  Layers3,
  Tag,
  Truck,
  UserRound,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { serviceOrderDetailsConfig } from "../config/order-details";
import {
  formatOrderMeasurement,
  formatScheduledAt,
  resolveServiceTypeLabel,
} from "../lib/format-order-measurement";
import type { ServiceOrder } from "../types/service-order";

type MetaItem = {
  label: string;
  value: string;
  icon: typeof CalendarDays;
};

type ServiceOrderDetailsContentProps = {
  order: ServiceOrder;
  variant?: "dialog" | "panel";
};

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

function buildMetaItems(order: ServiceOrder): MetaItem[] {
  const measurement = formatOrderMeasurement(order);
  const serviceTypeLabel = resolveServiceTypeLabel(order);
  const scheduledAt = formatScheduledAt(order.dataAgendamento);

  const items: MetaItem[] = [
    {
      label: serviceOrderDetailsConfig.fields.openedAt,
      value: order.openedAt,
      icon: CalendarDays,
    },
  ];

  if (scheduledAt) {
    items.push({
      label: serviceOrderDetailsConfig.fields.scheduledAt,
      value: scheduledAt,
      icon: CalendarRange,
    });
  }

  if (serviceTypeLabel) {
    items.push({
      label: serviceOrderDetailsConfig.fields.serviceType,
      value: serviceTypeLabel,
      icon: Tag,
    });
  }

  if (order.client.trim()) {
    items.push({
      label: serviceOrderDetailsConfig.fields.operator,
      value: order.client,
      icon: UserRound,
    });
  }

  items.push({
    label: serviceOrderDetailsConfig.fields.machine,
    value: order.machine,
    icon: Truck,
  });

  if (order.linha?.trim()) {
    items.push({
      label: serviceOrderDetailsConfig.fields.line,
      value: order.linha,
      icon: Layers3,
    });
  }

  if (order.chassisPrefix?.trim()) {
    items.push({
      label: serviceOrderDetailsConfig.fields.chassis,
      value: order.chassisPrefix,
      icon: Wrench,
    });
  }

  if (measurement) {
    items.push({
      label: order.currentKm?.trim()
        ? serviceOrderDetailsConfig.fields.currentKm
        : serviceOrderDetailsConfig.fields.hourMeter,
      value: measurement,
      icon: Gauge,
    });
  }

  return items;
}

export function ServiceOrderDetailsContent({
  order,
  variant = "dialog",
}: ServiceOrderDetailsContentProps) {
  const metaItems = buildMetaItems(order);
  const hasRelato = Boolean(order.relato?.trim());
  const isPanel = variant === "panel";

  return (
    <div className={cn("space-y-5", isPanel ? "px-0 py-0" : "px-6 py-5 lg:space-y-0")}>
      <div
        className={cn(
          "grid gap-5",
          hasRelato
            ? "lg:grid-cols-[minmax(240px,280px)_minmax(0,1fr)] lg:items-start"
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
                {serviceOrderDetailsConfig.fields.relato}
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
          {serviceOrderDetailsConfig.noDescription}
        </div>
      ) : null}
    </div>
  );
}

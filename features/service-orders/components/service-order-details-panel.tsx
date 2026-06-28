"use client";

import type { ServiceOrder } from "../types/service-order";
import { serviceOrderDetailsConfig } from "../config/order-details";
import { ServiceOrderDetailsContent } from "./service-order-details-content";

type ServiceOrderDetailsPanelProps = {
  order: ServiceOrder;
};

export function ServiceOrderDetailsPanel({ order }: ServiceOrderDetailsPanelProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-zinc-200/80 bg-white shadow-sm">
      <header className="border-b border-zinc-200/80 bg-brand-navy px-6 py-4 text-white">
        <p className="text-xs font-semibold tracking-[0.14em] text-white/60 uppercase">
          {serviceOrderDetailsConfig.title}
        </p>
        <h2 className="mt-1 text-lg font-semibold">
          {order.code} · {order.client}
        </h2>
        <p className="mt-1 text-sm text-white/75">{order.machine}</p>
      </header>
      <div className="px-6 py-5">
        <ServiceOrderDetailsContent order={order} variant="panel" />
      </div>
    </section>
  );
}

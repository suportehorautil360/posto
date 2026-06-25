import { cn } from "@/lib/utils";
import { invoicesPageConfig } from "../config/page";
import { formatInvoiceCurrency } from "../lib/format-invoice";
import type { InvoiceMonthStats } from "../types/invoice";

type InvoiceStatsCardsProps = {
  stats: InvoiceMonthStats;
};

function StatCard({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "success" | "warning";
}) {
  const valueClassName =
    tone === "success"
      ? "text-emerald-700"
      : tone === "warning"
        ? "text-brand-orange"
        : "text-brand-navy";

  return (
    <div className="rounded-xl border border-zinc-200/80 bg-white px-5 py-4 shadow-sm">
      <p className="text-[11px] font-semibold tracking-wide text-zinc-500 uppercase">
        {label}
      </p>
      <p className={cn("mt-2 text-2xl font-bold tracking-tight", valueClassName)}>
        {value}
      </p>
    </div>
  );
}

export function InvoiceStatsCards({ stats }: InvoiceStatsCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <StatCard
        label={invoicesPageConfig.stats.totalMonth}
        value={formatInvoiceCurrency(stats.totalValue)}
      />
      <StatCard
        label={invoicesPageConfig.stats.approved}
        value={formatInvoiceCurrency(stats.approvedValue)}
        tone="success"
      />
      <StatCard
        label={invoicesPageConfig.stats.pending}
        value={String(stats.pendingCount)}
        tone="warning"
      />
    </div>
  );
}

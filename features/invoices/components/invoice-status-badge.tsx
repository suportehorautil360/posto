import { cn } from "@/lib/utils";
import { invoiceStatusLabels } from "../config/page";
import type { InvoiceStatus } from "../types/invoice";

const statusStyles: Record<InvoiceStatus, string> = {
  aprovada: "border-emerald-200 bg-emerald-50 text-emerald-700",
  pendente: "border-amber-200 bg-amber-50 text-amber-700",
  rejeitada: "border-red-200 bg-red-50 text-red-700",
};

type InvoiceStatusBadgeProps = {
  status: InvoiceStatus;
  className?: string;
};

export function InvoiceStatusBadge({ status, className }: InvoiceStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide uppercase",
        statusStyles[status],
        className
      )}
    >
      {invoiceStatusLabels[status]}
    </span>
  );
}

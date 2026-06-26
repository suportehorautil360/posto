import { cn } from "@/lib/utils";
import { invoiceCategoryLabels } from "../config/page";
import type { InvoiceCategory } from "../types/invoice";

type InvoiceCategoryBadgeProps = {
  category: InvoiceCategory;
  className?: string;
};

export function InvoiceCategoryBadge({
  category,
  className,
}: InvoiceCategoryBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border border-zinc-200 bg-zinc-100 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-zinc-600 uppercase",
        className
      )}
    >
      {invoiceCategoryLabels[category]}
    </span>
  );
}

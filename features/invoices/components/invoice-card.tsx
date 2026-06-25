import Link from "next/link";
import { ExternalLink, KeyRound, Paperclip, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
import { invoicesPageConfig } from "../config/page";
import {
  formatAccessKey,
  formatInvoiceCurrency,
  formatInvoiceSummary,
} from "../lib/format-invoice";
import type { Invoice } from "../types/invoice";
import { InvoiceCategoryBadge } from "./invoice-category-badge";
import { InvoiceStatusBadge } from "./invoice-status-badge";

type InvoiceCardProps = {
  invoice: Invoice;
  className?: string;
};

export function InvoiceCard({ invoice, className }: InvoiceCardProps) {
  return (
    <article
      className={cn(
        "rounded-xl border border-zinc-200/80 bg-white p-5 shadow-sm transition-shadow hover:shadow-md",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-navy/10 text-brand-navy">
            <Wrench className="size-4" />
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-brand-navy">
              {invoice.description}
            </h3>
            <p className="mt-1 text-sm text-zinc-500">
              {formatInvoiceSummary(invoice)}
            </p>
          </div>
        </div>
        <p className="shrink-0 text-lg font-bold text-brand-navy">
          {formatInvoiceCurrency(invoice.value)}
        </p>
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-lg border border-zinc-200/80 bg-zinc-50/80 px-3 py-2.5">
        <KeyRound className="mt-0.5 size-4 shrink-0 text-zinc-400" />
        <div className="min-w-0">
          <p className="text-[11px] font-semibold tracking-wide text-zinc-500 uppercase">
            {invoicesPageConfig.fields.accessKey}
          </p>
          <p className="mt-1 break-all font-mono text-xs leading-relaxed text-zinc-700">
            {formatAccessKey(invoice.accessKey)}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <InvoiceCategoryBadge category={invoice.category} />
        <InvoiceStatusBadge status={invoice.status} />
        {invoice.fileUrl ? (
          <Link
            href={invoice.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-2.5 py-0.5 text-[11px] font-medium text-zinc-600 transition-colors hover:border-brand-orange/40 hover:text-brand-orange"
          >
            <Paperclip className="size-3" />
            {invoice.fileName}
            <ExternalLink className="size-3" />
          </Link>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-2.5 py-0.5 text-[11px] font-medium text-zinc-600">
            <Paperclip className="size-3" />
            {invoice.fileName}
          </span>
        )}
      </div>
    </article>
  );
}

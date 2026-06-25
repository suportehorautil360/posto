"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { invoicesPageConfig } from "../config/page";
import { filterInvoices } from "../lib/filter-invoices";
import type { Invoice, InvoiceFilter } from "../types/invoice";
import { InvoiceCard } from "./invoice-card";

type InvoiceListSectionProps = {
  invoices: Invoice[];
};

export function InvoiceListSection({ invoices }: InvoiceListSectionProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<InvoiceFilter>("todas");

  const filteredInvoices = useMemo(
    () => filterInvoices(invoices, search, statusFilter),
    [invoices, search, statusFilter]
  );

  return (
    <section className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-zinc-200" />
        <h2 className="text-sm font-semibold tracking-wide text-zinc-500 uppercase">
          {invoicesPageConfig.list.title}
        </h2>
        <div className="h-px flex-1 bg-zinc-200" />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-400" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={invoicesPageConfig.list.searchPlaceholder}
            className="h-10 border-zinc-200 bg-white pl-9 focus-visible:border-brand-orange focus-visible:ring-brand-orange/20"
          />
        </div>

        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as InvoiceFilter)}
        >
          <SelectTrigger className="h-10 w-full border-zinc-200 bg-white sm:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(invoicesPageConfig.filters).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredInvoices.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-200 bg-white px-6 py-12 text-center shadow-sm">
          <p className="text-base font-semibold text-brand-navy">
            {invoicesPageConfig.list.emptyTitle}
          </p>
          <p className="mt-2 text-sm text-zinc-500">
            {search || statusFilter !== "todas"
              ? invoicesPageConfig.list.filteredEmpty
              : invoicesPageConfig.list.emptyDescription}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredInvoices.map((invoice) => (
            <InvoiceCard key={invoice.id} invoice={invoice} />
          ))}
        </div>
      )}
    </section>
  );
}

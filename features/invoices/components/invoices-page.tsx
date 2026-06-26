"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { ReceiptText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOficinaStore } from "@/features/auth/store/oficina-store";
import { postNotaFiscal } from "../api/post-nota-fiscal";
import { invoicesPageConfig } from "../config/page";
import { useInvoices } from "../context/invoices-context";
import { computeMonthStats } from "../lib/filter-invoices";
import { InvoiceListSection } from "./invoice-list-section";
import { InvoiceStatsCards } from "./invoice-stats-cards";
import { InvoiceUploadSection } from "./invoice-upload-section";

export function InvoicesPage() {
  const oficina = useOficinaStore((state) => state.oficina);
  const { invoices, addInvoice, isLoading, error, refreshInvoices } =
    useInvoices();

  const stats = useMemo(() => computeMonthStats(invoices), [invoices]);

  async function handleUpload(file: File) {
    if (!oficina?.id) {
      throw new Error(invoicesPageConfig.states.noOficina);
    }

    const invoice = await postNotaFiscal(file);
    addInvoice(invoice);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-8 py-8"
    >
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-brand-navy/10 text-brand-navy">
            <ReceiptText className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-brand-navy">
              {invoicesPageConfig.title}
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              {invoicesPageConfig.subtitle}
            </p>
          </div>
        </div>
      </div>

      {!oficina?.id ? (
        <div className="rounded-xl border border-zinc-200/80 bg-white px-6 py-12 text-center text-sm text-zinc-500 shadow-sm">
          {invoicesPageConfig.states.noOficina}
        </div>
      ) : (
        <>
          <InvoiceStatsCards stats={stats} />
          <InvoiceUploadSection
            disabled={isLoading}
            onUpload={handleUpload}
          />

          {isLoading ? (
            <div className="rounded-xl border border-zinc-200/80 bg-white px-6 py-8 text-center text-sm text-zinc-500 shadow-sm">
              {invoicesPageConfig.states.loading}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center gap-4 rounded-xl border border-red-200 bg-red-50 px-6 py-8 text-center shadow-sm">
              <p className="text-sm text-red-600">{error}</p>
              <Button variant="outline" onClick={() => void refreshInvoices()}>
                {invoicesPageConfig.states.retry}
              </Button>
            </div>
          ) : (
            <InvoiceListSection invoices={invoices} />
          )}
        </>
      )}
    </motion.div>
  );
}

"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useQuotes } from "@/features/quotes/context/quotes-context";
import { resolveQuotePrefill } from "@/features/quotes/lib/resolve-quote-prefill";
import { useServiceOrders } from "@/features/service-orders/context/service-orders-context";
import type { ChecklistPrintPrefill } from "@/shared/config/checklist-print";
import { mapOrderToCheIdentification } from "../lib/map-order-to-che-form";
import { ChePrintForm } from "./che-print-form";

function buildChePrintPrefill(
  orderId: string | null,
  getOrderById: ReturnType<typeof useServiceOrders>["getOrderById"],
  getQuote: ReturnType<typeof useQuotes>["getQuote"]
): ChecklistPrintPrefill | undefined {
  if (!orderId) {
    return undefined;
  }

  const order = getOrderById(orderId);

  if (!order) {
    return undefined;
  }

  const quote = resolveQuotePrefill(order, getQuote(orderId));
  const identification = mapOrderToCheIdentification(order, quote);

  return {
    os: identification.os,
    client: identification.client,
    brandModel: identification.brandModel,
    platePrefix: identification.platePrefix,
    km: identification.km,
    hourMeter: identification.hourMeter,
  };
}

export function ChePrintPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const autoPrint = searchParams.get("auto") === "1";
  const autoDownloadPdf =
    searchParams.get("pdf") === "1" || searchParams.get("auto") === "pdf";
  const { getOrderById } = useServiceOrders();
  const { getQuote } = useQuotes();

  const prefill = useMemo(
    () => buildChePrintPrefill(orderId, getOrderById, getQuote),
    [orderId, getOrderById, getQuote]
  );

  return (
    <ChePrintForm
      prefill={prefill}
      autoPrint={autoPrint}
      autoDownloadPdf={autoDownloadPdf}
    />
  );
}

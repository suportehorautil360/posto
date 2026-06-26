"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useQuotes } from "@/features/quotes/context/quotes-context";
import { resolveQuotePrefill } from "@/features/quotes/lib/resolve-quote-prefill";
import { useServiceOrders } from "@/features/service-orders/context/service-orders-context";
import type { ChecklistPrintPrefill } from "@/shared/config/checklist-print";
import { mapOrderToChdIdentification } from "../lib/map-order-to-chd-form";
import { ChdPrintForm } from "./chd-print-form";

function buildChdPrintPrefill(
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
  const identification = mapOrderToChdIdentification(order, quote);

  return {
    os: identification.os,
    brandModel: identification.brandModel,
    platePrefix: identification.platePrefix,
    km: identification.currentKm,
    hourMeter: identification.hourMeter,
    driver: identification.driver,
    technicalResponsible: identification.technicalResponsible,
  };
}

export function ChdPrintPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const autoPrint = searchParams.get("auto") === "1";
  const autoDownloadPdf =
    searchParams.get("pdf") === "1" || searchParams.get("auto") === "pdf";
  const { getOrderById } = useServiceOrders();
  const { getQuote } = useQuotes();

  const prefill = useMemo(
    () => buildChdPrintPrefill(orderId, getOrderById, getQuote),
    [orderId, getOrderById, getQuote]
  );

  return (
    <ChdPrintForm
      prefill={prefill}
      autoPrint={autoPrint}
      autoDownloadPdf={autoDownloadPdf}
    />
  );
}

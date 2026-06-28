"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuotes } from "@/features/quotes/context/quotes-context";
import { resolveQuotePrefill } from "@/features/quotes/lib/resolve-quote-prefill";
import { useServiceOrders } from "@/features/service-orders/context/service-orders-context";
import type { ChecklistPrintPrefill } from "@/shared/config/checklist-print";
import { getChecklistChegadaById } from "../api/get-checklist-chegada";
import { mapCheChecklistToPrintPrefill } from "../lib/map-che-checklist-to-print-prefill";
import { mapOrderToCheIdentification } from "../lib/map-order-to-che-form";
import { ChePrintForm } from "./che-print-form";

function buildChePrintPrefillFromOrder(
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
  const checklistId = searchParams.get("checklistId");
  const orderId = searchParams.get("orderId");
  const autoPrint = searchParams.get("auto") === "1";
  const autoDownloadPdf =
    searchParams.get("pdf") === "1" || searchParams.get("auto") === "pdf";
  const { getOrderById } = useServiceOrders();
  const { getQuote } = useQuotes();
  const [checklistPrefill, setChecklistPrefill] = useState<
    ChecklistPrintPrefill | undefined
  >();
  const [isLoadingChecklist, setIsLoadingChecklist] = useState(Boolean(checklistId));

  const orderPrefill = useMemo(
    () => buildChePrintPrefillFromOrder(orderId, getOrderById, getQuote),
    [orderId, getOrderById, getQuote]
  );

  useEffect(() => {
    if (!checklistId) {
      setChecklistPrefill(undefined);
      setIsLoadingChecklist(false);
      return;
    }

    let cancelled = false;

    const id = checklistId;

    async function loadChecklistPrefill() {
      setIsLoadingChecklist(true);

      try {
        const checklist = await getChecklistChegadaById(id);

        if (!cancelled) {
          setChecklistPrefill(mapCheChecklistToPrintPrefill(checklist));
        }
      } catch {
        if (!cancelled) {
          setChecklistPrefill(undefined);
        }
      } finally {
        if (!cancelled) {
          setIsLoadingChecklist(false);
        }
      }
    }

    void loadChecklistPrefill();

    return () => {
      cancelled = true;
    };
  }, [checklistId]);

  const prefill = checklistPrefill ?? orderPrefill;

  if (isLoadingChecklist) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-100 px-6 text-sm text-zinc-600">
        Preparando PDF...
      </div>
    );
  }

  return (
    <ChePrintForm
      prefill={prefill}
      autoPrint={autoPrint}
      autoDownloadPdf={autoDownloadPdf}
    />
  );
}

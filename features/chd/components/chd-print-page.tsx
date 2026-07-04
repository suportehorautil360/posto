"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuotes } from "@/features/quotes/context/quotes-context";
import { resolveQuotePrefill } from "@/features/quotes/lib/resolve-quote-prefill";
import { useServiceOrders } from "@/features/service-orders/context/service-orders-context";
import type { ChecklistPrintPrefill } from "@/shared/config/checklist-print";
import { getChecklistDevolucaoById } from "../api/get-checklist-devolucao";
import { mapOrderToChdIdentification } from "../lib/map-order-to-chd-form";
import type { ChecklistDevolucao } from "../types/checklist-devolucao-api";
import { ChdFilledPrintForm } from "./chd-filled-print-form";
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

function ChdPrintLoadingState({ message }: { message: string }) {
  return (
    <div className="flex min-h-full items-center justify-center bg-zinc-100 px-6 py-16 text-sm text-zinc-600">
      {message}
    </div>
  );
}

type ChdFilledPrintLoaderProps = {
  checklistId: string;
  autoPrint: boolean;
  autoDownloadPdf: boolean;
};

function ChdFilledPrintLoader({
  checklistId,
  autoPrint,
  autoDownloadPdf,
}: ChdFilledPrintLoaderProps) {
  const [checklist, setChecklist] = useState<ChecklistDevolucao | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadChecklist() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const data = await getChecklistDevolucaoById(checklistId);

        if (!cancelled) {
          setChecklist(data);
        }
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Não foi possível carregar o checklist para impressão."
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadChecklist();

    return () => {
      cancelled = true;
    };
  }, [checklistId]);

  if (isLoading) {
    return <ChdPrintLoadingState message="Preparando PDF do checklist..." />;
  }

  if (errorMessage) {
    return <ChdPrintLoadingState message={errorMessage} />;
  }

  if (!checklist) {
    return (
      <ChdPrintLoadingState message="Checklist não encontrado para impressão." />
    );
  }

  return (
    <ChdFilledPrintForm
      checklist={checklist}
      autoPrint={autoPrint}
      autoDownloadPdf={autoDownloadPdf}
    />
  );
}

function ChdBlankPrintPage({
  orderId,
  autoPrint,
  autoDownloadPdf,
}: {
  orderId: string | null;
  autoPrint: boolean;
  autoDownloadPdf: boolean;
}) {
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

export function ChdPrintPage() {
  const searchParams = useSearchParams();
  const checklistId = searchParams.get("checklistId");
  const orderId = searchParams.get("orderId");
  const autoPrint = searchParams.get("auto") === "1";
  const autoDownloadPdf =
    searchParams.get("pdf") === "1" || searchParams.get("auto") === "pdf";

  if (checklistId) {
    return (
      <ChdFilledPrintLoader
        checklistId={checklistId}
        autoPrint={autoPrint}
        autoDownloadPdf={autoDownloadPdf}
      />
    );
  }

  return (
    <ChdBlankPrintPage
      orderId={orderId}
      autoPrint={autoPrint}
      autoDownloadPdf={autoDownloadPdf}
    />
  );
}

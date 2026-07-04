"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuotes } from "@/features/quotes/context/quotes-context";
import { resolveQuotePrefill } from "@/features/quotes/lib/resolve-quote-prefill";
import { useServiceOrders } from "@/features/service-orders/context/service-orders-context";
import type { ChecklistPrintPrefill } from "@/shared/config/checklist-print";
import { getChecklistChegadaById } from "../api/get-checklist-chegada";
import { mapOrderToCheIdentification } from "../lib/map-order-to-che-form";
import type { ChecklistChegada } from "../types/checklist-chegada-api";
import { CheFilledPrintForm } from "./che-filled-print-form";
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

function ChePrintLoadingState({ message }: { message: string }) {
  return (
    <div className="flex min-h-full items-center justify-center bg-zinc-100 px-6 py-16 text-sm text-zinc-600">
      {message}
    </div>
  );
}

type CheFilledPrintLoaderProps = {
  checklistId: string;
  autoPrint: boolean;
  autoDownloadPdf: boolean;
};

function CheFilledPrintLoader({
  checklistId,
  autoPrint,
  autoDownloadPdf,
}: CheFilledPrintLoaderProps) {
  const [checklist, setChecklist] = useState<ChecklistChegada | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadChecklist() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const data = await getChecklistChegadaById(checklistId);

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
    return <ChePrintLoadingState message="Preparando PDF do checklist..." />;
  }

  if (errorMessage) {
    return <ChePrintLoadingState message={errorMessage} />;
  }

  if (!checklist) {
    return (
      <ChePrintLoadingState message="Checklist não encontrado para impressão." />
    );
  }

  return (
    <CheFilledPrintForm
      checklist={checklist}
      autoPrint={autoPrint}
      autoDownloadPdf={autoDownloadPdf}
    />
  );
}

function CheBlankPrintPage({
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

export function ChePrintPage() {
  const searchParams = useSearchParams();
  const checklistId = searchParams.get("checklistId");
  const orderId = searchParams.get("orderId");
  const autoPrint = searchParams.get("auto") === "1";
  const autoDownloadPdf =
    searchParams.get("pdf") === "1" || searchParams.get("auto") === "pdf";

  if (checklistId) {
    return (
      <CheFilledPrintLoader
        checklistId={checklistId}
        autoPrint={autoPrint}
        autoDownloadPdf={autoDownloadPdf}
      />
    );
  }

  return (
    <CheBlankPrintPage
      orderId={orderId}
      autoPrint={autoPrint}
      autoDownloadPdf={autoDownloadPdf}
    />
  );
}

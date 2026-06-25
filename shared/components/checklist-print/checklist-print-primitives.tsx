"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Download, Loader2, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOficinaStore } from "@/features/auth/store/oficina-store";
import {
  checklistPrintConfig,
  type ChecklistDocumentType,
} from "@/shared/config/checklist-print";
import { downloadChecklistPdf } from "@/shared/lib/download-checklist-pdf";
import { PrintDocumentFooter } from "./print-document-footer";
import { PrintDocumentHeader } from "./print-document-header";

type ChecklistPrintShellProps = {
  title: string;
  subtitle?: string;
  documentType: ChecklistDocumentType;
  osNumber?: string;
  autoPrint?: boolean;
  autoDownloadPdf?: boolean;
  children: ReactNode;
};

export function ChecklistPrintShell({
  title,
  subtitle,
  documentType,
  osNumber,
  autoPrint = false,
  autoDownloadPdf = false,
  children,
}: ChecklistPrintShellProps) {
  const router = useRouter();
  const documentRef = useRef<HTMLDivElement>(null);
  const hasAutoDownloadedRef = useRef(false);
  const isDownloadingRef = useRef(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const oficina = useOficinaStore((state) => state.oficina);
  const workshopName =
    oficina?.nomeFantasia?.trim() || oficina?.nome?.trim() || undefined;

  const handleDownloadPdf = useCallback(
    async (navigateBackAfter = false) => {
      if (!documentRef.current || isDownloadingRef.current) {
        return;
      }

      isDownloadingRef.current = true;
      setIsDownloading(true);

      try {
        await downloadChecklistPdf(
          documentRef.current,
          checklistPrintConfig.pdfFilenames[documentType]
        );

        if (navigateBackAfter && window.history.length > 1) {
          router.back();
        }
      } finally {
        isDownloadingRef.current = false;
        setIsDownloading(false);
      }
    },
    [documentType, router]
  );

  useEffect(() => {
    if (!autoPrint) {
      return;
    }

    const timer = window.setTimeout(() => window.print(), 500);

    return () => window.clearTimeout(timer);
  }, [autoPrint]);

  useEffect(() => {
    if (!autoDownloadPdf || hasAutoDownloadedRef.current) {
      return;
    }

    hasAutoDownloadedRef.current = true;

    const timer = window.setTimeout(() => {
      void handleDownloadPdf(true);
    }, 600);

    return () => window.clearTimeout(timer);
  }, [autoDownloadPdf, handleDownloadPdf]);

  return (
    <div className="checklist-print-root min-h-full bg-zinc-100 text-black print:bg-white">
      <div
        data-print-hide
        className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 bg-white px-6 py-4 shadow-sm"
      >
        <div>
          <h1 className="text-lg font-semibold text-brand-navy">{title}</h1>
          {subtitle ? (
            <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-10"
            onClick={() => router.back()}
          >
            <ArrowLeft className="size-4" />
            Voltar
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-10"
            onClick={() => window.print()}
          >
            <Printer className="size-4" />
            {checklistPrintConfig.actions.printNow}
          </Button>
          <Button
            type="button"
            className="h-10 bg-brand-navy text-white hover:bg-brand-navy-hover"
            disabled={isDownloading}
            onClick={() => void handleDownloadPdf()}
          >
            {isDownloading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Download className="size-4" />
            )}
            {isDownloading
              ? checklistPrintConfig.actions.downloadingPdf
              : checklistPrintConfig.actions.downloadPdf}
          </Button>
        </div>
      </div>

      <div className="px-4 py-6 print:p-0 sm:px-6">
        <div
          ref={documentRef}
          className="checklist-print-document mx-auto max-w-[210mm] rounded-lg border border-zinc-200 bg-white px-8 py-8 shadow-sm print:rounded-none print:border-0 print:px-0 print:py-0 print:shadow-none"
        >
          <PrintDocumentHeader
            formTitle={title}
            formSubtitle={subtitle}
            documentType={documentType}
            workshopName={workshopName}
            osNumber={osNumber}
          />
          <div className="checklist-print-content">{children}</div>
          <PrintDocumentFooter />
        </div>
      </div>
    </div>
  );
}

export function PrintSection({
  title,
  hint,
  number,
  children,
}: {
  title: string;
  hint?: string;
  number?: number;
  children: ReactNode;
}) {
  return (
    <section className="checklist-print-section mb-6 break-inside-avoid">
      <div className="flex items-center gap-2 border-l-4 border-brand-orange bg-brand-navy/[0.04] px-3 py-2">
        {number != null ? (
          <span className="text-xs font-bold text-brand-orange">{number}.</span>
        ) : null}
        <h2 className="text-xs font-bold uppercase tracking-wide text-brand-navy">
          {title}
        </h2>
      </div>
      {hint ? (
        <p className="mt-2 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] leading-relaxed text-amber-900">
          {hint}
        </p>
      ) : null}
      <div className="mt-3">{children}</div>
    </section>
  );
}

export function PrintFieldGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
  );
}

export function PrintField({
  label,
  value,
  className,
  span = 1,
}: {
  label: string;
  value?: string;
  className?: string;
  span?: 1 | 2 | 3;
}) {
  const spanClass =
    span === 3
      ? "sm:col-span-2 lg:col-span-3"
      : span === 2
        ? "sm:col-span-2"
        : undefined;

  return (
    <div className={`print-field ${spanClass ?? ""} ${className ?? ""}`.trim()}>
      <p className="print-field-label">{label}</p>
      <div className="print-field-value">{value?.trim() ? value : "\u00A0"}</div>
    </div>
  );
}

export function PrintTextArea({
  label,
  rows = 4,
}: {
  label: string;
  rows?: number;
}) {
  return (
    <div className="print-field">
      <p className="print-field-label">{label}</p>
      <div
        className="print-field-box mt-1"
        style={{ minHeight: `${rows * 1.5}rem` }}
      />
    </div>
  );
}

export function PrintCheckboxRow({ label }: { label: string }) {
  return (
    <div className="flex items-start gap-3 rounded border border-zinc-300 bg-zinc-50 px-3 py-2.5 text-sm">
      <span className="mt-0.5 inline-flex size-4 shrink-0 border border-zinc-500 bg-white" />
      <span className="leading-snug">{label}</span>
    </div>
  );
}

export function PrintStatusTable({
  items,
}: {
  items: readonly { id: string; label: string }[];
}) {
  return (
    <table className="print-table w-full border-collapse text-[11px]">
      <thead>
        <tr className="bg-brand-navy text-white">
          <th className="border border-brand-navy px-2 py-2 text-left font-semibold">
            {checklistPrintConfig.statusColumns.item}
          </th>
          <th className="w-10 border border-brand-navy px-1 py-2 text-center font-semibold">
            {checklistPrintConfig.statusColumns.ok}
          </th>
          <th className="w-10 border border-brand-navy px-1 py-2 text-center font-semibold">
            {checklistPrintConfig.statusColumns.anomaly}
          </th>
          <th className="w-10 border border-brand-navy px-1 py-2 text-center font-semibold">
            {checklistPrintConfig.statusColumns.na}
          </th>
          <th className="border border-brand-navy px-2 py-2 text-left font-semibold">
            {checklistPrintConfig.statusColumns.notes}
          </th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, index) => (
          <tr
            key={item.id}
            className={index % 2 === 0 ? "bg-white" : "bg-zinc-50/80"}
          >
            <td className="border border-zinc-300 px-2 py-2 align-top leading-snug">
              {item.label}
            </td>
            <td className="border border-zinc-300 px-1 py-2 text-center align-top">
              <span className="inline-block size-3.5 border border-zinc-500 bg-white" />
            </td>
            <td className="border border-zinc-300 px-1 py-2 text-center align-top">
              <span className="inline-block size-3.5 border border-zinc-500 bg-white" />
            </td>
            <td className="border border-zinc-300 px-1 py-2 text-center align-top">
              <span className="inline-block size-3.5 border border-zinc-500 bg-white" />
            </td>
            <td className="border border-zinc-300 px-2 py-2 align-top">
              <div className="min-h-5 border-b border-dotted border-zinc-400" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function PrintPhotoGrid({
  labels,
}: {
  labels: readonly string[];
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {labels.map((label) => (
        <div key={label} className="break-inside-avoid">
          <p className="print-field-label mb-1.5">{label}</p>
          <div className="flex h-24 items-end rounded border border-dashed border-zinc-400 bg-zinc-50/50 p-2">
            <span className="text-[10px] text-zinc-500">
              {checklistPrintConfig.photoBoxLabel}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function PrintSignatureRow({
  labels,
}: {
  labels: readonly string[];
}) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {labels.map((label) => (
        <div key={label} className="break-inside-avoid">
          <p className="print-field-label">{label}</p>
          <div className="mt-6 border-b-2 border-zinc-400" />
          <p className="mt-2 text-[10px] text-zinc-500">
            {checklistPrintConfig.signatureLabel}
          </p>
        </div>
      ))}
    </div>
  );
}

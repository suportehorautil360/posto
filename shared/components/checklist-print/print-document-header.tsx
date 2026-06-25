import { Settings2 } from "lucide-react";
import { checklistPrintConfig } from "@/shared/config/checklist-print";
import { appShellConfig } from "@/shared/layout/config/navigation";

type PrintDocumentHeaderProps = {
  formTitle: string;
  formSubtitle?: string;
  documentType: "CHE" | "CHD";
  workshopName?: string;
  osNumber?: string;
};

export function PrintDocumentHeader({
  formTitle,
  formSubtitle,
  documentType,
  workshopName,
  osNumber,
}: PrintDocumentHeaderProps) {
  const printedAt = new Date().toLocaleDateString("pt-BR");

  return (
    <header className="checklist-print-header mb-8 break-inside-avoid">
      <div className="flex items-start justify-between gap-6 border-b-2 border-brand-navy pb-4">
        <div className="flex min-w-0 items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-orange shadow-sm">
            <Settings2 className="size-6 text-white" aria-hidden />
          </div>
          <div className="min-w-0">
            <p className="text-lg font-bold tracking-tight text-brand-navy">
              {checklistPrintConfig.brand.name}
            </p>
            <p className="text-sm text-zinc-600">{appShellConfig.systemName}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-brand-orange">
              {appShellConfig.systemShortName}
            </p>
          </div>
        </div>

        <div className="shrink-0 text-right text-xs">
          <div className="grid gap-2">
            <PrintMetaField
              label={checklistPrintConfig.header.documentType}
              value={documentType}
            />
            <PrintMetaField
              label={checklistPrintConfig.header.printedAt}
              value={printedAt}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-zinc-200 bg-zinc-50/80 px-4 py-3">
        <h1 className="text-base font-bold text-brand-navy">{formTitle}</h1>
        {formSubtitle ? (
          <p className="mt-1 text-sm text-zinc-600">{formSubtitle}</p>
        ) : null}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <PrintMetaField
          label={checklistPrintConfig.header.workshop}
          value={workshopName}
          boxed
        />
        <PrintMetaField
          label={checklistPrintConfig.header.serviceOrder}
          value={osNumber}
          boxed
        />
      </div>
    </header>
  );
}

function PrintMetaField({
  label,
  value,
  boxed = false,
}: {
  label: string;
  value?: string;
  boxed?: boolean;
}) {
  if (boxed) {
    return (
      <div className="rounded border border-zinc-300 bg-white px-3 py-2">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
          {label}
        </p>
        <p className="mt-1 min-h-5 text-sm font-medium text-zinc-900">
          {value?.trim() ? value : "\u00A0"}
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-semibold text-brand-navy">
        {value?.trim() ? value : "—"}
      </p>
    </div>
  );
}

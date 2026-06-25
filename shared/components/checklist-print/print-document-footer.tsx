import { checklistPrintConfig } from "@/shared/config/checklist-print";

export function PrintDocumentFooter() {
  return (
    <footer className="checklist-print-footer mt-10 break-inside-avoid border-t border-zinc-300 pt-4">
      <p className="text-center text-[10px] leading-relaxed text-zinc-500">
        {checklistPrintConfig.footerNote}
      </p>
      <p className="mt-2 text-center text-[10px] font-semibold text-brand-navy">
        {checklistPrintConfig.brand.name} · {checklistPrintConfig.brand.tagline}
      </p>
    </footer>
  );
}

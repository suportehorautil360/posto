import { checklistPrintConfig } from "@/shared/config/checklist-print";

type PrintDocumentFooterProps = {
  note?: string;
};

export function PrintDocumentFooter({
  note = checklistPrintConfig.footerNote,
}: PrintDocumentFooterProps) {
  return (
    <footer className="checklist-print-footer mt-10 break-inside-avoid border-t border-zinc-300 pt-4">
      <p className="text-center text-[10px] leading-relaxed text-zinc-500">
        {note}
      </p>
      <p className="mt-2 text-center text-[10px] font-semibold text-brand-navy">
        {checklistPrintConfig.brand.name} · {checklistPrintConfig.brand.tagline}
      </p>
    </footer>
  );
}

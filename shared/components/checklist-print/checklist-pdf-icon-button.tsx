"use client";

import Link from "next/link";
import { FileDown } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { checklistPrintConfig } from "@/shared/config/checklist-print";

type ChecklistPdfIconButtonProps = {
  href: string;
  checklistId: string;
  label?: string;
  className?: string;
};

function buildFilledPrintHref(href: string, checklistId: string) {
  const params = new URLSearchParams({
    checklistId,
    pdf: "1",
  });

  return `${href}?${params.toString()}`;
}

export function ChecklistPdfIconButton({
  href,
  checklistId,
  label = checklistPrintConfig.actions.downloadPdf,
  className,
}: ChecklistPdfIconButtonProps) {
  return (
    <Link
      href={buildFilledPrintHref(href, checklistId)}
      className={cn(
        buttonVariants({ variant: "outline", size: "sm" }),
        "h-8 w-8 shrink-0 p-0",
        className
      )}
      title={label}
      aria-label={label}
    >
      <FileDown className="size-3.5" />
    </Link>
  );
}

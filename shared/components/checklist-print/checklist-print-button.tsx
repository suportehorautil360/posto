"use client";

import Link from "next/link";
import { Download } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { checklistPrintConfig } from "@/shared/config/checklist-print";

type ChecklistPrintButtonProps = {
  href: string;
  orderId?: string | null;
  label?: string;
  className?: string;
};

function buildPrintHref(href: string, orderId?: string | null) {
  const params = new URLSearchParams({ pdf: "1" });

  if (orderId) {
    params.set("orderId", orderId);
  }

  return `${href}?${params.toString()}`;
}

export function ChecklistPrintButton({
  href,
  orderId,
  label = checklistPrintConfig.actions.print,
  className,
}: ChecklistPrintButtonProps) {
  return (
    <Link
      href={buildPrintHref(href, orderId)}
      className={cn(
        buttonVariants({ variant: "outline" }),
        "h-10 gap-2",
        className
      )}
    >
      <Download className="size-4" />
      {label}
    </Link>
  );
}

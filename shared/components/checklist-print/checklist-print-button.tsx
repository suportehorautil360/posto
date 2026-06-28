"use client";

import Link from "next/link";
import { Download } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { checklistPrintConfig } from "@/shared/config/checklist-print";

type ChecklistPrintButtonProps = {
  href: string;
  orderId?: string | null;
  checklistId?: string | null;
  label?: string;
  className?: string;
  size?: "default" | "sm";
};

function buildPrintHref(
  href: string,
  orderId?: string | null,
  checklistId?: string | null
) {
  const params = new URLSearchParams({ pdf: "1" });

  if (checklistId) {
    params.set("checklistId", checklistId);
  } else if (orderId) {
    params.set("orderId", orderId);
  }

  return `${href}?${params.toString()}`;
}

export function ChecklistPrintButton({
  href,
  orderId,
  checklistId,
  label = checklistPrintConfig.actions.print,
  className,
  size = "default",
}: ChecklistPrintButtonProps) {
  return (
    <Link
      href={buildPrintHref(href, orderId, checklistId)}
      className={cn(
        buttonVariants({ variant: "outline", size }),
        size === "sm" ? "h-8 gap-1.5" : "h-10 gap-2",
        className
      )}
    >
      <Download className={size === "sm" ? "size-3.5" : "size-4"} />
      {label}
    </Link>
  );
}

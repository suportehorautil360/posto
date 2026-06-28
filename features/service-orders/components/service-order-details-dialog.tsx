"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { serviceOrderDetailsConfig } from "../config/order-details";
import type { ServiceOrder } from "../types/service-order";
import { ServiceOrderDetailsContent } from "./service-order-details-content";

type ServiceOrderDetailsDialogProps = {
  order: ServiceOrder;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBuildQuote?: () => void;
};

export function ServiceOrderDetailsDialog({
  order,
  open,
  onOpenChange,
  onBuildQuote,
}: ServiceOrderDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "gap-0 overflow-hidden p-0 sm:max-w-3xl",
          "ring-zinc-200/80"
        )}
      >
        <div className="bg-brand-navy px-6 py-5 text-white">
          <DialogHeader className="gap-1 text-left">
            <p className="text-xs font-semibold tracking-[0.14em] text-white/60 uppercase">
              {serviceOrderDetailsConfig.title}
            </p>
            <DialogTitle className="text-xl font-semibold text-white">
              {order.code} · {order.client}
            </DialogTitle>
          </DialogHeader>
        </div>

        <ServiceOrderDetailsContent order={order} />

        <DialogFooter className="mx-0 mb-0 border-t border-zinc-200/80 bg-zinc-50/60 px-6 py-4 sm:justify-end">
          <div className="flex w-full flex-col-reverse gap-2 sm:w-auto sm:flex-row">
            <Button
              type="button"
              variant="outline"
              className="min-w-28 border-zinc-200 bg-white"
              onClick={() => onOpenChange(false)}
            >
              {serviceOrderDetailsConfig.close}
            </Button>
            {onBuildQuote ? (
              <Button
                type="button"
                className="min-w-36 bg-brand-orange text-white hover:bg-brand-orange-hover"
                onClick={onBuildQuote}
              >
                {serviceOrderDetailsConfig.buildQuote}
              </Button>
            ) : null}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

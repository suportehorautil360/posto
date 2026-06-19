"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuotes } from "@/features/quotes/context/quotes-context";
import {
  createQuoteFromOrderUpdate,
  getQuoteCustomerSyncFromOrder,
  syncQuotedValueInQuote,
} from "@/features/quotes/lib/map-quote-to-order";
import {
  editServiceOrderConfig,
  editServiceOrderStatusOptions,
} from "../config/edit-order";
import { useServiceOrders } from "../context/service-orders-context";
import type { ServiceOrder, ServiceOrderStatus } from "../types/service-order";

type EditServiceOrderDialogProps = {
  order: ServiceOrder | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type FormState = {
  client: string;
  machine: string;
  openedAt: string;
  status: ServiceOrderStatus;
  quotedValue: string;
};

function parseDisplayDateToIso(display: string): string {
  const [day, month, year] = display.split("/");

  if (!day || !month || !year) {
    return new Date().toISOString().slice(0, 10);
  }

  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

function formatIsoDateToDisplay(iso: string): string {
  const [year, month, day] = iso.split("-");

  if (!year || !month || !day) return iso;

  return `${day}/${month}/${year}`;
}

function parseQuotedValue(value: number | null): string {
  if (value === null) return "0";

  return String(value);
}

function parseNumericInput(value: string): number | null {
  const normalized = value.replace(/\./g, "").replace(",", ".").trim();
  const parsed = Number.parseFloat(normalized);

  if (Number.isNaN(parsed)) return null;

  return parsed;
}

function buildFormState(order: ServiceOrder): FormState {
  return {
    client: order.client,
    machine: order.machine,
    openedAt: parseDisplayDateToIso(order.openedAt),
    status: order.status,
    quotedValue: parseQuotedValue(order.quotedValue),
  };
}

export function EditServiceOrderDialog({
  order,
  open,
  onOpenChange,
}: EditServiceOrderDialogProps) {
  const { updateOrder } = useServiceOrders();
  const { getQuote, saveQuote } = useQuotes();
  const [form, setForm] = useState<FormState | null>(null);

  useEffect(() => {
    if (open && order) {
      setForm(buildFormState(order));
    }
  }, [open, order]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!order || !form) return;

    const quotedValue = parseNumericInput(form.quotedValue);
    const updates = {
      client: form.client.trim(),
      machine: form.machine.trim(),
      openedAt: formatIsoDateToDisplay(form.openedAt),
      status: form.status,
      quotedValue: quotedValue && quotedValue > 0 ? quotedValue : null,
    };

    updateOrder(order.id, updates);

    const savedQuote = getQuote(order.id);
    const normalizedValue =
      quotedValue && quotedValue > 0 ? quotedValue : null;

    if (savedQuote) {
      const syncedQuote = syncQuotedValueInQuote(
        {
          ...savedQuote,
          customer: getQuoteCustomerSyncFromOrder(savedQuote, updates),
        },
        normalizedValue
      );

      saveQuote(order.id, syncedQuote);
    } else if (normalizedValue !== null) {
      saveQuote(
        order.id,
        createQuoteFromOrderUpdate(order, {
          ...updates,
          quotedValue: normalizedValue,
        })
      );
    }

    toast.success(editServiceOrderConfig.messages.saveSuccess);
    onOpenChange(false);
  }

  if (!order || !form) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="overflow-hidden border-zinc-200/80 p-0 sm:max-w-xl"
      >
        <div className="border-b border-zinc-100 px-6 py-5">
          <DialogTitle className="text-xl font-bold text-brand-navy">
            {editServiceOrderConfig.title}
          </DialogTitle>
          <p className="mt-1 text-sm text-zinc-500">{order.code}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-5 px-6 py-6">
            <div>
              <Label className="mb-2 block text-xs font-medium text-zinc-500">
                {editServiceOrderConfig.fields.client}
              </Label>
              <Input
                value={form.client}
                onChange={(event) =>
                  setForm((current) =>
                    current ? { ...current, client: event.target.value } : current
                  )
                }
                className="h-11 border-zinc-200"
              />
            </div>

            <div>
              <Label className="mb-2 block text-xs font-medium text-zinc-500">
                {editServiceOrderConfig.fields.machine}
              </Label>
              <Input
                value={form.machine}
                onChange={(event) =>
                  setForm((current) =>
                    current ? { ...current, machine: event.target.value } : current
                  )
                }
                className="h-11 border-zinc-200"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label className="mb-2 block text-xs font-medium text-zinc-500">
                  {editServiceOrderConfig.fields.openedAt}
                </Label>
                <Input
                  type="date"
                  value={form.openedAt}
                  onChange={(event) =>
                    setForm((current) =>
                      current
                        ? { ...current, openedAt: event.target.value }
                        : current
                    )
                  }
                  className="h-11 border-zinc-200"
                />
              </div>

              <div>
                <Label className="mb-2 block text-xs font-medium text-zinc-500">
                  {editServiceOrderConfig.fields.status}
                </Label>
                <Select
                  value={form.status}
                  onValueChange={(value) =>
                    setForm((current) =>
                      current
                        ? { ...current, status: value as ServiceOrderStatus }
                        : current
                    )
                  }
                >
                  <SelectTrigger className="h-11 w-full border-zinc-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {editServiceOrderStatusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="mb-2 block text-xs font-medium text-zinc-500">
                {editServiceOrderConfig.fields.quotedValue}
              </Label>
              <Input
                value={form.quotedValue}
                onChange={(event) =>
                  setForm((current) =>
                    current
                      ? { ...current, quotedValue: event.target.value }
                      : current
                  )
                }
                className="h-11 border-zinc-200"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-zinc-100 bg-zinc-50/60 px-6 py-4">
            <Button
              type="button"
              variant="outline"
              className="h-10 border-zinc-200 bg-white px-5"
              onClick={() => onOpenChange(false)}
            >
              {editServiceOrderConfig.actions.cancel}
            </Button>
            <Button
              type="submit"
              className="h-10 bg-brand-orange px-5 text-white hover:bg-brand-orange-hover"
            >
              {editServiceOrderConfig.actions.save}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

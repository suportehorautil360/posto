"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays } from "lucide-react";
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
import { staggerItem } from "@/shared/motion/presets";
import {
  createOrderFormConfig,
  createOrderStatusOptions,
  type CreateOrderStatus,
} from "../config/create-order";
import type { ServiceOrder } from "../types/service-order";
import type { CreateOrderFormPayload } from "../lib/map-create-order";
import { getNextOrderCode, getTodayIsoDate } from "../lib/order-code";

const formStagger = {
  animate: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.08,
    },
  },
};

type CreateServiceOrderDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orders: ServiceOrder[];
  onSave: (payload: CreateOrderFormPayload) => void;
};

type FormState = CreateOrderFormPayload;

function getInitialFormState(orders: ServiceOrder[]): FormState {
  return {
    code: getNextOrderCode(orders),
    openedAt: getTodayIsoDate(),
    client: "",
    machine: "",
    status: "rascunho",
    value: "0,00",
  };
}

function FormField({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={staggerItem}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function CreateServiceOrderDialog({
  open,
  onOpenChange,
  orders,
  onSave,
}: CreateServiceOrderDialogProps) {
  const [form, setForm] = useState<FormState>(() =>
    getInitialFormState(orders)
  );

  useEffect(() => {
    if (open) {
      setForm(getInitialFormState(orders));
    }
  }, [open, orders]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave(form);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="overflow-hidden border-zinc-200/80 p-0 sm:max-w-2xl"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="border-b border-zinc-100 px-6 py-5">
            <DialogTitle className="text-xl font-bold text-brand-navy">
              {createOrderFormConfig.title}
            </DialogTitle>
          </div>

          <form onSubmit={handleSubmit}>
            <motion.div
              className="grid gap-5 px-6 py-6"
              variants={formStagger}
              initial="initial"
              animate="animate"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField>
                  <Label className="mb-2 block text-xs font-medium text-zinc-500">
                    {createOrderFormConfig.fields.code}
                  </Label>
                  <Input
                    value={form.code}
                    readOnly
                    className="h-11 border-zinc-200 bg-zinc-50 font-medium text-brand-navy"
                  />
                </FormField>

                <FormField>
                  <Label className="mb-2 block text-xs font-medium text-zinc-500">
                    {createOrderFormConfig.fields.openedAt}
                  </Label>
                  <div className="relative">
                    <Input
                      type="date"
                      value={form.openedAt}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          openedAt: event.target.value,
                        }))
                      }
                      className="h-11 border-zinc-200 bg-white pr-10"
                    />
                    <CalendarDays className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-zinc-400" />
                  </div>
                </FormField>
              </div>

              <FormField>
                <Label className="mb-2 block text-xs font-medium text-zinc-500">
                  {createOrderFormConfig.fields.client}
                </Label>
                <Input
                  value={form.client}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      client: event.target.value,
                    }))
                  }
                  placeholder={createOrderFormConfig.placeholders.client}
                  className="h-11 border-zinc-200"
                />
              </FormField>

              <FormField>
                <Label className="mb-2 block text-xs font-medium text-zinc-500">
                  {createOrderFormConfig.fields.machine}
                </Label>
                <Input
                  value={form.machine}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      machine: event.target.value,
                    }))
                  }
                  placeholder={createOrderFormConfig.placeholders.machine}
                  className="h-11 border-zinc-200"
                />
              </FormField>

              <div className="grid gap-5 sm:grid-cols-2">
                <FormField>
                  <Label className="mb-2 block text-xs font-medium text-zinc-500">
                    {createOrderFormConfig.fields.status}
                  </Label>
                  <Select
                    value={form.status}
                    onValueChange={(value) =>
                      setForm((current) => ({
                        ...current,
                        status: value as CreateOrderStatus,
                      }))
                    }
                  >
                    <SelectTrigger className="h-11 w-full border-zinc-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {createOrderStatusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>

                <FormField>
                  <Label className="mb-2 block text-xs font-medium text-zinc-500">
                    {createOrderFormConfig.fields.value}
                  </Label>
                  <Input
                    value={form.value}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        value: event.target.value,
                      }))
                    }
                    placeholder={createOrderFormConfig.placeholders.value}
                    className="h-11 border-zinc-200"
                  />
                </FormField>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="flex justify-end gap-3 border-t border-zinc-100 bg-zinc-50/60 px-6 py-4"
            >
              <Button
                type="button"
                variant="outline"
                className="h-10 border-zinc-200 bg-white px-5"
                onClick={() => onOpenChange(false)}
              >
                {createOrderFormConfig.actions.cancel}
              </Button>
              <Button
                type="submit"
                className="h-10 bg-brand-orange px-5 text-white hover:bg-brand-orange-hover"
              >
                {createOrderFormConfig.actions.save}
              </Button>
            </motion.div>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

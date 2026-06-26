"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useQuotes } from "../context/quotes-context";
import {
  hourTypeOptions,
  newQuotePageConfig,
  quoteStatusOptions,
} from "../config/page";
import {
  calculatePartTotal,
  calculateServiceTotal,
  calculateTravelTotal,
  formatCurrency,
} from "../lib/calculations";
import {
  createEmptyPartEntry,
  createEmptyServiceEntry,
  getInitialQuoteForm,
} from "../lib/form-defaults";
import { resolveQuoteForm } from "../lib/map-order-to-quote";
import { getOrderUpdatesFromQuote } from "../lib/map-quote-to-order";
import {
  buildOrcamentoPayload,
  buildOrcamentoUpdatePayload,
  validateOrcamentoTotal,
} from "../lib/map-quote-to-orcamento";
import { useOficinaStore } from "@/features/auth/store/oficina-store";
import { patchOrcamento } from "@/features/service-orders/api/patch-orcamento";
import { postOrcamento } from "@/features/service-orders/api/post-orcamento";
import { getOrcamentoById } from "@/features/service-orders/api/get-orcamento";
import { ServiceOrderSelect } from "@/features/service-orders/components/service-order-select";
import { serviceOrderSelectConfig } from "@/features/service-orders/config/order-select";
import { useServiceOrders } from "@/features/service-orders/context/service-orders-context";
import { getOrderUpdatesFromOrcamentoResponse } from "@/features/service-orders/lib/map-orcamento-response";
import {
  canCreateQuoteForOrder,
  canEditQuoteForOrder,
  canOpenQuoteFormForOrder,
} from "@/features/service-orders/lib/order-quote-action";
import { mapOrcamentoToQuoteForm } from "../lib/map-orcamento-to-detail-sections";
import type {
  QuoteFormState,
  QuotePartEntry,
  QuoteServiceEntry,
} from "../types/quote";

function SectionCard({
  title,
  action,
  hint,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-base font-bold text-brand-navy">{title}</h2>
        {action}
      </div>
      <div className="mt-5">{children}</div>
      {hint ? <p className="mt-3 text-xs text-zinc-500">{hint}</p> : null}
    </section>
  );
}

function FieldLabel({
  htmlFor,
  children,
  required,
}: {
  htmlFor?: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <Label
      htmlFor={htmlFor}
      className="mb-2 block text-xs font-medium text-zinc-500"
    >
      {children}
      {required ? <span className="text-brand-orange"> *</span> : null}
    </Label>
  );
}

function RemoveRowButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      className="text-red-400 hover:bg-red-50 hover:text-red-600"
      onClick={onClick}
    >
      <X className="size-4" />
    </Button>
  );
}

export function NewQuotePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderIdFromQuery = searchParams.get("orderId");
  const isEditMode = searchParams.get("edit") === "1";
  const { getOrderById, updateOrder, refreshOrders, orders } =
    useServiceOrders();
  const { getQuote, saveQuote } = useQuotes();
  const oficina = useOficinaStore((state) => state.oficina);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(
    orderIdFromQuery
  );
  const [form, setForm] = useState<QuoteFormState>(getInitialQuoteForm());
  const [isSaving, setIsSaving] = useState(false);
  const [orderError, setOrderError] = useState<string | undefined>();
  const [quoteExistsError, setQuoteExistsError] = useState<string | undefined>();
  const appliedQueryOrderRef = useRef<string | null>(null);

  const selectedOrder = selectedOrderId
    ? getOrderById(selectedOrderId)
    : undefined;
  const isEditingExistingQuote = Boolean(
    selectedOrder && canEditQuoteForOrder(selectedOrder)
  );
  const canEditQuote = Boolean(
    selectedOrder &&
      (canCreateQuoteForOrder(selectedOrder) || isEditingExistingQuote)
  );
  const lockCustomerIdentityFields = Boolean(selectedOrderId && canEditQuote);
  const selectErrorMessage = quoteExistsError ?? orderError;

  function applyOrderPrefill(orderId: string) {
    const order = getOrderById(orderId);

    if (!order) {
      return;
    }

    if (isEditMode || isEditingExistingQuote) {
      if (!canEditQuoteForOrder(order)) {
        setQuoteExistsError(newQuotePageConfig.messages.quoteEditUnavailable);
        setForm(getInitialQuoteForm());
        return;
      }

      setQuoteExistsError(undefined);
      const savedQuote = getQuote(orderId);
      const nextForm = savedQuote
        ? structuredClone(savedQuote)
        : resolveQuoteForm(order, null);

      setForm({
        ...nextForm,
        customer: {
          ...nextForm.customer,
          status: "rascunho",
        },
      });
      return;
    }

    if (!canCreateQuoteForOrder(order)) {
      setQuoteExistsError(newQuotePageConfig.messages.quoteAlreadyExists);
      setForm(getInitialQuoteForm());
      return;
    }

    setQuoteExistsError(undefined);
    const nextForm = resolveQuoteForm(order, getQuote(orderId));

    setForm({
      ...nextForm,
      customer: {
        ...nextForm.customer,
        status: "rascunho",
      },
    });
  }

  useEffect(() => {
    if (!orderIdFromQuery) {
      appliedQueryOrderRef.current = null;
      return;
    }

    const order = getOrderById(orderIdFromQuery);

    if (!order) {
      return;
    }

    setSelectedOrderId(orderIdFromQuery);

    if (appliedQueryOrderRef.current === orderIdFromQuery) {
      return;
    }

    appliedQueryOrderRef.current = orderIdFromQuery;
    applyOrderPrefill(orderIdFromQuery);
  }, [orderIdFromQuery, getOrderById, orders, getQuote, isEditMode]);

  useEffect(() => {
    if (!isEditMode || !selectedOrderId || !oficina?.id) {
      return;
    }

    const order = getOrderById(selectedOrderId);

    if (!order || !canEditQuoteForOrder(order)) {
      return;
    }

    if (getQuote(selectedOrderId)) {
      return;
    }

    let cancelled = false;

    void (async () => {
      try {
        const orcamento = await getOrcamentoById(
          order.ordemServicoId ?? order.id,
          oficina.id
        );

        if (cancelled) {
          return;
        }

        setForm(
          mapOrcamentoToQuoteForm(orcamento, order, getQuote(selectedOrderId))
        );
      } catch {
        // Mantém o prefill básico da OS quando a API não retornar detalhes.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    isEditMode,
    selectedOrderId,
    oficina?.id,
    getOrderById,
    getQuote,
    orders,
  ]);

  function handleOrderSelect(orderId: string | null) {
    setOrderError(undefined);
    setQuoteExistsError(undefined);
    setSelectedOrderId(orderId);
    appliedQueryOrderRef.current = orderId;

    if (!orderId) {
      setForm(getInitialQuoteForm());
      return;
    }

    applyOrderPrefill(orderId);
  }

  const pageTitle = useMemo(() => {
    if (!selectedOrderId) {
      return newQuotePageConfig.title;
    }

    if (isEditMode || isEditingExistingQuote) {
      return newQuotePageConfig.editTitle;
    }

    return newQuotePageConfig.buildTitle;
  }, [selectedOrderId, isEditMode, isEditingExistingQuote]);

  const partsSubtotal = useMemo(
    () =>
      form.parts.reduce(
        (total, part) =>
          total + calculatePartTotal(part.quantity, part.unitValue),
        0
      ),
    [form.parts]
  );

  const servicesSubtotal = useMemo(
    () =>
      form.services.reduce(
        (total, service) =>
          total + calculateServiceTotal(service.hours, service.hourlyRate),
        0
      ),
    [form.services]
  );

  const travelSubtotal = useMemo(
    () =>
      calculateTravelTotal(
        form.travel.km,
        form.travel.valuePerKm,
        form.travel.travelHours,
        form.travel.hourlyRate,
        form.travel.fees
      ),
    [form.travel]
  );

  const grandTotal = partsSubtotal + servicesSubtotal + travelSubtotal;

  function updateCustomer<K extends keyof QuoteFormState["customer"]>(
    field: K,
    value: QuoteFormState["customer"][K]
  ) {
    setForm((current) => ({
      ...current,
      customer: { ...current.customer, [field]: value },
    }));
  }

  function updateTravel<K extends keyof QuoteFormState["travel"]>(
    field: K,
    value: QuoteFormState["travel"][K]
  ) {
    setForm((current) => ({
      ...current,
      travel: { ...current.travel, [field]: value },
    }));
  }

  function updatePart(id: string, part: QuotePartEntry) {
    setForm((current) => ({
      ...current,
      parts: current.parts.map((item) => (item.id === id ? part : item)),
    }));
  }

  function addPart() {
    setForm((current) => ({
      ...current,
      parts: [...current.parts, createEmptyPartEntry()],
    }));
  }

  function removePart(id: string) {
    setForm((current) => ({
      ...current,
      parts:
        current.parts.length > 1
          ? current.parts.filter((item) => item.id !== id)
          : current.parts,
    }));
  }

  function updateService(id: string, service: QuoteServiceEntry) {
    setForm((current) => ({
      ...current,
      services: current.services.map((item) =>
        item.id === id ? service : item
      ),
    }));
  }

  function addService() {
    setForm((current) => ({
      ...current,
      services: [...current.services, createEmptyServiceEntry()],
    }));
  }

  function removeService(id: string) {
    setForm((current) => ({
      ...current,
      services:
        current.services.length > 1
          ? current.services.filter((item) => item.id !== id)
          : current.services,
    }));
  }

  async function handleSave() {
    if (!selectedOrderId || !selectedOrder) {
      setOrderError(serviceOrderSelectConfig.required);
      toast.error(serviceOrderSelectConfig.required);
      return;
    }

    if (!canEditQuote) {
      setQuoteExistsError(
        isEditMode
          ? newQuotePageConfig.messages.quoteEditUnavailable
          : newQuotePageConfig.messages.quoteAlreadyExists
      );
      toast.error(
        isEditMode
          ? newQuotePageConfig.messages.quoteEditUnavailable
          : newQuotePageConfig.messages.quoteAlreadyExists
      );
      return;
    }

    setIsSaving(true);

    try {
      saveQuote(selectedOrderId, form);

      if (selectedOrder.source !== "api") {
        throw new Error(newQuotePageConfig.messages.selectEligibleOrder);
      }

      if (!oficina) {
        throw new Error("Selecione uma oficina para enviar o orçamento.");
      }

      const isUpdatingQuote = isEditMode || isEditingExistingQuote;

      if (isUpdatingQuote) {
        const orcamentoId = selectedOrder.ordemServicoId;

        if (!orcamentoId) {
          throw new Error(
            "Não foi possível identificar o orçamento enviado para esta OS."
          );
        }

        const updatePayload = buildOrcamentoUpdatePayload(oficina.id, form);
        validateOrcamentoTotal(updatePayload.items);

        const response = await patchOrcamento(orcamentoId, updatePayload);
        saveQuote(response.id, form);
        const formUpdates = getOrderUpdatesFromQuote(form, response.valorTotal);

        updateOrder(
          selectedOrderId,
          getOrderUpdatesFromOrcamentoResponse(response, formUpdates)
        );
      } else {
        const payload = buildOrcamentoPayload(
          selectedOrder.id,
          oficina.id,
          form
        );
        validateOrcamentoTotal(payload.items);

        const response = await postOrcamento(payload);
        saveQuote(response.id, form);
        const formUpdates = getOrderUpdatesFromQuote(form, response.valorTotal);

        updateOrder(
          selectedOrderId,
          getOrderUpdatesFromOrcamentoResponse(response, formUpdates)
        );
      }

      await refreshOrders();
      toast.success(
        isUpdatingQuote
          ? newQuotePageConfig.messages.updateSuccess
          : newQuotePageConfig.messages.submitSuccess
      );
      router.push(isUpdatingQuote ? "/?tab=pregao" : "/orcamentos");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : newQuotePageConfig.messages.saveError
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-8 py-8"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-brand-navy">
            {pageTitle}
          </h1>
          {selectedOrder ? (
            <p className="mt-1 text-sm text-zinc-500">{selectedOrder.code}</p>
          ) : null}
        </div>
        <Link
          href="/orcamentos"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-10 border-zinc-200 bg-white px-4 text-zinc-700"
          )}
        >
          <ArrowLeft className="size-4" />
          {newQuotePageConfig.backLabel}
        </Link>
      </div>

      <ServiceOrderSelect
        value={selectedOrderId}
        errorMessage={selectErrorMessage}
        filterOrder={canOpenQuoteFormForOrder}
        allowEmpty={!isEditMode}
        disabled={isEditMode}
        onValueChange={handleOrderSelect}
      />

      <fieldset
        disabled={!canEditQuote}
        className={cn("flex flex-col gap-6", !canEditQuote && "opacity-60")}
      >
      <SectionCard title={newQuotePageConfig.sections.customer}>
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <FieldLabel htmlFor="quote-issue-date">
              {newQuotePageConfig.fields.issueDate}
            </FieldLabel>
            <Input
              id="quote-issue-date"
              type="date"
              value={form.customer.issueDate}
              disabled={lockCustomerIdentityFields}
              onChange={(event) =>
                updateCustomer("issueDate", event.target.value)
              }
              className="h-11 border-zinc-200"
            />
          </div>

          <div>
            <FieldLabel>{newQuotePageConfig.fields.status}</FieldLabel>
            <Select
              value={form.customer.status}
              disabled={lockCustomerIdentityFields}
              onValueChange={(value) =>
                updateCustomer(
                  "status",
                  value as QuoteFormState["customer"]["status"]
                )
              }
            >
              <SelectTrigger className="h-11 w-full border-zinc-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {quoteStatusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <FieldLabel htmlFor="quote-client" required>
              {newQuotePageConfig.fields.clientName}
            </FieldLabel>
            <Input
              id="quote-client"
              value={form.customer.clientName}
              disabled={lockCustomerIdentityFields}
              onChange={(event) =>
                updateCustomer("clientName", event.target.value)
              }
              placeholder={newQuotePageConfig.placeholders.clientName}
              className="h-11 border-zinc-200"
            />
          </div>

          <div>
            <FieldLabel htmlFor="quote-machine" required>
              {newQuotePageConfig.fields.machineModel}
            </FieldLabel>
            <Input
              id="quote-machine"
              value={form.customer.machineModel}
              disabled={lockCustomerIdentityFields}
              onChange={(event) =>
                updateCustomer("machineModel", event.target.value)
              }
              placeholder={newQuotePageConfig.placeholders.machineModel}
              className="h-11 border-zinc-200"
            />
          </div>

          <div>
            <FieldLabel htmlFor="quote-chassis">
              {newQuotePageConfig.fields.chassisPrefix}
            </FieldLabel>
            <Input
              id="quote-chassis"
              value={form.customer.chassisPrefix}
              disabled={lockCustomerIdentityFields}
              onChange={(event) =>
                updateCustomer("chassisPrefix", event.target.value)
              }
              className="h-11 border-zinc-200"
            />
          </div>

          <div>
            <FieldLabel htmlFor="quote-payment">
              {newQuotePageConfig.fields.paymentCondition}
            </FieldLabel>
            <Input
              id="quote-payment"
              value={form.customer.paymentCondition}
              onChange={(event) =>
                updateCustomer("paymentCondition", event.target.value)
              }
              placeholder={newQuotePageConfig.placeholders.paymentCondition}
              className="h-11 border-zinc-200"
            />
          </div>

          <div>
            <FieldLabel htmlFor="quote-validity">
              {newQuotePageConfig.fields.validityDays}
            </FieldLabel>
            <Input
              id="quote-validity"
              value={form.customer.validityDays}
              onChange={(event) =>
                updateCustomer("validityDays", event.target.value)
              }
              className="h-11 border-zinc-200"
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title={newQuotePageConfig.sections.parts}
        hint={newQuotePageConfig.hints.parts}
        action={
          <Button
            type="button"
            className="h-9 bg-brand-navy px-4 text-white hover:bg-brand-navy-hover"
            onClick={addPart}
          >
            <Plus className="size-4" />
            {newQuotePageConfig.actions.addPart}
          </Button>
        }
      >
        <div className="overflow-x-auto rounded-lg border border-zinc-200">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                {Object.values(newQuotePageConfig.columns.parts).map((column) => (
                  <TableHead
                    key={column}
                    className="h-10 bg-zinc-50/80 text-[11px] font-semibold tracking-wide text-zinc-500 uppercase"
                  >
                    {column}
                  </TableHead>
                ))}
                <TableHead className="w-10 bg-zinc-50/80" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {form.parts.map((part) => (
                <TableRow key={part.id}>
                  <TableCell className="py-2">
                    <Input
                      value={part.code}
                      onChange={(event) =>
                        updatePart(part.id, { ...part, code: event.target.value })
                      }
                      placeholder={newQuotePageConfig.placeholders.partCode}
                      className="h-9 border-zinc-200"
                    />
                  </TableCell>
                  <TableCell className="py-2">
                    <Input
                      value={part.description}
                      onChange={(event) =>
                        updatePart(part.id, {
                          ...part,
                          description: event.target.value,
                        })
                      }
                      className="h-9 border-zinc-200"
                    />
                  </TableCell>
                  <TableCell className="py-2">
                    <Input
                      value={part.brand}
                      onChange={(event) =>
                        updatePart(part.id, { ...part, brand: event.target.value })
                      }
                      className="h-9 border-zinc-200"
                    />
                  </TableCell>
                  <TableCell className="w-24 py-2">
                    <Input
                      value={part.quantity}
                      onChange={(event) =>
                        updatePart(part.id, {
                          ...part,
                          quantity: event.target.value,
                        })
                      }
                      className="h-9 border-zinc-200"
                    />
                  </TableCell>
                  <TableCell className="w-28 py-2">
                    <Input
                      value={part.unitValue}
                      onChange={(event) =>
                        updatePart(part.id, {
                          ...part,
                          unitValue: event.target.value,
                        })
                      }
                      className="h-9 border-zinc-200"
                    />
                  </TableCell>
                  <TableCell className="py-2 font-medium whitespace-nowrap text-zinc-700">
                    {formatCurrency(
                      calculatePartTotal(part.quantity, part.unitValue)
                    )}
                  </TableCell>
                  <TableCell className="py-2">
                    <RemoveRowButton onClick={() => removePart(part.id)} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <SectionCard
        title={newQuotePageConfig.sections.services}
        hint={newQuotePageConfig.hints.services}
        action={
          <Button
            type="button"
            className="h-9 bg-brand-navy px-4 text-white hover:bg-brand-navy-hover"
            onClick={addService}
          >
            <Plus className="size-4" />
            {newQuotePageConfig.actions.addService}
          </Button>
        }
      >
        <div className="overflow-x-auto rounded-lg border border-zinc-200">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                {Object.values(newQuotePageConfig.columns.services).map(
                  (column) => (
                    <TableHead
                      key={column}
                      className="h-10 bg-zinc-50/80 text-[11px] font-semibold tracking-wide text-zinc-500 uppercase"
                    >
                      {column}
                    </TableHead>
                  )
                )}
                <TableHead className="w-10 bg-zinc-50/80" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {form.services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="py-2">
                    <Input
                      value={service.description}
                      onChange={(event) =>
                        updateService(service.id, {
                          ...service,
                          description: event.target.value,
                        })
                      }
                      className="h-9 border-zinc-200"
                    />
                  </TableCell>
                  <TableCell className="w-36 py-2">
                    <Select
                      value={service.hourType}
                      onValueChange={(value) =>
                        updateService(service.id, {
                          ...service,
                          hourType: value as QuoteServiceEntry["hourType"],
                        })
                      }
                    >
                      <SelectTrigger className="h-9 w-full border-zinc-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {hourTypeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="w-24 py-2">
                    <Input
                      value={service.hours}
                      onChange={(event) =>
                        updateService(service.id, {
                          ...service,
                          hours: event.target.value,
                        })
                      }
                      className="h-9 border-zinc-200"
                    />
                  </TableCell>
                  <TableCell className="w-28 py-2">
                    <Input
                      value={service.hourlyRate}
                      onChange={(event) =>
                        updateService(service.id, {
                          ...service,
                          hourlyRate: event.target.value,
                        })
                      }
                      className="h-9 border-zinc-200"
                    />
                  </TableCell>
                  <TableCell className="py-2 font-medium whitespace-nowrap text-zinc-700">
                    {formatCurrency(
                      calculateServiceTotal(service.hours, service.hourlyRate)
                    )}
                  </TableCell>
                  <TableCell className="py-2">
                    <RemoveRowButton onClick={() => removeService(service.id)} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <SectionCard
        title={newQuotePageConfig.sections.travel}
        hint={newQuotePageConfig.hints.travel}
      >
        <div className="grid gap-4 md:grid-cols-6">
          {(
            [
              ["km", newQuotePageConfig.fields.km],
              ["valuePerKm", newQuotePageConfig.fields.valuePerKm],
              ["travelHours", newQuotePageConfig.fields.travelHours],
              ["hourlyRate", newQuotePageConfig.fields.travelHourlyRate],
              ["fees", newQuotePageConfig.fields.fees],
            ] as const
          ).map(([field, label]) => (
            <div key={field}>
              <FieldLabel>{label}</FieldLabel>
              <Input
                value={form.travel[field]}
                onChange={(event) => updateTravel(field, event.target.value)}
                className="h-11 border-zinc-200"
              />
            </div>
          ))}
          <div>
            <FieldLabel>TOTAL</FieldLabel>
            <div className="flex h-11 items-center rounded-md border border-zinc-200 bg-zinc-50 px-3 text-sm font-semibold text-brand-navy">
              {formatCurrency(travelSubtotal)}
            </div>
          </div>
        </div>
      </SectionCard>
      </fieldset>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="rounded-xl bg-brand-navy px-6 py-5 text-white shadow-sm lg:min-w-80">
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between gap-6 text-white/80">
              <span>{newQuotePageConfig.summary.parts}</span>
              <span>{formatCurrency(partsSubtotal)}</span>
            </div>
            <div className="flex items-center justify-between gap-6 text-white/80">
              <span>{newQuotePageConfig.summary.services}</span>
              <span>{formatCurrency(servicesSubtotal)}</span>
            </div>
            <div className="flex items-center justify-between gap-6 text-white/80">
              <span>{newQuotePageConfig.summary.travel}</span>
              <span>{formatCurrency(travelSubtotal)}</span>
            </div>
            <div className="border-t border-white/15 pt-3">
              <div className="flex items-center justify-between gap-6">
                <span className="text-base font-bold">
                  {newQuotePageConfig.summary.total}
                </span>
                <span className="text-2xl font-bold">
                  {formatCurrency(grandTotal)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            className="h-10 border-zinc-200 bg-white px-5"
            onClick={() => router.push("/orcamentos")}
            disabled={isSaving}
          >
            {newQuotePageConfig.actions.cancel}
          </Button>
          <Button
            type="button"
            className={cn(
              "h-10 bg-brand-orange px-5 text-white hover:bg-brand-orange-hover"
            )}
            onClick={handleSave}
            disabled={isSaving || !canEditQuote}
          >
            {isSaving
              ? newQuotePageConfig.actions.saving
              : newQuotePageConfig.actions.save}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

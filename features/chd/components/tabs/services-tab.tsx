"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Trash2, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { HourType } from "@/features/quotes/types/quote";
import { hourTypeOptions } from "@/features/quotes/config/page";
import { formatCurrency, parseNumericInput } from "@/features/quotes/lib/calculations";
import { staggerContainer, staggerItem } from "@/shared/motion/presets";
import { servicesSectionConfig } from "../../config/services";
import { createEmptyServiceDraft } from "../../lib/form-defaults";
import type { ChdServiceEntry, ChdServicesForm } from "../../types/form";

type ServiceDraft = Pick<
  ChdServiceEntry,
  "systemComponent" | "hourType" | "manHours" | "hourlyRate"
>;

function toServiceDraft(entry: Omit<ChdServiceEntry, "id">): ServiceDraft {
  return {
    systemComponent: entry.systemComponent,
    hourType: entry.hourType ?? "normal",
    manHours: entry.manHours,
    hourlyRate: entry.hourlyRate ?? "",
  };
}

type ServicesTabProps = {
  value: ChdServicesForm;
  prefilledFromOrcamento?: boolean;
  onChange: (value: ChdServicesForm) => void;
};

function AddServiceButton({
  onClick,
  variant = "primary",
  className,
  label = servicesSectionConfig.addSystemLabel,
}: {
  onClick: () => void;
  variant?: "primary" | "secondary";
  className?: string;
  label?: string;
}) {
  return (
    <Button
      type="button"
      onClick={onClick}
      className={cn(
        "gap-2 font-semibold shadow-sm transition-all",
        variant === "primary"
          ? "h-11 rounded-lg bg-brand-orange px-6 text-sm text-white hover:bg-brand-orange-hover hover:shadow-md"
          : "h-10 rounded-lg border border-brand-navy/15 bg-white px-4 text-sm text-brand-navy hover:border-brand-navy/25 hover:bg-brand-navy/5",
        className
      )}
    >
      <Plus className="size-4" />
      {label}
    </Button>
  );
}

function ServiceEntryTable({ service }: { service: ChdServiceEntry }) {
  const hourTypeLabel =
    hourTypeOptions.find((option) => option.value === service.hourType)?.label ??
    service.hourType ??
    "—";

  const hourlyRateDisplay = service.hourlyRate?.trim()
    ? formatCurrency(parseNumericInput(service.hourlyRate))
    : "—";

  return (
    <div className="mt-4 overflow-x-auto rounded-lg border border-zinc-200">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr>
            {Object.values(servicesSectionConfig.columns).map((column) => (
              <th
                key={column}
                className="border-b border-zinc-200 bg-zinc-50/80 px-3 py-2.5 text-left text-[11px] font-semibold tracking-wide text-zinc-500 uppercase"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="px-3 py-2">
              <ReadOnlyField value={service.systemComponent} />
            </td>
            <td className="w-36 px-3 py-2">
              <ReadOnlyField value={hourTypeLabel} />
            </td>
            <td className="w-24 px-3 py-2">
              <ReadOnlyField value={service.manHours} />
            </td>
            <td className="w-28 px-3 py-2">
              <ReadOnlyField value={hourlyRateDisplay} />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function ReadOnlyField({ value }: { value: string }) {
  return (
    <div className="flex min-h-9 items-center rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-800">
      {value.trim() ? value : "—"}
    </div>
  );
}

function ServiceDraftFormFields({
  draft,
  onChange,
}: {
  draft: ServiceDraft;
  onChange: (draft: ServiceDraft) => void;
}) {
  function updateField<K extends keyof ServiceDraft>(
    field: K,
    fieldValue: ServiceDraft[K]
  ) {
    onChange({ ...draft, [field]: fieldValue });
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr>
            {Object.values(servicesSectionConfig.columns).map((column) => (
              <th
                key={column}
                className="border-b border-zinc-200 bg-zinc-50/80 px-3 py-2.5 text-left text-[11px] font-semibold tracking-wide text-zinc-500 uppercase"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="px-3 py-2">
              <Input
                value={draft.systemComponent}
                onChange={(event) =>
                  updateField("systemComponent", event.target.value)
                }
                placeholder={servicesSectionConfig.placeholders.systemComponent}
                className="h-9 border-zinc-200"
              />
            </td>
            <td className="w-36 px-3 py-2">
              <Select
                value={draft.hourType ?? "normal"}
                onValueChange={(value) =>
                  updateField("hourType", value as HourType)
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
            </td>
            <td className="w-24 px-3 py-2">
              <Input
                value={draft.manHours}
                onChange={(event) => updateField("manHours", event.target.value)}
                className="h-9 border-zinc-200"
              />
            </td>
            <td className="w-28 px-3 py-2">
              <Input
                value={draft.hourlyRate ?? ""}
                onChange={(event) =>
                  updateField("hourlyRate", event.target.value)
                }
                className="h-9 border-zinc-200"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function AddServiceDialog({
  open,
  onOpenChange,
  draft,
  onDraftChange,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  draft: ServiceDraft;
  onDraftChange: (draft: ServiceDraft) => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="overflow-hidden border-zinc-200/80 p-0 sm:max-w-2xl"
      >
        <div className="border-b border-zinc-100 px-6 py-5">
          <DialogTitle className="text-xl font-bold text-brand-navy">
            {servicesSectionConfig.modalTitle}
          </DialogTitle>
          <DialogDescription className="mt-2 text-sm text-zinc-500">
            {servicesSectionConfig.modalDescription}
          </DialogDescription>
        </div>

        <div className="max-h-[min(70vh,640px)] overflow-y-auto px-6 py-6">
          <ServiceDraftFormFields draft={draft} onChange={onDraftChange} />
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-zinc-100 bg-zinc-50/80 px-6 py-4 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            className="h-10 border-zinc-200 bg-white"
            onClick={() => onOpenChange(false)}
          >
            {servicesSectionConfig.modalCancel}
          </Button>
          <AddServiceButton
            variant="primary"
            label={servicesSectionConfig.modalConfirm}
            onClick={onConfirm}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function EmptyServicesState({ onAdd }: { onAdd: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center rounded-xl border border-dashed border-zinc-300 bg-zinc-50/60 px-6 py-14 text-center"
    >
      <div className="flex size-14 items-center justify-center rounded-2xl bg-brand-navy/10 text-brand-navy">
        <Wrench className="size-7" />
      </div>
      <h2 className="mt-5 text-base font-bold text-brand-navy">
        {servicesSectionConfig.emptyTitle}
      </h2>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-zinc-500">
        {servicesSectionConfig.emptyDescription}
      </p>
      <AddServiceButton variant="primary" onClick={onAdd} className="mt-6" />
    </motion.div>
  );
}

function ServicesListHeader({
  count,
  onAdd,
}: {
  count: number;
  onAdd: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-200/80 bg-white px-5 py-4 shadow-sm">
      <div>
        <h2 className="text-base font-bold text-brand-navy">
          {servicesSectionConfig.listTitle}
        </h2>
        <p className="mt-0.5 text-xs text-zinc-500">
          {count}{" "}
          {count === 1 ? "serviço adicionado" : "serviços adicionados"}
        </p>
      </div>
      <AddServiceButton variant="secondary" onClick={onAdd} />
    </div>
  );
}

function PrefilledServicesHeader({
  count,
  onAddMore,
}: {
  count: number;
  onAddMore: () => void;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm">
      <div className="min-w-0 flex-1">
        <h2 className="text-base font-bold text-brand-navy">
          {servicesSectionConfig.prefilledTitle}
        </h2>
        <p className="mt-2 text-xs text-zinc-500">
          {servicesSectionConfig.prefilledRule}
        </p>
        <p className="mt-2 text-xs font-medium text-zinc-400">
          {count}{" "}
          {count === 1 ? "serviço do orçamento" : "serviços do orçamento"}
        </p>
      </div>
      <AddServiceButton
        variant="secondary"
        label={servicesSectionConfig.addMoreLabel}
        onClick={onAddMore}
        className="shrink-0"
      />
    </div>
  );
}

function AddedServiceItem({
  service,
  index,
  prefilled = false,
  onRemove,
}: {
  service: ChdServiceEntry;
  index: number;
  prefilled?: boolean;
  onRemove: () => void;
}) {
  return (
    <motion.div
      layout
      variants={staggerItem}
      initial="initial"
      animate="animate"
      exit="exit"
      className="rounded-lg border border-zinc-200 bg-zinc-50/80 p-4"
    >
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm font-semibold text-brand-navy">
          {servicesSectionConfig.serviceItemLabel(index + 1)}
        </p>
        {!prefilled ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="shrink-0 text-zinc-400 hover:text-red-600"
            onClick={onRemove}
          >
            <Trash2 className="size-4" />
          </Button>
        ) : null}
      </div>

      <ServiceEntryTable service={service} />
    </motion.div>
  );
}

export function ServicesTab({
  value,
  prefilledFromOrcamento = false,
  onChange,
}: ServicesTabProps) {
  const [draft, setDraft] = useState<ServiceDraft>(() =>
    toServiceDraft(createEmptyServiceDraft())
  );
  const [addModalOpen, setAddModalOpen] = useState(false);

  const showPrefilledHeader =
    prefilledFromOrcamento && value.items.length > 0;
  const showManualFlow =
    !prefilledFromOrcamento || value.items.length === 0;
  const showAddServiceDialog = showManualFlow || showPrefilledHeader;

  function resetDraft() {
    setDraft(toServiceDraft(createEmptyServiceDraft()));
  }

  function openAddModal() {
    resetDraft();
    setAddModalOpen(true);
  }

  function closeAddModal() {
    setAddModalOpen(false);
    resetDraft();
  }

  function handleAddServiceFromModal() {
    if (!draft.systemComponent.trim()) {
      return;
    }

    onChange({
      items: [
        ...value.items,
        {
          id: crypto.randomUUID(),
          systemComponent: draft.systemComponent.trim(),
          hourType: draft.hourType ?? "normal",
          manHours: draft.manHours.trim() || servicesSectionConfig.defaults.manHours,
          hourlyRate: draft.hourlyRate?.trim() ?? "",
          initialDiagnosis: "",
          technicalAction: "",
          technician: "",
          fromOrcamento: false,
        },
      ],
    });
    closeAddModal();
  }

  function handleRemoveService(id: string) {
    onChange({
      items: value.items.filter((item) => item.id !== id),
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {showPrefilledHeader ? (
        <PrefilledServicesHeader
          count={value.items.filter((item) => item.fromOrcamento).length}
          onAddMore={openAddModal}
        />
      ) : null}

      {showManualFlow ? (
        value.items.length === 0 ? (
          <EmptyServicesState onAdd={openAddModal} />
        ) : (
          <ServicesListHeader count={value.items.length} onAdd={openAddModal} />
        )
      ) : null}

      {value.items.length > 0 ? (
        <motion.div
          className="flex flex-col gap-2"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <AnimatePresence mode="popLayout">
            {value.items.map((service, index) => (
              <AddedServiceItem
                key={service.id}
                service={service}
                index={index}
                prefilled={service.fromOrcamento === true}
                onRemove={() => handleRemoveService(service.id)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : null}

      {showAddServiceDialog ? (
        <AddServiceDialog
          open={addModalOpen}
          onOpenChange={(open) => {
            if (open) {
              setAddModalOpen(true);
              return;
            }

            closeAddModal();
          }}
          draft={draft}
          onDraftChange={setDraft}
          onConfirm={handleAddServiceFromModal}
        />
      ) : null}
    </div>
  );
}

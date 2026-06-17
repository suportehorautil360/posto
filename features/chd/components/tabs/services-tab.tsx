"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { staggerContainer, staggerItem } from "@/shared/motion/presets";
import { servicesSectionConfig } from "../../config/services";
import { createEmptyServiceDraft } from "../../lib/form-defaults";
import type { ChdServiceEntry, ChdServicesForm } from "../../types/form";
import { AnimatedField } from "../animated-field";

type ServicesTabProps = {
  value: ChdServicesForm;
  onChange: (value: ChdServicesForm) => void;
};

type ServiceDraft = Omit<ChdServiceEntry, "id">;

function FieldLabel({
  htmlFor,
  children,
  required,
}: {
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <Label htmlFor={htmlFor} className="mb-2 block text-xs font-medium text-zinc-500">
      {children}
      {required ? <span className="text-brand-orange"> *</span> : null}
    </Label>
  );
}

function ServiceFormCard({
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
    <div className="rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm">
      <h2 className="text-base font-bold text-brand-navy">
        {servicesSectionConfig.title}
      </h2>

      <div className="mt-5 rounded-lg border border-zinc-200 p-5">
        <motion.div
          className="grid gap-5"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <AnimatedField>
            <FieldLabel htmlFor="chd-service-system" required>
              {servicesSectionConfig.fields.systemComponent}
            </FieldLabel>
            <Input
              id="chd-service-system"
              value={draft.systemComponent}
              onChange={(event) =>
                updateField("systemComponent", event.target.value)
              }
              placeholder={servicesSectionConfig.placeholders.systemComponent}
              className="h-11 border-zinc-200"
            />
          </AnimatedField>

          <AnimatedField>
            <FieldLabel htmlFor="chd-service-diagnosis">
              {servicesSectionConfig.fields.initialDiagnosis}
            </FieldLabel>
            <Textarea
              id="chd-service-diagnosis"
              value={draft.initialDiagnosis}
              onChange={(event) =>
                updateField("initialDiagnosis", event.target.value)
              }
              className="min-h-24 resize-y border-zinc-200"
            />
          </AnimatedField>

          <AnimatedField>
            <FieldLabel htmlFor="chd-service-action">
              {servicesSectionConfig.fields.technicalAction}
            </FieldLabel>
            <Textarea
              id="chd-service-action"
              value={draft.technicalAction}
              onChange={(event) =>
                updateField("technicalAction", event.target.value)
              }
              className="min-h-24 resize-y border-zinc-200"
            />
          </AnimatedField>

          <div className="grid gap-5 md:grid-cols-2">
            <AnimatedField>
              <FieldLabel htmlFor="chd-service-technician">
                {servicesSectionConfig.fields.technician}
              </FieldLabel>
              <Input
                id="chd-service-technician"
                value={draft.technician}
                onChange={(event) =>
                  updateField("technician", event.target.value)
                }
                className="h-11 border-zinc-200"
              />
            </AnimatedField>

            <AnimatedField>
              <FieldLabel htmlFor="chd-service-hours">
                {servicesSectionConfig.fields.manHours}
              </FieldLabel>
              <Input
                id="chd-service-hours"
                value={draft.manHours}
                onChange={(event) => updateField("manHours", event.target.value)}
                className="h-11 border-zinc-200"
              />
            </AnimatedField>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function AddedServiceItem({
  service,
  index,
  onRemove,
}: {
  service: ChdServiceEntry;
  index: number;
  onRemove: () => void;
}) {
  return (
    <motion.div
      layout
      variants={staggerItem}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex items-start justify-between gap-4 rounded-lg border border-zinc-200 bg-zinc-50/80 px-4 py-3"
    >
      <div className="min-w-0">
        <p className="text-sm font-semibold text-brand-navy">
          Sistema {index + 1}: {service.systemComponent || "Sem componente"}
        </p>
        <p className="mt-1 truncate text-xs text-zinc-500">
          {service.technician || "—"} · {service.manHours || "—"} H/H
        </p>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="shrink-0 text-zinc-400 hover:text-red-600"
        onClick={onRemove}
      >
        <Trash2 className="size-4" />
      </Button>
    </motion.div>
  );
}

export function ServicesTab({ value, onChange }: ServicesTabProps) {
  const [draft, setDraft] = useState<ServiceDraft>(createEmptyServiceDraft());

  function handleAddService() {
    onChange({
      items: [
        ...value.items,
        {
          id: crypto.randomUUID(),
          ...draft,
        },
      ],
    });
    setDraft(createEmptyServiceDraft());
  }

  function handleRemoveService(id: string) {
    onChange({
      items: value.items.filter((item) => item.id !== id),
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <ServiceFormCard draft={draft} onChange={setDraft} />

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
      >
        <Button
          type="button"
          className="h-10 bg-brand-navy px-5 text-white hover:bg-brand-navy-hover"
          onClick={handleAddService}
        >
          <Plus className="size-4" />
          {servicesSectionConfig.addSystemLabel}
        </Button>
      </motion.div>

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
                onRemove={() => handleRemoveService(service.id)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : null}
    </div>
  );
}

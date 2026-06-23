"use client";

import { useFormContext, type FieldErrors } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { Upload } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { staggerContainer } from "@/shared/motion/presets";
import { inspectionSectionConfig } from "../../config/inspection";
import type {
  CheInspectionForm,
  InspectionItemState,
  InspectionItemStatus,
} from "../../types/checklist";
import type { CheFormValues } from "../../lib/che-form-schema";
import { AnimatedField } from "../animated-field";
import { FormFieldError, getFieldErrorMessage } from "../form-field-error";

type InspectionItemRowProps = {
  itemId: string;
  label: string;
  value: InspectionItemState;
  statusError?: string;
  photoError?: string;
  onChange: (value: InspectionItemState) => void;
};

function InspectionItemRow({
  itemId,
  label,
  value,
  statusError,
  photoError,
  onChange,
}: InspectionItemRowProps) {
  const inputId = `che-inspection-photo-${itemId}`;

  function handleStatusChange(status: InspectionItemStatus) {
    onChange({
      status,
      photo: status === "anomaly" ? value.photo : null,
    });
  }

  return (
    <div className="border-b border-zinc-100 last:border-b-0">
      <div
        className={cn(
          "grid grid-cols-[minmax(0,1fr)_56px_56px_56px] items-center gap-2 py-3.5",
          statusError && "bg-red-50/40"
        )}
      >
        <div>
          <p className="text-sm text-zinc-700">{label}</p>
          <FormFieldError message={statusError} />
        </div>
        <RadioGroup
          value={value.status}
          onValueChange={(status) =>
            handleStatusChange(status as InspectionItemStatus)
          }
          className="col-span-3 grid grid-cols-3"
        >
          <div className="flex justify-center">
            <RadioGroupItem value="ok" aria-label={`${label} — OK`} />
          </div>
          <div className="flex justify-center">
            <RadioGroupItem value="anomaly" aria-label={`${label} — Anomalia`} />
          </div>
          <div className="flex justify-center">
            <RadioGroupItem value="na" aria-label={`${label} — NA`} />
          </div>
        </RadioGroup>
      </div>

      <AnimatePresence initial={false}>
        {value.status === "anomaly" ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-4 pl-1">
              <Label
                htmlFor={inputId}
                className="mb-2 block text-[11px] font-semibold tracking-wide text-zinc-500 uppercase"
              >
                {inspectionSectionConfig.photoLabel}
              </Label>
              <label
                htmlFor={inputId}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-lg border border-dashed px-3 py-2.5 transition-colors hover:border-zinc-400 hover:bg-zinc-50",
                  value.photo
                    ? "border-brand-orange/40 bg-orange-50/30"
                    : photoError
                      ? "border-red-300 bg-red-50/40"
                      : "border-zinc-300 bg-zinc-50/60"
                )}
              >
                <span className="inline-flex shrink-0 items-center rounded border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700">
                  {inspectionSectionConfig.chooseFileLabel}
                </span>
                <span className="truncate text-sm text-zinc-500">
                  {value.photo?.name ?? inspectionSectionConfig.emptyFileLabel}
                </span>
                <Upload className="ml-auto size-4 shrink-0 text-zinc-400" />
                <input
                  id={inputId}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(event) => {
                    const photo = event.target.files?.[0] ?? null;
                    onChange({ ...value, photo });
                  }}
                />
              </label>
              <FormFieldError message={photoError} />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

type InspectionSectionCardProps = {
  title: string;
  showHint?: boolean;
  items: { id: string; label: string }[];
  value: CheInspectionForm;
  itemErrors: FieldErrors<CheFormValues>["inspection"];
  onItemChange: (itemId: string, itemValue: InspectionItemState) => void;
};

function InspectionSectionCard({
  title,
  showHint = false,
  items,
  value,
  itemErrors,
  onItemChange,
}: InspectionSectionCardProps) {
  return (
    <div className="rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm">
      <h2 className="text-base font-bold text-brand-navy">{title}</h2>

      {showHint ? (
        <p className="mt-2 text-sm text-zinc-500">
          {inspectionSectionConfig.hint}{" "}
          <span className="font-semibold text-brand-navy">
            {inspectionSectionConfig.hintHighlight}
          </span>{" "}
          {inspectionSectionConfig.hintSuffix}
        </p>
      ) : null}

      <div className="mt-5 overflow-hidden rounded-lg border border-zinc-200">
        <div className="grid grid-cols-[minmax(0,1fr)_56px_56px_56px] gap-2 border-b border-zinc-200 bg-zinc-50/80 px-4 py-3">
          <span className="text-[11px] font-semibold tracking-wide text-zinc-500 uppercase">
            {inspectionSectionConfig.columns.item}
          </span>
          <span className="text-center text-[11px] font-semibold tracking-wide text-zinc-500 uppercase">
            {inspectionSectionConfig.columns.ok}
          </span>
          <span className="text-center text-[11px] font-semibold tracking-wide text-zinc-500 uppercase">
            {inspectionSectionConfig.columns.anomaly}
          </span>
          <span className="text-center text-[11px] font-semibold tracking-wide text-zinc-500 uppercase">
            {inspectionSectionConfig.columns.na}
          </span>
        </div>

        <div className="px-4">
          {items.map((item) => (
            <InspectionItemRow
              key={item.id}
              itemId={item.id}
              label={item.label}
              value={value[item.id] ?? { status: "", photo: null }}
              statusError={getFieldErrorMessage(itemErrors?.[item.id]?.status)}
              photoError={getFieldErrorMessage(itemErrors?.[item.id]?.photo)}
              onChange={(itemValue) => onItemChange(item.id, itemValue)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function InspectionTab() {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<CheFormValues>();
  const inspection = watch("inspection");

  function updateItem(itemId: string, itemValue: InspectionItemState) {
    setValue(`inspection.${itemId}`, itemValue, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  const [externaSection, cabineSection] = inspectionSectionConfig.sections;

  return (
    <motion.div
      className="flex flex-col gap-6"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <AnimatedField>
        <InspectionSectionCard
          title={externaSection.title}
          showHint
          items={[...externaSection.items]}
          value={inspection}
          itemErrors={errors.inspection}
          onItemChange={updateItem}
        />
      </AnimatedField>

      <AnimatedField>
        <InspectionSectionCard
          title={cabineSection.title}
          items={[...cabineSection.items]}
          value={inspection}
          itemErrors={errors.inspection}
          onItemChange={updateItem}
        />
      </AnimatedField>
    </motion.div>
  );
}

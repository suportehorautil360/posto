"use client";

import { useFormContext, type FieldErrors } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { DeselectableRadioGroup } from "@/shared/components/deselectable-radio-group";
import { ChecklistAnomalyFields } from "@/shared/components/checklist-anomaly-fields";
import { checklistStatusOptions } from "@/shared/config/checklist-status-options";
import { staggerContainer } from "@/shared/motion/presets";
import { cn } from "@/lib/utils";
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
  descriptionError?: string;
  onChange: (value: InspectionItemState) => void;
};

function InspectionItemRow({
  itemId,
  label,
  value,
  statusError,
  photoError,
  descriptionError,
  onChange,
}: InspectionItemRowProps) {
  function handleStatusChange(status: InspectionItemStatus) {
    onChange({
      status,
      photo: status === "anomaly" ? value.photo : null,
      description: status === "anomaly" ? value.description : "",
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
        <DeselectableRadioGroup
          value={value.status}
          onValueChange={(status) =>
            handleStatusChange(status as InspectionItemStatus)
          }
          options={checklistStatusOptions}
          variant="status-grid"
          itemLabel={label}
        />
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
            <ChecklistAnomalyFields
              itemId={itemId}
              idPrefix="che-inspection"
              photo={value.photo}
              description={value.description}
              photoLabel={inspectionSectionConfig.photoLabel}
              descriptionLabel={inspectionSectionConfig.descriptionLabel}
              descriptionPlaceholder={
                inspectionSectionConfig.descriptionPlaceholder
              }
              chooseFileLabel={inspectionSectionConfig.chooseFileLabel}
              emptyFileLabel={inspectionSectionConfig.emptyFileLabel}
              photoError={photoError}
              descriptionError={descriptionError}
              onPhotoChange={(photo) => onChange({ ...value, photo })}
              onDescriptionChange={(description) =>
                onChange({ ...value, description })
              }
            />
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
              value={value[item.id] ?? { status: "", photo: null, description: "" }}
              statusError={getFieldErrorMessage(itemErrors?.[item.id]?.status)}
              photoError={getFieldErrorMessage(itemErrors?.[item.id]?.photo)}
              descriptionError={getFieldErrorMessage(
                itemErrors?.[item.id]?.description
              )}
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

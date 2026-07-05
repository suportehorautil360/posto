"use client";

import { AnimatePresence, motion } from "framer-motion";
import { DeselectableRadioGroup } from "@/shared/components/deselectable-radio-group";
import { ChecklistAnomalyFields } from "@/shared/components/checklist-anomaly-fields";
import { checklistStatusOptions } from "@/shared/config/checklist-status-options";
import { staggerContainer } from "@/shared/motion/presets";
import { cn } from "@/lib/utils";
import { generalStateSectionConfig } from "../../config/general-state";
import { modulesSectionConfig } from "../../config/modules";
import type {
  ChdChecklistItemStatus,
  ChdModuleItemState,
  ChdModulesForm,
} from "../../types/form";
import type { ChdModulesFieldErrors } from "../../types/validation";
import { AnimatedField } from "../animated-field";
import { FormFieldError } from "../form-field-error";

type ModulesTabProps = {
  value: ChdModulesForm;
  errors?: ChdModulesFieldErrors;
  onChange: (value: ChdModulesForm) => void;
};

type ModuleItemRowProps = {
  itemId: string;
  label: string;
  value: ChdModuleItemState;
  errors?: ChdModulesFieldErrors[string];
  onChange: (value: ChdModuleItemState) => void;
};

function ModuleItemRow({
  itemId,
  label,
  value,
  errors,
  onChange,
}: ModuleItemRowProps) {
  function handleStatusChange(status: ChdChecklistItemStatus) {
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
          errors?.status && "bg-red-50/40"
        )}
      >
        <div>
          <p className="text-sm text-zinc-700">{label}</p>
          <FormFieldError message={errors?.status} />
        </div>
        <DeselectableRadioGroup
          value={value.status}
          onValueChange={(status) =>
            handleStatusChange(status as ChdChecklistItemStatus)
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
              idPrefix="chd-modules"
              photo={value.photo}
              description={value.description}
              photoLabel={generalStateSectionConfig.photoLabel}
              descriptionLabel={generalStateSectionConfig.descriptionLabel}
              descriptionPlaceholder={
                generalStateSectionConfig.descriptionPlaceholder
              }
              chooseFileLabel={generalStateSectionConfig.chooseFileLabel}
              emptyFileLabel={generalStateSectionConfig.emptyFileLabel}
              photoError={errors?.photo}
              descriptionError={errors?.description}
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

type ModuleSectionCardProps = {
  title: string;
  items: { id: string; label: string }[];
  value: ChdModulesForm;
  errors?: ChdModulesFieldErrors;
  onItemChange: (itemId: string, itemValue: ChdModuleItemState) => void;
};

function ModuleSectionCard({
  title,
  items,
  value,
  errors,
  onItemChange,
}: ModuleSectionCardProps) {
  return (
    <div className="rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm">
      <h2 className="text-base font-bold text-brand-navy">{title}</h2>
      <p className="mt-2 text-sm text-zinc-500">
        {modulesSectionConfig.hint}{" "}
        <span className="font-semibold text-brand-navy">
          {generalStateSectionConfig.anomalyHint.highlight}
        </span>{" "}
        {generalStateSectionConfig.anomalyHint.suffix}
      </p>

      <div className="mt-5 overflow-hidden rounded-lg border border-zinc-200">
        <div className="grid grid-cols-[minmax(0,1fr)_56px_56px_56px] gap-2 border-b border-zinc-200 bg-zinc-50/80 px-4 py-3">
          <span className="text-[11px] font-semibold tracking-wide text-zinc-500 uppercase">
            {modulesSectionConfig.columns.item}
          </span>
          <span className="text-center text-[11px] font-semibold tracking-wide text-zinc-500 uppercase">
            {modulesSectionConfig.columns.ok}
          </span>
          <span className="text-center text-[11px] font-semibold tracking-wide text-zinc-500 uppercase">
            {modulesSectionConfig.columns.anomaly}
          </span>
          <span className="text-center text-[11px] font-semibold tracking-wide text-zinc-500 uppercase">
            {modulesSectionConfig.columns.na}
          </span>
        </div>

        <div className="px-4">
          {items.map((item) => (
            <ModuleItemRow
              key={item.id}
              itemId={item.id}
              label={item.label}
              value={value[item.id] ?? { status: "", photo: null, description: "" }}
              errors={errors?.[item.id]}
              onChange={(itemValue) => onItemChange(item.id, itemValue)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ModulesTab({ value, errors, onChange }: ModulesTabProps) {
  function updateItem(itemId: string, itemValue: ChdModuleItemState) {
    onChange({ ...value, [itemId]: itemValue });
  }

  return (
    <motion.div
      className="flex flex-col gap-6"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {modulesSectionConfig.sections.map((section) => (
        <AnimatedField key={section.id}>
          <ModuleSectionCard
            title={section.title}
            items={[...section.items]}
            value={value}
            errors={errors}
            onItemChange={updateItem}
          />
        </AnimatedField>
      ))}
    </motion.div>
  );
}

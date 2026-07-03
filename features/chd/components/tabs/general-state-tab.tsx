"use client";

import { AnimatePresence, motion } from "framer-motion";
import { DeselectableRadioGroup } from "@/shared/components/deselectable-radio-group";
import { ChecklistAnomalyFields } from "@/shared/components/checklist-anomaly-fields";
import { checklistStatusOptions } from "@/shared/config/checklist-status-options";
import { staggerContainer } from "@/shared/motion/presets";
import { generalStateSectionConfig } from "../../config/general-state";
import type {
  ChdChecklistItemState,
  ChdChecklistItemStatus,
  ChdGeneralStateForm,
} from "../../types/form";
import type { ChdGeneralStateFieldErrors } from "../../types/validation";
import { AnimatedField } from "../animated-field";
import { FormFieldError } from "../form-field-error";

type GeneralStateTabProps = {
  value: ChdGeneralStateForm;
  errors?: ChdGeneralStateFieldErrors;
  onChange: (value: ChdGeneralStateForm) => void;
};

type ChecklistItemRowProps = {
  itemId: string;
  label: string;
  value: ChdChecklistItemState;
  errors?: ChdGeneralStateFieldErrors[string];
  onChange: (value: ChdChecklistItemState) => void;
};

function ChecklistItemRow({
  itemId,
  label,
  value,
  errors,
  onChange,
}: ChecklistItemRowProps) {
  function handleStatusChange(status: ChdChecklistItemStatus) {
    onChange({
      status,
      photo: status === "anomaly" ? value.photo : null,
      description: status === "anomaly" ? value.description : "",
    });
  }

  return (
    <div className="border-b border-zinc-100 last:border-b-0">
      <div className="grid grid-cols-[minmax(0,1fr)_56px_56px_56px] items-center gap-2 py-3.5">
        <p className="text-sm text-zinc-700">{label}</p>
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
      <FormFieldError message={errors?.status} />

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
              idPrefix="chd-general"
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

type ChecklistSectionCardProps = {
  title: string;
  showAnomalyHint?: boolean;
  functionalHint?: string;
  items: { id: string; label: string }[];
  value: ChdGeneralStateForm;
  errors?: ChdGeneralStateFieldErrors;
  onItemChange: (itemId: string, itemValue: ChdChecklistItemState) => void;
};

function ChecklistSectionCard({
  title,
  showAnomalyHint = false,
  functionalHint,
  items,
  value,
  errors,
  onItemChange,
}: ChecklistSectionCardProps) {
  return (
    <div className="rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm">
      <h2 className="text-base font-bold text-brand-navy">{title}</h2>

      {showAnomalyHint ? (
        <p className="mt-2 text-sm text-zinc-500">
          {generalStateSectionConfig.anomalyHint.prefix}{" "}
          <span className="font-semibold text-brand-navy">
            {generalStateSectionConfig.anomalyHint.highlight}
          </span>{" "}
          {generalStateSectionConfig.anomalyHint.suffix}
        </p>
      ) : null}

      {functionalHint ? (
        <p className="mt-2 text-sm text-zinc-500">{functionalHint}</p>
      ) : null}

      <div className="mt-5 overflow-hidden rounded-lg border border-zinc-200">
        <div className="grid grid-cols-[minmax(0,1fr)_56px_56px_56px] gap-2 border-b border-zinc-200 bg-zinc-50/80 px-4 py-3">
          <span className="text-[11px] font-semibold tracking-wide text-zinc-500 uppercase">
            {generalStateSectionConfig.columns.item}
          </span>
          <span className="text-center text-[11px] font-semibold tracking-wide text-zinc-500 uppercase">
            {generalStateSectionConfig.columns.ok}
          </span>
          <span className="text-center text-[11px] font-semibold tracking-wide text-zinc-500 uppercase">
            {generalStateSectionConfig.columns.anomaly}
          </span>
          <span className="text-center text-[11px] font-semibold tracking-wide text-zinc-500 uppercase">
            {generalStateSectionConfig.columns.na}
          </span>
        </div>

        <div className="px-4">
          {items.map((item) => (
            <ChecklistItemRow
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

export function GeneralStateTab({
  value,
  errors,
  onChange,
}: GeneralStateTabProps) {
  function updateItem(itemId: string, itemValue: ChdChecklistItemState) {
    onChange({ ...value, [itemId]: itemValue });
  }

  const [generalSection, functionalSection] =
    generalStateSectionConfig.sections;

  return (
    <motion.div
      className="flex flex-col gap-6"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <AnimatedField>
        <ChecklistSectionCard
          title={generalSection.title}
          showAnomalyHint={generalSection.showAnomalyHint}
          items={[...generalSection.items]}
          value={value}
          errors={errors}
          onItemChange={updateItem}
        />
      </AnimatedField>

      <AnimatedField>
        <ChecklistSectionCard
          title={functionalSection.title}
          functionalHint={generalStateSectionConfig.functionalHint}
          items={[...functionalSection.items]}
          value={value}
          errors={errors}
          onItemChange={updateItem}
        />
      </AnimatedField>
    </motion.div>
  );
}

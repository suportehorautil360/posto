"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Upload } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { staggerContainer } from "@/shared/motion/presets";
import { generalStateSectionConfig } from "../../config/general-state";
import type {
  ChdChecklistItemState,
  ChdChecklistItemStatus,
  ChdGeneralStateForm,
} from "../../types/form";
import { AnimatedField } from "../animated-field";

type GeneralStateTabProps = {
  value: ChdGeneralStateForm;
  onChange: (value: ChdGeneralStateForm) => void;
};

type ChecklistItemRowProps = {
  itemId: string;
  label: string;
  value: ChdChecklistItemState;
  onChange: (value: ChdChecklistItemState) => void;
};

function ChecklistItemRow({
  itemId,
  label,
  value,
  onChange,
}: ChecklistItemRowProps) {
  const inputId = `chd-general-photo-${itemId}`;

  function handleStatusChange(status: ChdChecklistItemStatus) {
    onChange({
      status,
      photo: status === "anomaly" ? value.photo : null,
    });
  }

  return (
    <div className="border-b border-zinc-100 last:border-b-0">
      <div className="grid grid-cols-[minmax(0,1fr)_56px_56px_56px] items-center gap-2 py-3.5">
        <p className="text-sm text-zinc-700">{label}</p>
        <RadioGroup
          value={value.status}
          onValueChange={(status) =>
            handleStatusChange(status as ChdChecklistItemStatus)
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
                {generalStateSectionConfig.photoLabel}
              </Label>
              <label
                htmlFor={inputId}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-zinc-300 bg-zinc-50/60 px-3 py-2.5 transition-colors hover:border-zinc-400 hover:bg-zinc-50",
                  value.photo && "border-brand-orange/40 bg-orange-50/30"
                )}
              >
                <span className="inline-flex shrink-0 items-center rounded border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700">
                  {generalStateSectionConfig.chooseFileLabel}
                </span>
                <span className="truncate text-sm text-zinc-500">
                  {value.photo?.name ?? generalStateSectionConfig.emptyFileLabel}
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
            </div>
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
  onItemChange: (itemId: string, itemValue: ChdChecklistItemState) => void;
};

function ChecklistSectionCard({
  title,
  showAnomalyHint = false,
  functionalHint,
  items,
  value,
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
              value={value[item.id] ?? { status: "", photo: null }}
              onChange={(itemValue) => onItemChange(item.id, itemValue)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function GeneralStateTab({ value, onChange }: GeneralStateTabProps) {
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
          onItemChange={updateItem}
        />
      </AnimatedField>

      <AnimatedField>
        <ChecklistSectionCard
          title={functionalSection.title}
          functionalHint={generalStateSectionConfig.functionalHint}
          items={[...functionalSection.items]}
          value={value}
          onItemChange={updateItem}
        />
      </AnimatedField>
    </motion.div>
  );
}

"use client";

import { useFormContext } from "react-hook-form";
import { motion } from "framer-motion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { staggerContainer } from "@/shared/motion/presets";
import { blocksSectionConfig } from "../../config/blocks";
import type {
  BlockItemState,
  CheBlocksForm,
  InspectionItemStatus,
} from "../../types/checklist";
import type { CheFormValues } from "../../lib/che-form-schema";
import { getBlocksValidationMessage } from "../../lib/che-validation-feedback";
import { AnimatedField } from "../animated-field";

type BlockItemRowProps = {
  label: string;
  value: BlockItemState;
  onChange: (value: BlockItemState) => void;
};

function BlockItemRow({ label, value, onChange }: BlockItemRowProps) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_56px_56px_56px] items-center gap-2 border-b border-zinc-100 py-3.5 last:border-b-0">
      <p className="text-sm text-zinc-700">{label}</p>
      <RadioGroup
        value={value.status}
        onValueChange={(status) =>
          onChange({ status: status as InspectionItemStatus })
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
  );
}

type BlockSectionCardProps = {
  title: string;
  items: { id: string; label: string }[];
  value: CheBlocksForm;
  onItemChange: (itemId: string, itemValue: BlockItemState) => void;
};

function BlockSectionCard({
  title,
  items,
  value,
  onItemChange,
}: BlockSectionCardProps) {
  return (
    <div className="rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm">
      <h2 className="text-base font-bold text-brand-navy">{title}</h2>
      <p className="mt-2 text-sm text-zinc-500">{blocksSectionConfig.hint}</p>

      <div className="mt-5 overflow-hidden rounded-lg border border-zinc-200">
        <div className="grid grid-cols-[minmax(0,1fr)_56px_56px_56px] gap-2 border-b border-zinc-200 bg-zinc-50/80 px-4 py-3">
          <span className="text-[11px] font-semibold tracking-wide text-zinc-500 uppercase">
            {blocksSectionConfig.columns.item}
          </span>
          <span className="text-center text-[11px] font-semibold tracking-wide text-zinc-500 uppercase">
            {blocksSectionConfig.columns.ok}
          </span>
          <span className="text-center text-[11px] font-semibold tracking-wide text-zinc-500 uppercase">
            {blocksSectionConfig.columns.anomaly}
          </span>
          <span className="text-center text-[11px] font-semibold tracking-wide text-zinc-500 uppercase">
            {blocksSectionConfig.columns.na}
          </span>
        </div>

        <div className="px-4">
          {items.map((item) => (
            <BlockItemRow
              key={item.id}
              label={item.label}
              value={value[item.id] ?? { status: "" }}
              onChange={(itemValue) => onItemChange(item.id, itemValue)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function BlocksTab() {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<CheFormValues>();
  const blocks = watch("blocks");
  const blocksError = getBlocksValidationMessage(errors);

  function updateItem(itemId: string, itemValue: BlockItemState) {
    setValue(`blocks.${itemId}`, itemValue, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  return (
    <motion.div
      className="flex flex-col gap-6"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {blocksError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm text-red-600">{blocksError}</p>
        </div>
      ) : null}

      {blocksSectionConfig.sections.map((section) => (
        <AnimatedField key={section.id}>
          <BlockSectionCard
            title={section.title}
            items={[...section.items]}
            value={blocks}
            onItemChange={updateItem}
          />
        </AnimatedField>
      ))}
    </motion.div>
  );
}

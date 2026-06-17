"use client";

import { motion } from "framer-motion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { staggerContainer } from "@/shared/motion/presets";
import { modulesSectionConfig } from "../../config/modules";
import type {
  ChdChecklistItemStatus,
  ChdModuleItemState,
  ChdModulesForm,
} from "../../types/form";
import { AnimatedField } from "../animated-field";

type ModulesTabProps = {
  value: ChdModulesForm;
  onChange: (value: ChdModulesForm) => void;
};

type ModuleItemRowProps = {
  label: string;
  value: ChdModuleItemState;
  onChange: (value: ChdModuleItemState) => void;
};

function ModuleItemRow({ label, value, onChange }: ModuleItemRowProps) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_56px_56px_56px] items-center gap-2 border-b border-zinc-100 py-3.5 last:border-b-0">
      <p className="text-sm text-zinc-700">{label}</p>
      <RadioGroup
        value={value.status}
        onValueChange={(status) =>
          onChange({ status: status as ChdChecklistItemStatus })
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

type ModuleSectionCardProps = {
  title: string;
  items: { id: string; label: string }[];
  value: ChdModulesForm;
  onItemChange: (itemId: string, itemValue: ChdModuleItemState) => void;
};

function ModuleSectionCard({
  title,
  items,
  value,
  onItemChange,
}: ModuleSectionCardProps) {
  return (
    <div className="rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm">
      <h2 className="text-base font-bold text-brand-navy">{title}</h2>
      <p className="mt-2 text-sm text-zinc-500">{modulesSectionConfig.hint}</p>

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

export function ModulesTab({ value, onChange }: ModulesTabProps) {
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
            onItemChange={updateItem}
          />
        </AnimatedField>
      ))}
    </motion.div>
  );
}

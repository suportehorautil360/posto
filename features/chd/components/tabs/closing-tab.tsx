"use client";

import { motion } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { staggerContainer } from "@/shared/motion/presets";
import { closingSectionConfig } from "../../config/closing";
import type { ChdClosingForm } from "../../types/form";
import { AnimatedField } from "../animated-field";

type ClosingTabProps = {
  value: ChdClosingForm;
  onChange: (value: ChdClosingForm) => void;
};

function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <Label htmlFor={htmlFor} className="mb-2 block text-xs font-medium text-zinc-500">
      {children}
    </Label>
  );
}

export function ClosingTab({ value, onChange }: ClosingTabProps) {
  function updateField<K extends keyof ChdClosingForm>(
    field: K,
    fieldValue: ChdClosingForm[K]
  ) {
    onChange({ ...value, [field]: fieldValue });
  }

  return (
    <div className="rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm">
      <h2 className="text-base font-bold text-brand-navy">
        {closingSectionConfig.title}
      </h2>
      <Separator className="my-5" />

      <motion.div
        className="grid gap-5"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <AnimatedField>
          <div className="flex items-start gap-3">
            <Checkbox
              id="chd-inventory-checked"
              checked={value.inventoryChecked}
              onCheckedChange={(checked) =>
                updateField("inventoryChecked", checked === true)
              }
              className="mt-0.5"
            />
            <Label
              htmlFor="chd-inventory-checked"
              className="cursor-pointer text-sm font-normal leading-snug text-zinc-600"
            >
              {closingSectionConfig.inventoryLabel}
            </Label>
          </div>
        </AnimatedField>

        <div className="grid gap-5 md:grid-cols-2">
          <AnimatedField>
            <FieldLabel htmlFor="chd-driver-signature">
              {closingSectionConfig.fields.driverSignature}
            </FieldLabel>
            <Input
              id="chd-driver-signature"
              value={value.driverSignature}
              onChange={(event) =>
                updateField("driverSignature", event.target.value)
              }
              className="h-24 border-zinc-200"
            />
          </AnimatedField>

          <AnimatedField>
            <FieldLabel htmlFor="chd-workshop-signature">
              {closingSectionConfig.fields.workshopSignature}
            </FieldLabel>
            <Input
              id="chd-workshop-signature"
              value={value.workshopSignature}
              onChange={(event) =>
                updateField("workshopSignature", event.target.value)
              }
              className="h-24 border-zinc-200"
            />
          </AnimatedField>
        </div>
      </motion.div>
    </div>
  );
}

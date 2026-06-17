"use client";

import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { staggerContainer } from "@/shared/motion/presets";
import { termSectionConfig } from "../../config/term";
import type { CheTermForm } from "../../types/checklist";
import { AnimatedField } from "../animated-field";

type TermTabProps = {
  value: CheTermForm;
  onChange: (value: CheTermForm) => void;
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

export function TermTab({ value, onChange }: TermTabProps) {
  function updateField<K extends keyof CheTermForm>(field: K, fieldValue: CheTermForm[K]) {
    onChange({ ...value, [field]: fieldValue });
  }

  return (
    <div className="rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm">
      <h2 className="text-base font-bold text-brand-navy">
        {termSectionConfig.title}
      </h2>
      <Separator className="my-5" />

      <motion.div
        className="grid gap-5"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <AnimatedField>
          <FieldLabel htmlFor="che-symptoms">
            {termSectionConfig.fields.symptoms}
          </FieldLabel>
          <Textarea
            id="che-symptoms"
            value={value.symptoms}
            onChange={(event) => updateField("symptoms", event.target.value)}
            className="min-h-36 resize-y border-zinc-200"
          />
        </AnimatedField>

        <div className="grid gap-5 md:grid-cols-2">
          <AnimatedField>
            <FieldLabel htmlFor="che-client-signature">
              {termSectionConfig.fields.clientSignature}
            </FieldLabel>
            <Input
              id="che-client-signature"
              value={value.clientSignature}
              onChange={(event) =>
                updateField("clientSignature", event.target.value)
              }
              className="h-11 border-zinc-200"
            />
          </AnimatedField>

          <AnimatedField>
            <FieldLabel htmlFor="che-workshop-signature">
              {termSectionConfig.fields.workshopSignature}
            </FieldLabel>
            <Input
              id="che-workshop-signature"
              value={value.workshopSignature}
              onChange={(event) =>
                updateField("workshopSignature", event.target.value)
              }
              className="h-11 border-zinc-200"
            />
          </AnimatedField>
        </div>
      </motion.div>
    </div>
  );
}

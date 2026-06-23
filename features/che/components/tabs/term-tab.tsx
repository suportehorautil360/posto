"use client";

import { useFormContext } from "react-hook-form";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { staggerContainer } from "@/shared/motion/presets";
import { termSectionConfig } from "../../config/term";
import type { CheFormValues } from "../../lib/che-form-schema";
import { AnimatedField } from "../animated-field";

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

export function TermTab() {
  const { register } = useFormContext<CheFormValues>();

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
            className="min-h-36 resize-y border-zinc-200"
            {...register("term.symptoms")}
          />
        </AnimatedField>

        <div className="grid gap-5 md:grid-cols-2">
          <AnimatedField>
            <FieldLabel htmlFor="che-client-signature">
              {termSectionConfig.fields.clientSignature}
            </FieldLabel>
            <Input
              id="che-client-signature"
              className="h-11 border-zinc-200"
              {...register("term.clientSignature")}
            />
          </AnimatedField>

          <AnimatedField>
            <FieldLabel htmlFor="che-workshop-signature">
              {termSectionConfig.fields.workshopSignature}
            </FieldLabel>
            <Input
              id="che-workshop-signature"
              className="h-11 border-zinc-200"
              {...register("term.workshopSignature")}
            />
          </AnimatedField>
        </div>
      </motion.div>
    </div>
  );
}

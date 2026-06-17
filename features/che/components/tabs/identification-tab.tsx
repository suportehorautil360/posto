"use client";

import type { CheIdentificationForm } from "../../types/checklist";
import {
  fuelLevelOptions,
  identificationSectionConfig,
} from "../../config/page";
import { AnimatedField } from "../animated-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { CalendarDays, Clock3 } from "lucide-react";
import { staggerContainer } from "@/shared/motion/presets";

type IdentificationTabProps = {
  value: CheIdentificationForm;
  onChange: (value: CheIdentificationForm) => void;
};

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

export function IdentificationTab({ value, onChange }: IdentificationTabProps) {
  function updateField<K extends keyof CheIdentificationForm>(
    field: K,
    fieldValue: CheIdentificationForm[K]
  ) {
    onChange({ ...value, [field]: fieldValue });
  }

  return (
    <div className="rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm">
      <h2 className="text-base font-bold text-brand-navy">
        {identificationSectionConfig.title}
      </h2>
      <Separator className="my-5" />

      <motion.div
        className="grid gap-5"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <AnimatedField>
            <FieldLabel htmlFor="che-os">{identificationSectionConfig.fields.os}</FieldLabel>
            <Input
              id="che-os"
              value={value.os}
              onChange={(event) => updateField("os", event.target.value)}
              className="h-11 border-zinc-200"
            />
          </AnimatedField>

          <AnimatedField>
            <FieldLabel htmlFor="che-entry-date" required>
              {identificationSectionConfig.fields.entryDate}
            </FieldLabel>
            <div className="relative">
              <Input
                id="che-entry-date"
                type="date"
                value={value.entryDate}
                onChange={(event) => updateField("entryDate", event.target.value)}
                placeholder={identificationSectionConfig.placeholders.entryDate}
                className="h-11 border-zinc-200 pr-10"
              />
              <CalendarDays className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-zinc-400" />
            </div>
          </AnimatedField>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <AnimatedField>
            <FieldLabel htmlFor="che-time">{identificationSectionConfig.fields.time}</FieldLabel>
            <div className="relative">
              <Input
                id="che-time"
                type="time"
                value={value.time}
                onChange={(event) => updateField("time", event.target.value)}
                placeholder={identificationSectionConfig.placeholders.time}
                className="h-11 border-zinc-200 pr-10"
              />
              <Clock3 className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-zinc-400" />
            </div>
          </AnimatedField>

          <AnimatedField>
            <FieldLabel htmlFor="che-responsible" required>
              {identificationSectionConfig.fields.responsible}
            </FieldLabel>
            <Input
              id="che-responsible"
              value={value.responsible}
              onChange={(event) => updateField("responsible", event.target.value)}
              className="h-11 border-zinc-200"
            />
          </AnimatedField>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <AnimatedField>
            <FieldLabel htmlFor="che-client" required>
              {identificationSectionConfig.fields.client}
            </FieldLabel>
            <Input
              id="che-client"
              value={value.client}
              onChange={(event) => updateField("client", event.target.value)}
              className="h-11 border-zinc-200"
            />
          </AnimatedField>

          <AnimatedField>
            <FieldLabel htmlFor="che-brand-model" required>
              {identificationSectionConfig.fields.brandModel}
            </FieldLabel>
            <Input
              id="che-brand-model"
              value={value.brandModel}
              onChange={(event) => updateField("brandModel", event.target.value)}
              className="h-11 border-zinc-200"
            />
          </AnimatedField>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <AnimatedField>
            <FieldLabel htmlFor="che-plate">
              {identificationSectionConfig.fields.platePrefix}
            </FieldLabel>
            <Input
              id="che-plate"
              value={value.platePrefix}
              onChange={(event) => updateField("platePrefix", event.target.value)}
              className="h-11 border-zinc-200"
            />
          </AnimatedField>

          <AnimatedField>
            <FieldLabel htmlFor="che-km">{identificationSectionConfig.fields.km}</FieldLabel>
            <Input
              id="che-km"
              value={value.km}
              onChange={(event) => updateField("km", event.target.value)}
              className="h-11 border-zinc-200"
            />
          </AnimatedField>
        </div>

        <AnimatedField className="md:max-w-[calc(50%-0.625rem)]">
          <FieldLabel htmlFor="che-hour-meter">
            {identificationSectionConfig.fields.hourMeter}
          </FieldLabel>
          <Input
            id="che-hour-meter"
            value={value.hourMeter}
            onChange={(event) => updateField("hourMeter", event.target.value)}
            className="h-11 border-zinc-200"
          />
        </AnimatedField>

        <AnimatedField>
          <FieldLabel htmlFor="che-fuel-e">
            {identificationSectionConfig.fields.fuel}
          </FieldLabel>
          <RadioGroup
            value={value.fuel}
            onValueChange={(fuel) =>
              updateField("fuel", fuel as CheIdentificationForm["fuel"])
            }
            className="flex flex-wrap gap-5 pt-1"
          >
            {fuelLevelOptions.map((level) => (
              <div key={level} className="flex items-center gap-2">
                <RadioGroupItem value={level} id={`che-fuel-${level}`} />
                <Label
                  htmlFor={`che-fuel-${level}`}
                  className="cursor-pointer text-sm font-medium text-zinc-700"
                >
                  {level}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </AnimatedField>
      </motion.div>
    </div>
  );
}

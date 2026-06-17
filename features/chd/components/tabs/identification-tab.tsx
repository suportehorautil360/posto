"use client";

import type { ChdIdentificationForm } from "../../types/form";
import {
  chdFuelLevelOptions,
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
import type { ChdFuelLevel } from "../../types/form";

type IdentificationTabProps = {
  value: ChdIdentificationForm;
  onChange: (value: ChdIdentificationForm) => void;
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
  function updateField<K extends keyof ChdIdentificationForm>(
    field: K,
    fieldValue: ChdIdentificationForm[K]
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
            <FieldLabel htmlFor="chd-date" required>
              {identificationSectionConfig.fields.date}
            </FieldLabel>
            <div className="relative">
              <Input
                id="chd-date"
                type="date"
                value={value.date}
                onChange={(event) => updateField("date", event.target.value)}
                placeholder={identificationSectionConfig.placeholders.date}
                className="h-11 border-zinc-200 pr-10"
              />
              <CalendarDays className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-zinc-400" />
            </div>
          </AnimatedField>

          <AnimatedField>
            <FieldLabel htmlFor="chd-time">
              {identificationSectionConfig.fields.time}
            </FieldLabel>
            <div className="relative">
              <Input
                id="chd-time"
                type="time"
                value={value.time}
                onChange={(event) => updateField("time", event.target.value)}
                placeholder={identificationSectionConfig.placeholders.time}
                className="h-11 border-zinc-200 pr-10"
              />
              <Clock3 className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-zinc-400" />
            </div>
          </AnimatedField>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <AnimatedField>
            <FieldLabel htmlFor="chd-brand-model" required>
              {identificationSectionConfig.fields.brandModel}
            </FieldLabel>
            <Input
              id="chd-brand-model"
              value={value.brandModel}
              onChange={(event) => updateField("brandModel", event.target.value)}
              className="h-11 border-zinc-200"
            />
          </AnimatedField>

          <AnimatedField>
            <FieldLabel htmlFor="chd-plate">
              {identificationSectionConfig.fields.platePrefix}
            </FieldLabel>
            <Input
              id="chd-plate"
              value={value.platePrefix}
              onChange={(event) => updateField("platePrefix", event.target.value)}
              className="h-11 border-zinc-200"
            />
          </AnimatedField>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <AnimatedField>
            <FieldLabel htmlFor="chd-km">
              {identificationSectionConfig.fields.currentKm}
            </FieldLabel>
            <Input
              id="chd-km"
              value={value.currentKm}
              onChange={(event) => updateField("currentKm", event.target.value)}
              className="h-11 border-zinc-200"
            />
          </AnimatedField>

          <AnimatedField>
            <FieldLabel htmlFor="chd-hour-meter">
              {identificationSectionConfig.fields.hourMeter}
            </FieldLabel>
            <Input
              id="chd-hour-meter"
              value={value.hourMeter}
              onChange={(event) => updateField("hourMeter", event.target.value)}
              className="h-11 border-zinc-200"
            />
          </AnimatedField>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <AnimatedField>
            <FieldLabel htmlFor="chd-driver" required>
              {identificationSectionConfig.fields.driver}
            </FieldLabel>
            <Input
              id="chd-driver"
              value={value.driver}
              onChange={(event) => updateField("driver", event.target.value)}
              className="h-11 border-zinc-200"
            />
          </AnimatedField>

          <AnimatedField>
            <FieldLabel htmlFor="chd-technical-responsible" required>
              {identificationSectionConfig.fields.technicalResponsible}
            </FieldLabel>
            <Input
              id="chd-technical-responsible"
              value={value.technicalResponsible}
              onChange={(event) =>
                updateField("technicalResponsible", event.target.value)
              }
              className="h-11 border-zinc-200"
            />
          </AnimatedField>
        </div>

        <AnimatedField>
          <FieldLabel htmlFor="chd-fuel-reserva">
            {identificationSectionConfig.fields.fuel}
          </FieldLabel>
          <RadioGroup
            value={value.fuel}
            onValueChange={(fuel) =>
              updateField("fuel", fuel as ChdFuelLevel | "")
            }
            className="flex flex-wrap gap-5 pt-1"
          >
            {chdFuelLevelOptions.map((option) => (
              <div key={option.value} className="flex items-center gap-2">
                <RadioGroupItem
                  value={option.value}
                  id={`chd-fuel-${option.value}`}
                />
                <Label
                  htmlFor={`chd-fuel-${option.value}`}
                  className="cursor-pointer text-sm font-medium text-zinc-700"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </AnimatedField>
      </motion.div>
    </div>
  );
}

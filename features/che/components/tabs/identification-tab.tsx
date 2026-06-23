"use client";

import { Controller, useFormContext } from "react-hook-form";
import type { CheFormValues } from "../../lib/che-form-schema";
import {
  fuelLevelOptions,
  identificationSectionConfig,
} from "../../config/page";
import { AnimatedField } from "../animated-field";
import { FormFieldError } from "../form-field-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { CalendarDays, Clock3 } from "lucide-react";
import { staggerContainer } from "@/shared/motion/presets";

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

export function IdentificationTab() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<CheFormValues>();

  const identificationErrors = errors.identification;

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
            <FieldLabel htmlFor="che-os">
              {identificationSectionConfig.fields.os}
            </FieldLabel>
            <Input
              id="che-os"
              className="h-11 border-zinc-200"
              {...register("identification.os")}
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
                placeholder={identificationSectionConfig.placeholders.entryDate}
                className="h-11 border-zinc-200 pr-10"
                {...register("identification.entryDate")}
              />
              <CalendarDays className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-zinc-400" />
            </div>
            <FormFieldError message={identificationErrors?.entryDate?.message} />
          </AnimatedField>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <AnimatedField>
            <FieldLabel htmlFor="che-time">
              {identificationSectionConfig.fields.time}
            </FieldLabel>
            <div className="relative">
              <Input
                id="che-time"
                type="time"
                placeholder={identificationSectionConfig.placeholders.time}
                className="h-11 border-zinc-200 pr-10"
                {...register("identification.time")}
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
              className="h-11 border-zinc-200"
              {...register("identification.responsible")}
            />
            <FormFieldError message={identificationErrors?.responsible?.message} />
          </AnimatedField>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <AnimatedField>
            <FieldLabel htmlFor="che-client" required>
              {identificationSectionConfig.fields.client}
            </FieldLabel>
            <Input
              id="che-client"
              className="h-11 border-zinc-200"
              {...register("identification.client")}
            />
            <FormFieldError message={identificationErrors?.client?.message} />
          </AnimatedField>

          <AnimatedField>
            <FieldLabel htmlFor="che-brand-model" required>
              {identificationSectionConfig.fields.brandModel}
            </FieldLabel>
            <Input
              id="che-brand-model"
              className="h-11 border-zinc-200"
              {...register("identification.brandModel")}
            />
            <FormFieldError message={identificationErrors?.brandModel?.message} />
          </AnimatedField>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <AnimatedField>
            <FieldLabel htmlFor="che-plate">
              {identificationSectionConfig.fields.platePrefix}
            </FieldLabel>
            <Input
              id="che-plate"
              className="h-11 border-zinc-200"
              {...register("identification.platePrefix")}
            />
          </AnimatedField>

          <AnimatedField>
            <FieldLabel htmlFor="che-km">
              {identificationSectionConfig.fields.km}
            </FieldLabel>
            <Input
              id="che-km"
              className="h-11 border-zinc-200"
              {...register("identification.km")}
            />
          </AnimatedField>
        </div>

        <AnimatedField className="md:max-w-[calc(50%-0.625rem)]">
          <FieldLabel htmlFor="che-hour-meter">
            {identificationSectionConfig.fields.hourMeter}
          </FieldLabel>
          <Input
            id="che-hour-meter"
            className="h-11 border-zinc-200"
            {...register("identification.hourMeter")}
          />
        </AnimatedField>

        <AnimatedField>
          <FieldLabel htmlFor="che-fuel-e">
            {identificationSectionConfig.fields.fuel}
          </FieldLabel>
          <Controller
            control={control}
            name="identification.fuel"
            render={({ field }) => (
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
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
            )}
          />
        </AnimatedField>
      </motion.div>
    </div>
  );
}

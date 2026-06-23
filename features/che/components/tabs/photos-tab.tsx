"use client";

import { Controller, useFormContext } from "react-hook-form";
import { motion } from "framer-motion";
import { Upload } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { staggerContainer } from "@/shared/motion/presets";
import { photosSectionConfig } from "../../config/page";
import type { ChePhotoSlot } from "../../types/checklist";
import type { CheFormValues } from "../../lib/che-form-schema";
import { AnimatedField } from "../animated-field";
import { FormFieldError } from "../form-field-error";

type PhotoUploadFieldProps = {
  id: ChePhotoSlot;
  label: string;
  file: File | null;
  errorMessage?: string;
  onChange: (file: File | null) => void;
};

function PhotoUploadField({
  id,
  label,
  file,
  errorMessage,
  onChange,
}: PhotoUploadFieldProps) {
  const inputId = `che-photo-${id}`;

  return (
    <div className="flex flex-col gap-2">
      <Label
        htmlFor={inputId}
        className="text-[11px] font-semibold tracking-wide text-zinc-500 uppercase"
      >
        {label}
      </Label>
      <label
        htmlFor={inputId}
        className={cn(
          "flex min-h-24 cursor-pointer flex-col justify-center rounded-lg border border-dashed px-4 py-3 transition-colors hover:border-zinc-400 hover:bg-zinc-50",
          file
            ? "border-brand-orange/40 bg-orange-50/30"
            : errorMessage
              ? "border-red-300 bg-red-50/40"
              : "border-zinc-300 bg-zinc-50/60"
        )}
      >
        <div className="flex items-center gap-3 rounded-md border border-zinc-200 bg-white px-3 py-2.5">
          <span className="inline-flex shrink-0 items-center rounded border border-zinc-200 bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-700">
            {photosSectionConfig.chooseFileLabel}
          </span>
          <span className="truncate text-sm text-zinc-500">
            {file?.name ?? photosSectionConfig.emptyFileLabel}
          </span>
          <Upload className="ml-auto size-4 shrink-0 text-zinc-400" />
        </div>
        <input
          id={inputId}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(event) => {
            const selectedFile = event.target.files?.[0] ?? null;
            onChange(selectedFile);
          }}
        />
      </label>
      <FormFieldError message={errorMessage} />
    </div>
  );
}

export function PhotosTab() {
  const {
    control,
    formState: { errors },
  } = useFormContext<CheFormValues>();

  return (
    <div className="rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm">
      <h2 className="text-base font-bold text-brand-navy">
        {photosSectionConfig.title}
      </h2>
      <div className="my-5 h-px bg-zinc-200" />

      <motion.div
        className="grid gap-5 md:grid-cols-2"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {photosSectionConfig.fields.map((field) => (
          <AnimatedField key={field.id}>
            <Controller
              control={control}
              name={`photos.${field.id}`}
              render={({ field: photoField }) => (
                <PhotoUploadField
                  id={field.id}
                  label={field.label}
                  file={photoField.value}
                  errorMessage={errors.photos?.[field.id]?.message}
                  onChange={photoField.onChange}
                />
              )}
            />
          </AnimatedField>
        ))}
      </motion.div>
    </div>
  );
}

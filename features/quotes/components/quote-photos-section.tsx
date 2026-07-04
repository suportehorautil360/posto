"use client";

import { Camera } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { FormFieldError } from "@/features/che/components/form-field-error";
import {
  newQuotePageConfig,
  quotePhotosSectionConfig,
} from "../config/page";
import type { QuotePhotoSlotId, QuotePhotosForm, QuotePhotoUrls } from "../types/quote";

type QuotePhotosSectionProps = {
  photos: QuotePhotosForm;
  photoUrls?: QuotePhotoUrls;
  errors?: Partial<Record<QuotePhotoSlotId, string>>;
  onPhotoChange: (slot: QuotePhotoSlotId, file: File | null) => void;
};

type PhotoUploadFieldProps = {
  id: QuotePhotoSlotId;
  label: string;
  file: File | null;
  existingUrl?: string;
  errorMessage?: string;
  onChange: (file: File | null) => void;
};

function PhotoUploadField({
  id,
  label,
  file,
  existingUrl,
  errorMessage,
  onChange,
}: PhotoUploadFieldProps) {
  const inputId = `quote-photo-${id}`;
  const displayLabel = file
    ? file.name
    : existingUrl
      ? quotePhotosSectionConfig.uploadedFileLabel
      : quotePhotosSectionConfig.emptyFileLabel;

  return (
    <div>
      <Label
        htmlFor={inputId}
        className="mb-2 block text-xs font-medium text-zinc-500"
      >
        {label}
        <span className="text-brand-orange"> *</span>
      </Label>
      <label
        htmlFor={inputId}
        className={cn(
          "flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-zinc-300 bg-zinc-50/60 px-3 py-2.5 transition-colors hover:border-zinc-400 hover:bg-zinc-50",
          (file || existingUrl) && "border-brand-orange/40 bg-orange-50/30",
          errorMessage && "border-red-300 bg-red-50/40"
        )}
      >
        <Camera className="size-4 shrink-0 text-zinc-400" />
        <span className="inline-flex shrink-0 items-center rounded border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700">
          {quotePhotosSectionConfig.chooseFileLabel}
        </span>
        <span className="truncate text-sm text-zinc-500">{displayLabel}</span>
        <input
          id={inputId}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(event) => onChange(event.target.files?.[0] ?? null)}
        />
      </label>
      <FormFieldError message={errorMessage} />
    </div>
  );
}

export function QuotePhotosSection({
  photos,
  photoUrls,
  errors,
  onPhotoChange,
}: QuotePhotosSectionProps) {
  return (
    <section className="rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm">
      <h2 className="text-base font-bold text-brand-navy">
        {newQuotePageConfig.sections.photos}
      </h2>
      <p className="mt-3 text-xs text-zinc-500">
        {newQuotePageConfig.hints.photos}
      </p>
      <div className="my-5 h-px bg-zinc-200" />
      <div className="grid gap-5 md:grid-cols-2">
        {quotePhotosSectionConfig.fields.map((field) => (
          <PhotoUploadField
            key={field.id}
            id={field.id}
            label={field.label}
            file={photos[field.id]}
            existingUrl={photoUrls?.[field.id]}
            errorMessage={errors?.[field.id]}
            onChange={(file) => onPhotoChange(field.id, file)}
          />
        ))}
      </div>
    </section>
  );
}

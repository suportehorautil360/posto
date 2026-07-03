"use client";

import { Upload } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return <p className="mt-1.5 text-xs text-red-600">{message}</p>;
}

type ChecklistAnomalyFieldsProps = {
  itemId: string;
  idPrefix: string;
  photo: File | null;
  description: string;
  photoLabel: string;
  descriptionLabel: string;
  descriptionPlaceholder: string;
  chooseFileLabel: string;
  emptyFileLabel: string;
  photoError?: string;
  descriptionError?: string;
  onPhotoChange: (photo: File | null) => void;
  onDescriptionChange: (description: string) => void;
};

export function ChecklistAnomalyFields({
  itemId,
  idPrefix,
  photo,
  description,
  photoLabel,
  descriptionLabel,
  descriptionPlaceholder,
  chooseFileLabel,
  emptyFileLabel,
  photoError,
  descriptionError,
  onPhotoChange,
  onDescriptionChange,
}: ChecklistAnomalyFieldsProps) {
  const photoInputId = `${idPrefix}-photo-${itemId}`;
  const descriptionInputId = `${idPrefix}-description-${itemId}`;

  return (
    <div className="space-y-4 pb-4 pl-1">
      <div>
        <Label
          htmlFor={photoInputId}
          className="mb-2 block text-[11px] font-semibold tracking-wide text-zinc-500 uppercase"
        >
          {photoLabel}
        </Label>
        <label
          htmlFor={photoInputId}
          className={cn(
            "flex cursor-pointer items-center gap-3 rounded-lg border border-dashed px-3 py-2.5 transition-colors hover:border-zinc-400 hover:bg-zinc-50",
            photo
              ? "border-brand-orange/40 bg-orange-50/30"
              : photoError
                ? "border-red-300 bg-red-50/40"
                : "border-zinc-300 bg-zinc-50/60"
          )}
        >
          <span className="inline-flex shrink-0 items-center rounded border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700">
            {chooseFileLabel}
          </span>
          <span className="truncate text-sm text-zinc-500">
            {photo?.name ?? emptyFileLabel}
          </span>
          <Upload className="ml-auto size-4 shrink-0 text-zinc-400" />
          <input
            id={photoInputId}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(event) => {
              onPhotoChange(event.target.files?.[0] ?? null);
            }}
          />
        </label>
        <FieldError message={photoError} />
      </div>

      <div>
        <Label
          htmlFor={descriptionInputId}
          className="mb-2 block text-[11px] font-semibold tracking-wide text-zinc-500 uppercase"
        >
          {descriptionLabel}
        </Label>
        <Textarea
          id={descriptionInputId}
          value={description}
          placeholder={descriptionPlaceholder}
          rows={3}
          aria-invalid={Boolean(descriptionError)}
          onChange={(event) => onDescriptionChange(event.target.value)}
        />
        <FieldError message={descriptionError} />
      </div>
    </div>
  );
}

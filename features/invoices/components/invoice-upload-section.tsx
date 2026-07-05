"use client";

import { useRef, useState } from "react";
import { FileUp, LoaderCircle, Plus } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  invoicesPageConfig,
  MAX_INVOICE_FILE_SIZE_BYTES,
} from "../config/page";
import { mapInvoiceUploadError } from "../lib/map-invoice-upload-error";
import {
  isValidInvoiceValueInput,
  normalizeInvoiceValueInput,
} from "../lib/parse-invoice-value";

type InvoiceUploadSectionProps = {
  disabled?: boolean;
  onUpload: (file: File, value: string) => Promise<void> | void;
};

export function InvoiceUploadSection({
  disabled = false,
  onUpload,
}: InvoiceUploadSectionProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [value, setValue] = useState("");

  function rejectMissingValue() {
    toast.error(invoicesPageConfig.upload.valueRequired);
  }

  function rejectInvalidValue() {
    toast.error(invoicesPageConfig.upload.valueInvalid);
  }

  function hasValidValue() {
    return isValidInvoiceValueInput(normalizeInvoiceValueInput(value));
  }

  function guardValueBeforeFile(): boolean {
    const normalized = normalizeInvoiceValueInput(value);

    if (!normalized) {
      rejectMissingValue();
      return false;
    }

    if (!isValidInvoiceValueInput(normalized)) {
      rejectInvalidValue();
      return false;
    }

    return true;
  }

  async function submitUpload(file: File) {
    const normalizedValue = normalizeInvoiceValueInput(value);

    if (!isValidInvoiceValueInput(normalizedValue)) {
      if (!normalizedValue) {
        rejectMissingValue();
      } else {
        rejectInvalidValue();
      }
      return;
    }

    setIsUploading(true);

    try {
      await onUpload(file, normalizedValue);
      toast.success(invoicesPageConfig.upload.success);
      setValue("");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? mapInvoiceUploadError(error.message)
          : invoicesPageConfig.upload.errors.generic
      );
    } finally {
      setIsUploading(false);
    }
  }

  async function handleFile(file: File | undefined) {
    if (!file || disabled || isUploading) {
      return;
    }

    if (!guardValueBeforeFile()) {
      return;
    }

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      toast.error(invoicesPageConfig.upload.invalidType);
      return;
    }

    if (file.size > MAX_INVOICE_FILE_SIZE_BYTES) {
      toast.error(invoicesPageConfig.upload.invalidSize);
      return;
    }

    await submitUpload(file);
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    void handleFile(file);
    event.target.value = "";
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);

    if (disabled || isUploading) {
      return;
    }

    if (!guardValueBeforeFile()) {
      return;
    }

    const file = event.dataTransfer.files?.[0];
    void handleFile(file);
  }

  return (
    <section className="rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange">
          <Plus className="size-5" />
        </div>
        <div className="min-w-0">
          <h2 className="text-base font-bold text-brand-navy">
            {invoicesPageConfig.upload.title}
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-zinc-500">
            {invoicesPageConfig.upload.description}
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="invoice-value"
            className="text-sm font-medium text-brand-navy"
          >
            {invoicesPageConfig.upload.valueLabel}
          </label>
          <Input
            id="invoice-value"
            inputMode="decimal"
            placeholder={invoicesPageConfig.upload.valuePlaceholder}
            value={value}
            disabled={disabled || isUploading}
            onChange={(event) => setValue(event.target.value)}
            className="max-w-xs"
            required
          />
        </div>

        <div
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-disabled={disabled || isUploading}
          onClick={() => {
            if (disabled || isUploading) {
              return;
            }

            if (!guardValueBeforeFile()) {
              return;
            }

            inputRef.current?.click();
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();

              if (disabled || isUploading) {
                return;
              }

              if (!guardValueBeforeFile()) {
                return;
              }

              inputRef.current?.click();
            }
          }}
          onDragEnter={(event) => {
            event.preventDefault();

            if (!disabled && !isUploading) {
              setIsDragging(true);
            }
          }}
          onDragOver={(event) => {
            event.preventDefault();

            if (!disabled && !isUploading) {
              setIsDragging(true);
            }
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            setIsDragging(false);
          }}
          onDrop={handleDrop}
          className={cn(
            "flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors",
            disabled || isUploading
              ? "cursor-not-allowed border-zinc-200 bg-zinc-50 opacity-60"
              : !hasValidValue()
                ? "cursor-not-allowed border-zinc-200 bg-zinc-50/80 opacity-80"
                : isDragging
                  ? "border-brand-orange bg-brand-orange/5"
                  : "border-zinc-300 bg-zinc-50/70 hover:border-brand-orange/60 hover:bg-brand-orange/5"
          )}
        >
          {isUploading ? (
            <LoaderCircle className="size-8 animate-spin text-brand-orange" />
          ) : (
            <FileUp className="size-8 text-brand-orange" />
          )}
          <p className="mt-4 text-sm font-medium text-brand-navy">
            {isUploading
              ? invoicesPageConfig.upload.uploading
              : invoicesPageConfig.upload.dropzoneTitle}
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            {invoicesPageConfig.upload.dropzoneHint}
          </p>
          {!hasValidValue() && !isUploading ? (
            <p className="mt-3 text-xs font-medium text-zinc-500">
              {invoicesPageConfig.upload.valueRequiredBeforePdf}
            </p>
          ) : null}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="hidden"
        disabled={disabled || isUploading}
        onChange={handleInputChange}
      />
    </section>
  );
}

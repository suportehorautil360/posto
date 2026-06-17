"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Camera, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { staggerContainer, staggerItem } from "@/shared/motion/presets";
import { partsSectionConfig } from "../../config/parts";
import { createEmptyPartEntry } from "../../lib/form-defaults";
import type {
  ChdOldPartDestination,
  ChdPartEntry,
  ChdPartsForm,
} from "../../types/form";
import { AnimatedField } from "../animated-field";

type PartsTabProps = {
  value: ChdPartsForm;
  onChange: (value: ChdPartsForm) => void;
};

type PhotoUploadFieldProps = {
  id: string;
  label: string;
  required?: boolean;
  file: File | null;
  onChange: (file: File | null) => void;
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

function PhotoUploadField({
  id,
  label,
  required,
  file,
  onChange,
}: PhotoUploadFieldProps) {
  return (
    <div>
      <FieldLabel htmlFor={id} required={required}>
        {label}
      </FieldLabel>
      <label
        htmlFor={id}
        className={cn(
          "flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-zinc-300 bg-zinc-50/60 px-3 py-2.5 transition-colors hover:border-zinc-400 hover:bg-zinc-50",
          file && "border-brand-orange/40 bg-orange-50/30"
        )}
      >
        <Camera className="size-4 shrink-0 text-zinc-400" />
        <span className="inline-flex shrink-0 items-center rounded border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700">
          {partsSectionConfig.chooseFileLabel}
        </span>
        <span className="truncate text-sm text-zinc-500">
          {file?.name ?? partsSectionConfig.emptyFileLabel}
        </span>
        <input
          id={id}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(event) => onChange(event.target.files?.[0] ?? null)}
        />
      </label>
    </div>
  );
}

function PartFormCard({
  part,
  index,
  onChange,
  onRemove,
  canRemove,
}: {
  part: ChdPartEntry;
  index: number;
  onChange: (part: ChdPartEntry) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const fieldId = (field: string) => `chd-part-${part.id}-${field}`;

  function updateField<K extends keyof ChdPartEntry>(
    field: K,
    fieldValue: ChdPartEntry[K]
  ) {
    onChange({ ...part, [field]: fieldValue });
  }

  return (
    <motion.div
      layout
      variants={staggerItem}
      initial="initial"
      animate="animate"
      exit="exit"
      className="rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm"
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-sm font-bold text-brand-navy">
          {partsSectionConfig.partItemLabel(index + 1)}
        </h3>
        {canRemove ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="shrink-0 text-zinc-400 hover:text-red-600"
            onClick={onRemove}
          >
            <Trash2 className="size-4" />
          </Button>
        ) : null}
      </div>

      <motion.div
        className="mt-5 grid gap-5"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <AnimatedField>
          <FieldLabel htmlFor={fieldId("description")} required>
            {partsSectionConfig.fields.description}
          </FieldLabel>
          <Input
            id={fieldId("description")}
            value={part.description}
            onChange={(event) => updateField("description", event.target.value)}
            placeholder={partsSectionConfig.placeholders.description}
            className="h-11 border-zinc-200"
          />
        </AnimatedField>

        <div className="grid gap-5 md:grid-cols-2">
          <AnimatedField>
            <FieldLabel htmlFor={fieldId("part-number")}>
              {partsSectionConfig.fields.partNumber}
            </FieldLabel>
            <Input
              id={fieldId("part-number")}
              value={part.partNumber}
              onChange={(event) => updateField("partNumber", event.target.value)}
              className="h-11 border-zinc-200"
            />
          </AnimatedField>

          <AnimatedField>
            <FieldLabel htmlFor={fieldId("brand")}>
              {partsSectionConfig.fields.brand}
            </FieldLabel>
            <Input
              id={fieldId("brand")}
              value={part.brand}
              onChange={(event) => updateField("brand", event.target.value)}
              className="h-11 border-zinc-200"
            />
          </AnimatedField>
        </div>

        <AnimatedField>
          <FieldLabel htmlFor={fieldId("dest-descarte")}>
            {partsSectionConfig.fields.oldPartDestination}
          </FieldLabel>
          <RadioGroup
            value={part.oldPartDestination}
            onValueChange={(destination) =>
              updateField(
                "oldPartDestination",
                destination as ChdOldPartDestination
              )
            }
            className="flex flex-wrap gap-5 pt-1"
          >
            {partsSectionConfig.destinations.map((option) => (
              <div key={option.value} className="flex items-center gap-2">
                <RadioGroupItem
                  value={option.value}
                  id={fieldId(`dest-${option.value}`)}
                />
                <Label
                  htmlFor={fieldId(`dest-${option.value}`)}
                  className="cursor-pointer text-sm font-medium text-zinc-700"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </AnimatedField>

        <div className="grid gap-5 md:grid-cols-2">
          <AnimatedField>
            <PhotoUploadField
              id={fieldId("new-photo")}
              label={partsSectionConfig.fields.newPhoto}
              required
              file={part.newPhoto}
              onChange={(file) => updateField("newPhoto", file)}
            />
          </AnimatedField>

          <AnimatedField>
            <PhotoUploadField
              id={fieldId("replaced-photo")}
              label={partsSectionConfig.fields.replacedPhoto}
              required
              file={part.replacedPhoto}
              onChange={(file) => updateField("replacedPhoto", file)}
            />
          </AnimatedField>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function PartsTab({ value, onChange }: PartsTabProps) {
  function handleAddPart() {
    onChange({
      items: [...value.items, createEmptyPartEntry()],
    });
  }

  function handleUpdatePart(id: string, part: ChdPartEntry) {
    onChange({
      items: value.items.map((item) => (item.id === id ? part : item)),
    });
  }

  function handleRemovePart(id: string) {
    onChange({
      items: value.items.filter((item) => item.id !== id),
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm">
        <h2 className="text-base font-bold text-brand-navy">
          {partsSectionConfig.title}
        </h2>
        <p className="mt-2 text-xs text-zinc-500">{partsSectionConfig.rule}</p>
      </div>

      <motion.div
        className="flex flex-col gap-4"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <AnimatePresence mode="popLayout">
          {value.items.map((part, index) => (
            <PartFormCard
              key={part.id}
              part={part}
              index={index}
              canRemove={value.items.length > 1}
              onChange={(updated) => handleUpdatePart(part.id, updated)}
              onRemove={() => handleRemovePart(part.id)}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
      >
        <Button
          type="button"
          className="h-10 bg-brand-navy px-5 text-white hover:bg-brand-navy-hover"
          onClick={handleAddPart}
        >
          <Plus className="size-4" />
          {partsSectionConfig.addPartLabel}
        </Button>
      </motion.div>
    </div>
  );
}

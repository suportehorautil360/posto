"use client";

import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { staggerContainer, staggerItem } from "@/shared/motion/presets";
import { partsSectionConfig } from "../../config/parts";
import {
  commitPartDraft,
  createEmptyPartDraftState,
  type PartDraft,
  type PartDraftErrors,
  validatePartDraft,
} from "../../lib/parts-form";
import type {
  ChdOldPartDestination,
  ChdPartEntry,
  ChdPartsForm,
} from "../../types/form";
import type { ChdPartsFieldErrors } from "../../types/validation";
import { AnimatedField } from "../animated-field";
import { FormFieldError } from "../form-field-error";

type PartsTabProps = {
  value: ChdPartsForm;
  errors?: ChdPartsFieldErrors;
  onChange: (value: ChdPartsForm) => void;
};

export type PartsTabHandle = {
  flushDraft: (showErrors?: boolean) => ChdPartsForm | null;
  getDraft: () => PartDraft;
};

type PhotoUploadFieldProps = {
  id: string;
  label: string;
  required?: boolean;
  file: File | null;
  errorMessage?: string;
  onChange: (file: File | null) => void;
  compact?: boolean;
};

function FieldLabel({
  htmlFor,
  children,
  required,
}: {
  htmlFor: string;
  children: ReactNode;
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
  errorMessage,
  onChange,
  compact = false,
}: PhotoUploadFieldProps) {
  return (
    <div>
      <FieldLabel htmlFor={id} required={required}>
        {label}
      </FieldLabel>
      <label
        htmlFor={id}
        className={cn(
          "flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-zinc-300 bg-zinc-50/60 transition-colors hover:border-zinc-400 hover:bg-zinc-50",
          compact ? "px-3 py-2" : "px-3 py-2.5",
          file && "border-brand-orange/40 bg-orange-50/30",
          errorMessage && "border-red-300 bg-red-50/40"
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
      <FormFieldError message={errorMessage} />
    </div>
  );
}

function PartDraftFormCard({
  draft,
  errors,
  onChange,
  onClearError,
}: {
  draft: PartDraft;
  errors: PartDraftErrors;
  onChange: (draft: PartDraft) => void;
  onClearError: (field: keyof PartDraft) => void;
}) {
  function updateField<K extends keyof PartDraft>(
    field: K,
    fieldValue: PartDraft[K]
  ) {
    onClearError(field);
    onChange({ ...draft, [field]: fieldValue });
  }

  return (
    <div className="rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm">
      <h2 className="text-base font-bold text-brand-navy">
        {partsSectionConfig.title}
      </h2>
      <p className="mt-2 text-xs text-zinc-500">{partsSectionConfig.rule}</p>

      <div className="mt-5 rounded-lg border border-zinc-200 p-5">
        <motion.div
          className="grid gap-5"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <AnimatedField>
            <FieldLabel htmlFor="chd-part-description" required>
              {partsSectionConfig.fields.description.label}
            </FieldLabel>
            <Input
              id="chd-part-description"
              value={draft.description}
              onChange={(event) => updateField("description", event.target.value)}
              placeholder={partsSectionConfig.placeholders.description}
              className={cn("h-11 border-zinc-200", errors.description && "border-red-300")}
            />
            <FormFieldError message={errors.description} />
          </AnimatedField>

          <div className="grid gap-5 md:grid-cols-2">
            <AnimatedField>
              <FieldLabel htmlFor="chd-part-number">
                {partsSectionConfig.fields.partNumber.label}
              </FieldLabel>
              <Input
                id="chd-part-number"
                value={draft.partNumber}
                onChange={(event) => updateField("partNumber", event.target.value)}
                className="h-11 border-zinc-200"
              />
            </AnimatedField>

            <AnimatedField>
              <FieldLabel htmlFor="chd-part-brand">
                {partsSectionConfig.fields.brand.label}
              </FieldLabel>
              <Input
                id="chd-part-brand"
                value={draft.brand}
                onChange={(event) => updateField("brand", event.target.value)}
                className="h-11 border-zinc-200"
              />
            </AnimatedField>
          </div>

          <AnimatedField>
            <FieldLabel htmlFor="chd-part-dest-descarte" required>
              {partsSectionConfig.fields.oldPartDestination.label}
            </FieldLabel>
            <RadioGroup
              value={draft.oldPartDestination}
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
                    id={`chd-part-dest-${option.value}`}
                  />
                  <Label
                    htmlFor={`chd-part-dest-${option.value}`}
                    className="cursor-pointer text-sm font-medium text-zinc-700"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            <FormFieldError message={errors.oldPartDestination} />
          </AnimatedField>

          <div className="grid gap-5 md:grid-cols-2">
            <AnimatedField>
              <PhotoUploadField
                id="chd-part-new-photo"
                label={partsSectionConfig.fields.newPhoto.label}
                required
                file={draft.newPhoto}
                errorMessage={errors.newPhoto}
                onChange={(file) => updateField("newPhoto", file)}
              />
            </AnimatedField>

            <AnimatedField>
              <PhotoUploadField
                id="chd-part-replaced-photo"
                label={partsSectionConfig.fields.replacedPhoto.label}
                required
                file={draft.replacedPhoto}
                errorMessage={errors.replacedPhoto}
                onChange={(file) => updateField("replacedPhoto", file)}
              />
            </AnimatedField>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function AddedPartItem({
  part,
  index,
  errors,
  onUpdate,
  onRemove,
}: {
  part: ChdPartEntry;
  index: number;
  errors?: PartDraftErrors;
  onUpdate: (part: ChdPartEntry) => void;
  onRemove: () => void;
}) {
  const destinationLabel = partsSectionConfig.destinations.find(
    (option) => option.value === part.oldPartDestination
  )?.label;

  function updateField<K extends keyof ChdPartEntry>(
    field: K,
    fieldValue: ChdPartEntry[K]
  ) {
    onUpdate({ ...part, [field]: fieldValue });
  }

  return (
    <motion.div
      layout
      variants={staggerItem}
      initial="initial"
      animate="animate"
      exit="exit"
      className="rounded-lg border border-zinc-200 bg-zinc-50/80 p-4"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-brand-navy">
            {partsSectionConfig.partItemLabel(index + 1)}:{" "}
            {part.description.trim() || partsSectionConfig.messages.noDescription}
          </p>
          <p className="mt-1 truncate text-xs text-zinc-500">
            {[part.partNumber, part.brand, destinationLabel]
              .filter(Boolean)
              .join(" · ") || "—"}
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="shrink-0 text-zinc-400 hover:text-red-600"
          onClick={onRemove}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <PhotoUploadField
          id={`chd-part-${part.id}-new-photo`}
          label={partsSectionConfig.fields.newPhoto.label}
          required
          compact
          file={part.newPhoto}
          errorMessage={errors?.newPhoto}
          onChange={(file) => updateField("newPhoto", file)}
        />
        <PhotoUploadField
          id={`chd-part-${part.id}-replaced-photo`}
          label={partsSectionConfig.fields.replacedPhoto.label}
          required
          compact
          file={part.replacedPhoto}
          errorMessage={errors?.replacedPhoto}
          onChange={(file) => updateField("replacedPhoto", file)}
        />
      </div>
      <FormFieldError message={errors?.oldPartDestination} />
    </motion.div>
  );
}

export const PartsTab = forwardRef<PartsTabHandle, PartsTabProps>(
  function PartsTab({ value, errors, onChange }, ref) {
    const [draft, setDraft] = useState<PartDraft>(createEmptyPartDraftState());
    const [localDraftErrors, setLocalDraftErrors] = useState<PartDraftErrors>({});
    const draftRef = useRef(draft);
    const valueRef = useRef(value);

    draftRef.current = draft;
    valueRef.current = value;

    const draftErrors: PartDraftErrors = {
      ...errors?.draft,
      ...localDraftErrors,
    };

    function clearDraftError(field: keyof PartDraft) {
      setLocalDraftErrors((current) => {
        if (!current[field]) {
          return current;
        }

        const next = { ...current };
        delete next[field];
        return next;
      });
    }

    function updateDraft(nextDraft: PartDraft) {
      setDraft(nextDraft);
    }

    function applyPartsUpdate(nextParts: ChdPartsForm) {
      valueRef.current = nextParts;
      onChange(nextParts);
    }

    function flushDraftState(showErrors = false) {
      const result = commitPartDraft(valueRef.current, draftRef.current);

      if (result.errors) {
        if (showErrors) {
          setLocalDraftErrors(result.errors);
          return null;
        }

        return valueRef.current;
      }

      if (!result.committed) {
        return valueRef.current;
      }

      applyPartsUpdate(result.parts);
      setDraft(createEmptyPartDraftState());
      setLocalDraftErrors({});
      return result.parts;
    }

    useImperativeHandle(ref, () => ({
      flushDraft: (showErrors = false) => flushDraftState(showErrors),
      getDraft: () => draftRef.current,
    }));

    function handleAddPart() {
      const nextDraftErrors = validatePartDraft(draft);

      if (Object.keys(nextDraftErrors).length > 0) {
        setLocalDraftErrors(nextDraftErrors);
        return;
      }

      const result = commitPartDraft(value, draft);

      if (result.errors) {
        setLocalDraftErrors(result.errors);
        return;
      }

      if (!result.committed) {
        return;
      }

      applyPartsUpdate(result.parts);
      setDraft(createEmptyPartDraftState());
      setLocalDraftErrors({});
    }

    function handleUpdatePart(id: string, part: ChdPartEntry) {
      applyPartsUpdate({
        items: value.items.map((item) => (item.id === id ? part : item)),
      });
    }

    function handleRemovePart(id: string) {
      applyPartsUpdate({
        items: value.items.filter((item) => item.id !== id),
      });
    }

    return (
      <div className="flex flex-col gap-4">
        <PartDraftFormCard
          draft={draft}
          errors={draftErrors}
          onChange={updateDraft}
          onClearError={clearDraftError}
        />

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

        {value.items.length > 0 ? (
          <motion.div
            className="flex flex-col gap-2"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <AnimatePresence mode="popLayout">
              {value.items.map((part, index) => (
                <AddedPartItem
                  key={part.id}
                  part={part}
                  index={index}
                  errors={errors?.items?.[part.id]}
                  onUpdate={(updated) => handleUpdatePart(part.id, updated)}
                  onRemove={() => handleRemovePart(part.id)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : null}
      </div>
    );
  }
);

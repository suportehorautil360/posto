"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, Package, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DeselectableRadioGroup } from "@/shared/components/deselectable-radio-group";
import { cn } from "@/lib/utils";
import { staggerContainer, staggerItem } from "@/shared/motion/presets";
import { partsSectionConfig } from "../../config/parts";
import {
  commitPartDraft,
  createEmptyPartDraftState,
  hasPartDraftErrors,
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
  prefilledFromOrcamento?: boolean;
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

function AddPartButton({
  onClick,
  variant = "primary",
  className,
  label = partsSectionConfig.addPartLabel,
}: {
  onClick: () => void;
  variant?: "primary" | "secondary";
  className?: string;
  label?: string;
}) {
  return (
    <Button
      type="button"
      onClick={onClick}
      className={cn(
        "gap-2 font-semibold shadow-sm transition-all",
        variant === "primary"
          ? "h-11 rounded-lg bg-brand-orange px-6 text-sm text-white hover:bg-brand-orange-hover hover:shadow-md"
          : "h-10 rounded-lg border border-brand-navy/15 bg-white px-4 text-sm text-brand-navy hover:border-brand-navy/25 hover:bg-brand-navy/5",
        className
      )}
    >
      <Plus className="size-4" />
      {label}
    </Button>
  );
}

function PartDraftFormFields({
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
        <DeselectableRadioGroup
          value={draft.oldPartDestination}
          onValueChange={(destination) =>
            updateField(
              "oldPartDestination",
              destination as ChdOldPartDestination
            )
          }
          options={partsSectionConfig.destinations.map((option) => ({
            value: option.value,
            label: option.label,
            id: `chd-part-dest-${option.value}`,
          }))}
        />
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
  );
}

function AddPartDialog({
  open,
  onOpenChange,
  draft,
  errors,
  onDraftChange,
  onClearError,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  draft: PartDraft;
  errors: PartDraftErrors;
  onDraftChange: (draft: PartDraft) => void;
  onClearError: (field: keyof PartDraft) => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="overflow-hidden border-zinc-200/80 p-0 sm:max-w-2xl"
      >
        <div className="border-b border-zinc-100 px-6 py-5">
          <DialogTitle className="text-xl font-bold text-brand-navy">
            {partsSectionConfig.modalTitle}
          </DialogTitle>
          <DialogDescription className="mt-2 text-sm text-zinc-500">
            {partsSectionConfig.modalDescription}
          </DialogDescription>
        </div>

        <div className="max-h-[min(70vh,640px)] overflow-y-auto px-6 py-6">
          <PartDraftFormFields
            draft={draft}
            errors={errors}
            onChange={onDraftChange}
            onClearError={onClearError}
          />
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-zinc-100 bg-zinc-50/80 px-6 py-4 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            className="h-10 border-zinc-200 bg-white"
            onClick={() => onOpenChange(false)}
          >
            {partsSectionConfig.modalCancel}
          </Button>
          <AddPartButton
            variant="primary"
            label={partsSectionConfig.modalConfirm}
            onClick={onConfirm}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function EmptyPartsState({ onAdd }: { onAdd: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center rounded-xl border border-dashed border-zinc-300 bg-zinc-50/60 px-6 py-14 text-center"
    >
      <div className="flex size-14 items-center justify-center rounded-2xl bg-brand-navy/10 text-brand-navy">
        <Package className="size-7" />
      </div>
      <h2 className="mt-5 text-base font-bold text-brand-navy">
        {partsSectionConfig.emptyTitle}
      </h2>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-zinc-500">
        {partsSectionConfig.emptyDescription}
      </p>
      <AddPartButton variant="primary" onClick={onAdd} className="mt-6" />
    </motion.div>
  );
}

function PartsListHeader({
  count,
  onAdd,
}: {
  count: number;
  onAdd: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-200/80 bg-white px-5 py-4 shadow-sm">
      <div>
        <h2 className="text-base font-bold text-brand-navy">
          {partsSectionConfig.listTitle}
        </h2>
        <p className="mt-0.5 text-xs text-zinc-500">
          {count} {count === 1 ? "peça adicionada" : "peças adicionadas"}
        </p>
      </div>
      <AddPartButton variant="secondary" onClick={onAdd} />
    </div>
  );
}

function PrefilledPartsHeader({
  count,
  onAddMore,
}: {
  count: number;
  onAddMore: () => void;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm">
      <div className="min-w-0 flex-1">
        <h2 className="text-base font-bold text-brand-navy">
          {partsSectionConfig.prefilledTitle}
        </h2>
        <p className="mt-2 text-xs text-zinc-500">
          {partsSectionConfig.prefilledRule}
        </p>
        <p className="mt-2 text-xs font-medium text-zinc-400">
          {count} {count === 1 ? "peça do orçamento" : "peças do orçamento"}
        </p>
      </div>
      <AddPartButton
        variant="secondary"
        label={partsSectionConfig.addMoreLabel}
        onClick={onAddMore}
        className="shrink-0"
      />
    </div>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-1 text-xs font-medium text-zinc-500">{label}</p>
      <div className="flex min-h-9 items-center rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-800">
        {value.trim() ? value : "—"}
      </div>
    </div>
  );
}

function AddedPartItem({
  part,
  index,
  errors,
  prefilled = false,
  onUpdate,
  onRemove,
}: {
  part: ChdPartEntry;
  index: number;
  errors?: PartDraftErrors;
  prefilled?: boolean;
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
          {!prefilled ? (
            <p className="mt-1 truncate text-xs text-zinc-500">
              {[part.partNumber, part.brand, destinationLabel]
                .filter(Boolean)
                .join(" · ") || "—"}
            </p>
          ) : null}
        </div>
        {!prefilled ? (
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

      {prefilled ? (
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <ReadOnlyField
            label={partsSectionConfig.fields.description.label}
            value={part.description}
          />
          <ReadOnlyField
            label={partsSectionConfig.fields.partNumber.label}
            value={part.partNumber}
          />
          <ReadOnlyField
            label={partsSectionConfig.fields.brand.label}
            value={part.brand}
          />
        </div>
      ) : null}

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
  function PartsTab(
    { value, errors, prefilledFromOrcamento = false, onChange },
    ref
  ) {
    const [draft, setDraft] = useState<PartDraft>(createEmptyPartDraftState());
    const [localDraftErrors, setLocalDraftErrors] = useState<PartDraftErrors>({});
    const [addModalOpen, setAddModalOpen] = useState(false);
    const draftRef = useRef(draft);
    const valueRef = useRef(value);

    draftRef.current = draft;
    valueRef.current = value;

    const draftErrors: PartDraftErrors = {
      ...errors?.draft,
      ...localDraftErrors,
    };

    const showPrefilledHeader =
      prefilledFromOrcamento && value.items.length > 0;
    const showManualFlow =
      !prefilledFromOrcamento || value.items.length === 0;
    const showAddPartDialog = showManualFlow || showPrefilledHeader;

    useEffect(() => {
      if (errors?.draft && hasPartDraftErrors(errors.draft)) {
        setAddModalOpen(true);
      }
    }, [errors?.draft]);

    function resetDraftState() {
      setDraft(createEmptyPartDraftState());
      setLocalDraftErrors({});
    }

    function openAddModal() {
      resetDraftState();
      setAddModalOpen(true);
    }

    function closeAddModal() {
      setAddModalOpen(false);
      resetDraftState();
    }

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
          setAddModalOpen(true);
          return null;
        }

        return valueRef.current;
      }

      if (!result.committed) {
        return valueRef.current;
      }

      applyPartsUpdate(result.parts);
      resetDraftState();
      return result.parts;
    }

    useImperativeHandle(ref, () => ({
      flushDraft: (showErrors = false) => flushDraftState(showErrors),
      getDraft: () => draftRef.current,
    }));

    function handleAddPartFromModal() {
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
      closeAddModal();
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
        {showPrefilledHeader ? (
          <PrefilledPartsHeader
            count={value.items.filter((item) => item.fromOrcamento).length}
            onAddMore={openAddModal}
          />
        ) : null}

        {showManualFlow ? (
          value.items.length === 0 ? (
            <EmptyPartsState onAdd={openAddModal} />
          ) : (
            <PartsListHeader count={value.items.length} onAdd={openAddModal} />
          )
        ) : null}

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
                  prefilled={part.fromOrcamento === true}
                  errors={errors?.items?.[part.id]}
                  onUpdate={(updated) => handleUpdatePart(part.id, updated)}
                  onRemove={() => handleRemovePart(part.id)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : null}

        {showAddPartDialog ? (
          <AddPartDialog
            open={addModalOpen}
            onOpenChange={(open) => {
              if (open) {
                setAddModalOpen(true);
                return;
              }

              closeAddModal();
            }}
            draft={draft}
            errors={draftErrors}
            onDraftChange={updateDraft}
            onClearError={clearDraftError}
            onConfirm={handleAddPartFromModal}
          />
        ) : null}
      </div>
    );
  }
);

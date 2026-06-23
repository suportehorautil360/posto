import { partsSectionConfig } from "../config/parts";
import type { ChdPartEntry, ChdPartsForm } from "../types/form";
import { createEmptyPartDraft } from "./form-defaults";

export type PartDraft = Omit<ChdPartEntry, "id">;

export type PartDraftErrors = Partial<Record<keyof PartDraft, string>>;

function partFieldMessage(
  field: keyof typeof partsSectionConfig.fields,
  suffix: string
) {
  return `${partsSectionConfig.fields[field].label}: ${suffix}`;
}

export function formatPartDraftErrorMessage(errors: PartDraftErrors): string {
  const firstKey = Object.keys(errors)[0] as keyof PartDraft | undefined;

  if (!firstKey) {
    return partsSectionConfig.fields.description.required;
  }

  const label = partsSectionConfig.fields[firstKey]?.label;

  if (label && errors[firstKey]) {
    return `${label}: ${errors[firstKey]}`;
  }

  return errors[firstKey] ?? partsSectionConfig.fields.description.required;
}

export function hasPartDraftErrors(errors: PartDraftErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function validatePartsForSave(parts: ChdPartsForm) {
  const included = parts.items.filter((item) => shouldIncludePart(item));

  if (included.length === 0) {
    return null;
  }

  const { fields } = partsSectionConfig;

  for (const [index, part] of included.entries()) {
    const itemLabel = partsSectionConfig.partItemLabel(index + 1);

    if (!part.description.trim()) {
      return `${itemLabel} — ${fields.description.label}: ${fields.description.required}`;
    }

    if (!(part.newPhoto instanceof File)) {
      return `${itemLabel} — ${fields.newPhoto.label}: ${fields.newPhoto.required}`;
    }

    if (!(part.replacedPhoto instanceof File)) {
      return `${itemLabel} — ${fields.replacedPhoto.label}: ${fields.replacedPhoto.required}`;
    }

    if (!part.oldPartDestination) {
      return `${itemLabel} — ${fields.oldPartDestination.label}: ${fields.oldPartDestination.required}`;
    }
  }

  return null;
}

function shouldIncludePart(item: ChdPartEntry) {
  return (
    item.description.trim() ||
    item.partNumber.trim() ||
    item.brand.trim() ||
    item.oldPartDestination ||
    item.newPhoto ||
    item.replacedPhoto
  );
}

export function isPartDraftFilled(draft: PartDraft) {
  return (
    draft.description.trim() ||
    draft.partNumber.trim() ||
    draft.brand.trim() ||
    draft.oldPartDestination ||
    draft.newPhoto ||
    draft.replacedPhoto
  );
}

export function validatePartDraft(draft: PartDraft): PartDraftErrors {
  const errors: PartDraftErrors = {};
  const { fields } = partsSectionConfig;

  if (!draft.description.trim()) {
    errors.description = fields.description.required;
  }

  if (!draft.newPhoto) {
    errors.newPhoto = fields.newPhoto.required;
  }

  if (!draft.replacedPhoto) {
    errors.replacedPhoto = fields.replacedPhoto.required;
  }

  if (!draft.oldPartDestination) {
    errors.oldPartDestination = fields.oldPartDestination.required;
  }

  return errors;
}

export function commitPartDraft(
  parts: ChdPartsForm,
  draft: PartDraft
): {
  parts: ChdPartsForm;
  committed: boolean;
  errors?: PartDraftErrors;
} {
  if (!isPartDraftFilled(draft)) {
    return { parts, committed: false };
  }

  const errors = validatePartDraft(draft);

  if (hasPartDraftErrors(errors)) {
    return { parts, committed: false, errors };
  }

  return {
    parts: {
      items: [
        ...parts.items,
        {
          id: crypto.randomUUID(),
          ...draft,
        },
      ],
    },
    committed: true,
  };
}

export function getPartEntryFieldErrors(part: ChdPartEntry): PartDraftErrors {
  return validatePartDraft({
    description: part.description,
    partNumber: part.partNumber,
    brand: part.brand,
    oldPartDestination: part.oldPartDestination,
    newPhoto: part.newPhoto,
    replacedPhoto: part.replacedPhoto,
  });
}

export type ChdPartsFieldErrors = {
  draft?: PartDraftErrors;
  items?: Record<string, PartDraftErrors>;
};

export function getChdPartsFieldErrors(
  parts: ChdPartsForm,
  draft?: PartDraft
): ChdPartsFieldErrors {
  const errors: ChdPartsFieldErrors = { items: {} };

  for (const part of parts.items) {
    if (!shouldIncludePart(part)) {
      continue;
    }

    const itemErrors = getPartEntryFieldErrors(part);

    if (hasPartDraftErrors(itemErrors)) {
      errors.items![part.id] = itemErrors;
    }
  }

  if (draft && isPartDraftFilled(draft)) {
    const draftErrors = validatePartDraft(draft);

    if (hasPartDraftErrors(draftErrors)) {
      errors.draft = draftErrors;
    }
  }

  return errors;
}

export function createEmptyPartDraftState(): PartDraft {
  return createEmptyPartDraft();
}

import { generalStateSectionConfig } from "../config/general-state";
import { chdTabOrder, identificationSectionConfig } from "../config/page";
import { chdValidationMessages } from "../config/validation";
import type { ChdFormState, ChdTabId } from "../types/form";
import type {
  ChdFieldErrors,
  ChdGeneralStateFieldErrors,
  ChdIdentificationFieldErrors,
  ChdPartDraft,
} from "../types/validation";
import {
  getChdPartsFieldErrors,
  hasPartDraftErrors,
} from "./parts-form";

export type ChdValidationError = {
  tab: ChdTabId;
  errors: ChdFieldErrors;
  message: string;
};

const essentialTabs = new Set<ChdTabId>([
  "identificacao",
  "estado-geral",
  "pecas",
]);

function hasFilledStatus(status: string) {
  return status === "ok" || status === "anomaly" || status === "na";
}

export function getChdIdentificationFieldErrors(
  identification: ChdFormState["identification"]
): ChdIdentificationFieldErrors {
  const errors: ChdIdentificationFieldErrors = {};

  if (!identification.date.trim()) {
    errors.date = chdValidationMessages.required;
  }

  if (!identification.brandModel.trim()) {
    errors.brandModel = chdValidationMessages.required;
  }

  if (!identification.driver.trim()) {
    errors.driver = chdValidationMessages.required;
  }

  if (!identification.technicalResponsible.trim()) {
    errors.technicalResponsible = chdValidationMessages.required;
  }

  return errors;
}

export function getChdGeneralStateFieldErrors(
  generalState: ChdFormState["generalState"]
): ChdGeneralStateFieldErrors {
  const errors: ChdGeneralStateFieldErrors = {};

  for (const section of generalStateSectionConfig.sections) {
    for (const item of section.items) {
      const entry = generalState[item.id];
      const itemErrors: ChdGeneralStateFieldErrors[string] = {};

      if (!entry || !hasFilledStatus(entry.status)) {
        itemErrors.status = chdValidationMessages.requiredInspectionStatus;
      }

      if (
        entry?.status === "anomaly" &&
        !(entry.photo instanceof File)
      ) {
        itemErrors.photo = chdValidationMessages.requiredAnomalyPhoto;
      }

      if (Object.keys(itemErrors).length > 0) {
        errors[item.id] = itemErrors;
      }
    }
  }

  return errors;
}

export function hasChdFieldErrors(errors: ChdFieldErrors) {
  if (errors.identification && Object.keys(errors.identification).length > 0) {
    return true;
  }

  if (errors.generalState && Object.keys(errors.generalState).length > 0) {
    return true;
  }

  if (errors.parts) {
    if (errors.parts.draft && Object.keys(errors.parts.draft).length > 0) {
      return true;
    }

    if (
      errors.parts.items &&
      Object.values(errors.parts.items).some(
        (itemErrors) => Object.keys(itemErrors).length > 0
      )
    ) {
      return true;
    }
  }

  return false;
}

export function mergeChdFieldErrors(
  ...errorGroups: ChdFieldErrors[]
): ChdFieldErrors {
  return errorGroups.reduce<ChdFieldErrors>(
    (merged, current) => ({
      identification: {
        ...merged.identification,
        ...current.identification,
      },
      generalState: {
        ...merged.generalState,
        ...current.generalState,
      },
      parts: {
        draft: {
          ...merged.parts?.draft,
          ...current.parts?.draft,
        },
        items: {
          ...merged.parts?.items,
          ...current.parts?.items,
        },
      },
    }),
    {}
  );
}

export function getFirstChdFieldErrorMessage(errors: ChdFieldErrors) {
  if (errors.identification) {
    const first = Object.values(errors.identification)[0];

    if (first) return first;
  }

  if (errors.generalState) {
    for (const itemErrors of Object.values(errors.generalState)) {
      if (itemErrors.status) return itemErrors.status;
      if (itemErrors.photo) return itemErrors.photo;
    }
  }

  if (errors.parts?.draft) {
    const first = Object.values(errors.parts.draft)[0];

    if (first) return first;
  }

  if (errors.parts?.items) {
    for (const itemErrors of Object.values(errors.parts.items)) {
      const first = Object.values(itemErrors)[0];

      if (first) return first;
    }
  }

  return chdValidationMessages.fixTab;
}

export function getChdTabFieldErrors(
  form: ChdFormState,
  tab: ChdTabId,
  options?: { partsDraft?: ChdPartDraft }
): ChdFieldErrors {
  switch (tab) {
    case "identificacao":
      return {
        identification: getChdIdentificationFieldErrors(form.identification),
      };
    case "estado-geral":
      return {
        generalState: getChdGeneralStateFieldErrors(form.generalState),
      };
    case "pecas":
      return {
        parts: getChdPartsFieldErrors(form.parts, options?.partsDraft),
      };
    default:
      return {};
  }
}

export function validateChdTab(
  form: ChdFormState,
  tab: ChdTabId,
  options?: { partsDraft?: ChdPartDraft }
): ChdValidationError | null {
  const errors = getChdTabFieldErrors(form, tab, options);

  if (!hasChdFieldErrors(errors)) {
    return null;
  }

  return {
    tab,
    errors,
    message: getFirstChdFieldErrorMessage(errors),
  };
}

export function validateChdFormForSave(
  form: ChdFormState,
  options?: { partsDraft?: ChdPartDraft }
): ChdValidationError | null {
  let mergedErrors: ChdFieldErrors = {};
  let firstTab: ChdTabId | null = null;

  for (const tab of chdTabOrder) {
    if (!essentialTabs.has(tab)) {
      continue;
    }

    const tabErrors = getChdTabFieldErrors(form, tab, options);

    if (hasChdFieldErrors(tabErrors)) {
      mergedErrors = mergeChdFieldErrors(mergedErrors, tabErrors);

      if (!firstTab) {
        firstTab = tab;
      }
    }
  }

  if (!firstTab) {
    return null;
  }

  return {
    tab: firstTab,
    errors: mergedErrors,
    message: getFirstChdFieldErrorMessage(mergedErrors),
  };
}

export function clearChdTabFieldErrors(
  errors: ChdFieldErrors,
  tab: ChdTabId
): ChdFieldErrors {
  switch (tab) {
    case "identificacao":
      return { ...errors, identification: undefined };
    case "estado-geral":
      return { ...errors, generalState: undefined };
    case "pecas":
      return { ...errors, parts: undefined };
    default:
      return errors;
  }
}

// Backward-compatible helpers used before save upload.
export function validateChdPartsSection(
  parts: ChdFormState["parts"],
  draft?: ChdPartDraft
) {
  const partsErrors = getChdPartsFieldErrors(parts, draft);

  if (!hasChdFieldErrors({ parts: partsErrors })) {
    return null;
  }

  return getFirstChdFieldErrorMessage({ parts: partsErrors });
}

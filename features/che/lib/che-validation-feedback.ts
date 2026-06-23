import type { FieldErrors } from "react-hook-form";
import { cheValidationMessages } from "../config/validation";
import type { CheTabId } from "../types/checklist";
import { getFieldErrorMessage } from "./get-field-error-message";
import type { CheFormValues } from "./che-form-schema";

export function getBlocksValidationMessage(
  errors: FieldErrors<CheFormValues>
): string | undefined {
  return (
    getFieldErrorMessage(errors.blocks?.root) ??
    getFieldErrorMessage(
      errors.blocks && "message" in errors.blocks ? errors.blocks : undefined
    )
  );
}

export function resolveCheTabValidationMessage(
  tab: CheTabId,
  errors: FieldErrors<CheFormValues>
): string {
  if (tab === "blocos") {
    return (
      getBlocksValidationMessage(errors) ??
      cheValidationMessages.requiredAtLeastOneBlock
    );
  }

  return cheValidationMessages.fixTab;
}

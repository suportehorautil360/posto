import { invoicesPageConfig } from "../config/page";

export function mapInvoiceUploadError(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes("duplic") || normalized.includes("409")) {
    return invoicesPageConfig.upload.errors.duplicate;
  }

  if (
    normalized.includes("valor") ||
    normalized.includes("value") ||
    normalized.includes("400")
  ) {
    return message;
  }

  return invoicesPageConfig.upload.errors.generic;
}

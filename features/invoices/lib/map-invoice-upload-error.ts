import { invoicesPageConfig } from "../config/page";

export function mapInvoiceUploadError(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes("duplic") || normalized.includes("409")) {
    return invoicesPageConfig.upload.errors.duplicate;
  }

  return invoicesPageConfig.upload.errors.generic;
}

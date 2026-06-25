import {
  invoiceCategoryLabels,
  invoiceDocumentTypeLabels,
} from "../config/page";
import type { Invoice, InvoiceCategory } from "../types/invoice";

export function formatInvoiceCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatInvoiceDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("pt-BR");
}

export function formatInvoiceDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatInvoiceSummary(invoice: Invoice) {
  const documentLabel = invoiceDocumentTypeLabels[invoice.documentType];

  return `${documentLabel} nº ${invoice.number} · ${invoice.issuerName} · ${formatInvoiceDate(invoice.issuedAt)}`;
}

export function formatCategoryLabel(category: InvoiceCategory) {
  return invoiceCategoryLabels[category].toUpperCase();
}

export function formatAccessKey(accessKey: string) {
  const digits = accessKey.replace(/\D/g, "");

  if (digits.length !== 44) {
    return accessKey;
  }

  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

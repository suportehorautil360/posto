import type { Invoice } from "../types/invoice";

/** Valor confiável para KPI — alinhado ao back (`valorContabilNotaFiscal`). */
export function accountableInvoiceValue(invoice: Invoice): number {
  if (invoice.parseCompleteness === "completo") {
    return invoice.value;
  }

  const key = invoice.accessKey.replace(/\D/g, "");
  if (key.length === 44) {
    return invoice.value;
  }

  if (invoice.value > 0 && invoice.issuerName !== "Aguardando leitura do PDF") {
    return invoice.value;
  }

  return 0;
}

/** Mês dos KPIs = quando a nota foi lançada no sistema (não emissão do PDF). */
export function invoiceStatsMonthDate(invoice: Invoice): Date {
  return new Date(invoice.createdAt);
}

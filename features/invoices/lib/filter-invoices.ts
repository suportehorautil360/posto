import type { Invoice, InvoiceFilter, InvoiceMonthStats } from "../types/invoice";

function isSameMonth(left: Date, right: Date) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth()
  );
}

export function filterInvoices(
  invoices: Invoice[],
  search: string,
  statusFilter: InvoiceFilter
) {
  const query = search.trim().toLowerCase();

  return invoices.filter((invoice) => {
    if (statusFilter === "aprovadas" && invoice.status !== "aprovada") {
      return false;
    }

    if (statusFilter === "pendentes" && invoice.status !== "pendente") {
      return false;
    }

    if (statusFilter === "rejeitadas" && invoice.status !== "rejeitada") {
      return false;
    }

    if (!query) {
      return true;
    }

    return (
      invoice.description.toLowerCase().includes(query) ||
      invoice.issuerName.toLowerCase().includes(query) ||
      invoice.number.includes(query) ||
      invoice.fileName.toLowerCase().includes(query) ||
      invoice.accessKey.includes(query.replace(/\s/g, ""))
    );
  });
}

export function computeMonthStats(invoices: Invoice[]): InvoiceMonthStats {
  const now = new Date();

  const monthInvoices = invoices.filter((invoice) => {
    const createdAt = new Date(invoice.createdAt);

    return !Number.isNaN(createdAt.getTime()) && isSameMonth(createdAt, now);
  });

  return {
    totalValue: monthInvoices.reduce((sum, invoice) => sum + invoice.value, 0),
    approvedValue: monthInvoices
      .filter((invoice) => invoice.status === "aprovada")
      .reduce((sum, invoice) => sum + invoice.value, 0),
    pendingCount: monthInvoices.filter(
      (invoice) => invoice.status === "pendente"
    ).length,
  };
}

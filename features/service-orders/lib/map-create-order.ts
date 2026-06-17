import type { CreateOrderStatus } from "../config/create-order";
import type { ServiceOrder } from "../types/service-order";

export type CreateOrderFormPayload = {
  code: string;
  openedAt: string;
  client: string;
  machine: string;
  status: CreateOrderStatus;
  value: string;
};

function parseBrazilianCurrency(value: string): number | null {
  const normalized = value.replace(/\./g, "").replace(",", ".").trim();
  const parsed = Number.parseFloat(normalized);

  if (Number.isNaN(parsed)) return null;

  return parsed;
}

function formatIsoDateToDisplay(iso: string): string {
  const [year, month, day] = iso.split("-");

  if (!year || !month || !day) return iso;

  return `${day}/${month}/${year}`;
}

export function mapCreateFormToServiceOrder(
  form: CreateOrderFormPayload
): ServiceOrder {
  const quotedValue = parseBrazilianCurrency(form.value);

  return {
    id: crypto.randomUUID(),
    code: form.code,
    client: form.client.trim(),
    machine: form.machine.trim(),
    openedAt: formatIsoDateToDisplay(form.openedAt),
    status: "recebida",
    quotedValue: quotedValue && quotedValue > 0 ? quotedValue : null,
    tab: "recebidas",
  };
}

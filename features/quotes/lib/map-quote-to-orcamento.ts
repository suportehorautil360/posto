import type { PostOrcamentoPayload } from "@/features/service-orders/types/orcamento-api";
import type { QuoteFormState } from "../types/quote";
import {
  calculatePartTotal,
  calculateServiceTotal,
  calculateTravelTotal,
  parseNumericInput,
} from "./calculations";

const DEFAULT_PRAZO_DIAS = 7;

function buildItemDescription(primary: string, fallback: string) {
  const value = primary.trim() || fallback.trim();

  return value || "Item";
}

export function resolvePrazoDias(validityDays: string): number {
  const parsed = Number.parseInt(validityDays.trim(), 10);

  if (Number.isNaN(parsed) || parsed <= 0) {
    return DEFAULT_PRAZO_DIAS;
  }

  return parsed;
}

export function buildOrcamentoItems(form: QuoteFormState) {
  const items: PostOrcamentoPayload["items"] = [];

  for (const part of form.parts) {
    const value = calculatePartTotal(part.quantity, part.unitValue);

    if (value <= 0) continue;

    items.push({
      category: "part",
      description: buildItemDescription(
        part.description,
        part.code ? `Peça ${part.code}` : "Peça"
      ),
      value: Math.round(value * 100) / 100,
      code: part.code.trim() || undefined,
      brand: part.brand.trim() || undefined,
      quantity: parseNumericInput(part.quantity),
      unitValue: parseNumericInput(part.unitValue),
    });
  }

  for (const service of form.services) {
    const value = calculateServiceTotal(service.hours, service.hourlyRate);

    if (value <= 0) continue;

    items.push({
      category: "service",
      description: buildItemDescription(service.description, "Mão de obra"),
      value: Math.round(value * 100) / 100,
      hourType: service.hourType,
      hours: parseNumericInput(service.hours),
      hourlyRate: parseNumericInput(service.hourlyRate),
    });
  }

  const travelValue = calculateTravelTotal(
    form.travel.km,
    form.travel.valuePerKm,
    form.travel.travelHours,
    form.travel.hourlyRate,
    form.travel.fees
  );

  if (travelValue > 0) {
    items.push({
      category: "travel",
      description: "Deslocamento",
      value: Math.round(travelValue * 100) / 100,
      km: parseNumericInput(form.travel.km),
      valuePerKm: parseNumericInput(form.travel.valuePerKm),
      travelHours: parseNumericInput(form.travel.travelHours),
      travelHourlyRate: parseNumericInput(form.travel.hourlyRate),
      fees: parseNumericInput(form.travel.fees),
    });
  }

  return items;
}

export function buildOrcamentoPayload(
  solicitacaoOsId: string,
  oficinaId: string,
  form: QuoteFormState
): PostOrcamentoPayload {
  const items = buildOrcamentoItems(form);

  if (items.length === 0) {
    throw new Error("Adicione ao menos um item com valor ao orçamento.");
  }

  return {
    solicitacaoOsId,
    oficinaId,
    prazoDias: resolvePrazoDias(form.customer.validityDays),
    items,
  };
}

export function buildOrcamentoUpdatePayload(
  oficinaId: string,
  form: QuoteFormState
) {
  const items = buildOrcamentoItems(form);

  if (items.length === 0) {
    throw new Error("Adicione ao menos um item com valor ao orçamento.");
  }

  return {
    oficinaId,
    prazoDias: resolvePrazoDias(form.customer.validityDays),
    items,
  };
}

export function validateOrcamentoTotal(items: PostOrcamentoPayload["items"]) {
  const total = items.reduce((sum, item) => sum + item.value, 0);

  if (total <= 0) {
    throw new Error("O total do orçamento precisa ser maior que zero.");
  }

  return Math.round(total * 100) / 100;
}

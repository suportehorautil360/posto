import { hourTypeOptions } from "@/features/quotes/config/page";
import {
  formatCurrency,
  parseNumericInput,
} from "@/features/quotes/lib/calculations";
import type { ChdServiceEntry } from "../types/form";

function labelHourType(value: string) {
  return (
    hourTypeOptions.find((option) => option.value === value)?.label ?? value
  );
}

export function formatOrcamentoServiceMeta(service: ChdServiceEntry): string {
  const chunks: string[] = [];

  if (service.hourType) {
    chunks.push(`Hora ${labelHourType(service.hourType)}`);
  }

  if (service.manHours.trim()) {
    chunks.push(`${service.manHours.trim()} h`);
  }

  if (service.hourlyRate?.trim()) {
    chunks.push(`${formatCurrency(parseNumericInput(service.hourlyRate))}/h`);
  }

  return chunks.join(" · ");
}

export function formatManualServiceMeta(service: ChdServiceEntry): string {
  const chunks: string[] = [];

  if (service.technician.trim()) {
    chunks.push(service.technician.trim());
  }

  if (service.manHours.trim()) {
    chunks.push(`${service.manHours.trim()} H/H`);
  }

  if (service.initialDiagnosis.trim()) {
    chunks.push(service.initialDiagnosis.trim());
  }

  return chunks.filter(Boolean).join(" · ") || "—";
}

export function formatServiceListMeta(service: ChdServiceEntry): string {
  if (service.fromOrcamento) {
    return formatOrcamentoServiceMeta(service);
  }

  return formatManualServiceMeta(service);
}

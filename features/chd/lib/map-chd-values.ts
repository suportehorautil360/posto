import type { ChdFuelLevel, ChdOldPartDestination } from "../types/form";

const fuelLabels: Record<ChdFuelLevel, string> = {
  reserva: "Reserva",
  "1/4": "1/4",
  "1/2": "1/2",
  "3/4": "3/4",
  cheio: "Cheio",
};

const oldPartDestinationLabels: Record<
  Exclude<ChdOldPartDestination, "">,
  string
> = {
  "descarte-ecologico": "Descarte ecológico",
  "devolvida-cliente": "Devolvida ao cliente",
};

export function mapChdFuelToApi(value: ChdFuelLevel | "") {
  if (!value) return "";

  return fuelLabels[value];
}

export function mapChdOldPartDestinationToApi(value: ChdOldPartDestination) {
  if (!value) return "";

  return oldPartDestinationLabels[value];
}

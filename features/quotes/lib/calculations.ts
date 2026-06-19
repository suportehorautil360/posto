export function parseNumericInput(value: string): number {
  const normalized = value.replace(/\./g, "").replace(",", ".").trim();
  const parsed = Number.parseFloat(normalized);

  if (Number.isNaN(parsed)) return 0;

  return parsed;
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function calculatePartTotal(quantity: string, unitValue: string) {
  return parseNumericInput(quantity) * parseNumericInput(unitValue);
}

export function calculateServiceTotal(hours: string, hourlyRate: string) {
  return parseNumericInput(hours) * parseNumericInput(hourlyRate);
}

export function calculateTravelTotal(
  km: string,
  valuePerKm: string,
  travelHours: string,
  hourlyRate: string,
  fees: string
) {
  return (
    parseNumericInput(km) * parseNumericInput(valuePerKm) +
    parseNumericInput(travelHours) * parseNumericInput(hourlyRate) +
    parseNumericInput(fees)
  );
}

export function calculateGrandTotal(form: {
  parts: { quantity: string; unitValue: string }[];
  services: { hours: string; hourlyRate: string }[];
  travel: {
    km: string;
    valuePerKm: string;
    travelHours: string;
    hourlyRate: string;
    fees: string;
  };
}) {
  const partsSubtotal = form.parts.reduce(
    (total, part) => total + calculatePartTotal(part.quantity, part.unitValue),
    0
  );

  const servicesSubtotal = form.services.reduce(
    (total, service) =>
      total + calculateServiceTotal(service.hours, service.hourlyRate),
    0
  );

  const travelSubtotal = calculateTravelTotal(
    form.travel.km,
    form.travel.valuePerKm,
    form.travel.travelHours,
    form.travel.hourlyRate,
    form.travel.fees
  );

  return partsSubtotal + servicesSubtotal + travelSubtotal;
}

export function formatNumberForInput(value: number): string {
  if (!Number.isFinite(value)) return "0";

  return Number.isInteger(value) ? String(value) : value.toFixed(2).replace(".", ",");
}

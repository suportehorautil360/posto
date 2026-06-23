export function formatChecklistDateTime(value?: string) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export function formatChecklistEntryDate(value?: string) {
  if (!value) return "—";

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("pt-BR");
}

export function getInspectionStatusLabel(status: string) {
  switch (status) {
    case "ok":
      return "OK";
    case "anomaly":
    case "anomalia":
      return "Anomalia";
    case "na":
      return "NA";
    default:
      return "—";
  }
}

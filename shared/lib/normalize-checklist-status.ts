export type NormalizedChecklistStatus = "ok" | "anomaly" | "na" | "";

export function normalizeChecklistStatus(
  status?: string
): NormalizedChecklistStatus {
  if (!status) {
    return "";
  }

  if (status === "ok") {
    return "ok";
  }

  if (status === "anomaly" || status === "anomalia") {
    return "anomaly";
  }

  if (status === "na") {
    return "na";
  }

  return "";
}

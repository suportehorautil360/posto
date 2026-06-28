import type { ChecklistPrintPrefill } from "@/shared/config/checklist-print";
import type { ChecklistChegada } from "../types/checklist-chegada-api";

export function mapCheChecklistToPrintPrefill(
  checklist: ChecklistChegada
): ChecklistPrintPrefill {
  return {
    os: checklist.identification.os,
    client: checklist.identification.client,
    brandModel: checklist.identification.brandModel,
    platePrefix: checklist.identification.platePrefix,
    km: checklist.identification.km,
    hourMeter: checklist.identification.hourMeter,
  };
}

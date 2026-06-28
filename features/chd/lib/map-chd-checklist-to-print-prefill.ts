import type { ChecklistPrintPrefill } from "@/shared/config/checklist-print";
import type { ChecklistDevolucao } from "../types/checklist-devolucao-api";

export function mapChdChecklistToPrintPrefill(
  checklist: ChecklistDevolucao
): ChecklistPrintPrefill {
  return {
    os: checklist.identification.os,
    brandModel: checklist.identification.brandModel,
    platePrefix: checklist.identification.platePrefix,
    km: checklist.identification.currentKm,
    hourMeter: checklist.identification.hourMeter,
    driver: checklist.identification.driver,
    technicalResponsible: checklist.identification.technicalResponsible,
  };
}

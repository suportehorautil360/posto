import type { FieldPath } from "react-hook-form";
import type { CheTabId } from "../types/checklist";
import type { CheFormValues } from "./che-form-schema";

export const cheTabFieldGroups: Record<CheTabId, FieldPath<CheFormValues>[]> = {
  identificacao: ["identification"],
  fotos: ["photos"],
  inspecao: ["inspection"],
  blocos: ["blocks"],
  termo: ["term"],
};

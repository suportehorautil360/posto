import type { PartDraftErrors } from "../lib/parts-form";
import type { ChdPartEntry } from "./form";

export type ChdIdentificationFieldErrors = Partial<
  Record<"date" | "brandModel" | "driver" | "technicalResponsible", string>
>;

export type ChdGeneralStateItemErrors = {
  status?: string;
  photo?: string;
};

export type ChdGeneralStateFieldErrors = Record<
  string,
  ChdGeneralStateItemErrors
>;

export type ChdPartFieldErrors = PartDraftErrors;

export type ChdPartsFieldErrors = {
  draft?: PartDraftErrors;
  items?: Record<string, PartDraftErrors>;
};

export type ChdFieldErrors = {
  identification?: ChdIdentificationFieldErrors;
  generalState?: ChdGeneralStateFieldErrors;
  parts?: ChdPartsFieldErrors;
};

export type ChdPartDraft = Omit<ChdPartEntry, "id">;

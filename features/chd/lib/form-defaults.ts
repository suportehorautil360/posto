import { generalStateSectionConfig } from "../config/general-state";
import { modulesSectionConfig } from "../config/modules";
import { servicesSectionConfig } from "../config/services";
import type {
  ChdChecklistItemState,
  ChdGeneralStateForm,
  ChdModuleItemState,
  ChdModulesForm,
  ChdPartEntry,
  ChdPartsForm,
  ChdServiceEntry,
  ChdServicesForm,
} from "../types/form";

export function getChdAutoNumber() {
  return "CHD-2026-0001";
}

export function getInitialIdentificationForm() {
  return {
    date: "",
    time: "",
    brandModel: "",
    platePrefix: "",
    currentKm: "",
    hourMeter: "",
    driver: "",
    technicalResponsible: "",
    fuel: "" as const,
  };
}

function createEmptyChecklistItem(): ChdChecklistItemState {
  return { status: "", photo: null };
}

export function getInitialGeneralStateForm(): ChdGeneralStateForm {
  const form: ChdGeneralStateForm = {};

  for (const section of generalStateSectionConfig.sections) {
    for (const item of section.items) {
      form[item.id] = createEmptyChecklistItem();
    }
  }

  return form;
}

function createEmptyModuleItem(): ChdModuleItemState {
  return { status: "" };
}

export function getInitialModulesForm(): ChdModulesForm {
  const form: ChdModulesForm = {};

  for (const section of modulesSectionConfig.sections) {
    for (const item of section.items) {
      form[item.id] = createEmptyModuleItem();
    }
  }

  return form;
}

export function createEmptyPartDraft(): Omit<ChdPartEntry, "id"> {
  return {
    description: "",
    partNumber: "",
    brand: "",
    oldPartDestination: "",
    newPhoto: null,
    replacedPhoto: null,
  };
}

export function createEmptyPartEntry(): ChdPartEntry {
  return {
    id: crypto.randomUUID(),
    ...createEmptyPartDraft(),
  };
}

export function getInitialPartsForm(): ChdPartsForm {
  return { items: [createEmptyPartEntry()] };
}

export function createEmptyServiceDraft(): Omit<ChdServiceEntry, "id"> {
  return {
    systemComponent: "",
    initialDiagnosis: "",
    technicalAction: "",
    technician: "",
    manHours: servicesSectionConfig.defaults.manHours,
  };
}

export function getInitialServicesForm(): ChdServicesForm {
  return { items: [] };
}

export function getInitialClosingForm() {
  return {
    inventoryChecked: false,
    driverSignature: "",
    workshopSignature: "",
  };
}

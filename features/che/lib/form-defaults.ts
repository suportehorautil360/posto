import { blocksSectionConfig } from "../config/blocks";
import { inspectionSectionConfig } from "../config/inspection";
import type {
  BlockItemState,
  CheBlocksForm,
  CheInspectionForm,
  InspectionItemState,
} from "../types/checklist";

export function getCheAutoNumber() {
  return "CHE-2026-0001";
}

export function getInitialPhotosForm() {
  return {
    frontal: null,
    lateralDireita: null,
    traseira: null,
    lateralEsquerda: null,
  };
}

export function getInitialIdentificationForm() {
  return {
    os: "",
    entryDate: "",
    time: "",
    responsible: "",
    client: "",
    brandModel: "",
    platePrefix: "",
    km: "",
    hourMeter: "",
    fuel: "" as const,
  };
}

function createEmptyInspectionItem(): InspectionItemState {
  return { status: "", photo: null };
}

function createEmptyBlockItem(): BlockItemState {
  return { status: "" };
}

export function getInitialInspectionForm(): CheInspectionForm {
  const form: CheInspectionForm = {};

  for (const section of inspectionSectionConfig.sections) {
    for (const item of section.items) {
      form[item.id] = createEmptyInspectionItem();
    }
  }

  return form;
}

export function getInitialBlocksForm(): CheBlocksForm {
  const form: CheBlocksForm = {};

  for (const section of blocksSectionConfig.sections) {
    for (const item of section.items) {
      form[item.id] = createEmptyBlockItem();
    }
  }

  return form;
}

export function getInitialTermForm() {
  return {
    symptoms: "",
    clientSignature: "",
    workshopSignature: "",
  };
}

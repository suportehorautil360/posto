import type { CheFormState } from "../types/checklist";
import { getCheAutoNumber } from "./form-defaults";

export type SaveCheResult = {
  number: string;
};

function appendJsonField(formData: FormData, key: string, value: unknown) {
  formData.append(key, JSON.stringify(value));
}

function appendFileField(formData: FormData, key: string, file: File | null) {
  if (file) {
    formData.append(key, file);
  }
}

export function buildCheFormData(form: CheFormState): FormData {
  const formData = new FormData();

  formData.append("number", getCheAutoNumber());
  appendJsonField(formData, "identification", form.identification);
  appendJsonField(formData, "inspection", serializeInspection(form.inspection));
  appendJsonField(formData, "blocks", form.blocks);
  appendJsonField(formData, "term", form.term);

  for (const [slot, file] of Object.entries(form.photos)) {
    appendFileField(formData, `photos[${slot}]`, file);
  }

  for (const [itemId, item] of Object.entries(form.inspection)) {
    appendFileField(formData, `inspection[${itemId}][photo]`, item.photo);
  }

  return formData;
}

function serializeInspection(
  inspection: CheFormState["inspection"]
): Record<string, { status: string }> {
  return Object.fromEntries(
    Object.entries(inspection).map(([id, item]) => [id, { status: item.status }])
  );
}

export async function saveCheChecklist(form: CheFormState): Promise<SaveCheResult> {
  const payload = buildCheFormData(form);

  // Simula POST /checklists até a integração com a API.
  await new Promise((resolve) => setTimeout(resolve, 700));
  void payload;

  return { number: getCheAutoNumber() };
}

import type { ChdFormState } from "../types/form";
import { getChdAutoNumber } from "./form-defaults";

export type SaveChdResult = {
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

function serializeChecklistItems<T extends { status: string }>(
  items: Record<string, T>
): Record<string, { status: string }> {
  return Object.fromEntries(
    Object.entries(items).map(([id, item]) => [id, { status: item.status }])
  );
}

function serializeParts(parts: ChdFormState["parts"]) {
  return parts.items.map(({ id, description, partNumber, brand, oldPartDestination }) => ({
    id,
    description,
    partNumber,
    brand,
    oldPartDestination,
  }));
}

export function buildChdFormData(form: ChdFormState): FormData {
  const formData = new FormData();

  formData.append("number", getChdAutoNumber());
  appendJsonField(formData, "identification", form.identification);
  appendJsonField(
    formData,
    "generalState",
    serializeChecklistItems(form.generalState)
  );
  appendJsonField(formData, "modules", form.modules);
  appendJsonField(formData, "parts", serializeParts(form.parts));
  appendJsonField(formData, "services", form.services);
  appendJsonField(formData, "closing", form.closing);

  for (const [itemId, item] of Object.entries(form.generalState)) {
    appendFileField(formData, `generalState[${itemId}][photo]`, item.photo);
  }

  for (const [index, part] of form.parts.items.entries()) {
    appendFileField(formData, `parts[${index}][newPhoto]`, part.newPhoto);
    appendFileField(formData, `parts[${index}][replacedPhoto]`, part.replacedPhoto);
  }

  return formData;
}

export async function saveChdChecklist(form: ChdFormState): Promise<SaveChdResult> {
  const payload = buildChdFormData(form);

  // Simula POST /chd até a integração com a API.
  await new Promise((resolve) => setTimeout(resolve, 700));
  void payload;

  return { number: getChdAutoNumber() };
}

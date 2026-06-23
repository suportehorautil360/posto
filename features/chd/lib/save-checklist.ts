import { patchChecklistDevolucaoFotos } from "../api/patch-checklist-devolucao-fotos";
import { postChecklistDevolucao } from "../api/post-checklist-devolucao";
import type { ChecklistDevolucao } from "../types/checklist-devolucao-api";
import type { ChdFormState } from "../types/form";
import {
  mapChdFormToFotosPayload,
  mapChdFormToPayload,
} from "./map-chd-form-to-payload";
import { uploadChdPhotos } from "./upload-chd-photos";
import { validatePartsForSave } from "./parts-form";

export type SaveChdOptions = {
  solicitacaoOsId?: string;
  ordemServicoId?: string;
  protocolo?: string;
};

export type SaveChdResult = Pick<
  ChecklistDevolucao,
  "id" | "number" | "createdAt"
>;

export async function saveChdChecklist(
  form: ChdFormState,
  options?: SaveChdOptions
): Promise<SaveChdResult> {
  const partsError = validatePartsForSave(form.parts);

  if (partsError) {
    throw new Error(partsError);
  }

  const checklistId = crypto.randomUUID();
  const uploadedPhotos = await uploadChdPhotos(form, checklistId);
  const payload = mapChdFormToPayload(form, uploadedPhotos, {
    id: checklistId,
    ...options,
  });

  const saved = await postChecklistDevolucao(payload);

  const hasPhotoUrls =
    Object.keys(uploadedPhotos.generalState).length > 0 ||
    Object.keys(uploadedPhotos.parts).length > 0;

  if (hasPhotoUrls) {
    const merged = await patchChecklistDevolucaoFotos(
      checklistId,
      mapChdFormToFotosPayload(form, uploadedPhotos)
    );

    return {
      id: merged.id,
      number: merged.number,
      createdAt: merged.createdAt,
    };
  }

  return {
    id: saved.id,
    number: saved.number,
    createdAt: saved.createdAt,
  };
}

import { patchChecklistChegadaFotos } from "../api/patch-checklist-chegada-fotos";
import { postChecklistChegada } from "../api/post-checklist-chegada";
import type { ChecklistChegada } from "../types/checklist-chegada-api";
import type { CheFormState } from "../types/checklist";
import {
  mapCheFormToCreatePayload,
  mapCheFormToFotosPayload,
} from "./map-che-form-to-payload";
import { uploadChePhotos } from "./upload-che-photos";

export type SaveCheOptions = {
  solicitacaoOsId?: string;
};

export type SaveCheResult = Pick<
  ChecklistChegada,
  "id" | "number" | "createdAt"
>;

export async function saveCheChecklist(
  form: CheFormState,
  options?: SaveCheOptions
): Promise<SaveCheResult> {
  const created = await postChecklistChegada(
    mapCheFormToCreatePayload(form, options)
  );
  const uploadedPhotos = await uploadChePhotos(form, created.id);
  const saved = await patchChecklistChegadaFotos(
    created.id,
    mapCheFormToFotosPayload(form, uploadedPhotos)
  );

  return {
    id: saved.id,
    number: saved.number,
    createdAt: saved.createdAt,
  };
}

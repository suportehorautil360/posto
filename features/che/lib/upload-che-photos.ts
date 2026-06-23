import { uploadChecklistFoto } from "../api/post-checklist-foto-upload";
import type { CheFormState, ChePhotoSlot } from "../types/checklist";

export async function uploadChePhotos(
  form: CheFormState,
  checklistId: string
) {
  const photoEntries = await Promise.all(
    (Object.entries(form.photos) as [ChePhotoSlot, File | null][]).map(
      async ([slot, file]) => {
        if (!(file instanceof File)) {
          throw new Error(`Foto obrigatória ausente: ${slot}.`);
        }

        const url = await uploadChecklistFoto(file, {
          checklistId,
          nome: slot,
        });
        return [slot, url] as const;
      }
    )
  );

  const inspectionPhotoEntries = await Promise.all(
    Object.entries(form.inspection)
      .filter(
        ([, item]) => item.status === "anomaly" && item.photo instanceof File
      )
      .map(async ([itemId, item]) => {
        const url = await uploadChecklistFoto(item.photo as File, {
          checklistId,
          nome: itemId,
        });
        return [itemId, url] as const;
      })
  );

  return {
    photos: Object.fromEntries(photoEntries) as Record<ChePhotoSlot, string>,
    inspectionPhotos: Object.fromEntries(inspectionPhotoEntries),
  };
}

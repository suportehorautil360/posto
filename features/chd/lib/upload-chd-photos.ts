import { uploadChecklistFoto } from "@/shared/lib/upload-checklist-foto";
import type { ChdFormState } from "../types/form";

function shouldUploadPart(item: ChdFormState["parts"]["items"][number]) {
  return (
    item.description.trim() ||
    item.partNumber.trim() ||
    item.brand.trim() ||
    item.oldPartDestination ||
    item.newPhoto ||
    item.replacedPhoto
  );
}

export async function uploadChdPhotos(form: ChdFormState, checklistId: string) {
  const generalStateEntries = await Promise.all(
    Object.entries(form.generalState)
      .filter(
        ([, item]) => item.status === "anomaly" && item.photo instanceof File
      )
      .map(async ([itemId, item]) => {
        const url = await uploadChecklistFoto(item.photo as File, {
          checklistId,
          nome: `generalState-${itemId}`,
        });

        return [itemId, url] as const;
      })
  );

  const partsUploads: Record<
    number,
    { newPhoto?: string; replacedPhoto?: string }
  > = {};

  await Promise.all(
    form.parts.items.flatMap((item, index) => {
      if (!shouldUploadPart(item)) {
        return [];
      }

      const uploads: Promise<void>[] = [];

      if (item.newPhoto instanceof File) {
        uploads.push(
          uploadChecklistFoto(item.newPhoto, {
            checklistId,
            nome: `part-${index}-new`,
          }).then((url) => {
            partsUploads[index] = {
              ...partsUploads[index],
              newPhoto: url,
            };
          })
        );
      }

      if (item.replacedPhoto instanceof File) {
        uploads.push(
          uploadChecklistFoto(item.replacedPhoto, {
            checklistId,
            nome: `part-${index}-replaced`,
          }).then((url) => {
            partsUploads[index] = {
              ...partsUploads[index],
              replacedPhoto: url,
            };
          })
        );
      }

      return uploads;
    })
  );

  return {
    generalState: Object.fromEntries(generalStateEntries),
    parts: partsUploads,
  };
}

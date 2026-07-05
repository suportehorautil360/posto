import { getOficinaContextPayload } from "@/shared/lib/oficina-context";
import type {
  PatchChecklistChegadaFotosPayload,
  PostChecklistChegadaPayload,
} from "../types/checklist-chegada-api";
import type { CheFormState, ChePhotoSlot } from "../types/checklist";

type UploadedChePhotos = {
  photos: Record<ChePhotoSlot, string>;
  inspectionPhotos: Record<string, string>;
  blockPhotos: Record<string, string>;
};

type MapCheCreatePayloadOptions = {
  solicitacaoOsId?: string;
};

function mapInspectionStatus(form: CheFormState) {
  return Object.fromEntries(
    Object.entries(form.inspection).map(([itemId, item]) => [
      itemId,
      { status: item.status },
    ])
  );
}

function mapBlocks(form: CheFormState) {
  return Object.fromEntries(
    Object.entries(form.blocks).flatMap(([itemId, item]) => {
      if (!item.status) {
        return [];
      }

      const entry: {
        status: string;
        description?: string;
      } = { status: item.status };

      if (item.status === "anomaly") {
        const description = item.description.trim();
        if (description) {
          entry.description = description;
        }
      }

      return [[itemId, entry] as const];
    })
  );
}

export function mapCheFormToCreatePayload(
  form: CheFormState,
  options?: MapCheCreatePayloadOptions
): PostChecklistChegadaPayload {
  const context = getOficinaContextPayload();

  return {
    ...context,
    ...(options?.solicitacaoOsId
      ? { solicitacaoOsId: options.solicitacaoOsId }
      : {}),
    identification: form.identification,
    photos: {},
    inspection: mapInspectionStatus(form),
    blocks: mapBlocks(form),
    term: form.term,
  };
}

export function mapCheFormToFotosPayload(
  form: CheFormState,
  uploadedPhotos: UploadedChePhotos
): PatchChecklistChegadaFotosPayload {
  const inspection = Object.fromEntries(
    Object.entries(form.inspection).flatMap(([itemId, item]) => {
      if (item.status !== "anomaly") {
        return [];
      }

      const photo = uploadedPhotos.inspectionPhotos[itemId];

      if (!photo) {
        return [];
      }

      return [[itemId, {
        status: item.status,
        photo,
        description: item.description.trim(),
      }] as const];
    })
  );

  const blocks = Object.fromEntries(
    Object.entries(form.blocks).flatMap(([itemId, item]) => {
      if (item.status !== "anomaly") {
        return [];
      }

      const photo = uploadedPhotos.blockPhotos[itemId];

      if (!photo) {
        return [];
      }

      return [[itemId, {
        status: item.status,
        photo,
        description: item.description.trim(),
      }] as const];
    })
  );

  return {
    photos: uploadedPhotos.photos,
    inspection,
    ...(Object.keys(blocks).length > 0 ? { blocks } : {}),
  };
}

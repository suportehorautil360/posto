import { getOficinaContextPayload } from "@/shared/lib/oficina-context";
import type {
  PatchChecklistDevolucaoFotosPayload,
  PostChecklistDevolucaoPayload,
} from "../types/checklist-devolucao-api";
import type { ChdFormState, ChdPartEntry, ChdServiceEntry } from "../types/form";
import {
  mapChdFuelToApi,
  mapChdOldPartDestinationToApi,
} from "./map-chd-values";

type UploadedChdPhotos = {
  generalState: Record<string, string>;
  parts: Record<
    number,
    {
      newPhoto?: string;
      replacedPhoto?: string;
    }
  >;
};

type MapChdPayloadOptions = {
  id: string;
  solicitacaoOsId?: string;
  ordemServicoId?: string;
  protocolo?: string;
};

function hasFilledStatus(status: string) {
  return status === "ok" || status === "anomaly" || status === "na";
}

function mapGeneralState(
  form: ChdFormState,
  uploadedPhotos: UploadedChdPhotos
): PostChecklistDevolucaoPayload["generalState"] {
  return Object.fromEntries(
    Object.entries(form.generalState).flatMap(([itemId, item]) => {
      if (!hasFilledStatus(item.status)) {
        return [];
      }

      const entry: PostChecklistDevolucaoPayload["generalState"][string] = {
        status: item.status,
      };

      if (item.status === "anomaly" && uploadedPhotos.generalState[itemId]) {
        entry.photo = uploadedPhotos.generalState[itemId];
      }

      return [[itemId, entry] as const];
    })
  );
}

function mapModules(form: ChdFormState) {
  return Object.fromEntries(
    Object.entries(form.modules).flatMap(([itemId, item]) => {
      if (!hasFilledStatus(item.status)) {
        return [];
      }

      return [[itemId, { status: item.status }] as const];
    })
  );
}

function shouldIncludePart(item: ChdPartEntry) {
  return (
    item.description.trim() ||
    item.partNumber.trim() ||
    item.brand.trim() ||
    item.oldPartDestination ||
    item.newPhoto ||
    item.replacedPhoto
  );
}

function shouldIncludeService(item: ChdServiceEntry) {
  return (
    item.systemComponent.trim() ||
    item.initialDiagnosis.trim() ||
    item.technicalAction.trim() ||
    item.technician.trim() ||
    item.manHours.trim()
  );
}

function mapParts(
  form: ChdFormState,
  uploadedPhotos: UploadedChdPhotos
): PostChecklistDevolucaoPayload["parts"] {
  const items = form.parts.items
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => shouldIncludePart(item))
    .map(({ item, index }) => {
      const uploadedPart = uploadedPhotos.parts[index];

      return {
        description: item.description.trim(),
        partNumber: item.partNumber.trim(),
        brand: item.brand.trim(),
        oldPartDestination: mapChdOldPartDestinationToApi(item.oldPartDestination),
        newPhoto: uploadedPart?.newPhoto ?? "",
        replacedPhoto: uploadedPart?.replacedPhoto ?? "",
      };
    });

  return { items };
}

function mapServices(form: ChdFormState): PostChecklistDevolucaoPayload["services"] {
  const items = form.services.items.filter(shouldIncludeService).map((item) => ({
    systemComponent: item.systemComponent.trim(),
    initialDiagnosis: item.initialDiagnosis.trim(),
    technicalAction: item.technicalAction.trim(),
    technician: item.technician.trim(),
    manHours: item.manHours.trim(),
  }));

  return { items };
}

export function mapChdFormToPayload(
  form: ChdFormState,
  uploadedPhotos: UploadedChdPhotos,
  options: MapChdPayloadOptions
): PostChecklistDevolucaoPayload {
  const context = getOficinaContextPayload();
  const { os, fuel, ...identificationRest } = form.identification;
  const osProtocol = options.protocolo?.trim() || os.trim() || undefined;

  return {
    id: options.id,
    ...context,
    ...(options.solicitacaoOsId
      ? { solicitacaoOsId: options.solicitacaoOsId }
      : {}),
    ...(options.ordemServicoId ? { ordemServicoId: options.ordemServicoId } : {}),
    ...(osProtocol ? { protocolo: osProtocol } : {}),
    identification: {
      ...identificationRest,
      fuel: mapChdFuelToApi(fuel),
      ...(osProtocol ? { os: osProtocol } : {}),
    },
    generalState: mapGeneralState(form, uploadedPhotos),
    modules: mapModules(form),
    parts: mapParts(form, uploadedPhotos),
    services: mapServices(form),
    closing: form.closing,
  };
}

export function mapChdFormToFotosPayload(
  form: ChdFormState,
  uploadedPhotos: UploadedChdPhotos
): PatchChecklistDevolucaoFotosPayload {
  return {
    generalState: mapGeneralState(form, uploadedPhotos),
    parts: mapParts(form, uploadedPhotos),
  };
}

import { uploadChecklistFoto } from "@/shared/lib/upload-checklist-foto";
import {
  newQuotePageConfig,
  quotePhotosSectionConfig,
} from "../config/page";
import type { QuoteFormState } from "../types/quote";
import { quotePhotoSlotIds } from "../types/quote";

type UploadQuotePhotosContext = {
  oficinaId: string;
  os: string;
};

function getPhotoLabel(slot: (typeof quotePhotoSlotIds)[number]) {
  return (
    quotePhotosSectionConfig.fields.find((field) => field.id === slot)?.label ??
    slot
  );
}

export function validateQuotePhotos(form: QuoteFormState) {
  for (const slot of quotePhotoSlotIds) {
    const file = form.photos[slot];
    const url = form.photoUrls?.[slot];

    if (!file && !url) {
      throw new Error(
        newQuotePageConfig.messages.photoRequired(getPhotoLabel(slot))
      );
    }
  }
}

export async function resolveQuotePhotoUrls(
  form: QuoteFormState,
  { oficinaId, os }: UploadQuotePhotosContext
): Promise<string[]> {
  validateQuotePhotos(form);

  const urls: string[] = [];

  for (const slot of quotePhotoSlotIds) {
    const file = form.photos[slot];

    if (file instanceof File) {
      const url = await uploadChecklistFoto(file, {
        oficinaId,
        os,
        nome: slot,
      });
      urls.push(url);
      continue;
    }

    const existingUrl = form.photoUrls?.[slot];

    if (existingUrl) {
      urls.push(existingUrl);
      continue;
    }

    throw new Error(
      newQuotePageConfig.messages.photoRequired(getPhotoLabel(slot))
    );
  }

  return urls;
}

import { z } from "zod";
import { blocksSectionConfig } from "../config/blocks";
import { fuelLevelOptions } from "../config/page";
import { inspectionSectionConfig } from "../config/inspection";
import { cheValidationMessages } from "../config/validation";

const fuelLevelSchema = z.enum(fuelLevelOptions);

const requiredFileSchema = z.custom<File>(
  (value) => value instanceof File,
  { message: cheValidationMessages.requiredPhoto }
);

const inspectionStatusSchema = z.enum(["ok", "anomaly", "na"], {
  message: cheValidationMessages.requiredInspectionStatus,
});

function buildInspectionItemSchema(requireAnomalyPhoto: boolean) {
  return z
    .object({
      status: z.union([inspectionStatusSchema, z.literal("")]),
      photo: z.custom<File | null>().nullable(),
    })
    .superRefine((value, context) => {
      if (!value.status) {
        context.addIssue({
          code: "custom",
          message: cheValidationMessages.requiredInspectionStatus,
          path: ["status"],
        });
      }

      if (
        requireAnomalyPhoto &&
        value.status === "anomaly" &&
        !(value.photo instanceof File)
      ) {
        context.addIssue({
          code: "custom",
          message: cheValidationMessages.requiredAnomalyPhoto,
          path: ["photo"],
        });
      }
    });
}

function buildInspectionShape(requireAnomalyPhoto: boolean) {
  const shape: Record<string, ReturnType<typeof buildInspectionItemSchema>> =
    {};

  for (const section of inspectionSectionConfig.sections) {
    for (const item of section.items) {
      shape[item.id] = buildInspectionItemSchema(requireAnomalyPhoto);
    }
  }

  return shape;
}

function buildBlocksShape() {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const section of blocksSectionConfig.sections) {
    for (const item of section.items) {
      shape[item.id] = z.object({
        status: z.union([inspectionStatusSchema, z.literal("")]),
      });
    }
  }

  return shape;
}

function isBlockSectionComplete(
  blocks: Record<string, { status: string }>,
  section: (typeof blocksSectionConfig.sections)[number]
): boolean {
  return section.items.every((item) => {
    const status = blocks[item.id]?.status;

    return status === "ok" || status === "anomaly" || status === "na";
  });
}

function hasCompleteBlockSection(
  blocks: Record<string, { status: string }>
): boolean {
  return blocksSectionConfig.sections.some((section) =>
    isBlockSectionComplete(blocks, section)
  );
}

export const cheIdentificationSchema = z.object({
  os: z.string(),
  entryDate: z.string().min(1, cheValidationMessages.required),
  time: z.string(),
  responsible: z.string().trim().min(1, cheValidationMessages.required),
  client: z.string().trim().min(1, cheValidationMessages.required),
  brandModel: z.string().trim().min(1, cheValidationMessages.required),
  platePrefix: z.string(),
  km: z.string(),
  hourMeter: z.string(),
  fuel: z.union([fuelLevelSchema, z.literal("")]),
});

export const chePhotosSchema = z.object({
  frontal: requiredFileSchema,
  lateralDireita: requiredFileSchema,
  traseira: requiredFileSchema,
  lateralEsquerda: requiredFileSchema,
});

export const cheInspectionSchema = z.object(buildInspectionShape(true));
export const cheBlocksSchema = z
  .object(buildBlocksShape())
  .superRefine((blocks, context) => {
    const filledBlocks = blocks as Record<string, { status: string }>;

    if (!hasCompleteBlockSection(filledBlocks)) {
      context.addIssue({
        code: "custom",
        message: cheValidationMessages.requiredAtLeastOneBlock,
      });
    }
  });

export const cheTermSchema = z.object({
  symptoms: z.string(),
  clientSignature: z.string(),
  workshopSignature: z.string(),
});

export const cheFormSchema = z.object({
  identification: cheIdentificationSchema,
  photos: chePhotosSchema,
  inspection: cheInspectionSchema,
  blocks: cheBlocksSchema,
  term: cheTermSchema,
});

import type { CheFormState } from "../types/checklist";

export type CheFormValues = CheFormState;

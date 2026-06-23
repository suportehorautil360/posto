import { blocksSectionConfig } from "../config/blocks";
import { inspectionSectionConfig } from "../config/inspection";
import { photosSectionConfig } from "../config/page";

export function getPhotoSlotLabel(slot: string) {
  return (
    photosSectionConfig.fields.find((field) => field.id === slot)?.label ?? slot
  );
}

export function getInspectionItemLabel(itemId: string) {
  for (const section of inspectionSectionConfig.sections) {
    const item = section.items.find((entry) => entry.id === itemId);

    if (item) {
      return item.label;
    }
  }

  return itemId;
}

export function getBlockItemLabel(itemId: string) {
  for (const section of blocksSectionConfig.sections) {
    const item = section.items.find((entry) => entry.id === itemId);

    if (item) {
      return item.label;
    }
  }

  return itemId;
}

export function getBlockSectionTitle(sectionId: string) {
  return (
    blocksSectionConfig.sections.find((section) => section.id === sectionId)
      ?.title ?? sectionId
  );
}

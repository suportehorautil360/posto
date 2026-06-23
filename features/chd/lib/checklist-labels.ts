import { generalStateSectionConfig } from "../config/general-state";
import { modulesSectionConfig } from "../config/modules";

export function getGeneralStateItemLabel(itemId: string) {
  for (const section of generalStateSectionConfig.sections) {
    const item = section.items.find((entry) => entry.id === itemId);

    if (item) {
      return item.label;
    }
  }

  return itemId;
}

export function getModuleItemLabel(itemId: string) {
  for (const section of modulesSectionConfig.sections) {
    const item = section.items.find((entry) => entry.id === itemId);

    if (item) {
      return item.label;
    }
  }

  return itemId;
}

export function getModuleSectionTitle(sectionId: string) {
  return (
    modulesSectionConfig.sections.find((section) => section.id === sectionId)
      ?.title ?? sectionId
  );
}

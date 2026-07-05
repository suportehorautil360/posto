import { checklistPrintConfig } from "@/shared/config/checklist-print";
import {
  ChecklistPrintShell,
  PrintField,
  PrintFieldGrid,
  PrintPhotoGrid,
  PrintSection,
  PrintSignatureRow,
  PrintStatusTableFilled,
  PrintTextArea,
} from "@/shared/components/checklist-print/checklist-print-primitives";
import { blocksSectionConfig } from "../config/blocks";
import { chePageConfig } from "../config/page";
import { identificationSectionConfig, photosSectionConfig } from "../config/page";
import { inspectionSectionConfig } from "../config/inspection";
import { termSectionConfig } from "../config/term";
import {
  formatChecklistDateTime,
  formatChecklistEntryDate,
} from "../lib/format-checklist-meta";
import type { ChecklistChegada } from "../types/checklist-chegada-api";
import type { ChePhotoSlot } from "../types/checklist";

type CheFilledPrintFormProps = {
  checklist: ChecklistChegada;
  autoPrint?: boolean;
  autoDownloadPdf?: boolean;
};

export function CheFilledPrintForm({
  checklist,
  autoPrint = false,
  autoDownloadPdf = false,
}: CheFilledPrintFormProps) {
  const photoFields = photosSectionConfig.fields;
  const photoLabels = photoFields.map((field) => field.label);
  const photoUrls = photoFields.map(
    (field) => checklist.photos[field.id as ChePhotoSlot]
  );
  let sectionNumber = 1;

  return (
    <ChecklistPrintShell
      title={chePageConfig.title}
      subtitle={`Checklist ${checklist.number} — respostas registradas`}
      documentType="CHE"
      osNumber={checklist.identification.os}
      checklistNumber={checklist.number}
      registeredAt={formatChecklistDateTime(checklist.createdAt)}
      footerNote={checklistPrintConfig.filledFooterNote}
      autoPrint={autoPrint}
      autoDownloadPdf={autoDownloadPdf}
    >
      <PrintSection
        title={identificationSectionConfig.title}
        number={sectionNumber++}
      >
        <PrintFieldGrid>
          <PrintField
            label={identificationSectionConfig.fields.os}
            value={checklist.identification.os}
          />
          <PrintField
            label={identificationSectionConfig.fields.entryDate}
            value={formatChecklistEntryDate(checklist.identification.entryDate)}
          />
          <PrintField
            label={identificationSectionConfig.fields.time}
            value={checklist.identification.time}
          />
          <PrintField
            label={identificationSectionConfig.fields.responsible}
            value={checklist.identification.responsible}
          />
          <PrintField
            label={identificationSectionConfig.fields.client}
            value={checklist.identification.client}
          />
          <PrintField
            label={identificationSectionConfig.fields.brandModel}
            value={checklist.identification.brandModel}
          />
          <PrintField
            label={identificationSectionConfig.fields.platePrefix}
            value={checklist.identification.platePrefix}
          />
          <PrintField
            label={identificationSectionConfig.fields.km}
            value={checklist.identification.km}
          />
          <PrintField
            label={identificationSectionConfig.fields.hourMeter}
            value={checklist.identification.hourMeter}
          />
          <PrintField
            label={identificationSectionConfig.fields.fuel}
            value={checklist.identification.fuel}
          />
        </PrintFieldGrid>
      </PrintSection>

      <PrintSection title={photosSectionConfig.title} number={sectionNumber++}>
        <PrintPhotoGrid labels={photoLabels} photos={photoUrls} />
      </PrintSection>

      {inspectionSectionConfig.sections.map((section) => (
        <PrintSection
          key={section.id}
          title={section.title}
          number={sectionNumber++}
          hint={`${inspectionSectionConfig.hint} ${inspectionSectionConfig.hintHighlight} ${inspectionSectionConfig.hintSuffix}`}
        >
          <PrintStatusTableFilled
            items={section.items.map((item) => {
              const entry = checklist.inspection[item.id];

              return {
                id: item.id,
                label: item.label,
                status: entry?.status,
                notes: entry?.description,
                photoUrl: entry?.photo,
              };
            })}
          />
        </PrintSection>
      ))}

      {blocksSectionConfig.sections.map((section) => (
        <PrintSection key={section.id} title={section.title} number={sectionNumber++}>
          <PrintStatusTableFilled
            items={section.items.map((item) => {
              const entry = checklist.blocks[item.id];

              return {
                id: item.id,
                label: item.label,
                status: entry?.status,
                notes: entry?.description,
                photoUrl: entry?.photo,
              };
            })}
          />
        </PrintSection>
      ))}

      <PrintSection title={termSectionConfig.title} number={sectionNumber++}>
        <PrintTextArea
          label={termSectionConfig.fields.symptoms}
          value={checklist.term.symptoms}
          rows={5}
        />
        <div className="mt-6">
          {checklist.term.clientSignature?.trim() ||
          checklist.term.workshopSignature?.trim() ? (
            <PrintFieldGrid>
              <PrintField
                label={termSectionConfig.fields.clientSignature}
                value={checklist.term.clientSignature}
              />
              <PrintField
                label={termSectionConfig.fields.workshopSignature}
                value={checklist.term.workshopSignature}
              />
            </PrintFieldGrid>
          ) : (
            <PrintSignatureRow
              labels={[
                termSectionConfig.fields.clientSignature,
                termSectionConfig.fields.workshopSignature,
              ]}
            />
          )}
        </div>
      </PrintSection>
    </ChecklistPrintShell>
  );
}

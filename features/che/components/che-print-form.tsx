import type { ChecklistPrintPrefill } from "@/shared/config/checklist-print";
import {
  ChecklistPrintShell,
  PrintField,
  PrintFieldGrid,
  PrintPhotoGrid,
  PrintSection,
  PrintSignatureRow,
  PrintStatusTable,
  PrintTextArea,
} from "@/shared/components/checklist-print/checklist-print-primitives";
import { blocksSectionConfig } from "../config/blocks";
import { chePageConfig } from "../config/page";
import { identificationSectionConfig, photosSectionConfig } from "../config/page";
import { inspectionSectionConfig } from "../config/inspection";
import { termSectionConfig } from "../config/term";

type ChePrintFormProps = {
  prefill?: ChecklistPrintPrefill;
  autoPrint?: boolean;
  autoDownloadPdf?: boolean;
};

export function ChePrintForm({
  prefill,
  autoPrint = false,
  autoDownloadPdf = false,
}: ChePrintFormProps) {
  const photoLabels = photosSectionConfig.fields.map((field) => field.label);
  let sectionNumber = 1;

  return (
    <ChecklistPrintShell
      title={chePageConfig.title}
      subtitle="Formulário em branco para preenchimento manual"
      documentType="CHE"
      osNumber={prefill?.os}
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
            value={prefill?.os}
          />
          <PrintField label={identificationSectionConfig.fields.entryDate} />
          <PrintField label={identificationSectionConfig.fields.time} />
          <PrintField label={identificationSectionConfig.fields.responsible} />
          <PrintField
            label={identificationSectionConfig.fields.client}
            value={prefill?.client}
          />
          <PrintField
            label={identificationSectionConfig.fields.brandModel}
            value={prefill?.brandModel}
          />
          <PrintField
            label={identificationSectionConfig.fields.platePrefix}
            value={prefill?.platePrefix}
          />
          <PrintField
            label={identificationSectionConfig.fields.km}
            value={prefill?.km}
          />
          <PrintField
            label={identificationSectionConfig.fields.hourMeter}
            value={prefill?.hourMeter}
          />
          <PrintField label={identificationSectionConfig.fields.fuel} />
        </PrintFieldGrid>
      </PrintSection>

      <PrintSection title={photosSectionConfig.title} number={sectionNumber++}>
        <PrintPhotoGrid labels={photoLabels} />
      </PrintSection>

      {inspectionSectionConfig.sections.map((section) => (
        <PrintSection
          key={section.id}
          title={section.title}
          number={sectionNumber++}
          hint={`${inspectionSectionConfig.hint} ${inspectionSectionConfig.hintHighlight} ${inspectionSectionConfig.hintSuffix}`}
        >
          <PrintStatusTable items={section.items} />
        </PrintSection>
      ))}

      {blocksSectionConfig.sections.map((section) => (
        <PrintSection key={section.id} title={section.title} number={sectionNumber++}>
          <PrintStatusTable items={section.items} />
        </PrintSection>
      ))}

      <PrintSection title={termSectionConfig.title} number={sectionNumber++}>
        <PrintTextArea label={termSectionConfig.fields.symptoms} rows={5} />
        <div className="mt-6">
          <PrintSignatureRow
            labels={[
              termSectionConfig.fields.clientSignature,
              termSectionConfig.fields.workshopSignature,
            ]}
          />
        </div>
      </PrintSection>
    </ChecklistPrintShell>
  );
}

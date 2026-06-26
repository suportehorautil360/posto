import type { ChecklistPrintPrefill } from "@/shared/config/checklist-print";
import {
  ChecklistPrintShell,
  PrintCheckboxRow,
  PrintField,
  PrintFieldGrid,
  PrintSection,
  PrintSignatureRow,
  PrintStatusTable,
} from "@/shared/components/checklist-print/checklist-print-primitives";
import { checklistPrintConfig } from "@/shared/config/checklist-print";
import { closingSectionConfig } from "../config/closing";
import {
  chdFuelLevelOptions,
  chdPageConfig,
  identificationSectionConfig,
} from "../config/page";
import { generalStateSectionConfig } from "../config/general-state";
import { modulesSectionConfig } from "../config/modules";
import { partsSectionConfig } from "../config/parts";
import { servicesSectionConfig } from "../config/services";

type ChdPrintFormProps = {
  prefill?: ChecklistPrintPrefill;
  autoPrint?: boolean;
  autoDownloadPdf?: boolean;
};

function PrintBlankTable({
  headers,
  rowCount,
}: {
  headers: string[];
  rowCount: number;
}) {
  return (
    <table className="print-table w-full border-collapse text-[11px]">
      <thead>
        <tr className="bg-brand-navy text-white">
          {headers.map((header) => (
            <th
              key={header}
              className="border border-brand-navy px-2 py-2 text-left font-semibold"
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rowCount }).map((_, index) => (
          <tr
            key={index}
            className={index % 2 === 0 ? "bg-white" : "bg-zinc-50/80"}
          >
            {headers.map((header) => (
              <td key={`${index}-${header}`} className="border border-zinc-300 px-2 py-3 align-top">
                <div className="min-h-5 border-b border-dotted border-zinc-400" />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function ChdPrintForm({
  prefill,
  autoPrint = false,
  autoDownloadPdf = false,
}: ChdPrintFormProps) {
  const fuelOptions = chdFuelLevelOptions.map((option) => option.label).join(" · ");
  let sectionNumber = 1;

  return (
    <ChecklistPrintShell
      title={chdPageConfig.title}
      subtitle="Formulário em branco para preenchimento manual"
      documentType="CHD"
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
          <PrintField label={identificationSectionConfig.fields.date} />
          <PrintField label={identificationSectionConfig.fields.time} />
          <PrintField
            label={identificationSectionConfig.fields.brandModel}
            value={prefill?.brandModel}
          />
          <PrintField
            label={identificationSectionConfig.fields.platePrefix}
            value={prefill?.platePrefix}
          />
          <PrintField
            label={identificationSectionConfig.fields.currentKm}
            value={prefill?.km}
          />
          <PrintField
            label={identificationSectionConfig.fields.hourMeter}
            value={prefill?.hourMeter}
          />
          <PrintField
            label={identificationSectionConfig.fields.driver}
            value={prefill?.driver}
          />
          <PrintField
            label={identificationSectionConfig.fields.technicalResponsible}
            value={prefill?.technicalResponsible}
          />
          <PrintField
            label={`${identificationSectionConfig.fields.fuel} (${fuelOptions})`}
            span={2}
          />
        </PrintFieldGrid>
      </PrintSection>

      {generalStateSectionConfig.sections.map((section) => (
        <PrintSection
          key={section.id}
          title={section.title}
          number={sectionNumber++}
          hint={
            section.showAnomalyHint
              ? `${generalStateSectionConfig.anomalyHint.prefix} ${generalStateSectionConfig.anomalyHint.highlight} ${generalStateSectionConfig.anomalyHint.suffix}`
              : generalStateSectionConfig.functionalHint
          }
        >
          <PrintStatusTable items={section.items} />
        </PrintSection>
      ))}

      {modulesSectionConfig.sections.map((section) => (
        <PrintSection
          key={section.id}
          title={section.title}
          number={sectionNumber++}
          hint={modulesSectionConfig.hint}
        >
          <PrintStatusTable items={section.items} />
        </PrintSection>
      ))}

      <PrintSection
        title={partsSectionConfig.title}
        number={sectionNumber++}
        hint={partsSectionConfig.rule}
      >
        <PrintBlankTable
          headers={[
            partsSectionConfig.fields.description.label,
            partsSectionConfig.fields.partNumber.label,
            partsSectionConfig.fields.brand.label,
            partsSectionConfig.fields.oldPartDestination.label,
            partsSectionConfig.fields.newPhoto.label,
            partsSectionConfig.fields.replacedPhoto.label,
          ]}
          rowCount={checklistPrintConfig.blankRows}
        />
      </PrintSection>

      <PrintSection title={servicesSectionConfig.title} number={sectionNumber++}>
        <PrintBlankTable
          headers={[
            servicesSectionConfig.fields.systemComponent,
            servicesSectionConfig.fields.initialDiagnosis,
            servicesSectionConfig.fields.technicalAction,
            servicesSectionConfig.fields.technician,
            servicesSectionConfig.fields.manHours,
          ]}
          rowCount={checklistPrintConfig.blankRows}
        />
      </PrintSection>

      <PrintSection title={closingSectionConfig.title} number={sectionNumber++}>
        <PrintCheckboxRow label={closingSectionConfig.inventoryLabel} />
        <div className="mt-6">
          <PrintSignatureRow
            labels={[
              closingSectionConfig.fields.driverSignature,
              closingSectionConfig.fields.workshopSignature,
            ]}
          />
        </div>
      </PrintSection>
    </ChecklistPrintShell>
  );
}

import { checklistPrintConfig } from "@/shared/config/checklist-print";
import {
  ChecklistPrintShell,
  PrintCheckboxRow,
  PrintDataTable,
  PrintField,
  PrintFieldGrid,
  PrintSection,
  PrintSignatureRow,
  PrintStatusTableFilled,
} from "@/shared/components/checklist-print/checklist-print-primitives";
import { formatChecklistDateTime } from "@/features/che/lib/format-checklist-meta";
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
import type { ChecklistDevolucao } from "../types/checklist-devolucao-api";

type ChdFilledPrintFormProps = {
  checklist: ChecklistDevolucao;
  autoPrint?: boolean;
  autoDownloadPdf?: boolean;
};

function formatFuelLabel(value?: string) {
  if (!value) {
    return undefined;
  }

  return (
    chdFuelLevelOptions.find((option) => option.value === value)?.label ?? value
  );
}

function formatDestinationLabel(value?: string) {
  if (!value) {
    return "";
  }

  return (
    partsSectionConfig.destinations.find((option) => option.value === value)
      ?.label ?? value
  );
}

export function ChdFilledPrintForm({
  checklist,
  autoPrint = false,
  autoDownloadPdf = false,
}: ChdFilledPrintFormProps) {
  let sectionNumber = 1;

  const partsHeaders = [
    partsSectionConfig.fields.description.label,
    partsSectionConfig.fields.partNumber.label,
    partsSectionConfig.fields.brand.label,
    partsSectionConfig.fields.oldPartDestination.label,
    partsSectionConfig.fields.newPhoto.label,
    partsSectionConfig.fields.replacedPhoto.label,
  ];

  const partsRows = checklist.parts.items.map((part) => [
    part.description,
    part.partNumber,
    part.brand,
    formatDestinationLabel(part.oldPartDestination),
    part.newPhoto,
    part.replacedPhoto,
  ]);

  const servicesHeaders = [
    servicesSectionConfig.fields.systemComponent,
    servicesSectionConfig.fields.initialDiagnosis,
    servicesSectionConfig.fields.technicalAction,
    servicesSectionConfig.fields.technician,
    servicesSectionConfig.fields.manHours,
  ];

  const servicesRows = checklist.services.items.map((service) => [
    service.systemComponent,
    service.initialDiagnosis,
    service.technicalAction,
    service.technician,
    service.manHours,
  ]);

  return (
    <ChecklistPrintShell
      title={chdPageConfig.title}
      subtitle={`Checklist ${checklist.number} — respostas registradas`}
      documentType="CHD"
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
            label={identificationSectionConfig.fields.date}
            value={checklist.identification.date}
          />
          <PrintField
            label={identificationSectionConfig.fields.time}
            value={checklist.identification.time}
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
            label={identificationSectionConfig.fields.currentKm}
            value={checklist.identification.currentKm}
          />
          <PrintField
            label={identificationSectionConfig.fields.hourMeter}
            value={checklist.identification.hourMeter}
          />
          <PrintField
            label={identificationSectionConfig.fields.driver}
            value={checklist.identification.driver}
          />
          <PrintField
            label={identificationSectionConfig.fields.technicalResponsible}
            value={checklist.identification.technicalResponsible}
          />
          <PrintField
            label={identificationSectionConfig.fields.fuel}
            value={formatFuelLabel(checklist.identification.fuel)}
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
          <PrintStatusTableFilled
            items={section.items.map((item) => {
              const entry = checklist.generalState[item.id];

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

      {modulesSectionConfig.sections.map((section) => (
        <PrintSection
          key={section.id}
          title={section.title}
          number={sectionNumber++}
          hint={modulesSectionConfig.hint}
        >
          <PrintStatusTableFilled
            items={section.items.map((item) => {
              const entry = checklist.modules[item.id];

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

      <PrintSection
        title={partsSectionConfig.title}
        number={sectionNumber++}
        hint={partsSectionConfig.rule}
      >
        <PrintDataTable headers={partsHeaders} rows={partsRows} />
      </PrintSection>

      <PrintSection title={servicesSectionConfig.title} number={sectionNumber++}>
        <PrintDataTable headers={servicesHeaders} rows={servicesRows} />
      </PrintSection>

      <PrintSection title={closingSectionConfig.title} number={sectionNumber++}>
        <PrintCheckboxRow
          label={closingSectionConfig.inventoryLabel}
          checked={checklist.closing.inventoryChecked}
        />
        <div className="mt-6">
          {checklist.closing.driverSignature?.trim() ||
          checklist.closing.workshopSignature?.trim() ? (
            <PrintFieldGrid>
              <PrintField
                label={closingSectionConfig.fields.driverSignature}
                value={checklist.closing.driverSignature}
              />
              <PrintField
                label={closingSectionConfig.fields.workshopSignature}
                value={checklist.closing.workshopSignature}
              />
            </PrintFieldGrid>
          ) : (
            <PrintSignatureRow
              labels={[
                closingSectionConfig.fields.driverSignature,
                closingSectionConfig.fields.workshopSignature,
              ]}
            />
          )}
        </div>
      </PrintSection>
    </ChecklistPrintShell>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, FileCheck2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { CheStatusBadge } from "@/features/che/components/che-status-badge";
import { formatChecklistDateTime } from "@/features/che/lib/format-checklist-meta";
import { getChecklistDevolucaoById } from "../api/get-checklist-devolucao";
import { chdDetailPageConfig, chdListPageConfig } from "../config/list";
import {
  chdFuelLevelOptions,
  identificationSectionConfig,
} from "../config/page";
import { closingSectionConfig } from "../config/closing";
import { generalStateSectionConfig } from "../config/general-state";
import { modulesSectionConfig } from "../config/modules";
import { partsSectionConfig } from "../config/parts";
import { servicesSectionConfig } from "../config/services";
import {
  getGeneralStateItemLabel,
  getModuleItemLabel,
  getModuleSectionTitle,
} from "../lib/checklist-labels";
import type { ChecklistDevolucao } from "../types/checklist-devolucao-api";

type ChdDetailPageProps = {
  checklistId: string;
};

function DetailField({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {
  return (
    <div>
      <p className="text-xs font-medium text-zinc-500">{label}</p>
      <p className="mt-1 text-sm text-zinc-800">
        {value?.trim() ? value : chdDetailPageConfig.emptyValue}
      </p>
    </div>
  );
}

function ChecklistPhotoCard({
  label,
  url,
}: {
  label: string;
  url?: string;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
      <div className="border-b border-zinc-100 px-4 py-3">
        <p className="text-sm font-medium text-brand-navy">{label}</p>
      </div>
      <div className="aspect-[4/3] bg-zinc-50">
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt={label}
            className="size-full object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-sm text-zinc-400">
            {chdDetailPageConfig.noPhoto}
          </div>
        )}
      </div>
    </div>
  );
}

function ChecklistItemsTable({
  items,
}: {
  items: { label: string; status: string; photo?: string }[];
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200">
      <div className="grid grid-cols-[minmax(0,1fr)_120px] gap-2 border-b border-zinc-200 bg-zinc-50/80 px-4 py-3">
        <span className="text-[11px] font-semibold tracking-wide text-zinc-500 uppercase">
          Item
        </span>
        <span className="text-right text-[11px] font-semibold tracking-wide text-zinc-500 uppercase">
          Status
        </span>
      </div>
      <div className="divide-y divide-zinc-100">
        {items.map((item) => (
          <div key={item.label} className="px-4 py-3">
            <div className="grid grid-cols-[minmax(0,1fr)_120px] items-start gap-2">
              <p className="text-sm text-zinc-700">{item.label}</p>
              <div className="flex justify-end">
                <CheStatusBadge status={item.status} />
              </div>
            </div>
            {item.photo ? (
              <div className="mt-3 overflow-hidden rounded-lg border border-zinc-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.photo}
                  alt={`Anomalia — ${item.label}`}
                  className="max-h-56 w-full object-cover"
                />
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function formatFuelLabel(value?: string) {
  if (!value) return undefined;

  return (
    chdFuelLevelOptions.find((option) => option.value === value)?.label ?? value
  );
}

function formatDestinationLabel(value?: string) {
  if (!value) return undefined;

  return (
    partsSectionConfig.destinations.find((option) => option.value === value)
      ?.label ?? value
  );
}

function ChecklistDetailContent({ checklist }: { checklist: ChecklistDevolucao }) {
  const filledModuleSections = modulesSectionConfig.sections
    .map((section) => ({
      ...section,
      items: section.items
        .map((item) => ({
          ...item,
          status: checklist.modules[item.id]?.status ?? "",
        }))
        .filter((item) => item.status),
    }))
    .filter((section) => section.items.length > 0);

  return (
    <Tabs defaultValue="identificacao" className="flex flex-col gap-6">
      <TabsList
        variant="line"
        className="h-auto w-full justify-start gap-5 overflow-x-auto rounded-none border-b border-zinc-200 bg-transparent p-0"
      >
        <TabsTrigger value="identificacao">
          {chdDetailPageConfig.sections.identification}
        </TabsTrigger>
        <TabsTrigger value="estado-geral">
          {chdDetailPageConfig.sections.generalState}
        </TabsTrigger>
        <TabsTrigger value="modulos">
          {chdDetailPageConfig.sections.modules}
        </TabsTrigger>
        <TabsTrigger value="pecas">
          {chdDetailPageConfig.sections.parts}
        </TabsTrigger>
        <TabsTrigger value="servicos">
          {chdDetailPageConfig.sections.services}
        </TabsTrigger>
        <TabsTrigger value="encerramento">
          {chdDetailPageConfig.sections.closing}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="identificacao" className="mt-0">
        <div className="rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm">
          <h2 className="text-base font-bold text-brand-navy">
            {identificationSectionConfig.title}
          </h2>
          <Separator className="my-5" />
          <div className="grid gap-5 md:grid-cols-2">
            <DetailField
              label={identificationSectionConfig.fields.os}
              value={checklist.identification.os}
            />
            <DetailField
              label={identificationSectionConfig.fields.date}
              value={checklist.identification.date}
            />
            <DetailField
              label={identificationSectionConfig.fields.time}
              value={checklist.identification.time}
            />
            <DetailField
              label={identificationSectionConfig.fields.brandModel}
              value={checklist.identification.brandModel}
            />
            <DetailField
              label={identificationSectionConfig.fields.platePrefix}
              value={checklist.identification.platePrefix}
            />
            <DetailField
              label={identificationSectionConfig.fields.currentKm}
              value={checklist.identification.currentKm}
            />
            <DetailField
              label={identificationSectionConfig.fields.hourMeter}
              value={checklist.identification.hourMeter}
            />
            <DetailField
              label={identificationSectionConfig.fields.driver}
              value={checklist.identification.driver}
            />
            <DetailField
              label={identificationSectionConfig.fields.technicalResponsible}
              value={checklist.identification.technicalResponsible}
            />
            <DetailField
              label={identificationSectionConfig.fields.fuel}
              value={formatFuelLabel(checklist.identification.fuel)}
            />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="estado-geral" className="mt-0">
        <div className="flex flex-col gap-6">
          {generalStateSectionConfig.sections.map((section) => (
            <div
              key={section.id}
              className="rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm"
            >
              <h2 className="text-base font-bold text-brand-navy">
                {section.title}
              </h2>
              <div className="mt-5">
                <ChecklistItemsTable
                  items={section.items.map((item) => ({
                    label: getGeneralStateItemLabel(item.id),
                    status: checklist.generalState[item.id]?.status ?? "",
                    photo: checklist.generalState[item.id]?.photo,
                  }))}
                />
              </div>
            </div>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="modulos" className="mt-0">
        {filledModuleSections.length === 0 ? (
          <div className="rounded-xl border border-zinc-200/80 bg-white px-6 py-12 text-center text-sm text-zinc-500 shadow-sm">
            {chdDetailPageConfig.modulesEmpty}
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {filledModuleSections.map((section) => (
              <div
                key={section.id}
                className="rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm"
              >
                <h2 className="text-base font-bold text-brand-navy">
                  {getModuleSectionTitle(section.id)}
                </h2>
                <div className="mt-5">
                  <ChecklistItemsTable
                    items={section.items.map((item) => ({
                      label: getModuleItemLabel(item.id),
                      status: item.status,
                    }))}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="pecas" className="mt-0">
        {checklist.parts.items.length === 0 ? (
          <div className="rounded-xl border border-zinc-200/80 bg-white px-6 py-12 text-center text-sm text-zinc-500 shadow-sm">
            {chdDetailPageConfig.partsEmpty}
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {checklist.parts.items.map((part, index) => (
              <div
                key={`${part.partNumber}-${index}`}
                className="rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm"
              >
                <h2 className="text-base font-bold text-brand-navy">
                  {partsSectionConfig.partItemLabel(index + 1)}
                </h2>
                <Separator className="my-5" />
                <div className="grid gap-5 md:grid-cols-2">
                  <DetailField
                    label={partsSectionConfig.fields.description.label}
                    value={part.description}
                  />
                  <DetailField
                    label={partsSectionConfig.fields.partNumber.label}
                    value={part.partNumber}
                  />
                  <DetailField
                    label={partsSectionConfig.fields.brand.label}
                    value={part.brand}
                  />
                  <DetailField
                    label={partsSectionConfig.fields.oldPartDestination.label}
                    value={formatDestinationLabel(part.oldPartDestination)}
                  />
                </div>
                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  <ChecklistPhotoCard
                    label={partsSectionConfig.fields.newPhoto.label}
                    url={part.newPhoto}
                  />
                  <ChecklistPhotoCard
                    label={partsSectionConfig.fields.replacedPhoto.label}
                    url={part.replacedPhoto}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="servicos" className="mt-0">
        {checklist.services.items.length === 0 ? (
          <div className="rounded-xl border border-zinc-200/80 bg-white px-6 py-12 text-center text-sm text-zinc-500 shadow-sm">
            {chdDetailPageConfig.servicesEmpty}
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-zinc-200/80 bg-white shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    {servicesSectionConfig.fields.systemComponent}
                  </TableHead>
                  <TableHead>
                    {servicesSectionConfig.fields.initialDiagnosis}
                  </TableHead>
                  <TableHead>
                    {servicesSectionConfig.fields.technicalAction}
                  </TableHead>
                  <TableHead>
                    {servicesSectionConfig.fields.technician}
                  </TableHead>
                  <TableHead className="text-right">
                    {servicesSectionConfig.fields.manHours}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {checklist.services.items.map((service, index) => (
                  <TableRow key={`${service.systemComponent}-${index}`}>
                    <TableCell className="font-medium text-brand-navy">
                      {service.systemComponent || chdDetailPageConfig.emptyValue}
                    </TableCell>
                    <TableCell>{service.initialDiagnosis || "—"}</TableCell>
                    <TableCell>{service.technicalAction || "—"}</TableCell>
                    <TableCell>{service.technician || "—"}</TableCell>
                    <TableCell className="text-right">
                      {service.manHours || "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </TabsContent>

      <TabsContent value="encerramento" className="mt-0">
        <div className="rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm">
          <h2 className="text-base font-bold text-brand-navy">
            {closingSectionConfig.title}
          </h2>
          <Separator className="my-5" />
          <p className="text-sm text-zinc-700">
            {checklist.closing.inventoryChecked
              ? chdDetailPageConfig.inventoryChecked
              : chdDetailPageConfig.inventoryNotChecked}
          </p>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <DetailField
              label={closingSectionConfig.fields.driverSignature}
              value={checklist.closing.driverSignature}
            />
            <DetailField
              label={closingSectionConfig.fields.workshopSignature}
              value={checklist.closing.workshopSignature}
            />
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}

export function ChdDetailPage({ checklistId }: ChdDetailPageProps) {
  const [checklist, setChecklist] = useState<ChecklistDevolucao | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadChecklist() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const data = await getChecklistDevolucaoById(checklistId);

        if (!cancelled) {
          setChecklist(data);
        }
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Não foi possível carregar o checklist."
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadChecklist();

    return () => {
      cancelled = true;
    };
  }, [checklistId]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="flex min-h-full flex-col gap-8 px-8 py-8"
    >
      <div className="flex flex-col gap-4">
        <Link
          href="/chd"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "w-fit px-0 text-zinc-600 hover:text-brand-navy"
          )}
        >
          <ArrowLeft className="size-4" />
          {chdListPageConfig.actions.back}
        </Link>

        <div className="flex items-start gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-brand-navy/10 text-brand-navy">
            <FileCheck2 className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-brand-navy">
              {checklist?.number ?? "Checklist de devolução"}
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              {checklist?.identification.os
                ? `O.S. ${checklist.identification.os}`
                : null}
              {checklist?.identification.os && checklist?.createdAt ? " · " : null}
              {checklist?.createdAt
                ? `${chdDetailPageConfig.registeredAt} ${formatChecklistDateTime(checklist.createdAt)}`
                : null}
            </p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-zinc-200/80 bg-white px-6 py-12 text-center text-sm text-zinc-500 shadow-sm">
          Carregando checklist...
        </div>
      ) : errorMessage ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-12 text-center text-sm text-red-600 shadow-sm">
          {errorMessage}
        </div>
      ) : checklist ? (
        <ChecklistDetailContent checklist={checklist} />
      ) : null}
    </motion.div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ClipboardList } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { getChecklistChegadaById } from "../api/get-checklist-chegada";
import { blocksSectionConfig } from "../config/blocks";
import { cheListPageConfig, cheDetailPageConfig } from "../config/list";
import { identificationSectionConfig, photosSectionConfig } from "../config/page";
import { inspectionSectionConfig } from "../config/inspection";
import { termSectionConfig } from "../config/term";
import {
  getBlockItemLabel,
  getPhotoSlotLabel,
} from "../lib/checklist-labels";
import {
  formatChecklistDateTime,
  formatChecklistEntryDate,
} from "../lib/format-checklist-meta";
import type { ChecklistChegada } from "../types/checklist-chegada-api";
import type { ChePhotoSlot } from "../types/checklist";
import { CheStatusBadge } from "./che-status-badge";

type CheDetailPageProps = {
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
        {value?.trim() ? value : cheDetailPageConfig.emptyValue}
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
            {cheDetailPageConfig.noPhoto}
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

function ChecklistDetailContent({ checklist }: { checklist: ChecklistChegada }) {
  const photoSlots = photosSectionConfig.fields.map(
    (field) => field.id
  ) as ChePhotoSlot[];

  const filledBlockSections = blocksSectionConfig.sections
    .map((section) => ({
      ...section,
      items: section.items
        .map((item) => ({
          ...item,
          status: checklist.blocks[item.id]?.status ?? "",
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
          {cheDetailPageConfig.sections.identification}
        </TabsTrigger>
        <TabsTrigger value="fotos">
          {cheDetailPageConfig.sections.photos}
        </TabsTrigger>
        <TabsTrigger value="inspecao">
          {cheDetailPageConfig.sections.inspection}
        </TabsTrigger>
        <TabsTrigger value="blocos">
          {cheDetailPageConfig.sections.blocks}
        </TabsTrigger>
        <TabsTrigger value="termo">
          {cheDetailPageConfig.sections.term}
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
              label={identificationSectionConfig.fields.entryDate}
              value={formatChecklistEntryDate(checklist.identification.entryDate)}
            />
            <DetailField
              label={identificationSectionConfig.fields.time}
              value={checklist.identification.time}
            />
            <DetailField
              label={identificationSectionConfig.fields.responsible}
              value={checklist.identification.responsible}
            />
            <DetailField
              label={identificationSectionConfig.fields.client}
              value={checklist.identification.client}
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
              label={identificationSectionConfig.fields.km}
              value={checklist.identification.km}
            />
            <DetailField
              label={identificationSectionConfig.fields.hourMeter}
              value={checklist.identification.hourMeter}
            />
            <DetailField
              label={identificationSectionConfig.fields.fuel}
              value={checklist.identification.fuel}
            />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="fotos" className="mt-0">
        <div className="grid gap-5 md:grid-cols-2">
          {photoSlots.map((slot) => (
            <ChecklistPhotoCard
              key={slot}
              label={getPhotoSlotLabel(slot)}
              url={checklist.photos[slot]}
            />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="inspecao" className="mt-0">
        <div className="flex flex-col gap-6">
          {inspectionSectionConfig.sections.map((section) => (
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
                    label: item.label,
                    status: checklist.inspection[item.id]?.status ?? "",
                    photo: checklist.inspection[item.id]?.photo,
                  }))}
                />
              </div>
            </div>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="blocos" className="mt-0">
        {filledBlockSections.length === 0 ? (
          <div className="rounded-xl border border-zinc-200/80 bg-white px-6 py-12 text-center text-sm text-zinc-500 shadow-sm">
            {cheDetailPageConfig.blocksEmpty}
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {filledBlockSections.map((section) => (
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
                      label: getBlockItemLabel(item.id),
                      status: item.status,
                    }))}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="termo" className="mt-0">
        <div className="rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm">
          <h2 className="text-base font-bold text-brand-navy">
            {termSectionConfig.title}
          </h2>
          <Separator className="my-5" />
          <div className="grid gap-5">
            <DetailField
              label={termSectionConfig.fields.symptoms}
              value={checklist.term.symptoms}
            />
            <div className="grid gap-5 md:grid-cols-2">
              <DetailField
                label={termSectionConfig.fields.clientSignature}
                value={checklist.term.clientSignature}
              />
              <DetailField
                label={termSectionConfig.fields.workshopSignature}
                value={checklist.term.workshopSignature}
              />
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}

export function CheDetailPage({ checklistId }: CheDetailPageProps) {
  const [checklist, setChecklist] = useState<ChecklistChegada | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadChecklist() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const data = await getChecklistChegadaById(checklistId);

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
          href="/che"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "w-fit px-0 text-zinc-600 hover:text-brand-navy"
          )}
        >
          <ArrowLeft className="size-4" />
          {cheListPageConfig.actions.back}
        </Link>

        <div className="flex items-start gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-brand-navy/10 text-brand-navy">
            <ClipboardList className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-brand-navy">
              {checklist?.number ?? "Checklist de chegada"}
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              {checklist?.identification.os
                ? `O.S. ${checklist.identification.os}`
                : null}
              {checklist?.createdAt
                ? ` · ${cheDetailPageConfig.registeredAt} ${formatChecklistDateTime(checklist.createdAt)}`
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

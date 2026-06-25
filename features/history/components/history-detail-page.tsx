"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ExternalLink,
  FileCheck2,
  FileSpreadsheet,
  Wrench,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useOficinaStore } from "@/features/auth/store/oficina-store";
import { OrderStatusBadge } from "@/features/service-orders/components/order-status-badge";
import { formatCurrency } from "@/features/quotes/lib/calculations";
import {
  formatLeadTimeDays,
  formatOrcamentoDate,
  formatOrcamentoStatus,
} from "@/features/quotes/lib/format-orcamento-meta";
import { formatChecklistDateTime } from "@/features/che/lib/format-checklist-meta";
import { loadHistoricoOficina } from "../api/load-historico-oficina";
import { historyPageConfig } from "../config/page";
import { findHistoricoRecordByOrderId } from "../lib/build-historico-items";
import { formatHistoricoDate } from "../lib/parse-activity-date";
import type { HistoricoRecord } from "../types/historico";
import { HistoryDocumentBadges } from "./history-document-badges";

type HistoryDetailPageProps = {
  orderId: string;
};

function SectionCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-lg bg-brand-navy/10 text-brand-navy">
          {icon}
        </div>
        <h2 className="text-base font-bold text-brand-navy">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function EmptySectionMessage() {
  return (
    <p className="text-sm text-zinc-500">{historyPageConfig.detail.emptySection}</p>
  );
}

export function HistoryDetailPage({ orderId }: HistoryDetailPageProps) {
  const oficina = useOficinaStore((state) => state.oficina);
  const [record, setRecord] = useState<HistoricoRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadRecord = useCallback(async () => {
    if (!oficina?.id) {
      setRecord(null);
      setErrorMessage(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const data = await loadHistoricoOficina({
        oficinaId: oficina.id,
        oficinaName: oficina.nome,
      });
      const found = findHistoricoRecordByOrderId(data, orderId);

      if (!found) {
        setRecord(null);
        setErrorMessage(historyPageConfig.states.notFound);
        return;
      }

      setRecord(found);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : historyPageConfig.states.error
      );
    } finally {
      setIsLoading(false);
    }
  }, [oficina?.id, oficina?.nome, orderId]);

  useEffect(() => {
    void loadRecord();
  }, [loadRecord]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-8 py-8"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-brand-navy">
            {historyPageConfig.detail.title}
          </h1>
          {record ? (
            <p className="mt-1 text-sm text-zinc-500">
              {record.order.code} · {record.order.client}
            </p>
          ) : null}
        </div>
        <Link
          href="/historico"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-10 border-zinc-200 bg-white px-4 text-zinc-700"
          )}
        >
          <ArrowLeft className="size-4" />
          {historyPageConfig.actions.back}
        </Link>
      </div>

      {!oficina?.id ? (
        <div className="rounded-xl border border-zinc-200/80 bg-white px-6 py-12 text-center text-sm text-zinc-500 shadow-sm">
          {historyPageConfig.states.noOficina}
        </div>
      ) : isLoading ? (
        <div className="rounded-xl border border-zinc-200/80 bg-white px-6 py-12 text-center text-sm text-zinc-500 shadow-sm">
          {historyPageConfig.states.loading}
        </div>
      ) : errorMessage || !record ? (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-zinc-200/80 bg-white px-6 py-12 text-center shadow-sm">
          <p className="text-sm text-red-600">
            {errorMessage ?? historyPageConfig.states.notFound}
          </p>
          <Button variant="outline" onClick={() => void loadRecord()}>
            {historyPageConfig.actions.retry}
          </Button>
        </div>
      ) : (
        <>
          <section className="overflow-hidden rounded-xl border border-zinc-200/80 bg-white shadow-sm">
            <header className="bg-brand-navy px-6 py-5 text-white">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold">
                    {record.order.code} · {record.order.machine}
                  </h2>
                  <p className="mt-1 text-sm text-white/80">
                    {record.order.client}
                  </p>
                </div>
                <OrderStatusBadge status={record.order.status} />
              </div>
            </header>

            <div className="grid gap-4 px-6 py-5 sm:grid-cols-2 lg:grid-cols-4">
              <SummaryMetric
                label={historyPageConfig.detail.fields.openedAt}
                value={record.order.openedAt}
              />
              <SummaryMetric
                label={historyPageConfig.detail.fields.quotedValue}
                value={
                  record.order.quotedValue !== null
                    ? formatCurrency(record.order.quotedValue)
                    : "—"
                }
              />
              <SummaryMetric
                label={historyPageConfig.detail.fields.backendStatus}
                value={record.order.backendStatus ?? "—"}
              />
              <div className="rounded-lg border border-zinc-200/80 bg-zinc-50/70 px-4 py-3">
                <p className="text-[11px] font-semibold tracking-wide text-zinc-500 uppercase">
                  Documentos
                </p>
                <div className="mt-2">
                  <HistoryDocumentBadges kinds={record.activityKinds} />
                </div>
              </div>
            </div>
          </section>

          <SectionCard
            title={historyPageConfig.detail.sections.orcamento}
            icon={<FileSpreadsheet className="size-4" />}
          >
            {record.orcamento ? (
              <div className="flex flex-col gap-4 rounded-lg border border-zinc-200/80 bg-zinc-50/70 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <SummaryMetric
                    label={historyPageConfig.detail.fields.total}
                    value={formatCurrency(record.orcamento.valorTotal)}
                  />
                  <SummaryMetric
                    label={historyPageConfig.detail.fields.leadTime}
                    value={formatLeadTimeDays(record.orcamento.prazoDias)}
                  />
                  <SummaryMetric
                    label="Status"
                    value={formatOrcamentoStatus(record.orcamento.solicitacaoStatus)}
                  />
                  <SummaryMetric
                    label={historyPageConfig.detail.fields.createdAt}
                    value={formatOrcamentoDate(record.orcamento.createdAt)}
                  />
                </div>
                <Link
                  href={`/orcamentos/${record.orcamento.id}`}
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "h-10 shrink-0 gap-1.5"
                  )}
                >
                  <ExternalLink className="size-4" />
                  {historyPageConfig.detail.links.viewOrcamento}
                </Link>
              </div>
            ) : (
              <EmptySectionMessage />
            )}
          </SectionCard>

          <SectionCard
            title={historyPageConfig.detail.sections.che}
            icon={<Wrench className="size-4" />}
          >
            {record.checklistsChegada.length > 0 ? (
              <div className="space-y-3">
                {record.checklistsChegada.map((checklist) => (
                  <article
                    key={checklist.id}
                    className="flex flex-col gap-3 rounded-lg border border-zinc-200/80 bg-zinc-50/70 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-semibold text-brand-navy">
                        {checklist.number}
                      </p>
                      <p className="mt-1 text-sm text-zinc-600">
                        {checklist.identification.brandModel || "—"} ·{" "}
                        {formatChecklistDateTime(checklist.createdAt)}
                      </p>
                    </div>
                    <Link
                      href={`/che/${checklist.id}`}
                      className={cn(
                        buttonVariants({ variant: "outline", size: "sm" }),
                        "h-8 gap-1.5"
                      )}
                    >
                      <ExternalLink className="size-3.5" />
                      {historyPageConfig.detail.links.viewChe}
                    </Link>
                  </article>
                ))}
              </div>
            ) : (
              <EmptySectionMessage />
            )}
          </SectionCard>

          <SectionCard
            title={historyPageConfig.detail.sections.chd}
            icon={<FileCheck2 className="size-4" />}
          >
            {record.checklistsDevolucao.length > 0 ? (
              <div className="space-y-3">
                {record.checklistsDevolucao.map((checklist) => (
                  <article
                    key={checklist.id}
                    className="flex flex-col gap-3 rounded-lg border border-zinc-200/80 bg-zinc-50/70 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-semibold text-brand-navy">
                        {checklist.number}
                      </p>
                      <p className="mt-1 text-sm text-zinc-600">
                        {checklist.identification.brandModel || "—"} ·{" "}
                        {formatChecklistDateTime(checklist.createdAt)}
                      </p>
                    </div>
                    <Link
                      href={`/chd/${checklist.id}`}
                      className={cn(
                        buttonVariants({ variant: "outline", size: "sm" }),
                        "h-8 gap-1.5"
                      )}
                    >
                      <ExternalLink className="size-3.5" />
                      {historyPageConfig.detail.links.viewChd}
                    </Link>
                  </article>
                ))}
              </div>
            ) : (
              <EmptySectionMessage />
            )}
          </SectionCard>

          <p className="text-xs text-zinc-500">
            Última atividade: {formatHistoricoDate(record.lastActivityAt)}
          </p>
        </>
      )}
    </motion.div>
  );
}

function SummaryMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-200/80 bg-zinc-50/70 px-4 py-3">
      <p className="text-[11px] font-semibold tracking-wide text-zinc-500 uppercase">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-zinc-800">{value}</p>
    </div>
  );
}

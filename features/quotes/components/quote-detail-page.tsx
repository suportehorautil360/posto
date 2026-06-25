"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, FileSpreadsheet } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useOficinaStore } from "@/features/auth/store/oficina-store";
import { getOrcamentoById } from "@/features/service-orders/api/get-orcamento";
import type { Orcamento } from "@/features/service-orders/types/orcamento-api";
import { useQuotes } from "../context/quotes-context";
import {
  calculatePartTotal,
  calculateServiceTotal,
  calculateTravelTotal,
  formatCurrency,
} from "../lib/calculations";
import {
  formatLeadTimeDays,
  formatOrcamentoDate,
  formatOrcamentoStatus,
} from "../lib/format-orcamento-meta";
import {
  calculateQuoteDetailSubtotals,
  resolveQuoteDetailSections,
} from "../lib/map-orcamento-to-detail-sections";
import { hourTypeOptions, newQuotePageConfig } from "../config/page";
import { quoteDetailPageConfig, quotesListPageConfig } from "../config/list";

type QuoteDetailPageProps = {
  orcamentoId: string;
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
        {value?.trim() ? value : quoteDetailPageConfig.emptyValue}
      </p>
    </div>
  );
}

function SectionCard({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm">
      <h2 className="text-base font-bold text-brand-navy">{title}</h2>
      <div className="mt-5">{children}</div>
      {hint ? <p className="mt-3 text-xs text-zinc-500">{hint}</p> : null}
    </section>
  );
}

function ReadOnlyValue({ value }: { value: string }) {
  return (
    <div className="flex min-h-9 items-center rounded-md border border-zinc-200 bg-zinc-50/80 px-3 text-sm text-zinc-800">
      {value.trim() ? value : quoteDetailPageConfig.emptyValue}
    </div>
  );
}

function formatHourTypeLabel(value: string) {
  return (
    hourTypeOptions.find((option) => option.value === value)?.label ?? value
  );
}

export function QuoteDetailPage({ orcamentoId }: QuoteDetailPageProps) {
  const oficina = useOficinaStore((state) => state.oficina);
  const { getQuote } = useQuotes();
  const [orcamento, setOrcamento] = useState<Orcamento | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadOrcamento = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const data = await getOrcamentoById(orcamentoId, oficina?.id);
      setOrcamento(data);
    } catch (error) {
      setOrcamento(null);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : quoteDetailPageConfig.states.error
      );
    } finally {
      setIsLoading(false);
    }
  }, [orcamentoId, oficina?.id]);

  useEffect(() => {
    void loadOrcamento();
  }, [loadOrcamento]);

  const sections = useMemo(() => {
    if (!orcamento) {
      return null;
    }

    return resolveQuoteDetailSections(
      orcamento,
      getQuote(orcamento.id) ?? getQuote(orcamento.solicitacaoOsId)
    );
  }, [orcamento, getQuote]);

  const subtotals = useMemo(() => {
    if (!sections) {
      return null;
    }

    return calculateQuoteDetailSubtotals(sections);
  }, [sections]);

  const travelSubtotal = sections
    ? calculateTravelTotal(
        sections.travel.km,
        sections.travel.valuePerKm,
        sections.travel.travelHours,
        sections.travel.hourlyRate,
        sections.travel.fees
      )
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-8 py-8"
    >
      <Link
        href="/orcamentos"
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "w-fit px-0 text-zinc-600 hover:text-brand-navy"
        )}
      >
        <ArrowLeft className="size-4" />
        {quotesListPageConfig.actions.back}
      </Link>

      {isLoading ? (
        <div className="rounded-xl border border-zinc-200/80 bg-white px-6 py-12 text-center text-sm text-zinc-500 shadow-sm">
          {quoteDetailPageConfig.states.loading}
        </div>
      ) : errorMessage ? (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-zinc-200/80 bg-white px-6 py-12 text-center shadow-sm">
          <p className="text-sm text-red-600">{errorMessage}</p>
          <button
            type="button"
            className={cn(buttonVariants({ variant: "outline" }))}
            onClick={() => void loadOrcamento()}
          >
            {quotesListPageConfig.actions.retry}
          </button>
        </div>
      ) : orcamento && sections && subtotals ? (
        <>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-brand-navy/10 text-brand-navy">
              <FileSpreadsheet className="size-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-brand-navy">
                {orcamento.protocol}
              </h1>
              <p className="mt-1 text-sm text-zinc-500">
                {formatOrcamentoDate(orcamento.createdAt)}
              </p>
            </div>
          </div>

          <section className="rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-brand-navy">
              {quoteDetailPageConfig.sections.summary}
            </h2>
            <Separator className="my-5" />
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              <DetailField
                label={quoteDetailPageConfig.fields.protocol}
                value={orcamento.protocol}
              />
              <DetailField
                label={quoteDetailPageConfig.fields.equipment}
                value={orcamento.equipamento}
              />
              <DetailField
                label={quoteDetailPageConfig.fields.client}
                value={orcamento.operador}
              />
              <DetailField
                label={quoteDetailPageConfig.fields.total}
                value={formatCurrency(orcamento.valorTotal)}
              />
              <DetailField
                label={quoteDetailPageConfig.fields.leadTime}
                value={formatLeadTimeDays(orcamento.prazoDias)}
              />
              <DetailField
                label={quoteDetailPageConfig.fields.status}
                value={formatOrcamentoStatus(orcamento.solicitacaoStatus)}
              />
            </div>
          </section>

          <SectionCard
            title={newQuotePageConfig.sections.parts}
            hint={newQuotePageConfig.hints.parts}
          >
            {sections.parts.length === 0 ? (
              <p className="text-sm text-zinc-500">
                {quoteDetailPageConfig.partsEmpty}
              </p>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-zinc-200">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      {Object.values(newQuotePageConfig.columns.parts).map(
                        (column) => (
                          <TableHead
                            key={column}
                            className="h-10 bg-zinc-50/80 text-[11px] font-semibold tracking-wide text-zinc-500 uppercase"
                          >
                            {column}
                          </TableHead>
                        )
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sections.parts.map((part) => (
                      <TableRow key={part.id}>
                        <TableCell className="py-2">
                          <ReadOnlyValue value={part.code} />
                        </TableCell>
                        <TableCell className="py-2">
                          <ReadOnlyValue value={part.description} />
                        </TableCell>
                        <TableCell className="py-2">
                          <ReadOnlyValue value={part.brand} />
                        </TableCell>
                        <TableCell className="w-24 py-2">
                          <ReadOnlyValue value={part.quantity} />
                        </TableCell>
                        <TableCell className="w-28 py-2">
                          <ReadOnlyValue value={part.unitValue} />
                        </TableCell>
                        <TableCell className="py-2 font-medium whitespace-nowrap text-zinc-700">
                          {formatCurrency(
                            calculatePartTotal(part.quantity, part.unitValue)
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </SectionCard>

          <SectionCard
            title={newQuotePageConfig.sections.services}
            hint={newQuotePageConfig.hints.services}
          >
            {sections.services.length === 0 ? (
              <p className="text-sm text-zinc-500">
                {quoteDetailPageConfig.servicesEmpty}
              </p>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-zinc-200">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      {Object.values(newQuotePageConfig.columns.services).map(
                        (column) => (
                          <TableHead
                            key={column}
                            className="h-10 bg-zinc-50/80 text-[11px] font-semibold tracking-wide text-zinc-500 uppercase"
                          >
                            {column}
                          </TableHead>
                        )
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sections.services.map((service) => (
                      <TableRow key={service.id}>
                        <TableCell className="py-2">
                          <ReadOnlyValue value={service.description} />
                        </TableCell>
                        <TableCell className="w-36 py-2">
                          <ReadOnlyValue
                            value={formatHourTypeLabel(service.hourType)}
                          />
                        </TableCell>
                        <TableCell className="w-24 py-2">
                          <ReadOnlyValue value={service.hours} />
                        </TableCell>
                        <TableCell className="w-28 py-2">
                          <ReadOnlyValue value={service.hourlyRate} />
                        </TableCell>
                        <TableCell className="py-2 font-medium whitespace-nowrap text-zinc-700">
                          {formatCurrency(
                            calculateServiceTotal(
                              service.hours,
                              service.hourlyRate
                            )
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </SectionCard>

          <SectionCard
            title={newQuotePageConfig.sections.travel}
            hint={newQuotePageConfig.hints.travel}
          >
            <div className="grid gap-4 md:grid-cols-6">
              {(
                [
                  ["km", newQuotePageConfig.fields.km, sections.travel.km],
                  [
                    "valuePerKm",
                    newQuotePageConfig.fields.valuePerKm,
                    sections.travel.valuePerKm,
                  ],
                  [
                    "travelHours",
                    newQuotePageConfig.fields.travelHours,
                    sections.travel.travelHours,
                  ],
                  [
                    "hourlyRate",
                    newQuotePageConfig.fields.travelHourlyRate,
                    sections.travel.hourlyRate,
                  ],
                  ["fees", newQuotePageConfig.fields.fees, sections.travel.fees],
                ] as const
              ).map(([field, label, value]) => (
                <div key={field}>
                  <p className="mb-2 block text-xs font-medium text-zinc-500">
                    {label}
                  </p>
                  <ReadOnlyValue value={value} />
                </div>
              ))}
              <div>
                <p className="mb-2 block text-xs font-medium text-zinc-500">
                  TOTAL
                </p>
                <div className="flex h-11 items-center rounded-md border border-zinc-200 bg-zinc-50 px-3 text-sm font-semibold text-brand-navy">
                  {formatCurrency(travelSubtotal)}
                </div>
              </div>
            </div>
          </SectionCard>

          <div className="rounded-xl bg-brand-navy px-6 py-5 text-white shadow-sm lg:max-w-md lg:ml-auto">
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between gap-6 text-white/80">
                <span>{newQuotePageConfig.summary.parts}</span>
                <span>{formatCurrency(subtotals.partsSubtotal)}</span>
              </div>
              <div className="flex items-center justify-between gap-6 text-white/80">
                <span>{newQuotePageConfig.summary.services}</span>
                <span>{formatCurrency(subtotals.servicesSubtotal)}</span>
              </div>
              <div className="flex items-center justify-between gap-6 text-white/80">
                <span>{newQuotePageConfig.summary.travel}</span>
                <span>{formatCurrency(subtotals.travelSubtotal)}</span>
              </div>
              <div className="border-t border-white/15 pt-3">
                <div className="flex items-center justify-between gap-6">
                  <span className="text-base font-bold">
                    {newQuotePageConfig.summary.total}
                  </span>
                  <span className="text-2xl font-bold">
                    {formatCurrency(
                      orcamento.valorTotal > 0
                        ? orcamento.valorTotal
                        : subtotals.grandTotal
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </motion.div>
  );
}

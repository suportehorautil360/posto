"use client";

import { useCallback, useEffect, useState } from "react";
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
import { formatCurrency } from "../lib/calculations";
import {
  formatLeadTimeDays,
  formatOrcamentoDate,
  formatOrcamentoStatus,
} from "../lib/format-orcamento-meta";
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

export function QuoteDetailPage({ orcamentoId }: QuoteDetailPageProps) {
  const oficina = useOficinaStore((state) => state.oficina);
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="flex min-h-full flex-col gap-6 px-8 py-8"
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
      ) : orcamento ? (
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

          <div className="rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm">
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
          </div>

          <div className="rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-brand-navy">
              {quoteDetailPageConfig.sections.items}
            </h2>
            <Separator className="my-5" />

            {orcamento.items.length === 0 ? (
              <p className="text-sm text-zinc-500">
                {quoteDetailPageConfig.itemsEmpty}
              </p>
            ) : (
              <div className="overflow-hidden rounded-lg border border-zinc-200">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        {quoteDetailPageConfig.columns.description}
                      </TableHead>
                      <TableHead className="text-right">
                        {quoteDetailPageConfig.columns.value}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orcamento.items.map((item, index) => (
                      <TableRow key={`${item.description}-${index}`}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(item.value)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </>
      ) : null}
    </motion.div>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, FileSpreadsheet, Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
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
import { getOrcamentosOficina } from "@/features/service-orders/api/get-orcamentos-oficina";
import type { Orcamento } from "@/features/service-orders/types/orcamento-api";
import { formatCurrency } from "../lib/calculations";
import {
  formatLeadTimeDays,
  formatOrcamentoDate,
  formatOrcamentoStatus,
} from "../lib/format-orcamento-meta";
import { quotesListPageConfig } from "../config/list";

export function QuotesListPage() {
  const oficina = useOficinaStore((state) => state.oficina);
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadOrcamentos = useCallback(async () => {
    if (!oficina?.id) {
      setOrcamentos([]);
      setErrorMessage(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const data = await getOrcamentosOficina(oficina.id);
      const sorted = [...data].sort((left, right) => {
        const leftTime = left.createdAt
          ? new Date(left.createdAt).getTime()
          : 0;
        const rightTime = right.createdAt
          ? new Date(right.createdAt).getTime()
          : 0;

        return rightTime - leftTime;
      });

      setOrcamentos(sorted);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : quotesListPageConfig.states.error
      );
    } finally {
      setIsLoading(false);
    }
  }, [oficina?.id]);

  useEffect(() => {
    void loadOrcamentos();
  }, [loadOrcamentos]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="flex min-h-full flex-col gap-8 px-8 py-8"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-brand-navy/10 text-brand-navy">
              <FileSpreadsheet className="size-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-brand-navy">
                {quotesListPageConfig.title}
              </h1>
              <p className="mt-1 text-sm text-zinc-500">
                {quotesListPageConfig.subtitle}
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/orcamentos/novo"
          className={cn(
            buttonVariants(),
            "h-10 bg-brand-orange text-white hover:bg-brand-orange-hover"
          )}
        >
          <Plus className="size-4" />
          {quotesListPageConfig.actions.new}
        </Link>
      </div>

      <div className="rounded-xl border border-zinc-200/80 bg-white shadow-sm">
        {!oficina?.id ? (
          <div className="px-6 py-12 text-center text-sm text-zinc-500">
            {quotesListPageConfig.states.noOficina}
          </div>
        ) : isLoading ? (
          <div className="px-6 py-12 text-center text-sm text-zinc-500">
            {quotesListPageConfig.states.loading}
          </div>
        ) : errorMessage ? (
          <div className="flex flex-col items-center gap-4 px-6 py-12 text-center">
            <p className="text-sm text-red-600">{errorMessage}</p>
            <button
              type="button"
              className={cn(buttonVariants({ variant: "outline" }))}
              onClick={() => void loadOrcamentos()}
            >
              {quotesListPageConfig.actions.retry}
            </button>
          </div>
        ) : orcamentos.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-base font-semibold text-brand-navy">
              {quotesListPageConfig.empty.title}
            </p>
            <p className="mt-2 text-sm text-zinc-500">
              {quotesListPageConfig.empty.description}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{quotesListPageConfig.columns.protocol}</TableHead>
                <TableHead>{quotesListPageConfig.columns.equipment}</TableHead>
                <TableHead>{quotesListPageConfig.columns.client}</TableHead>
                <TableHead>{quotesListPageConfig.columns.total}</TableHead>
                <TableHead>{quotesListPageConfig.columns.leadTime}</TableHead>
                <TableHead>{quotesListPageConfig.columns.status}</TableHead>
                <TableHead>{quotesListPageConfig.columns.date}</TableHead>
                <TableHead className="text-right">
                  {quotesListPageConfig.columns.actions}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orcamentos.map((orcamento) => (
                <TableRow key={orcamento.id}>
                  <TableCell className="font-medium text-brand-navy">
                    {orcamento.protocol}
                  </TableCell>
                  <TableCell>{orcamento.equipamento || "—"}</TableCell>
                  <TableCell>{orcamento.operador || "—"}</TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(orcamento.valorTotal)}
                  </TableCell>
                  <TableCell>
                    {formatLeadTimeDays(orcamento.prazoDias)}
                  </TableCell>
                  <TableCell>
                    {formatOrcamentoStatus(orcamento.solicitacaoStatus)}
                  </TableCell>
                  <TableCell>
                    {formatOrcamentoDate(orcamento.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={`/orcamentos/${orcamento.id}`}
                      className={cn(
                        buttonVariants({ variant: "outline", size: "sm" }),
                        "h-8 gap-1.5"
                      )}
                    >
                      <Eye className="size-3.5" />
                      {quotesListPageConfig.actions.view}
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </motion.div>
  );
}

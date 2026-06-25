"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, History, Search } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { OrderStatusBadge } from "@/features/service-orders/components/order-status-badge";
import { loadHistoricoOficina } from "../api/load-historico-oficina";
import { historyPageConfig } from "../config/page";
import { filterHistoricoRecords } from "../lib/build-historico-items";
import { formatHistoricoDate } from "../lib/parse-activity-date";
import type { HistoricoRecord } from "../types/historico";
import { HistoryDocumentBadges } from "./history-document-badges";

export function HistoryListPage() {
  const oficina = useOficinaStore((state) => state.oficina);
  const [records, setRecords] = useState<HistoricoRecord[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadHistory = useCallback(async () => {
    if (!oficina?.id) {
      setRecords([]);
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

      setRecords(data.records);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : historyPageConfig.states.error
      );
    } finally {
      setIsLoading(false);
    }
  }, [oficina?.id, oficina?.nome]);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  const filteredRecords = useMemo(
    () => filterHistoricoRecords(records, search),
    [records, search]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="flex min-h-full flex-col gap-8 px-8 py-8"
    >
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-brand-navy/10 text-brand-navy">
            <History className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-brand-navy">
              {historyPageConfig.title}
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              {historyPageConfig.subtitle}
            </p>
          </div>
        </div>
      </div>

      <div className="relative max-w-xl">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-400" />
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={historyPageConfig.searchPlaceholder}
          className="h-10 border-zinc-200 bg-white pl-9"
        />
      </div>

      <div className="rounded-xl border border-zinc-200/80 bg-white shadow-sm">
        {!oficina?.id ? (
          <div className="px-6 py-12 text-center text-sm text-zinc-500">
            {historyPageConfig.states.noOficina}
          </div>
        ) : isLoading ? (
          <div className="px-6 py-12 text-center text-sm text-zinc-500">
            {historyPageConfig.states.loading}
          </div>
        ) : errorMessage ? (
          <div className="flex flex-col items-center gap-4 px-6 py-12 text-center">
            <p className="text-sm text-red-600">{errorMessage}</p>
            <Button variant="outline" onClick={() => void loadHistory()}>
              {historyPageConfig.actions.retry}
            </Button>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-base font-semibold text-brand-navy">
              {historyPageConfig.empty.title}
            </p>
            <p className="mt-2 text-sm text-zinc-500">
              {historyPageConfig.empty.description}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{historyPageConfig.columns.order}</TableHead>
                <TableHead>{historyPageConfig.columns.client}</TableHead>
                <TableHead>{historyPageConfig.columns.machine}</TableHead>
                <TableHead>{historyPageConfig.columns.status}</TableHead>
                <TableHead>{historyPageConfig.columns.documents}</TableHead>
                <TableHead>{historyPageConfig.columns.lastActivity}</TableHead>
                <TableHead className="text-right">
                  {historyPageConfig.columns.actions}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record) => (
                <TableRow key={record.order.id}>
                  <TableCell className="font-medium text-brand-navy">
                    {record.order.code}
                  </TableCell>
                  <TableCell>{record.order.client}</TableCell>
                  <TableCell>{record.order.machine}</TableCell>
                  <TableCell>
                    <OrderStatusBadge status={record.order.status} />
                  </TableCell>
                  <TableCell>
                    <HistoryDocumentBadges kinds={record.activityKinds} />
                  </TableCell>
                  <TableCell>
                    {formatHistoricoDate(record.lastActivityAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={`/historico/${encodeURIComponent(record.order.id)}`}
                      className={cn(
                        buttonVariants({ variant: "outline", size: "sm" }),
                        "h-8 gap-1.5"
                      )}
                    >
                      <Eye className="size-3.5" />
                      {historyPageConfig.actions.view}
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

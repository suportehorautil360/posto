"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, Plus, Wrench } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
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
import { getChecklistsChegadaOficina } from "../api/get-checklists-chegada-oficina";
import { cheListPageConfig } from "../config/list";
import { formatChecklistDateTime } from "../lib/format-checklist-meta";
import type { ChecklistChegada } from "../types/checklist-chegada-api";

export function CheListPage() {
  const oficina = useOficinaStore((state) => state.oficina);
  const [checklists, setChecklists] = useState<ChecklistChegada[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadChecklists = useCallback(async () => {
    if (!oficina?.id) {
      setChecklists([]);
      setErrorMessage(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const data = await getChecklistsChegadaOficina(oficina.id);
      const sorted = [...data].sort(
        (left, right) =>
          new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
      );

      setChecklists(sorted);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : cheListPageConfig.states.error
      );
    } finally {
      setIsLoading(false);
    }
  }, [oficina?.id]);

  useEffect(() => {
    void loadChecklists();
  }, [loadChecklists]);

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
              <Wrench className="size-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-brand-navy">
                {cheListPageConfig.title}
              </h1>
              <p className="mt-1 text-sm text-zinc-500">
                {cheListPageConfig.subtitle}
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/che/novo"
          className={cn(
            buttonVariants(),
            "h-10 bg-brand-orange text-white hover:bg-brand-orange-hover"
          )}
        >
          <Plus className="size-4" />
          {cheListPageConfig.actions.new}
        </Link>
      </div>

      <div className="rounded-xl border border-zinc-200/80 bg-white shadow-sm">
        {!oficina?.id ? (
          <div className="px-6 py-12 text-center text-sm text-zinc-500">
            {cheListPageConfig.states.noOficina}
          </div>
        ) : isLoading ? (
          <div className="px-6 py-12 text-center text-sm text-zinc-500">
            {cheListPageConfig.states.loading}
          </div>
        ) : errorMessage ? (
          <div className="flex flex-col items-center gap-4 px-6 py-12 text-center">
            <p className="text-sm text-red-600">{errorMessage}</p>
            <Button variant="outline" onClick={() => void loadChecklists()}>
              {cheListPageConfig.actions.retry}
            </Button>
          </div>
        ) : checklists.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-base font-semibold text-brand-navy">
              {cheListPageConfig.empty.title}
            </p>
            <p className="mt-2 text-sm text-zinc-500">
              {cheListPageConfig.empty.description}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{cheListPageConfig.columns.number}</TableHead>
                <TableHead>{cheListPageConfig.columns.os}</TableHead>
                <TableHead>{cheListPageConfig.columns.client}</TableHead>
                <TableHead>{cheListPageConfig.columns.equipment}</TableHead>
                <TableHead>{cheListPageConfig.columns.date}</TableHead>
                <TableHead className="text-right">
                  {cheListPageConfig.columns.actions}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {checklists.map((checklist) => (
                <TableRow key={checklist.id}>
                  <TableCell className="font-medium text-brand-navy">
                    {checklist.number}
                  </TableCell>
                  <TableCell>{checklist.identification.os || "—"}</TableCell>
                  <TableCell>{checklist.identification.client || "—"}</TableCell>
                  <TableCell>{checklist.identification.brandModel || "—"}</TableCell>
                  <TableCell>
                    {formatChecklistDateTime(checklist.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={`/che/${checklist.id}`}
                      className={cn(
                        buttonVariants({ variant: "outline", size: "sm" }),
                        "h-8 gap-1.5"
                      )}
                    >
                      <Eye className="size-3.5" />
                      {cheListPageConfig.actions.view}
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

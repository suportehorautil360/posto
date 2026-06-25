export type ChecklistPrintPrefill = {
  os?: string;
  client?: string;
  brandModel?: string;
  platePrefix?: string;
  km?: string;
  hourMeter?: string;
  driver?: string;
  technicalResponsible?: string;
};

export type ChecklistDocumentType = "CHE" | "CHD";

export const checklistPrintConfig = {
  brand: {
    name: "Hora Útil 360",
    tagline: "Gestão de oficinas e checklists",
  },
  header: {
    documentType: "Documento",
    printedAt: "Data de impressão",
    workshop: "Oficina",
    serviceOrder: "Ordem de serviço",
  },
  actions: {
    print: "Baixar PDF",
    printNow: "Imprimir",
    downloadPdf: "Baixar PDF",
    downloadingPdf: "Gerando PDF...",
  },
  footerNote:
    "Formulário para preenchimento manual. Marque OK, A (anomalia) ou NA conforme indicado. Anexe fotos quando necessário.",
  statusColumns: {
    item: "Item verificado",
    ok: "OK",
    anomaly: "A",
    na: "NA",
    notes: "Observações",
  },
  photoBoxLabel: "Espaço para observações",
  signatureLabel: "Assinatura e carimbo",
  blankRows: 4,
  pdfFilenames: {
    CHE: "CHE-checklist-chegada.pdf",
    CHD: "CHD-checklist-devolucao.pdf",
  },
} as const;

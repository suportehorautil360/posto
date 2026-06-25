export type InvoiceStatus = "aprovada" | "pendente" | "rejeitada";

export type InvoiceCategory = "servico" | "peca" | "combustivel" | "outros";

export type InvoiceDocumentType = "nfe-55" | "nfce-65";

export type Invoice = {
  id: string;
  oficinaId: string;
  description: string;
  category: InvoiceCategory;
  documentType: InvoiceDocumentType;
  number: string;
  issuerName: string;
  issuedAt: string;
  accessKey: string;
  value: number;
  status: InvoiceStatus;
  fileName: string;
  fileUrl?: string;
  createdAt: string;
  parseCompleteness?: "completo" | "parcial";
};

export type InvoiceFilter = "todas" | "aprovadas" | "pendentes" | "rejeitadas";

export type InvoiceMonthStats = {
  totalValue: number;
  approvedValue: number;
  pendingCount: number;
};

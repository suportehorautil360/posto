import type {
  Orcamento,
  OrcamentoItem,
  OrcamentoItemCategory,
} from "../types/orcamento-api";

type RawRecord = Record<string, unknown>;

function asRecord(value: unknown): RawRecord | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  return value as RawRecord;
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function asString(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed || undefined;
}

function asNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number.parseFloat(value.replace(",", "."));
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
}

function pickString(record: RawRecord, keys: string[]) {
  for (const key of keys) {
    const value = asString(record[key]);
    if (value) return value;
  }

  return undefined;
}

function pickNumber(record: RawRecord, keys: string[]) {
  for (const key of keys) {
    const value = asNumber(record[key]);
    if (value != null) return value;
  }

  return undefined;
}

function normalizeCategory(value: unknown): OrcamentoItemCategory | undefined {
  const normalized = asString(value)?.toLowerCase();

  if (!normalized) {
    return undefined;
  }

  if (
    normalized === "part" ||
    normalized === "peca" ||
    normalized === "peça" ||
    normalized === "pecas" ||
    normalized === "peças"
  ) {
    return "part";
  }

  if (
    normalized === "service" ||
    normalized === "servico" ||
    normalized === "serviço" ||
    normalized === "servicos" ||
    normalized === "serviços" ||
    normalized === "mao_de_obra" ||
    normalized === "mão_de_obra"
  ) {
    return "service";
  }

  if (
    normalized === "travel" ||
    normalized === "deslocamento" ||
    normalized === "deslocamentos"
  ) {
    return "travel";
  }

  return undefined;
}

function inferCategoryFromDescription(
  description: string
): OrcamentoItemCategory | undefined {
  const normalized = description.trim().toLowerCase();

  if (normalized === "deslocamento") {
    return "travel";
  }

  if (normalized.startsWith("peça ") || normalized.startsWith("peca ")) {
    return "part";
  }

  if (normalized === "mão de obra" || normalized === "mao de obra") {
    return "service";
  }

  return undefined;
}

function mapRawItem(
  raw: unknown,
  fallbackCategory?: OrcamentoItemCategory
): OrcamentoItem | null {
  const record = asRecord(raw);
  if (!record) return null;

  const description =
    pickString(record, [
      "description",
      "descricao",
      "descrição",
      "nome",
      "label",
    ]) ?? "Item";

  const value =
    pickNumber(record, ["value", "valor", "valorTotal", "total", "amount"]) ??
    0;

  const category =
    normalizeCategory(record.category) ??
    normalizeCategory(record.categoria) ??
    normalizeCategory(record.tipo) ??
    normalizeCategory(record.type) ??
    fallbackCategory ??
    inferCategoryFromDescription(description);

  return {
    description,
    value,
    category,
    code: pickString(record, ["code", "codigo", "código", "cod"]),
    brand: pickString(record, ["brand", "marca"]),
    quantity: pickNumber(record, ["quantity", "quantidade", "qtd"]),
    unitValue: pickNumber(record, [
      "unitValue",
      "valorUnitario",
      "valorUnit",
      "valor_unitario",
    ]),
    hourType: pickString(record, ["hourType", "tipoHora", "tipo_hora"]),
    hours: pickNumber(record, ["hours", "horas", "hrs"]),
    hourlyRate: pickNumber(record, [
      "hourlyRate",
      "valorHora",
      "valorH",
      "valor_hora",
    ]),
    km: pickNumber(record, ["km", "quilometragem"]),
    valuePerKm: pickNumber(record, ["valuePerKm", "valorKm", "valor_km"]),
    travelHours: pickNumber(record, [
      "travelHours",
      "horasViagem",
      "hrsViagem",
      "horas_viagem",
    ]),
    travelHourlyRate: pickNumber(record, [
      "travelHourlyRate",
      "valorHr",
      "valorHrViagem",
      "valor_hr",
    ]),
    fees: pickNumber(record, ["fees", "taxas", "taxa"]),
  };
}

function mapRawPart(raw: unknown): OrcamentoItem | null {
  return mapRawItem(raw, "part");
}

function mapRawService(raw: unknown): OrcamentoItem | null {
  return mapRawItem(raw, "service");
}

function mapRawTravel(raw: unknown): OrcamentoItem | null {
  const record = asRecord(raw);

  if (!record) {
    return null;
  }

  const mapped = mapRawItem(
    {
      ...record,
      description:
        pickString(record, ["description", "descricao"]) ?? "Deslocamento",
    },
    "travel"
  );

  if (!mapped) {
    return null;
  }

  const value =
    mapped.value > 0
      ? mapped.value
      : (mapped.km ?? 0) * (mapped.valuePerKm ?? 0) +
        (mapped.travelHours ?? 0) * (mapped.travelHourlyRate ?? 0) +
        (mapped.fees ?? 0);

  return {
    ...mapped,
    value: Math.round(value * 100) / 100,
  };
}

export function normalizeOrcamentoItems(raw: unknown): OrcamentoItem[] {
  const record = asRecord(raw);
  if (!record) return [];

  const items: OrcamentoItem[] = [];

  for (const entry of asArray(record.items).concat(asArray(record.itens))) {
    const mapped = mapRawItem(entry);
    if (mapped) items.push(mapped);
  }

  for (const entry of asArray(record.pecas).concat(asArray(record.parts))) {
    const mapped = mapRawPart(entry);
    if (mapped) items.push(mapped);
  }

  for (const entry of asArray(record.servicos).concat(asArray(record.services))) {
    const mapped = mapRawService(entry);
    if (mapped) items.push(mapped);
  }

  const travelRaw = record.deslocamento ?? record.travel;
  if (travelRaw) {
    const mapped = mapRawTravel(travelRaw);
    if (mapped && mapped.value > 0) {
      items.push(mapped);
    }
  }

  return items;
}

export function normalizeOrcamento(raw: unknown): Orcamento | null {
  const record = asRecord(raw);
  if (!record) return null;

  const id =
    pickString(record, ["id", "_id", "orcamentoId", "ordemServicoId"]) ?? "";
  const solicitacaoOsId =
    pickString(record, [
      "solicitacaoOsId",
      "solicitacaoId",
      "solicitacao_os_id",
      "osId",
    ]) ?? id;

  if (!id && !solicitacaoOsId) {
    return null;
  }

  return {
    id: id || solicitacaoOsId,
    protocol:
      pickString(record, ["protocol", "protocolo", "code", "numero"]) ??
      solicitacaoOsId,
    solicitacaoOsId,
    oficinaId: pickString(record, ["oficinaId", "oficina_id"]) ?? "",
    valorTotal:
      pickNumber(record, ["valorTotal", "valor_total", "total", "value"]) ?? 0,
    prazoDias:
      pickNumber(record, ["prazoDias", "prazo_dias", "validadeDias"]) ?? 0,
    items: normalizeOrcamentoItems(record),
    equipamento: pickString(record, [
      "equipamento",
      "equipment",
      "machine",
      "modelo",
    ]),
    operador: pickString(record, ["operador", "cliente", "client", "customer"]),
    solicitacaoStatus: pickString(record, [
      "solicitacaoStatus",
      "status",
      "solicitacao_status",
    ]),
    createdAt: pickString(record, [
      "createdAt",
      "created_at",
      "criadoEm",
      "enviadoEm",
    ]),
  };
}

export function normalizeOrcamentosList(raw: unknown): Orcamento[] {
  if (Array.isArray(raw)) {
    return raw
      .map((entry) => normalizeOrcamento(entry))
      .filter((entry): entry is Orcamento => entry != null);
  }

  const record = asRecord(raw);
  if (!record) return [];

  const list = asArray(record.data).length
    ? asArray(record.data)
    : asArray(record.orcamentos);

  return list
    .map((entry) => normalizeOrcamento(entry))
    .filter((entry): entry is Orcamento => entry != null);
}

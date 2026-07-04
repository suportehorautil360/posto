import { describe, expect, it } from "vitest";
import {
  canCreateChecklistForOrder,
  orderHasOrcamentoAprovado,
} from "./order-checklist-action";
import type { ServiceOrder } from "../types/service-order";

function buildOrder(
  overrides: Partial<ServiceOrder> = {}
): ServiceOrder {
  return {
    id: "os-1",
    code: "OS-001",
    client: "Prefeitura",
    machine: "Retroescavadeira",
    openedAt: "01/07/2026",
    status: "em-pregao",
    quotedValue: 1500,
    tab: "pregao",
    source: "api",
    ...overrides,
  };
}

describe("order-checklist-action", () => {
  it("permite checklist quando o orçamento da oficina foi aprovado", () => {
    const order = buildOrder({
      status: "aprovada",
      tab: "resultado",
      resultado: {
        outcome: "won",
        approvedValue: 1500,
        approvedAt: "01/07/2026",
        yourBidValue: 1500,
      },
    });

    expect(orderHasOrcamentoAprovado(order)).toBe(true);
    expect(canCreateChecklistForOrder(order)).toBe(true);
  });

  it("bloqueia checklist quando a oficina só enviou orçamento", () => {
    const order = buildOrder({
      status: "em-pregao",
      tab: "pregao",
      quotedValue: 1500,
      ordemServicoId: "ord-1",
    });

    expect(orderHasOrcamentoAprovado(order)).toBe(false);
    expect(canCreateChecklistForOrder(order)).toBe(false);
  });

  it("bloqueia checklist quando a oficina perdeu o pregão", () => {
    const order = buildOrder({
      status: "nao-selecionada",
      tab: "resultado",
      quotedValue: 1500,
      resultado: {
        outcome: "lost",
        approvedValue: 1400,
        approvedAt: "01/07/2026",
        yourBidValue: 1500,
      },
    });

    expect(canCreateChecklistForOrder(order)).toBe(false);
  });
});

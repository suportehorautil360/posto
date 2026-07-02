import { describe, expect, it } from "vitest";
import { buildPregaoBids } from "./build-pregao-bids";
import type { SolicitacaoOs } from "../types/solicitacao-os";

const current = { id: "of-me", name: "Minha Oficina" };

const baseSolicitacao: SolicitacaoOs = {
  protocolo: "OS-1",
  prefeituraId: "pref-1",
  equipamento: "Fiat Uno",
  status: "pregao",
  oficinasIds: ["of-me", "of-a", "of-b", "of-c", "of-d"],
  lances: [
    { oficinaId: "of-me", valor: 5000, prazoDias: 5 },
    { oficinaId: "of-a", valor: 4800, prazoDias: 7 },
  ],
};

describe("buildPregaoBids", () => {
  it("lista todas as oficinas convidadas, não só as com lance", () => {
    const bids = buildPregaoBids(baseSolicitacao, current, 5000, 5);

    expect(bids).toHaveLength(5);
    expect(bids.filter((bid) => !bid.isCurrentUser)).toHaveLength(4);
  });

  it("marca convidados sem orçamento como aguardando", () => {
    const bids = buildPregaoBids(baseSolicitacao, current, 5000, 5);
    const pending = bids.filter(
      (bid) => !bid.isCurrentUser && bid.status === "pending"
    );

    expect(pending).toHaveLength(3);
  });

  it("usa lance quando a oficina já enviou orçamento", () => {
    const bids = buildPregaoBids(baseSolicitacao, current, 5000, 5);
    const competitorA = bids.find((bid) => bid.oficinaId === "of-a");

    expect(competitorA?.status).toBe("submitted");
    expect(competitorA?.value).toBe(4800);
  });
});

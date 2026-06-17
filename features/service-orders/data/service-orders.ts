import type { ServiceOrder } from "../types/service-order";

export const serviceOrders: ServiceOrder[] = [
  {
    id: "1",
    code: "OS-1042",
    client: "Construtora Alvorada",
    machine: "Escavadeira CAT 320",
    openedAt: "10/03/2026",
    status: "recebida",
    quotedValue: null,
    tab: "recebidas",
  },
  {
    id: "2",
    code: "OS-1038",
    client: "Mineração Vale Norte",
    machine: "Carregadeira 966H",
    openedAt: "08/03/2026",
    status: "em-andamento",
    quotedValue: 12400,
    tab: "recebidas",
  },
  {
    id: "3",
    code: "OS-1031",
    client: "Obras BR Sul",
    machine: "Retroescavadeira JCB",
    openedAt: "05/03/2026",
    status: "aguardando-peca",
    quotedValue: 8750,
    tab: "recebidas",
  },
  {
    id: "4",
    code: "OS-1029",
    client: "TransMinas Logística",
    machine: "Caminhão Fora de Estrada",
    openedAt: "04/03/2026",
    status: "em-pregao",
    quotedValue: 15600,
    tab: "pregao",
  },
  {
    id: "5",
    code: "OS-1024",
    client: "Agro Forte Máquinas",
    machine: "Trator John Deere 8320",
    openedAt: "02/03/2026",
    status: "em-pregao",
    quotedValue: 9200,
    tab: "pregao",
  },
];

export function getOrdersByTab(tab: ServiceOrder["tab"]) {
  return serviceOrders.filter((order) => order.tab === tab);
}

export function getTabCounts() {
  return {
    recebidas: getOrdersByTab("recebidas").length,
    pregao: getOrdersByTab("pregao").length,
  };
}

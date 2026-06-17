import type { Workshop } from "../types/workshop";

export const workshops: Workshop[] = [
  { id: "mecanica-pesada-sp", name: "MecânicaPesada SP" },
  { id: "mecanica-pesada-rj", name: "MecânicaPesada RJ" },
  { id: "mecanica-pesada-mg", name: "MecânicaPesada MG" },
];

export const defaultWorkshopId = workshops[0].id;

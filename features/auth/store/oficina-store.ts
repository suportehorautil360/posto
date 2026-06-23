"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Oficina } from "../types/oficina";

type OficinaStore = {
  oficina: Oficina | null;
  setOficina: (oficina: Oficina) => void;
  clearOficina: () => void;
};

export const useOficinaStore = create<OficinaStore>()(
  persist(
    (set) => ({
      oficina: null,
      setOficina: (oficina) => set({ oficina }),
      clearOficina: () => set({ oficina: null }),
    }),
    {
      name: "postoapp-oficina",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export function getSelectedOficina() {
  return useOficinaStore.getState().oficina;
}

export function getSelectedParceiroId() {
  const oficina = getSelectedOficina();

  if (!oficina) return null;

  return oficina.parceiroId ?? oficina.id;
}

export function getSelectedPrefeituraId() {
  return getSelectedOficina()?.prefeituraId ?? null;
}

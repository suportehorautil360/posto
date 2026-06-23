import {
  getSelectedOficina,
  getSelectedParceiroId,
  getSelectedPrefeituraId,
} from "@/features/auth/store/oficina-store";

export function getOficinaContextPayload() {
  const oficina = getSelectedOficina();

  if (!oficina?.id) {
    throw new Error("Nenhuma oficina selecionada.");
  }

  const parceiroId = getSelectedParceiroId();
  const prefeituraId = getSelectedPrefeituraId();

  return {
    oficinaId: oficina.id,
    ...(parceiroId ? { parceiroId } : {}),
    ...(prefeituraId ? { prefeituraId } : {}),
  };
}

export function appendOficinaContext(formData: FormData) {
  const oficina = getSelectedOficina();
  const parceiroId = getSelectedParceiroId();
  const prefeituraId = getSelectedPrefeituraId();

  if (oficina?.id) {
    formData.append("oficinaId", oficina.id);
  }

  if (parceiroId) {
    formData.append("parceiroId", parceiroId);
  }

  if (prefeituraId) {
    formData.append("prefeituraId", prefeituraId);
  }
}

export function getOficinaRequestHeaders(
  extraHeaders?: HeadersInit
): HeadersInit {
  const headers = new Headers(extraHeaders);
  const parceiroId = getSelectedParceiroId();
  const prefeituraId = getSelectedPrefeituraId();

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  if (parceiroId) {
    headers.set("X-Parceiro-Id", parceiroId);
  }

  if (prefeituraId) {
    headers.set("X-Prefeitura-Id", prefeituraId);
  }

  return headers;
}

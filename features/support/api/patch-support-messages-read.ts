import { apiConfig } from "@/shared/config/api";
import { getOficinaRequestHeaders } from "@/shared/lib/oficina-context";
import type { SupportChannel } from "../types/support";

export async function patchSupportMessagesRead(
  oficinaId: string,
  channel: SupportChannel
) {
  const response = await fetch(
    `${apiConfig.baseUrl}/suporte/oficina/${encodeURIComponent(oficinaId)}/mensagens/lidas`,
    {
      method: "PATCH",
      headers: getOficinaRequestHeaders({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({ channel }),
    }
  );

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as
      | { message?: string }
      | null;

    throw new Error(
      body?.message ?? `Erro ao marcar mensagens como lidas (${response.status})`
    );
  }
}

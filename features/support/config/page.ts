import { Banknote, Wrench } from "lucide-react";
import type { SupportChannel } from "../types/support";

export const supportPageConfig = {
  title: "Suporte",
  subtitle: "Fale com nossa equipe sobre pagamentos, notas ou problemas no sistema.",
  inputPlaceholder: "Escreva sua mensagem...",
  sendLabel: "Enviar",
  todayLabel: "Hoje",
  onlineLabel: "Online agora",
  states: {
    noOficina: "Selecione uma oficina para abrir o suporte.",
    loading: "Carregando mensagens...",
    sending: "Enviando...",
  },
} as const;

export const supportChannels: Record<
  SupportChannel,
  {
    label: string;
    subtitle: string;
    icon: typeof Banknote;
    welcomeMessage: string;
  }
> = {
  financeiro: {
    label: "Financeiro",
    subtitle: "Pagamentos, repasses e notas fiscais",
    icon: Banknote,
    welcomeMessage:
      "Olá! Aqui você tira dúvidas sobre repasses, notas fiscais e valores de OS. Como posso ajudar?",
  },
  ti: {
    label: "TI / Suporte",
    subtitle: "Problemas no sistema e acessos",
    icon: Wrench,
    welcomeMessage:
      "Suporte de TI na escuta. Se o sistema travar ou der erro, é só chamar.",
  },
};


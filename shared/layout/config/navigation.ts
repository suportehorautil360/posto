import {
  ClipboardList,
  FileSpreadsheet,
  Headset,
  History,
  LayoutDashboard,
  ReceiptText,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export type NavigationItem = {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
};

export const navigationItems: NavigationItem[] = [
  { id: "principal", label: "Principal", href: "/", icon: LayoutDashboard },
  { id: "orcamentos", label: "Orçamentos", href: "/orcamentos", icon: FileSpreadsheet },
  { id: "historico", label: "Histórico", href: "/historico", icon: History },
  { id: "notas-fiscais", label: "Notas Fiscais", href: "/notas-fiscais", icon: ReceiptText },
  { id: "che", label: "CHE", href: "/che", icon: Wrench },
  { id: "chd", label: "CHD", href: "/chd", icon: ClipboardList },
];

export const supportNavigationItem: NavigationItem = {
  id: "suporte",
  label: "Suporte",
  href: "/suporte",
  icon: Headset,
};

export const appShellConfig = {
  systemName: "Sistema de Orçamentos",
  systemShortName: "HU360",
  logoutLabel: "Sair",
} as const;

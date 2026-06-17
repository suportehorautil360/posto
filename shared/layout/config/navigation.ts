import {
  ClipboardList,
  FileSpreadsheet,
  LayoutDashboard,
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
  { id: "orcamentos", label: "Orçamentos", href: "#", icon: FileSpreadsheet },
  { id: "che", label: "CHE", href: "/che", icon: Wrench },
  { id: "chd", label: "CHD", href: "/chd", icon: ClipboardList },
];

export const appShellConfig = {
  systemName: "Sistema de Orçamentos",
  systemShortName: "HU360",
  workshopName: "MecânicaPesada SP",
  logoutLabel: "Sair",
} as const;

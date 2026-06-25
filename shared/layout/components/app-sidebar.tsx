"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Settings2, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useOficinaStore } from "@/features/auth/store/oficina-store";
import { appShellConfig, navigationItems, supportNavigationItem } from "../config/navigation";
import { useSupportUnreadCount } from "../hooks/use-support-unread-count";

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const oficina = useOficinaStore((state) => state.oficina);
  const clearOficina = useOficinaStore((state) => state.clearOficina);
  const supportUnreadCount = useSupportUnreadCount();

  function handleLogout() {
    clearOficina();
    router.push("/login");
  }

  return (
    <aside
      data-print-hide
      className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-white/10 bg-brand-navy text-white"
    >
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
        <div className="flex size-10 items-center justify-center rounded-xl bg-brand-orange shadow-sm">
          <Settings2 className="size-5 text-white" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold leading-tight">
            {appShellConfig.systemName}
          </p>
          <p className="text-xs text-white/55">{appShellConfig.systemShortName}</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        <p className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-white/40 uppercase">
          Menu
        </p>
        {navigationItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href ||
                pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-white/12 text-white shadow-sm ring-1 ring-white/10"
                  : "text-white/70 hover:bg-white/8 hover:text-white"
              )}
            >
              <span
                className={cn(
                  "flex size-8 items-center justify-center rounded-lg transition-colors",
                  isActive
                    ? "bg-brand-orange text-white"
                    : "bg-white/5 text-white/70 group-hover:bg-white/10 group-hover:text-white"
                )}
              >
                <Icon className="size-4" />
              </span>
              {item.label}
              {isActive ? (
                <span className="ml-auto size-1.5 rounded-full bg-brand-orange" />
              ) : null}
            </Link>
          );
        })}

        <div className="pt-4">
          <p className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-white/40 uppercase">
            Ajuda
          </p>
          {(() => {
            const item = supportNavigationItem;
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;

            return (
              <Link
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                  isActive
                    ? "bg-white/12 text-white shadow-sm ring-1 ring-white/10"
                    : "text-white/70 hover:bg-white/8 hover:text-white"
                )}
              >
                <span
                  className={cn(
                    "flex size-8 items-center justify-center rounded-lg transition-colors",
                    isActive
                      ? "bg-brand-orange text-white"
                      : "bg-white/5 text-white/70 group-hover:bg-white/10 group-hover:text-white"
                  )}
                >
                  <Icon className="size-4" />
                </span>
                {item.label}
                {supportUnreadCount > 0 && !isActive ? (
                  <span className="ml-auto inline-flex min-w-5 items-center justify-center rounded-full bg-brand-orange px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
                    {supportUnreadCount > 9 ? "9+" : supportUnreadCount}
                  </span>
                ) : isActive ? (
                  <span className="ml-auto size-1.5 rounded-full bg-brand-orange" />
                ) : null}
              </Link>
            );
          })()}
        </div>
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="mb-3 flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
          <div className="flex size-8 items-center justify-center rounded-full bg-white/10">
            <UserRound className="size-4 text-white/80" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs text-white/50">Oficina</p>
            <p className="truncate text-sm font-medium text-white/90">
              {oficina?.nome ?? "Não selecionada"}
            </p>
            {oficina?.cidadeUf ? (
              <p className="truncate text-xs text-white/45">{oficina.cidadeUf}</p>
            ) : null}
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-9 w-full border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
          onClick={handleLogout}
        >
          <LogOut className="size-4" />
          {appShellConfig.logoutLabel}
        </Button>
      </div>
    </aside>
  );
}

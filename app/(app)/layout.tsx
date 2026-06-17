import { AppShell } from "@/shared/layout";
import { AppProviders } from "@/shared/providers/app-providers";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppProviders>
      <AppShell>{children}</AppShell>
    </AppProviders>
  );
}

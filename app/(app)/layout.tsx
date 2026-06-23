import { AppShell } from "@/shared/layout";
import { AppProviders } from "@/shared/providers/app-providers";
import { AuthGuard } from "@/features/auth/components/auth-guard";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppProviders>
      <AuthGuard>
        <AppShell>{children}</AppShell>
      </AuthGuard>
    </AppProviders>
  );
}

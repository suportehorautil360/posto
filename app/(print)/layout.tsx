import { AppProviders } from "@/shared/providers/app-providers";
import { PrintStoreHydration } from "@/shared/components/checklist-print/print-store-hydration";

export default function PrintLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppProviders>
      <PrintStoreHydration>{children}</PrintStoreHydration>
    </AppProviders>
  );
}

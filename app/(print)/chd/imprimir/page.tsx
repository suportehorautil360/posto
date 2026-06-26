import { Suspense } from "react";
import { ChdPrintPage } from "@/features/chd/components/chd-print-page";

export default function ChdPrintRoutePage() {
  return (
    <Suspense fallback={null}>
      <ChdPrintPage />
    </Suspense>
  );
}

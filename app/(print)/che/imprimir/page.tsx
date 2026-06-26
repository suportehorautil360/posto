import { Suspense } from "react";
import { ChePrintPage } from "@/features/che/components/che-print-page";

export default function ChePrintRoutePage() {
  return (
    <Suspense fallback={null}>
      <ChePrintPage />
    </Suspense>
  );
}

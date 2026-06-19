import { Suspense } from "react";
import { NewQuotePage } from "@/features/quotes";

export default function NewQuoteRoutePage() {
  return (
    <Suspense fallback={null}>
      <NewQuotePage />
    </Suspense>
  );
}

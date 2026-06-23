import { Suspense } from "react";
import { ChePage } from "@/features/che";

export default function NewCheRoutePage() {
  return (
    <Suspense fallback={null}>
      <ChePage />
    </Suspense>
  );
}

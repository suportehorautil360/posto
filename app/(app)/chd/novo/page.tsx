import { Suspense } from "react";
import { ChdPage } from "@/features/chd";

export default function NewChdRoutePage() {
  return (
    <Suspense fallback={null}>
      <ChdPage />
    </Suspense>
  );
}

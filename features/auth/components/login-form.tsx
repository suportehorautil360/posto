"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SelectField } from "@/shared/ui/select-field";
import { loginConfig } from "../config/login";
import { defaultWorkshopId, workshops } from "../data/workshops";

export function LoginForm() {
  const router = useRouter();
  const [workshopId, setWorkshopId] = useState(defaultWorkshopId);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push("/");
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      <SelectField
        label={loginConfig.fieldLabel}
        value={workshopId}
        onChange={(event) => setWorkshopId(event.target.value)}
        options={workshops.map((workshop) => ({
          value: workshop.id,
          label: workshop.name,
        }))}
      />
      <Button
        type="submit"
        className="h-11 bg-brand-orange text-white hover:bg-brand-orange-hover"
      >
        {loginConfig.submitLabel}
      </Button>
    </form>
  );
}

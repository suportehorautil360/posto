"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SelectField } from "@/shared/ui/select-field";
import { getActiveOficinas, getOficinas } from "../api/get-oficinas";
import { loginConfig } from "../config/login";
import { useOficinaStore } from "../store/oficina-store";
import type { Oficina } from "../types/oficina";

export function LoginForm() {
  const router = useRouter();
  const setOficina = useOficinaStore((state) => state.setOficina);
  const savedOficina = useOficinaStore((state) => state.oficina);
  const [oficinas, setOficinas] = useState<Oficina[]>([]);
  const [workshopId, setWorkshopId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadOficinas() {
      setIsLoading(true);
      setError(null);

      try {
        const data = getActiveOficinas(await getOficinas());

        if (!isMounted) return;

        setOficinas(data);

        const preferredId = savedOficina?.id;
        const hasPreferred = preferredId
          ? data.some((oficina) => oficina.id === preferredId)
          : false;

        setWorkshopId(hasPreferred ? preferredId! : (data[0]?.id ?? ""));
      } catch {
        if (!isMounted) return;

        setOficinas([]);
        setWorkshopId("");
        setError(loginConfig.loadError);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadOficinas();

    return () => {
      isMounted = false;
    };
  }, [savedOficina?.id]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const selectedOficina = oficinas.find((oficina) => oficina.id === workshopId);

    if (!selectedOficina) return;

    setOficina(selectedOficina);
    router.push("/");
  }

  const selectOptions = isLoading
    ? [{ value: "", label: loginConfig.loadingLabel }]
    : oficinas.length > 0
      ? oficinas.map((oficina) => ({
          value: oficina.id,
          label: oficina.nome,
        }))
      : [{ value: "", label: loginConfig.emptyLabel }];

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      <SelectField
        label={loginConfig.fieldLabel}
        value={workshopId}
        onChange={(event) => setWorkshopId(event.target.value)}
        disabled={isLoading || oficinas.length === 0}
        options={selectOptions}
      />

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <Button
        type="submit"
        disabled={isLoading || !workshopId}
        className="h-11 bg-brand-orange text-white hover:bg-brand-orange-hover"
      >
        {loginConfig.submitLabel}
      </Button>
    </form>
  );
}

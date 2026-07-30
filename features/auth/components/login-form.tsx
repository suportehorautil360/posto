"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PasswordField } from "@/shared/ui/password-field";
import { TextField } from "@/shared/ui/text-field";
import { postLogin } from "../api/post-login";
import { loginConfig } from "../config/login";
import { getRememberedEmail, rememberEmail } from "../lib/remember-email";
import { useAuthStore } from "../store/auth-store";
import { useOficinaStore } from "../store/oficina-store";
import type { Oficina } from "../types/oficina";

const fieldClassName =
  "h-11 rounded-lg border-zinc-200 bg-white px-3.5 text-[15px] text-zinc-900 placeholder:text-zinc-400 focus-visible:border-orange-500 focus-visible:ring-orange-500/20";
const labelClassName = "text-sm font-semibold text-zinc-800";

function buildOficinaFallback(user: {
  name: string;
  oficinaId: string;
  prefeituraId: string;
}): Oficina {
  return {
    id: user.oficinaId,
    nome: user.name,
    razaoSocial: "",
    nomeFantasia: "",
    cnpj: "",
    cidadeUf: "",
    endereco: "",
    telefonePrincipal: "",
    emailComercial: "",
    especialidade: "",
    linhasAtuacao: [],
    categoriasServico: [],
    status: "Ativa",
    ativo: true,
    prefeituraId: user.prefeituraId || null,
    parceiroId: user.oficinaId || null,
    credenciadoEm: null,
    createdAt: null,
  };
}

export function LoginForm() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const setOficina = useOficinaStore((state) => state.setOficina);
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const remembered = getRememberedEmail();
    if (remembered) {
      setUsuario(remembered);
    }
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedUsuario = usuario.trim();
    if (!trimmedUsuario || !password) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await postLogin({ usuario: trimmedUsuario, password });

      if (trimmedUsuario.includes("@")) {
        rememberEmail(trimmedUsuario);
      }

      setSession(result.token, result.user);
      setOficina(
        result.oficina ??
          buildOficinaFallback({
            name: result.user.name,
            oficinaId: result.user.oficinaId,
            prefeituraId: result.user.prefeituraId,
          }),
      );
      router.push("/");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : loginConfig.invalidCredentials,
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      <TextField
        label={loginConfig.usuarioLabel}
        placeholder={loginConfig.usuarioPlaceholder}
        value={usuario}
        onChange={(event) => setUsuario(event.target.value)}
        autoComplete="username"
        disabled={isSubmitting}
        required
        labelClassName={labelClassName}
        className={fieldClassName}
      />

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <span className={labelClassName}>{loginConfig.passwordLabel}</span>
          <Link
            href="/esqueci-senha"
            className="text-sm font-medium text-orange-600 underline-offset-4 transition-colors hover:text-orange-700 hover:underline"
          >
            {loginConfig.forgotPasswordLabel}
          </Link>
        </div>
        <PasswordField
          label={loginConfig.passwordLabel}
          placeholder={loginConfig.passwordPlaceholder}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          disabled={isSubmitting}
          required
          labelClassName="sr-only"
          className={fieldClassName}
          toggleClassName="text-zinc-400 hover:text-zinc-600"
        />
      </div>

      {error ? (
        <p
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={isSubmitting || !usuario.trim() || !password}
        className="mt-1 h-11 rounded-lg bg-orange-600 text-[15px] font-semibold text-white hover:bg-orange-700"
      >
        {isSubmitting ? (
          loginConfig.loadingLabel
        ) : (
          <span className="inline-flex items-center gap-2">
            {loginConfig.submitLabel}
            <ArrowRight className="size-4 opacity-90" aria-hidden />
          </span>
        )}
      </Button>
    </form>
  );
}

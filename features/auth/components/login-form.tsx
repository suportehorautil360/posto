"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PasswordField } from "@/shared/ui/password-field";
import { TextField } from "@/shared/ui/text-field";
import { postLogin } from "../api/post-login";
import { loginConfig } from "../config/login";
import { getRememberedEmail, rememberEmail } from "../lib/remember-email";
import { useAuthStore } from "../store/auth-store";
import { useOficinaStore } from "../store/oficina-store";
import type { Oficina } from "../types/oficina";

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
          })
      );
      router.push("/");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : loginConfig.invalidCredentials
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
      />

      <PasswordField
        label={loginConfig.passwordLabel}
        placeholder={loginConfig.passwordPlaceholder}
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        autoComplete="current-password"
        disabled={isSubmitting}
        required
      />

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <Link
        href="/esqueci-senha"
        className="-mt-1 text-right text-sm font-medium text-brand-navy hover:underline"
      >
        Esqueceu a senha?
      </Link>

      <Button
        type="submit"
        disabled={isSubmitting || !usuario.trim() || !password}
        className="h-11 bg-brand-orange text-white hover:bg-brand-orange-hover"
      >
        {isSubmitting ? loginConfig.loadingLabel : loginConfig.submitLabel}
      </Button>
    </form>
  );
}

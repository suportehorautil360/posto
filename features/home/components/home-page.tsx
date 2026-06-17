import { appConfig } from "@/shared/config/app";
import { Container } from "@/shared/ui/container";

export function HomePage() {
  return (
    <Container className="flex min-h-[60vh] flex-col justify-center py-16">
      <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">
        {appConfig.name}
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        Gestão de postos, organizada por features
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
        Base limpa para evoluir o produto com módulos desacoplados — cada
        feature com seus componentes, lógica e contratos próprios.
      </p>
    </Container>
  );
}

import { QuoteDetailPage } from "@/features/quotes";

type QuoteDetailRoutePageProps = {
  params: Promise<{ id: string }>;
};

export default async function QuoteDetailRoutePage({
  params,
}: QuoteDetailRoutePageProps) {
  const { id } = await params;

  return <QuoteDetailPage orcamentoId={id} />;
}

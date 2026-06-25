import { HistoryDetailPage } from "@/features/history";

type HistoricoDetailRoutePageProps = {
  params: Promise<{ orderId: string }>;
};

export default async function HistoricoDetailRoutePage({
  params,
}: HistoricoDetailRoutePageProps) {
  const { orderId } = await params;

  return <HistoryDetailPage orderId={orderId} />;
}

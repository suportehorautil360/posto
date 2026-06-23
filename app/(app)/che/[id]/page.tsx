import { CheDetailPage } from "@/features/che";

type CheDetailRoutePageProps = {
  params: Promise<{ id: string }>;
};

export default async function CheDetailRoutePage({
  params,
}: CheDetailRoutePageProps) {
  const { id } = await params;

  return <CheDetailPage checklistId={id} />;
}

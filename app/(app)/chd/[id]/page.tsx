import { ChdDetailPage } from "@/features/chd";

type ChdDetailRoutePageProps = {
  params: Promise<{ id: string }>;
};

export default async function ChdDetailRoutePage({
  params,
}: ChdDetailRoutePageProps) {
  const { id } = await params;

  return <ChdDetailPage checklistId={id} />;
}

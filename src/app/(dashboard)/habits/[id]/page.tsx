import { getTranslations } from "next-intl/server";
import HabitDetail from "./HabitDetail";

export async function generateMetadata() {
  const t = await getTranslations("Metadata");
  return { title: t("habit") };
}

export default async function HabitPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <HabitDetail id={id} />;
}

import Statistics from "@/features/statistics/Statistics";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("Metadata");
  return { title: t("statistics") };
}

export default async function Page() {
  return <Statistics />;
}

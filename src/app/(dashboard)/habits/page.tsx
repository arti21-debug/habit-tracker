import Habits from "@/features/habits/Habits";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("Metadata");
  return { title: t("habits") };
}

export default async function Page() {
  return <Habits />;
}

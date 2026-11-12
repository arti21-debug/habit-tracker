import Dashboard from "@/features/dashboard/Dashboard";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("Metadata");
  return { title: t("dashboard") };
}

export default async function Page() {
  return <Dashboard/>;
}

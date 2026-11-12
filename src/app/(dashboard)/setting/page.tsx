import Setting from "@/features/setting/Setting";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("Metadata");
  return { title: t("setting") };
}

export default async function Page() {
  return <Setting />;
}

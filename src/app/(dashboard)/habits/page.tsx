import Habits from "@/features/habits/Habits";
import { getHabitsDehydratedState } from "@/lib/server/habitsState";
import { getTranslations } from "next-intl/server";
import { HydrationBoundary } from "@tanstack/react-query";

export async function generateMetadata() {
  const t = await getTranslations("Metadata");
  return { title: t("habits") };
}

export default async function Page() {
  const state = await getHabitsDehydratedState();

  return (
    <HydrationBoundary state={state}>
      <Habits />
    </HydrationBoundary>
  );
}

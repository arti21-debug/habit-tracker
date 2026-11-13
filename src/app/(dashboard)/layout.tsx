import Nav from "@/components/Nav";
import HeaderClient from "@/features/layout/HeaderClient";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { HabitProvider } from "./habits/context/HabitContext";
import Providers from "./_components/Providers";
import { Toaster } from "react-hot-toast";
import { getDisplayName } from "@/utils/getDisplayName";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // Защита роута: доступ только авторизованным пользователям
  if (error || !user) {
    redirect("/");
  }

  const username = getDisplayName(user);

  return (
    <Providers initialUser={user}>
      <HabitProvider>
        <Toaster position="bottom-right" />
        <div>
          <HeaderClient username={username} />
          <div className="flex">
            <Nav />
            <main className="flex-1">{children}</main>
          </div>
        </div>
      </HabitProvider>
    </Providers>
  );
}

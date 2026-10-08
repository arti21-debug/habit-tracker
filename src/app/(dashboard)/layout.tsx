import Nav from "@/components/Nav";
import HeaderClient from "@/features/layout/HeaderClient";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { HabitProvider } from "./habits/context/HabitContext";
import Providers from "./_components/Providers";

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

  const username = user.user_metadata?.username ?? "";

  return (
    <Providers>
      <HabitProvider>
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

import UpdatePassword from "@/features/auth/UpdatePassword";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function Page() {
  const supabase = await createClient();
  const cookieStore = await cookies();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  const isRecovery = cookieStore.get("password_recovery")?.value === "true";

  // // защита роута при ошибке получения юзера или невалид сессии или истекших куках
  if (error || !user || !isRecovery) {
    redirect("/");
  }

  return <UpdatePassword />;
}

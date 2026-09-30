import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

import Dashboard from "@/features/dashboard/Dashboard";

export default async function Page() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  
  // защита роута при ошибке получения юзера или невалид сессии
  if (error || !user) {
    redirect("/");
  }

  return <Dashboard />;
}

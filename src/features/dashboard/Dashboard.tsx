"use client";
import { createClient } from "@/lib/supabase/client";

export default function Dashboard() {
  const supabase = createClient();

  return (
    <button onClick={() => supabase.auth.signOut()}>Выйти</button>
  );
}
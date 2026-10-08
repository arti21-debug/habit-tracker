import { createClient } from "@/lib/supabase/server";
import HeaderClient from "./HeaderClient";

export default async function Header() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error(error);
  }

  // return <HeaderClient username={user?.user_metadata.username ?? ""} />;
}

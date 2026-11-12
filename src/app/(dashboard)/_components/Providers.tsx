"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { User } from "@supabase/supabase-js";
import { useState } from "react";

export default function Providers({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: User;
}) {
  const [queryClient] = useState(() => {
    const client = new QueryClient({
      // данные считаются свежими минуту: без перезапроса при каждой навигации и фокусе окна
      defaultOptions: { queries: { staleTime: 60_000 } },
    });
    // сервер уже проверил пользователя: хукам с ключом ["user"] запрос не нужен
    client.setQueryData(["user"], initialUser);
    return client;
  });

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
"use client";
import { getHabitById } from "@/lib/habits";
import { ServerHabit } from "@/types/data";
import { useQuery } from "@tanstack/react-query";

export default function HabitDetail({ id }: { id: string }) {
  const { data: habit, isLoading } = useQuery<ServerHabit>({
    queryKey: ["habits", id],
    queryFn: () => getHabitById(id),
  });

  return <div>{habit?.name}</div>
}
"use client";
import BurgNav from "@/components/BurgNav";
import { Bell, Activity } from "lucide-react";
import Link from "next/link";

type Props = {
  username: string;
};

export default function DashboardHeader({ username }: Props) {
  const usernameSliced = username
    .split(" ")
    .map((l) => l.slice(0, 1))
    .slice(0, 2)
    .join("");

  return (
    <header className="bg-surface w-full border border-border px-6.5">
      <div className="flex items-center min-h-25">
        {/* Лого внутри ghost — синхронно с nav по ширине */}
        <div className="w-[clamp(12.5rem,11.364rem+5.68vw,15.625rem)] max-[1055px]:w-50 shrink-0 flex items-center gap-6">
          <BurgNav />
          <div className="flex items-center gap-4">
            <div className="relative w-10 h-10 rounded-xl bg-primary max-[1024px]:w-9 max-[1024px]:h-9">
              <Activity
                color="#fff"
                className="absolute inset-0 m-auto max-[1024px]:w-5"
              />
            </div>
            <h1 className="font-bold text-xl max-[1024px]:text-lg">
              HabitFlow
            </h1>
          </div>
        </div>

        {/* Кнопки в зоне main */}
        <div className="flex-1 min-w-0 flex items-center justify-end gap-4">
          <button className="relative w-10 max-[1024px]:w-7 max-[1024px]:h-7">
            <Bell
              color="#b4b1b1"
              size={25}
              className="absolute inset-0 cursor-default m-auto max-[1024px]:w-5 max-[1024px]:h-5"
            />
          </button>
          <Link
            href="/setting"
            className="flex items-center justify-center w-12.5 h-12.5 rounded-full bg-primary max-[1024px]:w-10 max-[1024px]:h-10"
          >
            <div className="text-lg">{usernameSliced}</div>
          </Link>
        </div>
      </div>
    </header>
  );
}

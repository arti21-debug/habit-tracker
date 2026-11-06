"use client";
import {
  LayoutDashboard,
  CalendarCheck,
  ChartLine,
  Settings,
  LogOut,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import LogOutModal from "./LogoutModal";
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function Nav() {
  const [isExitModalActive, setIsExitModalActive] = useState(false);
  const pathname = usePathname();

  const t = useTranslations("Nav");

  return (
    <>
      <nav className="bg-surface w-[clamp(12.5rem,11.364rem+5.68vw,15.625rem)] pt-10 min-h-screen border-r border-border max-[960px]:hidden max-[1055px]:w-50">
        <div className="flex flex-col gap-10.5">
          <Link
            href="/dashboard"
            className={`relative flex items-center mx-4 py-2.5 px-4 ${pathname === "/dashboard" && "bg-surface-muted border border-border"} rounded-lg whitespace-nowrap gap-6.5 max-[1055px]:justify-center`}
          >
            <LayoutDashboard
              color="#ffffff"
              className="shrink-0 max-[1055px]:hidden"
            />
            <span className="max-[1024px]:text-sm">{t("dashboard")}</span>
          </Link>
          <Link
            href="/habits"
            className={`relative flex items-center mx-4 py-2.5 px-4 ${pathname === "/habits" && "bg-surface-muted border border-border"} rounded-lg whitespace-nowrap gap-6.5 max-[1055px]:justify-center`}
          >
            <CalendarCheck
              color="#ffffff"
              className="shrink-0 max-[1055px]:hidden"
            />
            <span className="max-[1024px]:text-sm">{t("habits")}</span>
          </Link>
          <Link
            href="/statistics"
            className={`relative flex items-center mx-4 py-2.5 px-4 ${pathname === "/statistics" && "bg-surface-muted border border-border"} rounded-lg whitespace-nowrap gap-6.5 max-[1055px]:justify-center`}
          >
            <ChartLine
              color="#ffffff"
              className="shrink-0 max-[1055px]:hidden"
            />
            <span className="max-[1024px]:text-sm">{t("statistics")}</span>
          </Link>
          <Link
            href="/setting"
            className={`relative flex items-center mx-4 py-2.5 px-4 ${pathname === "/setting" && "bg-surface-muted border border-border"} rounded-lg whitespace-nowrap gap-6.5 max-[1055px]:justify-center`}
          >
            <Settings
              color="#ffffff"
              className="shrink-0 max-[1055px]:hidden"
            />
            <span className="max-[1024px]:text-sm">{t("setting")}</span>
          </Link>
          <div className="w-full h-px border border-border"></div>
          <button
            onClick={() => setIsExitModalActive(true)}
            className={`relative flex items-center mx-4 py-2.5 px-4 ${pathname === "/logout" && "bg-surface-muted border border-border"} rounded-lg whitespace-nowrap gap-6.5 max-[1055px]:justify-center`}
          >
            <LogOut color="#ffffff" className="shrink-0 max-[1055px]:hidden" />
            <span className="max-[1024px]:text-sm">{t("log_out")}</span>
          </button>
        </div>
      </nav>
      <LogOutModal
        isExitModalActive={isExitModalActive}
        setIsExitModalActive={setIsExitModalActive}
      />
    </>
  );
}
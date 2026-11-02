"use client";
import { usePathname } from "next/navigation";
import DashboardHeader from "../dashboard/DashboardHeader";
import HabitsHeader from "../habits/HabitsHeader";
import SettingHeader from "../setting/SettingHeader";
import StatisticsHeader from "../statistics/StatisticsHeader";

type Props = {
  username: string;
};

export default function HeaderClient({ username }: Props) {
  const pathname = usePathname();

  return (
    <>
      {pathname === "/dashboard" && <DashboardHeader username={username} />}
      {pathname === "/habits" && <HabitsHeader />}
      {pathname === "/setting" && <SettingHeader />}
      {pathname === "/statistics" && <StatisticsHeader />}
    </>
  );
}

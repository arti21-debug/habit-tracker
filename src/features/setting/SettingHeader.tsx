import BurgNav from "@/components/BurgNav";
import { useTranslations } from "next-intl";

export default function SettingHeader() {
  const t = useTranslations("Setting");

  return (
    <header className="bg-surface w-full border border-border px-6.5">
      <div className="flex items-center gap-4 min-h-25">
        <BurgNav />
        <h1 className="font-bold text-xl max-[1024px]:text-lg">
          {t("setting")}
        </h1>
      </div>
    </header>
  );
}

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import LogOutModal from "./LogoutModal";
import { useTranslations } from "next-intl";

export default function BurgNav() {
  const [isBurgOpen, setIsBurgOpen] = useState(false);
  const [isExitModalActive, setIsExitModalActive] = useState(false);
  const burgRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isBurgOpen) return;

    const handeClickOutside = (e: MouseEvent) => {
      if (burgRef.current && !burgRef.current.contains(e.target as Node)) {
        setIsBurgOpen(false);
      }
    };

    document.addEventListener("mousedown", handeClickOutside);
    return () => document.removeEventListener("mousedown", handeClickOutside);
  }, [isBurgOpen]);

  const t = useTranslations("Nav");

  return (
    <>
      <div ref={burgRef} className="relative hidden max-[960px]:block">
        <button
          className="flex flex-col gap-1.5 p-2 cursor-pointer max-[400px]:gap-1"
          onClick={() => setIsBurgOpen((prev) => !prev)}
          aria-label={isBurgOpen ? "Close menu" : "Open menu"}
          aria-expanded={isBurgOpen}
        >
          <span
            className={`block h-0.5 w-5 bg-white max-[375px]:w-4 max-[400px]:h-[1.5px] transition-all duration-300 ease-in-out
      ${isBurgOpen ? "translate-y-2 rotate-45 max-[400px]:translate-y-1.5" : ""}`}
          />
          <span
            className={`block h-0.5 w-5 bg-white max-[375px]:w-4 max-[400px]:h-[1.5px] transition-all duration-300 ease-in-out
      ${isBurgOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block h-0.5 w-5 bg-white max-[375px]:w-4 max-[400px]:h-[1.5px] transition-all duration-300 ease-in-out
      ${isBurgOpen ? "-translate-y-2 -rotate-45 max-[400px]:-translate-y-1.5" : ""}`}
          />
        </button>
        {isBurgOpen && (
          <div className="flex flex-col items-center gap-3 mt-2 absolute z-50 w-40 py-5 rounded-md bg-[#6f7b8e] max-[480px]:w-35 max-[480px]:text-sm max-[480px]:gap-2 max-[480px]:py-3">
            <Link
              href="/dashboard"
              className="whitespace-nowrap text-[#B1B1B1]"
            >
              <button className="cursor-pointer font-base transition duration-300 hover:text-[#ddd8d8]">
                {t("dashboard")}
              </button>
            </Link>
            <Link href="/habits" className="whitespace-nowrap text-[#B1B1B1]">
              <button className="cursor-pointer font-base transition duration-300 hover:text-[#ddd8d8]">
                {t("habits")}
              </button>
            </Link>
            <Link
              href="/statistics"
              className="whitespace-nowrap text-[#B1B1B1]"
            >
              <button className="cursor-pointer font-base transition duration-300 hover:text-[#ddd8d8]">
                {t("statistics")}
              </button>
            </Link>
            <Link href="/setting" className="whitespace-nowrap text-[#B1B1B1]">
              <button className="cursor-pointer font-base transition duration-300 hover:text-[#ddd8d8]">
                {t("setting")}
              </button>
            </Link>
            <div className="whitespace-nowrap text-[#B1B1B1]">
              <button
                onClick={() => setIsExitModalActive(true)}
                className="cursor-pointer font-base transition duration-300 hover:text-[#ddd8d8]"
              >
                {t("log_out")}
              </button>
            </div>
          </div>
        )}
      </div>
      <LogOutModal
        isExitModalActive={isExitModalActive}
        setIsExitModalActive={setIsExitModalActive}
      />
    </>
  );
}
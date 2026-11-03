import BurgNav from "@/components/BurgNav";
import { useHabit } from "@/app/(dashboard)/habits/context/HabitContext";

export default function HabitsHeader() {
  const { setIsModalOpen } = useHabit();

  return (
    <header className="bg-surface w-full border border-border px-6.5">
      <div className="flex items-center justify-between min-h-25">
        <div className="w-[clamp(12.5rem,11.364rem+5.68vw,15.625rem)] max-[1055px]:w-50 shrink-0 flex items-center gap-6">
          <BurgNav />
          <h1 className="font-bold text-xl whitespace-nowrap max-[1024px]:text-lg">
            Мои привычки
          </h1>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-lg py-2.5 px-4 rounded-2xl border border-border bg-surface-muted transition duration-200 hover:bg-surface-hover max-[1024px]:text-base max-[540px]:text-sm max-[470px]:hidden"
        >
          + Добавить привычку
        </button>
        <button
          onClick={() => setIsModalOpen(true)}
          className="hidden text-xs py-1.5 px-3 rounded-2xl border border-border bg-surface-muted transition duration-200 hover:bg-surface-hover max-[470px]:block"
        >
          Добавить
        </button>
      </div>
    </header>
  );
}

"use client";
import { Camera, LogOut } from "lucide-react";

export default function Setting() {
  const inputClass =
    "w-full px-4 py-3 text-base rounded-lg outline-none transition-colors " +
    "bg-[var(--color-surface-muted)] text-[var(--color-text-primary)] " +
    "border border-[var(--color-border-hover)] focus:border-[var(--color-primary)]";

  return (
    <div className="min-h-screen bg-bg">

      <form className="px-6 py-8 max-w-3xl flex flex-col gap-6">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl bg-primary-light text-[#3C3489]">
              АК
            </div>
            <button
              type="button"
              aria-label="Изменить аватар"
              className="absolute bottom-0 right-0 w-6 h-6 rounded-full flex items-center justify-center bg-primary text-white border-2 border-bg"
            >
              <Camera size={12} />
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <div>
              <div className="text-sm font-medium text-text-primary">
                Алекс Клим
              </div>
              <div className="text-xs mt-0.5 text-text-muted">
                alex@example.com
              </div>
            </div>
            <button
              type="button"
              className="self-start px-4 py-2 rounded-lg text-xs text-text-primary bg-transparent border border-border-hover"
            >
              Загрузить фото
            </button>
          </div>
        </div>

        <div className="h-px bg-border" />

        {/* Fields */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-text-secondary">
              Имя пользователя
            </label>
            <input
              type="text"
              defaultValue="Алекс Клим"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-text-secondary">Email</label>
            <input
              type="email"
              defaultValue="alex@example.com"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-text-secondary">Новый пароль</label>
            <input
              type="password"
              defaultValue="12345678"
              className={inputClass}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="flex-1 py-3 text-sm rounded-lg text-text-primary bg-bg border border-border-hover"
          >
            Сохранить изменения
          </button>
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-3 text-sm rounded-lg text-danger bg-transparent border border-danger"
          >
            <LogOut size={14} />
            Выйти
          </button>
        </div>
      </form>
    </div>
  );
}

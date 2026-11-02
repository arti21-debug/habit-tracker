"use client";
import LogOutModal from "@/components/LogoutModal";
import useSetting from "@/hooks/setting/useSetting";
import useSettingForm from "@/hooks/setting/useSettingForm";
import { Camera, LogOut } from "lucide-react";
import { useRef, useState } from "react";

const inputClass =
  "w-full px-4 py-3 text-base rounded-lg outline-none transition-colors " +
  "bg-[var(--color-surface-muted)] text-[var(--color-text-primary)] " +
  "border border-[var(--color-border-hover)] focus:border-[var(--color-primary)]";

export default function Setting() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isExitModalActive, setIsExitModalActive] = useState(false);
  const { avatarUrl, usernameSliced, username, email, mutate, user } =
    useSetting();

  const {
    newUsername,
    newEmail,
    newPassword,
    mutateUserData,
    setNewUsername,
    setNewEmail,
    setNewPassword,
    hasChanges,
    isPending,
  } = useSettingForm(username, email);

  // у Google-пользователей пароля нет, им блок не показываем
  const canChangePassword = user?.app_metadata.provider === "email";

  return (
    <div className="min-h-screen bg-bg">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          mutateUserData({
            username: newUsername,
            email: newEmail,
            password: newPassword,
          });
        }}
        className="px-6 py-8 max-w-3xl flex flex-col gap-6"
      >
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl bg-primary-light text-[#3C3489]">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Аватар пользователя"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                usernameSliced
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
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
                {username}
              </div>
              <div className="text-xs mt-0.5 text-text-muted">{email}</div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;

                if (file) {
                  mutate(file);
                }
              }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
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
              onChange={(e) => setNewUsername(e.target.value)}
              type="text"
              value={newUsername}
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-text-secondary">Email</label>
            <input
              onChange={(e) => setNewEmail(e.target.value)}
              type="email"
              value={newEmail}
              className={inputClass}
            />
            {user?.new_email && (
              <p className="text-xs text-text-muted">
                Ожидает подтверждения: {user.new_email}. Откройте письма на
                обоих адресах.
              </p>
            )}
          </div>

          {canChangePassword && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-text-secondary">
                Новый пароль
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={8}
                autoComplete="new-password"
                placeholder="Оставьте пустым, чтобы не менять"
                className={inputClass}
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={!hasChanges || isPending || newUsername.trim() === ""}
            className="flex-1 py-3 text-sm rounded-lg text-text-primary bg-bg border border-border-hover disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Сохранить изменения
          </button>
          <button
            onClick={() => setIsExitModalActive(true)}
            type="button"
            className="flex items-center gap-2 px-4 py-3 text-sm rounded-lg text-danger bg-transparent border border-danger"
          >
            <LogOut size={14} />
            Выйти
          </button>
        </div>
      </form>
      <LogOutModal
        isExitModalActive={isExitModalActive}
        setIsExitModalActive={setIsExitModalActive}
      />
    </div>
  );
}

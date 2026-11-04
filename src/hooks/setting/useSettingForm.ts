"use client";
import { updateUserData } from "@/lib/profiles";
import { AuthError, isAuthError } from "@supabase/supabase-js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const errorMessages: Record<string, string> = {
  same_password: "Новый пароль должен отличаться от текущего",
  weak_password: "Пароль не соответствует требованиям",
  reauthentication_needed: "Войдите заново и повторите смену пароля",
  email_exists: "Этот email уже используется",
  over_email_send_rate_limit: "Слишком много писем. Попробуйте позже",
  over_request_rate_limit: "Слишком много попыток. Попробуйте позже",
};

export default function useSettingForm(
  username: string,
  email: string | undefined,
) {
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    if (username) setNewUsername(username);
    if (email) setNewEmail(email);
  }, [username, email]); // синхронизируем серверные данные с отображаемыми на форме

  // проверка на изменения value формы
  const hasChanges =
    newUsername.trim() !== username ||
    newEmail.trim() !== email ||
    newPassword !== "";

  const queryClient = useQueryClient();

  const t = useTranslations("Settings");
  const tErrors = useTranslations("Errors");

  // изменение данных юзера по форме
  const { mutate: mutateUserData, isPending } = useMutation({
    mutationFn: (data: { username: string; email: string; password: string }) =>
      updateUserData(data.username, data.email, data.password),

    onError: (error) => {
      const code = isAuthError(error) ? (error.code ?? "unknown") : "unknown";
      toast.error(tErrors.has(code) ? tErrors(code) : t("saveFailed"));
    },

    onSuccess: ({ usernameChanged, emailChanged, passwordChanged }) => {
      const messages: string[] = [];
      if (usernameChanged) messages.push(t("usernameUpdated"));
      if (passwordChanged) messages.push(t("passwordChanged"));
      if (emailChanged) {
        messages.push(t("checkEmail"));
      }

      if (messages.length) toast.success(messages.join(". "));
      else toast(t("noChanges"));

      if (passwordChanged) setNewPassword(""); // очищаем поле после смены
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  return {
    newUsername,
    newEmail,
    newPassword,
    mutateUserData,
    setNewUsername,
    setNewEmail,
    setNewPassword,
    hasChanges,
    isPending,
  };
}

"use client";
import { updateUserData } from "@/lib/profiles";
import { AuthError } from "@supabase/supabase-js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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

export default function useSettingForm(username: string, email: string | undefined) {
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

  // изменение данных юзера по форме
  const { mutate: mutateUserData, isPending } = useMutation({
    mutationFn: (data: { username: string; email: string; password: string }) =>
      updateUserData(data.username, data.email, data.password),

    onError: (error) => {
      const code = (error as AuthError).code ?? "";
      toast.error(
        errorMessages[code] ??
          "Не удалось сохранить изменения. Попробуйте позже",
      );
    },

    onSuccess: ({ usernameChanged, emailChanged, passwordChanged }) => {
      const messages: string[] = [];
      if (usernameChanged) messages.push("Имя обновлено");
      if (passwordChanged) messages.push("Пароль изменён");
      if (emailChanged) {
        messages.push("Проверьте почту для подтверждения нового email");
      }

      if (messages.length) toast.success(messages.join(". "));
      else toast("Нет изменений для сохранения");

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

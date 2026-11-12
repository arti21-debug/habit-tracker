"use client";
import { updateUserData } from "@/lib/profiles";
import { isAuthError } from "@supabase/supabase-js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useState } from "react";
import toast from "react-hot-toast";

export default function useSettingForm(
  username: string,
  email: string | undefined,
) {
  const [editedUsername, setNewUsername] = useState<string | null>(null);
  const [editedEmail, setNewEmail] = useState<string | null>(null)
  const [newPassword, setNewPassword] = useState("");

  const newUsername = editedUsername ?? username;
  const newEmail = editedEmail ?? email ?? "";

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

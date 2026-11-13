"use client";
import { getAvatar, getUser, uploadAvatar } from "@/lib/profiles";
import { getDisplayName } from "@/utils/getDisplayName";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";

export default function useSetting() {
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
  });

  const queryClient = useQueryClient();

  const t = useTranslations("Setting");

  // изменение аватара юзера
  const { mutate } = useMutation({
    mutationFn: (file: File) => uploadAvatar(user!.id, file),
    onError: () => {
      toast.error(t("avatar_upload_failed"));
    },
    onSuccess: () => {
      toast.success(t("avatar_upload_success"));
      queryClient.invalidateQueries({ queryKey: ["avatars", user?.id] });
    },
  });

  // получение аватара юзера
  const { data: avatarUrl } = useQuery({
    queryKey: ["avatars", user?.id],
    queryFn: () => getAvatar(user!.id),
    enabled: !!user?.id,
  });

  // получение данных юзера
  const email = user?.email;
  const username = getDisplayName(user);
  const usernameSliced = username
    ?.split(" ")
    .map((l: string) => l.slice(0, 1))
    .slice(0, 2)
    .join("");

  return {
    avatarUrl,
    usernameSliced,
    username,
    email,
    mutate,
    user,
  };
}

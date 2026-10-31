"use client";
import { getAvatar, getUser, uploadAvatar } from "@/lib/profiles";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function useSetting() {
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
  });

  const queryClient = useQueryClient();

  // изменение аватара юзера
  const { mutate } = useMutation({
    mutationFn: (file: File) => uploadAvatar(user!.id, file),
    onError: () => {
      toast.error("Аватар не удалось загрузить");
    },
    onSuccess: () => {
      toast.success("Аватар успешно загружен");
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
  const email = user?.user_metadata.email;
  const username = user?.user_metadata.username;
  const usernameSliced = username
    ?.split(" ")
    .map((l: string) => l.slice(0, 1))
    .slice(0, 2)
    .join("");

  return { avatarUrl, usernameSliced, username, email, mutate, };
}
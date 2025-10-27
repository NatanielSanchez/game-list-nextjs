import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Tables, TablesInsert } from "./supabase";
import { createUserGameAction, revalidatePathAction } from "./actions";
import { usePathname } from "next/navigation";

function useCreateUserGame(userId: number, gameId: number, revalidatePathUrl?: string) {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const {
    mutate: createUserGame,
    isPending: isCreatingUserGame,
    error,
  } = useMutation<Tables<"user_games">, Error, TablesInsert<"user_games">>({
    mutationFn: createUserGameAction,
    mutationKey: ["user_game", userId, gameId, "create"],
    onSuccess: (data) => {
      queryClient.setQueryData(["user_game", userId, data.gameId], data);
      if (revalidatePathUrl && revalidatePathUrl === pathname) revalidatePathAction(revalidatePathUrl);
    },
  });
  return { createUserGame, isCreatingUserGame, error };
}

export default useCreateUserGame;

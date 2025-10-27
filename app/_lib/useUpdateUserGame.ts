import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Tables, TablesUpdate } from "./supabase";
import { revalidatePathAction, updateUserGameAction } from "./actions";
import { usePathname } from "next/navigation";

function useUpdateUserGame(userId: number, gameId: number, revalidatePathUrl?: string) {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const {
    mutate: updateUserGame,
    isPending: isUpdatingGameState,
    error,
  } = useMutation<
    Tables<"user_games">, // type of data returned by mutation
    Error, // type of error thrown by mutation
    TablesUpdate<"user_games"> // params object needed by mutation
  >({
    mutationFn: updateUserGameAction,
    mutationKey: ["user_game", userId, gameId, "update"],
    onSuccess: (data) => {
      queryClient.setQueryData(["user_game", userId, data.gameId], data);
      if (revalidatePathUrl && revalidatePathUrl === pathname) revalidatePathAction(revalidatePathUrl);
    },
  });
  return { updateUserGame, isUpdatingGameState, error };
}

export default useUpdateUserGame;

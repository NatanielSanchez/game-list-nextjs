import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUserGameAction, revalidatePathAction } from "./actions";
import { usePathname } from "next/navigation";

function useDeleteUserGame(userId: number, gameId: number, revalidatePathUrl?: string) {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const {
    mutate: deleteUserGameByGameId,
    isPending: isDeletingGameByGameId,
    error,
  } = useMutation({
    mutationFn: deleteUserGameAction,
    mutationKey: ["user_game", userId, gameId, "delete"],
    onSuccess: (data) => {
      queryClient.setQueryData(["user_game", userId, data.gameId], null);
      if (revalidatePathUrl && revalidatePathUrl === pathname) revalidatePathAction(revalidatePathUrl);
    },
  });
  return { deleteUserGameByGameId, isDeletingGameByGameId, error };
}

export default useDeleteUserGame;

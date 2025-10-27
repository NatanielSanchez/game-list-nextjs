import { useQuery } from "@tanstack/react-query";
import { getUserGameByGameIdAction } from "./actions";

function useUserGame(userId: number, gameId: number) {
  const {
    data: userGame,
    isLoading: isFetchingGameState,
    error,
  } = useQuery({
    queryKey: ["user_game", userId, gameId],
    queryFn: () => getUserGameByGameIdAction(userId, gameId),
  });
  return { userGame, isFetchingGameState, error };
}

export default useUserGame;

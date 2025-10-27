import { useIsMutating } from "@tanstack/react-query";

/**
 * Track mutation states of CRUD operations for a specific game instance.
 * @param gameId The id of a specific game instance.
 * @returns true if data for this game is mutating, otherwise false.
 */
function useIsMutatingUserGame(userId: number, gameId: number) {
  return useIsMutating({ mutationKey: ["user_game", userId, gameId] }) > 0;
}

export default useIsMutatingUserGame;

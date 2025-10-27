import { unstable_cache } from "next/cache";
import { getUserGamesData } from "./apiGames";
import { supabase, type TablesInsert } from "./supabase";
import { isValidUserGameState } from "./types";

export async function getUserGamesIds(userId: number) {
  const { data, error } = await supabase.from("user_games").select("id").eq("userId", userId);
  if (error) throw new Error(error.message);
  return data;
}

export async function getUserGames(userId: number, page: number, name?: string, state?: string) {
  let query = supabase.from("user_games").select("gameId").eq("userId", userId);

  if (state) {
    if (!isValidUserGameState(state)) {
      console.error("getUserGames - Invalid user game state passed as filter for supabase call.");
      return { count: 0, games: [] };
    }
    query = query.eq("state", state);
  }

  const { data, error } = await query;
  if (error) {
    console.error(error.message);
    return { count: 0, games: [] };
  }

  const igdbData = await getUserGamesData(
    data.map((d) => d.gameId),
    page,
    name
  );
  return { games: igdbData.games, count: igdbData.count };
}

export async function getUserGameByGameId(userId: number, gameId: number) {
  const { data, error } = await supabase.from("user_games").select().match({ userId, gameId }).maybeSingle(); // maybeSingle doesnt throw if no data is found, returns null instead
  if (error) {
    console.error(error.message);
    return null;
  }
  return data;
}

export async function getUserGameStateByGameId(userId: number, gameId: number) {
  const { data, error } = await supabase.from("user_games").select("state").match({ userId, gameId }).maybeSingle();
  if (error) {
    console.error(error.message);
    return null;
  }
  return data;
}

export async function getUserByEmail(email: string) {
  const { data, error } = await supabase.from("users").select().eq("email", email).maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function createUser(user: TablesInsert<"users">) {
  const { error } = await supabase.from("users").insert([user]);
  if (error) {
    console.error(error.message);
  }
}

//// Cached UserGames queries
export const getCachedUserGames = unstable_cache(
  async (userId: number, page: number, name?: string, state?: string) => getUserGames(userId, page, name, state),
  [`user-games`],
  { tags: ["user-games"] }
);

export function getCachedUserGameByGameId(userId: number, gameId: number) {
  const cachedFn = unstable_cache(async () => getUserGameByGameId(userId, gameId), [`user-game-${gameId}`], {
    tags: [`user-game-${gameId}`],
  });

  return cachedFn();
}

export function getCachedUserGameStateByGameId(userId: number, gameId: number) {
  const cachedFn = unstable_cache(
    async () => getUserGameStateByGameId(userId, gameId),
    [`user-game-state-${userId}-${gameId}`],
    {
      tags: [`user-game-state-${gameId}`],
    }
  );

  return cachedFn();
}

// MAYBE CHANGE THIS ???
// export async function createUserGame(userGame: TablesInsert<"user_games">) {
//   const { data, error } = await supabase.from("user_games").insert([userGame]).select().single();
//   if (error) throw new Error(error.message);
//   return data;
// }

// export async function updateUserGame(gameId: number, userGame: TablesUpdate<"user_games">) {
//   const { data, error } = await supabase
//     .from("user_games")
//     .update(userGame)
//     .eq("gameId", userGame.gameId)
//     .select()
//     .single();
//   if (error) throw new Error(error.message);
//   return data;
// }

// export async function deleteUserGameByGameId(gameId: number) {
//   const { data, error } = await supabase.from("user_games").delete().eq("gameId", gameId).select().single();
//   if (error) throw new Error(error.message);
//   return data;
// }

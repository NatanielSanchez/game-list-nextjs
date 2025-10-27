"use server";

import { revalidatePath } from "next/cache";
import { getUserGamesIds } from "./apiUser";
import { auth, signIn, signOut } from "./auth";
import { supabase, TablesInsert, TablesUpdate, UserGameDB } from "./supabase";

export async function signInAction(ref?: string | null) {
  await signIn("google", { redirectTo: `${ref || "/games"}` });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

// Needs IGDB game id.
export async function getUserGameByGameIdAction(userId: number, gameId: number) {
  const { data, error } = await supabase.from("user_games").select().match({ userId, gameId }).maybeSingle();
  if (error) {
    throw new Error("Error while fetching user game: " + error.message);
  }
  return data;
}

export async function createUserGameAction(userGame: TablesInsert<"user_games">): Promise<UserGameDB> {
  const session = await auth();
  if (!session) throw new Error("createUserGameAction - Not authenticated!");

  const { data, error } = await supabase.from("user_games").insert(userGame).select().single();
  if (error) throw new Error("Error while creating new user game: " + error.message);

  return data;
}

export async function updateUserGameAction(userGame: TablesUpdate<"user_games">): Promise<UserGameDB> {
  const session = await auth();
  if (!session?.user.userId) throw new Error("updateUserGameAction - Not authenticated!");

  if (!userGame.id) throw new Error("updateUserGameAction - User game object missing game ID.");

  const userGames = await getUserGamesIds(session.user.userId);
  if (!userGames.some((g) => g.id === userGame.id))
    throw new Error(
      "updateUserGameAction - Not authorized to update user game: Record ID is invalid, or does not belong to user. Record ID: " +
        userGame.id
    );

  const { data, error } = await supabase.from("user_games").update(userGame).eq("id", userGame.id).select().single();
  if (error) throw new Error("Error while updating user game: " + error.message);

  return data;
}

// Needs SUPABASE row id (NOT THE SAME AS IGDB GAME ID).
export async function deleteUserGameAction(id: number): Promise<UserGameDB> {
  const session = await auth();
  if (!session?.user.userId) throw new Error("deleteUserGameAction - Not authenticated!");

  const userGames = await getUserGamesIds(session.user.userId);
  if (!userGames.some((g) => g.id === id))
    throw new Error(
      "deleteUserGameAction - Not authorized to update user game: Record ID " +
        id +
        " is invalid, or does not belong to user."
    );

  const { data, error } = await supabase.from("user_games").delete().eq("id", id).select().single();
  if (error) throw new Error("Error while deleting user game: " + error.message);

  return data;
}

export async function revalidatePathAction(path: string) {
  revalidatePath(path);
}

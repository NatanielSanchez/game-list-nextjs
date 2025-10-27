import { getCachedUserGameByGameId } from "../_lib/apiUser";
import { auth } from "../_lib/auth";
import UserListSelectClient from "./UserListSelectClient";

async function UserListSelect({
  gameId,
  menuPosition,
  fontSize,
}: {
  gameId: number;
  menuPosition: "auto" | "bottom" | "top";
  fontSize: string;
}) {
  const session = await auth();
  if (!session?.user.userId) return null;

  const userGame = await getCachedUserGameByGameId(session.user.userId, gameId);
  return (
    <UserListSelectClient
      userId={session.user.userId}
      gameId={gameId}
      userGame={userGame}
      menuPosition={menuPosition}
      fontSize={fontSize}
    />
  );
}

export default UserListSelect;

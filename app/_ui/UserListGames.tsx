import styles from "@/app/_styles/GameList.module.scss";
import { HoverableProvider } from "./Hoverable";
import Pagination from "./Pagination";
import GameCard from "./GameCard";
import { UserGamesPageFilters } from "../_lib/types";
import { getUserGames } from "../_lib/apiUser";
import Empty from "./Empty";

async function UserListGames({ filters, userId }: { filters: UserGamesPageFilters; userId: number }) {
  const { page, name, state } = filters;
  const { games, count } = await getUserGames(userId, page, name, state);
  if (!games || count === 0) return <Empty message="No games found." />;
  return (
    <>
      <HoverableProvider>
        <div className={styles.gameList}>
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </HoverableProvider>
      <Pagination resultCount={count} />
    </>
  );
}

export default UserListGames;

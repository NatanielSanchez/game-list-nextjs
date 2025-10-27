import styles from "@/app/_styles/GameList.module.scss";
import Pagination from "./Pagination";
import type { GamesPageFilters } from "../_lib/types";
import GameCard from "./GameCard";
import { HoverableProvider } from "./Hoverable";
import Empty from "./Empty";
import { getGames } from "../_lib/apiGames";

async function GameList({ filters }: { filters: GamesPageFilters }) {
  const games = await getGames(filters);
  if (games.games.length === 0) return <Empty message="No games found" />;

  return (
    <>
      <HoverableProvider>
        <div className={styles.gameList}>
          {games.games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </HoverableProvider>
      <Pagination resultCount={games.count} />
    </>
  );
}

export default GameList;

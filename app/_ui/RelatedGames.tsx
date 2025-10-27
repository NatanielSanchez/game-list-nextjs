import styles from "@/app/_styles/GameList.module.scss";
import type { GameListData } from "../_lib/types";
import GameCard from "./GameCard";

function RelatedGames({ games }: { games: GameListData[] }) {
  return (
    <div className={styles.gameList}>
      {games.map((g) => (
        <GameCard key={g.id} game={g} />
      ))}
    </div>
  );
}

export default RelatedGames;

import styles from "@/app/_styles/GameCard.module.scss";
import Image from "next/image";
import GameLink from "./GameLink";
import type { GameListData } from "../_lib/types";
import { getYearFromUnix } from "../_lib/dateHelpers";
import noCover from "@/public/no-cover.png";
import GameCardInteraction from "./GameCardInteraction";
import GameCardTooltip from "./GameCardTooltip";
import { Suspense } from "react";
import Spinner from "./Spinner";
import { DATA_URL_PLACEHOLDER } from "../_lib/env.server";

function GameCard({ game }: { game: GameListData }) {
  const { id, name, cover, first_release_date, type } = game;

  const nameWords = name.split(" ");
  let displayName = nameWords.length <= 4 ? name : nameWords.slice(0, 4).join(" ") + "...";
  if (displayName.length > 26) displayName = displayName.slice(0, 23).concat("...");

  return (
    <div className={styles.gameCard}>
      <GameCardInteraction
        gameId={id}
        tooltip={
          <Suspense fallback={<Spinner />}>
            <GameCardTooltip gameBasicInfo={game} />
          </Suspense>
        }
      >
        <div className={styles.cover}>
          <Image
            id={`game-${id}`}
            src={cover ? cover.url : noCover}
            alt="No cover image"
            placeholder={DATA_URL_PLACEHOLDER}
            quality={75}
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
          />
        </div>
      </GameCardInteraction>

      <GameLink title={game.name} href={`/games/${id}`}>
        {displayName}
      </GameLink>
      <div className={styles.spans}>
        <span>{first_release_date ? getYearFromUnix(first_release_date) : "Soon™"}</span>
        {type && <span>&bull; {type}</span>}
      </div>
    </div>
  );
}

export default GameCard;

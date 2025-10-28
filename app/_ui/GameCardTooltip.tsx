import styles from "@/app/_styles/GameCardTooltip.module.scss";
import Flexbox from "./Flexbox";
import Heading from "./Heading";
import GameLink from "./GameLink";
import { getDateFromUnix } from "../_lib/dateHelpers";
import Status from "./Status";
import { GameBasicInfo, isPrimaryGameType } from "../_lib/types";
import UserListSelectReactQuery from "./UserListSelectReactQuery";
import { auth } from "../_lib/auth";

async function GameCardTooltip({ gameBasicInfo }: { gameBasicInfo: GameBasicInfo }) {
  const session = await auth();

  const { id, name, first_release_date, developers, genres, platforms, status, summary, themes, type } = gameBasicInfo;

  const genresAndThemes =
    !genres || !themes
      ? "Unknown"
      : genres
          .map((genre) => genre.name)
          .concat(themes.map((theme) => theme.name))
          .join(", ");

  const words = summary ? summary.split(" ") : [];
  const truncatedSummary = words.length > 80 ? words.slice(0, 80).join(" ") + "..." : summary;

  return (
    <div className={styles.gameCardTooltip}>
      <Flexbox>
        <Heading as="h3">
          <GameLink href={`/games/${id}`}>{name}</GameLink>
        </Heading>
        {type && <div className={styles.gameType}>{type}</div>}
        {status && <Status status={status}>{status}</Status>}
      </Flexbox>

      <p>
        <span>Release date:</span> {first_release_date ? getDateFromUnix(first_release_date) : "Unknown"}
      </p>

      <p>
        <span>Platforms:</span> {platforms ? platforms.map((platform) => platform.name).join(", ") : "Unknown"}
      </p>

      <p>
        <span>Genres/Themes:</span> {genresAndThemes}
      </p>

      <p>
        <span>Developer/s:</span> {developers ? developers.map((d) => d.name).join(", ") : "Unknown"}
      </p>

      {summary && <div className={styles.gameSummary}>{truncatedSummary}</div>}
      {isPrimaryGameType(type) && session?.user.userId && (
        <UserListSelectReactQuery userId={session.user.userId} gameId={id} menuPosition="top" fontSize="1.2rem" />
      )}
    </div>
  );
}

export default GameCardTooltip;

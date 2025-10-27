import Image from "next/image";
import { Game, isPrimaryGameType } from "../_lib/types";
import noCover from "@/public/no-cover.png";
import styles from "@/app/_styles/Details.module.scss";
import Status from "./Status";
import GameTypeLink from "./GameTypeLink";
import Websites from "./Websites";
import { getDateFromUnix } from "../_lib/dateHelpers";
import InfoTag from "./InfoTag";
import Platforms from "./Platforms";
import GenresAndThemes from "./GenresAndThemes";
import Screenshots from "./Screenshots";
import Videos from "./Videos";
import { DATA_URL_PLACEHOLDER } from "../_lib/env.server";
import { auth } from "../_lib/auth";
import UserListSelectReactQuery from "./UserListSelectReactQuery";
import UserGameDetails from "./UserGameDetails";

async function Details({ game }: { game: Game }) {
  const session = await auth();
  const userId = session?.user.userId;
  const {
    id,
    name,
    cover,
    type,
    genres,
    themes,
    status,
    summary,
    parentGameId,
    versionParentId,
    first_release_date,
    franchises,
    developers,
    publishers,
    platforms,
    websites,
    screenshots,
    videos,
  } = game;

  return (
    <>
      <div className={styles.details}>
        <div className={styles.cover}>
          <Image
            id={`game-${id}`}
            src={cover ? cover.url : noCover}
            alt={cover ? `${name} cover art` : "No cover image"}
            placeholder={DATA_URL_PLACEHOLDER}
            fill
            sizes="(max-width: 768px) 100vw, 30vw"
            className={styles.cover}
          />
        </div>

        <div className={styles.gameInfo}>
          <div className={styles.infoGroup}>
            <h2 className={styles.title}>{name}</h2>
            <GameTypeLink type={type} parentGameId={parentGameId ? parentGameId : versionParentId} />
            {status && <Status status={status}>{status}</Status>}
            {isPrimaryGameType(type) && userId && (
              <div className={styles.selectorBox}>
                <UserListSelectReactQuery userId={userId} gameId={id} menuPosition="bottom" fontSize="2rem" />
              </div>
            )}
          </div>

          <Websites websites={websites} />

          <div className={styles.infoGroup}>
            {first_release_date && (
              <InfoTag>
                <span>First release date:</span> {getDateFromUnix(first_release_date)}
              </InfoTag>
            )}
            {franchises && (
              <InfoTag>
                <span>Franchises:</span> {franchises.map((f) => f.name).join(", ")}
              </InfoTag>
            )}
          </div>

          <Platforms platforms={platforms} />

          <GenresAndThemes genres={genres} themes={themes} />

          <div className={styles.infoGroup}>
            {developers && (
              <InfoTag>
                <span>Developers:</span> {developers.map((d) => d.name).join(", ")}
              </InfoTag>
            )}
            {publishers && (
              <InfoTag>
                <span>Publishers:</span> {publishers.map((p) => p.name).join(", ")}
              </InfoTag>
            )}
          </div>

          <p>{summary}</p>

          {isPrimaryGameType(type) && userId && <UserGameDetails userId={userId} gameId={id} />}
        </div>
      </div>
      {screenshots && <Screenshots screenshots={screenshots} />}
      {videos && <Videos videos={videos} />}
    </>
  );
}
export default Details;

import { HiOutlineExternalLink } from "react-icons/hi";
import styles from "@/app/_styles/GameTypeLink.module.scss";
import { GameType, isPrimaryGameType } from "../_lib/types";
import Link from "next/link";

function GameTypeLink({ type, parentGameId }: { type?: GameType; parentGameId?: number }) {
  if (!type) return null;

  const typeLink =
    !isPrimaryGameType(type) && parentGameId ? (
      <Link className={styles.linkToMainGame} href={`/games/${parentGameId}`} title="Go to main parent game">
        {type}
        <HiOutlineExternalLink />
      </Link>
    ) : (
      <p className={styles.type}>{type}</p>
    );

  return typeLink;
}

export default GameTypeLink;

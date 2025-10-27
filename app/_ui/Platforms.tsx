import { Fragment } from "react/jsx-runtime";
import { Platform } from "../_lib/types";
import GameLink from "./GameLink";
import InfoTag from "./InfoTag";

function Platforms({ platforms }: { platforms?: Platform[] }) {
  if (!platforms || platforms.length === 0) return null;

  const platformLinks = platforms.map((p, i) => (
    <Fragment key={p.id}>
      <GameLink href={`/games?platforms=${p.id}`} title={`Search for ${p.name} games`}>
        {p.name}
      </GameLink>
      {i !== platforms.length - 1 && " - "}
    </Fragment>
  ));

  return (
    <InfoTag>
      <span>Platforms:</span> {platformLinks}
    </InfoTag>
  );
}

export default Platforms;

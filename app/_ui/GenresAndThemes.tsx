import { Fragment } from "react/jsx-runtime";
import { Genre, Theme } from "../_lib/types";
import GameLink from "./GameLink";
import InfoTag from "./InfoTag";

function GenresAndThemes({ genres, themes }: { genres?: Genre[]; themes?: Theme[] }) {
  const genreLinks = genres
    ? genres.map((g) => (
        <GameLink key={g.id} href={`/games?genres=${g.id}`} title={`Search for ${g.name} games`}>
          {g.name}
        </GameLink>
      ))
    : [];
  const themeLinks = themes
    ? themes.map((t) => (
        <GameLink key={t.id} href={`/games?themes=${t.id}`} title={`Search for ${t.name} games`}>
          {t.name}
        </GameLink>
      ))
    : [];
  let genresAndThemes = genreLinks.concat(themeLinks);
  genresAndThemes = genresAndThemes.map((jsx, i) => (
    <Fragment key={i}>
      {jsx}
      {i !== genresAndThemes.length - 1 && " - "}
    </Fragment>
  ));

  if (genresAndThemes.length === 0) return null;
  else
    return (
      <InfoTag>
        <span>Genres/Themes:</span> {genresAndThemes}
      </InfoTag>
    );
}

export default GenresAndThemes;

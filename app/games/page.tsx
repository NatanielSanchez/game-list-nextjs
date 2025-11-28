import { Metadata } from "next";
import GameList from "../_ui/GameList";
import { GamesPageFilters, GamesPageParams } from "../_lib/types";
import Flexbox from "../_ui/Flexbox";
import Heading from "../_ui/Heading";
import { Suspense } from "react";
import SpinnerMini from "../_ui/SpinnerMini";
import GameListOperations from "../_ui/GameListOperations";
import Spinner from "../_ui/Spinner";

export const metadata: Metadata = {
  title: "Browse games",
};

export default async function Page({ searchParams }: { searchParams: Promise<GamesPageParams> }) {
  const filters = normalizeSearchParams(await searchParams);
  const key = [
    filters.page,
    filters.name ?? "",
    filters.sort ?? "",
    filters.releaseYear ?? "",
    filters.platforms.join(","),
    filters.genres.join(","),
    filters.themes.join(","),
  ].join("|");

  return (
    <>
      <Flexbox direction="horizontal">
        <Heading as="h1">Browse games</Heading>
        <Suspense fallback={<SpinnerMini />}>
          <GameListOperations />
        </Suspense>
      </Flexbox>
      <Suspense fallback={<Spinner />} key={key}>
        <GameList filters={filters} />
      </Suspense>
    </>
  );
}

function normalizeSearchParams(searchParams: GamesPageParams): GamesPageFilters {
  const platforms = searchParams.platforms;
  const genres = searchParams.genres;
  const themes = searchParams.themes;
  return {
    page: Number(searchParams.page) || 1,
    name: searchParams.name,
    platforms: platforms ? (Array.isArray(platforms) ? platforms : [platforms]) : [],
    genres: genres ? (Array.isArray(genres) ? genres : [genres]) : [],
    themes: themes ? (Array.isArray(themes) ? themes : [themes]) : [],
    sort: searchParams.sort,
    releaseYear: searchParams.release_year,
  };
}

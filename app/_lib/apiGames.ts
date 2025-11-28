import {
  COVER_IMG_1080p_URL,
  COVER_IMG_URL,
  GAME_DETAILS_FIELDS,
  GAME_LIST_FIELDS,
  IGDB_HEADERS,
  PAGE_SIZE,
} from "./env.server";
import { handleIGDBError } from "./IGDB-error";
import {
  type API_Game,
  type Game,
  type Video,
  type Website,
  getWebsiteImportance,
  API_GameListData,
  GameListData,
  GamesPageFilters,
} from "./types";

/** 
Gets a list of games for the main  Game Browser page.
By design, i filter the results by game type to exclude DLCs and fancy limited-time versions (version_parent), since that can go in the GameDetails page.
Uses the multiquery endpoint of IGDB to get the games and the result count of the query, for pagination.
*/
export async function getGames({
  page,
  name,
  platforms,
  genres,
  themes,
  releaseYear,
  sort,
}: GamesPageFilters): Promise<{ count: number; games: GameListData[] }> {
  const nameQuery = name ? `& name ~ *"${name}"*` : "";
  const platformsQuery = platforms.length !== 0 ? `& platforms = [${platforms.join()}]` : "";
  const genresQuery = genres.length !== 0 ? `& genres = [${genres.join()}]` : "";
  const themesQuery = themes.length !== 0 ? `& themes = [${themes.join()}]` : "";
  const releaseYearQuery = releaseYear ? getReleaseYearQuery(releaseYear) : "";
  const sortQuery = sort ? sort : "total_rating_count desc"; // sort by "popularity" by default

  const res = await fetch("https://api.igdb.com/v4/multiquery", {
    method: "POST",
    headers: IGDB_HEADERS,
    body: `
        query games/count "gameCount" {
          where 
            game_type.type = ("Main Game","Remake","Remaster") 
            & version_parent = null 
            ${nameQuery}
            ${platformsQuery}
            ${genresQuery}
            ${themesQuery}
            ${releaseYearQuery}
            ;
        };

        query games "games" {
	        fields ${GAME_LIST_FIELDS};

          where 
            game_type.type = ("Main Game","Remake","Remaster") 
            & version_parent = null 
            ${nameQuery}
            ${platformsQuery}
            ${genresQuery}
            ${themesQuery}
            ${releaseYearQuery}
            ;

          limit ${PAGE_SIZE};
          offset ${(page - 1) * PAGE_SIZE};
          sort ${sortQuery};
        };`,
  });

  if (!res.ok) {
    await handleIGDBError(res);
    return { count: 0, games: [] };
  }

  const [gameCount, apiGames] = (await res.json()) as GameListQueryResponse;

  const games: GameListData[] = await fixGameListData(apiGames.result);
  return { count: gameCount.count, games };
}

// Fetches A SINGLE GAME by id.
export async function getGameById(id: number): Promise<Game | null> {
  if (isNaN(id)) throw new Error("getGameById - Invalid parameter when expecting a number: " + id);

  const res = await fetch("https://api.igdb.com/v4/games", {
    method: "POST",
    headers: IGDB_HEADERS,
    body: `
	        fields ${GAME_DETAILS_FIELDS};
          where id = ${id};
          limit 1;
        `,
  });

  if (!res.ok) {
    await handleIGDBError(res);
    return null;
  }
  const games = (await res.json()) as API_Game[];

  const game = games[0]; // expecting one single result or nothing
  return game ? fixGameDetailsData(game) : null;
}

// Fetches MULTIPLE GAMES by ids, without the game type or version filters from the other method above.
export async function getGamesByIds(ids: number[] | undefined) {
  if (ids === undefined || ids.length === 0) return [];

  const res = await fetch("https://api.igdb.com/v4/games", {
    method: "POST",
    headers: IGDB_HEADERS,
    body: `
          fields ${GAME_LIST_FIELDS};
          where id = (${ids.join(",")});
          sort name asc;
          limit 500;
          `,
  });

  if (!res.ok) {
    await handleIGDBError(res);
    return [];
  }

  const apiGames = (await res.json()) as API_GameListData[];
  const games: GameListData[] = await fixGameListData(apiGames);
  return games;
}

// for the GameDetails metadata
export async function getGameNameById(id: number) {
  if (isNaN(id)) throw new Error("getGameNameById - Invalid parameter when expecting a number: " + id);

  const res = await fetch("https://api.igdb.com/v4/games", {
    method: "POST",
    headers: IGDB_HEADERS,
    body: `
	        fields name;
          where id = ${id};
          limit 1;
        `,
  });

  if (!res.ok) {
    await handleIGDBError(res);
    return "Unknown game";
  }

  const games = (await res.json()) as [{ id: number; name: string }];
  const game = games[0]; // expecting one single result or nothing
  return game ? game.name : "Unknown game";
}

// Gets multiple games with ids from the user list on supabase, with optional filters and pagination.
export async function getUserGamesData(ids: number[] | undefined, page: number, name?: string | null) {
  if (ids === undefined || ids.length === 0) return { count: 0, games: [] };

  const nameQuery = name ? `& name ~ *"${name}"*` : "";

  const res = await fetch("https://api.igdb.com/v4/multiquery", {
    method: "POST",
    headers: IGDB_HEADERS,
    body: `
        query games/count "gameCount" {
          where 
            id = (${ids.join(",")}) ${nameQuery};
        };

        query games "gamesByIds" {
	        fields ${GAME_LIST_FIELDS};
          where 
            id = (${ids.join(",")}) ${nameQuery};
            limit ${PAGE_SIZE};
            offset ${(page - 1) * PAGE_SIZE};
            sort name asc;
          };`,
  });

  if (!res.ok) {
    await handleIGDBError(res);
    return { count: 0, games: [] };
  }

  const [gameCount, apiGames] = (await res.json()) as GameListQueryResponse;

  const games: GameListData[] = await fixGameListData(apiGames.result);

  return { count: gameCount.count, games };
}

// the API isnt perfect so these methods help fixing the data a bit, for ease of use in the app
async function fixGameDetailsData(apiGame: API_Game): Promise<Game> {
  const { id, name, cover, first_release_date, genres, themes, platforms, franchises, summary, screenshots } = apiGame;

  const [dlcs, expansions, bundles, similarGames] = await Promise.all([
    getGamesByIds(apiGame.dlcs),
    getGamesByIds(apiGame.expansions),
    getGamesByIds(apiGame.bundles),
    getGamesByIds(apiGame.similar_games),
  ]);
  const developers = apiGame.involved_companies?.filter((c) => c.developer === true).map((c) => c.company);
  const publishers = apiGame.involved_companies?.filter((c) => c.publisher === true).map((c) => c.company);
  const videos: Video[] | undefined = apiGame.videos?.map((v) => {
    return { id: v.id, videoId: v.video_id };
  });

  const websites: Website[] | undefined = apiGame.websites?.map((w) => {
    return { id: w.id, name: w.type.type, url: w.url };
  });

  if (websites) websites.sort((a, b) => getWebsiteImportance(a.name) - getWebsiteImportance(b.name));

  return {
    ...{ id, name, first_release_date, genres, themes, platforms, franchises, summary, screenshots },
    cover: cover ? { url: `${COVER_IMG_1080p_URL}${cover.image_id}.jpg` } : undefined,
    developers: developers?.length === 0 ? undefined : developers,
    publishers: publishers?.length === 0 ? undefined : publishers,
    status: apiGame.game_status?.status,
    type: apiGame.game_type?.type,
    parentGameId: apiGame.parent_game,
    versionParentId: apiGame.version_parent,
    dlcs: dlcs.length === 0 ? undefined : dlcs,
    expansions: expansions.length === 0 ? undefined : expansions,
    bundles: bundles.length === 0 ? undefined : bundles,
    similarGames: similarGames.length === 0 ? undefined : similarGames,
    videos,
    websites,
  };
}

async function fixGameListData(apiGames: API_GameListData[]) {
  const fixedGames: GameListData[] = await Promise.all(
    apiGames.map(async (game): Promise<GameListData> => {
      const {
        id,
        name,
        cover,
        first_release_date,
        game_type,
        game_status,
        involved_companies,
        platforms,
        genres,
        themes,
        summary,
      } = game;
      const developers = involved_companies?.filter((c) => c.developer === true).map((c) => c.company);
      return {
        ...{ id, name, first_release_date, platforms, genres, themes, summary },
        type: game_type?.type,
        status: game_status?.status,
        developers,
        cover: cover ? { url: `${COVER_IMG_URL}${cover.image_id}.jpg` } : undefined,
      };
    })
  );

  return fixedGames;
}

function getReleaseYearQuery(releaseYear: string) {
  if (isNaN(Number(releaseYear))) throw new Error("Invalid release year filter.");
  return `& first_release_date >= ${Date.parse(`${releaseYear}-01-01T00:00:00Z`) / 1000} & first_release_date <= ${
    Date.parse(`${releaseYear}-12-31T23:59:59Z`) / 1000
  }`;
}

type GameListQueryResponse = [{ name: "gameCount"; count: number }, { name: "games"; result: API_GameListData[] }];

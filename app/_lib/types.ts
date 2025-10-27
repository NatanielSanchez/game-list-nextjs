// data for game card and tooltip
export type GameCard = {
  id: number;
  name: string;
  first_release_date?: number;
  cover?: Cover;
  type?: GameType;
};

// data returned by IGDB for game card
export type API_GameCard = {
  id: number;
  name: string;
  first_release_date?: number;
  cover?: Cover;
  game_type?: { id: number; type: GameType };
};

export type GameBasicInfo = {
  id: number;
  name: string;
  first_release_date?: number;
  genres?: Genre[];
  themes?: Theme[];
  developers?: Company[];
  platforms?: Platform[];
  status?: GameStatus["status"];
  type?: GameType;
  summary?: string;
};

export type API_GameBasicInfo = {
  id: number;
  name: string;
  first_release_date?: number;
  genres?: Genre[];
  themes?: Theme[];
  involved_companies?: InvoldedCompany[];
  platforms?: Platform[];
  game_status?: GameStatus;
  game_type?: { id: number; type: GameType };
  summary?: string;
};

// data for GameDetails page
export type Game = {
  id: number;
  name: string;
  first_release_date?: number;
  cover?: { url: string };
  genres?: Genre[];
  themes?: Theme[];
  developers?: Company[];
  publishers?: Company[];
  platforms?: Platform[];
  franchises?: Franchise[];
  status?: GameStatus["status"];
  type?: GameType;
  summary?: string;
  screenshots?: Screenshot[];
  videos?: Video[];
  websites?: Website[];
  parentGameId?: number;
  versionParentId?: number;
  dlcs?: GameListData[];
  expansions?: GameListData[];
  bundles?: GameListData[];
  similarGames?: GameListData[];
};

// data returned by IGDB for GameDetails
export type API_Game = {
  id: number;
  name: string;
  first_release_date?: number;
  cover?: Cover;
  genres?: Genre[];
  themes?: Theme[];
  involved_companies?: InvoldedCompany[];
  platforms?: Platform[];
  franchises?: Franchise[];
  game_status?: GameStatus;
  game_type?: { id: number; type: GameType };
  summary?: string;
  screenshots?: Screenshot[];
  videos?: { id: number; video_id: string }[];
  websites?: { id: number; url: string; type: { id: number; type: WebsiteName } }[];
  parent_game?: number; // if the game is a dlc or expansion, this is the parent game id
  version_parent?: number; // fallback if parent_game is undefined, even tho this might also be undefined
  dlcs?: number[]; // game ids
  expansions?: number[]; // game ids
  bundles?: number[]; // game ids
  similar_games?: number[]; // game ids
};

export type API_GameListData = {
  id: number;
  name: string;
  first_release_date?: number;
  cover?: Cover;
  genres?: Genre[];
  themes?: Theme[];
  involved_companies?: InvoldedCompany[];
  platforms?: Platform[];
  game_status?: GameStatus;
  game_type?: { id: number; type: GameType };
  summary?: string;
};

export type GameListData = {
  id: number;
  name: string;
  first_release_date?: number;
  cover?: { url: string };
  genres?: Genre[];
  themes?: Theme[];
  developers?: Company[];
  platforms?: Platform[];
  status?: GameStatus["status"];
  type?: GameType;
  summary?: string;
};

// All these types may look the same (id and name) but can contain more info from the IGDB api if needed later.
type Cover = {
  id: number;
  image_id: string;
};

export type Screenshot = {
  id: number;
  image_id: string;
};

export type Genre = {
  id: number;
  name: string;
};

export type Franchise = { id: number; name: string };

// InvolvedCompany can contain extra info about its relation with a game (like if it was its developer), hence the two similar types
type InvoldedCompany = {
  id: number;
  company: Company;
  developer: boolean;
  publisher: boolean;
};

type Company = { id: number; name: string };

export type Platform = {
  id: number;
  name: string;
  abbreviation?: string;
};

export type Theme = {
  id: number;
  name: string;
};

export type Video = {
  id: number;
  videoId: string; // Youtube video id
};

export type Website = {
  id: number;
  name: WebsiteName;
  url: string;
};

export type WebsiteName =
  | "Community Wiki"
  | "Twitch"
  | "Twitter"
  | "Wikipedia"
  | "Facebook"
  | "Google Play"
  | "Instagram"
  | "Subreddit"
  | "Official Website"
  | "YouTube"
  | "App Store (iPhone)"
  | "Itch"
  | "App Store (iPad)"
  | "Steam"
  | "Epic"
  | "GOG"
  | "Discord"
  | "Bluesky"
  | "Xbox"
  | "Playstation"
  | "Nintendo"
  | "Meta";

export type GameStatus = {
  id: number;
  status: "Released" | "Alpha" | "Beta" | "Early Access" | "Offline" | "Cancelled" | "Rumored" | "Delisted";
};

export type GameType =
  | "Bundle"
  | "DLC"
  | "Episode"
  | "Standalone Expansion"
  | "Mod"
  | "Remake"
  | "Port"
  | "Season"
  | "Fork"
  | "Update"
  | "Expanded Game"
  | "Pack / Addon"
  | "Remaster"
  | "Expansion"
  | "Main Game";

const PRIMARY_GAME_TYPES = ["Main Game", "Remaster", "Remake"] as const;
export type PrimaryGameType = (typeof PRIMARY_GAME_TYPES)[number];

export function isPrimaryGameType(gameType: GameType | undefined): gameType is PrimaryGameType {
  if (gameType === undefined) return false;
  return (PRIMARY_GAME_TYPES as readonly string[]).includes(gameType);
}

// gets a custom number to signify its importance/relevance, for sorting them
export function getWebsiteImportance(websiteName: WebsiteName): number {
  switch (websiteName) {
    case "Steam":
      return 1;
    case "Epic":
      return 2;
    case "GOG":
      return 3;
    case "Itch":
      return 4;
    case "Official Website":
      return 5;
    case "Playstation":
      return 6;
    case "Xbox":
      return 7;
    case "Nintendo":
      return 8;
    case "Google Play":
      return 9;
    case "App Store (iPhone)":
    case "App Store (iPad)":
      return 10;
    case "Community Wiki":
      return 11;
    case "Wikipedia":
      return 12;
    case "Twitch":
      return 13;
    case "YouTube":
      return 14;
    case "Twitter":
      return 15;
    case "Facebook":
      return 16;
    case "Instagram":
      return 17;
    case "Subreddit":
      return 18;
    case "Discord":
      return 19;
    case "Bluesky":
      return 20;
    case "Meta":
      return 21;
  }
}

const USER_GAME_STATES = ["Plan to play", "Completed", "Dropped"] as const;
export type UserGameState = (typeof USER_GAME_STATES)[number];

export function isValidUserGameState(state: string | undefined): state is UserGameState {
  if (state === undefined) return false;
  return (USER_GAME_STATES as readonly string[]).includes(state);
}

export type SortValues =
  | "total_rating_count desc"
  | "total_rating_count asc"
  | "name desc"
  | "name asc"
  | "first_release_date desc"
  | "first_release_date asc";

export type IGDB_400_error = [
  {
    title: string;
    cause?: string;
  }
];

export type GamesPageParams = {
  page?: string;
  name?: string;
  platforms?: string | string[];
  genres?: string | string[];
  themes?: string | string[];
  sort?: SortValues;
};

export type GamesPageFilters = {
  page: number;
  name?: string;
  platforms: string[];
  genres: string[];
  themes: string[];
  sort?: SortValues;
};

export type UserGamesPageParams = {
  page?: string;
  name?: string;
  state?: string;
};

export type UserGamesPageFilters = {
  page: number;
  name?: string;
  state?: string;
};

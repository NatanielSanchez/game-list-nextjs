declare namespace NodeJS {
  interface ProcessEnv {
    IGDB_CLIENT_ID: string;
    IGDB_API_AUTH: string;
    VITE_PAGE_SIZE: string;
    VITE_GAME_CARD_FIELDS: string;
    VITE_GAME_BASIC_FIELDS: string;
    VITE_GAME_DETAILS_FIELDS: string;
  }
}

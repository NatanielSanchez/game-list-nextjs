function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`env.server: Missing env var: ${name}`);
  return value;
}

export const IGDB_CLIENT_ID = getEnvVar("IGDB_CLIENT_ID");
export const IGDB_API_AUTH = getEnvVar("IGDB_API_AUTH");
export const SUPABASE_URL = getEnvVar("SUPABASE_URL");
export const SUPABASE_KEY = getEnvVar("SUPABASE_KEY");
export const PAGE_SIZE = Number(getEnvVar("NEXT_PUBLIC_PAGE_SIZE"));
export const GAME_CARD_FIELDS = getEnvVar("GAME_CARD_FIELDS");
export const GAME_BASIC_FIELDS = getEnvVar("GAME_BASIC_FIELDS");
export const GAME_LIST_FIELDS = getEnvVar("GAME_LIST_FIELDS");
export const GAME_DETAILS_FIELDS = getEnvVar("GAME_DETAILS_FIELDS");
export const COVER_IMG_URL = getEnvVar("NEXT_PUBLIC_COVER_IMG_URL");
export const COVER_IMG_1080p_URL = getEnvVar("NEXT_PUBLIC_COVER_IMG_1080p_URL");
export const DATA_URL_PLACEHOLDER =
  "data:image/svg+xml;base64,Cjxzdmcgd2lkdGg9IjcwMCIgaGVpZ2h0PSI0NzUiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImciPgogICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjMzMzIiBvZmZzZXQ9IjIwJSIgLz4KICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iIzIyMiIgb2Zmc2V0PSI1MCUiIC8+CiAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiMzMzMiIG9mZnNldD0iNzAlIiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjcwMCIgaGVpZ2h0PSI0NzUiIGZpbGw9IiMzMzMiIC8+CiAgPHJlY3QgaWQ9InIiIHdpZHRoPSI3MDAiIGhlaWdodD0iNDc1IiBmaWxsPSJ1cmwoI2cpIiAvPgogIDxhbmltYXRlIHhsaW5rOmhyZWY9IiNyIiBhdHRyaWJ1dGVOYW1lPSJ4IiBmcm9tPSItNzAwIiB0bz0iNzAwIiBkdXI9IjFzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgIC8+Cjwvc3ZnPg==";

export const IGDB_HEADERS = {
  "Client-ID": IGDB_CLIENT_ID,
  Authorization: IGDB_API_AUTH,
};

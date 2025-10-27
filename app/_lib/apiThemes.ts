import { IGDB_HEADERS } from "./env.server";
import { handleIGDBError } from "./IGDB-error";
import { Theme } from "./types";

export async function getThemes() {
  const res = await fetch("https://api.igdb.com/v4/themes", {
    method: "POST",
    headers: IGDB_HEADERS,
    body: `
          fields name;
          limit 500;
          `,
  });

  if (!res.ok) handleIGDBError(res);

  const themes = (await res.json()) as Theme[];
  return themes;
}

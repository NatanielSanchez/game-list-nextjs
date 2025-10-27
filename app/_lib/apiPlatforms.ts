import { IGDB_HEADERS } from "./env.server";
import { handleIGDBError } from "./IGDB-error";
import type { Platform } from "./types";

export async function getPlatforms() {
  const res = await fetch("https://api.igdb.com/v4/platforms", {
    method: "POST",
    headers: IGDB_HEADERS,
    body: `
          fields name,abbreviation;
          limit 500;
          sort name;
          `,
  });

  if (!res.ok) handleIGDBError(res);

  const platforms = (await res.json()) as Platform[];
  return platforms;
}

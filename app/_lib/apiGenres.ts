import { IGDB_HEADERS } from "./env.server";
import { handleIGDBError } from "./IGDB-error";
import { Genre } from "./types";

export async function getGenres() {
  const res = await fetch("https://api.igdb.com/v4/genres", {
    method: "POST",
    headers: IGDB_HEADERS,
    body: `
          fields name;
          limit 500;
          `,
  });

  if (!res.ok) handleIGDBError(res);

  const genres = (await res.json()) as Genre[];
  return genres;
}

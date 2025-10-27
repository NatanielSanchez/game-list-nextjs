import { IGDB_400_error } from "./types";

export async function handleIGDBError(res: Response) {
  let error: string = "";
  switch (res.status) {
    case 400:
      const resError = (await res.json()) as IGDB_400_error;
      error = res.statusText + ": " + resError[0].title + " - " + (resError[0].cause || "Check query!");
    case 401:
      error = res.statusText + ": Check headers of request.";
    case 429:
      error = res.statusText + ": Rate limit exceeded.";
    default:
      error = res.statusText + ": Something went catastrophically wrong!";
  }
  console.error(error);
}

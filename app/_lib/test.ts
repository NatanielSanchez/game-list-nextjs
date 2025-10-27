const IGDB_CLIENT_ID = process.env.IGDB_CLIENT_ID;
const IGDB_API_AUTH = process.env.IGDB_API_AUTH;

if (!IGDB_CLIENT_ID || !IGDB_API_AUTH) throw new Error("Envs not set!");

export async function testFetch() {
  const res = await await fetch("https://api.igdb.com/v4/games", {
    method: "POST",
    headers: {
      "Client-ID": IGDB_CLIENT_ID,
      Authorization: IGDB_API_AUTH,
    },
    body: `fields *;
where id = (117170) & name ~ *"stellar"*;
limit 500;`,
  });
  if (!res.ok) throw new Error("Error on TEST fetch");
  const data = await res.json();
  return data;
}

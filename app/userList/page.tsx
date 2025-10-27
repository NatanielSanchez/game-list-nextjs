import { Suspense } from "react";
import { auth } from "../_lib/auth";
import { UserGamesPageFilters, UserGamesPageParams } from "../_lib/types";
import Empty from "../_ui/Empty";
import Flexbox from "../_ui/Flexbox";
import Heading from "../_ui/Heading";
import UserListGames from "../_ui/UserListGames";
import UserListOperations from "../_ui/UserListOperations";
import Spinner from "../_ui/Spinner";
import { Metadata } from "next";

export const metadata: Metadata = { title: "User Games" };

export default async function Page({ searchParams }: { searchParams: Promise<UserGamesPageParams> }) {
  const session = await auth();
  if (!session || !session.user.userId) return <Empty message="No user logged in." />;

  const filters = normalizeSearchParams(await searchParams);
  const key = [filters.page, filters.name ?? "", filters.state ?? "All"].join("|");
  return (
    <>
      <Flexbox>
        <Heading as="h1">Your game list</Heading>
        <UserListOperations />
      </Flexbox>
      <Suspense fallback={<Spinner />} key={key}>
        <UserListGames filters={filters} userId={session.user.userId!} />
      </Suspense>
    </>
  );
}

function normalizeSearchParams(searchParams: UserGamesPageParams): UserGamesPageFilters {
  return {
    page: Number(searchParams.page) || 1,
    name: searchParams.name,
    state: searchParams.state === "All" ? undefined : searchParams.state,
  };
}

import { getGameById, getGameNameById } from "@/app/_lib/apiGames";
import Details from "@/app/_ui/Details";
import Flexbox from "@/app/_ui/Flexbox";
import Heading from "@/app/_ui/Heading";
import { HoverableProvider } from "@/app/_ui/Hoverable";
import RelatedGames from "@/app/_ui/RelatedGames";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ gameId: string }> }): Promise<Metadata> {
  const { gameId } = await params;
  if (isNaN(Number(gameId))) return { title: "Unknown game" };

  const gameName = await getGameNameById(Number(gameId));
  return { title: gameName };
}

export default async function Page({ params }: { params: Promise<{ gameId: string }> }) {
  const { gameId } = await params;
  if (isNaN(Number(gameId))) notFound();

  const game = await getGameById(Number(gameId));
  if (!game) notFound();

  const { dlcs, expansions, bundles } = game;

  return (
    <>
      <Flexbox>
        <Heading as="h1">Game Details</Heading>
      </Flexbox>
      <Details game={game} />

      <HoverableProvider>
        {(dlcs || expansions || bundles) && (
          <>
            <Flexbox>
              <Heading as="h2">DLC&apos;s, Expansions and Bundles</Heading>
            </Flexbox>
            <RelatedGames games={[...(dlcs || []), ...(expansions || []), ...(bundles || [])]} />
          </>
        )}
        {game.similarGames && (
          <>
            <Flexbox>
              <Heading as="h2">Similar Games</Heading>
            </Flexbox>
            <RelatedGames games={game.similarGames} />
          </>
        )}
      </HoverableProvider>
    </>
  );
}

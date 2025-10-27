"use client";

import { useRouter } from "next/navigation";
import { PropsWithChildren, ReactNode, useEffect } from "react";
import { useHoverable } from "./Hoverable";

function GameCardInteraction({ children, gameId, tooltip }: PropsWithChildren<{ gameId: number; tooltip: ReactNode }>) {
  const router = useRouter();
  const { showTooltip, hideTooltip } = useHoverable();

  useEffect(() => {
    return () => {
      hideTooltip();
    };
  }, [hideTooltip]);

  return (
    <div
      onClick={() => router.push(`/games/${gameId}`)}
      onMouseEnter={() => showTooltip(tooltip, `game-${gameId}`)}
      onMouseLeave={() => hideTooltip()}
    >
      {children}
    </div>
  );
}

export default GameCardInteraction;

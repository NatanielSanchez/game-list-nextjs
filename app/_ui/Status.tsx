import styles from "@/app/_styles/Status.module.scss";
import { PropsWithChildren } from "react";
import { GameStatus } from "../_lib/types";

function Status({ children, status }: PropsWithChildren<{ status: GameStatus["status"] }>) {
  const gameStatus: "not-available" | "early-access" | "released" = ["Offline", "Cancelled", "Delisted"].includes(
    status
  )
    ? "not-available"
    : ["Alpha", "Beta", "Rumored", "Early Access"].includes(status)
    ? "early-access"
    : "released";

  return <div className={`${styles.status} ${styles[gameStatus]}`}>{children}</div>;
}

export default Status;

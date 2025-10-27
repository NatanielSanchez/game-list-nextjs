import { ReactNode } from "react";
import styles from "@/app/_styles/Operations.module.scss";

function Operations({ children }: { children: ReactNode }) {
  return <div className={styles.operations}>{children}</div>;
}

export default Operations;

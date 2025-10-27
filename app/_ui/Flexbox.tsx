import styles from "@/app/_styles/Flexbox.module.scss";
import { PropsWithChildren } from "react";

function Flexbox({ children, direction }: PropsWithChildren<{ direction?: "horizontal" | "vertical" }>) {
  return <div className={`${styles.flexbox} ${styles[direction || "horizontal"]}`}>{children}</div>;
}

export default Flexbox;

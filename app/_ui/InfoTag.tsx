import { PropsWithChildren } from "react";
import styles from "@/app/_styles/InfoTag.module.scss";

function InfoTag({ children }: PropsWithChildren) {
  return <p className={styles.infoTag}>{children}</p>;
}

export default InfoTag;

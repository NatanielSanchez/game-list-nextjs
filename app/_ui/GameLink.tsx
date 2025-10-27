import styles from "@/app/_styles/GameLink.module.scss";
import Link, { LinkProps } from "next/link";
import { PropsWithChildren } from "react";

function GameLink({ children, title, ...rest }: PropsWithChildren<Omit<LinkProps, "className">> & { title?: string }) {
  return (
    <Link {...rest} title={title} className={styles.link}>
      {children}
    </Link>
  );
}

export default GameLink;

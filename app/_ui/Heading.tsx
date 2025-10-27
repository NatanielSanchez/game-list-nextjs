import { ComponentPropsWithoutRef, ReactNode } from "react";
import styles from "@/app/_styles/Heading.module.scss";

type HeadingLevel = "h1" | "h2" | "h3";

type HeadingProps<T extends HeadingLevel = "h1"> = {
  as?: T;
  children: ReactNode;
} & ComponentPropsWithoutRef<T>;

function Heading<T extends HeadingLevel = "h1">({ children, as, ...rest }: HeadingProps<T>) {
  const H = as ?? "h1";
  return (
    <H className={styles[as || "h1"]} {...rest}>
      {children}
    </H>
  );
}

export default Heading;

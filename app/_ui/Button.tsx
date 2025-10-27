"use client";
import { ComponentPropsWithRef, PropsWithChildren } from "react";
import styles from "@/app/_styles/Button.module.scss";

type ButtonProps = PropsWithChildren<
  {
    size?: "small" | "medium" | "large";
    variation?: "primary" | "secondary" | "danger";
  } & ComponentPropsWithRef<"button">
>;

function Button({ children, size = "medium", variation = "primary", ...rest }: ButtonProps) {
  return (
    <button className={`${styles.button} ${styles[size]} ${styles[variation]}`} {...rest}>
      {children}
    </button>
  );
}

export default Button;

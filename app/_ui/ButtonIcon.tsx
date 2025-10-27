"use client";

import styles from "@/app/_styles/ButtonIcon.module.scss";

type ButtonIconProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function ButtonIcon({ children, ...props }: ButtonIconProps) {
  return (
    <button className={styles.buttonIcon} {...props}>
      {children}
    </button>
  );
}

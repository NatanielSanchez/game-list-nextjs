import styles from "@/app/_styles/SpinnerMini.module.scss";
import { CSSProperties } from "react";
import { BiLoaderAlt } from "react-icons/bi";

function SpinnerMini({ className, style }: { className?: string; style?: CSSProperties }) {
  return <BiLoaderAlt className={`${styles.spinnerMini} ${className || ""}`} style={style} />;
}

export default SpinnerMini;

import styles from "@/app/_styles/Empty.module.scss";
import shrug from "@/public/Shrug.png";
import Image from "next/image";
import { ReactNode } from "react";

function Empty({ message }: { message: ReactNode }) {
  return (
    <div className={styles.notFound}>
      <div className={styles.image}>
        <Image src={shrug} alt="Shrugging M&M" fill={true} unoptimized />
      </div>
      <p className={styles.message}>{message}</p>
    </div>
  );
}

export default Empty;

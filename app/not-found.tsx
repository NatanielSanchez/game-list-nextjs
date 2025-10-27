import Image from "next/image";
import Link from "next/link";
import styles from "@/app/_styles/not-found.module.scss";

function NotFound() {
  return (
    <div className={styles.notFound}>
      <div className={styles.image}>
        <Image src="/searching.gif" alt="Searching..." fill={true} unoptimized />
      </div>
      <p className={styles.largeP}>Nope. Nothing here...</p>
      <p>Try navigating with the links on the top!</p>
      <Link href="/" className={styles.link}>
        Go home
      </Link>
    </div>
  );
}

export default NotFound;

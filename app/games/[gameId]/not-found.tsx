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
      <p>Try this website&apos;s game browser to find games!</p>
      <Link href="/games" className={styles.link}>
        Browse games
      </Link>
    </div>
  );
}

export default NotFound;

/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import styles from "@/app/_styles/error.module.scss";

function Error({ error }: { error: Error }) {
  return (
    <div className={styles.error}>
      <img src="/buhFlipExplode.gif" alt="App exploded!" />
      <p>The application has exploded!</p>
      <span>{error.message}</span>
      <Link href="/">Try to go home</Link>
    </div>
  );
}

export default Error;

"use client";

import { IoGameControllerOutline, IoLibraryOutline } from "react-icons/io5";
import styles from "@/app/_styles/NavLinks.module.scss";
import Link from "next/link";
import { usePathname } from "next/navigation";

function NavLinks() {
  const pathname = usePathname();

  return (
    <div className={styles.navLinks}>
      <Link href="/games" className={`${styles.navLink} ${pathname === "/games" ? styles.active : ""}`}>
        <IoGameControllerOutline />
        All Games
      </Link>
      <Link href="/userList" className={`${styles.navLink} ${pathname === "/userList" ? styles.active : ""}`}>
        <IoLibraryOutline />
        Your List
      </Link>
    </div>
  );
}
export default NavLinks;

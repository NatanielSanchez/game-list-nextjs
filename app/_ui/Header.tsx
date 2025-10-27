import styles from "@/app/_styles/Header.module.scss";
import NavLinks from "./NavLinks";
import DarkModeToggle from "./DarkModeToggle";
import Image from "next/image";
import logo from "@/public/logo.png";
import Session from "./Session";
import { Suspense } from "react";
import SpinnerMini from "./SpinnerMini";

function Header() {
  return (
    <div className={styles.header}>
      <div className={styles.logo}>
        <div className={styles.image}>
          <Image src={logo} alt="site logo" fill={true} sizes="5dvw" quality={75} />
        </div>
        The Game List
      </div>
      <NavLinks />
      <div className={styles.buttons}>
        <DarkModeToggle />
        <Suspense fallback={<SpinnerMini />}>
          <Session />
        </Suspense>
      </div>
    </div>
  );
}

export default Header;

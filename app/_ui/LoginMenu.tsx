import Image from "next/image";
import { signInAction } from "../_lib/actions";
import Heading from "./Heading";
import styles from "@/app/_styles/LoginMenu.module.scss";
import { usePathname } from "next/navigation";

function LoginMenu() {
  const pathname = usePathname();
  return (
    <form
      action={() => {
        signInAction(pathname);
      }}
      className={styles.login}
    >
      <Heading as="h3">Log in to track games in your personal list!</Heading>
      <Button />
    </form>
  );
}

export default LoginMenu;

function Button() {
  return (
    <button className={styles.button}>
      <Image src="https://authjs.dev/img/providers/google.svg" alt="Google logo" width={36} height={36} />
      Log in with Google
    </button>
  );
}

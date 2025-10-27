"use client";
import { HiLogin } from "react-icons/hi";
import styles from "@/app/_styles/LoginButton.module.scss";
import Modal from "./Modal";
import LoginMenu from "./LoginMenu";

function LoginButton() {
  return (
    <Modal>
      <Modal.Open
        opens="log-in"
        renderItem={(opens) => (
          <button className={styles.login} onClick={() => opens()}>
            <HiLogin /> Log In
          </button>
        )}
      />
      <Modal.Window name="log-in" renderItem={() => <LoginMenu />} />
    </Modal>
  );
}

export default LoginButton;

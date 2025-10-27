/* eslint-disable @next/next/no-img-element */
"use client";
import { DefaultSession } from "next-auth";
import { HiLogout, HiUserCircle } from "react-icons/hi";
import Popover from "./Popover";
import styles from "@/app/_styles/UserButton.module.scss";
import { signOutAction } from "../_lib/actions";
import toast from "react-hot-toast";
import { useEffect, useTransition } from "react";

function UserButton({ user }: { user: NonNullable<DefaultSession["user"]> }) {
  const [isPending, startTransition] = useTransition();
  useEffect(() => {
    toast.success(`Logged in as ${user.name}`);
  }, [user.name]);

  function handleLogout() {
    startTransition(async () => {
      await signOutAction();
    });
  }

  return (
    <Popover>
      <Popover.Toggle
        id="userButton"
        renderItem={(handleClick) => (
          <button onClick={handleClick} className={styles.userButton}>
            {user.image ? <img src={user.image} alt="User" referrerPolicy="no-referrer" /> : <HiUserCircle />}
          </button>
        )}
      />
      <Popover.Content id="userButton">
        <div className={styles.content}>
          <div className={styles.user}>
            <p className={styles.name}>{user.name}</p>
            <p className={styles.email}>{user.email}</p>
          </div>
          <button disabled={isPending} onClick={handleLogout}>
            {isPending ? (
              "Logging out..."
            ) : (
              <>
                <HiLogout /> Log Out
              </>
            )}
          </button>
        </div>
      </Popover.Content>
    </Popover>
  );
}

export default UserButton;

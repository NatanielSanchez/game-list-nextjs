"use client";

import { HiOutlineMoon, HiOutlineSun } from "react-icons/hi";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import ButtonIcon from "./ButtonIcon";
import SpinnerMini from "./SpinnerMini";

function DarkModeToggle() {
  const { setTheme, theme } = useTheme();
  const [isMounted, setIsMounted] = useState(false); // needed to avoid hydration mismatch, theme is not known on the server

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <ButtonIcon onClick={() => setTheme((theme) => (theme === "dark" ? "light" : "dark"))}>
      {!isMounted ? <SpinnerMini /> : theme === "dark" ? <HiOutlineSun /> : <HiOutlineMoon />}
    </ButtonIcon>
  );
}

export default DarkModeToggle;

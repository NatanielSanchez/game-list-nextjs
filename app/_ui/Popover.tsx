"use client";
import { createContext, Dispatch, PropsWithChildren, ReactNode, SetStateAction, useContext, useState } from "react";
import { useOutsideClick } from "../_hooks/useOutsideClick";
import { useKey } from "../_hooks/useKey";
import { createPortal } from "react-dom";
import useIsMounted from "../_hooks/useIsMounted";
import styles from "@/app/_styles/Popover.module.scss";
import { useTheme } from "next-themes";

type Position = { x: number; y: number };
type MenusState = { openMenuId: string; position: Position };
type MenusContextValue = MenusState & {
  open: (id: string) => void;
  close: () => void;
  setPosition: Dispatch<SetStateAction<Position>>;
};
const MenusContext = createContext<MenusContextValue | null>(null);

function Popover({ children }: { children: ReactNode }) {
  const isMounted = useIsMounted();

  const [openMenuId, setOpenMenuId] = useState("");
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const open = setOpenMenuId;
  const close = () => setOpenMenuId("");

  if (!isMounted) return null;
  return (
    <MenusContext.Provider value={{ openMenuId, open, close, position, setPosition }}>{children}</MenusContext.Provider>
  );
}

function Toggle({ id, renderItem }: { id: string; renderItem: (onClick: (e: React.MouseEvent) => void) => ReactNode }) {
  const { openMenuId, open, close, setPosition } = useMenus();

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation(); // cancels the outside click event, handle the opening and closing here
    // grab the closest button from the click origin and get its data, including its position
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({
      x: window.innerWidth - rect.width - rect.x,
      y: rect.y + rect.height + 8,
    });
    if (openMenuId === "" || openMenuId !== id) {
      open(id);
    } else {
      close();
    }
  }

  return <div>{renderItem(handleClick)}</div>;
}

function Content({ id, children }: PropsWithChildren<{ id: string }>) {
  const { theme } = useTheme();
  const { openMenuId, position, close } = useMenus();
  const ref = useOutsideClick<HTMLDivElement>(close, false); // close on bubbling phase
  useKey("escape", close);

  if (openMenuId !== id) return null;
  return createPortal(
    <div
      className={`${styles.content} ${styles[theme === "dark" ? "dark" : "light"]}`}
      ref={ref}
      style={{ right: `${position.x}px`, top: `${position.y}px` }}
    >
      {children}
    </div>,
    document.body
  );
}

Popover.Toggle = Toggle;
Popover.Content = Content;
export default Popover;

function useMenus() {
  const context = useContext(MenusContext);
  if (!context || context === null) throw new Error("MenusContext was accessed outside of provider.");
  return context;
}

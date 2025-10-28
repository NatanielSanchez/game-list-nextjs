"use client";
import { createContext, Dispatch, PropsWithChildren, ReactNode, SetStateAction, useContext, useState } from "react";
import { useOutsideClick } from "../_hooks/useOutsideClick";
import { useKey } from "../_hooks/useKey";
import { createPortal } from "react-dom";
import styles from "@/app/_styles/Popover.module.scss";

type Position = { x: number; y: number };
type MenusState = { openMenuId: string; position: Position };
type PopoverContextValue = MenusState & {
  open: (id: string) => void;
  close: () => void;
  setPosition: Dispatch<SetStateAction<Position>>;
};
const PopoverContext = createContext<PopoverContextValue | null>(null);

function Popover({ children }: { children: ReactNode }) {
  const [openMenuId, setOpenMenuId] = useState("");
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const open = setOpenMenuId;
  const close = () => setOpenMenuId("");

  return (
    <PopoverContext.Provider value={{ openMenuId, open, close, position, setPosition }}>
      {children}
    </PopoverContext.Provider>
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
  const { openMenuId, position, close } = useMenus();
  const ref = useOutsideClick<HTMLDivElement>(close, false); // close on bubbling phase
  useKey("escape", close);

  if (openMenuId !== id) return null;
  return createPortal(
    <div className={styles.content} ref={ref} style={{ right: `${position.x}px`, top: `${position.y}px` }}>
      {children}
    </div>,
    document.body
  );
}

Popover.Toggle = Toggle;
Popover.Content = Content;
export default Popover;

function useMenus() {
  const context = useContext(PopoverContext);
  if (!context || context === null) throw new Error("PopoverContext was accessed outside of provider.");
  return context;
}

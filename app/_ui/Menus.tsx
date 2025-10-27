import { createContext, Dispatch, PropsWithChildren, ReactNode, SetStateAction, useContext, useState } from "react";
import { createPortal } from "react-dom";
import { HiEllipsisVertical } from "react-icons/hi2";
import styled from "styled-components";
import { useOutsideClick } from "../_hooks/useOutsideClick";
import { useKey } from "../_hooks/useKey";

/*
- A Menu compound component that supports multiple toggleable lists of buttons.
- Only one list will be displayed at the time based on the current openMenuId state.
*/
type Position = { x: number; y: number } | null;
type MenusState = { openMenuId: string; position: Position };
type MenusContextValue = MenusState & {
  open: (id: string) => void;
  close: () => void;
  setPosition: Dispatch<SetStateAction<Position | null>>;
};
const MenusContext = createContext<MenusContextValue | null>(null);

function Menus({ children }: { children: ReactNode }) {
  const [openMenuId, setOpenMenuId] = useState("");
  const [position, setPosition] = useState<Position | null>(null);
  const open = setOpenMenuId;
  const close = () => setOpenMenuId("");
  return (
    <MenusContext.Provider value={{ openMenuId, open, close, position, setPosition }}>{children}</MenusContext.Provider>
  );
}

function Toggle({ id }: { id: string }) {
  const { openMenuId, open, close, setPosition } = useMenus();

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
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

  return (
    <StyledToggle onClick={handleClick}>
      <HiEllipsisVertical />
    </StyledToggle>
  );
}

function List({ id, children }: PropsWithChildren<{ id: string }>) {
  const { openMenuId, position, close } = useMenus();
  const ref = useOutsideClick(close, false); // close on bubbling phase
  useKey("escape", close);

  if (openMenuId !== id) return null;
  return createPortal(
    <StyledList position={position} ref={ref}>
      {children}
    </StyledList>,
    document.body
  );
}

function Button({ icon, onClick, children }: PropsWithChildren<{ icon: ReactNode; onClick?: () => void }>) {
  const { close } = useMenus();
  function handleClick() {
    onClick?.();
    close();
  }
  return (
    <li>
      <StyledButton onClick={handleClick}>
        {icon}
        <span>{children}</span>
      </StyledButton>
    </li>
  );
}

function Menu({ children }: { children: ReactNode }) {
  return <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>{children}</div>;
}

Menus.Menu = Menu;
Menus.Toggle = Toggle;
Menus.List = List;
Menus.Button = Button;

export default Menus;

function useMenus() {
  const context = useContext(MenusContext);
  if (!context || context === null) throw new Error("MenusContext was accessed outside of provider.");
  return context;
}

const StyledToggle = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-700);
  }
`;

const StyledList = styled.ul`
  position: fixed;

  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-md);
  border-radius: var(--border-radius-md);

  right: ${(props) => props.position.x}px;
  top: ${(props) => props.position.y}px;
`;

const StyledButton = styled.button`
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 1rem 1.5rem;
  font-size: 1.4rem;
  transition: all 0.2s;

  display: flex;
  align-items: center;
  gap: 1.6rem;

  &:hover {
    background-color: var(--color-grey-50);
  }

  & svg {
    width: 2rem;
    height: 2rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }
`;

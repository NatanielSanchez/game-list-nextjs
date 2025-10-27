"use client";

import { createContext, useContext, useState, type PropsWithChildren, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { HiXMark } from "react-icons/hi2";
import { useOutsideClick } from "../_hooks/useOutsideClick";
import { useKey } from "../_hooks/useKey";
import useIsMounted from "../_hooks/useIsMounted";
import styles from "@/app/_styles/Modal.module.scss";

type ModalContextValue = {
  openName: string;
  open: React.Dispatch<React.SetStateAction<string>>;
  close: () => void;
};

type OpenProps = {
  opens: string;
  renderItem: (open: () => void) => ReactNode;
};

type WindowProps = {
  name: string;
  renderItem: (onCloseModal: () => void) => ReactNode;
};

/*
-A Modal component that supports multiple modal windows based on their given name.
-Only one modal window will be displayed at the time based on the current openName state.
*/
const ModalContext = createContext<ModalContextValue | null>(null);
function Modal({ children }: PropsWithChildren) {
  const [openName, setOpenName] = useState("");
  const isMounted = useIsMounted();
  const open = setOpenName;
  const close = () => setOpenName("");

  if (!isMounted) return null;
  return <ModalContext.Provider value={{ openName, open, close }}>{children}</ModalContext.Provider>;
}

function Open({ opens: opensWindowName, renderItem }: OpenProps) {
  const { open } = useModal();
  return renderItem(() => open(opensWindowName));
}

function Window({ name, renderItem }: WindowProps) {
  const { openName, close } = useModal();
  const ref = useOutsideClick<HTMLDivElement>(close);
  useKey("escape", close);

  if (name === openName)
    return createPortal(
      <div className={styles.overlay}>
        <div className={styles.modal} ref={ref}>
          <button className={styles.button} onClick={close}>
            <HiXMark />
          </button>
          {renderItem(close)}
        </div>
      </div>,
      document.body
    );
  else return null;
}

export function useModal() {
  const context = useContext(ModalContext);
  if (context === null) throw new Error("ModalContext was accessed outside its provider!");
  else return context;
}

Modal.Open = Open;
Modal.Window = Window;
export default Modal;

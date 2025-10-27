"use client";

import { useTheme } from "next-themes";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PropsWithChildren,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import styles from "@/app/_styles/Hoverable.module.scss";

type Position = { x: number; y: number };
type TooltipState = {
  elementId: string; // dom id of hoverable element
  content: ReactNode; // content to show on tooltip
  position: Position; // position of the tooltip box
};
type HoverableContextType = {
  showTooltip: (tooltipContent: ReactNode, elementId: string) => void;
  hideTooltip: () => void;
};

const HoverableContext = createContext<HoverableContextType | undefined>(undefined);

export function HoverableProvider({ children }: PropsWithChildren) {
  const { theme } = useTheme();
  const [isMounted, setIsMounted] = useState(false); // needed to avoid hydration mismatch, theme is not known on the server

  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const currentHoverIdRef = useRef<string | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  // TS is weird, what you mean setTimeout it doesnt return a number anymore?
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const isVisible = tooltip && isHovering;

  const showTooltip = useCallback((tooltipContent: ReactNode, elementId: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    currentHoverIdRef.current = elementId;

    timerRef.current = setTimeout(() => {
      // skip if mouse has already moved to a different element
      //if (currentHoverIdRef.current !== elementId) return;

      const el = document.getElementById(elementId);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const position = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };

      setTooltip({ elementId, content: tooltipContent, position });
      setIsHovering(true);
    }, 500);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const hideTooltip = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    currentHoverIdRef.current = null;
    setIsHovering(false);
  }, []);

  useLayoutEffect(() => {
    if (!tooltip || !tooltip.elementId) return;

    function updatePosition() {
      const el = document.getElementById(tooltip!.elementId);
      if (!el || !tooltipRef.current) return;

      const elementRect = el.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();

      let x = elementRect.left + elementRect.width / 2;
      let y = elementRect.top + elementRect.height / 2;

      if (x + tooltipRect.width > window.innerWidth) {
        x -= tooltipRect.width;
      }
      if (y + tooltipRect.height > window.innerHeight) {
        y -= tooltipRect.height;
      }

      const position = { x, y };

      setTooltip((prev) => {
        if (!prev) return null;

        const samePos = prev.position.x === position.x && prev.position.y === position.y;
        if (samePos) return prev;

        return { ...prev, position };
      });
    }

    updatePosition(); // run once immediately

    // for dynamic content, like fetched content
    const resizeObserver = new ResizeObserver(() => {
      updatePosition();
    });

    if (tooltipRef.current) resizeObserver.observe(tooltipRef.current);

    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [tooltip]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <HoverableContext.Provider value={{ showTooltip, hideTooltip }}>
      {children}
      {isVisible &&
        createPortal(
          <div
            ref={tooltipRef}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className={`${styles.hoverable} ${theme === "dark" ? styles.dark : styles.light}`}
            style={{
              left: `${tooltip.position.x}px`,
              top: `${tooltip.position.y}px`,
            }}
          >
            {tooltip.content}
          </div>,
          document.getElementById("hoverTooltip")!
        )}
    </HoverableContext.Provider>
  );
}

export function useHoverable() {
  const context = useContext(HoverableContext);
  if (!context) throw new Error("HoverableContext was used outside of its Provider!");
  return context;
}

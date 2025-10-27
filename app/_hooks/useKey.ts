import type { KeyboardEventKey } from "keyboard-event-key-type";
import { useEffect } from "react";

// execute the callback when a key is pressed
export function useKey<F extends (...args: unknown[]) => unknown>(key: KeyboardEventKey, callback: F) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key.toLowerCase() === key.toLowerCase()) callback?.();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [key, callback]);
}

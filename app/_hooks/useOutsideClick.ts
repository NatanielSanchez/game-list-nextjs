import { useEffect, useRef } from "react";

/** 
Gives you a ref to mark an element so that whenever a click happens OUTSIDE of that element it will execute the handler function.
Expects a T typed parameter for the element that will receive the ref.

Can specify wheter to listen for the event on the bubbling or capturing phase.

listenCapturing is the third optional argument of addEventListener(): A boolean value indicating whether events of this type will be dispatched to the registered listener BEFORE being 
  dispatched to any EventTarget beneath it in the DOM tree. Events that are bubbling upward through the tree WILL NOT trigger a listener designated to use capture.
  https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener

Here we attach a listener to the document. When you click, for example a button, it will execute the logic of this event handler FIRST, then move down the tree for the rest of the capturing
  phase until it reaches the target (the button). By then, ref.current will be undefined, so the registered listener will not do anything. Then the event registered on the target will
  execute and bubbles up, but a listener registered for capturing WILL NOT execute on bubbling: its either on capturing or bubbling, NOT BOTH.
  https://www.quirksmode.org/js/events_order.html#link4
*/
export function useOutsideClick<T extends HTMLElement>(handler: () => void, listenCapturing = true) {
  const ref = useRef<T>(null);
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && e.target instanceof Node && !ref.current.contains(e.target)) handler();
    }
    document.addEventListener("click", handleClick, listenCapturing);
    return () => document.removeEventListener("click", handleClick, listenCapturing);
  }, [handler, listenCapturing]);

  return ref;
}

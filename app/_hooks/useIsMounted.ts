import { useEffect, useState } from "react";

/**
 * Small hook for checking if component is mounted to avoid hydration errors
 * @returns a boolean to check if the component is mounted.
 */
function useIsMounted() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted;
}

export default useIsMounted;

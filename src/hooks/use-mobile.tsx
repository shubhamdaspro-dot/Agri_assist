import * as React from "react"
import { useIsClient } from "./use-is-client";

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false);
  const isClient = useIsClient();

  React.useEffect(() => {
    if (!isClient) {
      return;
    }

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(mql.matches)
    }

    onChange();
    mql.addEventListener("change", onChange)

    return () => mql.removeEventListener("change", onChange)
  }, [isClient])

  return isMobile
}

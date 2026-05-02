import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // Using a microtask to avoid synchronous setState inside an effect
    Promise.resolve().then(() => setIsMobile(mql.matches))
    
    const onChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches)
    }
    
    mql.addEventListener("change", onChange)
    
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}


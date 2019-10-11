import { useEffect, useRef } from "react";

export function useAsyncEffect(f, deps) {
  useEffect(() => {
    f();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export function useIsMounted() {
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  return isMounted.current;
}

import { useEffect, useRef, useState } from "react";

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

export function useScrollPosition(element) {
  const getCurrentScrollPosition = () => {
    return {
      x: element.scrollX,
      y: element.scrollY
    };
  };

  const [position, setPosition] = useState(getCurrentScrollPosition());

  const handleScroll = e => {
    setPosition(getCurrentScrollPosition());
  };

  useEffect(() => {
    element.addEventListener("scroll", handleScroll);

    return () => {
      element.removeEventListener("scroll", handleScroll);
    };
  });

  return position;
}

import React, { useEffect } from "react";

const useOnClickOutside = (ref: React.RefObject<HTMLDivElement>, handler: () => void) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (ref.current !== null && !ref.current.contains(event.target as Node)) {
        handler();
      }
    };
    document.addEventListener("mousedown", listener as EventListener);

    return () => {
      document.removeEventListener("mousedown", listener as EventListener);
    };
  }, [ref, handler]);
};

export default useOnClickOutside;

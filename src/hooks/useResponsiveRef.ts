import { useEffect, useRef, useState } from "react";

export const useResponsiveRef = <T extends HTMLElement>(
  breakpoint: number = 1000
) => {
  const [isActive, setIsActive] = useState(
    () => window.innerWidth > breakpoint
  );
  const elementRef = useRef<T>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsActive(window.innerWidth > breakpoint);
    };
	 
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return isActive ? elementRef : null;
};

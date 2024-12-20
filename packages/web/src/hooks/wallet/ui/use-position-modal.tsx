import { useEffect } from "react";

export const usePositionModal = (ref: React.RefObject<HTMLDivElement>) => {
  const handleResize = () => {
    if (typeof window !== "undefined" && ref.current) {
      const height = ref.current.getBoundingClientRect().height;
      if (height >= window?.innerHeight) {
        ref.current.style.top = "0";
        ref.current.style.transform = "translateX(-50%)";
      } else {
        ref.current.style.top = "50%";
        ref.current.style.transform = "translate(-50%, -50%)";
      }
    }
  };
  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [ref]);
};

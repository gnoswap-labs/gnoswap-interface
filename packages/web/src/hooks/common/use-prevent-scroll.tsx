import { useEffect } from "react";

export const usePreventScroll = (value: boolean) => {
  useEffect(() => {
    if (value) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [value]);
};

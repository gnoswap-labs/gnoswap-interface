import { CAN_SCROLL_UP_ID } from "@constants/common.constant";
import * as CommonState from "@states/common";
import { useAtom } from "jotai";
import { useEffect } from "react";

export const useScrollUp = () => {
  const [canScrollUp, setCanScrollUp] = useAtom(CommonState.canScrollUpState);
  const [currentSection, setCurrentSection] = useAtom(CommonState.currentSection);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      const anyElement = document.querySelector(`[id^=\"${CAN_SCROLL_UP_ID}\"]`);

      if (anyElement) {
        const reachedTop = anyElement.getBoundingClientRect().top === 64;

        if (reachedTop) {
          setCanScrollUp(true);
        } else {
          setCanScrollUp(false);
        }
      }
    });
  }, [setCanScrollUp]);

  return {
    setCurrentSection,
    currentSection,
    canScrollUp,
    setCanScrollUp
  };
};
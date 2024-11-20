import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";

import { CAN_SCROLL_UP_ID } from "@constants/common.constant";
import { useWindowSize } from "./use-window-size";
import { DEVICE_TYPE } from "@styles/media";

export const useScrollUp = () => {
  const { breakpoint } = useWindowSize();

  const [canScrollUp, setCanScrollUp] = useState(false);
  const [scrollStarted, setScrollStarted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const anyElement = document.querySelector(`[id^=\"${CAN_SCROLL_UP_ID}\"]`);

    const findSpecificArea = () => {
      setScrollStarted(true);
      if (anyElement) {
        const SCROLL_THRESHOLD = breakpoint === DEVICE_TYPE.MOBILE ? 100 : 300;
        const reachedTop = anyElement.getBoundingClientRect().top < SCROLL_THRESHOLD;

        if (reachedTop) {
          setCanScrollUp(true);
          return;
        }

        setCanScrollUp(false);
        return;
      }
      setCanScrollUp(false);
    };

    const handleRouteChange = () => {
      setCanScrollUp(false);
    };

    router.events.on("routeChangeStart", handleRouteChange);
    window.addEventListener("scroll", findSpecificArea);

    return () => {
      window.removeEventListener("scroll", findSpecificArea);
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router.asPath, router.events]);

  const scrollUp = useCallback(() => {
    window.scroll({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  return {
    canScrollUp,
    setCanScrollUp,
    scrollUp,
    scrollStarted,
  };
};

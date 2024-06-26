import { CAN_SCROLL_UP_ID } from "@constants/common.constant";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

export const useScrollUp = () => {
  const [canScrollUp, setCanScrollUp] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const anyElement = document.querySelector(`[id^=\"${CAN_SCROLL_UP_ID}\"]`);

    const findSpecificArea = () => {
      if (anyElement) {
        const reachedTop = anyElement.getBoundingClientRect().top < 300;

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
    scrollUp
  };
};
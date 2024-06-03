import { useEffect } from "react";
import useRouter from "./use-custom-router";

export const useRouterBack = () => {
  const initLocation = window.location.href;
  const targetLocation = initLocation.substring(
    0,
    initLocation.lastIndexOf("/"),
  );

  let enabled = false;
  const router = useRouter();

  const back = (): void => {
    if (history.length < 1) {
      window.history.pushState("", "", null);
      return;
    }
    if (!enabled) {
      if (targetLocation !== window.location.href) {
        router.back();
      } else {
        enabled = true;
      }
    }
  };

  useEffect(() => {
    window.addEventListener("popstate", back);
    return () => {
      window.removeEventListener("popstate", back);
    };
  }, []);
};

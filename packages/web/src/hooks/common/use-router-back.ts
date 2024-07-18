import { useEffect } from "react";
import useRouter from "./use-custom-router";

export const useRouterBack = () => {
  const initLocation = window.location.pathname;
  const targetLocation = initLocation.substring(
    0,
    initLocation.lastIndexOf("/"),
  );

  const router = useRouter();

  const back = (): void => {
    if (history.length < 3) {
      window.history.pushState("", "", null);
      return;
    }

    if (targetLocation !== window.location.pathname) {
      router.back();
    }
  };

  useEffect(() => {
    window.addEventListener("popstate", back);
    return () => {
      window.removeEventListener("popstate", back);
    };
  }, []);
};

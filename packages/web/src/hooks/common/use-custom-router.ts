import { Url } from "next/dist/shared/lib/router/router";
import { useRouter } from "next/router";
import useScrollData from "./use-scroll-data";

const useCustomRouter = () => {
  const router = useRouter();
  const { saveCurrentScrollHeight } = useScrollData();

  function toMain() {
    router.push("/");
  }

  function back() {
    router.back();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function push(pathname: Url, as?: any, options?: any) {
    saveCurrentScrollHeight(window?.location?.pathname);
    router.push(pathname, as, options);
  }

  function replace(pathname: string) {
    router.replace(pathname);
  }

  return {
    toMain,
    back,
    push,
    replace,
    query: router.query,
    asPath: router.asPath,
    pathname: router.pathname,
    isReady: router.isReady,
  };
};

export default useCustomRouter;

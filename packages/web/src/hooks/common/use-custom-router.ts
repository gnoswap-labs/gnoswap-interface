import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";
import {
  PAGE_PATH,
  PAGE_PATH_TYPE,
  QUERY_PARAMETER,
} from "@constants/page.constant";
import useScrollData from "./use-scroll-data";
import { makeRouteUrl } from "@utils/page.utils";

export type QueryParameter = {
  [key in string]: string | number | null | undefined;
};

const useCustomRouter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { saveCurrentScrollHeight } = useScrollData();

  function toMain() {
    router.push("/");
  }

  function back() {
    router.back();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function push(pathname: string, as?: any, options?: any) {
    saveCurrentScrollHeight(window?.location?.pathname);
    router.push(pathname, as, options);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function replace(pathname: string, as?: any, options?: any) {
    router.replace(pathname, as, options);
  }

  function getParameter(key: string): string | null {
    return searchParams.get(key);
  }

  function getAddress(): string | null {
    return getParameter(QUERY_PARAMETER["ADDRESS"]);
  }

  function getTokenPath(): string | null {
    return getParameter(QUERY_PARAMETER["TOKEN_PATH"]);
  }

  function getPoolPath(): string | null {
    return getParameter(QUERY_PARAMETER["POOL_PATH"]);
  }

  function getPositionId(): string | null {
    return getParameter(QUERY_PARAMETER["POSITION_ID"]);
  }

  function pushByParams(
    url: string,
    params?: QueryParameter,
    hash?: string | number,
  ) {
    return push(makeRouteUrl(url, params, hash));
  }

  function movePage(
    pathType: PAGE_PATH_TYPE,
    params?: QueryParameter,
    hash?: string | number,
  ) {
    const path = PAGE_PATH[pathType];
    return pushByParams(path, params, hash);
  }

  function movePageWithTokenPath(
    path: PAGE_PATH_TYPE,
    tokenPath: string,
    hash?: string | number,
  ) {
    return movePage(path, { [QUERY_PARAMETER.TOKEN_PATH]: tokenPath }, hash);
  }

  function movePageWithPoolPath(
    path: PAGE_PATH_TYPE,
    poolPath: string,
    hash?: string | number,
  ) {
    return movePage(path, { [QUERY_PARAMETER.POOL_PATH]: poolPath }, hash);
  }

  function movePageWithPositionId(
    path: PAGE_PATH_TYPE,
    poolPath: string,
    positionId: string | number,
  ) {
    return movePage(path, {
      [QUERY_PARAMETER.POOL_PATH]: poolPath,
      [QUERY_PARAMETER.POSITION_ID]: positionId,
    });
  }

  return {
    toMain,
    back,
    push,
    replace,
    getAddress,
    getParameter,
    getTokenPath,
    getPoolPath,
    getPositionId,
    movePage,
    movePageWithTokenPath,
    movePageWithPoolPath,
    movePageWithPositionId,
    query: router.query,
    asPath: router.asPath,
    pathname: router.pathname,
    isReady: router.isReady,
  };
};

export default useCustomRouter;

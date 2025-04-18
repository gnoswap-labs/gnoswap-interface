import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";
import { PAGE_PATH, PAGE_PATH_TYPE, QUERY_PARAMETER } from "@constants/page.constant";
import useScrollData from "./use-scroll-data";
import { makeRouteUrl } from "@utils/page.utils";

export type QueryParameter = {
  [key in string]: string | number | null | undefined;
};

interface PathParams {
  pathname: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query?: any;
}

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
  function push(pathname: string | PathParams, as?: any, options?: any) {
    saveCurrentScrollHeight(window?.location?.pathname);
    const referrer = getReferrerParameter();

    if (typeof pathname === "string") {
      const hasQuery = pathname.includes("?");
      const referrerQuery = referrer ? `${hasQuery ? "&" : "?"}${QUERY_PARAMETER.REFERRER}=${referrer}` : "";
      router.push(`${pathname}${referrerQuery}`, as, options);
    } else {
      const query = {
        ...pathname.query,
        ...(referrer ? { referrer } : {}),
      };
      router.push({ ...pathname, query }, as, options);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function replace(pathname: string | PathParams, as?: any, options?: any) {
    router.replace(pathname, as, options);
  }

  function getReferrerParameter(): string | null {
    return searchParams.get(QUERY_PARAMETER.REFERRER);
  }

  function getParamsWithReferrer(params?: QueryParameter): QueryParameter {
    const referrer = getReferrerParameter();
    if (!referrer) return params || {};
    return {
      ...params,
      referrer,
    };
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

  function getProjectPath(): string | null {
    return getParameter(QUERY_PARAMETER["PROJECT_PATH"]);
  }

  function pushByParams(url: string, params?: QueryParameter, hash?: string | number) {
    return push(makeRouteUrl(url, params, hash));
  }

  function movePage(pathType: PAGE_PATH_TYPE, params?: QueryParameter, hash?: string | number) {
    const path = PAGE_PATH[pathType];
    return pushByParams(path, params, hash);
  }

  function movePageWithTokenPath(path: PAGE_PATH_TYPE, tokenPath: string, hash?: string | number) {
    return movePage(path, { [QUERY_PARAMETER.TOKEN_PATH]: tokenPath }, hash);
  }

  function movePageWithPoolPath(path: PAGE_PATH_TYPE, poolPath: string, hash?: string | number) {
    return movePage(path, { [QUERY_PARAMETER.POOL_PATH]: poolPath }, hash);
  }

  function movePageWithPositionId(path: PAGE_PATH_TYPE, poolPath: string, positionId: string | number) {
    return movePage(path, {
      [QUERY_PARAMETER.POOL_PATH]: poolPath,
      [QUERY_PARAMETER.POSITION_ID]: positionId,
    });
  }

  function moveRewardTokenSwapPage(path: string) {
    router.push(`swap?to=${path}`);
  }

  return {
    toMain,
    back,
    push,
    replace,
    getAddress,
    getReferrerParameter,
    getParamsWithReferrer,
    getParameter,
    getTokenPath,
    getPoolPath,
    getPositionId,
    getProjectPath,
    movePage,
    movePageWithTokenPath,
    movePageWithPoolPath,
    movePageWithPositionId,
    moveRewardTokenSwapPage,
    query: router.query,
    asPath: router.asPath,
    pathname: router.pathname,
    isReady: router.isReady,
  };
};

export default useCustomRouter;

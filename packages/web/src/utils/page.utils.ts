import { PAGE_PATH, QUERY_PARAMETER } from "@constants/page.constant";

export function makeQueryStringByParams(params: {
  [key in string]: string | number | null | undefined;
}): string {
  const queryParams = Object.entries(params).reduce<string[]>((acc, entry) => {
    if (entry?.[1] === undefined || entry?.[1] === null || entry?.[1] === "") {
      return acc;
    }
    acc.push(`${entry[0]}=${entry[1]}`);
    return acc;
  }, []);
  return queryParams.join("&");
}

export function makeRouteUrl(
  url: string,
  params?: {
    [key in string]: string | number | null | undefined;
  },
  hash?: string | number,
): string {
  const hashString = hash !== undefined ? `#${hash}` : "";
  const queryParams = params ? makeQueryStringByParams(params) : null;
  if (!queryParams) {
    return `${url}${hashString}`;
  }

  return `${url}?${queryParams}${hashString}`;
}

function normalizePath(path: string): string {
  return path.replace(/\/$/, "") || "/";
}

function preserveCurrentPathPrefix(currentPath: string, routePath: string, url: string): string {
  if (currentPath === routePath || !currentPath.endsWith(routePath) || !url.startsWith(routePath)) {
    return url;
  }

  return `${currentPath.slice(0, currentPath.length - routePath.length)}${url}`;
}

function makeNextHistoryState(url: string): unknown {
  const currentState = window.history.state;
  if (typeof currentState !== "object" || currentState === null) {
    return currentState;
  }

  return {
    ...currentState,
    url,
    as: url,
  };
}

export function replaceRouteUrlWithoutNavigation(routePath: string, url: string): void {
  if (typeof window === "undefined") {
    return;
  }

  const currentPath = normalizePath(window.location.pathname);
  const normalizedRoutePath = normalizePath(routePath);
  const nextUrl = preserveCurrentPathPrefix(currentPath, normalizedRoutePath, url);
  const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;

  if (currentPath !== normalizedRoutePath && !currentPath.endsWith(normalizedRoutePath)) {
    return;
  }

  if (currentUrl === nextUrl) {
    return;
  }

  window.history.replaceState(makeNextHistoryState(nextUrl), "", nextUrl);
}

export function makeTokenRouteUrl(tokenPath: string): string {
  return makeRouteUrl(PAGE_PATH.TOKEN, {
    [QUERY_PARAMETER.TOKEN_PATH]: tokenPath,
  });
}

export function makePoolRouteUrl(poolPath: string, hash?: string): string {
  return makeRouteUrl(
    PAGE_PATH.POOL,
    {
      [QUERY_PARAMETER.POOL_PATH]: poolPath,
    },
    hash,
  );
}

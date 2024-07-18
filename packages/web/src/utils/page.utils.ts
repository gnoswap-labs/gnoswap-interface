import { PAGE_PATH, QUERY_PARAMETER } from "@constants/page.constant";

export function makeQueryStringByParams(params: {
  [key in string]: string | number | null | undefined;
}): string {
  const queryParams = Object.entries(params).reduce<string[]>((acc, entry) => {
    if (entry?.[1] === undefined || entry?.[1] === null) {
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

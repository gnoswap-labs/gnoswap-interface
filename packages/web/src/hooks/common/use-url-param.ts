import { useCallback, useEffect, useState } from "react";

type DefaultObject = Record<string, string | number | null | undefined>;

export function makeQueryString(data: DefaultObject): string {
  const params: string[] = [];
  Object.keys(data).forEach(key => {
    const value = data[key];
    if (value === null || value === undefined || value === "") {

    } else {
      let value = data[key];
      if (typeof data[key] === "string") {
        value = encodeURIComponent((data[key] ?? "") as string);
      }
      const param = `${key}=${value}`;
      params.push(param);
    }

  });
  return params.join("&");
}

function parseQueryString(search: string): Record<string, string> {
  const queryString = search.replace("?", "");
  const params = queryString.split("&");
  const data = params.reduce<Record<string, string>>((accum, current) => {
    const values = current.split("=");
    if (values.length > 1) {
      const key = values[0];
      const value = values[1];
      accum[key] = value;
    }
    return accum;
  }, {});
  return data;
}

export function useUrlParam<T extends DefaultObject = DefaultObject>(
  request: T,
): {
  currentData: T;
  initializedData: T | null;
  hash: string | null;
  updateParams: () => void;
} {
  const [currentData, setCurrentData] = useState<T>(request);
  const [hash, setHash] = useState<string | null>(null);
  const [initializedData, setInitializedData] = useState<T | null>(null);

  const updateParams = useCallback(() => {
    const path = location.pathname;
    const locationPath = path + location.search;
    const queryString = makeQueryString(request);
    const currentPath = queryString === "" ? path : `${path}?${queryString}`;
    if (locationPath !== currentPath) {
      history.pushState(history.state, "", currentPath);
      setCurrentData(request);
    }
  }, [request]);

  useEffect(() => {
    const search = location.search;
    const data = parseQueryString(search);
    const hash = (location.hash || "").replace("#", "");
    setHash(hash);
    setInitializedData(data as T);
  }, []);

  return { initializedData, hash, currentData, updateParams };
}

export default useUrlParam;

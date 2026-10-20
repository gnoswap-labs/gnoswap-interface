import { QueryClient } from "@tanstack/react-query";
import BigNumber from "bignumber.js";

import { TokenModel } from "@models/token/token-model";
import { QUERY_KEY } from "@query/query-keys";
import { encryptId } from "@utils/common";

function getDecimalLength(value: string) {
  return value.includes(".") ? value.split(".")[1].length : 0;
}

function isReducingOverPrecision(changed: string, previous: string | undefined, decimals: number) {
  if (!previous) {
    return false;
  }

  const previousDecimalLength = getDecimalLength(previous);
  const changedDecimalLength = getDecimalLength(changed);

  return previousDecimalLength > decimals && changedDecimalLength < previousDecimalLength;
}

export function handleAmount(changed: string, token: TokenModel | null, previous?: string) {
  let value = changed;
  const decimals = token?.decimals;

  if (decimals === undefined) {
    return { isValid: false, value: changed };
  }

  if (changed.includes(".") && changed.split(".")[1].length > decimals) {
    if (isReducingOverPrecision(changed, previous, decimals)) {
      return { isValid: true, value: changed };
    }

    return { isValid: false, value: changed };
  }

  if (!value || BigNumber(value).isZero()) {
    value = changed;
  } else {
    value = BigNumber(value).toFixed(decimals, 1);
  }

  if (BigNumber(changed).isEqualTo(value)) {
    const dotIndex = changed.indexOf(".");
    if (dotIndex === -1 || changed.length - dotIndex - 1 < decimals) {
      value = changed;
    }
  }

  return { isValid: true, value };
}

export function invalidateSwapPools(queryClient: QueryClient, poolPaths: readonly string[]) {
  const paths = new Set(poolPaths);
  const encryptedPaths = new Set(poolPaths.map(encryptId));

  return queryClient.invalidateQueries({
    predicate: ({ queryKey: [key, path] }) => {
      if (key === QUERY_KEY.rpcPools) return Array.isArray(path) && path.some(poolPath => paths.has(poolPath));
      if (typeof path !== "string") return false;
      switch (key) {
        case QUERY_KEY.poolSqrtPriceX96:
        case QUERY_KEY.poolLiquidity:
        case QUERY_KEY.poolTicks:
        case QUERY_KEY.poolLiquidityTicks:
          return paths.has(path);
        case QUERY_KEY.poolFromDb:
        case QUERY_KEY.poolDetail:
        case QUERY_KEY.prices:
          return encryptedPaths.has(path);
        default:
          return false;
      }
    },
  });
}

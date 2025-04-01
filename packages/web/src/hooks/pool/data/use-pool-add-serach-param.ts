import { useMemo } from "react";

import useCustomRouter from "@hooks/common/use-custom-router";
import { sortTokenPaths } from "@utils/sort-utils";
import { checkGnotPath } from "@utils/common";

export const usePoolAddSearchParams = () => {
  const router = useCustomRouter();

  const poolPathParam = router.query.poolPath as string;
  const tokenAPath = router.query.tokenA as string;
  const tokenBPath = router.query.tokenB as string;
  const feeTier = router.query.fee_tier as string;

  const tokenPair = useMemo(() => {
    if (poolPathParam) {
      const poolPathSplit = poolPathParam?.split(":");
      return [poolPathSplit[0], poolPathSplit[1]];
    }

    const processedTokenAPath = checkGnotPath(tokenAPath);
    const processedTokenBPath = checkGnotPath(tokenBPath);

    return [processedTokenAPath, processedTokenBPath].sort(sortTokenPaths);
  }, [poolPathParam, tokenAPath, tokenBPath]);

  const poolPath = useMemo(() => {
    if (poolPathParam) return poolPathParam;

    if (!tokenPair || tokenPair.length !== 2 || !feeTier) return null;

    return [...tokenPair, feeTier].join(":");
  }, [poolPathParam, tokenPair, feeTier]);

  return {
    poolPath,
    tokenPair,
  };
};

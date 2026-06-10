interface ResolvePoolAddInfoParams {
  poolPath: string | null;
  tokenPair: readonly (string | null | undefined)[];
  currentPoolPath: string | null;
}

interface ResolvedPoolAddInfo {
  poolPath: string | null;
  tokenPair: string[];
}

const hasCompleteTokenPair = (tokenPair: readonly (string | null | undefined)[]): tokenPair is readonly [string, string] => {
  return tokenPair.length >= 2 && !!tokenPair[0] && !!tokenPair[1];
};

const parseTokenPairFromPoolPath = (poolPath: string | null): string[] | null => {
  if (!poolPath) {
    return null;
  }

  const [tokenAPath, tokenBPath] = poolPath.split(":");
  if (!tokenAPath || !tokenBPath) {
    return null;
  }

  return [tokenAPath, tokenBPath];
};

export const resolvePoolAddInfo = ({
  poolPath,
  tokenPair,
  currentPoolPath,
}: ResolvePoolAddInfoParams): ResolvedPoolAddInfo => {
  const currentTokenPair = parseTokenPairFromPoolPath(currentPoolPath);
  if (currentPoolPath && currentTokenPair) {
    return {
      poolPath: currentPoolPath,
      tokenPair: currentTokenPair,
    };
  }

  if (poolPath && hasCompleteTokenPair(tokenPair)) {
    return {
      poolPath,
      tokenPair: [...tokenPair],
    };
  }

  return {
    poolPath,
    tokenPair: hasCompleteTokenPair(tokenPair) ? [...tokenPair] : [],
  };
};

import type { TokenModel } from "@models/token/token-model";
import { checkGnotPath } from "@utils/common";

interface ResolvePoolAddInfoParams {
  poolPath: string | null;
  tokenPair: readonly (string | null | undefined)[];
  currentPoolPath: string | null;
}

interface ResolvedPoolAddInfo {
  poolPath: string | null;
  tokenPair: string[];
}

interface PoolAddTokenGnotPathInfo {
  path: string;
  name: string;
  symbol: string;
  displaySymbol: string;
  logoURI: string;
  wrappedPath: string;
}

const toCompleteTokenPair = (tokenPair: readonly (string | null | undefined)[]): [string, string] | null => {
  const [tokenAPath, tokenBPath] = tokenPair;
  if (!tokenAPath || !tokenBPath) {
    return null;
  }

  return [tokenAPath, tokenBPath];
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

export const resolvePoolAddToken = ({
  tokenPath,
  tokens,
  getGnotPath,
}: {
  tokenPath: string | null | undefined;
  tokens: readonly TokenModel[];
  getGnotPath: (token: TokenModel) => PoolAddTokenGnotPathInfo;
}): TokenModel | null => {
  if (!tokenPath) {
    return null;
  }

  const checkedPath = checkGnotPath(tokenPath);
  const token = tokens.find(item => item.path === checkedPath);
  if (!token) {
    return null;
  }

  return {
    ...token,
    ...getGnotPath(token),
  };
};

export const resolvePoolAddInfo = ({
  poolPath,
  tokenPair,
  currentPoolPath,
}: ResolvePoolAddInfoParams): ResolvedPoolAddInfo => {
  const currentTokenPair = parseTokenPairFromPoolPath(currentPoolPath);
  const completeTokenPair = toCompleteTokenPair(tokenPair);

  if (currentPoolPath && currentTokenPair) {
    return {
      poolPath: currentPoolPath,
      tokenPair: currentTokenPair,
    };
  }

  if (poolPath && completeTokenPair) {
    return {
      poolPath,
      tokenPair: completeTokenPair,
    };
  }

  return {
    poolPath,
    tokenPair: completeTokenPair ?? [],
  };
};

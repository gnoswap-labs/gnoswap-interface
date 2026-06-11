import { TokenModel } from "@models/token/token-model";
import { checkGnotPath } from "@utils/common";

const INCENTIVE_TOKEN_ORDER = ["GNOT", "GNS"] as const;

function tokenPriority(token: TokenModel): number {
  const normalizedSymbol = token.symbol.toUpperCase();
  const index = INCENTIVE_TOKEN_ORDER.findIndex(symbol => symbol === normalizedSymbol);
  return index === -1 ? INCENTIVE_TOKEN_ORDER.length : index;
}

function canonicalRewardPath(token: TokenModel): string {
  return token.wrappedPath || checkGnotPath(token.path);
}

export function filterAllowedIncentiveTokens(
  tokens: readonly TokenModel[],
  allowedTokenPaths: readonly string[],
): TokenModel[] {
  const allowedPathSet = new Set(allowedTokenPaths);
  const selectedPathSet = new Set<string>();

  return tokens
    .filter(token => allowedPathSet.has(canonicalRewardPath(token)))
    .sort((a, b) => {
      const priorityDiff = tokenPriority(a) - tokenPriority(b);
      if (priorityDiff !== 0) {
        return priorityDiff;
      }
      return a.symbol.localeCompare(b.symbol);
    })
    .filter(token => {
      const rewardPath = canonicalRewardPath(token);
      if (selectedPathSet.has(rewardPath)) {
        return false;
      }
      selectedPathSet.add(rewardPath);
      return true;
    });
}

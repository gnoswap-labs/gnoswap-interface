import { TokenModel } from "@models/token/token-model";
import { checkGnotPath, isNativeToken } from "@utils/common";

function tokenPriority(token: TokenModel, allowedTokenPaths: readonly string[]): number {
  const index = allowedTokenPaths.findIndex(path => path === incentiveTokenPath(token));
  return index === -1 ? allowedTokenPaths.length : index;
}

export function incentiveTokenPath(token: TokenModel): string {
  if (isNativeToken(token.path)) {
    return token.wrappedPath || checkGnotPath(token.path);
  }
  return checkGnotPath(token.path);
}

function nativeTokenPriority(token: TokenModel): number {
  return isNativeToken(token.path) ? 0 : 1;
}

export function filterAllowedIncentiveTokens(
  tokens: readonly TokenModel[],
  allowedTokenPaths: readonly string[],
): TokenModel[] {
  const allowedPathSet = new Set(allowedTokenPaths);
  const selectedPathSet = new Set<string>();

  return tokens
    .filter(token => allowedPathSet.has(incentiveTokenPath(token)))
    .sort((a, b) => {
      const priorityDiff = tokenPriority(a, allowedTokenPaths) - tokenPriority(b, allowedTokenPaths);
      if (priorityDiff !== 0) {
        return priorityDiff;
      }
      const nativePriorityDiff = nativeTokenPriority(a) - nativeTokenPriority(b);
      if (nativePriorityDiff !== 0) {
        return nativePriorityDiff;
      }
      return a.symbol.localeCompare(b.symbol);
    })
    .filter(token => {
      const rewardPath = incentiveTokenPath(token);
      if (selectedPathSet.has(rewardPath)) {
        return false;
      }
      selectedPathSet.add(rewardPath);
      return true;
    });
}

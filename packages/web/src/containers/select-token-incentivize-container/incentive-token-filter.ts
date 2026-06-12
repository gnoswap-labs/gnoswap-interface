import { TokenModel } from "@models/token/token-model";

function tokenPriority(token: TokenModel, allowedTokenPaths: readonly string[]): number {
  const index = allowedTokenPaths.findIndex(path => path === token.path);
  return index === -1 ? allowedTokenPaths.length : index;
}

export function filterAllowedIncentiveTokens(
  tokens: readonly TokenModel[],
  allowedTokenPaths: readonly string[],
): TokenModel[] {
  const allowedPathSet = new Set(allowedTokenPaths);
  const selectedPathSet = new Set<string>();

  return tokens
    .filter(token => allowedPathSet.has(token.path))
    .sort((a, b) => {
      const priorityDiff = tokenPriority(a, allowedTokenPaths) - tokenPriority(b, allowedTokenPaths);
      if (priorityDiff !== 0) {
        return priorityDiff;
      }
      return a.symbol.localeCompare(b.symbol);
    })
    .filter(token => {
      if (selectedPathSet.has(token.path)) {
        return false;
      }
      selectedPathSet.add(token.path);
      return true;
    });
}

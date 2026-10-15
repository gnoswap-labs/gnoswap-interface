import { GNOT_TOKEN, GNS_TOKEN, WUGNOT_TOKEN } from "@common/values/token-constant";
import { TokenModel } from "@models/token/token-model";

export const ORDER = [GNOT_TOKEN.symbol, GNS_TOKEN.symbol, "BAR", "BAZ"];

export const customSort = (a: TokenModel, b: TokenModel) => {
  const symbolA = a.symbol.toUpperCase();
  const symbolB = b.symbol.toUpperCase();

  const indexA = ORDER.indexOf(symbolA);
  const indexB = ORDER.indexOf(symbolB);

  if (indexA === -1) return 1;
  if (indexB === -1) return -1;

  return indexA - indexB;
};

export const DEFAULT_TOKEN_PATHS = [GNOT_TOKEN.path, GNS_TOKEN.path, WUGNOT_TOKEN.path];

export interface SelectTokenSortable extends TokenModel {
  usdValue: number;
  balance: number;
}

const sortGroup = (token: SelectTokenSortable) => {
  if (token.usdValue > 0) return 0;
  if (token.balance > 0) return 1;
  return token.isVerified ? 2 : 3;
};

const defaultTokenIndex = (token: SelectTokenSortable) => {
  const index = DEFAULT_TOKEN_PATHS.indexOf(token.path);
  return index === -1 ? DEFAULT_TOKEN_PATHS.length : index;
};

/**
 * Select a Token list order:
 * USD value desc, then balance desc for held tokens without a USD value,
 * then verified tokens and finally unverified tokens.
 * Tokens without a balance keep GNOT, GNS, wugnot first, then sort by name.
 */
export const compareSelectTokens = (a: SelectTokenSortable, b: SelectTokenSortable) =>
  sortGroup(a) - sortGroup(b) ||
  b.usdValue - a.usdValue ||
  b.balance - a.balance ||
  defaultTokenIndex(a) - defaultTokenIndex(b) ||
  a.name.toLowerCase().localeCompare(b.name.toLowerCase());

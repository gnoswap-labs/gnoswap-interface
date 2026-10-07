import { GNOT_TOKEN, GNS_TOKEN } from "@common/values/token-constant";
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

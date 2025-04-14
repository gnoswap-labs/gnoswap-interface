import { RewardTokenModel } from "@models/position/reward-model";
import { isNativeToken, TokenModel } from "@models/token/token-model";
import BigNumber from "bignumber.js";
import { formatOtherPrice } from "./new-number-utils";
import { roundDownDecimalNumber } from "./regex";
import { STATIC_TEXT } from "@common/values";
import { RewardType } from "@constants/option.constant";

export interface RewardTokenModelWithMultipleTypes extends Omit<RewardTokenModel, "rewardType"> {
  rewardType: RewardType | RewardType[];
}

export function makeRawTokenAmount(token: TokenModel, amount: string | number) {
  const number = BigNumber(amount.toString());
  if (number.isNaN()) {
    return null;
  }
  return number.shiftedBy(token.decimals).toFixed(0, BigNumber.ROUND_FLOOR);
}

export function makeDisplayTokenAmount(
  token: TokenModel,
  amount: bigint | string | number,
  options?: { decimalsWithoutRounding?: number },
) {
  const number = BigNumber(Number(amount));
  if (number.isNaN()) {
    return null;
  }

  if (options?.decimalsWithoutRounding) {
    return Number(
      number.shiftedBy(-token.decimals).toString().match(roundDownDecimalNumber(options?.decimalsWithoutRounding)),
    );
  }

  return number.shiftedBy(-(token.decimals || 0)).toNumber();
}

export function makeShiftAmount(
  amount: bigint | string | number,
  shift: number,
  options?: { decimalsWithoutRounding?: number },
) {
  const number = BigNumber(Number(amount));
  if (number.isNaN()) {
    return 0;
  }

  if (options?.decimalsWithoutRounding) {
    return Number(number.shiftedBy(shift).toString().match(roundDownDecimalNumber(options?.decimalsWithoutRounding)));
  }

  return number.shiftedBy(shift).toNumber();
}

/**
 * Functions to format token balances for display formatting
 * @param balance
 * @param connectedWallet
 * @returns {string}
 */
export function formatTokenBalanceDisplay(balance: string, connectedWallet: boolean): string {
  if (!connectedWallet || !balance) {
    return "-";
  }

  const cleanBalance = balance.replace(/,/g, "");
  return formatOtherPrice(cleanBalance, { isKMB: false, usd: false });
}

/**
 * Formats the token path by removing the 'gno.land/' prefix if present
 * @param path - The original token path
 * @param isNative - Whether the token is native
 * @param nativeCoinText - The text to display for native coins
 * @returns Formatted token path
 */
export function formatTokenPath(path: string, isNative: boolean): string {
  if (isNative) return STATIC_TEXT.NATIVE_COIN;

  // Remove 'gno.land/' prefix if present
  return path.replace(/^gno\.land\//, "");
}

/**
 * Removes duplicates from the reward token array and returns token information converted to GNOT paths.
 *
 * @param rewardTokens Array of tokens to process
 * @param getGnotPath GNOT path conversion function
 */
export function getUniqueRewardTokensByPath<
  T extends { path?: string; name?: string; logoURI?: string; symbol?: string },
>(
  rewardTokens: RewardTokenModel[],
  getGnotPath: (token: T | null | undefined) => {
    path: string;
    name: string;
    symbol: string;
    logoURI: string;
    wrappedPath: string;
  },
) {
  return rewardTokens.reduce((acc, current) => {
    const existToken = acc.some(item => item.path === getGnotPath(current as unknown as T).path);

    if (!existToken) {
      acc.push({
        ...current,
        logoURI: getGnotPath(current as unknown as T).logoURI,
        symbol: getGnotPath(current as unknown as T).symbol,
        path: getGnotPath(current as unknown as T).path,
      });
    }

    return acc;
  }, [] as RewardTokenModel[]);
}

/**
 * Groups reward tokens by path and combines their reward types.
 * Tokens with the same path but different reward types will be merged into a single token
 * with an array of reward types.
 *
 * @param rewardTokens Array of tokens to process
 * @param getGnotPath GNOT path conversion function
 */
export function getUniqueRewardTokensWithMultipleRewardTypes<
  T extends { path?: string; name?: string; logoURI?: string; symbol?: string },
>(
  rewardTokens: RewardTokenModel[],
  getGnotPath: (token: T | null | undefined) => {
    path: string;
    name: string;
    symbol: string;
    logoURI: string;
    wrappedPath: string;
  },
): RewardTokenModelWithMultipleTypes[] {
  const tokensByPath = rewardTokens.reduce((acc, current) => {
    const convertedToken = {
      ...current,
      logoURI: getGnotPath(current as unknown as T).logoURI,
      symbol: getGnotPath(current as unknown as T).symbol,
      path: getGnotPath(current as unknown as T).path,
    };

    const path = convertedToken.path;
    if (!acc[path]) {
      acc[path] = [];
    }
    acc[path].push(convertedToken);

    return acc;
  }, {} as Record<string, RewardTokenModel[]>);

  return Object.values(tokensByPath).map(tokens => {
    const baseToken = tokens[0];

    const uniqueRewardTypes = Array.from(
      new Set(tokens.map(token => token.rewardType).filter(Boolean)),
    ) as RewardType[];

    return {
      ...baseToken,
      rewardType: uniqueRewardTypes.length > 1 ? uniqueRewardTypes : baseToken.rewardType,
    } as RewardTokenModelWithMultipleTypes;
  });
}

/**
 * Groups reward tokens by path and combines their reward types.
 * Tokens with the same path but different reward types will be merged into a single token
 * with an array of reward types.
 *
 * @param rewardTokens Array of tokens to process
 * @param getGnotPath GNOT path conversion function
 */
export function getUniqueRewardTokensByPathWithTypes<
  T extends { path?: string; name?: string; logoURI?: string; symbol?: string },
>(
  rewardTokens: RewardTokenModel[],
  getGnotPath: (token: T | null | undefined) => {
    path: string;
    name: string;
    symbol: string;
    logoURI: string;
    wrappedPath: string;
  },
) {
  return rewardTokens.reduce((acc, current) => {
    const existToken = acc.some(
      item => item.path === getGnotPath(current as unknown as T).path && item.rewardType === current.rewardType,
    );

    if (!existToken) {
      acc.push({
        ...current,
        logoURI: getGnotPath(current as unknown as T).logoURI,
        symbol: getGnotPath(current as unknown as T).symbol,
        path: getGnotPath(current as unknown as T).path,
      });
    }

    return acc;
  }, [] as RewardTokenModel[]);
}

/**
 *
 * @param token TokenModel
 * @returns Formatted token path
 */
export const formatTokenModelPath = (token: TokenModel): string => {
  if (isNativeToken(token)) return STATIC_TEXT.NATIVE_COIN;
  return token.path.replace(/^gno\.land\//, "");
};

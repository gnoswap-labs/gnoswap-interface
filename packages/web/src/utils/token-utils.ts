import { STATIC_TEXT } from "@common/values";
import { GNOT_TOKEN, WUGNOT_TOKEN } from "@common/values/token-constant";
import { RewardType } from "@constants/option.constant";
import { RewardTokenModel } from "@models/position/reward-model";
import { isNativeToken, TokenModel } from "@models/token/token-model";
import { OnchainToken } from "@repositories/activity/responses/activity-responses";
import BigNumber from "bignumber.js";
import { formatOtherPrice } from "./new-number-utils";
import { roundDownDecimalNumber } from "./regex";

export interface RewardTokenModelWithMultipleTypes extends Omit<RewardTokenModel, "rewardType"> {
  rewardType: RewardType | RewardType[];
}

export const TOKEN_DISPLAY_MAX_LENGTH = 9;

export function formatDisplayTokenSymbol(symbol: string): string {
  if (symbol.toUpperCase() === WUGNOT_TOKEN.symbol) return GNOT_TOKEN.symbol;

  if (symbol.length <= TOKEN_DISPLAY_MAX_LENGTH) return symbol;

  return `${symbol.slice(0, TOKEN_DISPLAY_MAX_LENGTH)}...`;
}

export function makeRawTokenAmount(token: TokenModel, amount: string | number) {
  const number = BigNumber(amount.toString());
  if (number.isNaN()) {
    return null;
  }
  return number.shiftedBy(token.decimals).toFixed(0, BigNumber.ROUND_FLOOR);
}

export function makeDisplayTokenAmount(
  token: TokenModel | OnchainToken,
  amount: bigint | string | number,
  options?: { decimalsWithoutRounding?: number },
) {
  const number = BigNumber(amount.toString());
  if (number.isNaN()) {
    return null;
  }

  if (options?.decimalsWithoutRounding) {
    return Number(
      number.shiftedBy(-token.decimals).toString().match(roundDownDecimalNumber(options?.decimalsWithoutRounding)),
    );
  }

  return number.shiftedBy(-token.decimals).toNumber();
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
 * with an array of reward types sorted by priority: INTERNAL_REWARD > EXTERNAL_REWARD > SWAP_FEE
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
  if (!rewardTokens.length) {
    return [];
  }

  const tokensByPath = rewardTokens.reduce((acc, current) => {
    const tokenInfo = getGnotPath(current as unknown as T);

    const convertedToken = {
      ...current,
      logoURI: tokenInfo.logoURI,
      symbol: tokenInfo.symbol,
      path: tokenInfo.path,
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

    const sortedRewardTypes = sortRewardTypesByPriority(uniqueRewardTypes);

    return {
      ...baseToken,
      rewardType: sortedRewardTypes.length > 1 ? sortedRewardTypes : baseToken.rewardType,
    } as RewardTokenModelWithMultipleTypes;
  });
}

/**
 * Sorts reward types by priority: INTERNAL_REWARD > EXTERNAL_REWARD > SWAP_FEE
 * Internal tiers (INTERNAL_TIER_1, INTERNAL_TIER_2, INTERNAL_TIER_3) are considered as INTERNAL_REWARD
 *
 * @param rewardTypes Array of reward types to sort
 * @returns Sorted array of reward types
 */
function sortRewardTypesByPriority(rewardTypes: RewardType[]): RewardType[] {
  const priorityMap: Record<RewardType, number> = {
    INTERNAL_REWARD: 1,
    INTERNAL_TIER_1: 1,
    INTERNAL_TIER_2: 1,
    INTERNAL_TIER_3: 1,
    EXTERNAL_REWARD: 2,
    SWAP_FEE: 3,
  };

  return [...rewardTypes].sort((a, b) => {
    const priorityA = priorityMap[a] ?? Infinity;
    const priorityB = priorityMap[b] ?? Infinity;

    return priorityA - priorityB;
  });
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

export const isNativeTokenPath = (path: string): boolean => {
  return path === GNOT_TOKEN.path;
};

export function parseTokenAmount(tokenAmount: string, denomination = GNOT_TOKEN.denom || "ugnot"): number {
  const pattern = new RegExp(`^(\\d+)${denomination}$`);
  const match = tokenAmount.match(pattern);

  return match ? parseInt(match[1], 10) : 0;
}

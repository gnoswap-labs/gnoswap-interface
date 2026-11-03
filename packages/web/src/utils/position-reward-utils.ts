import { GNOT_TOKEN, GNS_TOKEN, WUGNOT_TOKEN, XGNS_TOKEN } from "@common/values/token-constant";
import { PositionRewardForTooltip } from "@components/common/reward-tooltip-content/RewardTooltipContent";
import { DisplayRewardType } from "@constants/option.constant";
import { TokenModel } from "@models/token/token-model";
import { PositionRewardsGroupResponse } from "@repositories/position/response";
import { AmountConverter } from "@services/converters/common/amount";

const REWARD_GROUPS = {
  swapFee: "SWAP_FEE",
  internalReward: "INTERNAL_REWARD",
  externalReward: "EXTERNAL_REWARD",
} as const;

export const buildClaimedRewardInfo = (
  claimed: PositionRewardsGroupResponse,
  tokens: TokenModel[],
): Record<DisplayRewardType, PositionRewardForTooltip[]> => {
  const tokenByPath = new Map(
    [GNOT_TOKEN, GNS_TOKEN, WUGNOT_TOKEN, XGNS_TOKEN, ...tokens].map(token => [token.path, token]),
  );
  const result: Record<DisplayRewardType, PositionRewardForTooltip[]> = {
    SWAP_FEE: [],
    INTERNAL_REWARD: [],
    EXTERNAL_REWARD: [],
    NONE: [],
  };

  (Object.keys(REWARD_GROUPS) as (keyof typeof REWARD_GROUPS)[]).forEach(group => {
    const rewardType = REWARD_GROUPS[group];
    result[rewardType] = claimed[group].map(item => {
      const knownToken = tokenByPath.get(item.tokenPath);
      const symbol = item.tokenPath.split("/").pop() || item.tokenPath;
      const token: TokenModel = knownToken ?? {
        path: item.tokenPath,
        priceID: item.tokenPath,
        type: "GRC20",
        chainId: "",
        createdAt: "",
        name: item.tokenPath,
        symbol,
        displaySymbol: symbol,
        logoURI: "",
        decimals: 0,
      };

      return {
        rewardType,
        token,
        // Historical USD remains useful even if delisted token decimals are unavailable.
        amount: knownToken ? Number(AmountConverter.convertSingle(knownToken, item.amount)) : null,
        usd: Number(item.usdValue),
        accumulatedRewardOf1d: null,
        accumulatedRewardOf1dUsd: null,
      };
    });
  });

  return result;
};

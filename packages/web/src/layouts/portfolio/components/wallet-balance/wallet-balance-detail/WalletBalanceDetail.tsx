import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import Button, { ButtonHierarchy } from "@components/common/button/Button";
import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";
import RewardTooltipContent, {
  PositionRewardForTooltip,
} from "@components/common/reward-tooltip-content/RewardTooltipContent";
import { DisplayRewardType } from "@constants/option.constant";
import { TokenModel } from "@models/token/token-model";
import { TokenPriceModel } from "@models/token/token-price-model";
import {
  PositionRewardTokenAmount,
  PositionRewardsGroupResponse,
  PositionRewardsResponse,
  PositionSummaryResponse,
} from "@repositories/position/response";
import { AmountConverter } from "@services/converters/common/amount";
import { DEVICE_TYPE } from "@styles/media";

import StakedPostionsTooltipContent from "./sateked-positions-tooltip/StakedPositinosTooltipContent";
import WalletBalanceDetailInfo from "./wallet-balance-detail-info/WalletBalanceDetailInfo";

import { WalletBalanceDetailWrapper } from "./WalletBalanceDetail.styles";

export interface BalanceDetailInfo {
  availableBalance: string;
  stakedLP: string;
  unstakedLP: string;
  claimableRewards: string;
  loadingBalance: boolean;
  loadingPositions: boolean;
  loadingRewards: boolean;
  totalClaimedRewards: string;
}

export interface WalletBalanceDetailProps {
  balanceDetailInfo: BalanceDetailInfo;
  connected: boolean;
  isSwitchNetwork: boolean;
  claimAll: () => void;
  breakpoint: DEVICE_TYPE;
  loadngTransactionClaim: boolean;
  positionRewards: PositionRewardsResponse | null;
  positionSummary: PositionSummaryResponse | null;
  tokens: TokenModel[];
  tokenPrices: Record<string, TokenPriceModel>;
}

type RewardGroupKey = "swapFee" | "internalReward" | "externalReward";

const REWARD_GROUP_TO_DISPLAY: Record<RewardGroupKey, DisplayRewardType> = {
  swapFee: "SWAP_FEE",
  internalReward: "INTERNAL_REWARD",
  externalReward: "EXTERNAL_REWARD",
};

const emptyTooltipInfo = (): { [key in DisplayRewardType]: PositionRewardForTooltip[] } => ({
  SWAP_FEE: [],
  INTERNAL_REWARD: [],
  EXTERNAL_REWARD: [],
  NONE: [],
});

const WalletBalanceDetail: React.FC<WalletBalanceDetailProps> = ({
  balanceDetailInfo,
  connected,
  claimAll,
  breakpoint,
  isSwitchNetwork,
  loadngTransactionClaim,
  positionRewards,
  positionSummary,
  tokens,
}) => {
  const { t } = useTranslation();

  const tokenByPath = useMemo(() => {
    const map: Record<string, TokenModel> = {};
    tokens.forEach(token => {
      map[token.path] = token;
    });
    return map;
  }, [tokens]);

  const buildRewardInfo = (group: PositionRewardsGroupResponse) => {
    const result = emptyTooltipInfo();

    (Object.keys(REWARD_GROUP_TO_DISPLAY) as RewardGroupKey[]).forEach(groupKey => {
      const displayType = REWARD_GROUP_TO_DISPLAY[groupKey];
      const items: PositionRewardTokenAmount[] = group[groupKey] ?? [];

      const tooltipItems: PositionRewardForTooltip[] = [];

      items.forEach(item => {
        const token = tokenByPath[item.tokenPath];
        if (!token) return;

        tooltipItems.push({
          rewardType: displayType,
          token,
          amount: Number(AmountConverter.convertSingle(token, item.amount)),
          usd: Number(item.usdValue),
          accumulatedRewardOf1d: null,
          accumulatedRewardOf1dUsd: null,
        });
      });

      result[displayType] = tooltipItems;
    });

    return result;
  };

  const { claimableRewardInfo, claimedRewardInfo } = useMemo(() => {
    if (!positionRewards) {
      return {
        claimableRewardInfo: emptyTooltipInfo(),
        claimedRewardInfo: emptyTooltipInfo(),
      };
    }

    return {
      claimableRewardInfo: buildRewardInfo(positionRewards.claimable),
      claimedRewardInfo: buildRewardInfo(positionRewards.claimed),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [positionRewards, tokenByPath]);

  const hasInfo = (data: { [key in DisplayRewardType]: PositionRewardForTooltip[] }): boolean => {
    return data.SWAP_FEE.length > 0 || data.INTERNAL_REWARD.length > 0 || data.EXTERNAL_REWARD.length > 0;
  };

  const isClaimableAll = useMemo(() => {
    if (balanceDetailInfo.loadingRewards) return false;
    return hasInfo(claimableRewardInfo);
  }, [claimableRewardInfo, balanceDetailInfo.loadingRewards]);

  return (
    <WalletBalanceDetailWrapper>
      <WalletBalanceDetailInfo
        loading={balanceDetailInfo.loadingBalance}
        title={t("Wallet:overral.availBal.label")}
        value={balanceDetailInfo.availableBalance}
        tooltip={t("Wallet:overral.availBal.tooltip")}
        connected={connected}
        isSwitchNetwork={isSwitchNetwork}
        breakpoint={breakpoint}
      />
      <WalletBalanceDetailInfo
        loading={balanceDetailInfo.loadingPositions}
        title={t("Wallet:overral.stakedPosi.label")}
        value={balanceDetailInfo.stakedLP}
        tooltip={t("Wallet:overral.stakedPosi.tooltip")}
        connected={connected}
        isSwitchNetwork={isSwitchNetwork}
        valueTooltip={
          connected &&
          !isSwitchNetwork &&
          balanceDetailInfo.stakedLP !== "-" &&
          positionSummary &&
          positionSummary.stakedCount > 0 ? (
            <StakedPostionsTooltipContent count={positionSummary.stakedCount} />
          ) : undefined
        }
        interactiveValueTooltip
        breakpoint={breakpoint}
      />
      <WalletBalanceDetailInfo
        loading={balanceDetailInfo.loadingRewards}
        title={t("Wallet:overral.totalClaimed.label")}
        value={balanceDetailInfo.totalClaimedRewards}
        tooltip={t("Wallet:overral.totalClaimed.tooltip")}
        connected={connected}
        isSwitchNetwork={isSwitchNetwork}
        valueTooltip={hasInfo(claimedRewardInfo) ? <RewardTooltipContent rewardInfo={claimedRewardInfo} /> : undefined}
        breakpoint={breakpoint}
      />
      <WalletBalanceDetailInfo
        loading={balanceDetailInfo.loadingRewards}
        title={t("Wallet:overral.claimableReward.label")}
        tooltip={t("Wallet:overral.claimableReward.tooltip")}
        value={balanceDetailInfo.claimableRewards}
        connected={connected}
        isSwitchNetwork={isSwitchNetwork}
        valueTooltip={isClaimableAll ? <RewardTooltipContent rewardInfo={claimableRewardInfo} /> : undefined}
        className="claimable-rewards"
        button={
          isClaimableAll ? (
            <Button
              style={{
                minWidth: 86,
                fontType: "p1",
                padding: loadngTransactionClaim ? "8px 16px" : "10px 16px",
                hierarchy: ButtonHierarchy.Primary,
              }}
              text={loadngTransactionClaim ? "" : t("Wallet:overral.claimAll.btn")}
              onClick={claimAll}
              disabled={!connected || isSwitchNetwork || !isClaimableAll || balanceDetailInfo.loadingRewards}
              leftIcon={loadngTransactionClaim ? <LoadingSpinner className="loading-button" /> : undefined}
            />
          ) : undefined
        }
        breakpoint={breakpoint}
      />
    </WalletBalanceDetailWrapper>
  );
};

export default WalletBalanceDetail;

// Todo: Delete this code
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import Button, { ButtonHierarchy } from "@components/common/button/Button";
import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";
import RewardTooltipContent, {
  PositionRewardForTooltip,
} from "@components/common/reward-tooltip-content/RewardTooltipContent";
import { RewardType, DisplayRewardType } from "@constants/option.constant";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { TokenPriceModel } from "@models/token/token-price-model";
import { DEVICE_TYPE } from "@styles/media";
import { mapToDisplayRewardType } from "@utils/reward-utils";

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
  totalClaimedRewards: string;
}

export interface WalletBalanceDetailProps {
  balanceDetailInfo: BalanceDetailInfo;
  connected: boolean;
  isSwitchNetwork: boolean;
  claimAll: () => void;
  breakpoint: DEVICE_TYPE;
  loadngTransactionClaim: boolean;
  positions: PoolPositionModel[];
  tokenPrices: Record<string, TokenPriceModel>;
}

const WalletBalanceDetail: React.FC<WalletBalanceDetailProps> = ({
  balanceDetailInfo,
  connected,
  claimAll,
  breakpoint,
  isSwitchNetwork,
  loadngTransactionClaim,
  positions,
  tokenPrices,
}) => {
  const { t } = useTranslation();

  const stakedPositions = useMemo(() => {
    if (!positions || positions.length === 0) return [];

    return positions
      .filter(item => item.staked === true)
      .map(item => ({
        lpId: item.lpTokenId,
        totalValue: item.stakedUsdValue,
        stakedDate: item.stakedAt,
        tokenUri: item.tokenUri,
      }));
  }, [positions]);

  const { claimedRewardInfo, claimableRewardInfo } = useMemo((): {
    claimedRewardInfo: { [key in DisplayRewardType]: PositionRewardForTooltip[] };
    claimableRewardInfo: { [key in DisplayRewardType]: PositionRewardForTooltip[] };
  } => {
    const initRewardTypeMap = () => ({
      SWAP_FEE: {},
      INTERNAL_REWARD: {},
      EXTERNAL_REWARD: {},
      NONE: {},
    });

    const claimableMap: {
      [key in DisplayRewardType]: { [key in string]: PositionRewardForTooltip };
    } = initRewardTypeMap();

    const claimedMap: {
      [key in DisplayRewardType]: { [key in string]: PositionRewardForTooltip };
    } = initRewardTypeMap();

    if (!positions || positions.length === 0) {
      return {
        claimedRewardInfo: {
          SWAP_FEE: [],
          INTERNAL_REWARD: [],
          EXTERNAL_REWARD: [],
          NONE: [],
        },
        claimableRewardInfo: {
          SWAP_FEE: [],
          INTERNAL_REWARD: [],
          EXTERNAL_REWARD: [],
          NONE: [],
        },
      };
    }

    const getAccumulatedRewardOf1d = (cached: PositionRewardForTooltip, current: { accuReward1D: string | null }) => {
      if (cached.accumulatedRewardOf1d === null) {
        if (current.accuReward1D === null) {
          return null;
        }
        return Number(current.accuReward1D);
      }
      if (current.accuReward1D === null) {
        return cached.accumulatedRewardOf1d;
      }
      return cached.accumulatedRewardOf1d + Number(current.accuReward1D);
    };

    const processClaimableRewards = () => {
      positions
        .flatMap(position => position.rewards)
        .forEach(reward => {
          const rewardType = reward.rewardToken.rewardType as RewardType;
          const displayRewardType = mapToDisplayRewardType(rewardType);

          if (!claimableMap[displayRewardType]) {
            console.warn(`Invalid rewardType: ${rewardType}, mapped to ${displayRewardType}`);
            return;
          }

          const tokenPrice = tokenPrices[reward.rewardToken.priceID]?.usd
            ? Number(tokenPrices[reward.rewardToken.priceID].usd)
            : null;

          const rewardInfo: PositionRewardForTooltip = {
            token: reward.rewardToken,
            rewardType: displayRewardType,
            amount: reward.claimableAmount ? Number(reward.claimableAmount) : null,
            usd: reward.claimableUsd ? Number(reward.claimableUsd) : null,
            accumulatedRewardOf1d: reward.accuReward1D ? Number(reward.accuReward1D) : null,
            accumulatedRewardOf1dUsd:
              reward.accuReward1D && tokenPrice ? Number(reward.accuReward1D) * tokenPrice : null,
          };

          const existingReward = claimableMap[displayRewardType]?.[reward.rewardToken.priceID];

          if (existingReward) {
            const accumulatedRewardOf1d = getAccumulatedRewardOf1d(existingReward, reward);
            const accumulatedRewardOf1dUsd =
              accumulatedRewardOf1d !== null && tokenPrice !== null ? accumulatedRewardOf1d * tokenPrice : null;

            claimableMap[displayRewardType][reward.rewardToken.priceID] = {
              ...existingReward,
              amount: (existingReward.amount || 0) + (rewardInfo.amount || 0),
              usd:
                existingReward.usd !== null && rewardInfo.usd !== null
                  ? existingReward.usd + rewardInfo.usd
                  : existingReward.usd || rewardInfo.usd,
              accumulatedRewardOf1d,
              accumulatedRewardOf1dUsd,
            };
          } else {
            claimableMap[displayRewardType][reward.rewardToken.priceID] = rewardInfo;
          }
        });
    };

    const processClaimedRewards = () => {
      positions
        .flatMap(position => position.claimedRewards)
        .forEach(claimed => {
          const rewardType = claimed.rewardToken.rewardType as RewardType;
          const displayRewardType = mapToDisplayRewardType(rewardType);

          if (!claimedMap[displayRewardType]) {
            console.warn(`Invalid rewardType: ${rewardType}, mapped to ${displayRewardType}`);
            return;
          }

          const tokenPrice = tokenPrices[claimed.rewardToken.priceID]?.usd
            ? Number(tokenPrices[claimed.rewardToken.priceID].usd)
            : null;

          const claimedAmount = Number(claimed.claimedAmount);
          const claimedUsd = tokenPrice ? claimedAmount * tokenPrice : null;

          const rewardInfo: PositionRewardForTooltip = {
            token: claimed.rewardToken,
            rewardType: displayRewardType,
            amount: claimedAmount,
            usd: claimedUsd,
            accumulatedRewardOf1d: null,
            accumulatedRewardOf1dUsd: null,
          };

          const existingReward = claimedMap[displayRewardType]?.[claimed.rewardToken.priceID];

          if (existingReward) {
            claimedMap[displayRewardType][claimed.rewardToken.priceID] = {
              ...existingReward,
              amount: (existingReward.amount || 0) + claimedAmount,
              usd:
                existingReward.usd !== null && claimedUsd !== null
                  ? existingReward.usd + claimedUsd
                  : existingReward.usd || claimedUsd,
            };
          } else {
            claimedMap[displayRewardType][claimed.rewardToken.priceID] = rewardInfo;
          }
        });
    };

    processClaimableRewards();
    processClaimedRewards();

    return {
      claimedRewardInfo: {
        SWAP_FEE: Object.values(claimedMap.SWAP_FEE),
        INTERNAL_REWARD: Object.values(claimedMap.INTERNAL_REWARD),
        EXTERNAL_REWARD: Object.values(claimedMap.EXTERNAL_REWARD),
        NONE: Object.values(claimedMap.NONE),
      },
      claimableRewardInfo: {
        SWAP_FEE: Object.values(claimableMap.SWAP_FEE).filter(reward => reward.amount && reward.amount > 0),
        INTERNAL_REWARD: Object.values(claimableMap.INTERNAL_REWARD).filter(
          reward => reward.amount && reward.amount > 0,
        ),
        EXTERNAL_REWARD: Object.values(claimableMap.EXTERNAL_REWARD).filter(
          reward => reward.amount && reward.amount > 0,
        ),
        NONE: Object.values(claimableMap.NONE).filter(reward => reward.amount && reward.amount > 0),
      },
    };
  }, [positions, tokenPrices]);

  const hasInfo = (data: {
    [key in DisplayRewardType]: PositionRewardForTooltip[];
  }): boolean => {
    if (data.SWAP_FEE.length === 0 && data.INTERNAL_REWARD.length === 0 && data.EXTERNAL_REWARD.length === 0)
      return false;
    return true;
  };

  const isClaimableAll = useMemo(() => {
    if (balanceDetailInfo.loadingPositions) return false;
    return hasInfo(claimableRewardInfo);
  }, [claimableRewardInfo, balanceDetailInfo.loadingPositions]);

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
          stakedPositions.length > 0 ? <StakedPostionsTooltipContent poolStakings={stakedPositions} /> : undefined
        }
        breakpoint={breakpoint}
      />
      {/* Todo: Change to claimableRewardInfo -> claimedRewardInfo */}
      <WalletBalanceDetailInfo
        loading={balanceDetailInfo.loadingPositions}
        title={t("Wallet:overral.totalClaimed.label")}
        value={balanceDetailInfo.totalClaimedRewards}
        tooltip={t("Wallet:overral.totalClaimed.tooltip")}
        connected={connected}
        isSwitchNetwork={isSwitchNetwork}
        valueTooltip={hasInfo(claimedRewardInfo) ? <RewardTooltipContent rewardInfo={claimedRewardInfo} /> : undefined}
        breakpoint={breakpoint}
      />
      <WalletBalanceDetailInfo
        loading={balanceDetailInfo.loadingPositions}
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
              disabled={!connected || isSwitchNetwork || !isClaimableAll || balanceDetailInfo.loadingPositions}
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

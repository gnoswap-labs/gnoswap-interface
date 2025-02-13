// Todo: Delete this code
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import Button, { ButtonHierarchy } from "@components/common/button/Button";
import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { TokenPriceModel } from "@models/token/token-price-model";
import { DEVICE_TYPE } from "@styles/media";
import { RewardType } from "@constants/option.constant";
import { makeDisplayTokenAmount } from "@utils/token-utils";
import RewardTooltipContent, {
  PositionRewardForTooltip,
} from "@components/common/reward-tooltip-content/RewardTooltipContent";

import WalletBalanceDetailInfo from "./wallet-balance-detail-info/WalletBalanceDetailInfo";

import { WalletBalanceDetailWrapper } from "./WalletBalanceDetail.styles";
import StakedPostionsTooltipContent from "./sateked-positions-tooltip/StakedPositinosTooltipContent";

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
        tokenA: item.pool.tokenA,
        tokenB: item.pool.tokenB,
        totalValue: item.stakedUsdValue,
        stakedDate: item.stakedAt,
      }));
  }, [positions]);

  const { claimedRewardInfo, claimableRewardInfo } = useMemo((): {
    claimedRewardInfo: { [key in RewardType]: PositionRewardForTooltip[] };
    claimableRewardInfo: { [key in RewardType]: PositionRewardForTooltip[] };
  } => {
    const initRewardTypeMap = () => ({
      SWAP_FEE: {},
      INTERNAL: {},
      EXTERNAL: {},
    });

    const claimableMap: {
      [key in RewardType]: { [key in string]: PositionRewardForTooltip };
    } = initRewardTypeMap();

    const claimedMap: {
      [key in RewardType]: { [key in string]: PositionRewardForTooltip };
    } = initRewardTypeMap();

    if (!positions || positions.length === 0) {
      return {
        claimedRewardInfo: {
          SWAP_FEE: [],
          INTERNAL: [],
          EXTERNAL: [],
        },
        claimableRewardInfo: {
          SWAP_FEE: [],
          INTERNAL: [],
          EXTERNAL: [],
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
        .flatMap(position => position.reward)
        .forEach(reward => {
          if (!claimableMap[reward.rewardType]) {
            console.warn(`Invalid rewardType: ${reward.rewardType}`);
            return;
          }

          const tokenPrice = tokenPrices[reward.rewardToken.priceID]?.usd
            ? Number(tokenPrices[reward.rewardToken.priceID].usd)
            : null;

          const rewardInfo: PositionRewardForTooltip = {
            token: reward.rewardToken,
            rewardType: reward.rewardType as RewardType,
            amount: reward.claimableAmount ? Number(reward.claimableAmount) : null,
            usd: reward.claimableUsd ? Number(reward.claimableUsd) : null,
            accumulatedRewardOf1d: reward.accuReward1D ? Number(reward.accuReward1D) : null,
            accumulatedRewardOf1dUsd:
              reward.accuReward1D && tokenPrice ? Number(reward.accuReward1D) * tokenPrice : null,
          };

          const existingReward = claimableMap[rewardInfo.rewardType]?.[reward.rewardToken.priceID];

          if (existingReward) {
            const accumulatedRewardOf1d = getAccumulatedRewardOf1d(existingReward, reward);
            const accumulatedRewardOf1dUsd =
              accumulatedRewardOf1d !== null && tokenPrice !== null ? accumulatedRewardOf1d * tokenPrice : null;

            claimableMap[rewardInfo.rewardType][reward.rewardToken.priceID] = {
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
            claimableMap[rewardInfo.rewardType][reward.rewardToken.priceID] = rewardInfo;
          }
        });
    };

    const processClaimedRewards = () => {
      positions
        .flatMap(position => position.claimedRewards)
        .forEach(claimed => {
          if (!claimedMap[claimed.rewardType]) {
            console.warn(`Invalid rewardType: ${claimed.rewardType}`);
            return;
          }

          const tokenPrice = tokenPrices[claimed.rewardToken.priceID]?.usd
            ? Number(tokenPrices[claimed.rewardToken.priceID].usd)
            : null;

          const claimedAmount = Number(claimed.claimedAmount);
          const claimedUsd = tokenPrice ? claimedAmount * tokenPrice : null;

          const rewardInfo: PositionRewardForTooltip = {
            token: claimed.rewardToken,
            rewardType: claimed.rewardType,
            amount: claimedAmount,
            usd: claimedUsd,
            accumulatedRewardOf1d: null,
            accumulatedRewardOf1dUsd: null,
          };

          const existingReward = claimedMap[rewardInfo.rewardType]?.[claimed.rewardToken.priceID];

          if (existingReward) {
            claimedMap[rewardInfo.rewardType][claimed.rewardToken.priceID] = {
              ...existingReward,
              amount: (existingReward.amount || 0) + claimedAmount,
              usd:
                existingReward.usd !== null && claimedUsd !== null
                  ? existingReward.usd + claimedUsd
                  : existingReward.usd || claimedUsd,
            };
          } else {
            claimedMap[rewardInfo.rewardType][claimed.rewardToken.priceID] = rewardInfo;
          }
        });
    };

    processClaimableRewards();
    processClaimedRewards();

    return {
      claimedRewardInfo: {
        SWAP_FEE: Object.values(claimedMap.SWAP_FEE),
        INTERNAL: Object.values(claimedMap.INTERNAL),
        EXTERNAL: Object.values(claimedMap.EXTERNAL),
      },
      claimableRewardInfo: {
        SWAP_FEE: Object.values(claimableMap.SWAP_FEE).filter(reward => reward.amount && reward.amount > 0),
        INTERNAL: Object.values(claimableMap.INTERNAL).filter(reward => reward.amount && reward.amount > 0),
        EXTERNAL: Object.values(claimableMap.EXTERNAL).filter(reward => reward.amount && reward.amount > 0),
      },
    };
  }, [positions, tokenPrices]);

  console.log(claimableRewardInfo, "claimableRewardInfo?");

  const hasInfo = (data: {
    [key in RewardType]: PositionRewardForTooltip[];
  }): boolean => {
    if (data.SWAP_FEE.length === 0 && data.INTERNAL.length === 0 && data.EXTERNAL.length === 0) return false;
    return true;
  };

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
        valueTooltip={
          hasInfo(claimableRewardInfo) ? <RewardTooltipContent rewardInfo={claimableRewardInfo} /> : undefined
        }
        className="claimable-rewards"
        button={
          <Button
            style={{
              minWidth: 86,
              fontType: "p1",
              padding: loadngTransactionClaim ? "8px 16px" : "10px 16px",
              hierarchy: ButtonHierarchy.Primary,
            }}
            text={loadngTransactionClaim ? "" : t("Wallet:overral.claimAll.btn")}
            onClick={claimAll}
            disabled={connected === false || isSwitchNetwork || Number(balanceDetailInfo.claimableRewards) === 0}
            leftIcon={loadngTransactionClaim ? <LoadingSpinner className="loading-button" /> : undefined}
          />
        }
        breakpoint={breakpoint}
      />
    </WalletBalanceDetailWrapper>
  );
};

export default WalletBalanceDetail;

import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import Button, { ButtonHierarchy } from "@components/common/button/Button";
import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { TokenPriceModel } from "@models/token/token-price-model";
import { DEVICE_TYPE } from "@styles/media";
import { RewardType } from "@constants/option.constant";
import { makeDisplayTokenAmount } from "@utils/token-utils";
import RewardTooltipContent, { PositionRewardForTooltip } from "@components/common/reward-tooltip-content/RewardTooltipContent";

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
    if (!positions || positions.length === 0)
      return [];

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
    const claimableMap: {
      [key in RewardType]: { [key in string]: PositionRewardForTooltip };
    } = {
      SWAP_FEE: {},
      INTERNAL: {},
      EXTERNAL: {},
    };
    const claimedMap: {
      [key in RewardType]: { [key in string]: PositionRewardForTooltip };
    } = {
      SWAP_FEE: {},
      INTERNAL: {},
      EXTERNAL: {},
    };

    if (!positions || positions.length === 0)
      return {
        claimedRewardInfo: {
          SWAP_FEE: Object.values(claimedMap["SWAP_FEE"]),
          INTERNAL: Object.values(claimedMap["INTERNAL"]),
          EXTERNAL: Object.values(claimedMap["EXTERNAL"]),
        },
        claimableRewardInfo: {
          SWAP_FEE: Object.values(claimableMap["SWAP_FEE"]),
          INTERNAL: Object.values(claimableMap["INTERNAL"]),
          EXTERNAL: Object.values(claimableMap["EXTERNAL"]),
        },
      };

    const getAccumulatedRewardOf1d = (
      cached: PositionRewardForTooltip,
      current: { accumulatedRewardOf1d: number | null },
    ) => {
      if (cached.accumulatedRewardOf1d === null) {
        if (current.accumulatedRewardOf1d === null) {
          return null;
        }
        return current.accumulatedRewardOf1d;
      }
      if (current.accumulatedRewardOf1d === null) {
        return cached.accumulatedRewardOf1d;
      }
      return cached.accumulatedRewardOf1d + current.accumulatedRewardOf1d;
    };

    positions
      .flatMap(position => position.reward)
      .map(reward => ({
        token: reward.rewardToken,
        rewardType: reward.rewardType,
        balance: reward.totalAmount || 0,
        balanceUSD:
          makeDisplayTokenAmount(
            reward.rewardToken,
            Number(reward.totalAmount) *
              Number(tokenPrices[reward.rewardToken.priceID]?.usd),
          ) || 0,
        amount: reward.claimableAmount ? Number(reward.claimableAmount) : null,
        usd: reward.claimableUsd ? Number(reward.claimableUsd) : null,
        accumulatedRewardOf1d: reward.accuReward1D
          ? Number(reward.accuReward1D)
          : null,
        claimableUsdValue: reward.claimableUsd
          ? Number(reward.claimableUsd)
          : null,
      }))
      .forEach(rewardInfo => {
        const existReward =
          claimableMap[rewardInfo.rewardType]?.[rewardInfo.token.priceID];
        const tokenPrice = tokenPrices[rewardInfo.token.priceID].usd
          ? Number(tokenPrices[rewardInfo.token.priceID].usd)
          : null;
        if (existReward) {
          const accumulatedRewardOf1d = getAccumulatedRewardOf1d(
            existReward,
            rewardInfo,
          );
          const accumulatedRewardOf1dUsd =
            accumulatedRewardOf1d !== null && tokenPrice !== null
              ? accumulatedRewardOf1d * tokenPrice
              : null;

          claimableMap[rewardInfo.rewardType][rewardInfo.token.priceID] = {
            ...existReward,
            usd: (() => {
              if (existReward.usd === null && rewardInfo.usd === null) {
                return null;
              }

              if (existReward.usd === null) {
                return rewardInfo.usd;
              }

              if (rewardInfo.usd === null) {
                return existReward.usd;
              }

              return existReward.usd + rewardInfo.usd;
            })(),
            amount: Number(existReward.amount || 0) + Number(rewardInfo.amount),
            accumulatedRewardOf1d: accumulatedRewardOf1d,
            accumulatedRewardOf1dUsd: accumulatedRewardOf1dUsd,
          };
        } else {
          claimableMap[rewardInfo.rewardType][rewardInfo.token.priceID] = {
            ...rewardInfo,
            accumulatedRewardOf1dUsd:
              rewardInfo.accumulatedRewardOf1d !== null && tokenPrice !== null
                ? tokenPrice * rewardInfo.accumulatedRewardOf1d
                : null,
          };
        }
      });

    return {
      claimedRewardInfo: {
        SWAP_FEE: Object.values(claimedMap["SWAP_FEE"]),
        INTERNAL: Object.values(claimedMap["INTERNAL"]),
        EXTERNAL: Object.values(claimedMap["EXTERNAL"]),
      },
      claimableRewardInfo: {
        SWAP_FEE: Object.values(claimableMap["SWAP_FEE"]),
        INTERNAL: Object.values(claimableMap["INTERNAL"]),
        EXTERNAL: Object.values(claimableMap["EXTERNAL"]),
      },
    };
  }, [positions, tokenPrices]);

  const hasInfo = (data: {[key in RewardType]: PositionRewardForTooltip[]}): boolean => {
    if (
      data.SWAP_FEE.length === 0 &&
      data.INTERNAL.length === 0 &&
      data.EXTERNAL.length === 0
    )
      return false;
    return true;
  };

  return (
    <WalletBalanceDetailWrapper>
      <WalletBalanceDetailInfo
        loading={balanceDetailInfo.loadingBalance}
        title={t("Wallet:overral.availBal.label")}
        value={balanceDetailInfo.availableBalance}
        tooltip={t("Wallet:overral.availBal.tooltip")}
        breakpoint={breakpoint}
      />
      <WalletBalanceDetailInfo
        loading={balanceDetailInfo.loadingPositions}
        title={t("Wallet:overral.stakedPosi.label")}
        value={balanceDetailInfo.stakedLP}
        tooltip={t("Wallet:overral.stakedPosi.tooltip")}
        valueTooltip={
          stakedPositions.length> 0 ? (
            <StakedPostionsTooltipContent poolStakings={stakedPositions} />
          ) : undefined
        }
        breakpoint={breakpoint}
      />
      <WalletBalanceDetailInfo
        loading={balanceDetailInfo.loadingPositions}
        title={t("Wallet:overral.totalClaimed.label")}
        value={balanceDetailInfo.totalClaimedRewards}
        tooltip={t("Wallet:overral.totalClaimed.tooltip")}
        valueTooltip={
          hasInfo(claimedRewardInfo) ? (
            <RewardTooltipContent rewardInfo={claimedRewardInfo} />
          ) : undefined
        }
        breakpoint={breakpoint}
      />
      <WalletBalanceDetailInfo
        loading={balanceDetailInfo.loadingPositions}
        title={t("Wallet:overral.claimableReward.label")}
        tooltip={t("Wallet:overral.claimableReward.tooltip")}
        value={balanceDetailInfo.claimableRewards}
        valueTooltip={
          hasInfo(claimableRewardInfo) ? (
            <RewardTooltipContent rewardInfo={claimableRewardInfo} />
          ) : undefined
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
            text={
              loadngTransactionClaim ? "" : t("Wallet:overral.claimAll.btn")
            }
            onClick={claimAll}
            disabled={
              connected === false ||
              isSwitchNetwork ||
              Number(balanceDetailInfo.claimableRewards) === 0
            }
            leftIcon={
              loadngTransactionClaim ? (
                <LoadingSpinner className="loading-button" />
              ) : undefined
            }
          />
        }
        breakpoint={breakpoint}
      />
    </WalletBalanceDetailWrapper>
  );
};

export default WalletBalanceDetail;

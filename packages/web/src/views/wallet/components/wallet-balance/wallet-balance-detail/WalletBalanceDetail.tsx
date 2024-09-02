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

  const claimableRewardInfo = useMemo(():
    | { [key in RewardType]: PositionRewardForTooltip[] }
    | null => {
    const infoMap: {
      [key in RewardType]: { [key in string]: PositionRewardForTooltip };
    } = {
      SWAP_FEE: {},
      INTERNAL: {},
      EXTERNAL: {},
    };

    if (!positions || positions.length === 0)
      return {
        SWAP_FEE: Object.values(infoMap["SWAP_FEE"]),
        INTERNAL: Object.values(infoMap["INTERNAL"]),
        EXTERNAL: Object.values(infoMap["EXTERNAL"]),
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
          infoMap[rewardInfo.rewardType]?.[rewardInfo.token.priceID];
        const tokenPrice = tokenPrices[rewardInfo.token.priceID].usd
          ? Number(tokenPrices[rewardInfo.token.priceID].usd)
          : null;
        if (existReward) {
          const accumulatedRewardOf1d = (() => {
            if (
              existReward.accumulatedRewardOf1d === null &&
              rewardInfo.accumulatedRewardOf1d === null
            ) {
              return null;
            }

            if (existReward.accumulatedRewardOf1d === null) {
              return rewardInfo.accumulatedRewardOf1d;
            }

            if (rewardInfo.accumulatedRewardOf1d === null) {
              return existReward.accumulatedRewardOf1d;
            }

            return (
              existReward.accumulatedRewardOf1d +
              rewardInfo.accumulatedRewardOf1d
            );
          })();
          const accumulatedRewardOf1dUsd =
            accumulatedRewardOf1d !== null && tokenPrice !== null
              ? accumulatedRewardOf1d * tokenPrice
              : null;

          infoMap[rewardInfo.rewardType][rewardInfo.token.priceID] = {
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
          infoMap[rewardInfo.rewardType][rewardInfo.token.priceID] = {
            ...rewardInfo,
            accumulatedRewardOf1dUsd:
              rewardInfo.accumulatedRewardOf1d !== null && tokenPrice !== null
                ? tokenPrice * rewardInfo.accumulatedRewardOf1d
                : null,
          };
        }
      });

    return {
      SWAP_FEE: Object.values(infoMap["SWAP_FEE"]),
      INTERNAL: Object.values(infoMap["INTERNAL"]),
      EXTERNAL: Object.values(infoMap["EXTERNAL"]),
    };
  }, [positions, tokenPrices]);

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
        breakpoint={breakpoint}
      />
      <WalletBalanceDetailInfo
        loading={balanceDetailInfo.loadingPositions}
        title={t("Wallet:overral.totalClaimed.label")}
        value={balanceDetailInfo.totalClaimedRewards}
        tooltip={t("Wallet:overral.totalClaimed.tooltip")}
        breakpoint={breakpoint}
      />
      <WalletBalanceDetailInfo
        loading={balanceDetailInfo.loadingPositions}
        title={t("Wallet:overral.claimableReward.label")}
        tooltip={t("Wallet:overral.claimableReward.tooltip")}
        value={balanceDetailInfo.claimableRewards}
        valueTooltip={
          <RewardTooltipContent rewardInfo={claimableRewardInfo} />
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

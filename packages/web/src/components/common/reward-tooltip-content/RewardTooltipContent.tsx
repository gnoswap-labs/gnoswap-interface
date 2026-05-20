/* eslint-disable @next/next/no-img-element */
import React, { useMemo } from "react";
import BigNumber from "bignumber.js";
import { useTranslation } from "react-i18next";

import MissingLogo from "@components/common/missing-logo/MissingLogo";
import { DisplayRewardType, RewardType } from "@constants/option.constant";
import { useGnotToGnot } from "@hooks/token/data/use-gnot-wugnot";
import { TokenModel } from "@models/token/token-model";
import { formatOtherPrice, formatPoolPairAmount } from "@utils/new-number-utils";
import { RewardTooltipContentWrapper } from "./RewardTooltipContent.styles";

export interface PositionRewardForTooltip {
  rewardType: RewardType | DisplayRewardType;
  token: TokenModel;
  amount: number | null;
  usd: number | null;
  accumulatedRewardOf1d: number | null;
  accumulatedRewardOf1dUsd: number | null;
}

export interface RewardTooltipContentProps {
  rewardInfo: { [key in DisplayRewardType]: PositionRewardForTooltip[] } | null;
  sortByUsd?: boolean;
}

interface RewardCategory {
  type: DisplayRewardType;
  rewards: PositionRewardForTooltip[] | null;
  totalUSD: string;
}

const RewardTooltipContent: React.FC<RewardTooltipContentProps> = ({ rewardInfo, sortByUsd = true }) => {
  const { getGnotPath } = useGnotToGnot();
  const { t } = useTranslation();

  const sortByUsdFn = React.useCallback(
    (rewards: PositionRewardForTooltip[]) => {
      if (sortByUsd) {
        return [...rewards].sort((a, b) => (b.usd ?? 0) - (a.usd ?? 0));
      }
      return rewards;
    },
    [sortByUsd],
  );

  const calculateTotalUsd = React.useCallback((rewards: PositionRewardForTooltip[] | null): string => {
    if (!rewards || rewards.length === 0) return "-";

    const sumUSD = rewards.reduce(
      (accum, current) => (current.usd !== null ? accum.plus(current.usd) : accum),
      new BigNumber(0),
    );

    return formatOtherPrice(sumUSD.toNumber(), { isKMB: false });
  }, []);

  const processRewardsByType = React.useCallback(
    (type: DisplayRewardType): { rewards: PositionRewardForTooltip[] | null; totalUSD: string } => {
      if (!rewardInfo || rewardInfo[type].length === 0) {
        return { rewards: null, totalUSD: "-" };
      }

      const sortedRewards = sortByUsdFn([...rewardInfo[type]]);
      return {
        rewards: sortedRewards,
        totalUSD: calculateTotalUsd(sortedRewards),
      };
    },
    [rewardInfo, sortByUsd, calculateTotalUsd],
  );

  const rewardsData = useMemo<RewardCategory[]>(() => {
    const types: DisplayRewardType[] = ["SWAP_FEE", "INTERNAL_REWARD", "EXTERNAL_REWARD", "NONE"]; // Specify sort order

    return types
      .map(type => {
        const { rewards, totalUSD } = processRewardsByType(type);
        return { type, rewards, totalUSD };
      })
      .filter(({ rewards }) => rewards !== null);
  }, [processRewardsByType]);

  return (
    <RewardTooltipContentWrapper>
      {rewardsData.map(({ type, rewards, totalUSD }, idx) => (
        <React.Fragment key={type}>
          {rewards && (
            <>
              <div className="list">
                <span className="title">{t(`business:rewardType.${type.toLowerCase()}`)}</span>
                <span className="title">{totalUSD}</span>
              </div>
              {rewards.map((reward, index) => (
                <div key={index} className="list">
                  <div className="coin-info">
                    <MissingLogo
                      symbol={getGnotPath(reward.token).symbol}
                      url={getGnotPath(reward.token).logoURI}
                      className="token-logo"
                      width={20}
                      mobileWidth={20}
                    />
                    <span className="position">{getGnotPath(reward.token).displaySymbol}</span>
                  </div>
                  <span className="position">
                    {formatPoolPairAmount(reward.amount, {
                      decimals: reward.token.decimals,
                      isKMB: false,
                    })}
                  </span>
                </div>
              ))}
              {idx < rewardsData.length - 1 && <div className="divider" />}
            </>
          )}
        </React.Fragment>
      ))}
    </RewardTooltipContentWrapper>
  );
};

export default RewardTooltipContent;

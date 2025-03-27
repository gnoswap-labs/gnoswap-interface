/* eslint-disable @next/next/no-img-element */
import React, { useMemo } from "react";
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
}

const RewardTooltipContent: React.FC<RewardTooltipContentProps> = ({ rewardInfo }) => {
  const { getGnotPath } = useGnotToGnot();
  const { t } = useTranslation();

  const swapFeeRewards = useMemo(() => {
    if (!rewardInfo || rewardInfo.SWAP_FEE.length === 0) {
      return null;
    }
    return rewardInfo.SWAP_FEE.sort((a, b) => (b.usd || 0) - (a.usd || 0));
  }, [rewardInfo]);

  const internalRewards = useMemo(() => {
    if (!rewardInfo || rewardInfo.INTERNAL_REWARD.length === 0) {
      return null;
    }
    return rewardInfo.INTERNAL_REWARD.sort((a, b) => (b.usd || 0) - (a.usd || 0));
  }, [rewardInfo]);

  const externalRewards = useMemo(() => {
    if (!rewardInfo || rewardInfo.EXTERNAL_REWARD.length === 0) {
      return null;
    }
    return rewardInfo.EXTERNAL_REWARD.sort((a, b) => (b.usd || 0) - (a.usd || 0));
  }, [rewardInfo]);

  const swapFeeRewardUSD = useMemo(() => {
    const isEmpty = !swapFeeRewards || swapFeeRewards?.length === 0;

    if (isEmpty) return "-";

    const sumUSD = swapFeeRewards?.reduce((accum: null | number, current) => {
      if (accum === null && current.usd === null) {
        return null;
      }

      if (accum === null) {
        return current.usd;
      }

      if (current.usd === null) {
        return accum;
      }

      return accum + current.usd;
    }, null);
    return formatOtherPrice(sumUSD, {
      isKMB: false,
    });
  }, [swapFeeRewards]);

  const internalRewardUSD = useMemo(() => {
    const isEmpty = !internalRewards;

    if (isEmpty) return "-";

    const sumUSD = internalRewards.reduce((accum: null | number, current) => {
      if (accum === null && current.usd === null) {
        return null;
      }

      if (accum === null) {
        return current.usd;
      }

      if (current.usd === null) {
        return accum;
      }

      return accum + current.usd;
    }, null);
    return formatOtherPrice(sumUSD, {
      isKMB: false,
    });
  }, [internalRewards]);

  const externalRewardUSD = useMemo(() => {
    const isEmpty = !externalRewards;

    if (isEmpty) return "-";

    const sumUSD = externalRewards.reduce((accum: null | number, current) => {
      if (accum === null && current.usd === null) {
        return null;
      }

      if (accum === null) {
        return current.usd;
      }

      if (current.usd === null) {
        return accum;
      }

      return accum + current.usd;
    }, null);
    return formatOtherPrice(sumUSD, {
      isKMB: false,
    });
  }, [externalRewards]);

  const rewardsData = [
    { type: "SWAP_FEE", rewards: swapFeeRewards, totalUSD: swapFeeRewardUSD },
    { type: "INTERNAL", rewards: internalRewards, totalUSD: internalRewardUSD },
    { type: "EXTERNAL", rewards: externalRewards, totalUSD: externalRewardUSD },
  ].filter(({ rewards }) => rewards);

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
                    <span className="position">{getGnotPath(reward.token).symbol}</span>
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

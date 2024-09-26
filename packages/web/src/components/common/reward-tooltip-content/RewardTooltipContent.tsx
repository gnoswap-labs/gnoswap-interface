/* eslint-disable @next/next/no-img-element */
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import MissingLogo from "@components/common/missing-logo/MissingLogo";
import { RewardType } from "@constants/option.constant";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { TokenModel } from "@models/token/token-model";
import {
  formatOtherPrice,
  formatPoolPairAmount,
} from "@utils/new-number-utils";

import { RewardTooltipContentWrapper } from "./RewardTooltipContent.styles";

export interface PositionRewardForTooltip {
  rewardType: RewardType;
  token: TokenModel;
  amount: number | null;
  usd: number | null;
  accumulatedRewardOf1d: number | null;
  accumulatedRewardOf1dUsd: number | null;
}

export interface RewardTooltipContentProps {
  rewardInfo: { [key in RewardType]: PositionRewardForTooltip[] } | null;
}

const RewardTooltipContent: React.FC<
  RewardTooltipContentProps
> = ({ rewardInfo }) => {
  const { getGnotPath } = useGnotToGnot();
  const { t } = useTranslation();

  const swapFeeRewards = useMemo(() => {
    if (!rewardInfo || rewardInfo.SWAP_FEE.length === 0) {
      return null;
    }
    return rewardInfo.SWAP_FEE;
  }, [rewardInfo]);

  const internalRewards = useMemo(() => {
    if (!rewardInfo || rewardInfo.INTERNAL.length === 0) {
      return null;
    }
    return rewardInfo.INTERNAL;
  }, [rewardInfo]);

  const externalRewards = useMemo(() => {
    if (!rewardInfo || rewardInfo.EXTERNAL.length === 0) {
      return null;
    }
    return rewardInfo.EXTERNAL;
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

  return (
    <RewardTooltipContentWrapper>
      {swapFeeRewards && (
        <React.Fragment>
          <div className="list">
            <span className="title">{t("business:rewardType.swapFee")}</span>
            <span className="title">{swapFeeRewardUSD}</span>
          </div>
          {swapFeeRewards.map((reward, index) => (
            <div key={index} className="list">
              <div className="coin-info">
                <MissingLogo
                  symbol={getGnotPath(reward.token).symbol}
                  url={getGnotPath(reward.token).logoURI}
                  className="token-logo"
                  width={20}
                  mobileWidth={20}
                />
                <span className="position">
                  {getGnotPath(reward.token).symbol}
                </span>
              </div>
              <span className="position">
                {formatPoolPairAmount(reward.amount, {
                  decimals: reward.token.decimals,
                  isKMB: false,
                })}
              </span>
            </div>
          ))}
        </React.Fragment>
      )}
      {internalRewards && <div className="divider" />}
      {internalRewards && (
        <React.Fragment>
          <div className="list">
            <span className="title">{t("business:rewardType.internal")}</span>
            <span className="title">{internalRewardUSD}</span>
          </div>
          {internalRewards.map((reward, index) => (
            <div key={index} className="list">
              <div className="coin-info">
                <MissingLogo
                  symbol={getGnotPath(reward.token).symbol}
                  url={getGnotPath(reward.token).logoURI}
                  className="token-logo"
                  width={20}
                  mobileWidth={20}
                />
                <span className="position">
                  {getGnotPath(reward.token).symbol}
                </span>
              </div>
              <span className="position">
                {formatPoolPairAmount(reward.amount, {
                  decimals: reward.token.decimals,
                  isKMB: false,
                })}
              </span>
            </div>
          ))}
        </React.Fragment>
      )}
      {externalRewards && <div className="divider" />}
      {externalRewards && (
        <React.Fragment>
          <div className="list">
            <span className="title">{t("business:rewardType.external")}</span>
            <span className="title">{externalRewardUSD}</span>
          </div>
          {externalRewards.map((reward, index) => (
            <div key={index} className="list">
              <div className="coin-info">
                <MissingLogo
                  symbol={getGnotPath(reward.token).symbol}
                  url={getGnotPath(reward.token).logoURI}
                  className="token-logo"
                  width={20}
                  mobileWidth={20}
                />
                <span className="position">
                  {getGnotPath(reward.token).symbol}
                </span>
              </div>
              <span className="position">
                {formatPoolPairAmount(reward.amount, {
                  decimals: reward.token.decimals,
                  isKMB: false,
                })}
              </span>
            </div>
          ))}
        </React.Fragment>
      )}
    </RewardTooltipContentWrapper>
  );
};

export default RewardTooltipContent;

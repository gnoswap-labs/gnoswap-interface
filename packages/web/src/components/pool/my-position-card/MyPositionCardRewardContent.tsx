/* eslint-disable @next/next/no-img-element */
import React, { useMemo } from "react";
import { RewardsContent } from "./MyPositionCard.styles";
import { RewardType } from "@constants/option.constant";
import { toPriceFormatNotRounding } from "@utils/number-utils";
import { PositionRewardInfo } from "@models/position/info/position-reward-info";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import { convertToKMB } from "@utils/stake-position-utils";

export interface MyPositionRewardContentProps {
  rewardInfo: { [key in RewardType]: PositionRewardInfo[] };
}

export const MyPositionRewardContent: React.FC<
  MyPositionRewardContentProps
> = ({ rewardInfo }) => {
  const { getGnotPath } = useGnotToGnot();

  const swapFeeRewards = useMemo(() => {
    if (rewardInfo.SWAP_FEE.length === 0) {
      return null;
    }
    return rewardInfo.SWAP_FEE;
  }, [rewardInfo.SWAP_FEE]);

  const stakingRewards = useMemo(() => {
    if (rewardInfo.INTERNAL.length === 0) {
      return null;
    }
    return rewardInfo.INTERNAL;
  }, [rewardInfo.INTERNAL]);

  const externalRewards = useMemo(() => {
    if (rewardInfo.EXTERNAL.length === 0) {
      return null;
    }
    return rewardInfo.EXTERNAL;
  }, [rewardInfo.EXTERNAL]);

  const swapFeeRewardUSD = useMemo(() => {
    const sumUSD =
      swapFeeRewards?.reduce(
        (accum, current) => accum + current.claimableUSD,
        0,
      ) || 0;
    return toPriceFormatNotRounding(sumUSD, {
      usd: true,
      minLimit: 0.01,
      lestThan1Decimals: 2,
    });
  }, [swapFeeRewards]);

  const stakingRewardUSD = useMemo(() => {
    const sumUSD = rewardInfo.INTERNAL.reduce(
      (accum, current) => accum + current.claimableUSD,
      0,
    );
    return toPriceFormatNotRounding(sumUSD, {
      usd: true,
      minLimit: 0.01,
      lestThan1Decimals: 2,
    });
  }, [rewardInfo.INTERNAL]);

  const externalRewardUSD = useMemo(() => {
    const sumUSD = rewardInfo.EXTERNAL.reduce(
      (accum, current) => accum + current.claimableUSD,
      0,
    );
    return toPriceFormatNotRounding(sumUSD, {
      usd: true,
      minLimit: 0.01,
      lestThan1Decimals: 2,
    });
  }, [rewardInfo.EXTERNAL]);

  return (
    <RewardsContent>
      {swapFeeRewards && (
        <React.Fragment>
          <div className="list">
            <span className="title">Swap Fees</span>
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
                {convertToKMB(reward.claimableAmount.toString())}
              </span>
            </div>
          ))}
        </React.Fragment>
      )}
      {stakingRewards && <div className="divider" />}
      {stakingRewards && (
        <React.Fragment>
          <div className="list">
            <span className="title">Internal Rewards</span>
            <span className="title">{stakingRewardUSD}</span>
          </div>
          {stakingRewards.map((reward, index) => (
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
                {convertToKMB(reward.claimableAmount.toString())}
              </span>
            </div>
          ))}
        </React.Fragment>
      )}
      {externalRewards && <div className="divider" />}
      {externalRewards && (
        <React.Fragment>
          <div className="list">
            <span className="title">External Rewards</span>
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
                {convertToKMB(reward.claimableAmount.toString())}
              </span>
            </div>
          ))}
        </React.Fragment>
      )}
    </RewardsContent>
  );
};

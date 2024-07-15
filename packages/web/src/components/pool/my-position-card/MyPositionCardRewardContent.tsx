/* eslint-disable @next/next/no-img-element */
import React, { useMemo } from "react";
import { RewardsContent } from "./MyPositionCard.styles";
import { RewardType } from "@constants/option.constant";
import { PositionRewardInfo } from "@models/position/info/position-reward-info";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import {
  formatOtherPrice,
  formatPoolPairAmount,
} from "@utils/new-number-utils";

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

  const internalRewards = useMemo(() => {
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
    const isEmpty = !swapFeeRewards || swapFeeRewards?.length === 0;

    if (isEmpty) return "-";

    const sumUSD = swapFeeRewards?.reduce((accum: null | number, current) => {
      if (accum === null && current.claimableUSD === null) {
        return null;
      }

      if (accum === null) {
        return current.claimableUSD;
      }

      if (current.claimableUSD === null) {
        return accum;
      }

      return accum + current.claimableUSD;
    }, null);
    return formatOtherPrice(sumUSD);
  }, [swapFeeRewards]);

  const internalRewardUSD = useMemo(() => {
    const isEmpty = !internalRewards;

    if (isEmpty) return "-";

    const sumUSD = internalRewards.reduce((accum: null | number, current) => {
      if (accum === null && current.claimableUSD === null) {
        return null;
      }

      if (accum === null) {
        return current.claimableUSD;
      }

      if (current.claimableUSD === null) {
        return accum;
      }

      return accum + current.claimableUSD;
    }, null);
    return formatOtherPrice(sumUSD);
  }, [internalRewards]);

  const externalRewardUSD = useMemo(() => {
    const isEmpty = !externalRewards;

    if (isEmpty) return "-";

    const sumUSD = externalRewards.reduce((accum: null | number, current) => {
      if (accum === null && current.claimableUSD === null) {
        return null;
      }

      if (accum === null) {
        return current.claimableUSD;
      }

      if (current.claimableUSD === null) {
        return accum;
      }

      return accum + current.claimableUSD;
    }, null);
    return formatOtherPrice(sumUSD);
  }, [externalRewards]);

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
                {formatPoolPairAmount(reward.claimableAmount.toString(), {
                  decimals: reward.token.decimals,
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
            <span className="title">Internal Rewards</span>
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
                {formatPoolPairAmount(reward.claimableAmount.toString(), {
                  decimals: reward.token.decimals,
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
                {formatPoolPairAmount(reward.claimableAmount.toString(), {
                  decimals: reward.token.decimals,
                })}
              </span>
            </div>
          ))}
        </React.Fragment>
      )}
    </RewardsContent>
  );
};

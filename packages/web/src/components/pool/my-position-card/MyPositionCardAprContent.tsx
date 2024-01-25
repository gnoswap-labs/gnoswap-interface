import React, { useMemo } from "react";
import { RewardsContent } from "./MyPositionCard.styles";
import { RewardType } from "@constants/option.constant";
import { numberToFormat } from "@utils/string-utils";
import { PositionAPRInfo } from "@models/position/info/position-apr-info";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";

export interface MyPositionAprContentProps {
  rewardInfo: { [key in RewardType]: PositionAPRInfo[] };
}

export const MyPositionAprContent: React.FC<MyPositionAprContentProps> = ({ rewardInfo }) => {
  const { getGnotPath } = useGnotToGnot();

  const swapFeeRewards = useMemo(() => {
    if (rewardInfo.SWAP_FEE.length === 0) {
      return null;
    }
    return rewardInfo.SWAP_FEE;
  }, [rewardInfo.SWAP_FEE]);

  const stakingRewards = useMemo(() => {
    if (rewardInfo.STAKING.length === 0) {
      return null;
    }
    return rewardInfo.STAKING;
  }, [rewardInfo.STAKING]);

  const externalRewards = useMemo(() => {
    if (rewardInfo.EXTERNAL.length === 0) {
      return null;
    }
    return rewardInfo.EXTERNAL;
  }, [rewardInfo.EXTERNAL]);

  return (
    <RewardsContent>
      {swapFeeRewards && (
        <React.Fragment>
          <div className="list">
            <span className="title">Swap Fees</span>
            <span className="title">*Based on 7d avg</span>
          </div>
          {swapFeeRewards.map((reward, index) => (
            <div key={index} className="list">
              <div className="coin-info">
                <img
                  src={getGnotPath(reward.token).logoURI}
                  alt="token logo"
                  className="token-logo"
                />
                <span className="position">
                  {numberToFormat(reward.tokenAmountOf7d / 7, 2)} / day
                </span>
              </div>
              <span className="position">
                {numberToFormat(reward.aprOf7d, 2)}%
              </span>
            </div>
          ))}
        </React.Fragment>
      )}
      {stakingRewards && <div className="divider" />}
      {stakingRewards && (
        <React.Fragment>
          <div className="list">
            <span className="title">Staking Rewards</span>
            <span className="title"></span>
          </div>
          {stakingRewards.map((reward, index) => (
            <div key={index} className="list">
              <div className="coin-info">
                <img
                  src={getGnotPath(reward.token).logoURI}
                  alt="token logo"
                  className="token-logo"
                />
                <span className="position">
                  {numberToFormat(reward.tokenAmountOf7d / 7, 2)} / day
                </span>
              </div>
              <span className="position">
                {numberToFormat(reward.aprOf7d, 2)}%
              </span>
            </div>
          ))}
        </React.Fragment>
      )}
      {externalRewards && <div className="divider" />}
      {externalRewards && (
        <React.Fragment>
          <div className="list">
            <span className="title">External Fees</span>
            <span className="title"></span>
          </div>
          {externalRewards.map((reward, index) => (
            <div key={index} className="list">
              <div className="coin-info">
                <img
                  src={getGnotPath(reward.token).logoURI}
                  alt="token logo"
                  className="token-logo"
                />
                <span className="position">
                  {numberToFormat(reward.tokenAmountOf7d / 7, 2)} / day
                </span>
              </div>
              <span className="position">
                {numberToFormat(reward.aprOf7d, 2)}%
              </span>
            </div>
          ))}
        </React.Fragment>
      )}
    </RewardsContent>
  );
};
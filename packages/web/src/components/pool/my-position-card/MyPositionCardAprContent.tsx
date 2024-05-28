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

  return (
    <RewardsContent>
      {swapFeeRewards && (
        <React.Fragment>
          <div className="list">
            <span className="title">Swap Fees</span>
            <span className="note">Based on 7d avg</span>
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
                  {numberToFormat(reward.accuReward1D, { decimals: 2 })} / day
                </span>
              </div>
              <span className="position">
                {numberToFormat(reward.apr, { decimals: 0 })}%
              </span>
            </div>
          ))}
        </React.Fragment>
      )}
      {internalRewards && <div className="divider" />}
      {internalRewards && (
        <React.Fragment>
          <div className="list">
            <span className="title">Staking Rewards</span>
            <span className="title"></span>
          </div>
          {internalRewards.map((reward, index) => (
            <div key={index} className="list">
              <div className="coin-info">
                <img
                  src={getGnotPath(reward.token).logoURI}
                  alt="token logo"
                  className="token-logo"
                />
                <span className="position">
                  {numberToFormat(reward.accuReward1D, { decimals: 2 })} / day
                </span>
              </div>
              <span className="position">
                {numberToFormat(reward.apr, { decimals: 2 })}%
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
                  {numberToFormat(reward.accuReward1D, { decimals: 2 })} / day
                </span>
              </div>
              <span className="position">
                {numberToFormat(reward.apr, { decimals: 2 })}%
              </span>
            </div>
          ))}
        </React.Fragment>
      )}
    </RewardsContent>
  );
};
import React, { useMemo } from "react";
import { RewardsContent } from "./MyPositionCard.styles";
import { RewardType } from "@constants/option.constant";
import { numberToFormat } from "@utils/string-utils";
import { toLowerUnitFormat } from "@utils/number-utils";
import { PositionRewardInfo } from "@models/position/info/position-reward-info";

export interface MyPositionRewardContentProps {
  rewardInfo: { [key in RewardType]: PositionRewardInfo[] };
}

export const MyPositionRewardContent: React.FC<MyPositionRewardContentProps> = ({ rewardInfo }) => {
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

  const swapFeeRewardUSD = useMemo(() => {
    const sumUSD = rewardInfo.SWAP_FEE.reduce((accum, current) => accum + current.balanceUSD, 0);
    return toLowerUnitFormat(sumUSD, true);
  }, [rewardInfo.SWAP_FEE]);

  const stakingRewardUSD = useMemo(() => {
    const sumUSD = rewardInfo.STAKING.reduce((accum, current) => accum + current.balanceUSD, 0);
    return toLowerUnitFormat(sumUSD, true);
  }, [rewardInfo.STAKING]);

  const externalRewardUSD = useMemo(() => {
    const sumUSD = rewardInfo.EXTERNAL.reduce((accum, current) => accum + current.balanceUSD, 0);
    return toLowerUnitFormat(sumUSD, true);
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
                <img
                  src={reward.token.logoURI}
                  alt="token logo"
                  className="token-logo"
                />
                <span className="position">
                  {reward.token.symbol}
                </span>
              </div>
              <span className="position">
                {numberToFormat(reward.balance, reward.token.decimals)}
              </span>
            </div>
          ))}
        </React.Fragment>
      )}

      {stakingRewards && (
        <React.Fragment>
          <div className="list">
            <span className="title">Staking Rewards</span>
            <span className="title">{stakingRewardUSD}</span>
          </div>
          {stakingRewards.map((reward, index) => (
            <div key={index} className="list">
              <div className="coin-info">
                <img
                  src={reward.token.logoURI}
                  alt="token logo"
                  className="token-logo"
                />
                <span className="position">
                  {reward.token.symbol}
                </span>
              </div>
              <span className="position">
                {numberToFormat(reward.balance, reward.token.decimals)}
              </span>
            </div>
          ))}
        </React.Fragment>
      )}

      {externalRewards && (
        <React.Fragment>
          <div className="list">
            <span className="title">External Fees</span>
            <span className="title">{externalRewardUSD}</span>
          </div>
          {externalRewards.map((reward, index) => (
            <div key={index} className="list">
              <div className="coin-info">
                <img
                  src={reward.token.logoURI}
                  alt="token logo"
                  className="token-logo"
                />
                <span className="position">
                  {reward.token.symbol}
                </span>
              </div>
              <span className="position">
                {numberToFormat(reward.balance, reward.token.decimals)}
              </span>
            </div>
          ))}
        </React.Fragment>
      )}
    </RewardsContent>
  );
};
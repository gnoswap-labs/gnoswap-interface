import React, { useMemo } from "react";
import { RewardsContent } from "./MyPositionCard.styles";
import { RewardType } from "@constants/option.constant";
import { prettyNumberFloatInteger, toLowerUnitFormat } from "@utils/number-utils";
import { PositionRewardInfo } from "@models/position/info/position-reward-info";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";

export interface MyPositionRewardContentProps {
  rewardInfo: { [key in RewardType]: PositionRewardInfo[] };
}

export const MyPositionRewardContent: React.FC<MyPositionRewardContentProps> = ({ rewardInfo }) => {
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
                  src={getGnotPath(reward.token).logoURI}
                  alt="token logo"
                  className="token-logo"
                />
                <span className="position">
                  {reward.token.symbol}
                </span>
              </div>
              <span className="position">
                {prettyNumberFloatInteger(reward.balance)}
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
            <span className="title">{stakingRewardUSD}</span>
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
                  {reward.token.symbol}
                </span>
              </div>
              <span className="position">
                {prettyNumberFloatInteger(reward.balance)}
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
                <img
                  src={getGnotPath(reward.token).logoURI}
                  alt="token logo"
                  className="token-logo"
                />
                <span className="position">
                  {reward.token.symbol}
                </span>
              </div>
              <span className="position">
                {prettyNumberFloatInteger(reward.balance)}
              </span>
            </div>
          ))}
        </React.Fragment>
      )}
    </RewardsContent>
  );
};
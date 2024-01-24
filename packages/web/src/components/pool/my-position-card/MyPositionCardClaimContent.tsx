import React, { useMemo } from "react";
import { RewardsContent, TooltipDivider } from "./MyPositionCard.styles";
import { RewardType } from "@constants/option.constant";
import { toUnitFormat } from "@utils/number-utils";
import { PositionClaimInfo } from "@models/position/info/position-claim-info";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import { convertToKMB } from "@utils/stake-position-utils";


export interface MyPositionClaimContentProps {
  rewardInfo: { [key in RewardType]: PositionClaimInfo[] } | null;
  unclaimedRewardInfo: PositionClaimInfo[] | null;
}

export const MyPositionClaimContent: React.FC<MyPositionClaimContentProps> = ({ rewardInfo }) => {
  const swapFeeRewards = useMemo(() => {
    if (!rewardInfo) {
      return null;
    }
    if (rewardInfo.SWAP_FEE.length === 0) {
      return null;
    }
    return rewardInfo.SWAP_FEE;
  }, [rewardInfo]);

  const stakingRewards = useMemo(() => {
    if (!rewardInfo) {
      return null;
    }
    if (rewardInfo.STAKING.length === 0) {
      return null;
    }
    return rewardInfo.STAKING;
  }, [rewardInfo]);

  // const externalRewards = useMemo(() => {
  //   if (!rewardInfo) {
  //     return null;
  //   }
  //   if (rewardInfo.EXTERNAL.length === 0) {
  //     return null;
  //   }
  //   return rewardInfo.EXTERNAL;
  // }, [rewardInfo]);

  // const unclaimedRewards = useMemo(() => {
  //   if (!unclaimedRewardInfo || unclaimedRewardInfo.length === 0) {
  //     return null;
  //   }
  //   return unclaimedRewardInfo;
  // }, [unclaimedRewardInfo]);

  const swapFeeRewardUSD = useMemo(() => {
    if (!rewardInfo) {
      return 0;
    }
    const sumUSD = rewardInfo.SWAP_FEE.reduce((accum, current) => accum + current.balanceUSD, 0);
    return toUnitFormat(sumUSD, true);
  }, [rewardInfo]);

  const stakingRewardUSD = useMemo(() => {
    if (!rewardInfo) {
      return 0;
    }
    const sumUSD = rewardInfo.STAKING.reduce((accum, current) => accum + current.balanceUSD, 0);
    return toUnitFormat(sumUSD, true);
  }, [rewardInfo]);

  // const externalRewardUSD = useMemo(() => {
  //   if (!rewardInfo) {
  //     return 0;
  //   }
  //   const sumUSD = rewardInfo.EXTERNAL.reduce((accum, current) => accum + current.balanceUSD, 0);
  //   return toUnitFormat(sumUSD, true);
  // }, [rewardInfo]);

  // const unclaimedRewardUSD = useMemo(() => {
  //   if (!unclaimedRewardInfo) {
  //     return "$0";
  //   }
  //   const sumUSD = unclaimedRewardInfo.reduce((accum, current) => accum + current.balanceUSD, 0);
  //   return toUnitFormat(sumUSD, true);
  // }, [unclaimedRewardInfo]);

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
                <MissingLogo symbol={reward.token.symbol} url={reward.token.logoURI} className="token-logo" width={20} mobileWidth={20}/>
                <span className="position">
                  {reward.token.symbol}
                </span>
              </div>
              <span className="position">
                {convertToKMB(`${Number(reward.balance)}`)}
              </span>
            </div>
          ))}
        </React.Fragment>
      )}
      {stakingRewards && <TooltipDivider />}

      {stakingRewards && (
        <React.Fragment>
          <div className="list">
            <span className="title">Staking Rewards</span>
            <span className="title">{stakingRewardUSD}</span>
          </div>
          {stakingRewards.map((reward, index) => (
            <div key={index} className="list">
              <div className="coin-info">
                <MissingLogo symbol={reward.token.symbol} url={reward.token.logoURI} className="token-logo" width={20} mobileWidth={20}/>
                <span className="position">
                  {reward.token.symbol}
                </span>
              </div>
              <span className="position">
                {convertToKMB(`${Number(reward.balance)}`)}
              </span>
            </div>
          ))}
        </React.Fragment>
      )}
      {/* {externalRewards && <TooltipDivider />}

      {externalRewards && (
        <React.Fragment>
          <div className="list">
            <span className="title">External Fees</span>
            <span className="title">{externalRewardUSD}</span>
          </div>
          {externalRewards.map((reward, index) => (
            <div key={index} className="list">
              <div className="coin-info">
                <MissingLogo symbol={reward.token.symbol} url={reward.token.logoURI} className="token-logo" width={20} mobileWidth={20}/>
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
      )} */}
      {/* {unclaimedRewards && <TooltipDivider />}
      {unclaimedRewards && (
        <React.Fragment>
          <div className="list">
            <span className="title">Unclaimed</span>
            <span className="title">{unclaimedRewardUSD}</span>
          </div>
          {unclaimedRewards.map((reward, index) => (
            <div key={index} className="list">
              <div className="coin-info">
                <MissingLogo symbol={reward.token.symbol} url={reward.token.logoURI} className="token-logo" width={20} mobileWidth={20}/>
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
      )} */}
    </RewardsContent>
  );
};
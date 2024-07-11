import React, { useMemo } from "react";
import { RewardsContent, TooltipDivider } from "./MyPositionCard.styles";
import { RewardType } from "@constants/option.constant";
import { toPriceFormat } from "@utils/number-utils";
import { PositionClaimInfo } from "@models/position/info/position-claim-info";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import { convertToKMB } from "@utils/stake-position-utils";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";

export interface MyPositionClaimContentProps {
  rewardInfo: { [key in RewardType]: PositionClaimInfo[] } | null;
  unclaimedRewardInfo: PositionClaimInfo[] | null;
}

export const MyPositionClaimContent: React.FC<MyPositionClaimContentProps> = ({
  rewardInfo,
}) => {
  const { getGnotPath } = useGnotToGnot();
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
    if (rewardInfo.INTERNAL.length === 0) {
      return null;
    }
    return rewardInfo.INTERNAL;
  }, [rewardInfo]);

  const externalRewards = useMemo(() => {
    if (!rewardInfo) {
      return null;
    }
    if (rewardInfo.EXTERNAL.length === 0) {
      return null;
    }
    return rewardInfo.EXTERNAL;
  }, [rewardInfo]);

  const swapFeeRewardUSD = useMemo(() => {
    if (!rewardInfo) {
      return 0;
    }
    const sumUSD = rewardInfo.SWAP_FEE.reduce(
      (accum, current) => accum + current.claimableUSD,
      0,
    );
    return toPriceFormat(sumUSD, {
      minLimit: 0.01,
      usd: true,
    });
  }, [rewardInfo]);

  const internalRewardUSD = useMemo(() => {
    if (!rewardInfo) {
      return 0;
    }
    const sumUSD = rewardInfo.INTERNAL.reduce(
      (accum, current) => accum + current.claimableUSD,
      0,
    );
    return toPriceFormat(sumUSD, {
      minLimit: 0.01,
      usd: true,
    });
  }, [rewardInfo]);

  const externalRewardUSD = useMemo(() => {
    if (!rewardInfo) {
      return 0;
    }
    const sumUSD = rewardInfo.EXTERNAL.reduce(
      (accum, current) => accum + current.claimableUSD,
      0,
    );
    return toPriceFormat(sumUSD, {
      minLimit: 0.01,
      usd: true,
    });
  }, [rewardInfo]);

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
                {convertToKMB(`${Number(reward.claimableAmount)}`)}
              </span>
            </div>
          ))}
        </React.Fragment>
      )}
      {stakingRewards && <TooltipDivider />}

      {stakingRewards && (
        <React.Fragment>
          <div className="list">
            <span className="title">Internal Rewards</span>
            <span className="title">{internalRewardUSD}</span>
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
                {convertToKMB(`${Number(reward.claimableAmount)}`)}
              </span>
            </div>
          ))}
        </React.Fragment>
      )}
      {externalRewards && <TooltipDivider />}

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
                {convertToKMB(`${Number(reward.claimableAmount)}`)}
              </span>
            </div>
          ))}
        </React.Fragment>
      )}
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
                <MissingLogo symbol={getGnotPath(reward.token).symbol} url={getGnotPath(reward.token).logoURI} className="token-logo" width={20} mobileWidth={20}/>
                <span className="position">
                  {getGnotPath(reward.token).symbol}
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

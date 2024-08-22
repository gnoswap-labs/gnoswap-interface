import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import MissingLogo from "@components/common/missing-logo/MissingLogo";
import { RewardType } from "@constants/option.constant";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { PositionClaimInfo } from "@models/position/info/position-claim-info";
import {
  formatOtherPrice,
  formatPoolPairAmount
} from "@utils/new-number-utils";

import { RewardsContent, TooltipDivider } from "./MyDetailedPositionCard.styles";

export interface MyPositionClaimContentProps {
  rewardInfo: { [key in RewardType]: PositionClaimInfo[] } | null;
  unclaimedRewardInfo: PositionClaimInfo[] | null;
}

export const MyPositionClaimContent: React.FC<MyPositionClaimContentProps> = ({
  rewardInfo,
}) => {
  const { getGnotPath } = useGnotToGnot();
  const { t } = useTranslation();

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
    if (!rewardInfo || rewardInfo.SWAP_FEE.length === 0) {
      return "-";
    }
    const sumUSD = rewardInfo.SWAP_FEE.reduce(
      (accum: null | number, current) => {
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
      },
      null,
    );
    return formatOtherPrice(sumUSD, {
      isKMB: false,
    });
  }, [rewardInfo]);

  const internalRewardUSD = useMemo(() => {
    if (!rewardInfo || rewardInfo.INTERNAL.length === 0) {
      return "-";
    }
    const sumUSD = rewardInfo.INTERNAL.reduce(
      (accum: null | number, current) => {
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
      },
      null,
    );
    return formatOtherPrice(sumUSD, {
      isKMB: false,
    });
  }, [rewardInfo]);

  const externalRewardUSD = useMemo(() => {
    if (!rewardInfo || rewardInfo.EXTERNAL.length === 0) {
      return "-";
    }
    const sumUSD = rewardInfo.EXTERNAL.reduce(
      (accum: null | number, current) => {
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
      },
      null,
    );
    return formatOtherPrice(sumUSD, {
      isKMB: false,
    });
  }, [rewardInfo]);

  return (
    <RewardsContent>
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
                {formatPoolPairAmount(reward.claimableAmount, {
                  decimals: reward.token.decimals,
                  isKMB: false,
                })}
              </span>
            </div>
          ))}
        </React.Fragment>
      )}
      {stakingRewards && <TooltipDivider />}

      {stakingRewards && (
        <React.Fragment>
          <div className="list">
            <span className="title">{t("business:rewardType.internal")}</span>
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
                {formatPoolPairAmount(reward.claimableAmount, {
                  decimals: reward.token.decimals,
                  isKMB: false,
                })}
              </span>
            </div>
          ))}
        </React.Fragment>
      )}
      {externalRewards && <TooltipDivider />}

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
                {formatPoolPairAmount(reward.claimableAmount, {
                  decimals: reward.token.decimals,
                  isKMB: false,
                })}
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
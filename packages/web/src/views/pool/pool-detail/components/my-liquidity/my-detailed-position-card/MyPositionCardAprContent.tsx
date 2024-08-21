import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import MissingLogo from "@components/common/missing-logo/MissingLogo";
import { RewardType } from "@constants/option.constant";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { PositionAPRInfo } from "@models/position/info/position-apr-info";
import { formatOtherPrice, formatRate } from "@utils/new-number-utils";

import { RewardsContent } from "./MyDetailedPositionCard.styles";

export interface MyPositionAprContentProps {
  rewardInfo: { [key in RewardType]: PositionAPRInfo[] };
}

export const MyPositionAprContent: React.FC<MyPositionAprContentProps> = ({
  rewardInfo,
}) => {
  const { getGnotPath } = useGnotToGnot();
  const { t } = useTranslation();

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
            <span className="title">{t("business:rewardType.swapFee")}</span>
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
                  {formatOtherPrice(reward.accuReward1D, {
                    usd: false,
                  })}{" "}
                  / {t("common:day.base")}
                </span>
              </div>
              <span className="position">{formatRate(reward.apr)}</span>
            </div>
          ))}
        </React.Fragment>
      )}
      {internalRewards && <div className="divider" />}
      {internalRewards && (
        <React.Fragment>
          <div className="list">
            <span className="title">{t("business:rewardType.internal")}</span>
            <span className="title"></span>
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
                  {formatOtherPrice(reward.accuReward1D, { usd: false })} /{" "}
                  {t("common:day.base")}
                </span>
              </div>
              <span className="position">{formatRate(reward.apr)}</span>
            </div>
          ))}
        </React.Fragment>
      )}
      {externalRewards && <div className="divider" />}
      {externalRewards && (
        <React.Fragment>
          <div className="list">
            <span className="title">{t("business:rewardType.external")}</span>
            <span className="title"></span>
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
                  {formatOtherPrice(reward.accuReward1D, { usd: false })} /{" "}
                  {t("common:day.base")}
                </span>
              </div>
              <span className="position">{formatRate(reward.apr)}</span>
            </div>
          ))}
        </React.Fragment>
      )}
    </RewardsContent>
  );
};

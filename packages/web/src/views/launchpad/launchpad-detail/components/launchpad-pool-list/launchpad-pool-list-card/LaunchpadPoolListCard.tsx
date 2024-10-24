/* eslint-disable @next/next/no-img-element */
import React from "react";
import { cx } from "@emotion/css";
import { useAtomValue } from "jotai";

import { LaunchpadState } from "@states/index";
import { getTierDuration } from "@utils/launchpad-get-tier-number";
import { LaunchpadPoolModel } from "@models/launchpad";
import { ProjectRewardInfoModel } from "@views/launchpad/launchpad-detail/LaunchpadDetail";
import { toNumberFormat } from "@utils/number-utils";

import { Divider } from "@components/common/divider/divider";
import { CardWrapper } from "./LaunchpadPoolListCard.styles";
import LaunchpadPoolTierChip from "@views/launchpad/components/launchpad-pool-tier-chip/LaunchpadPoolTierChip";
import DepositConditionsTooltip from "@components/common/launchpad-tooltip/deposit-conditions-tooltip/DepositConditionsTooltip";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import { LAUNCHPAD_DEFAULT_DEPOSIT_TOKEN } from "@common/values/token-constant";
import { formatRate } from "@utils/new-number-utils";

interface LaunchpadPoolListCardProps {
  data: LaunchpadPoolModel;
  idx: number;
  rewardInfo: ProjectRewardInfoModel;

  selectProjectPool: (poolId: number) => void;
}

const LaunchpadPoolListCard: React.FC<LaunchpadPoolListCardProps> = ({
  data,
  idx,
  rewardInfo,
  selectProjectPool,
}) => {
  const isShowConditionTooltip = useAtomValue(
    LaunchpadState.isShowConditionTooltip,
  );
  const currentPoolId = useAtomValue(LaunchpadState.selectLaunchpadPool);

  const isActiveCard = React.useMemo(() => {
    return currentPoolId === data.id;
  }, [currentPoolId, data.id]);

  const getClaimableDays = (poolTier: string) => {
    switch (poolTier) {
      case "TIER180":
        return 14;
      case "TIER90":
        return 7;
      case "TIER30":
        return 3;
      default:
        return 0;
    }
  };

  const aprStr = data.apr ? (
    <>
      {Number(data.apr) > 100 && "✨"}
      {formatRate(data.apr)} APR
    </>
  ) : (
    "-"
  );

  return (
    <CardWrapper
      className={cx({
        active: isActiveCard,
        ongoing: data.status === "ONGOING",
      })}
      onClick={() => {
        if (data.status === "ONGOING") {
          selectProjectPool(data.id);
        }
      }}
    >
      <div className="card-header">
        <div className="card-header-title">
          <span className="title">Pool {idx}</span>
          <LaunchpadPoolTierChip poolTier={data.poolTier} />
          {data.status === "ENDED" && <div className="chip">Ended</div>}
        </div>
        {isActiveCard && isShowConditionTooltip && <DepositConditionsTooltip />}
      </div>

      <div className="card-description">
        Staking for {getTierDuration(data.poolTier)}. <br />
        Rewards claimable starting <br />
        after {getClaimableDays(data.poolTier)} days.
      </div>

      <Divider />

      <div className="data">
        <div className="key">Participants</div>
        <div className={cx("value", { ended: data.status === "ENDED" })}>
          {data.participant || "-"}
        </div>
      </div>
      <div className="data">
        <div className="key">APR</div>
        <div className={cx("value", { ended: data.status === "ENDED" })}>
          {aprStr}
        </div>
      </div>
      <div className="data">
        <div className="key">Total Deposits</div>
        <div className={cx("value", { ended: data.status === "ENDED" })}>
          <img
            className="token-image"
            src="/gns.svg"
            alt={"GNS symbol image"}
          />
          {data.depositAmount
            ? `${toNumberFormat(
                data.depositAmount,
                2,
              )} ${LAUNCHPAD_DEFAULT_DEPOSIT_TOKEN}`
            : "-"}
        </div>
      </div>
      <div className="data">
        <div className="key">Token Distributed</div>
        <div className={cx("value", { ended: data.status === "ENDED" })}>
          <MissingLogo
            symbol={rewardInfo.rewardTokenSymbol}
            url={rewardInfo.rewardTokenLogoUrl}
            width={24}
            mobileWidth={24}
          />
          {data.distributedAmount
            ? `${toNumberFormat(data.distributedAmount, 2)}`
            : "-"}{" "}
          / {data.allocation ? `${toNumberFormat(data.allocation, 2)}` : "-"}
        </div>
      </div>
    </CardWrapper>
  );
};

export default LaunchpadPoolListCard;

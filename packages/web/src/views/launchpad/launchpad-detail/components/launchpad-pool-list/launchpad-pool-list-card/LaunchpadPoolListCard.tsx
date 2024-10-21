/* eslint-disable @next/next/no-img-element */
import React from "react";
import { cx } from "@emotion/css";
import { useAtomValue } from "jotai";

import { LaunchpadState } from "@states/index";
import { getTierDuration } from "@utils/launchpad-get-tier-number";
import { LaunchpadPoolModel } from "@models/launchpad";
import { ProjectRewardInfoModel } from "@views/launchpad/launchpad-detail/LaunchpadDetail";

import { Divider } from "@components/common/divider/divider";
import { CardWrapper } from "./LaunchpadPoolListCard.styles";
import LaunchpadPoolTierChip from "@views/launchpad/components/launchpad-pool-tier-chip/LaunchpadPoolTierChip";
import DepositConditionsTooltip from "@components/common/launchpad-tooltip/deposit-conditions-tooltip/DepositConditionsTooltip";
import MissingLogo from "@components/common/missing-logo/MissingLogo";

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
        </div>
        {isActiveCard && isShowConditionTooltip && <DepositConditionsTooltip />}
      </div>

      <div className="card-description">
        Staking for {getTierDuration(data.poolTier)}. <br />
        Rewards claimable starting <br />
        after 14 days.
      </div>

      <Divider />

      <div className="data">
        <div className="key">Participants</div>
        <div className="value">{data.participant || "-"}</div>
      </div>
      <div className="data">
        <div className="key">APR</div>
        <div className="value">{data.apr || "-"}</div>
      </div>
      <div className="data">
        <div className="key">Total Deposits</div>
        <div className="value">
          <img
            className="token-image"
            src="/gns.svg"
            alt={"GNS symbol image"}
          />{" "}
          {data.depositAmount || "-"} GNS
        </div>
      </div>
      <div className="data">
        <div className="key">Token Distributed</div>
        <div className="value">
          <MissingLogo
            symbol={rewardInfo.rewardTokenSymbol}
            width={24}
            mobileWidth={24}
          />
          {data.distributedAmount || "-"}
        </div>
      </div>
    </CardWrapper>
  );
};

export default LaunchpadPoolListCard;

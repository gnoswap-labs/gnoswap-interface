import React from "react";
import { useAtomValue } from "jotai";

import { Divider } from "@components/common/divider/divider";
import { LaunchpadPoolModel } from "@models/launchpad";
import { CardWrapper } from "./LaunchpadPoolListCard.styles";
import { LaunchpadState } from "@states/index";

interface LaunchpadPoolListCardProps {
  data: LaunchpadPoolModel;
  idx: number;

  selectProjectPool: (poolId: number) => void;
}

const LaunchpadPoolListCard: React.FC<LaunchpadPoolListCardProps> = ({
  data,
  idx,
  selectProjectPool,
}) => {
  const currentPoolId = useAtomValue(LaunchpadState.selectLaunchpadPool);
  return (
    <CardWrapper
      className={currentPoolId === data.id ? "active" : ""}
      onClick={() => selectProjectPool(data.id)}
    >
      <div className="card-header">
        <span className="title">Pool {idx}</span>
        <span className="chip">1 Months</span>
      </div>

      <div className="card-description">
        Staking for 6 months. <br />
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
        <div className="value">{data.depositAmount || "-"}</div>
      </div>
      <div className="data">
        <div className="key">Token Distributed</div>
        <div className="value">{data.distributedAmount || "-"}</div>
      </div>
    </CardWrapper>
  );
};

export default LaunchpadPoolListCard;

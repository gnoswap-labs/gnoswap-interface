import { Divider } from "@components/common/divider/divider";
import { LaunchpadPoolModel } from "@models/launchpad";
import React from "react";

import { CardWrapper } from "./LaunchpadPoolListCard.styles";

interface LaunchpadPoolListCardProps {
  data: LaunchpadPoolModel;
  idx: number;
}

const LaunchpadPoolListCard: React.FC<LaunchpadPoolListCardProps> = ({
  data,
  idx,
}) => {
  return (
    <CardWrapper>
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

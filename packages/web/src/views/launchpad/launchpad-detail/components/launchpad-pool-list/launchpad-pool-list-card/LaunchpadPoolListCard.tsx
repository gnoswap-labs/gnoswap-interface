import { Divider } from "@components/common/divider/divider";
import React from "react";

import { CardWrapper } from "./LaunchpadPoolListCard.styles";

const LaunchpadPoolListCard: React.FC = () => {
  return (
    <CardWrapper>
      <div className="card-header">
        <span className="title">Pool 1</span>
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
        <div className="value">Value</div>
      </div>
      <div className="data">
        <div className="key">APR</div>
        <div className="value">Value</div>
      </div>
      <div className="data">
        <div className="key">Total Deposits</div>
        <div className="value">Value</div>
      </div>
      <div className="data">
        <div className="key">Token Distributed</div>
        <div className="value">Value</div>
      </div>
    </CardWrapper>
  );
};

export default LaunchpadPoolListCard;

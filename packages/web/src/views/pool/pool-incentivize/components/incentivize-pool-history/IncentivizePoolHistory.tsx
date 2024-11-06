import React from "react";

import { IncentivizePoolHistoryWrapper } from "./IncentivizePoolHistory.styles";
import IncentivizePoolHistoryBox from "./incentivize-pool-history-box/IncentivizePoolHistoryBox";
import { Divider } from "@components/common/divider/divider";

const IncentivizePoolHistory = () => {
  return (
    <IncentivizePoolHistoryWrapper>
      <div className="box-header">
        <span className="title">My Incentivization History</span>
      </div>
      <div className="history-box-section">
        <IncentivizePoolHistoryBox />
        <Divider />
        <IncentivizePoolHistoryBox />
        <Divider />
        <IncentivizePoolHistoryBox />
        <Divider />
        <IncentivizePoolHistoryBox />
        <Divider />
        <IncentivizePoolHistoryBox />
        <Divider />
        <IncentivizePoolHistoryBox />
      </div>
    </IncentivizePoolHistoryWrapper>
  );
};

export default IncentivizePoolHistory;

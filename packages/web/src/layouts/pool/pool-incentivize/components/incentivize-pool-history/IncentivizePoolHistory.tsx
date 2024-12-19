import React from "react";

import { ExtendedPoolStakingModel } from "@models/pool/pool-staking";

import { IncentivizePoolHistoryWrapper } from "./IncentivizePoolHistory.styles";
import IncentivizePoolHistoryBox from "./incentivize-pool-history-box/IncentivizePoolHistoryBox";
import { Divider } from "@components/common/divider/divider";

interface IncentivizePoolHistoryProps {
  stakingList: ExtendedPoolStakingModel[];
}

const IncentivizePoolHistory = ({ stakingList }: IncentivizePoolHistoryProps) => {
  return (
    <IncentivizePoolHistoryWrapper>
      <div className="box-header">
        <span className="title">My Incentivization History</span>
      </div>
      <div className="history-box-section">
        {stakingList.map((item, idx) => {
          return (
            <React.Fragment key={idx}>
              <IncentivizePoolHistoryBox stakingData={item} poolPath={item.poolPath} />
              {idx < stakingList.length - 1 && <Divider />}
            </React.Fragment>
          );
        })}
      </div>
    </IncentivizePoolHistoryWrapper>
  );
};

export default IncentivizePoolHistory;

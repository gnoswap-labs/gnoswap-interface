import React from "react";

import { ProjectSummaryDataModel } from "../../LaunchpadDetail";

import IconInfo from "@components/common/icons/IconInfo";
import { LaunchpadProjectSummaryWrapper } from "./LaunchpadProjectSummary.styles";

interface LaunchpadProjectSummaryProps {
  data: ProjectSummaryDataModel;
  tokenSymbol: string;
}

const LaunchpadProjectSummary: React.FC<LaunchpadProjectSummaryProps> = ({
  data,
  tokenSymbol,
}) => {
  return (
    <LaunchpadProjectSummaryWrapper>
      <div className="card border">
        <div className="key">
          Total Allocation <IconInfo size={16} fill={"#596782"} />
        </div>
        <div className="value">
          {data.totalAllocation.toLocaleString()} USDC
        </div>
      </div>
      <div className="card border">
        <div className="key">
          Participants <IconInfo size={16} fill={"#596782"} />
        </div>
        <div className="value">{data.totalParticipants.toLocaleString()}</div>
      </div>
      <div className="card border">
        <div className="key">
          Total Deposited <IconInfo size={16} fill={"#596782"} />
        </div>
        <div className="value">
          {data.totalDeposited.toLocaleString()} {tokenSymbol}
        </div>
      </div>
      <div className="card">
        <div className="key">
          Tokens Distributed <IconInfo size={16} fill={"#596782"} />
        </div>
        <div className="value">
          {data.totalDistributed.toLocaleString()} USDC
        </div>
      </div>
    </LaunchpadProjectSummaryWrapper>
  );
};

export default LaunchpadProjectSummary;

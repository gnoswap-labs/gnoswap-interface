import IconInfo from "@components/common/icons/IconInfo";
import React from "react";
import { LaunchpadProjectSummaryWrapper } from "./LaunchpadProjectSummary.styles";

const LaunchpadProjectSummary: React.FC = () => {
  return (
    <LaunchpadProjectSummaryWrapper>
      <div className="card border">
        <div className="key">
          Total Allocation <IconInfo size={16} fill={"#596782"} />
        </div>
        <div className="value">500,000,000 USDC</div>
      </div>
      <div className="card border">
        <div className="key">
          Participants <IconInfo size={16} fill={"#596782"} />
        </div>
        <div className="value">500,000,000 USDC</div>
      </div>
      <div className="card border">
        <div className="key">
          Total Deposited <IconInfo size={16} fill={"#596782"} />
        </div>
        <div className="value">500,000,000 USDC</div>
      </div>
      <div className="card">
        <div className="key">
          Tokens Distributed <IconInfo size={16} fill={"#596782"} />
        </div>
        <div className="value">500,000,000 USDC</div>
      </div>
    </LaunchpadProjectSummaryWrapper>
  );
};

export default LaunchpadProjectSummary;

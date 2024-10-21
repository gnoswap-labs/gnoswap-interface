import React from "react";

import { ProjectSummaryDataModel } from "../../LaunchpadDetail";

import { LaunchpadProjectSummaryWrapper } from "./LaunchpadProjectSummary.styles";
import LaunchpadTooltip from "../common/launchpad-tooltip/LaunchpadTooltip";

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
          Total Allocation
          <LaunchpadTooltip
            floatingContent={
              <>
                The total amount of project tokens <br />
                allocated for the GnoSwap launchpad.
              </>
            }
          />
        </div>
        <div className="value">
          {data.totalAllocation.toLocaleString()} USDC
        </div>
      </div>
      <div className="card border">
        <div className="key">
          Participants{" "}
          <LaunchpadTooltip
            floatingContent={
              <>
                The total number of participants in this <br />
                launchpad project.
              </>
            }
          />
        </div>
        <div className="value">{data.totalParticipants.toLocaleString()}</div>
      </div>
      <div className="card border">
        <div className="key">
          Total Deposited
          <LaunchpadTooltip
            floatingContent={
              <>
                The total amount of GNS deposited into <br />
                this launchpad project.
              </>
            }
          />
        </div>
        <div className="value">
          {data.totalDeposited.toLocaleString()} {tokenSymbol}
        </div>
      </div>
      <div className="card">
        <div className="key">
          Tokens Distributed
          <LaunchpadTooltip
            floatingContent={
              <>
                The total amount of project tokens <br />
                distributed to participants.
              </>
            }
          />
        </div>
        <div className="value">
          {data.totalDistributed.toLocaleString()} USDC
        </div>
      </div>
    </LaunchpadProjectSummaryWrapper>
  );
};

export default LaunchpadProjectSummary;

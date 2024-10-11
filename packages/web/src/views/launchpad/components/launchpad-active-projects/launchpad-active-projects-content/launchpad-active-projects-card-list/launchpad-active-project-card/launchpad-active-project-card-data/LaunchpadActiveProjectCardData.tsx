import React from "react";

import { LaunchpadActiveProjectPool } from "@repositories/launchpad/response/get-launchpad-active-projects-response";

import { ActiveProjectCardDataWrapper } from "./LaunchpadActiveProjectCardData.styles";

interface LaunchpadActiveProjectCardDataProps {
  pools: LaunchpadActiveProjectPool[];
}

const LaunchpadActiveProjectCardData: React.FC<
  LaunchpadActiveProjectCardDataProps
> = ({ pools }) => {
  return (
    <ActiveProjectCardDataWrapper>
      {pools && pools.length > 0 && (
        <>
          {pools.map((poolDetail: LaunchpadActiveProjectPool) => {
            return (
              <div className="data-box" key={poolDetail.id}>
                <span className="data-title">Pool1</span>
                <span className="data">{poolDetail.apr}% APR</span>
                <span className="badge">1 Month</span>
              </div>
            );
          })}
        </>
      )}
    </ActiveProjectCardDataWrapper>
  );
};

export default LaunchpadActiveProjectCardData;

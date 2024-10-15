import React from "react";

import { LaunchpadActiveProjectPool } from "@repositories/launchpad/response/get-launchpad-active-projects-response";

import { ActiveProjectCardDataWrapper } from "./LaunchpadActiveProjectCardData.styles";
import { formatRate } from "@utils/new-number-utils";
import IconStar from "@components/common/icons/IconStar";

type TierType = "30" | "90" | "180";
interface LaunchpadActiveProjectCardDataProps {
  pools: LaunchpadActiveProjectPool[];
}

const LaunchpadActiveProjectCardData: React.FC<
  LaunchpadActiveProjectCardDataProps
> = ({ pools }) => {
  const getTierDuration = (tier: TierType) => {
    switch (tier) {
      case "30":
        return "1 Month";
      case "90":
        return "3 Months";
      case "180":
        return "6 Months";
    }
  };

  return (
    <ActiveProjectCardDataWrapper>
      {pools && pools.length > 0 && (
        <>
          {pools.map((poolDetail: LaunchpadActiveProjectPool, idx) => {
            const aprStr = poolDetail.apr ? (
              <>
                {Number(poolDetail.apr) > 100 && <IconStar size={18} />}
                {formatRate(poolDetail.apr)}
              </>
            ) : (
              "-"
            );
            return (
              <div className="data-box" key={poolDetail.id}>
                <span className="data-title">Pool {idx + 1}</span>
                <span className="data">{aprStr} APR</span>
                <span className="badge">
                  {getTierDuration(poolDetail.poolTier)}
                </span>
              </div>
            );
          })}
        </>
      )}
    </ActiveProjectCardDataWrapper>
  );
};

export default LaunchpadActiveProjectCardData;

import React from "react";

import { LaunchpadActiveProjectPool } from "@repositories/launchpad/response/get-launchpad-active-projects-response";
import { getTierNumber } from "@utils/launchpad-get-tier-number";

import { ActiveProjectCardDataWrapper } from "./LaunchpadActiveProjectCardData.styles";
import { formatRate } from "@utils/new-number-utils";
import IconStar from "@components/common/icons/IconStar";
import LaunchpadPoolTierChip from "@views/launchpad/components/launchpad-pool-tier-chip/LaunchpadPoolTierChip";

interface LaunchpadActiveProjectCardDataProps {
  pools: LaunchpadActiveProjectPool[];
}

const LaunchpadActiveProjectCardData: React.FC<
  LaunchpadActiveProjectCardDataProps
> = ({ pools }) => {
  const sortedPools = React.useMemo(() => {
    return [...pools].sort(
      (a, b) => getTierNumber(b.poolTier) - getTierNumber(a.poolTier),
    );
  }, [pools]);

  return (
    <ActiveProjectCardDataWrapper>
      {sortedPools && sortedPools.length > 0 && (
        <>
          {sortedPools.map((poolDetail: LaunchpadActiveProjectPool, idx) => {
            const aprStr = poolDetail.apr ? (
              <>
                {Number(poolDetail.apr) > 100 && <IconStar size={18} />}
                {formatRate(poolDetail.apr)} APR
              </>
            ) : (
              "-"
            );
            return (
              <div className="data-box" key={poolDetail.id}>
                <span className="data-title">Pool {idx + 1}</span>
                <span className="data">{aprStr}</span>
                <LaunchpadPoolTierChip poolTier={poolDetail.poolTier} />
              </div>
            );
          })}
        </>
      )}
    </ActiveProjectCardDataWrapper>
  );
};

export default LaunchpadActiveProjectCardData;

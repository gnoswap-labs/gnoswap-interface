import React from "react";

import { LaunchpadActiveProjectPool } from "@repositories/launchpad/response/get-launchpad-active-projects-response";
import { getTierNumber } from "@utils/launchpad-get-tier-number";

import { ActiveProjectCardDataWrapper } from "./LaunchpadActiveProjectCardData.styles";
import { formatRate } from "@utils/new-number-utils";
import IconStar from "@components/common/icons/IconStar";
import LaunchpadPoolTierChip from "src/layouts/launchpad/components/launchpad-pool-tier-chip/LaunchpadPoolTierChip";
import { useTranslation } from "react-i18next";

interface LaunchpadActiveProjectCardDataProps {
  pools: LaunchpadActiveProjectPool[];
}

const LaunchpadActiveProjectCardData: React.FC<LaunchpadActiveProjectCardDataProps> = ({ pools }) => {
  const { t } = useTranslation();

  const sortedPools = React.useMemo(() => {
    return [...pools].sort((a, b) => getTierNumber(b.poolTier) - getTierNumber(a.poolTier));
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
                <span className="data-title">{t("Launchpad:poolList.title", { idx: idx + 1 })}</span>
                <div className="flex-box">
                  <span className="data">{aprStr}</span>
                  <LaunchpadPoolTierChip poolTier={poolDetail.poolTier} />
                </div>
              </div>
            );
          })}
        </>
      )}
    </ActiveProjectCardDataWrapper>
  );
};

export default LaunchpadActiveProjectCardData;

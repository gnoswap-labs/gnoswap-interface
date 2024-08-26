import BigNumber from "bignumber.js";
import React, { useMemo } from "react";


import { useLoading } from "@hooks/common/use-loading";
import { useWindowSize } from "@hooks/common/use-window-size";
import { useGetDashboardToken } from "@query/dashboard";
import { formatOtherPrice, formatPrice } from "@utils/new-number-utils";

import { nullGovernenceOverviewInfo } from "../../components/dashboard-info/dashboard-overview/governance-overview/GovernanceOverview";
import DashboardInfo from "../../components/dashboard-info/DashboardInfo";

const formatDashboardPrice = (price?: string, unit?: string) => {
  if (!price || BigNumber(price).isNaN()) return "-";

  return `${BigNumber(price).toFormat(0)} ${unit ? " " + unit : ""}`;
};

const DashboardInfoContainer: React.FC = () => {
  const { breakpoint } = useWindowSize();
  const { isLoading: isLoadingCommon } = useLoading();

  const { data: tokenData, isLoading } = useGetDashboardToken();

  const progressBar = useMemo(() => {
    if (!tokenData) return "0%";
    const circSupply = Number(tokenData?.gnsCirculatingSupply);
    const totalSupply = Number(tokenData?.gnsTotalSupply);
    if (totalSupply === 0) return "0%";
    const percent = Math.min((circSupply / totalSupply) * 100, 100);
    return `${percent}%`;
  }, [tokenData]);
  const stakingRatio = useMemo(() => {
    if (!tokenData) return "-";
    const circSupply = Number(tokenData?.gnsCirculatingSupply);
    const totalStaked = Number(tokenData?.gnsTotalStaked);

    if (totalStaked === 0 || circSupply === 0) return "0%";
    if ((totalStaked * 100) / circSupply < 0.01) return "<0.01%";
    const ratio = ((totalStaked / circSupply) * 100).toFixed(3);
    return `${ratio}%`;
  }, [tokenData]);

  return (
    <DashboardInfo
      dashboardTokenInfo={{
        gnosAmount: formatPrice(tokenData?.gnsPrice, {
          isKMB: false,
        }),
        gnotAmount: formatPrice(tokenData?.gnotPrice ?? "0", {
          isKMB: false,
        }),
      }}
      supplyOverviewInfo={{
        circulatingSupply: formatDashboardPrice(
          tokenData?.gnsCirculatingSupply || "-",
          "GNS",
        ),
        dailyBlockEmissions:
          formatOtherPrice(tokenData?.gnsDailyBlockEmissions, {
            isKMB: false,
            usd: false,
          }) + " GNS",
        totalSupply: formatDashboardPrice(tokenData?.gnsTotalSupply, "GNS"),
        totalStaked:
          formatOtherPrice(tokenData?.gnsTotalStaked, {
            isKMB: false,
            usd: false,
          }) + " GNS",
        progressBar: progressBar,
        stakingRatio: stakingRatio,
        dailyBlockEmissionsInfo: {
          liquidityStaking: formatOtherPrice(
            Math.floor(Number(tokenData?.gnsDailyBlockEmissions) * 75) / 100,
            {
              isKMB: false,
              usd: false,
            },
          ),
          devOps: formatOtherPrice(
            Math.floor(Number(tokenData?.gnsDailyBlockEmissions) * 20) / 100,
            {
              isKMB: false,
              usd: false,
            },
          ),
          community: formatOtherPrice(
            Math.floor(Number(tokenData?.gnsDailyBlockEmissions) * 5) / 100,
            {
              isKMB: false,
              usd: false,
            },
          ),
        },
      }}
      governenceOverviewInfo={nullGovernenceOverviewInfo}
      breakpoint={breakpoint}
      loading={isLoading || isLoadingCommon}
    />
  );
};

export default DashboardInfoContainer;

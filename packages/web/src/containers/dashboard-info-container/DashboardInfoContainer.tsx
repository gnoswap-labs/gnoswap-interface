import React, { useMemo } from "react";
import DashboardInfo from "@components/dashboard/dashboard-info/DashboardInfo";
import { useWindowSize } from "@hooks/common/use-window-size";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { DashboardTokenResponse } from "@repositories/dashboard/response/token-response";
import { useQuery } from "@tanstack/react-query";
import { formatUsdNumber3Digits, prettyNumber } from "@utils/number-utils";

export interface DashboardTokenInfo {
  gnosAmount: string;
  gnotAmount: string;
}

// const initialDashboardTokenInfo: DashboardTokenInfo = {
//   gnosAmount: "$0.7425",
//   gnotAmount: "$1.8852",
// };

export interface SupplyOverviewInfo {
  totalSupply: string;
  circulatingSupply: string;
  progressBar: string;
  dailyBlockEmissions: string;
  totalStaked: string;
  stakingRatio: string;
}

// const initialSupplyOverviewInfo: SupplyOverviewInfo = {
//   totalSupply: "1,000,000,000 GNS",
//   circulatingSupply: "218,184,885 GNS",
//   progressBar: "580 GNS",
//   dailyBlockEmissions: "580 GNS",
//   totalStaked: "152,412,148 GNS",
//   stakingRatio: "55.15%",
// };

const formatPrice = (price?: string, unit?: string) => {
  if (unit) {
    return price ? `${Number(price).toLocaleString()} ${unit}` : "-";
  }
  if (price && Number(price) < 1) {
    return formatUsdNumber3Digits(price);
  }
  return price ? `$${Number(formatUsdNumber3Digits(price)).toLocaleString("en", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}` : "-";
};

export interface GovernenceOverviewInfo {
  totalXgnosIssued: string;
  holders: string;
  passedProposals: string;
  activeProposals: string;
  communityPool: string;
}

const initialGovernenceOverviewInfo: GovernenceOverviewInfo = {
  totalXgnosIssued: "-",
  holders: "-",
  passedProposals: "-",
  activeProposals: "-",
  communityPool: "-",
};

const DashboardInfoContainer: React.FC = () => {
  const { breakpoint } = useWindowSize();
  const { dashboardRepository } = useGnoswapContext();

  const { data: tokenData, isFetching } = useQuery<
    DashboardTokenResponse,
    Error
  >({
    queryKey: ["dashboardToken"],
    queryFn: dashboardRepository.getDashboardToken,
  });

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
    if (circSupply === 0) return "0%";
    const ratio = ((totalStaked / circSupply) * 100).toFixed(2);
    return `${prettyNumber(ratio)}%`;
  }, [tokenData]);
  
  return (
    <DashboardInfo
      dashboardTokenInfo={{
        gnosAmount: formatPrice(tokenData?.gnsPrice),
        gnotAmount: formatPrice(tokenData?.gnotPrice),
      }}
      supplyOverviewInfo={{
        circulatingSupply: formatPrice(tokenData?.gnsCirculatingSupply, "GNS"),
        dailyBlockEmissions: formatPrice(
          tokenData?.gnsDailyBlockEmissions,
          "GNS",
        ),
        totalSupply: formatPrice(tokenData?.gnsTotalSupply, "GNS"),
        totalStaked: formatPrice(tokenData?.gnsTotalStaked, "GNS"),
        progressBar: progressBar,
        stakingRatio: stakingRatio,
      }}
      governenceOverviewInfo={initialGovernenceOverviewInfo}
      breakpoint={breakpoint}
      loading={isFetching}
    />
  );
};

export default DashboardInfoContainer;

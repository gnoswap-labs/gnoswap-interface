import React, { useMemo } from "react";
import DashboardInfo from "@components/dashboard/dashboard-info/DashboardInfo";
import { useWindowSize } from "@hooks/common/use-window-size";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { DashboardTokenResponse } from "@repositories/dashboard/response/token-response";
import { useQuery } from "@tanstack/react-query";
import {
  formatUsdNumber3Digits,
  prettyNumber,
  toPriceFormat,
} from "@utils/number-utils";
import { useLoading } from "@hooks/common/use-loading";
import BigNumber from "bignumber.js";

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
  return price
    ? `$${Number(formatUsdNumber3Digits(price)).toLocaleString("en", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      })}`
    : "-";
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
  const { isLoading: isLoadingCommon } = useLoading();

  const { data: tokenData, isLoading } = useQuery<
    DashboardTokenResponse,
    Error
  >({
    queryKey: ["dashboardToken"],
    queryFn: dashboardRepository.getDashboardToken,
    refetchInterval: 60 * 1000,
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

    if (totalStaked === 0 || circSupply === 0) return "0%";
    if ((totalStaked * 100) / circSupply < 0.1) return "<0.1%";
    const ratio = ((totalStaked / circSupply) * 100).toFixed(2);
    return `${prettyNumber(ratio)}%`;
  }, [tokenData]);

  return (
    <DashboardInfo
      dashboardTokenInfo={{
        gnosAmount: toPriceFormat(tokenData?.gnsPrice ?? "0", {
          usd: true,
          isKMBFormat: false,
        }),
        gnotAmount: toPriceFormat(tokenData?.gnotPrice ?? "0", {
          usd: true,
          isKMBFormat: false,
        }),
      }}
      supplyOverviewInfo={{
        circulatingSupply: BigNumber(
          tokenData?.gnsCirculatingSupply || "-",
        ).toFormat(0),
        dailyBlockEmissions: formatPrice(
          tokenData?.gnsDailyBlockEmissions,
          "GNS",
        ),
        totalSupply: formatPrice(tokenData?.gnsTotalSupply, "GNS"),
        totalStaked: (() => {
          if (isNaN(Number(tokenData?.gnsTotalStaked ?? 0))) return "-";

          return (
            toPriceFormat(tokenData?.gnsTotalStaked ?? 0, {
              isKMBFormat: false,
              isRounding: false,
            }) + " GNS"
          );
        })(),
        progressBar: progressBar,
        stakingRatio: stakingRatio,
      }}
      governenceOverviewInfo={initialGovernenceOverviewInfo}
      breakpoint={breakpoint}
      loading={isLoading || isLoadingCommon}
    />
  );
};

export default DashboardInfoContainer;

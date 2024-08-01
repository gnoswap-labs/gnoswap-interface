import React, { useMemo } from "react";
import DashboardInfo from "@components/dashboard/dashboard-info/DashboardInfo";
import { useWindowSize } from "@hooks/common/use-window-size";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { DashboardTokenResponse } from "@repositories/dashboard/response/token-response";
import { useQuery } from "@tanstack/react-query";
import { useLoading } from "@hooks/common/use-loading";
import BigNumber from "bignumber.js";
import { formatOtherPrice, formatPrice } from "@utils/new-number-utils";

export interface DailyBlockEmissionsInfo {
  liquidityStaking: string;
  devOps: string;
  community: string;
}

export interface DashboardTokenInfo {
  gnosAmount: string;
  gnotAmount: string;
}

export interface SupplyOverviewInfo {
  totalSupply: string;
  circulatingSupply: string;
  progressBar: string;
  dailyBlockEmissions: string;
  dailyBlockEmissionsInfo: DailyBlockEmissionsInfo;
  totalStaked: string;
  stakingRatio: string;
}

const formatDashboardPrice = (price?: string, unit?: string) => {
  if (!price || BigNumber(price).isNaN()) return "-";

  return `${BigNumber(price).toFormat(0)} ${unit ? " " + unit : ""}`;
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
          liquidityStaking:
            formatOtherPrice(Number(tokenData?.gnsDailyBlockEmissions) * 0.75, {
              isKMB: false,
              usd: false,
            }) + " / day",
          devOps:
            formatOtherPrice(Number(tokenData?.gnsDailyBlockEmissions) * 0.2, {
              isKMB: false,
              usd: false,
            }) + " / day",
          community:
            formatOtherPrice(Number(tokenData?.gnsDailyBlockEmissions) * 0.05, {
              isKMB: false,
              usd: false,
            }) + " / day",
        },
      }}
      governenceOverviewInfo={initialGovernenceOverviewInfo}
      breakpoint={breakpoint}
      loading={isLoading || isLoadingCommon}
    />
  );
};

export default DashboardInfoContainer;

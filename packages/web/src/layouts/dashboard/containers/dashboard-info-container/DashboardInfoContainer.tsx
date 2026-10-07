import BigNumber from "bignumber.js";
import React, { useMemo } from "react";

import { useLoading } from "@hooks/common/use-loading";
import { useWindowSize } from "@hooks/common/use-window-size";
import { useGetDashboardGovernanceOverview, useGetDashboardToken } from "@query/dashboard";
import { formatOtherPrice, formatPrice } from "@utils/new-number-utils";
import { SupplyOverviewInfo } from "@layouts/dashboard/components/dashboard-info/dashboard-overview/supply-overview/SupplyOverview";
import { ExploreDashboardConverter } from "@services/converters/explore-dashboard";

import { GNS_TOKEN, XGNS_TOKEN } from "@common/values/token-constant";
import { numberToFormat } from "@utils/string-utils";
import DashboardInfo from "../../components/dashboard-info/DashboardInfo";

const formatDashboardPrice = (price?: string, unit?: string) => {
  if (!price || BigNumber(price).isNaN()) return "-";

  return `${BigNumber(price).toFormat(0)} ${unit ? " " + unit : ""}`;
};

const DashboardInfoContainer: React.FC = () => {
  const { breakpoint } = useWindowSize();
  const { isLoading: isLoadingCommon } = useLoading();
  const { data: dashboardTokenData, isFetched: isFetchedDashboardToken } = useGetDashboardToken();

  const { data: governanceOverview = null, isFetched: isFetchedGovernanceOverview } =
    useGetDashboardGovernanceOverview();

  const convertedDashboardTokenData = React.useMemo(() => {
    return ExploreDashboardConverter.convertDashboardToken(dashboardTokenData);
  }, [dashboardTokenData]);

  const convertedGovernanceOverview = React.useMemo(() => {
    return ExploreDashboardConverter.convertGovernanceOverview(governanceOverview);
  }, [governanceOverview]);

  const isLoading = useMemo(() => {
    if (isLoadingCommon) {
      return true;
    }

    return !isFetchedDashboardToken || !isFetchedGovernanceOverview;
  }, [isFetchedDashboardToken, isFetchedGovernanceOverview, isLoadingCommon]);

  const progressBar = useMemo(() => {
    if (!convertedDashboardTokenData) return "0%";
    const circSupply = Number(convertedDashboardTokenData?.gnsCirculatingSupply);
    const totalSupply = Number(convertedDashboardTokenData?.gnsMaxSupply);
    if (totalSupply === 0) return "0%";
    const percent = Math.min((circSupply / totalSupply) * 100, 100);
    return `${percent}%`;
  }, [convertedDashboardTokenData]);
  const stakingRatio = useMemo(() => {
    if (!convertedDashboardTokenData) return "-";
    const circSupply = Number(convertedDashboardTokenData?.gnsCirculatingSupply);
    const totalStaked = Number(convertedDashboardTokenData?.gnsTotalStaked);

    if (totalStaked === 0 || circSupply === 0) return "0%";
    if ((totalStaked * 100) / circSupply < 0.01) return "<0.01%";
    const ratio = ((totalStaked / circSupply) * 100).toFixed(3);
    return `${ratio}%`;
  }, [convertedDashboardTokenData]);

  const supplyOverviewInfo: SupplyOverviewInfo = useMemo(() => {
    const DISTRIBUTION_RATIOS = {
      LIQUIDITY_STAKING: 0.75, // 75%
      DEV_OPS: 0.2, // 20%
      COMMUNITY: 0.05, // 5%
    };

    const circulatingSupply = convertedDashboardTokenData.gnsCirculatingSupply;
    const totalSupply = convertedDashboardTokenData.gnsMaxSupply;
    const totalStaked = Number(convertedDashboardTokenData.gnsTotalStaked);
    const dailyBlockEmissions = Number(convertedDashboardTokenData.gnsDailyBlockEmissions);

    const emissionDistribution = {
      liquidityStaking: dailyBlockEmissions * DISTRIBUTION_RATIOS.LIQUIDITY_STAKING,
      devOps: dailyBlockEmissions * DISTRIBUTION_RATIOS.DEV_OPS,
      community: dailyBlockEmissions * DISTRIBUTION_RATIOS.COMMUNITY,
    };

    const formatWithSymbol = (value: number, useKMB = true): string => {
      return formatOtherPrice(value, { isKMB: useKMB, usd: false }) + ` ${GNS_TOKEN.symbol}`;
    };

    return {
      circulatingSupply: formatDashboardPrice(String(circulatingSupply), GNS_TOKEN.symbol),
      dailyBlockEmissions: formatWithSymbol(dailyBlockEmissions, false),
      totalSupply: formatDashboardPrice(String(totalSupply), GNS_TOKEN.symbol),
      totalStaked: formatWithSymbol(totalStaked, false),
      progressBar: progressBar,
      stakingRatio: stakingRatio,
      dailyBlockEmissionsInfo: {
        liquidityStaking: formatOtherPrice(Math.floor(emissionDistribution.liquidityStaking), {
          isKMB: false,
          usd: false,
        }),
        devOps: formatOtherPrice(Math.floor(emissionDistribution.devOps), { isKMB: false, usd: false }),
        community: formatOtherPrice(Math.floor(emissionDistribution.community), { isKMB: false, usd: false }),
      },
    };
  }, [convertedDashboardTokenData, progressBar, stakingRatio]);

  const governanceOverviewInfo = useMemo(() => {
    if (!convertedGovernanceOverview) {
      return null;
    }

    return {
      totalDelegated: `${numberToFormat(convertedGovernanceOverview.xgnsTotalSupply)} ${XGNS_TOKEN.symbol}`,
      holders: `${numberToFormat(convertedGovernanceOverview.holders)}`,
      passedCount: `${numberToFormat(convertedGovernanceOverview.passedCount)}`,
      activeCount: `${numberToFormat(convertedGovernanceOverview.activeCount)} `,
      communityPool: `${formatOtherPrice(convertedGovernanceOverview.communityPool, {
        isKMB: false,
      })}`,
    };
  }, [convertedGovernanceOverview]);

  return (
    <DashboardInfo
      dashboardTokenInfo={{
        gnosAmount: formatPrice(dashboardTokenData?.gnsPrice, {
          isKMB: false,
        }),
        gnotAmount: formatPrice(dashboardTokenData?.gnotPrice ?? "0", {
          isKMB: false,
        }),
      }}
      supplyOverviewInfo={supplyOverviewInfo}
      governanceOverviewInfo={governanceOverviewInfo}
      breakpoint={breakpoint}
      loading={isLoading}
    />
  );
};

export default DashboardInfoContainer;

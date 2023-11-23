import React from "react";
import DashboardInfo from "@components/dashboard/dashboard-info/DashboardInfo";
import { useWindowSize } from "@hooks/common/use-window-size";

export interface DashboardTokenInfo {
  gnosAmount: string;
  gnotAmount: string;
}

const initialDashboardTokenInfo: DashboardTokenInfo = {
  gnosAmount: "$0.7425",
  gnotAmount: "$1.8852",
};

export interface SupplyOverviewInfo {
  totalSupply: string;
  circulatingSupply: string;
  progressBar: string;
  dailyBlockEmissions: string;
  totalStaked: string;
  stakingRatio: string;
}

const initialSupplyOverviewInfo: SupplyOverviewInfo = {
  totalSupply: "1,000,000,000 GNS",
  circulatingSupply: "218,184,885 GNS",
  progressBar: "580 GNS",
  dailyBlockEmissions: "580 GNS",
  totalStaked: "152,412,148 GNS",
  stakingRatio: "55.15%",
};

export interface GovernenceOverviewInfo {
  totalXgnosIssued: string;
  holders: string;
  passedProposals: string;
  activeProposals: string;
  communityPool: string;
}

const initialGovernenceOverviewInfo: GovernenceOverviewInfo = {
  totalXgnosIssued: "59,144,225 xGNOS",
  holders: "14,072",
  passedProposals: "125",
  activeProposals: "2",
  communityPool: "2,412,148 GNS",
};

const DashboardInfoContainer: React.FC = () => {
  const { breakpoint } = useWindowSize();

  return (
    <DashboardInfo
      dashboardTokenInfo={initialDashboardTokenInfo}
      supplyOverviewInfo={initialSupplyOverviewInfo}
      governenceOverviewInfo={initialGovernenceOverviewInfo}
      breakpoint={breakpoint}
    />
  );
};

export default DashboardInfoContainer;

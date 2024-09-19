import { pulseSkeletonStyle } from "@constants/skeleton.constant";
import { DEVICE_TYPE } from "@styles/media";

import DashboardInfoTitle, {
  DashboardTokenInfo,
} from "./dashboard-info-title/DashboardInfoTitle";
import DashboardOverview from "./dashboard-overview/DashboardOverview";
import { GovernanceOverviewInfo } from "./dashboard-overview/governance-overview/GovernanceOverview";
import { SupplyOverviewInfo } from "./dashboard-overview/supply-overview/SupplyOverview";

import { DashboardInfoWrapper } from "./DashboardInfo.styles";

interface DashboardInfoProps {
  dashboardTokenInfo: DashboardTokenInfo;
  supplyOverviewInfo: SupplyOverviewInfo;
  governanceOverviewInfo: GovernanceOverviewInfo | null;
  breakpoint: DEVICE_TYPE;
  loading: boolean;
}

const DashboardInfo: React.FC<DashboardInfoProps> = ({
  dashboardTokenInfo,
  supplyOverviewInfo,
  governanceOverviewInfo,
  breakpoint,
  loading,
}) => (
  <DashboardInfoWrapper>
    {!loading && (
      <DashboardInfoTitle
        dashboardTokenInfo={dashboardTokenInfo}
        breakpoint={breakpoint}
      />
    )}
    {loading && (
      <div className="loading-spining">
        <span css={pulseSkeletonStyle({ w: "400px", mobileWidth: "150" })} />
      </div>
    )}
    <DashboardOverview
      supplyOverviewInfo={supplyOverviewInfo}
      governanceOverviewInfo={governanceOverviewInfo}
      breakpoint={breakpoint}
      loading={loading}
    />
  </DashboardInfoWrapper>
);

export default DashboardInfo;

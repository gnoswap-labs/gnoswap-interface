import { DashboardInfoWrapper } from "./DashboardInfo.styles";
import DashboardInfoTitle from "@components/dashboard/dashboard-info-title/DashboardInfoTitle";
import DashboardOverview from "../dashboard-overview/DashboardOverview";
import {
  DashboardTokenInfo,
  GovernenceOverviewInfo,
  SupplyOverviewInfo,
} from "@containers/dashboard-info-container/DashboardInfoContainer";
import { DEVICE_TYPE } from "@styles/media";
import { pulseSkeletonStyle } from "@constants/skeleton.constant";

interface DashboardInfoProps {
  dashboardTokenInfo: DashboardTokenInfo;
  supplyOverviewInfo: SupplyOverviewInfo;
  governenceOverviewInfo: GovernenceOverviewInfo;
  breakpoint: DEVICE_TYPE;
  loading: boolean;
}

const DashboardInfo: React.FC<DashboardInfoProps> = ({
  dashboardTokenInfo,
  supplyOverviewInfo,
  governenceOverviewInfo,
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
      governenceOverviewInfo={governenceOverviewInfo}
      breakpoint={breakpoint}
      loading={loading}
    />
  </DashboardInfoWrapper>
);

export default DashboardInfo;

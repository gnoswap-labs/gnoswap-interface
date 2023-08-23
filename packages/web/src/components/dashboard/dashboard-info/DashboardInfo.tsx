import { DashboardInfoWrapper } from "./DashboardInfo.styles";
import DashboardInfoTitle from "@components/dashboard/dashboard-info-title/DashboardInfoTitle";
import DashboardOverview from "../dashboard-overview/DashboardOverview";
import {
  DashboardTokenInfo,
  GovernenceOverviewInfo,
  SupplyOverviewInfo,
} from "@containers/dashboard-info-container/DashboardInfoContainer";
import { DEVICE_TYPE } from "@styles/media";

interface DashboardInfoProps {
  dashboardTokenInfo: DashboardTokenInfo;
  supplyOverviewInfo: SupplyOverviewInfo;
  governenceOverviewInfo: GovernenceOverviewInfo;
  breakpoint: DEVICE_TYPE;
}

const DashboardInfo: React.FC<DashboardInfoProps> = ({
  dashboardTokenInfo,
  supplyOverviewInfo,
  governenceOverviewInfo,
  breakpoint,
}) => (
  <DashboardInfoWrapper>
    <DashboardInfoTitle
      dashboardTokenInfo={dashboardTokenInfo}
      breakpoint={breakpoint}
    />
    <DashboardOverview
      supplyOverviewInfo={supplyOverviewInfo}
      governenceOverviewInfo={governenceOverviewInfo}
      breakpoint={breakpoint}
    />
  </DashboardInfoWrapper>
);

export default DashboardInfo;

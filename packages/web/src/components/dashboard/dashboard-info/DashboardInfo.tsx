import { DashboardInfoWrapper } from "./DashboardInfo.styles";
import DashboardInfoTitle from "@components/dashboard/dashboard-info-title/DashboardInfoTitle";
import DashboardOverview from "../dashboard-overview/DashboardOverview";
import {
  DashboardTokenInfo,
  GovernenceOverviewInfo,
  SupplyOverviewInfo,
} from "@containers/dashboard-info-container/DashboardInfoContainer";

interface DashboardInfoProps {
  dashboardTokenInfo: DashboardTokenInfo;
  supplyOverviewInfo: SupplyOverviewInfo;
  governenceOverviewInfo: GovernenceOverviewInfo;
  windowSize: number;
}

const DashboardInfo: React.FC<DashboardInfoProps> = ({
  dashboardTokenInfo,
  supplyOverviewInfo,
  governenceOverviewInfo,
  windowSize,
}) => (
  <DashboardInfoWrapper>
    <DashboardInfoTitle
      dashboardTokenInfo={dashboardTokenInfo}
      windowSize={windowSize}
    />
    <DashboardOverview
      supplyOverviewInfo={supplyOverviewInfo}
      governenceOverviewInfo={governenceOverviewInfo}
      windowSize={windowSize}
    />
  </DashboardInfoWrapper>
);

export default DashboardInfo;

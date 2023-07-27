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
}

const DashboardInfo: React.FC<DashboardInfoProps> = ({
  dashboardTokenInfo,
  supplyOverviewInfo,
  governenceOverviewInfo,
}) => (
  <DashboardInfoWrapper>
    <DashboardInfoTitle dashboardTokenInfo={dashboardTokenInfo} />
    <DashboardOverview
      supplyOverviewInfo={supplyOverviewInfo}
      governenceOverviewInfo={governenceOverviewInfo}
    />
  </DashboardInfoWrapper>
);

export default DashboardInfo;

import {
  GovernenceOverviewInfo,
  SupplyOverviewInfo,
} from "@containers/dashboard-info-container/DashboardInfoContainer";
import GovernanceOverview from "../governance-overview/GovernanceOverview";
import SupplyOverview from "../supply-overview/SupplyOverview";
import {
  DashboardOverviewWrapper,
  OverviewDivider,
} from "./DashboardOverview.styles";

interface DashboardOverviewProps {
  supplyOverviewInfo: SupplyOverviewInfo;
  governenceOverviewInfo: GovernenceOverviewInfo;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  supplyOverviewInfo,
  governenceOverviewInfo,
}) => (
  <DashboardOverviewWrapper>
    <SupplyOverview supplyOverviewInfo={supplyOverviewInfo} />
    <OverviewDivider />
    <GovernanceOverview governenceOverviewInfo={governenceOverviewInfo} />
  </DashboardOverviewWrapper>
);

export default DashboardOverview;

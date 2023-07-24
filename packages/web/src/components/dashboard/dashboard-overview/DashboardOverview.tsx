import GovernanceOverview from "../governance-overview/GovernanceOverview";
import SupplyOverview from "../supply-overview/SupplyOverview";
import {
  DashboardOverviewWrapper,
  OverviewDivider,
} from "./DashboardOverview.styles";

const DashboardOverview = ({}) => (
  <DashboardOverviewWrapper>
    <SupplyOverview />
    <OverviewDivider />
    <GovernanceOverview />
  </DashboardOverviewWrapper>
);

export default DashboardOverview;

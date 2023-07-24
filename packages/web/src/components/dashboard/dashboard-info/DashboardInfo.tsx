import { DashboardInfoWrapper } from "./DashboardInfo.styles";
import DashboardInfoTitle from "@components/dashboard/dashboard-info-title/DashboardInfoTitle";
import DashboardOverview from "../dashboard-overview/DashboardOverview";

const DashboardInfo = ({}) => (
  <DashboardInfoWrapper>
    <DashboardInfoTitle />
    <DashboardOverview />
  </DashboardInfoWrapper>
);

export default DashboardInfo;

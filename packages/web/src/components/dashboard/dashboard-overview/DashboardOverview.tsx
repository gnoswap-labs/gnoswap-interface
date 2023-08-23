import {
  GovernenceOverviewInfo,
  SupplyOverviewInfo,
} from "@containers/dashboard-info-container/DashboardInfoContainer";
import { DEVICE_TYPE } from "@styles/media";
import GovernanceOverview from "../governance-overview/GovernanceOverview";
import SupplyOverview from "../supply-overview/SupplyOverview";
import {
  DashboardOverviewWrapper,
  OverviewDivider,
  MobileDivider,
} from "./DashboardOverview.styles";

interface DashboardOverviewProps {
  supplyOverviewInfo: SupplyOverviewInfo;
  governenceOverviewInfo: GovernenceOverviewInfo;
  breakpoint: DEVICE_TYPE;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  supplyOverviewInfo,
  governenceOverviewInfo,
  breakpoint,
}) => (
  <DashboardOverviewWrapper>
    {breakpoint === DEVICE_TYPE.MOBILE && <MobileDivider />}
    <SupplyOverview supplyOverviewInfo={supplyOverviewInfo} />
    {breakpoint !== DEVICE_TYPE.MOBILE ? (
      <OverviewDivider />
    ) : (
      <MobileDivider />
    )}
    <GovernanceOverview governenceOverviewInfo={governenceOverviewInfo} />
  </DashboardOverviewWrapper>
);

export default DashboardOverview;

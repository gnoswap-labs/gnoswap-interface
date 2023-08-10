import {
  GovernenceOverviewInfo,
  SupplyOverviewInfo,
} from "@containers/dashboard-info-container/DashboardInfoContainer";
import { DeviceSize } from "@styles/media";
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
  windowSize: number;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  supplyOverviewInfo,
  governenceOverviewInfo,
  windowSize,
}) => (
  <DashboardOverviewWrapper>
    {windowSize <= DeviceSize.mobile && (
      <MobileDivider>
        <div className="divider" />
      </MobileDivider>
    )}
    <SupplyOverview supplyOverviewInfo={supplyOverviewInfo} />
    {windowSize > DeviceSize.mobile ? (
      <OverviewDivider />
    ) : (
      <MobileDivider>
        <div className="divider" />
      </MobileDivider>
    )}
    <GovernanceOverview governenceOverviewInfo={governenceOverviewInfo} />
  </DashboardOverviewWrapper>
);

export default DashboardOverview;

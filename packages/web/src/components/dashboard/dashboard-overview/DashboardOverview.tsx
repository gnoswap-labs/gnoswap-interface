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
  loading: boolean;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  supplyOverviewInfo,
  governenceOverviewInfo,
  breakpoint,
  loading,
}) => (
  <DashboardOverviewWrapper>
    {breakpoint === DEVICE_TYPE.MOBILE && <MobileDivider />}
    <SupplyOverview supplyOverviewInfo={supplyOverviewInfo} loading={loading}/>
    {breakpoint !== DEVICE_TYPE.MOBILE ? (
      <OverviewDivider />
    ) : (
      <MobileDivider />
    )}
    <GovernanceOverview governenceOverviewInfo={governenceOverviewInfo} loading={loading}/>
  </DashboardOverviewWrapper>
);

export default DashboardOverview;
